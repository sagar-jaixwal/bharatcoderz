import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { PROPOSAL_CONTEXT } from "../src/data/proposalContext.ts";
import {
  isOffTopicMessage,
  OFF_TOPIC_REPLY,
} from "../src/chat/topicGuard.ts";

type ChatRole = "system" | "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

async function readJsonBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(raw || "{}") as T;
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function handleChat(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    sendJson(res, 503, {
      error: "missing_api_key",
      message:
        "Add a free GROQ_API_KEY to your .env file. Get one at https://console.groq.com/keys",
    });
    return;
  }

  try {
    const body = await readJsonBody<{ messages?: ChatMessage[] }>(req);
    const history = (body.messages ?? [])
      .filter(
        (message) =>
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0
      )
      .slice(-12);

    if (!history.length) {
      sendJson(res, 400, { error: "Message is required" });
      return;
    }

    const latestUser = [...history].reverse().find((message) => message.role === "user");
    if (latestUser && isOffTopicMessage(latestUser.content)) {
      sendJson(res, 200, { reply: OFF_TOPIC_REPLY, provider: "guard" });
      return;
    }

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "groq/compound-mini",
          temperature: 0.4,
          max_tokens: 700,
          messages: [
            {
              role: "system",
              content: PROPOSAL_CONTEXT,
            },
            ...history,
          ],
        }),
      }
    );

    const data = (await groqResponse.json()) as {
      error?: { message?: string };
      choices?: { message?: { content?: string } }[];
    };

    if (!groqResponse.ok) {
      sendJson(res, groqResponse.status, {
        error: "groq_error",
        message: data.error?.message ?? "Groq request failed",
      });
      return;
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      sendJson(res, 502, { error: "Empty response from model" });
      return;
    }

    sendJson(res, 200, { reply, provider: "groq" });
  } catch (error) {
    sendJson(res, 500, {
      error: "server_error",
      message: error instanceof Error ? error.message : "Unexpected error",
    });
  }
}

function attachChatApi(
  middlewares: { use: (path: string, handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void }
) {
  middlewares.use("/api/chat", (req, res, next) => {
    void handleChat(req, res).catch(next);
  });
}

/** Dev/preview middleware that keeps GROQ_API_KEY on the server. */
export function groqChatPlugin(): Plugin {
  return {
    name: "groq-chat-api",
    configureServer(server) {
      attachChatApi(server.middlewares);
    },
    configurePreviewServer(server) {
      attachChatApi(server.middlewares);
    },
  };
}
