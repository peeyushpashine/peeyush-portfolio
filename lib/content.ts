/**
 * Every piece of copy on the site lives here.
 * Session 2 is filling in the empty arrays below, not touching components.
 */

export const person = {
  name: "Peeyush Pashine",
  thesis: "I build hybrid ML systems for enterprise AI.",
  summary:
    "Lead ML Engineer at Atlassian. Production ML model development, pipelines, multi-agent orchestration, connecting AI to business problems and finding system design patterns to build connected tech systems. Shipped to thousands of tenants.",
  location: "Bengaluru, India",
  email: "peeyushpashine@gmail.com",
  linkedin: "https://www.linkedin.com/in/peeyushpashine",
  github: "https://github.com/peeyushpashine",
};

/** Shown as a quiet row under the hero. Keep these to things that are countable. */
export const facts = [
  { value: "12+", label: "years" },
  { value: "7", label: "patents filed" },
  { value: "4", label: "papers" },
];

export type Milestone = {
  /** Four digit year. */
  year: string;
  /** 1-12. Optional; defaults to mid-year so a year-only entry still lands sensibly. */
  month?: number;
  /** Shown in bold in the panel. Keep it under about six words. */
  label: string;
  /** One or two sentences. This is the whole point of the marker. */
  detail: string;
  /** Optional, shown next to the date. */
  org?: string;
};

/**
 * Extra marks on the journey lane, on top of the automatic one per role start.
 * Clicking any mark shows its detail below the lane. Keep these to things worth
 * stopping on: shipped systems, talks, grants, awards. Ten to fifteen is plenty
 * across thirteen years; more than that and the lane stops reading as a rhythm.
 */
export const milestones: Milestone[] = [
  {
    year: "2017",
    month: 11,
    label: "Mitra at the Global Entrepreneurship Summit",
    detail:
      "Advised Invento Robotics on Mitra, the humanoid robot that greeted the Prime Minister of India and Ivanka Trump at GES 2017 in Hyderabad.",
    org: "Invento Robotics",
  },
  {
    year: "2022",
    month: 6,
    label: "Excellence Award",
    detail:
      "For the end to end ML pipeline behind the supplier insights product launch.",
    org: "Walmart Global Tech",
  },
  {
    year: "2025",
    month: 1,
    label: "Alert Grouping in production",
    detail:
      "Shipped ML and GenAI alert grouping for Jira Service Management, one of the platform's first large scale multi-tenant ML workflows and the foundation later iterations were built on.",
    org: "Atlassian",
  },
  {
    year: "2025",
    month: 9,
    label: "First AIOps patent filed",
    detail:
      "The start of a run of filings on alert classification, model explainability and feedback driven model improvement.",
    org: "Atlassian",
  },
  {
    year: "2025",
    month: 12,
    label: "Big Kudos Award",
    detail:
      "For taking Signal and Noise from zero to one. The work was highlighted in a company keynote.",
    org: "Atlassian",
  },
  {
    year: "2026",
    month: 1,
    label: "Signal and Noise reaches GA",
    detail:
      "The alert classifier went from hypothesis to general availability: weak supervision into gradient boosting, SHAP explanations, per-tenant models and a feedback loop that improves the model in place.",
    org: "Atlassian",
  },
  {
    year: "2026",
    month: 2,
    label: "Multi-tenant training orchestration",
    detail:
      "Per-tenant right sizing, region aware scheduling and pipeline tuning took training cost down by around two thirds while staying OOM-free at production scale.",
    org: "Atlassian",
  },
  {
    year: "2026",
    month: 3,
    label: "Rovo evaluation framework",
    detail:
      "A layered LLM eval framework with golden datasets, LLM-as-judge and out-of-domain guardrails. Skill evaluation became a practice adopted across AIOps.",
    org: "Atlassian",
  },
  {
    year: "2026",
    month: 6,
    label: "Conversational root cause analysis",
    detail:
      "Agentic root cause skills over metrics, events, logs and traces, returning ranked likely causes in seconds.",
    org: "Atlassian",
  },
];

/** The right edge of the journey lane: the current month. Bump this as it moves. */
export const presentYear = 2026;
export const presentMonth = 8;

export type Role = {
  org: string;
  title: string;
  from: string;
  to: string;
  /** "YYYY-MM" start, used to place the mark on the journey lane. Falls back to `from`. */
  start?: string;
  note: string;
};

export const roles: Role[] = [
  {
    org: "Atlassian",
    title: "Lead ML Engineer",
    start: "2024-07",
    from: "2024",
    to: "Present",
    note: "Took Signal and Noise alert classification from zero to GA. Designed multi-agent orchestration for Rovo Ops Agent and multi-tenant training orchestration for the ML platform.",
  },
  {
    org: "Walmart Global Tech",
    title: "Staff Machine Learning Engineer",
    from: "2021",
    to: "2024",
    start: "2021-08",
    note: "Led a four person ML engineering horizontal, standardising and automating the pipeline artifacts other data science teams built on, which halved ML deployment time. Built the supplier insights product end to end: per-tenant models over 20TB+ of training data serving 100+ suppliers.",
  },
  {
    org: "PwC Labs",
    title: "Senior Data Scientist",
    start: "2020-03",
    from: "2020",
    to: "2021",
    note: "Document extraction for finance, using TensorFlow, OpenCV and MaskRCNN, deployed on Kubeflow and KFServing.",
  },
  {
    org: "Software AG",
    title: "Data Scientist and DevOps Engineer",
    start: "2018-03",
    from: "2018",
    to: "2020",
    note: "Consulting across images, NLP and tabular data for clients in India and Europe. Built a no-code data science tool with a team of five.",
  },
  {
    org: "MathWorks",
    title: "Senior Software Engineer",
    start: "2013-04",
    from: "2013",
    to: "2018",
    note: "Software stack and auto code generation architecture for Simulink across TI, STM32 and Raspberry Pi boards.",
  },
];

