import {
  Archive,
  Bell,
  CheckCircle2,
  Database,
  FileJson,
  GitBranch,
  Inbox,
  ListTodo,
  RadioTower,
  ScrollText,
  Send,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { createInitialMessageBusState } from "../messagebus/seed";
import { createMessageBusStore, loadMessageBusState } from "../messagebus/service";
import type { AgentMessage, MessageBusState, StorageAdapter } from "../messagebus/types";

type MessageBusStore = ReturnType<typeof createMessageBusStore>;

export function TelecomCore() {
  const storage = typeof window === "undefined" ? undefined : (window.localStorage as StorageAdapter);
  const storeRef = useRef<MessageBusStore>();
  if (!storeRef.current) {
    storeRef.current = createMessageBusStore(loadMessageBusState(storage), storage);
  }

  const store = storeRef.current;
  const [state, setState] = useState<MessageBusState>(() => store.getState());
  const [operatorAgent, setOperatorAgent] = useState("human_operator");

  const refresh = () => setState(store.getState());
  const latestBulletin = [...state.messages].filter((message) => message.kind === "bulletin").sort(sortNewestFirst)[0];
  const inbox = store.getInbox(operatorAgent).slice(0, 5);
  const outbox = store.getOutbox("codex_engineer").slice(0, 5);
  const openHandoffs = state.messages.filter((message) => message.kind === "handoff" && !["resolved", "archived"].includes(message.status));
  const p0Alerts = store.getOpenP0();
  const taskQueue = state.messages.filter((message) => message.kind === "task" && !["resolved", "archived"].includes(message.status));
  const canonUpdates = state.messages.filter((message) => message.kind === "canon_update");
  const securityReviews = state.messages.filter((message) => message.kind === "security_review");
  const artifactMessages = state.messages.filter((message) => message.kind === "artifact" || message.artifact_refs.length > 0);

  const acknowledgeFirstP0 = () => {
    const first = p0Alerts[0];
    if (!first) return;
    store.ackMessage(first.id, operatorAgent);
    refresh();
  };

  const resetMockState = () => {
    storeRef.current = createMessageBusStore(createInitialMessageBusState(), storage);
    setState(storeRef.current.getState());
  };

  return (
    <main className="telecom-shell">
      <header className="telecom-topbar">
        <section>
          <p className="eyebrow">DUAT TELECOM CORE · MEDIOEVO MESSAGEBUS</p>
          <h1>Agent Bulletin Hub</h1>
        </section>
        <section className="telecom-actions" aria-label="Acciones del MessageBus">
          <select value={operatorAgent} onChange={(event) => setOperatorAgent(event.target.value)} aria-label="Agente operador">
            {state.agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <button className="icon-button" onClick={() => downloadText("duat-telecom-bulletin.md", store.exportBulletinMarkdown(), "text/markdown")}>
            <ScrollText size={17} />
            Bulletin
          </button>
          <button className="icon-button" onClick={() => downloadText("duat-messagebus.json", store.exportMessageBusJson(), "application/json")}>
            <FileJson size={17} />
            JSON
          </button>
          <button className="icon-button" onClick={resetMockState}>
            <Database size={17} />
            Seed
          </button>
          <a className="icon-button" href="/">
            <GitBranch size={17} />
            Genesis
          </a>
        </section>
      </header>

      <section className="telecom-summary" aria-label="Telemetria DUAT Telecom Core">
        <Metric label="Canales" value={String(state.channels.length)} />
        <Metric label="Agentes" value={String(state.agents.length)} />
        <Metric label="P0 abiertos" value={String(p0Alerts.length)} tone={p0Alerts.length ? "alert" : "normal"} />
        <Metric label="Witness events" value={String(state.witness_events.length)} />
        <Metric label="R bus" value={averageResidue(state.messages).toFixed(2)} />
        <Metric label="Phi eff" value={averagePhi(state.messages).toFixed(2)} />
      </section>

      <section className="telecom-grid">
        <Panel title="Latest Bulletin" icon={Bell}>
          {latestBulletin ? <MessageCompact message={latestBulletin} /> : <EmptyState text="Sin bulletin activo." />}
        </Panel>

        <Panel title="Agent Inbox" icon={Inbox}>
          <MessageList messages={inbox} />
        </Panel>

        <Panel title="Agent Outbox" icon={Send}>
          <MessageList messages={outbox} />
        </Panel>

        <Panel title="Active Channels" icon={RadioTower}>
          <div className="channel-list">
            {state.channels.map((channel) => (
              <div key={channel.id} className="channel-row">
                <strong>{channel.id}</strong>
                <span>{channel.retention_policy} · {channel.visibility}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Open Handoffs" icon={GitBranch}>
          <MessageList messages={openHandoffs} />
        </Panel>

        <Panel title="WitnessLog Timeline" icon={ScrollText}>
          <div className="timeline">
            {state.witness_events.slice(-6).reverse().map((event) => (
              <div key={event.id} className="timeline-event">
                <span>{event.actor}</span>
                <strong>{event.action}</strong>
                <small>{event.result}</small>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="P0 Alerts" icon={Siren} tone="alert">
          <MessageList messages={p0Alerts} />
          <button className="icon-button wide" onClick={acknowledgeFirstP0} disabled={p0Alerts.length === 0}>
            <CheckCircle2 size={17} />
            Ack P0
          </button>
        </Panel>

        <Panel title="Task Queue" icon={ListTodo}>
          <MessageList messages={taskQueue} />
        </Panel>

        <Panel title="Canon Updates" icon={Archive}>
          <MessageList messages={canonUpdates} />
        </Panel>

        <Panel title="Security Review" icon={ShieldAlert} tone="alert">
          <MessageList messages={securityReviews} />
        </Panel>

        <Panel title="Artifacts" icon={Archive}>
          <MessageList messages={artifactMessages.slice(0, 6)} />
        </Panel>
      </section>
    </main>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
  tone = "normal",
}: {
  title: string;
  icon: typeof Bell;
  children: ReactNode;
  tone?: "normal" | "alert";
}) {
  return (
    <section className={tone === "alert" ? "telecom-panel alert" : "telecom-panel"}>
      <header>
        <Icon size={17} />
        <p className="section-title">{title}</p>
      </header>
      {children}
    </section>
  );
}

function Metric({ label, value, tone = "normal" }: { label: string; value: string; tone?: "normal" | "alert" }) {
  return (
    <div className={tone === "alert" ? "telecom-metric alert" : "telecom-metric"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MessageList({ messages }: { messages: AgentMessage[] }) {
  if (!messages.length) return <EmptyState text="Sin mensajes abiertos." />;
  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageCompact key={message.id} message={message} />
      ))}
    </div>
  );
}

function MessageCompact({ message }: { message: AgentMessage }) {
  return (
    <article className="message-compact">
      <div>
        <span className={`priority ${message.priority.toLowerCase()}`}>{message.priority}</span>
        <span>{message.channel_id}</span>
        <span>{message.status}</span>
      </div>
      <strong>{message.title}</strong>
      <p>{message.body}</p>
      {message.action_required ? <small>{message.action_required}</small> : null}
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}

function averageResidue(messages: AgentMessage[]) {
  if (!messages.length) return 0;
  return messages.reduce((acc, message) => acc + message.R_estimado, 0) / messages.length;
}

function averagePhi(messages: AgentMessage[]) {
  const values = messages.map((message) => message.Phi_eff).filter((value): value is number => typeof value === "number");
  if (!values.length) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function sortNewestFirst(a: AgentMessage, b: AgentMessage) {
  return b.created_at.localeCompare(a.created_at);
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
