import { describe, expect, it } from "vitest";
import { createInitialMessageBusState, MESSAGEBUS_AGENTS, MESSAGEBUS_CHANNELS } from "./seed";
import { createMessageBusStore } from "./service";

describe("MEDIOEVO MessageBus", () => {
  it("incluye canales y agentes minimos de DUAT Telecom Core", () => {
    const channelIds = MESSAGEBUS_CHANNELS.map((channel) => channel.id);
    const agentIds = MESSAGEBUS_AGENTS.map((agent) => agent.id);

    expect(channelIds).toEqual(
      expect.arrayContaining([
        "#system_announcements",
        "#handoffs",
        "#witnesslog",
        "#tasks",
        "#security_review",
        "#canon_updates",
        "#build_reports",
        "#research",
        "#lovable_ui",
        "#codex_runs",
        "#claudio_local",
        "#wabi_sabi_orchestration",
        "#duat_product",
      ]),
    );
    expect(agentIds).toEqual(
      expect.arrayContaining([
        "wabi_sabi_orchestrator",
        "cerebro_canon",
        "claudio_local_operator",
        "codex_engineer",
        "lovable_frontend",
        "security_gate",
        "research_scout",
        "duat_product_designer",
        "lore_archivist",
        "human_operator",
      ]),
    );
  });

  it("crea, envia, confirma y resuelve mensajes", () => {
    const bus = createMessageBusStore(createInitialMessageBusState());
    const created = bus.createMessage({
      thread_id: "thread-test",
      channel_id: "#tasks",
      from_agent: "codex_engineer",
      to_agents: ["human_operator"],
      kind: "task",
      priority: "P1",
      title: "Verificar MessageBus",
      body: "Smoke test local.",
      certeza: ["Mensaje creado por prueba."],
      inferencia: [],
      incognita: [],
      bloqueo: [],
      evidence_refs: [],
      artifact_refs: [],
      R_estimado: 0.2,
    });

    expect(created.status).toBe("draft");
    expect(bus.sendMessage(created.id).status).toBe("sent");
    expect(bus.ackMessage(created.id, "human_operator").status).toBe("acknowledged");
    expect(bus.resolveMessage(created.id, "human_operator").status).toBe("resolved");
    expect(bus.getInbox("human_operator").some((message) => message.id === created.id)).toBe(true);
  });

  it("mantiene P0 abiertos y exporta bulletin/json", () => {
    const bus = createMessageBusStore(createInitialMessageBusState());

    expect(bus.getOpenP0()).toHaveLength(1);
    expect(bus.exportBulletinMarkdown()).toContain("DUAT Telecom Core Run 2 activo");
    expect(JSON.parse(bus.exportMessageBusJson()).messages.length).toBeGreaterThan(0);
  });

  it("agrega handoffs y eventos WitnessLog con hash", () => {
    const bus = createMessageBusStore(createInitialMessageBusState());
    const handoff = bus.createHandoffMessage({
      from_agent: "codex_engineer",
      to_agents: ["lovable_frontend"],
      title: "Handoff de prueba",
      body: "Continuar con evidencia.",
      fingerprint: "MDV-TEST-001",
      evidence_refs: ["TEST_REPORT.md"],
      R_estimado: 0.18,
      Phi_eff: 0.8,
    });
    const witness = bus.appendWitnessEvent({
      actor: "codex_engineer",
      action: "test_append",
      result: "ok",
      evidence_refs: ["service.test.ts"],
    });

    expect(handoff.handoff_fingerprint).toBe("MDV-TEST-001");
    expect(witness.hash).toMatch(/^h-[0-9a-f]+$/);
    expect(bus.getChannel("#handoffs")?.name).toBe("Handoffs");
  });
});
