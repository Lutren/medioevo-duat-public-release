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
    id: "duat-templates",
    gumroadUrl: "https://lrgonzalez.gumroad.com/l/duat-templates",
    title: "DUAT Templates",
    priceDisplay: "See Gumroad",
    description:
      "A commercial template pack for public-safe DUAT work: structured handoffs, observable workflows, audit surfaces and ActionGate-ready publication prep.",
    image: "/duat-assets/posters/png/duat-square-thumbnail.png",
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
];

export const gumroadStoreUrl = "https://lrgonzalez.gumroad.com/";
