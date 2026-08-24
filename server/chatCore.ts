import { PROPOSAL_CONTEXT } from "../src/data/proposalContext.ts";
import {
  isOffTopicMessage,
  OFF_TOPIC_REPLY,
} from "../src/chat/topicGuard.ts";

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatResult =
  | { ok: true; reply: string; provider: string }
  | { ok: false; status: number; error: string; message: string };

export async function createChatReply(
  messages: ChatMessage[] | undefined,
  apiKey: string | undefined
): Promise<ChatResult> {
  const key = apiKey?.trim();
  if (!key) {
    return {
      ok: false,
      status: 503,
      error: "missing_api_key",
      message:
        "Add GROQ_API_KEY in Vercel Environment Variables (or local .env). Get a free key at https://console.groq.com/keys",
    };
  }

  const history = (messages ?? [])
    .filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
    )
    .slice(-12);

  if (!history.length) {
    return {
      ok: false,
      status: 400,
      error: "bad_request",
      message: "Message is required",
    };
  }

  const latestUser = [...history].reverse().find((message) => message.role === "user");
  if (latestUser && isOffTopicMessage(latestUser.content)) {
    return { ok: true, reply: OFF_TOPIC_REPLY, provider: "guard" };
  }

  try {
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
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
      return {
        ok: false,
        status: groqResponse.status,
        error: "groq_error",
        message: data.error?.message ?? "Groq request failed",
      };
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return {
        ok: false,
        status: 502,
        error: "empty_response",
        message: "Empty response from model",
      };
    }

    return { ok: true, reply, provider: "groq" };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: "server_error",
      message: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}
