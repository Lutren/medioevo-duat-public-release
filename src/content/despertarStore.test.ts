import { describe, expect, it } from "vitest";
import { booksCatalog } from "./books";
import { gumroadProducts } from "./gumroadProducts";
import { productMatrix } from "./products";

describe("DESPERTAR public store entry", () => {
  it("keeps the approved Gumroad entry consistent across public content", () => {
    const gumroad = gumroadProducts.find((product) => product.id === "medioevo-despertar-preview");
    const product = productMatrix.find((item) => item.id === "medioevo-despertar-preview");
    const book = booksCatalog.find((item) => item.id === "medioevo-despertar-preview");

    expect(gumroad?.gumroadUrl).toBe("https://lrgonzalez.gumroad.com/l/dmqgzi");
    expect(product?.gumroadUrl).toBe(gumroad?.gumroadUrl);
    expect(book?.purchaseLink).toBe(gumroad?.gumroadUrl);
    expect(product?.publicSafe).toBe(true);
    expect(product?.status).toBe("live");
  });

  it("lists the three public Gumroad products with local product assets", () => {
    const expected = [
      "medioevo-despertar-preview",
      "duat-templates",
      "medioevo-agent-ops-pack",
    ];

    expect(gumroadProducts.map((product) => product.id)).toEqual(expected);

    for (const product of gumroadProducts) {
      expect(product.status).toBe("live");
      expect(product.image).toMatch(/^\/product-assets\/covers\/.+-square-v1\.png$/);
    }

    const agentOps = productMatrix.find((product) => product.id === "medioevo-agent-ops-pack");
    expect(agentOps?.status).toBe("live");
    expect(agentOps?.gumroadUrl).toBe("https://lrgonzalez.gumroad.com/l/medioevo-agent-ops-pack");
  });

  it("keeps protected material out of the public store promise", () => {
    const product = productMatrix.find((item) => item.id === "medioevo-despertar-preview");
    const boundaryText = [
      product?.longDescription,
      product?.risks.join(" "),
      product?.nextAction,
    ].join(" ");

    expect(boundaryText).toContain("private archive");
    expect(boundaryText).toContain("RPG/TCG");
    expect(boundaryText).toContain("host gate");
    expect(boundaryText).not.toContain("bestseller real");
  });
});