export type Work = {
  name: string;
  where: string;
  blurb: string;
  tags: string[];
};

/**
 * Written deliberately conservative: architectural patterns and approach,
 * no thresholds, tenant counts, internal metrics or unreleased roadmap.
 * Loosen where you are comfortable.
 */
export const work: Work[] = [
  {
    name: "Signal and Noise",
    where: "Atlassian",
    blurb:
      "Alert classification for IT operations: deciding which alerts are worth waking someone for. Density clustering and gradient boosting fused with semantic embeddings, a hybrid of symbolic and neural methods rather than a pure LLM approach. Taken from problem framing and user interviews through to general availability, with an anomaly validator gating the output.",
    tags: ["Hybrid ML", "Classification", "0 to 1"],
  },
  {
    name: "Rovo Ops Agent",
    where: "Atlassian",
    blurb:
      "Multi-agent orchestration architecture for incident operations. Routing strategy across agents, plus the evaluation harness needed to tell whether a change to one agent made the whole system better or just louder.",
    tags: ["Agents", "LLM Evals", "Orchestration"],
  },
  {
    name: "Provisioner Publisher",
    where: "Atlassian",
    blurb:
      "Multi-tenant ML training orchestration with region-aware distribution and multi-tier instance routing. A check-before-claim pattern removed a large class of redundant compute, which is the kind of saving that only shows up once you are training per-tenant models at scale.",
    tags: ["Distributed Systems", "MLOps", "Cost"],
  },
  {
    name: "Alert correlation",
    where: "Atlassian",
    blurb:
      "Research and proof of concept for correlating alerts without relying on a service topology: persistent regions and incident detection derived from temporal clustering of alert patterns. Moved into the production roadmap.",
    tags: ["Research", "Clustering", "Incident Detection"],
  },
  {
    name: "Supplier insights pipeline",
    where: "Walmart Labs",
    blurb:
      "ML pipelines producing insights for Walmart suppliers. Thousands of per-tenant models trained over 20TB+ of data, with the pipeline design mattering more than any single model.",
    tags: ["Scale", "MLOps", "Retail"],
  },
];

export type Patent = { title: string; status: string; refs?: string[] };

export const patents: Patent[] = [
  { title: "System and methods for finding signal and noise in ITOps alerts using machine learning", status: "Filed" },
  { title: "Feature and approach implementation for actionable alerts to early incident prediction in ITSM", status: "Filed" },
  { title: "Hybrid alert classification engine", status: "Filed" },
  { title: "Feature engineering for alert classification", status: "Filed" },
  { title: "User feedback reinforcement to improve SnR model prediction", status: "Filed" },
  { title: "Apparatuses, methods, and computer program products for explaining classification model outputs", status: "Filed" },
  {
    title: "System and methods of controlling retail product allocation based on customised insights",
    status: "Filed",
    refs: ["AQ#81449891", "7059US01", "FETF 154413-USPR"],
  },
];

export type Publication = { title: string; venue: string; year?: string; status?: string; href?: string };

export const publications: Publication[] = [
  {
    title: "Scalable AI-based personalised SmartInsights system",
    venue: "ACML",
    year: "2022",
    status: "Submitted",
  },
  {
    title:
      "No-QUALMS: a novel quality assurance, enhancement and MLOps framework for data science modelling at scale",
    venue: "ACML",
    year: "2023",
    status: "Submitted",
    href: "/papers/no-qualms.pdf",
  },
  {
    title: "Scalable modularised MLOps with quality framework",
    venue: "AIMLSystems",
    year: "2023",
    status: "Submitted",
    href: "/papers/scalable-modularised-mlops.pdf",
  },
  {
    title: "Intuitionist: horizontal unified data science code generation templates kit",
    venue: "Walmart Global Tech",
    status: "Internal paper",
    href: "/papers/intuitionist.pdf",
  },
];

export type Talk = { title: string; venue: string; year: string; href?: string };

export const talks: Talk[] = [
  {
    title: "Reducing on-call fatigue with Signal and Noise in ITOps",
    venue: "GIDS",
    year: "2025",
  },
  {
    title: "Signal and Noise: from problem to GA",
    venue: "Atlassian EngFest",
    year: "2025",
  },
];

export type Award = { title: string; where: string; note: string };

export const awards: Award[] = [
  {
    title: "Big Kudos Award",
    where: "Atlassian",
    note: "For taking Signal and Noise from zero to one. The work was highlighted in a company keynote.",
  },
  {
    title: "Excellence Award",
    where: "Walmart Labs",
    note: "For the end to end ML pipeline behind the supplier insights product launch.",
  },
];

export type Education = { degree: string; school: string; year: string };

export const education: Education[] = [
  {
    degree: "M.Eng, Computer Science and Embedded Systems",
    school: "BITS Pilani",
    year: "2013",
  },
  {
    degree: "B.E., Electronics",
    school: "Bhilai Institute of Technology",
    year: "2010",
  },
];

export type Writing = { title: string; where: string; date: string; href: string };
