import {
  Activity,
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  Database,
  Eye,
  FileText,
  GitBranch,
  Globe2,
  Network,
  Pause,
  Play,
  RadioTower,
  RefreshCw,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import { DuatEngine } from "./simulation/engine";
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  type ActiveObserver,
  type OverlayMode,
  type ObserverProfile,
  type SimulationMetrics,
  type SimulationParams,
  type ToolMode,
} from "./simulation/types";
import { DEFAULT_PARAMS } from "./theory/benchmarks";
import { MetricsTracker } from "./theory/metrics";
import { DEFAULT_OBSERVER_A, DEFAULT_OBSERVER_B } from "./theory/observers";
import { FieldCanvas } from "./ui/FieldCanvas";
import { TelecomCore } from "./ui/TelecomCore";
import "./styles/duat-display.css";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/duat", label: "DUAT" },
  { href: "/telecom", label: "Telecom" },
  { href: "/handoff-hub", label: "HandoffHub" },
  { href: "/duat-devday", label: "DevDay" },
  { href: "/docs", label: "Docs" },
];

const PUBLIC_MODULES = [
  {
    icon: Eye,
    title: "DUAT Display",
    body: "Visual operating layer for agents, memory, workflows, handoffs and geospatial context.",
  },
  {
    icon: GitBranch,
    title: "HandoffHub",
    body: "Continuity layer that turns static handoffs into living state with fingerprints and evidence.",
  },
  {
    icon: RadioTower,
    title: "DUAT Telecom Core",
    body: "Bulletin board, inbox, outbox, task queue, WitnessLog stream, security channel and artifact registry.",
  },
  {
    icon: Network,
    title: "MEDIOEVO MessageBus",
    body: "Typed communication bus for coordination between agents and release surfaces.",
  },
  {
    icon: BrainCircuit,
    title: "CEREBRO",
    body: "Canon and memory layer for structured consultation without exposing private vaults.",
  },
  {
    icon: Workflow,
    title: "Wabi-Sabi / Claudio",
    body: "Local-first orchestration and runtime operators for reversible, evidence-backed work.",
  },
];

const DOCS = [
  "PUBLIC_README.md",
  "PUBLIC_SCOPE.md",
  "MEDIOEVO_OVERVIEW.md",
  "DUAT_OVERVIEW.md",
  "TELECOM_CORE_OVERVIEW.md",
  "ARCHITECTURE.md",
  "HANDOFFHUB.md",
  "DUAT_TELECOM_CORE.md",
  "AGENT_ORCHESTRATION.md",
  "OBSERVACIONISMO_PUBLIC.md",
  "DEV_DAY_SUBMISSION.md",
  "DEV_DAY_SUBMISSION_TEXT_EN.md",
];

const DEVDAY_MODULES = [
  {
    icon: Network,
    title: "Agent Orchestration",
    body: "Specialized agents remain visible as roles, status, channels and handoff owners.",
    kpi: "5 active lanes",
  },
  {
    icon: Globe2,
    title: "Geospatial Context",
    body: "Operational information can be arranged spatially when location and logistics matter.",
    kpi: "142 sources",
  },
  {
    icon: Database,
    title: "Memory Status",
    body: "Persistent context, claims, artifacts and project state are exposed as inspectable telemetry.",
    kpi: "87% health",
  },
  {
    icon: Workflow,
    title: "Workflow Graph",
    body: "Work moves through intake, analysis, planning, execution, evaluation and handoff.",
    kpi: "24 workflows",
  },
  {
    icon: BrainCircuit,
    title: "Knowledge Integration",
    body: "CEREBRO and public-safe memory surfaces connect evidence without publishing private canon.",
    kpi: "curated layer",
  },
  {
    icon: GitBranch,
    title: "Handoff Stream",
    body: "Fingerprints and evidence references let the next agent continue without re-deriving state.",
    kpi: "live continuity",
  },
  {
    icon: FileText,
    title: "WitnessLog",
    body: "Append-only events provide a visible trail for tests, scans, builds and decisions.",
    kpi: "evidence first",
  },
  {
    icon: ShieldCheck,
    title: "ActionGate",
    body: "External action remains blocked until secrets, claims, repo and deploy gates pass.",
    kpi: "push blocked",
  },
];

const EMPTY_METRICS: SimulationMetrics = {
  mean: 0,
  variance: 0,
  entropy: 0,
  activity: 0,
  edge: 0,
  gMean: 0,
  lMean: 0,
  balance: 0,
  lgBalance: 0,
  spectralEntropy: 0,
  dimObs: 1,
  atumScore: 0,
  osirisScore: 0,
  clipArtifactRatio: 0,
  liveness: 0,
  residue: 0,
  phiEff: 1,
  centroidX: GRID_WIDTH / 2,
  centroidY: GRID_HEIGHT / 2,
  persistentFrames: 0,
  cosmologyState: "NU",
};

