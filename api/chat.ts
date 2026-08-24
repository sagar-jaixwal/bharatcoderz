import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createChatReply, type ChatMessage } from "../server/chatCore.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = (typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body) as {
    messages?: ChatMessage[];
  };

  const result = await createChatReply(body.messages, process.env.GROQ_API_KEY);

  if (!result.ok) {
    res.status(result.status).json({
      error: result.error,
      message: result.message,
    });
    return;
  }

  res.status(200).json({ reply: result.reply, provider: result.provider });
}
