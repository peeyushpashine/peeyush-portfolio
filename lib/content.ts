/**
 * Every piece of copy on the site lives here.
 * Session 2 is filling in the empty arrays below, not touching components.
 */

export const person = {
  name: "Peeyush Pashine",
  thesis: "I build hybrid ML systems for enterprise AI.",
  summary:
    "Lead ML Engineer at Atlassian. Production classification, multi-agent orchestration, and multi-tenant ML platform work, shipped to thousands of tenants.",
  location: "Bengaluru, India",
  email: "peeyushpashine@gmail.com",
  linkedin: "https://www.linkedin.com/in/peeyushpashine",
  github: "https://github.com/peeyushpashine",
};

/** Shown as a quiet row under the hero. Keep these to things that are countable. */
export const facts = [
  { value: "12+", label: "years" },
  { value: "7", label: "patents filed" },
  { value: "3", label: "publications" },
];

export type Role = {
  org: string;
  title: string;
  from: string;
  to: string;
  note: string;
};

export const roles: Role[] = [
  {
    org: "Atlassian",
    title: "Lead ML Engineer",
    from: "2024",
    to: "Present",
    note: "Took Signal and Noise alert classification from zero to GA. Designed multi-agent orchestration for Rovo Ops Agent and multi-tenant training orchestration for the ML platform.",
  },
  {
    org: "Walmart Labs",
    title: "Staff Machine Learning Engineer",
    from: "2023",
    to: "2024",
    note: "Led a team of four MLEs at Walmart Data Ventures. Standardised MLOps practice across verticals and cut deployment times.",
  },
  {
    org: "Walmart Labs",
    title: "Senior Machine Learning Engineer",
    from: "2021",
    to: "2023",
    note: "Built the supplier insights ML pipeline: per-tenant models over 20TB+ of training data, serving 100+ suppliers.",
  },
  {
    org: "PwC Labs",
    title: "Senior Data Scientist",
    from: "2020",
    to: "2021",
    note: "Document extraction for finance, using TensorFlow, OpenCV and MaskRCNN, deployed on Kubeflow and KFServing.",
  },
  {
    org: "Software AG",
    title: "Data Scientist and DevOps Engineer",
    from: "2018",
    to: "2020",
    note: "Consulting across images, NLP and tabular data for clients in India and Europe. Built a no-code data science tool with a team of five.",
  },
  {
    org: "MathWorks",
    title: "Senior Software Engineer",
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

export type Publication = { title: string; venue: string; year: string; href?: string };

export const publications: Publication[] = [
  {
    title: "Scalable AI-based personalised SmartInsights system",
    venue: "Asian Machine Learning Conference",
    year: "2022",
  },
  {
    title: "No-Qualms: a scalable MLOps and quality framework",
    venue: "Quality framework for data science products at scale",
    year: "2023",
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