export default function App() {
  const [path, setPath] = useState(() => normalizePath(typeof window === "undefined" ? "/" : window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [path]);

  const navigate = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const next = normalizePath(href);
    window.history.pushState(null, "", next);
    setPath(next);
  }, []);

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand-lockup" href="/" onClick={(event) => navigate(event, "/")}>
          <img src="/duat-assets/brand/duat-logo-mark.svg" alt="" aria-hidden="true" />
          <span>
            <strong>MEDIOEVO / DUAT</strong>
            <small>Public Release</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} className={path === item.href || (item.href === "/telecom" && path === "/teleco") ? "active" : ""} href={item.href} onClick={(event) => navigate(event, item.href)}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {path === "/" ? <Overview navigate={navigate} /> : null}
      {path === "/duat" ? <DuatRoute /> : null}
      {path === "/telecom" || path === "/teleco" ? <TelecomCore /> : null}
      {path === "/handoff-hub" ? <HandoffHubRoute /> : null}
      {path === "/duat-devday" ? <DevDayRoute /> : null}
      {path === "/docs" ? <DocsRoute /> : null}
      {!["/", "/duat", "/telecom", "/teleco", "/handoff-hub", "/duat-devday", "/docs"].includes(path) ? <NotFound navigate={navigate} /> : null}
    </main>
  );
}

function Overview({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Cognitive engineering · agent orchestration · public demo</p>
          <h1>MEDIOEVO / DUAT</h1>
          <p className="hero-lede">
            MEDIOEVO is a cognitive engineering and agent orchestration framework focused on reducing informational residue across complex workflows.
            DUAT is the visual operating layer for agents, memory, workflows, handoffs, geospatial context and system coordination.
          </p>
          <div className="hero-actions">
            <a className="command-link primary" href="/duat" onClick={(event) => navigate(event, "/duat")}>
              <Activity size={18} />
              Open DUAT
              <ArrowRight size={17} />
            </a>
            <a className="command-link" href="/telecom" onClick={(event) => navigate(event, "/telecom")}>
              <RadioTower size={18} />
              Telecom Core
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-label="DUAT visual system preview">
          <DuatField compact />
        </div>
      </section>

      <section className="signal-strip" aria-label="Release status">
        <Metric label="Status" value="Prototype" />
        <Metric label="Boundary" value="Public-safe" />
        <Metric label="Secrets" value="Scan gated" />
        <Metric label="Deploy" value="Not pushed" />
      </section>

      <section className="section-band">
        <RouteHeader
          eyebrow="Public modules"
          title="Architecture surfaced for the web"
          body="The release exposes product-level concepts, a DUAT visual demo and a mock MessageBus. Private canon, vaults, credentials and raw archives stay outside this tree."
        />
        <div className="module-grid">
          {PUBLIC_MODULES.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </section>
    </>
  );
}

function DuatRoute() {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="DUAT Display"
        title="Visual demo for observable agent state"
        body="A local synthetic simulation demonstrates live telemetry, state transitions and low-claim observability. It is a prototype display, not AGI or validated physics."
      />
      <DuatField />
    </section>
  );
}

function HandoffHubRoute() {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="HandoffHub"
        title="Continuity between agents"
        body="HandoffHub treats a handoff as state: task, evidence, confidence, blocker, fingerprint and next action. The public release shows the contract without exposing private runtime logs."
      />
      <div className="workflow-lanes">
        <WorkflowNode icon={FileText} title="Context" body="Curated brief, scope, source boundary and task owner." />
        <WorkflowNode icon={ShieldCheck} title="Gate" body="Secret scan, ActionGate status, publication block and claim boundary." />
        <WorkflowNode icon={GitBranch} title="Fingerprint" body="Stable handoff id that lets the next agent resume without guessing." />
        <WorkflowNode icon={Database} title="Evidence" body="Build reports, tests, manifests and included/excluded file lists." />
      </div>
      <section className="handoff-panel">
        <p className="section-title">Current public handoff</p>
        <h2>MDV-PUBLISH-GH-SPACE-91D4</h2>
        <p>Prepare local public release, validate secrets/build, commit locally and stop before push or deploy until repo and platform are confirmed.</p>
      </section>
    </section>
  );
}

