import { createInitialMessageBusState } from "./seed";
import type {
  AgentId,
  ChannelId,
  CreateHandoffInput,
  CreateMessageInput,
  MessageBusState,
  MessageId,
  StorageAdapter,
  WitnessEvent,
} from "./types";

export const MESSAGEBUS_STORAGE_KEY = "duat-telecom-core:messagebus:v1";

export function loadMessageBusState(storage: StorageAdapter | undefined = browserStorage()): MessageBusState {
  if (!storage) return createInitialMessageBusState();
  const raw = storage.getItem(MESSAGEBUS_STORAGE_KEY);
  if (!raw) {
    const seeded = createInitialMessageBusState();
    storage.setItem(MESSAGEBUS_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return JSON.parse(raw) as MessageBusState;
  } catch {
    const seeded = createInitialMessageBusState();
    storage.setItem(MESSAGEBUS_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function saveMessageBusState(state: MessageBusState, storage: StorageAdapter | undefined = browserStorage()) {
  storage?.setItem(MESSAGEBUS_STORAGE_KEY, JSON.stringify(state));
}

export function createMessageBusStore(initialState = createInitialMessageBusState(), storage?: StorageAdapter) {
  let state = cloneState(initialState);

  const persist = () => {
    saveMessageBusState(state, storage);
    return getState();
  };

  const getState = () => cloneState(state);

  const createMessage = (input: CreateMessageInput) => {
    const now = new Date().toISOString();
    const prev = state.messages[state.messages.length - 1];
    const message = {
      ...input,
      id: input.id ?? makeId("msg", input.channel_id, now, input.title),
      status: input.status ?? "draft",
      created_at: input.created_at ?? now,
      updated_at: input.updated_at ?? now,
      ack_by: input.ack_by ? [...input.ack_by] : [],
      witness_event_ids: input.witness_event_ids ? [...input.witness_event_ids] : [],
      prev_hash: input.prev_hash ?? prev?.hash,
      hash: "",
    };
    message.hash = hashRecord(message);
    state = { ...state, messages: [...state.messages, message] };
    persist();
    return message;
  };

  const sendMessage = (messageId: MessageId) => updateMessage(messageId, { status: "sent" });

  const ackMessage = (messageId: MessageId, agentId: AgentId) => {
    const message = requireMessage(messageId);
    const ack_by = Array.from(new Set([...message.ack_by, agentId]));
    const nextStatus = message.to_agents.every((agent) => ack_by.includes(agent)) ? "acknowledged" : message.status;
    return updateMessage(messageId, { ack_by, status: nextStatus });
  };

  const resolveMessage = (messageId: MessageId, agentId: AgentId) => {
    const message = requireMessage(messageId);
    const ack_by = Array.from(new Set([...message.ack_by, agentId]));
    return updateMessage(messageId, { ack_by, status: "resolved" });
  };

  const blockMessage = (messageId: MessageId, reason: string) => {
    const message = requireMessage(messageId);
    return updateMessage(messageId, { status: "blocked", bloqueo: [...message.bloqueo, reason] });
  };

  const createHandoffMessage = (handoff: CreateHandoffInput) =>
    createMessage({
      thread_id: `handoff-${handoff.fingerprint}`,
      channel_id: "#handoffs",
      from_agent: handoff.from_agent,
      to_agents: handoff.to_agents,
      kind: "handoff",
      priority: "P1",
      title: handoff.title,
      body: handoff.body,
      certeza: ["Handoff generado desde DUAT Telecom Core."],
      inferencia: ["El receptor debe continuar desde evidencia y fingerprint."],
      incognita: [],
      bloqueo: [],
      evidence_refs: handoff.evidence_refs,
      artifact_refs: handoff.artifact_refs ?? [],
      handoff_fingerprint: handoff.fingerprint,
      R_estimado: handoff.R_estimado,
      Phi_eff: handoff.Phi_eff,
    });

  const appendWitnessEvent = (input: Omit<WitnessEvent, "id" | "created_at" | "hash" | "prev_hash"> & Partial<WitnessEvent>) => {
    const now = new Date().toISOString();
    const prev = state.witness_events[state.witness_events.length - 1];
    const event: WitnessEvent = {
      ...input,
      id: input.id ?? makeId("wit", input.actor, now, input.action),
      created_at: input.created_at ?? now,
      prev_hash: input.prev_hash ?? prev?.hash,
      hash: "",
    };
    event.hash = hashRecord(event);
    state = { ...state, witness_events: [...state.witness_events, event] };
    persist();
    return event;
  };

  const getInbox = (agentId: AgentId) =>
    state.messages
      .filter((message) => message.to_agents.includes(agentId) || message.cc_agents?.includes(agentId))
      .sort(sortNewestFirst);

  const getOutbox = (agentId: AgentId) =>
    state.messages.filter((message) => message.from_agent === agentId).sort(sortNewestFirst);

  const getChannel = (channelId: ChannelId) => state.channels.find((channel) => channel.id === channelId);

  const getChannelMessages = (channelId: ChannelId) =>
    state.messages.filter((message) => message.channel_id === channelId).sort(sortNewestFirst);

  const getOpenP0 = () => state.messages.filter((message) => message.priority === "P0" && !["resolved", "archived"].includes(message.status));

  const exportBulletinMarkdown = () => {
    const bulletins = state.messages.filter((message) => message.kind === "bulletin").sort(sortNewestFirst);
    return [
      "# DUAT Telecom Core Bulletin",
      "",
      ...bulletins.flatMap((message) => [
        `## ${message.title}`,
        "",
        `- Canal: ${message.channel_id}`,
        `- Prioridad: ${message.priority}`,
        `- Estado: ${message.status}`,
        `- R_estimado: ${message.R_estimado.toFixed(2)}`,
        "",
        message.body,
        "",
        "### CERTEZA",
        ...message.certeza.map((item) => `- ${item}`),
        "",
        "### INFERENCIA",
        ...message.inferencia.map((item) => `- ${item}`),
        "",
        "### INCOGNITA",
        ...message.incognita.map((item) => `- ${item}`),
        "",
      ]),
    ].join("\n");
  };

  const exportMessageBusJson = () => JSON.stringify(state, null, 2);

  function updateMessage(messageId: MessageId, patch: Partial<ReturnType<typeof requireMessage>>) {
    const now = new Date().toISOString();
    let updated = requireMessage(messageId);
    state = {
      ...state,
      messages: state.messages.map((message) => {
        if (message.id !== messageId) return message;
        updated = { ...message, ...patch, updated_at: now, hash: "" };
        updated.hash = hashRecord(updated);
        return updated;
      }),
    };
    persist();
    return updated;
  }

  function requireMessage(messageId: MessageId) {
    const message = state.messages.find((candidate) => candidate.id === messageId);
    if (!message) throw new Error(`Message not found: ${messageId}`);
    return message;
  }

  return {
    getState,
    createMessage,
    sendMessage,
    ackMessage,
    resolveMessage,
    blockMessage,
    createHandoffMessage,
    appendWitnessEvent,
    getInbox,
    getOutbox,
    getChannel,
    getChannelMessages,
    getOpenP0,
    exportBulletinMarkdown,
    exportMessageBusJson,
  };
}

function cloneState(state: MessageBusState): MessageBusState {
  return JSON.parse(JSON.stringify(state)) as MessageBusState;
}

function sortNewestFirst(a: { created_at: string }, b: { created_at: string }) {
  return b.created_at.localeCompare(a.created_at);
}

function browserStorage(): StorageAdapter | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

function makeId(prefix: string, channel: string, createdAt: string, title: string) {
  return `${prefix}-${hashString(`${channel}:${createdAt}:${title}`).slice(0, 10)}`;
}

function hashRecord(value: unknown) {
  return `h-${hashString(JSON.stringify(value))}`;
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
