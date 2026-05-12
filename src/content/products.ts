export type ProductType = "book" | "template" | "agent-pack" | "audit" | "consulting" | "software" | "membership";
export type ProductStatus = "live" | "draft" | "coming-soon" | "private" | "needs-review";
export type EvidenceLevel = "CERTEZA" | "INFERENCIA" | "INCOGNITA";

export type ProductMatrixItem = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  type: ProductType;
  status: ProductStatus;
  priceRecommendation: string;
  gumroadUrl?: string;
  siteUrl?: string;
  audience: string;
  problemSolved: string;
  valueProposition: string;
  evidenceLevel: EvidenceLevel;
  publicSafe: boolean;
  risks: string[];
  nextAction: string;
};

export const productMatrix: ProductMatrixItem[] = [
  {
    id: "duat-templates-pack",
    title: "DUAT Templates Pack",
    shortDescription: "Commercial templates for observable DUAT workflows.",
    longDescription:
      "A public-safe digital product for teams and builders who need structured handoffs, ActionGate checkpoints, report templates and audit-ready workflow surfaces.",
    type: "template",
    status: "live",
    priceRecommendation: "$19-$49 range; final price remains on Gumroad.",
    gumroadUrl: "https://lrgonzalez.gumroad.com/l/duat-templates",
    siteUrl: "/store",
    audience: "Builders, operators, creative technical teams and local-first agent workflow users.",
    problemSolved: "Unstructured handoffs, unclear next actions and weak evidence trails.",
    valueProposition: "Reusable templates that make agent work easier to resume, audit and publish safely.",
    evidenceLevel: "CERTEZA",
    publicSafe: true,
    risks: ["Avoid implying scientific validation or autonomous execution guarantees.", "Keep private DUAT/GEODIA material excluded."],
    nextAction: "Keep as first Store CTA and verify Gumroad URL during QA.",
  },
  {
    id: "medioevo-canon-starter-pack",
    title: "MEDIOEVO Canon Starter Pack",
    shortDescription: "Curated public entry point for MEDIOEVO world and method material.",
    longDescription:
      "A future public-safe pack containing only approved summaries, sample pages, diagrams and reading order. It must not include raw canon, full private manuscripts or internal vault exports.",
    type: "book",
    status: "needs-review",
    priceRecommendation: "Free sample or $9-$19 small starter pack after content approval.",
    siteUrl: "/books",
    audience: "Readers and creative systems followers who need a clean public entry point.",
    problemSolved: "New readers do not know where to start without exposing private canon.",
    valueProposition: "A safe, compact orientation layer for MEDIOEVO books and concepts.",
    evidenceLevel: "INFERENCIA",
    publicSafe: true,
    risks: ["Risk of leaking private canon if sourced from raw vaults.", "Requires explicit approved samples before sale."],
    nextAction: "Create approved table of contents and exact book links before publication.",
  },
  {
    id: "agent-handoff-kit",
    title: "Agent Handoff Kit",
    shortDescription: "AGENTS.md, NEXT_SESSION_BRIEF, TASKS, DECISIONS and ACTION_GATES templates.",
    longDescription:
      "A practical kit for multi-agent projects that need continuity, clear task ownership, decision logs, safe action gates and handoff briefs.",
    type: "agent-pack",
    status: "draft",
    priceRecommendation: "$19-$49 once examples and license boundary are complete.",
    siteUrl: "/store",
    audience: "Founders, researchers, software teams and solo operators using AI agents across long projects.",
    problemSolved: "Agents lose context, duplicate work and mark tasks done without evidence.",
    valueProposition: "A repeatable operating packet for safer, cleaner agent continuity.",
    evidenceLevel: "CERTEZA",
    publicSafe: true,
    risks: ["Do not include internal MEDIOEVO paths, private work logs or credentials.", "Needs example-only templates."],
    nextAction: "Package public templates with synthetic examples and a boundary README.",
  },
  {
    id: "observacionismo-audit-pack",
    title: "Observacionismo Audit Pack",
    shortDescription: "CERTEZA, INFERENCIA, INCOGNITA, BLOQUEO, R estimate, ActionGate and WitnessLog.",
    longDescription:
      "A professional audit framework for separating observed evidence, reasonable inference, unknowns and blockers before publication or product decisions.",
    type: "audit",
    status: "draft",
    priceRecommendation: "$49-$149 depending on depth and example set.",
    siteUrl: "/audit",
    audience: "Teams that need clearer decision records before public releases.",
    problemSolved: "Audits often mix facts, assumptions, risks and actions in one vague document.",
    valueProposition: "A disciplined public-safe audit format with evidence and next action separated.",
    evidenceLevel: "CERTEZA",
    publicSafe: true,
    risks: ["Keep it framed as an audit method, not proprietary theory transfer.", "Avoid claiming scientific proof."],
    nextAction: "Publish a sample audit using only this public repo as evidence.",
  },
  {
    id: "public-books-catalog",
    title: "Public Books Catalog",
    shortDescription: "Approved book links and descriptions only.",
    longDescription:
      "A catalog route for public book descriptions, publication status and purchase links when exact approved URLs are available.",
    type: "book",
    status: "needs-review",
    priceRecommendation: "Link to existing store pages; do not set prices without source.",
    siteUrl: "/books",
    audience: "Readers looking for MEDIOEVO books and public samples.",
    problemSolved: "Book discovery is disconnected from the public DUAT site.",
    valueProposition: "A single public path for book status without exposing manuscripts.",
    evidenceLevel: "INCOGNITA",
    publicSafe: true,
    risks: ["No exact book purchase links detected in this repo.", "Do not invent titles or URLs."],
    nextAction: "Operator should provide approved book titles, statuses and links.",
  },
  {
    id: "duat-visual-assets-devday-pack",
    title: "DUAT Visual Assets / DevDay Pack",
    shortDescription: "Public-ready DUAT visual assets, badges and submission copy.",
    longDescription:
      "A controlled asset pack for DUAT public visuals, social cards, diagrams and DevDay-style presentation surfaces sourced from approved public assets.",
    type: "template",
    status: "needs-review",
    priceRecommendation: "Free public preview or $9-$19 asset pack after license review.",
    siteUrl: "/duat-devday",
    audience: "People who want to understand or share DUAT visually.",
    problemSolved: "Public audiences need concrete visual context instead of dense technical claims.",
    valueProposition: "A polished, inspectable visual layer for the public DUAT release.",
    evidenceLevel: "CERTEZA",
    publicSafe: true,
    risks: ["Only use assets already present in public/duat-assets.", "Do not include private brand, game or vault assets."],
    nextAction: "Create a manifest of included public assets before packaging.",
  },
  {
    id: "medioevo-commercial-audit-service",
    title: "MEDIOEVO Commercial Audit Service",
    shortDescription: "Professional review for positioning, buyer journey, product ladder and public/private boundaries.",
    longDescription:
      "A service offer for founders or technical creators who need a clear public surface, store path, claims boundary, product matrix and next-action audit.",
    type: "consulting",
    status: "coming-soon",
    priceRecommendation: "$250+ custom audit/consulting, scoped manually.",
    siteUrl: "/commercial-audit",
    audience: "Technical creators, indie software teams and product operators preparing public releases.",
    problemSolved: "A project may be technically strong but commercially unclear or risky to publish.",
    valueProposition: "A clear route from current evidence to a safer public product surface.",
    evidenceLevel: "INFERENCIA",
    publicSafe: true,
    risks: ["No guaranteed revenue, conversion lift or prediction claims.", "Requires manual scope and evidence review."],
    nextAction: "Keep as inquiry-ready service copy, not an automated checkout yet.",
  },
];

export const storeOrder = [
  "Live products",
  "Books",
  "Templates / packs",
  "Audits / services",
  "Coming soon",
  "Private/not public only in QA",
];
