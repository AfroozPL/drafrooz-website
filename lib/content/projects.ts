// Project portfolio content — sourced from
// "AI Projects Portfolio — Applied AI, Research and Industry Engagement.md".
// Keep claims in line with that document; it is the source of truth.

export type LeverKey = "decisions" | "efficiency" | "strategy" | "experience" | "responsible";

export const levers: { key: LeverKey; name: string; body: string }[] = [
  {
    key: "decisions",
    name: "Better decisions",
    body: "Data-driven selection, forecasting and risk flags replaced fragmented judgement.",
  },
  {
    key: "efficiency",
    name: "Process efficiency",
    body: "Repetitive work automated end to end, freeing staff for higher-value tasks.",
  },
  {
    key: "strategy",
    name: "Strategic planning",
    body: "Opportunities sequenced by dependency, cost and readiness into investable plans.",
  },
  {
    key: "experience",
    name: "Customer experience",
    body: "Faster, consistent, 24/7 responses for customers, students and stakeholders.",
  },
  {
    key: "responsible",
    name: "Responsible adoption",
    body: "Grounding, human oversight and policy guardrails built in from the start.",
  },
];

export type Project = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  role: string;
  when?: string;
  summary: string;
  ai: string[];
  outcomes: string[];
  levers: LeverKey[];
  metric?: { value: string; label: string };
};

