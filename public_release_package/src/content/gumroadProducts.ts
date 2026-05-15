export type GumroadProductStatus = "live" | "draft" | "coming-soon" | "needs-review";

export type GumroadProduct = {
  id: string;
  gumroadProductId?: string;
  gumroadUrl: string;
  title: string;
  priceDisplay: string;
  description: string;
  image: string;
  status: GumroadProductStatus;
  sitePlacement: string;
  publishRecommendation: string;
  auditNotes: string[];
};

export const gumroadProducts: GumroadProduct[] = [
  {
    id: "medioevo-despertar-preview",
    gumroadProductId: "dmqgzi",
    gumroadUrl: "https://lrgonzalez.gumroad.com/l/dmqgzi",
    title: "MEDIOEVO: Despertar Preview",
    priceDisplay: "$0",
    description:
      "A public-safe entry point into MEDIOEVO through DESPERTAR. It is a reader-facing preview package, not the private archive, not the RPG/TCG lane and not a scientific claim.",
    image: "/product-assets/covers/medioevo-despertar-preview-square-v1.png",
    status: "live",
    sitePlacement: "Primary reader entry",
    publishRecommendation:
      "Keep this as the first book CTA. Do not attach the full private archive, RPG/TCG files or unpublished derivatives to this public product.",
    auditNotes: [
      "Public URL verified by HTTP 200 during the publication prep run.",
      "Prepared release ZIP passed local QA, secret scan and nested-archive checks.",
      "Claims must stay literary/public-safe: no real bestseller claim and no external science claim.",
      "Price and live checkout state remain source-of-truth on Gumroad.",
    ],
  },
  {
    id: "duat-templates",
    gumroadUrl: "https://lrgonzalez.gumroad.com/l/duat-templates",
    title: "DUAT Templates",
    priceDisplay: "See Gumroad",
    description:
      "A commercial template pack for public-safe DUAT work: structured handoffs, observable workflows, audit surfaces and ActionGate-ready publication prep.",
    image: "/product-assets/covers/duat-templates-square-v1.png",
    status: "live",
    sitePlacement: "Primary store product",
    publishRecommendation:
      "Use direct external Gumroad links only. Do not use Gumroad API, dashboard writes or embedded scripts unless a later operator authorizes and reviews them.",
    auditNotes: [
      "Known candidate from coordinator context and root product map.",
      "External link fallback is mandatory.",
      "Price remains source-of-truth on Gumroad.",
      "No token or API integration is required for the public site.",
    ],
  },
  {
    id: "medioevo-agent-ops-pack",
    gumroadUrl: "https://lrgonzalez.gumroad.com/l/medioevo-agent-ops-pack",
    title: "MEDIOEVO Agent Ops Pack",
    priceDisplay: "See Gumroad",
    description:
      "A commercial operations pack for agent-built work: technical cards, curator reports, ActionGate checklists, release prep and synthetic examples for safer publication.",
    image: "/product-assets/covers/medioevo-agent-ops-pack-square-v1.png",
    status: "live",
    sitePlacement: "Agent operations product",
    publishRecommendation:
      "Use this as the practical paid offer for teams using agents. Keep it template-only and do not include private Claudio runtime, prompts, credentials, books or RPG/TCG material.",
    auditNotes: [
      "Root release score records this as a published Gumroad product with clean product scans.",
      "Product copy stays operational: evidence, gates, handoffs and release discipline.",
      "No guarantee of autonomous AI safety, revenue lift or agent correctness.",
      "Price and live checkout state remain source-of-truth on Gumroad.",
    ],
  },
];

export const gumroadStoreUrl = "https://lrgonzalez.gumroad.com/";
