export type KnowledgeEntry = {
  id: string;
  keywords: string[];
  questionHints: string[];
  answer: string;
};

/** Knowledge grounded in the BharatCoderz company proposal PDF. */
export const CHAT_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "about",
    keywords: [
      "who",
      "about",
      "bharatcoderz",
      "bharat",
      "coderz",
      "company",
      "what do you do",
      "partner",
    ],
    questionHints: ["Who is BharatCoderz?", "What do you do?"],
    answer:
      "BharatCoderz is a software and AI services company — but we work as a technology partner, not just a development team. We help global businesses build new products, improve existing systems, and use AI to remove repetitive work. Our focus: understand how your business actually works, what’s slowing you down, and where technology can make a real difference. To connect with us, email info@bharatcoderz.com.",
  },
  {
    id: "custom-software",
    keywords: [
      "software",
      "custom",
      "crm",
      "dashboard",
      "saas",
      "ecommerce",
      "e-commerce",
      "api",
      "backend",
      "booking",
      "platform",
      "system",
    ],
    questionHints: ["Do you build custom software?", "Can you build a CRM?"],
    answer:
      "Yes. Every business is different, so we build software around your actual requirements — for example customer management systems, booking/service platforms, internal tools, CRMs or dashboards, SaaS products, e-commerce platforms, and custom APIs or backends. We aim for something practical, reliable, and easy to grow with your business.",
  },
  {
    id: "ai-automation",
    keywords: [
      "ai",
      "automation",
      "assistant",
      "chatbot",
      "support",
      "document",
      "workflow",
      "email",
      "automate",
      "intelligence",
    ],
    questionHints: ["Can you help with AI?", "What automation do you offer?"],
    answer:
      "We believe AI should solve a real business problem — not be added because it’s popular. We can help with AI customer support, team assistants, document and data processing, workflow automation, email/communication automation, AI-powered business tools, and connecting AI with your existing software. The goal is simple: save your team time and help your business operate better.",
  },
  {
    id: "apps",
    keywords: [
      "website",
      "websites",
      "mobile",
      "app",
      "apps",
      "web app",
      "application",
      "launch",
    ],
    questionHints: ["Do you build websites and apps?"],
    answer:
      "Yes. From a simple customer-facing website to a complete web or mobile application, we can take care of the technology from idea through to launch.",
  },
  {
    id: "process",
    keywords: [
      "process",
      "how",
      "work",
      "approach",
      "listen",
      "build",
      "delivery",
      "steps",
      "methodology",
    ],
    questionHints: ["How do you work?", "What’s your process?"],
    answer:
      "We keep the process straightforward:\n1) First, we listen — goals, blockers, customer needs, and what would make life easier.\n2) Then we work out the right solution — custom platform, existing tool, automation, or AI. We’ll tell you what genuinely makes sense, and we don’t build unnecessary features just to make a project bigger.\n3) Then we build — development, testing, and deployment while keeping you involved.\n4) After launch, we’re still here — improvements, new features, maintenance, and helping you get more from what you’ve built.",
  },
  {
    id: "why-global",
    keywords: [
      "global",
      "worldwide",
      "world",
      "international",
      "trust",
      "communication",
      "why",
      "choose",
      "partner",
      "honest",
      "reliable",
    ],
    questionHints: ["Why work with BharatCoderz?", "Do you work with global businesses?"],
    answer:
      "We know working with a global technology partner only works when communication and trust are taken seriously. That’s why we focus on clear communication (no jargon unless you need it), honest advice, reliable delivery with realistic expectations, long-term thinking, and a real working relationship — you’re not just a ticket number.",
  },
  {
    id: "contact",
    keywords: [
      "contact",
      "chat",
      "talk",
      "call",
      "email",
      "start",
      "quote",
      "price",
      "pricing",
      "cost",
      "hire",
      "project",
    ],
    questionHints: ["How do we get started?", "Can we have a chat?"],
    answer:
      "Let’s have a chat. Email us anytime at info@bharatcoderz.com — whether you already have a detailed project or just an idea and aren’t sure where to start. Tell us what you’re trying to achieve. We’ll listen, ask the right questions, and help you work out the next step. No pressure. No unnecessary jargon. You can also use the Contact page on this site.",
  },
  {
    id: "philosophy",
    keywords: [
      "philosophy",
      "believe",
      "better",
      "together",
      "business",
      "technology",
      "value",
    ],
    questionHints: ["What’s your approach to projects?"],
    answer:
      "We believe the best software projects happen when business and technology teams work closely together. You know your business. We know technology. Together, we can build something that actually works for the people using it.",
  },
];

export const CHAT_QUICK_PROMPTS = [
  "What does BharatCoderz do?",
  "Do you build custom software?",
  "Can you help with AI automation?",
  "How do you work?",
  "Why global businesses choose you?",
  "How do we get started?",
] as const;

export const CHAT_GREETING =
  "Hi — I’m the BharatCoderz AI assistant. I only answer questions about BharatCoderz: our services, how we work, and partnering with global businesses. To connect with the team anytime, email info@bharatcoderz.com — or ask me something below.";

export const CHAT_FALLBACK =
  "I can only help with BharatCoderz topics — our services, process, and how we partner with global businesses. Email the team at info@bharatcoderz.com, or visit Contact on this site.";