/** Industry, consultancy and applied research projects (excluding the flagship). */
export const projects: Project[] = [
  {
    slug: "ema-beauty",
    title: "AI-built brand and booking platform",
    client: "Ema Beauty · Vienna, Austria",
    sector: "Beauty & wellness SME",
    role: "Designer & developer",
    summary:
      "Turned a manual, phone-based booking process into an automated, self-service digital business — brand, website and booking engine.",
    ai: [
      "AI-assisted brand identity and hero imagery",
      "Design system generated from the brand guide, verified to WCAG AA",
      "Bilingual German/English site with local-search structured data",
    ],
    outcomes: [
      "Bookings run 24/7 without staff time",
      "Automatic 24-hour reminders and self-service reschedule links cut no-shows and admin",
      "AI compressed agency-scale design, copy and engineering into one consultant",
    ],
    levers: ["efficiency", "experience"],
    metric: { value: "24/7", label: "automated booking" },
  },
  {
    slug: "theme-park-roadmap",
    title: "Theme park AI opportunity roadmap",
    client: "Coast Entertainment Holdings (Dreamworld)",
    sector: "Tourism & entertainment",
    role: "Strategic adviser",
    when: "2026",
    summary:
      "Turned a list of 21 AI opportunities into a sequenced, investable 12-month plan — ordered by constraint, not theme.",
    ai: [
      "Review intelligence, staff-productivity AI and guest chatbots",
      "Segmented attendance forecasting as the keystone data asset",
      "Anomaly detection recommended for ride maintenance",
    ],
    outcomes: [
      "21 opportunities prioritised into a year-one plan",
      "One keystone forecast feeding rostering, F&B, procurement, parking and energy",
      "Candid technical advice on what the data could and couldn't support",
    ],
    levers: ["strategy", "decisions"],
    metric: { value: "21", label: "opportunities sequenced" },
  },
  {
    slug: "ai-front-desk",
    title: "AI Front Desk & Quote and Proposal Engine",
    client: "Gold Coast Chamber of Commerce",
    sector: "Small business",
    role: "Designer & presenter",
    summary:
      "Designed and presented practical AI toolkits showing small businesses how to reclaim the hours lost to repetitive work.",
    ai: [
      "Grounded enquiry assistant built from a four-prompt method",
      "Agent that turns enquiries or voice notes into a scoped proposal and GST-inclusive quote",
      "Reusable system prompts, templates and go-live checklist",
    ],
    outcomes: [
      "Demonstrated on a business with a 3 h 40 min median enquiry response",
      "Templates any business can adapt the same day",
      "67 attendee AI challenges synthesised into six themes for follow-up",
    ],
    levers: ["efficiency", "experience"],
    metric: { value: "~11 h", label: "a week lost to repetitive work, targeted" },
  },
  {
    slug: "ai-think-tank",
    title: "AI Think Tank",
    client: "Bond Business School · five Gold Coast enterprises",
    sector: "Cross-industry",
    role: "Convenor",
    when: "2026",
    summary:
      "An executive forum linking Bond to the region's largest AI adopters across entertainment, local government, health and aviation.",
    ai: [
      "Executive AI strategy forum",
      "Shared agenda on trustworthy AI adoption ahead of Brisbane 2032",
    ],
    outcomes: [
      "Senior leaders from five major regional enterprises at the table",
      "Foundation for a multi-partner research programme",
    ],
    levers: ["strategy"],
    metric: { value: "5", label: "enterprise partners" },
  },
  {
    slug: "bond-india",
    title: "Aarambh Studio & Sahaay co-pilot",
    client: "Bond University · India operations",
    sector: "Education & entrepreneurship",
    role: "Designer & builder",
    summary:
      "A multi-agent venture-planning studio and a secure recruitment co-pilot connected to staff inboxes and calendars.",
    ai: [
      "Multi-agent system with decision gates for market, compliance and launch",
      "OAuth-connected co-pilot across Gmail, Outlook and calendar",
    ],
    outcomes: [
      "Live venture-planning demo for non-technical audiences",
      "Faster, more consistent prospective-student follow-up",
    ],
    levers: ["experience", "efficiency"],
    metric: { value: "2", label: "AI systems deployed" },
  },
  {
    slug: "grounding-brief",
    title: "Generative AI grounding & RAG brief",
    client: "Universities Australia",
    sector: "Higher education policy",
    role: "Expert adviser",
    when: "2026",
    summary:
      "Briefed the sector on how generative AI grounding and retrieval-augmented generation are used responsibly in teaching.",
    ai: ["Retrieval-augmented generation (RAG) analysis", "Grounding practice in classroom use"],
    outcomes: ["Evidence base for sector-level licensing discussions"],
    levers: ["responsible", "strategy"],
  },
  {
    slug: "ed-risk",
    title: "Predicting risk in emergency departments",
    client: "Bond HSM · Metro North data",
    sector: "Healthcare",
    role: "Co-author",
    summary:
      "Natural language processing on nurse triage notes flags patients likely to leave before being seen or to need crisis stabilisation.",
    ai: ["NLP on free-text triage notes", "Logistic regression on 428,422 ED presentations"],
    outcomes: [
      "ROC-AUC 0.872 for leave-before-seen",
      "ROC-AUC 0.91 for crisis stabilisation admission",
      "Underpins an ED resource-planning grant idea with Gold Coast Health",
    ],
    levers: ["decisions"],
    metric: { value: "428k", label: "ED records modelled" },
  },
  {
    slug: "iso-auditing",
    title: "Generative AI for ISO auditing",
    client: "Industry auditors",
    sector: "Quality management",
    role: "Co-author",
    when: "2025–2026",
    summary:
      "Studied how auditors adopt generative AI — where it automates audit work and which oversight guardrails keep it trustworthy.",
    ai: ["GenAI adoption study (TAM, sociotechnical systems)"],
    outcomes: ["Audit automation with oversight guardrails", "Published in The TQM Journal, 2026"],
    levers: ["responsible", "efficiency"],
  },
  {
    slug: "edusign",
    title: "EduSign AI",
    client: "CSIRO ON Prime / ON Translate",
    sector: "Accessibility",
    role: "Team member",
    when: "2024–present",
    summary:
      "Computer vision and machine learning that give learners real-time feedback on Auslan signing, with a commercial pathway.",
    ai: ["Computer vision", "Machine learning", "Action Design Science"],
    outcomes: ["Real-time Auslan feedback", "Pathway from TRL 2 to TRL 5"],
    levers: ["experience"],
  },
  {
    slug: "remote-monitoring",
    title: "Remote patient monitoring study",
    client: "Western Health",
    sector: "Healthcare",
    role: "Researcher",
    summary:
      "Showed how remote monitoring changes health literacy and the clinician–patient relationship, informing the design of digital at-home care.",
    ai: ["Digital health evaluation"],
    outcomes: ["Published in Technologies, 2025"],
    levers: ["experience"],
  },
];

/** AI tools and products built and put into use. */
export const toolsBuilt = [
  { name: "HITH AI decision tool", users: "Western Health managers & clinicians", does: "Supports HITH patient selection and allocation", stack: ["Machine learning", "Predictive modelling"] },
  { name: "Ema Beauty booking platform", users: "Studio clients & owner", does: "Bilingual booking, reminders, self-service changes", stack: ["Next.js", "Google Calendar API", "Apps Script"] },
  { name: "AI Front Desk & Quote Engine", users: "Small-business owners", does: "Grounded enquiry replies; quotes from rough notes", stack: ["System prompts", "Knowledge packs", "Agents"] },
  { name: "Aarambh Studio", users: "Bond India audiences", does: "Multi-agent venture planning with decision gates", stack: ["Multi-agent orchestration"] },
  { name: "Sahaay co-pilot", users: "Recruitment staff", does: "Inbox- and calendar-aware recruitment support", stack: ["Next.js", "Google & Microsoft OAuth"] },
  { name: "Pitch Bot", users: "Health × Business Learning Lab", does: "Answers stakeholder questions on a proposal, live", stack: ["Claude", "OpenRouter", "Vercel"] },
  { name: "Ask ENAI", users: "Prospective students", does: "Grounded programme adviser for Enterprise AI", stack: ["Knowledge-grounded prompts"] },
  { name: "Research website & voice agent", users: "Bond academic", does: "Database-backed site with AI activities and a voice agent", stack: ["Next.js", "Supabase", "Voice AI"] },
  { name: "Scholarly-voice-editor", users: "Academic authors", does: "Reference checking for AI-assisted drafts", stack: ["Claude Code skill", "Python"] },
  { name: "Focus Timer & Bull Dash", users: "Open Day visitors", does: "Study app with AI coach; game built live", stack: ["Anthropic API"] },
];

