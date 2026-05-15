import { describe, expect, it } from "vitest";
import { communityPrompts, observatorioAgents, promptCampaignPolls, shortBook } from "./promptCampaign";

describe("prompt campaign content", () => {
  it("keeps the three free prompts downloadable from public-safe paths", () => {
    expect(communityPrompts).toHaveLength(3);
    expect(communityPrompts.every((prompt) => prompt.status === "free")).toBe(true);
    expect(communityPrompts.map((prompt) => prompt.publicPath)).toEqual([
      "/prompts/01_scanner_seguridad_local.md",
      "/prompts/02_ahorro_tokens_extremo.md",
      "/prompts/03_handoff_memoria_persistente.md",
    ]);
  });

  it("keeps polls and observatorio roles public-safe", () => {
    expect(promptCampaignPolls).toHaveLength(2);
    expect(observatorioAgents.map((agent) => agent.role)).toContain("claims-falsifier-observatorio");
    expect(shortBook.publicPath).toBe("/books/medioevo-informacion-residuo-observacion.md");
  });
});