function DevDayRoute() {
  return (
    <section className="duat-devday-page">
      <div className="duat-devday-hero">
        <div className="duat-devday-copy">
          <div className="duat-devday-brand">
            <img src="/duat-assets/brand/duat-logo-mark.svg" alt="DUAT logo mark" />
            <img src="/duat-assets/brand/duat-wordmark.svg" alt="DUAT wordmark" />
          </div>
          <p className="duat-devday-label">OpenAI DevDay concept visual · public release candidate</p>
          <h1>DUAT</h1>
          <h2>Adaptive Intelligence Display</h2>
          <p>
            DUAT is a cognitive display and orchestration layer for advanced AI work. It turns fragmented information into structured, inspectable workflows by coordinating specialized agents, persistent memory, geospatial context, evidence, gates and handoffs in one operational surface.
          </p>
          <p>
            This page uses the approved DUAT DevDay asset pack and keeps the claim boundary explicit: orchestration display, prototype and public demo, not externally verified AGI.
          </p>
        </div>
        <div className="duat-devday-visual" aria-label="DUAT DevDay approved asset preview">
          <figure className="duat-devday-frame primary">
            <img src="/duat-assets/posters/png/duat-display-concept-generated.png" alt="DUAT adaptive intelligence display concept" />
          </figure>
          <div className="duat-devday-frame secondary">
            <img src="/duat-assets/posters/png/duat-devday-hero.png" alt="DUAT DevDay hero visual" />
            <img src="/duat-assets/posters/png/duat-social-card.png" alt="DUAT social card visual" />
          </div>
        </div>
      </div>
      <div className="duat-devday-modules">
        {DEVDAY_MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <article className="duat-devday-module" key={module.title}>
              <header>
                <Icon size={18} />
                <span className="duat-devday-label">{module.title}</span>
              </header>
              <h3>{module.title}</h3>
              <p>{module.body}</p>
              <div className="duat-devday-kpi">
                <span>status</span>
                <strong>{module.kpi}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DocsRoute() {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Documentation"
        title="Public docs included in the repo"
        body="These files are curated for a public repository. They avoid private routes, secrets, unreviewed vault material and unsupported AGI claims."
      />
      <div className="docs-grid">
        {DOCS.map((doc) => (
          <article className="doc-card" key={doc}>
            <BookOpenText size={20} />
            <strong>{doc}</strong>
            <span>docs/{doc}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function NotFound({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader eyebrow="404" title="Route not found" body="The public release exposes the overview, DUAT demo, Telecom Core, HandoffHub, DevDay and Docs routes." />
      <a className="command-link primary" href="/" onClick={(event) => navigate(event, "/")}>
        <ArrowRight size={17} />
        Return overview
      </a>
    </section>
  );
}

function DuatField({ compact = false }: { compact?: boolean }) {
  const engineRef = useRef(new DuatEngine(compact ? 20260512 : 734567));
  const trackerRef = useRef(new MetricsTracker());
  const pointerDownRef = useRef(false);
  const activeObserverRef = useRef<ActiveObserver | null>(null);
  const lastTsRef = useRef(0);
  const toolRef = useRef<ToolMode>("draw");
  const paramsRef = useRef<SimulationParams>({ ...DEFAULT_PARAMS, running: true, speed: compact ? 1.4 : 1.1 });
  const [params, setParams] = useState<SimulationParams>(paramsRef.current);
  const [metrics, setMetrics] = useState<SimulationMetrics>(EMPTY_METRICS);
  const [overlay, setOverlay] = useState<OverlayMode>("psi");
  const [tool, setTool] = useState<ToolMode>("draw");
  const [activeObserver, setActiveObserver] = useState<ActiveObserver | null>(null);
  const [renderTick, setRenderTick] = useState(0);

  const observerA = useMemo<ObserverProfile>(() => DEFAULT_OBSERVER_A, []);
  const observerB = useMemo<ObserverProfile>(() => DEFAULT_OBSERVER_B, []);
  paramsRef.current = params;
  toolRef.current = tool;

  useEffect(() => {
    engineRef.current.seedDuat(Math.floor(GRID_WIDTH / 2), Math.floor(GRID_HEIGHT / 2));
    let raf = 0;
    let active = true;
    const loop = (ts: number) => {
      if (!active) return;
      raf = requestAnimationFrame(loop);
      const p = paramsRef.current;
      const interval = 1000 / (14 * p.speed);
      if (!p.running || ts - lastTsRef.current < interval) {
        setRenderTick((tick) => tick + 1);
        return;
      }
      lastTsRef.current = ts;
      const engine = engineRef.current;
      engine.step(p, activeObserverRef.current);
      setMetrics(trackerRef.current.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, p, engine.lastClipRatio));
      setRenderTick((tick) => tick + 1);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  const updateParams = useCallback((patch: Partial<SimulationParams>) => {
    setParams((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => {
    engineRef.current.resetNu();
    engineRef.current.seedDuat(Math.floor(GRID_WIDTH / 2), Math.floor(GRID_HEIGHT / 2));
    trackerRef.current.reset();
    setMetrics(EMPTY_METRICS);
    setRenderTick((tick) => tick + 1);
  }, []);

  const applyTool = useCallback((nextTool: ToolMode) => {
    setTool(nextTool);
    const engine = engineRef.current;
    const cx = Math.floor(engine.width / 2);
    const cy = Math.floor(engine.height / 2);
    if (nextTool === "atum") engine.seedAtum(cx, cy);
    if (nextTool === "duat") engine.seedDuat(cx, cy);
    if (nextTool === "osiris") engine.seedOsiris(cx, cy);
    setRenderTick((tick) => tick + 1);
  }, []);

  const handlePointer = useCallback((event: PointerEvent<HTMLCanvasElement>, force = false) => {
    if (!pointerDownRef.current && !force) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * GRID_WIDTH);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * GRID_HEIGHT);
    const engine = engineRef.current;
    const activeTool = toolRef.current;
    if (activeTool === "draw") engine.paint(x, y, 2, 1);
    if (activeTool === "erase") engine.paint(x, y, 3, 0);
    if (activeTool === "atum") engine.seedAtum(x, y);
    if (activeTool === "duat") engine.seedDuat(x, y);
    if (activeTool === "osiris") engine.seedOsiris(x, y);
    if (activeTool === "observe") {
      const observer = { x, y, strength: paramsRef.current.observerStrength, profile: observerA };
      activeObserverRef.current = observer;
      setActiveObserver(observer);
    }
    setRenderTick((tick) => tick + 1);
  }, [observerA]);

  const stopPointer = useCallback(() => {
    pointerDownRef.current = false;
    activeObserverRef.current = null;
    setActiveObserver(null);
  }, []);

  return (
    <section className={compact ? "duat-console compact" : "duat-console"}>
      <div className="field-panel">
        <FieldCanvas
          width={GRID_WIDTH}
          height={GRID_HEIGHT}
          psi={engineRef.current.psi}
          gravity={engineRef.current.gravity}
          light={engineRef.current.light}
          overlay={overlay}
          observerA={observerA}
          observerB={observerB}
          activeObserver={activeObserver}
          renderTick={renderTick}
          onFieldPointerDown={(event) => {
            pointerDownRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            handlePointer(event, true);
          }}
          onFieldPointerMove={(event) => handlePointer(event)}
          onFieldPointerUp={stopPointer}
        />
        <div className="field-overlay top-left">
          <span>G order</span>
          <span>L signal</span>
          <span>O observer</span>
        </div>
        <div className="field-overlay bottom-right">
          <span>R {metrics.residue.toFixed(2)}</span>
          <span>Phi {metrics.phiEff.toFixed(2)}</span>
          <span>{metrics.cosmologyState}</span>
        </div>
      </div>
      <aside className="control-panel">
        <div className="panel-title">
          <span className="section-title">Telemetry</span>
          <strong>{metrics.cosmologyState}</strong>
        </div>
        <div className="telemetry-grid">
          <Metric label="Activity" value={metrics.activity.toFixed(2)} />
          <Metric label="Entropy" value={metrics.entropy.toFixed(2)} />
          <Metric label="Balance" value={metrics.balance.toFixed(2)} />
          <Metric label="Liveness" value={metrics.liveness.toFixed(2)} />
        </div>
        {!compact ? (
          <>
            <div className="control-row">
              <button className="icon-button primary" onClick={() => updateParams({ running: !params.running })}>
                {params.running ? <Pause size={17} /> : <Play size={17} />}
                {params.running ? "Pause" : "Run"}
              </button>
              <button className="icon-button" onClick={reset}>
                <RefreshCw size={17} />
                Reset
              </button>
            </div>
            <div className="control-grid">
              {(["draw", "observe", "atum", "duat", "osiris", "erase"] as ToolMode[]).map((item) => (
                <button key={item} className={tool === item ? "tool active" : "tool"} onClick={() => applyTool(item)}>
                  {item}
                </button>
              ))}
            </div>
            <div className="control-grid">
              {(["psi", "gravity", "light", "observer-delta"] as OverlayMode[]).map((item) => (
                <button key={item} className={overlay === item ? "tool active" : "tool"} onClick={() => setOverlay(item)}>
                  {item}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </aside>
    </section>
  );
}

function RouteHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <header className="route-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}

function ModuleCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <article className="module-card">
      <Icon size={22} />
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  );
}

function WorkflowNode({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <article className="workflow-node">
      <Icon size={22} />
      <strong>{title}</strong>
      <p>{body}</p>
    </article>
  );
}

function StatusLine({ label, status, tone = "ok" }: { label: string; status: string; tone?: "ok" | "blocked" }) {
  return (
    <div className={tone === "blocked" ? "status-line blocked" : "status-line"}>
      <span>{label}</span>
      <strong>{status}</strong>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function normalizePath(path: string) {
  if (!path || path === "/index.html") return "/";
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}