/** Headline figures for the projects hero — all from the portfolio document. */
export const portfolioStats = [
  { value: 231795, prefix: "$", label: "Western Health flagship project" },
  { value: 10, suffix: "+", label: "AI tools built & deployed" },
  { value: 31, label: "Peer-reviewed works" },
  { value: 15, suffix: "%", label: "At-home care capacity increase informed" },
];

export const consultingMethod = [
  { title: "Start from the decision", body: "Begin with the decision or bottleneck — not the technology." },
  { title: "Choose the simplest technique", body: "Pick the least complex AI approach that actually moves the needle." },
  { title: "Build the data asset once", body: "Create a foundational data asset and reuse it across use cases." },
  { title: "State limits plainly", body: "Be candid about what AI and the data can and can't support." },
];

/** Western Health flagship case study. */
export const westernHealth = {
  title: "Western at Home — AI decision tool for Hospital in the Home",
  client: "Western Health, Victoria",
  role: "Chief Investigator",
  when: "2023–2025",
  funding: "$231,795",
  partner: "Victoria University with Western Health",
  problem:
    "Western Health runs four acute hospitals with more than 11,000 staff. Its Hospital in the Home (HITH) care was split across 10 programs in three divisions, each with its own governance, staffing and referral rules. That fragmentation made admission decisions slow and inconsistent — and limited how much acute demand could move out of hospital beds.",
  divisions: [
    "Chronic & Complex Care",
    "Aged, Cancer & Continuing Care",
    "Women & Children",
  ],
  steps: [
    { title: "Map the status quo", body: "33 interviews, meetings and focus groups with 25 staff — from divisional directors to nurse unit managers.", tag: "Phase 1 · ethics-approved" },
    { title: "Model governance", body: "Every program modelled with a tailored St Gallen framework aligned to Western Health's Best Care quality framework.", tag: "Process modelling" },
    { title: "Consolidate referral pathways", body: "13 internal and 8 external referral pathways consolidated into a single referral matrix.", tag: "21 → 1" },
    { title: "Benchmark six health districts", body: "Western, Northern, Barwon, Alfred, Gold Coast and Northern Sydney — distilled into a five-element HITH management framework.", tag: "National benchmark" },
    { title: "Build the AI decision tool", body: "Machine learning and predictive modelling on this evidence base to support HITH patient selection and service allocation.", tag: "ML · predictive modelling" },
  ],
  impact: [
    { title: "Decision quality", body: "Structured, data-driven HITH selection replaced program-by-program judgement.", icon: "compass" as const },
    { title: "Capacity", body: "Findings informed managerial decisions that expanded at-home care capacity by 15%.", icon: "pulse" as const },
    { title: "Process efficiency", body: "A single referral and governance view removed duplicated pathways across divisions.", icon: "cog" as const },
    { title: "Strategy", body: "Gave senior leadership an evidence base on whether to amalgamate separate HITH services.", icon: "spark" as const },
  ],
  outputs: [
    "Phase 1 report to Western Health leadership (2023)",
    "Exploring the Management Models and Strategies for Hospital in the Home Initiatives — Technologies (Q1), 2025",
    "Proposing a Framework to Model Hospital in the Home Programs — Journal of Electrical Systems, 2024",
    "Lessons Learned from Governance and Management of Virtual Hospital Initiatives — Nursing Reports, 2025",
  ],
};

/** Dreamworld roadmap — how the 21 opportunities were sequenced. */
export const roadmapSegments = [
  { count: 4, label: "Start immediately", body: "Review intelligence, staff productivity, guest chatbots, back-office automation", color: "bg-vivid-mint" },
  { count: 1, label: "Keystone", body: "Segmented attendance forecast", color: "bg-electric-blue" },
  { count: 6, label: "Unlocked by keystone", body: "Cheap once the forecast exists", color: "bg-deep-violet" },
  { count: 10, label: "Gated", body: "Need sensors, integration or capital", color: "bg-white/20" },
];
