// Practice areas, process, FAQ and readiness-check content for the
// marketing pages. Paid, bookable sessions still live in `brand.ts` /
// Supabase — these describe *what* Dr. Afrooz helps with.

export type IconName =
  | "compass"
  | "cog"
  | "chat"
  | "spark"
  | "shield"
  | "cap"
  | "pulse";

export type PracticeArea = {
  slug: string;
  icon: IconName;
  name: string;
  summary: string;
  headline: string;
  intro: string;
  deliverables: { title: string; body: string }[];
  process: { title: string; body: string }[];
  rightFor: string[];
  faqs: { q: string; a: string }[];
};

export const practiceAreas: PracticeArea[] = [
  {
    slug: "ai-strategy",
    icon: "compass",
    name: "AI strategy & roadmapping",
    summary:
      "Find where AI will genuinely pay off in your business, then sequence it into a roadmap your leadership team can back.",
    headline: "Know exactly where AI fits — and where it doesn't.",
    intro:
      "Most organisations don't lack AI ideas; they lack a way to choose between them. I assess your operations, data and goals, rank opportunities by value and feasibility, and turn the best ones into a practical, staged roadmap with clear measures of success.",
    deliverables: [
      { title: "AI opportunity assessment", body: "A structured review of processes, pain points and data to surface where AI can create measurable value." },
      { title: "Use-case prioritisation", body: "Every idea scored on business value, feasibility, risk and time-to-impact — so you start with the right one." },
      { title: "12-month AI roadmap", body: "A staged plan with owners, milestones and KPIs that connects AI work to business outcomes." },
      { title: "Build, buy or partner guidance", body: "Independent advice on tools, vendors and platforms — I don't sell software, so the advice is yours." },
      { title: "Business case & budget", body: "Costs, expected returns and risks laid out in terms your board and finance team will recognise." },
      { title: "Executive briefing", body: "A clear, jargon-free session to align leadership on priorities, risks and next steps." },
    ],
    process: [
      { title: "Discover", body: "Interviews, process review and a look at your data landscape." },
      { title: "Prioritise", body: "Score and shortlist use cases against value and feasibility." },
      { title: "Plan", body: "Build the roadmap, business case and success measures." },
      { title: "Align", body: "Present to leadership and agree the first move." },
    ],
    rightFor: [
      "Leadership teams under pressure to 'do something with AI'",
      "Businesses with many AI ideas and no way to choose",
      "Organisations preparing an AI budget or board paper",
    ],
    faqs: [
      { q: "How long does a strategy engagement take?", a: "Most roadmaps take three to six weeks depending on the size of the organisation and how many teams are involved. We agree scope and timing on the free strategy call." },
      { q: "Do we need clean data before we start?", a: "No. Part of the assessment is understanding the state of your data, and the roadmap includes whatever data groundwork the priority use cases need." },
    ],
  },
  {
    slug: "ai-implementation",
    icon: "cog",
    name: "AI implementation & integration",
    summary:
      "Move from pilot to production — AI integrated with the systems, data and people you already have.",
    headline: "From promising pilot to working system.",
    intro:
      "Plenty of AI pilots impress in a demo and never reach production. I help you design pilots with real success criteria, prepare the data, choose and oversee delivery partners, and plan the change management that makes adoption stick.",
    deliverables: [
      { title: "Pilot design", body: "A tightly scoped proof of value with agreed success metrics and a clear go / no-go decision." },
      { title: "Data readiness review", body: "Quality, access, privacy and pipeline checks so the model has what it needs to work." },
      { title: "Systems integration planning", body: "How AI connects with your CRM, ERP, EHR or document systems — without starting over." },
      { title: "Vendor & partner oversight", body: "Independent technical oversight of developers and vendors, so you get what you're paying for." },
      { title: "Change & adoption plan", body: "Training, communication and workflow changes that get people actually using the new tools." },
      { title: "Measurement after launch", body: "Tracking the outcomes that matter, then refining the system based on real use." },
    ],
    process: [
      { title: "Scope", body: "Pick the use case and define what success looks like." },
      { title: "Prepare", body: "Get data, systems and people ready." },
      { title: "Pilot", body: "Build and test with real users in a controlled setting." },
      { title: "Scale", body: "Roll out, measure and improve." },
    ],
    rightFor: [
      "Teams with a chosen use case that need to deliver it well",
      "Organisations whose pilots stall before production",
      "Businesses working with vendors who want independent oversight",
    ],
    faqs: [
      { q: "Do you write the code yourself?", a: "I lead design, oversight and evaluation, and work alongside your developers or a delivery partner for the build. That keeps the advice independent and the delivery scalable." },
      { q: "Can you work with our existing systems?", a: "Yes. We start with what you already have and integrate AI into it wherever that is practical, rather than replacing systems that work." },
    ],
  },
  {
    slug: "ai-advisory",
    icon: "chat",
    name: "AI consultation & advisory",
    summary:
      "An independent AI expert in your corner for the decisions that matter — on call when you need one.",
    headline: "Independent advice, without the sales pitch.",
    intro:
      "Vendors sell products; I give advice. Whether you need a second opinion on a proposal, a sounding board for leadership, or a fractional AI lead while you build internal capability, you get research-grounded guidance with no product to push.",
    deliverables: [
      { title: "Fractional AI advisor", body: "Ongoing access to senior AI expertise without hiring a full-time Head of AI." },
      { title: "Board & executive advisory", body: "Briefings and decision support on AI opportunities, investments and risks." },
      { title: "Vendor due diligence", body: "Separate genuine capability from marketing claims before you sign a contract." },
      { title: "Proposal & architecture review", body: "A critical review of AI project plans, budgets and technical designs." },
      { title: "AI office hours", body: "Regular sessions where your team brings questions and gets clear answers." },
      { title: "Research-backed insight", body: "Findings from current peer-reviewed research, translated into decisions you can act on." },
    ],
    process: [
      { title: "Listen", body: "Understand the decision and the context around it." },
      { title: "Analyse", body: "Review evidence, options and risks." },
      { title: "Advise", body: "A clear recommendation with the reasoning behind it." },
      { title: "Support", body: "Stay available as the decision plays out." },
    ],
    rightFor: [
      "Executives evaluating AI vendors or proposals",
      "Growing businesses not yet ready for a full-time AI hire",
      "Boards that need an independent view on AI risk and opportunity",
    ],
    faqs: [
      { q: "Can we book a single session?", a: "Yes. The Strategy Session and Deep Dive are one-off paid sessions you can book online. Ongoing advisory is arranged after a free strategy call." },
      { q: "Are you affiliated with any AI vendor?", a: "No. I don't resell software or take referral fees, so recommendations are based only on what suits your organisation." },
    ],
  },
  {
    slug: "generative-ai",
    icon: "spark",
    name: "Generative AI & automation",
    summary:
      "Assistants, copilots and workflow automation that save real hours — not just impress in a demo.",
    headline: "Put generative AI to work on the jobs that eat your week.",
    intro:
      "Generative AI is most valuable when it's pointed at a specific, repetitive job: drafting, summarising, searching documents, answering common questions. I help you find those jobs, design assistants that do them reliably, and put guardrails around them.",
    deliverables: [
      { title: "Workflow & automation mapping", body: "Identify the tasks where AI saves the most time with the least risk." },
      { title: "Knowledge assistants", body: "Assistants that answer questions from your own documents and policies, with sources." },
      { title: "Customer-facing chat & voice", body: "AI assistants that answer common questions and route enquiries — supporting your team, not replacing it." },
      { title: "Copilot & GPT rollout", body: "Configure tools like Microsoft Copilot or ChatGPT Enterprise for your workflows." },
      { title: "Prompt & evaluation frameworks", body: "Repeatable prompts and quality checks so outputs are consistent and trustworthy." },
      { title: "Guardrails & monitoring", body: "Controls for accuracy, privacy and tone, plus monitoring once live." },
    ],
    process: [
      { title: "Map", body: "Find the high-volume, rules-based tasks." },
      { title: "Design", body: "Shape the assistant, data sources and guardrails." },
      { title: "Test", body: "Evaluate output quality with real examples." },
      { title: "Launch", body: "Roll out, train staff and monitor." },
    ],
    rightFor: [
      "Teams drowning in documents, emails or repetitive admin",
      "Businesses wanting a safe, useful chatbot for customers",
      "Organisations rolling out Copilot or ChatGPT and wanting results",
    ],
    faqs: [
      { q: "Is our data safe with generative AI tools?", a: "It can be, with the right setup. I help you choose enterprise-grade configurations, keep sensitive data out of public models, and align with Australian privacy obligations." },
      { q: "Will AI replace our staff?", a: "The goal is to remove low-value work so your people can focus on the parts of their jobs that need human judgement. AI multiplies expertise; it doesn't replace it." },
    ],
  },
  {
    slug: "responsible-ai",
    icon: "shield",
    name: "AI governance & responsible AI",
    summary:
      "Policies, risk controls and compliance so you can adopt AI confidently — and explain it to anyone who asks.",
    headline: "Adopt AI with confidence, not crossed fingers.",
    intro:
      "Customers, regulators and staff increasingly want to know how you use AI. I help you put proportionate governance in place: clear policies, risk assessments and controls aligned with recognised frameworks such as Australia's AI Ethics Principles and ISO/IEC 42001.",
    deliverables: [
      { title: "AI use policy", body: "A practical policy that tells staff what's allowed, what isn't and why." },
      { title: "AI risk assessment", body: "Identify and rate risks across privacy, bias, accuracy, security and reputation." },
      { title: "Governance framework", body: "Roles, approvals and review points sized to your organisation." },
      { title: "Privacy & data review", body: "Check AI use against your privacy obligations and data-handling practices." },
      { title: "Model evaluation & bias testing", body: "Evidence-based testing of how AI systems perform across different groups and cases." },
      { title: "Staff guidelines", body: "Plain-language guidance for everyday, responsible AI use." },
    ],
    process: [
      { title: "Inventory", body: "Map where AI is already used — including shadow AI." },
      { title: "Assess", body: "Rate risks and identify gaps." },
      { title: "Design", body: "Draft policies, controls and responsibilities." },
      { title: "Embed", body: "Train teams and set up ongoing review." },
    ],
    rightFor: [
      "Organisations where staff already use AI tools informally",
      "Regulated sectors like healthcare, finance and education",
      "Businesses preparing for client or regulator questions about AI",
    ],
    faqs: [
      { q: "We're a small business — do we really need AI governance?", a: "You need governance proportionate to your risk. For many small businesses that's a clear one-page policy and a short checklist, not a bureaucracy." },
      { q: "Which frameworks do you work with?", a: "I commonly draw on Australia's AI Ethics Principles, the Voluntary AI Safety Standard and ISO/IEC 42001, adapted to your sector and size." },
    ],
  },
  {
    slug: "ai-training",
    icon: "cap",
    name: "AI literacy & team training",
    summary:
      "Workshops that turn your people into confident, capable and responsible AI users.",
    headline: "The competitive advantage of tomorrow is AI literacy today.",
    intro:
      "Tools change monthly; capability lasts. As a university educator, I design and run hands-on AI training for executives and teams — practical, tailored to your work, and grounded in how AI actually behaves.",
    deliverables: [
      { title: "Executive AI briefings", body: "What leaders need to know to make good AI decisions — in half a day." },
      { title: "Hands-on GenAI workshops", body: "Teams practise with real tasks from their own roles, not generic demos." },
      { title: "Prompting & critical evaluation", body: "Get better outputs and know when not to trust them." },
      { title: "AI champions programme", body: "Build an internal network of people who lead adoption in their teams." },
      { title: "Custom curriculum", body: "Learning pathways designed for your sector, tools and maturity." },
      { title: "Follow-up resources", body: "Guides, templates and prompt libraries your team keeps using." },
    ],
    process: [
      { title: "Assess", body: "Gauge current skills, tools and attitudes." },
      { title: "Design", body: "Tailor content to roles and real tasks." },
      { title: "Deliver", body: "Interactive workshops, online or in person." },
      { title: "Reinforce", body: "Resources and follow-up to make it stick." },
    ],
    rightFor: [
      "Leadership teams who want to understand AI before investing",
      "Organisations rolling out AI tools to staff",
      "Teams nervous or sceptical about AI",
    ],
    faqs: [
      { q: "Do you train in person?", a: "Yes — in person on the Gold Coast and in South-East Queensland, and online anywhere." },
      { q: "Can training be tailored to our industry?", a: "Always. Exercises use tasks from your own roles and sector so people leave with skills they can apply the next day." },
    ],
  },
  {
    slug: "healthcare-ai",
    icon: "pulse",
    name: "Healthcare AI & data science",
    summary:
      "Evidence-based AI and analytics for health services, where accuracy, privacy and trust are non-negotiable.",
    headline: "AI for healthcare, held to a research standard.",
    intro:
      "Healthcare is one of the most consequential frontiers for AI. My research in healthcare data science informs practical advice on decision support, operational analytics and clinical AI evaluation — with privacy and patient safety designed in from the start.",
    deliverables: [
      { title: "Healthcare AI opportunity review", body: "Identify where AI can improve operations, decision-making and patient experience." },
      { title: "Clinical decision support advisory", body: "Evidence-based design and evaluation of AI-augmented decision support." },
      { title: "Health data analytics", body: "Predictive and operational analytics built on sound methodology." },
      { title: "Evaluation & validation", body: "Rigorous testing of AI tools before they reach clinicians or patients." },
      { title: "Privacy & ethics review", body: "Health-specific privacy, consent and ethical considerations." },
      { title: "Research partnerships", body: "Collaborative projects connecting your organisation with academic research." },
    ],
    process: [
      { title: "Understand", body: "Clinical and operational context first." },
      { title: "Evidence", body: "Review what the research says works." },
      { title: "Evaluate", body: "Test rigorously with appropriate data." },
      { title: "Implement", body: "Deploy safely with clinician involvement." },
    ],
    rightFor: [
      "Hospitals, clinics and health services exploring AI",
      "Health-tech companies needing independent evaluation",
      "Organisations seeking research partnerships in health AI",
    ],
    faqs: [
      { q: "Can you help us evaluate an AI product a vendor is offering?", a: "Yes. Independent evaluation of vendor claims — accuracy, bias, evidence base and fit — is one of the most valuable things I do for health organisations." },
      { q: "Do you take on research collaborations?", a: "Yes. Get in touch via the contact page to discuss research partnerships, grants and industry–academic projects." },
    ],
  },
];

