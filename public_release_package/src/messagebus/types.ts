export type AgentId = string;
export type MessageId = string;
export type ChannelId = string;
export type Fingerprint = string;

export type MessagePriority = "P0" | "P1" | "P2" | "P3";
export type MessageStatus =
  | "draft"
  | "queued"
  | "sent"
  | "delivered"
  | "acknowledged"
  | "blocked"
  | "resolved"
  | "archived";

export type MessageKind =
  | "bulletin"
  | "handoff"
  | "task"
  | "question"
  | "answer"
  | "alert"
  | "decision"
  | "artifact"
  | "canon_update"
  | "security_review"
  | "build_report"
  | "test_report";

export interface AgentMessage {
  id: MessageId;
  parent_id?: MessageId;
  thread_id: string;
  channel_id: ChannelId;
  from_agent: AgentId;
  to_agents: AgentId[];
  cc_agents?: AgentId[];
  kind: MessageKind;
  priority: MessagePriority;
  status: MessageStatus;
  title: string;
  body: string;
  certeza: string[];
  inferencia: string[];
  incognita: string[];
  bloqueo: string[];
  action_required?: string;
  due_at?: string;
  evidence_refs: string[];
  artifact_refs: string[];
  handoff_fingerprint?: Fingerprint;
  witness_event_ids: string[];
  R_estimado: number;
  Phi_eff?: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  ack_by: AgentId[];
  hash: string;
  prev_hash?: string;
}

export interface AgentRecord {
  id: AgentId;
  name: string;
  role: string;
  status: "offline" | "idle" | "working" | "blocked" | "reviewing";
  capabilities: string[];
  allowed_channels: ChannelId[];
  current_task_id?: string;
  last_handoff?: Fingerprint;
}

export interface AgentChannel {
  id: ChannelId;
  name: string;
  purpose: string;
  visibility: "system" | "team" | "private";
  allowed_kinds: MessageKind[];
  retention_policy: "ephemeral" | "session" | "project" | "permanent";
}

export interface WitnessEvent {
  id: string;
  actor: AgentId;
  action: string;
  result: string;
  R_before?: number;
  R_after?: number;
  evidence_refs: string[];
  created_at: string;
  prev_hash?: string;
  hash: string;
}

export interface MessageBusState {
  agents: AgentRecord[];
  channels: AgentChannel[];
  messages: AgentMessage[];
  witness_events: WitnessEvent[];
}

export type CreateMessageInput = Omit<
  AgentMessage,
  "id" | "status" | "created_at" | "updated_at" | "ack_by" | "hash" | "prev_hash" | "witness_event_ids"
> &
  Partial<Pick<AgentMessage, "id" | "status" | "ack_by" | "created_at" | "updated_at" | "prev_hash" | "witness_event_ids">>;

export interface CreateHandoffInput {
  from_agent: AgentId;
  to_agents: AgentId[];
  title: string;
  body: string;
  fingerprint: Fingerprint;
  evidence_refs: string[];
  artifact_refs?: string[];
  R_estimado: number;
  Phi_eff?: number;
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
