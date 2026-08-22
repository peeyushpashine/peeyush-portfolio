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
  { value: "8", label: "patents filed" },
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

/* ---------------------------------------------------------------
   Session 2 fills these in. Sections render only when non-empty,
   so the site stays honest while they are still blank.
   --------------------------------------------------------------- */

export type Work = {
  name: string;
  blurb: string;
  tags: string[];
  href?: string;
};

export const work: Work[] = [];

export type Patent = { title: string; status: string };
export const patents: Patent[] = [];

export type Publication = { title: string; venue: string; year: string; href?: string };
export const publications: Publication[] = [];

export type Talk = { title: string; venue: string; year: string; href?: string };
export const talks: Talk[] = [];

export type Writing = { title: string; where: string; date: string; href: string };
export const writing: Writing[] = [];