export function getPracticeArea(slug: string) {
  return practiceAreas.find((p) => p.slug === slug) ?? null;
}

/** Sitewide four-step engagement process. */
export const howIWork = [
  {
    title: "Understand",
    body: "A free 30-minute strategy call about your business, your goals and where AI might help.",
    detail: "Free · 30 minutes · video call",
  },
  {
    title: "Assess",
    body: "A structured look at your processes, data and readiness to find the opportunities worth pursuing.",
    detail: "Opportunity & readiness assessment",
  },
  {
    title: "Plan",
    body: "A prioritised roadmap with clear measures of success, costs and risks — in plain language.",
    detail: "Roadmap · business case · KPIs",
  },
  {
    title: "Implement & scale",
    body: "Pilot, measure, refine and roll out — with training and governance so it lasts.",
    detail: "Pilot → production → capability",
  },
];

/** "Why work with me" — differentiators. */
export const whyMe = [
  {
    title: "Evidence before enthusiasm.",
    body: "Recommendations are grounded in peer-reviewed research and your own data — not vendor hype.",
  },
  {
    title: "Independent by design.",
    body: "I don't sell software or take referral fees. The only thing I'm selling is good advice.",
  },
  {
    title: "Plain language, real outcomes.",
    body: "Progress is reported in hours saved, costs reduced and decisions improved — explained clearly.",
  },
  {
    title: "Responsible from day one.",
    body: "Privacy, fairness and governance are built in, not bolted on after something goes wrong.",
  },
];

