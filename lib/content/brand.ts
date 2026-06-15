// Brand content sourced from `Dr_Afrooz_Purarjomand_Brand_Guide.pdf` v1.0 / 2026.

export const brand = {
  name: "Dr. Afrooz Purarjomand",
  title: "AI/ML & GenAI Specialist · Assistant Professor",
  institution: "Bond University · Faculty of Society & Design",
  pillars: "Enterprise AI Strategy · Healthcare Innovation · IS & Business Analytics",
  tagline: "Where Research Meets Reality.",
  mission:
    "To democratise evidence-based AI adoption for enterprises and healthcare systems — bridging the gap between cutting-edge AI research and real-world implementation through rigorous academic inquiry and hands-on consultancy.",
  vision:
    "To be a globally recognised authority on enterprise AI strategy — where academic rigour meets industry impact. A future where AI literacy is the default, not the exception, across healthcare, business analytics, and data science.",
  usp:
    "The only AI academic-consultant in the Asia-Pacific who integrates peer-reviewed GenAI research, enterprise strategy, and healthcare data science in one cohesive practice.",
  positioning:
    "At the intersection of academic authority and enterprise pragmatism — where rigorous AI/ML research translates directly into scalable organisational strategies.",
  values: [
    {
      name: "Rigour",
      tone: "blue" as const,
      description:
        "Evidence-based thinking in all research, teaching, and consulting engagements.",
    },
    {
      name: "Impact",
      tone: "violet" as const,
      description:
        "Every output — paper, class, or advisory — drives measurable real-world value.",
    },
    {
      name: "Accessibility",
      tone: "mint" as const,
      description:
        "Translating complex AI/ML concepts into actionable strategies for all audiences.",
    },
    {
      name: "Integrity",
      tone: "amber" as const,
      description:
        "Transparent, ethical, and responsible AI advocacy across all platforms.",
    },
  ],
  keyMessages: [
    "AI is not a replacement — it is a multiplier for human expertise when deployed strategically.",
    "Responsible AI adoption requires academic rigour, not just technical deployment.",
    "The competitive advantage of tomorrow is built on AI literacy today.",
    "Healthcare data science is one of the most consequential frontiers for AI in the decade ahead.",
  ],
};

export const fallbackServices = [
  {
    slug: "discovery-call",
    name: "Discovery Call",
    tagline: "Diagnose your AI opportunity in 30 minutes.",
    description:
      "A focused conversation to identify the highest-leverage AI initiatives in your organisation, surface hidden risks, and define what success looks like.",
    duration_minutes: 30,
    price_cents: 15000,
    currency: "USD",
    bullets: [
      "30-minute video call",
      "Diagnostic of current AI maturity",
      "Top 3 high-leverage opportunities",
      "Recording + written summary",
    ],
    tone: "blue" as const,
  },
  {
    slug: "strategy-session",
    name: "Strategy Session",
    tagline: "Build a research-grounded AI roadmap.",
    description:
      "A deep working session for leadership teams ready to translate AI ambition into a concrete, evidence-based roadmap aligned with business priorities.",
    duration_minutes: 60,
    price_cents: 35000,
    currency: "USD",
    bullets: [
      "60-minute strategic session",
      "Roadmap aligned to business KPIs",
      "Vendor / build-vs-buy guidance",
      "Follow-up briefing document",
    ],
    tone: "violet" as const,
    highlight: true,
  },
  {
    slug: "deep-dive",
    name: "Deep Dive",
    tagline: "Hands-on advisory for complex AI programmes.",
    description:
      "An extended engagement for enterprise and healthcare teams tackling large-scale GenAI or data science initiatives. Combines research review, technical advisory, and stakeholder alignment.",
    duration_minutes: 90,
    price_cents: 60000,
    currency: "USD",
    bullets: [
      "90-minute working session",
      "Pre-session research briefing",
      "Stakeholder alignment framework",
      "30-day async follow-up",
    ],
    tone: "mint" as const,
  },
];
