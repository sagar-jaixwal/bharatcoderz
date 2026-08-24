export type NavItem = {
  id: string;
  label: string;
  path: string;
};

export type ContentBlock = {
  title: string;
  body: string;
  points?: string[];
};

export type PageContent = {
  path: string;
  title: string;
  eyebrow: string;
  intro: string;
  loadingLabel: string;
  sections: ContentBlock[];
};

export const BRAND = {
  name: "BharatCoderz",
  tagline: "Software & AI Partner for Global Businesses",
  badgeNote: "Built around your business",
  headline: ["We Build Technology", "Around Your Business"],
  subtitle:
    "Custom software, AI automation, and digital products that help global businesses work better — without the jargon.",
  ctaPrimary: "Let's Have a Chat",
  ctaSecondary: "Explore services",
  footerLine: "Software Development | AI Solutions | Automation",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { id: "services", label: "Services", path: "/services" },
  { id: "approach", label: "How We Work", path: "/how-we-work" },
  { id: "company", label: "Company", path: "/company" },
  { id: "insights", label: "Insights", path: "/insights" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export const PAGES: Record<string, PageContent> = {
  services: {
    path: "/services",
    title: "Services",
    eyebrow: "What we do",
    intro:
      "We build technology around your business — practical software, useful AI, and digital products that are reliable and easy to grow.",
    loadingLabel: "Mapping your service pathways…",
    sections: [
      {
        title: "Custom Software",
        body: "Every business is different, so we build software around your actual requirements — something practical, reliable, and ready to grow with you.",
        points: [
          "Customer management systems",
          "Booking or service platforms",
          "Internal business software",
          "CRM or dashboards",
          "SaaS products",
          "E-commerce platforms",
          "Custom APIs and backends",
        ],
      },
      {
        title: "AI & Automation",
        body: "AI should solve a real business problem — not be added because it's popular. We connect intelligence to the work your team already does.",
        points: [
          "AI customer support",
          "AI assistants for your team",
          "Document and data processing",
          "Workflow automation",
          "Email and communication automation",
          "AI-powered business tools",
          "Connecting AI with your existing software",
        ],
      },
      {
        title: "Websites & Mobile Apps",
        body: "From a simple customer-facing website to a complete web or mobile application, we take care of the technology from idea through to launch.",
        points: [
          "Customer-facing websites",
          "Web applications",
          "Mobile applications",
          "Idea → design → build → launch",
        ],
      },
    ],
  },
  approach: {
    path: "/how-we-work",
    title: "How We Work",
    eyebrow: "A straightforward process",
    intro:
      "We keep delivery simple: listen first, choose what actually makes sense, build with you involved, and stay after launch.",
    loadingLabel: "Calibrating delivery systems…",
    sections: [
      {
        title: "First, we listen",
        body: "Before talking about technology, we want to understand your business.",
        points: [
          "What are you trying to achieve?",
          "What's currently difficult?",
          "What do your customers need?",
          "What would actually make your life easier?",
        ],
      },
      {
        title: "Then, we work out the right solution",
        body: "Sometimes you need a custom platform. Sometimes an existing tool is enough. Sometimes automation or AI makes the biggest difference. We'll tell you what we genuinely think makes sense — and we don't build unnecessary features just to make a project bigger.",
      },
      {
        title: "Then, we build",
        body: "Once we agree on the direction, our team handles development, testing and deployment while keeping you involved. You'll always know what's being worked on and what's coming next.",
      },
      {
        title: "And after launch, we're still here",
        body: "Technology doesn't stop at launch. As your business grows, we can continue improving the system, adding features, handling maintenance, and helping you get more from what you've built.",
      },
    ],
  },
  company: {
    path: "/company",
    title: "Company",
    eyebrow: "About BharatCoderz",
    intro:
      "We're a software and AI services company — but we prefer to work as a technology partner for global businesses that want technology to do things better.",
    loadingLabel: "Syncing partner intelligence…",
    sections: [
      {
        title: "Why global businesses work with us",
        body: "Working with a global technology partner only works when communication and trust are taken seriously. That's why we focus heavily on clarity, honesty, and long-term thinking.",
        points: [
          "Clear communication — no complicated technical language unless you need it",
          "Honest advice — we'll tell you when something is a good idea, and when it isn't",
          "Reliable delivery — realistic expectations rather than promising everything on day one",
          "Long-term thinking — systems that grow with your business",
          "A real working relationship — you're not just a ticket number",
        ],
      },
      {
        title: "A better way to build",
        body: "The best software projects happen when business and technology teams work closely together. You know your business. We know technology. Together, we build something that actually works for the people using it.",
      },
    ],
  },
  insights: {
    path: "/insights",
    title: "Insights",
    eyebrow: "Ideas that help you decide",
    intro:
      "Practical thinking on software, AI, and automation — written for business owners who want clarity, not jargon.",
    loadingLabel: "Compiling insight nodes…",
    sections: [
      {
        title: "AI should remove repetitive work",
        body: "The best AI projects start with a bottleneck: support queues, document handling, or manual follow-ups. If it doesn't save your team time, it isn't ready yet.",
      },
      {
        title: "Custom software vs existing tools",
        body: "Sometimes a proven tool is enough. Sometimes your process is the product. We'll help you choose based on how your business actually operates — not on what's trending.",
      },
      {
        title: "Build for growth, not replacement",
        body: "Short-term builds create long-term cost. We design systems that can expand with new features, new teams, and new markets without starting over.",
      },
    ],
  },
  contact: {
    path: "/contact",
    title: "Contact",
    eyebrow: "Let's have a chat",
    intro:
      "Whether you already have a detailed project in mind or you simply have an idea and aren't sure where to start — that's completely fine.",
    loadingLabel: "Opening secure channel…",
    sections: [
      {
        title: "Tell us what you're trying to achieve",
        body: "We'll listen, ask the right questions, and help you work out what the next step should be. No pressure. No unnecessary technical jargon. Just a straightforward conversation about your business and how technology can help.",
        points: [
          "Software Development",
          "AI Solutions",
          "Automation",
          "Helping global businesses build, improve and grow with technology",
        ],
      },
    ],
  },
};