export const sectors = [
  { name: "Healthcare & life sciences", body: "Health services, clinics and health-tech." },
  { name: "Professional services", body: "Legal, accounting, consulting and advisory firms." },
  { name: "Education & training", body: "Universities, schools and training providers." },
  { name: "Small & medium businesses", body: "Owner-led businesses ready to work smarter." },
  { name: "Enterprise & government", body: "Large organisations scaling AI responsibly." },
  { name: "Not-for-profits", body: "Mission-driven teams doing more with less." },
];

export const faqs = [
  {
    q: "What happens in the free strategy call?",
    a: "We spend 30 minutes on your business, what you want to improve and where AI might help. You'll leave with at least one practical next step — whether or not we work together. There's no sales pitch and no obligation.",
  },
  {
    q: "Do we need to be 'AI-ready' before talking to you?",
    a: "Not at all. Many clients start with no AI in place and messy data. Working out what you need first is exactly what the call and the assessment are for.",
  },
  {
    q: "How is this different from hiring a tech vendor or a big consultancy?",
    a: "You work directly with me — an AI researcher and educator with enterprise consulting experience — not a junior team. I'm independent of vendors, so advice is based only on what suits you.",
  },
  {
    q: "Do you work with small businesses or only large organisations?",
    a: "Both. Engagements are scaled to fit, from a single strategy session for an owner-led business to multi-month programmes for enterprise and healthcare teams.",
  },
  {
    q: "How do you handle data privacy and responsible AI?",
    a: "Responsible AI is part of every engagement. I help you keep sensitive data protected, meet Australian privacy obligations and put proportionate governance in place.",
  },
  {
    q: "Where are you based, and do you work remotely?",
    a: "I'm based on the Gold Coast, Australia, at Bond University. Strategy calls and most sessions run on Google Meet, so I work with organisations anywhere.",
  },
];

/** Topics that scroll across the marquee strip. */
export const capabilities = [
  "AI strategy",
  "Generative AI",
  "AI implementation",
  "Machine learning",
  "Responsible AI",
  "Healthcare data science",
  "Business analytics",
  "AI governance",
  "Process automation",
  "AI literacy",
  "Copilots & assistants",
  "Data readiness",
];
