/** Fixed refusal when the user asks for anything outside BharatCoderz. */
export const OFF_TOPIC_REPLY =
  "I can only help with BharatCoderz — our services, how we work, and partnering with global businesses. I can’t write general code, tutorials, or handle unrelated requests.\n\nAsk me about custom software, AI & automation, websites/apps, our process, or how to get started. Or visit Contact for a chat with the team.";

const OFF_TOPIC_PATTERNS = [
  /\bhello\s*world\b/i,
  /\b(write|create|generate|give|show|make)\b.{0,40}\b(html|css|javascript|python|code|program|script|snippet)\b/i,
  /\b(code\s+for|html\s+code|source\s+code)\b/i,
  /\b(poem|joke|story|recipe|homework|essay|translate)\b/i,
  /\b(weather|stock|crypto|news)\b/i,
  /\b(act as|roleplay|jailbreak|ignore (previous|all) instructions)\b/i,
];

const COMPANY_PATTERNS = [
  /\bbharat\s*coderz\b/i,
  /\b(company|service|services|software|automation|partner|global|worldwide|world)\b/i,
  /\b(crm|saas|ecommerce|e-commerce|dashboard|api|website|websites|mobile\s*app|web\s*app)\b/i,
  /\b(ai|artificial intelligence|chatbot|workflow|process|how you work|get started|contact|quote|project|business)\b/i,
  /\b(listen|build|launch|maintenance|honest advice|communication)\b/i,
];

/**
 * Returns true when the message is clearly not about BharatCoderz.
 * Business/app/service questions stay allowed.
 */
export function isOffTopicMessage(message: string): boolean {
  const text = message.trim();
  if (!text) return true;

  const hitsOffTopic = OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(text));
  const hitsCompany = COMPANY_PATTERNS.some((pattern) => pattern.test(text));

  if (hitsOffTopic && !hitsCompany) return true;
  if (hitsOffTopic && /\b(html|css|javascript|python|code|hello\s*world)\b/i.test(text)) {
    // Explicit coding/tutorial asks are never answered, even if "business" appears vaguely.
    if (/\b(hello\s*world|html\s+code|write\s+code|create\s+html)\b/i.test(text)) {
      return true;
    }
  }

  // Very short generic asks with no company signal
  if (!hitsCompany && text.split(/\s+/).length <= 3 && !/\b(hi|hello|hey|thanks)\b/i.test(text)) {
    return true;
  }

  return false;
}
