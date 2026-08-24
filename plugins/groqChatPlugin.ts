import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { createChatReply, type ChatMessage } from "../server/chatCore.ts";

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

  try {
    const body = await readJsonBody<{ messages?: ChatMessage[] }>(req);
    const result = await createChatReply(body.messages, process.env.GROQ_API_KEY);

    if (!result.ok) {
      sendJson(res, result.status, {
        error: result.error,
        message: result.message,
      });
      return;
    }

    sendJson(res, 200, { reply: result.reply, provider: result.provider });
  } catch (error) {
    sendJson(res, 500, {
      error: "server_error",
      message: error instanceof Error ? error.message : "Unexpected error",
    });
  }
}

function attachChatApi(middlewares: {
  use: (
    path: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void
  ) => void;
}) {
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
