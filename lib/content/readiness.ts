// AI Readiness Check — five quick questions that place a visitor on an
// AI maturity stage and point them to the right next step.

export type ReadinessQuestion = {
  id: "use" | "data" | "leadership" | "skills" | "governance";
  question: string;
  options: string[]; // index 0 = least mature … 3 = most mature
};

export const readinessQuestions: ReadinessQuestion[] = [
  {
    id: "use",
    question: "How is your organisation using AI today?",
    options: [
      "We're not using it yet",
      "A few people use ChatGPT or similar on their own",
      "We've run a pilot or two",
      "AI is part of how core processes run",
    ],
  },
  {
    id: "data",
    question: "How would you describe your data?",
    options: [
      "Scattered across spreadsheets and inboxes",
      "Mostly in systems, but hard to pull together",
      "Centralised and reasonably clean",
      "Well-governed and used for decisions daily",
    ],
  },
  {
    id: "leadership",
    question: "Where does leadership stand on AI?",
    options: [
      "Curious, but no plan",
      "Interested, looking for a business case",
      "Committed, with budget for initiatives",
      "AI is a named strategic priority",
    ],
  },
  {
    id: "skills",
    question: "How confident is your team with AI tools?",
    options: [
      "Mostly unfamiliar or wary",
      "A few enthusiasts",
      "Many people use AI regularly",
      "We have in-house AI or data expertise",
    ],
  },
  {
    id: "governance",
    question: "Do you have rules for how AI is used?",
    options: [
      "Nothing in place",
      "Informal guidance",
      "A written AI policy",
      "Policy, risk process and regular review",
    ],
  },
];

export type Stage = {
  key: "explorer" | "experimenter" | "builder" | "scaler";
  name: string;
  summary: string;
  nextStep: string;
  serviceSlug: string;
  serviceName: string;
};

export const stages: Record<Stage["key"], Stage> = {
  explorer: {
    key: "explorer",
    name: "Explorer",
    summary:
      "You're at the start — which is a great place to be. The biggest wins now come from picking the right first use case and building basic AI literacy.",
    nextStep: "Identify two or three high-value, low-risk opportunities and upskill your leadership team.",
    serviceSlug: "ai-strategy",
    serviceName: "AI strategy & roadmapping",
  },
  experimenter: {
    key: "experimenter",
    name: "Experimenter",
    summary:
      "People are already trying AI, but it isn't coordinated yet. Now is the time to turn scattered experiments into a plan — and set some guardrails.",
    nextStep: "Prioritise use cases, write a simple AI use policy and choose one pilot to do properly.",
    serviceSlug: "ai-strategy",
    serviceName: "AI strategy & roadmapping",
  },
  builder: {
    key: "builder",
    name: "Builder",
    summary:
      "You have commitment and some foundations. The challenge now is getting pilots into production and proving the value.",
    nextStep: "Design pilots with clear success metrics, integrate with core systems and plan adoption.",
    serviceSlug: "ai-implementation",
    serviceName: "AI implementation & integration",
  },
  scaler: {
    key: "scaler",
    name: "Scaler",
    summary:
      "AI is already part of how you work. Your edge now comes from scaling responsibly, measuring impact and keeping governance in step.",
    nextStep: "Strengthen governance, evaluate impact rigorously and extend AI across more of the business.",
    serviceSlug: "responsible-ai",
    serviceName: "AI governance & responsible AI",
  },
};

/**
 * Turns the five answers (each 0–3, keyed by question id) into a maturity
 * stage.
 *
 * Default: equal weights, summed to 0–15, split into four even bands.
 * This is a judgement call — see the note in the conversation about
 * whether some dimensions (e.g. data or governance) should count more,
 * or whether a weak foundation should cap the overall stage.
 */
export function scoreReadiness(
  answers: Record<ReadinessQuestion["id"], number>,
): Stage {
  const total = Object.values(answers).reduce((sum, v) => sum + v, 0);
  if (total <= 3) return stages.explorer;
  if (total <= 7) return stages.experimenter;
  if (total <= 11) return stages.builder;
  return stages.scaler;
}
