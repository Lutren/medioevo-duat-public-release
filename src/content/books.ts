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
  "No book purchase URL was invented.",
  "BOOK_LINKS_NEEDED records the missing exact public links.",
];
