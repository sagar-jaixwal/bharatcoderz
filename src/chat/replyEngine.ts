import {
  CHAT_KNOWLEDGE,
  type KnowledgeEntry,
} from "../data/chatKnowledge";
import { isOffTopicMessage, OFF_TOPIC_REPLY } from "./topicGuard";

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s&/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreEntry(query: string, entry: KnowledgeEntry) {
  const q = normalize(query);
  if (!q) return 0;

  let score = 0;
  for (const keyword of entry.keywords) {
    const key = normalize(keyword);
    if (!key) continue;
    if (q.includes(key)) score += key.includes(" ") ? 4 : 2;
    else {
      const parts = key.split(" ");
      const hits = parts.filter((part) => part.length > 2 && q.includes(part));
      score += hits.length;
    }
  }

  for (const hint of entry.questionHints) {
    const hintNorm = normalize(hint);
    const overlap = hintNorm
      .split(" ")
      .filter((word) => word.length > 3 && q.includes(word)).length;
    score += overlap * 0.8;
  }

  return score;
}

export function getChatReply(userMessage: string): string {
  if (isOffTopicMessage(userMessage)) return OFF_TOPIC_REPLY;

  const ranked = CHAT_KNOWLEDGE.map((entry) => ({
    entry,
    score: scoreEntry(userMessage, entry),
  })).sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 2) return OFF_TOPIC_REPLY;
  return best.entry.answer;
}

export async function getChatReplyAsync(userMessage: string, delayMs = 700) {
  await new Promise((resolve) => window.setTimeout(resolve, delayMs));
  return getChatReply(userMessage);
}
