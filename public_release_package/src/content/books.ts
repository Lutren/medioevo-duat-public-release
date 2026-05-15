export type BookStatus = "published" | "coming soon" | "private" | "needs review";

export type BookCatalogItem = {
  id: string;
  title: string;
  subtitle?: string;
  status: BookStatus;
  category: string;
  description: string;
  purchaseLink?: string;
  coverImage?: string;
  privateBoundary: string;
  sourceNotes: string[];
};

export const booksCatalog: BookCatalogItem[] = [
  {
    id: "medioevo-informacion-residuo-observacion",
    title: "MEDIOEVO: Informacion, Residuo y Observacion",
    subtitle: "Short public-safe theory book",
    status: "coming soon",
    category: "Short book",
    description:
      "A compact public introduction to MEDIOEVO information theory as an operational practice: observe from state, reduce residue, act with evidence and preserve continuity.",
    purchaseLink: "/books/medioevo-informacion-residuo-observacion.md",
    privateBoundary:
      "This manuscript is public-safe and intentionally excludes raw research, complete formulas, private calibration, datasets, runtime internals, RPG/TCG and unpublished canon.",
    sourceNotes: [
      "Prepared from public-safe publishing packets, operational canon and claims boundary material.",
      "Gumroad/listing action remains gated until a final artifact and external target gate exist.",
    ],
  },
  {
    id: "medioevo-despertar-preview",
    title: "MEDIOEVO: Despertar Preview",
    subtitle: "Primary public-safe reader entry",
    status: "published",
    category: "Book preview",
    description:
      "DESPERTAR is the recommended public entry point into MEDIOEVO: a fiction-first reader door prepared for market testing without exposing the full private archive.",
    purchaseLink: "https://lrgonzalez.gumroad.com/l/dmqgzi",
    coverImage: "/product-assets/covers/medioevo-despertar-preview-cover-v1.png",
    privateBoundary:
      "This public route may link the approved Gumroad preview only. It must not include full manuscripts, the private editorial workspace, RPG/TCG files or scientific overclaims.",
    sourceNotes: [
      "Operator accepted the human reading gate for publication prep.",
      "Anti texto IA local review passed as editorial heuristic, not as an external detector guarantee.",
      "Gumroad URL returned HTTP 200 during the publication prep run.",
    ],
  },
  {
    id: "medioevo-public-books-catalog",
    title: "MEDIOEVO Public Books Catalog",
    subtitle: "Approved public links pending",
    status: "needs review",
    category: "Public catalog",
    description:
      "A public catalog placeholder for approved MEDIOEVO books, samples and purchase links. This route does not include manuscripts, private canon, full drafts or source vault material.",
    privateBoundary:
      "Only approved descriptions and external purchase links belong here. Full books, raw canon, private vaults and unpublished research remain excluded.",
    sourceNotes: [
      "Repo scan found public docs and canon-boundary language, but no confirmed book purchase link inside this repo.",
      "Root workspace product maps classify books/editorial as all rights reserved unless samples are explicitly approved.",
    ],
  },
];

export const bookCatalogNotes = [
  "No full manuscripts were copied into this public release.",
  "The information/residue/observation short book is a public-safe draft, not a raw research dump.",
  "DESPERTAR is the only confirmed book/preview checkout URL in this public route.",
  "Additional book URLs remain pending until approved and verified.",
];
