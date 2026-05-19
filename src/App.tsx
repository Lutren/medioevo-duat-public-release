import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  Cable,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Eye,
  ExternalLink,
  FileText,
  GitBranch,
  Globe2,
  Library,
  MonitorCog,
  Network,
  PackageCheck,
  Pause,
  Play,
  RadioTower,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, MouseEvent, PointerEvent } from "react";
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
import { booksCatalog, bookCatalogNotes } from "./content/books";
import { commercialAudit } from "./content/commercialAudit";
import { gumroadProducts, gumroadStoreUrl } from "./content/gumroadProducts";
import { observacionismoAudit } from "./content/observacionismoAudit";
import { communityPrompts, observatorioAgents, promptCampaignPolls, shortBook, symbolicAgentExamples } from "./content/promptCampaign";
import { productMatrix, storeOrder, type ProductMatrixItem } from "./content/products";
import { publicIdentity } from "./content/publicIdentity";
import "./styles/duat-display.css";

type LanguageCode = "en" | "es" | "ru" | "zh";

type LocalizedCopy = {
  languageLabel: string;
  translationStatus?: string;
  nav: Record<string, string>;
  landing: {
    eyebrow: string;
    title: string;
    body: string;
    panelKicker: string;
    panelTitle: string;
    panelBody: string;
    exploreTools: string;
    viewHandoff: string;
    cardsLabel: string;
    evidence: string;
    evidenceBody: string;
    boundaries: string;
    boundariesBody: string;
    continuity: string;
    continuityBody: string;
    advancedButton: string;
  };
  duatCity: {
    eyebrow: string;
    title: string;
    lede: string;
    notice: string;
    cityKicker: string;
    cityTitle: string;
    cityBody: string;
    argusKicker: string;
    argusTitle: string;
    argusBody: string;
    exploreTools: string;
    commandTitle: string;
    commandBody: string;
    commandHelp: string;
    commandInputLabel: string;
    commandPlaceholder: string;
    commandRun: string;
    transcriptLabel: string;
    visualEffects: string;
  };
};

const LANGUAGE_OPTIONS: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "ru", label: "RU draft" },
  { code: "zh", label: "ZH draft" },
];

const DEFAULT_LANGUAGE: LanguageCode = "en";
const LANGUAGE_STORAGE_KEY = "medioevo-duat-language";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/landing", label: "Landing" },
  { href: "/about", label: "About" },
  { href: "/store", label: "Store" },
  { href: "/prompts", label: "Prompts" },
  { href: "/blog", label: "Blog" },
  { href: "/despertar-preview", label: "Despertar" },
  { href: "/books", label: "Books" },
  { href: "/products", label: "Products" },
  { href: "/audit", label: "Audit" },
  { href: "/status", label: "Status" },
  { href: "/boundary", label: "Boundary" },
  { href: "/canon", label: "Canon" },
  { href: "/tools", label: "Tools" },
  { href: "/hub", label: "Hub" },
  { href: "/agents", label: "Agents" },
  { href: "/theory", label: "Theory" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/duat", label: "DUAT" },
  { href: "/telecom", label: "Telecom" },
  { href: "/handoff", label: "Handoff" },
  { href: "/handoff-hub", label: "HandoffHub" },
  { href: "/duat-devday", label: "DevDay" },
  { href: "/duat-city", label: "City" },
  { href: "/docs", label: "Docs" },
];

const I18N: Record<LanguageCode, LocalizedCopy> = {
  en: {
    languageLabel: "Language",
    nav: {
      "/": "Overview",
      "/landing": "Landing",
      "/about": "About",
      "/store": "Store",
      "/prompts": "Prompts",
      "/blog": "Blog",
      "/despertar-preview": "Despertar",
      "/books": "Books",
      "/products": "Products",
      "/audit": "Audit",
      "/status": "Status",
      "/boundary": "Boundary",
      "/canon": "Canon",
      "/tools": "Tools",
      "/duat": "DUAT",
      "/telecom": "Telecom",
      "/handoff": "Handoff",
      "/handoff-hub": "HandoffHub",
      "/duat-devday": "DevDay",
      "/duat-city": "City",
      "/docs": "Docs",
    },
    landing: {
      eyebrow: "Simple Mode",
      title: "A clearer way to run AI work",
      body: "MEDIOEVO / DUAT keeps agent work visible: what is known, what is allowed, what is blocked and what should happen next.",
      panelKicker: "Human first",
      panelTitle: "Start with the state, then choose the next safe action.",
      panelBody: "Instead of scattered chats and hidden decisions, this portal shows evidence, boundaries and continuity in one public-safe surface.",
      exploreTools: "Explore tools",
      viewHandoff: "View handoff",
      cardsLabel: "Simple Mode cards",
      evidence: "Evidence",
      evidenceBody: "Every action should know what supports it.",
      boundaries: "Boundaries",
      boundariesBody: "Private work stays protected before public action.",
      continuity: "Continuity",
      continuityBody: "Sessions can hand off state without starting over.",
      advancedButton: "Advanced OSIT details",
    },
    duatCity: {
      eyebrow: "Public demo route",
      title: "DUAT City",
      lede: "A public-safe map of MEDIOEVO / OSIT agent infrastructure.",
      notice: "Public-safe demo. This is not the full DUAT/GEODIA runtime. Protected systems, books, protected game systems, private prompt libraries, datasets, secrets and internal agent logic are not included.",
      cityKicker: "City shell",
      cityTitle: "Agent work as public districts",
      cityBody: "This route presents a toy city shell for visibility, evidence and safe routing. It does not connect to private runtimes, local logs or protected source material.",
      argusKicker: "Argus Firewall",
      argusTitle: "Boundary metaphor, not private security",
      argusBody: "Argus Firewall is a public-facing boundary metaphor for visibility, review and safe routing. It is not a claim of production security and does not expose private internals.",
      exploreTools: "Explore tools",
      commandTitle: "Command Console",
      commandBody: "Text-first shell for assistive navigation. It is a demo transcript only; it does not run private logic or game combat.",
      commandHelp: "Commands: help, open menu, go landing, go tools, equip, attack, inspect, back.",
      commandInputLabel: "Command input",
      commandPlaceholder: "Type help or go tools",
      commandRun: "Run command",
      transcriptLabel: "Command transcript",
      visualEffects: "Visual effects",
    },
  },
  es: {
    languageLabel: "Idioma",
    nav: {
      "/": "Inicio",
      "/landing": "Simple",
      "/about": "Acerca",
      "/store": "Tienda",
      "/prompts": "Prompts",
      "/blog": "Blog",
      "/despertar-preview": "Despertar",
      "/books": "Libros",
      "/products": "Productos",
      "/audit": "Auditoria",
      "/status": "Estado",
      "/boundary": "Limites",
      "/canon": "Canon",
      "/tools": "Herramientas",
      "/duat": "DUAT",
      "/telecom": "Telecom",
      "/handoff": "Handoff",
      "/handoff-hub": "HandoffHub",
      "/duat-devday": "DevDay",
      "/duat-city": "Ciudad",
      "/docs": "Docs",
    },
    landing: {
      eyebrow: "Modo simple",
      title: "Una forma mas clara de operar trabajo con IA",
      body: "MEDIOEVO / DUAT hace visible el trabajo de agentes: que se sabe, que se permite, que se bloquea y cual es el siguiente paso.",
      panelKicker: "Humano primero",
      panelTitle: "Empieza con el estado y luego elige la siguiente accion segura.",
      panelBody: "En vez de chats dispersos y decisiones ocultas, este portal muestra evidencia, limites y continuidad en una superficie publica segura.",
      exploreTools: "Explorar herramientas",
      viewHandoff: "Ver handoff",
      cardsLabel: "Tarjetas de modo simple",
      evidence: "Evidencia",
      evidenceBody: "Cada accion debe saber que la sostiene.",
      boundaries: "Limites",
      boundariesBody: "El trabajo privado queda protegido antes de la accion publica.",
      continuity: "Continuidad",
      continuityBody: "Las sesiones pueden entregar estado sin empezar de cero.",
      advancedButton: "Detalles OSIT avanzados",
    },
    duatCity: {
      eyebrow: "Ruta demo publica",
      title: "DUAT City",
      lede: "Un mapa publico seguro de la infraestructura de agentes MEDIOEVO / OSIT.",
      notice: "Demo publica segura. Esto no es el runtime completo DUAT/GEODIA. Sistemas protegidos, libros, sistemas de juego protegidos, bibliotecas privadas de prompts, datasets, secretos y logica interna de agentes no estan incluidos.",
      cityKicker: "Shell de ciudad",
      cityTitle: "Trabajo de agentes como distritos publicos",
      cityBody: "Esta ruta muestra una maqueta de ciudad para visibilidad, evidencia y enrutamiento seguro. No conecta con runtimes privados, logs locales ni material fuente protegido.",
      argusKicker: "Argus Firewall",
      argusTitle: "Metafora de frontera, no seguridad privada",
      argusBody: "Argus Firewall es una metafora publica de frontera para visibilidad, revision y enrutamiento seguro. No afirma seguridad de produccion ni expone internos privados.",
      exploreTools: "Explorar herramientas",
      commandTitle: "Consola de comandos",
      commandBody: "Shell textual para navegacion asistiva. Es solo una transcripcion demo; no ejecuta logica privada ni combate de juego.",
      commandHelp: "Comandos: help, open menu, go landing, go tools, equip, attack, inspect, back.",
      commandInputLabel: "Entrada de comando",
      commandPlaceholder: "Escribe help o go tools",
      commandRun: "Ejecutar",
      transcriptLabel: "Transcripcion de comandos",
      visualEffects: "Efectos visuales",
    },
  },
  ru: {
    languageLabel: "Язык",
    translationStatus: "Translation review pending. English and Spanish are the authoritative public-safe copy.",
    nav: {
      "/": "Обзор",
      "/landing": "Старт",
      "/about": "О проекте",
      "/store": "Магазин",
      "/prompts": "Prompts",
      "/blog": "Blog",
      "/despertar-preview": "Despertar",
      "/books": "Книги",
      "/products": "Продукты",
      "/audit": "Аудит",
      "/status": "Статус",
      "/boundary": "Границы",
      "/canon": "Канон",
      "/tools": "Инструменты",
      "/duat": "DUAT",
      "/telecom": "Telecom",
      "/handoff": "Handoff",
      "/handoff-hub": "HandoffHub",
      "/duat-devday": "DevDay",
      "/duat-city": "Город",
      "/docs": "Документы",
    },
    landing: {
      eyebrow: "Простой режим",
      title: "Более ясный способ вести работу с ИИ",
      body: "MEDIOEVO / DUAT показывает работу агентов: что известно, что разрешено, что заблокировано и какой следующий шаг.",
      panelKicker: "Сначала человек",
      panelTitle: "Начните с состояния, затем выберите следующее безопасное действие.",
      panelBody: "Вместо разрозненных чатов портал показывает доказательства, границы и непрерывность в публично безопасной форме.",
      exploreTools: "Открыть инструменты",
      viewHandoff: "Открыть handoff",
      cardsLabel: "Карты простого режима",
      evidence: "Доказательства",
      evidenceBody: "Каждое действие должно иметь основание.",
      boundaries: "Границы",
      boundariesBody: "Частная работа защищена до публичного действия.",
      continuity: "Непрерывность",
      continuityBody: "Сессии передают состояние без старта с нуля.",
      advancedButton: "Детали OSIT",
    },
    duatCity: {
      eyebrow: "Публичная demo route",
      title: "DUAT City",
      lede: "Публично безопасная карта инфраструктуры агентов MEDIOEVO / OSIT.",
      notice: "Публично безопасная демонстрация. Это не полный runtime DUAT/GEODIA. Защищенные системы, книги, protected game systems, private prompt libraries, datasets, secrets и внутренняя логика агентов не включены.",
      cityKicker: "Городская оболочка",
      cityTitle: "Работа агентов как публичные районы",
      cityBody: "Эта route показывает toy city shell для видимости, доказательств и безопасной маршрутизации. Она не подключается к private runtimes, local logs или защищенным источникам.",
      argusKicker: "Argus Firewall",
      argusTitle: "Метафора границы, не частная безопасность",
      argusBody: "Argus Firewall is a public-facing boundary metaphor for visibility, review and safe routing. It is not a claim of production security and does not expose private internals.",
      exploreTools: "Открыть инструменты",
      commandTitle: "Командная консоль",
      commandBody: "Текстовая оболочка для доступной навигации. Это только demo transcript; она не запускает private logic или game combat.",
      commandHelp: "Commands: help, open menu, go landing, go tools, equip, attack, inspect, back.",
      commandInputLabel: "Ввод команды",
      commandPlaceholder: "Введите help или go tools",
      commandRun: "Выполнить",
      transcriptLabel: "Транскрипт команд",
      visualEffects: "Визуальные эффекты",
    },
  },
  zh: {
    languageLabel: "语言",
    translationStatus: "Translation review pending. English and Spanish are the authoritative public-safe copy.",
    nav: {
      "/": "概览",
      "/landing": "入口",
      "/about": "关于",
      "/store": "商店",
      "/prompts": "Prompts",
      "/blog": "Blog",
      "/despertar-preview": "Despertar",
      "/books": "书籍",
      "/products": "产品",
      "/audit": "审计",
      "/status": "状态",
      "/boundary": "边界",
      "/canon": "规范",
      "/tools": "工具",
      "/duat": "DUAT",
      "/telecom": "Telecom",
      "/handoff": "交接",
      "/handoff-hub": "HandoffHub",
      "/duat-devday": "DevDay",
      "/duat-city": "城市",
      "/docs": "文档",
    },
    landing: {
      eyebrow: "简单模式",
      title: "更清晰地运行 AI 工作",
      body: "MEDIOEVO / DUAT 让代理工作可见：已知内容、允许内容、阻止内容以及下一步。",
      panelKicker: "人先于系统",
      panelTitle: "先读取状态，再选择下一个安全动作。",
      panelBody: "这个门户把证据、边界和连续性放在一个 public-safe 界面中，而不是分散聊天和隐藏决策。",
      exploreTools: "查看工具",
      viewHandoff: "查看交接",
      cardsLabel: "简单模式卡片",
      evidence: "证据",
      evidenceBody: "每个动作都应知道支持它的依据。",
      boundaries: "边界",
      boundariesBody: "公开动作前保护私人工作。",
      continuity: "连续性",
      continuityBody: "会话可以交接状态，不必从零开始。",
      advancedButton: "高级 OSIT 细节",
    },
    duatCity: {
      eyebrow: "公开演示路线",
      title: "DUAT City",
      lede: "MEDIOEVO / OSIT agent infrastructure 的 public-safe 地图。",
      notice: "Public-safe demo. This is not the full DUAT/GEODIA runtime. Protected systems, books, protected game systems, private prompt libraries, datasets, secrets and internal agent logic are not included.",
      cityKicker: "城市外壳",
      cityTitle: "把代理工作组织成公开区块",
      cityBody: "这条路线是一个 toy city shell，用于可见性、证据和安全路由。它不连接 private runtimes、local logs 或受保护源材料。",
      argusKicker: "Argus Firewall",
      argusTitle: "边界隐喻，不是私有安全系统",
      argusBody: "Argus Firewall is a public-facing boundary metaphor for visibility, review and safe routing. It is not a claim of production security and does not expose private internals.",
      exploreTools: "查看工具",
      commandTitle: "命令控制台",
      commandBody: "面向辅助导航的 text-first shell。它只是 demo transcript，不运行 private logic 或 game combat。",
      commandHelp: "Commands: help, open menu, go landing, go tools, equip, attack, inspect, back.",
      commandInputLabel: "命令输入",
      commandPlaceholder: "输入 help 或 go tools",
      commandRun: "运行命令",
      transcriptLabel: "命令记录",
      visualEffects: "视觉效果",
    },
  },
};

const ROUTE_PATHS = [
  "/",
  "/landing",
  "/about",
  "/books",
  "/store",
  "/prompts",
  "/blog",
  "/blog/prompts-definitivos",
  "/despertar-preview",
  "/despertar-preview.html",
  "/gumroad",
  "/products",
  "/audit",
  "/commercial-audit",
  "/status",
  "/boundary",
  "/canon",
  "/tools",
  "/hub",
  "/agents",
  "/theory",
  "/roadmap",
  "/updates/2026-05-18",
  "/updates-2026-05-18",
  "/duat",
  "/telecom",
  "/teleco",
  "/handoff",
  "/handoff-hub",
  "/handoff-engine",
  "/duat-devday",
  "/duat-city",
  "/docs",
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
  "STATUS.md",
  "PUBLIC_REPO_MAP.md",
  "PUBLICATION_BOUNDARY.md",
  "CLAIMS_BOUNDARY.md",
  "OPEN_SOURCE_ROADMAP.md",
  "MEDIOEVO_OVERVIEW.md",
  "DUAT_OVERVIEW.md",
  "TELECOM_CORE_OVERVIEW.md",
  "ARCHITECTURE.md",
  "HANDOFFHUB.md",
  "HANDOFF_v2_1_STATUS.md",
  "HANDOFF_v2_1_H-STD.yaml",
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

const DUAT_CITY_DISTRICTS: {
  icon: LucideIcon;
  name: string;
  function: string;
  gate: string;
}[] = [
  {
    icon: Eye,
    name: "Evidence District",
    function: "Shows what supports a public action before the next step is chosen.",
    gate: "GhostGate",
  },
  {
    icon: ShieldCheck,
    name: "Gate District",
    function: "Keeps local, review and blocked actions visually separated.",
    gate: "ActionGate",
  },
  {
    icon: GitBranch,
    name: "Continuity District",
    function: "Keeps session state legible so work can continue without guessing.",
    gate: "Handoff",
  },
  {
    icon: FileText,
    name: "Source Card District",
    function: "Turns public-safe references into cards without exposing private sources.",
    gate: "WitnessLog",
  },
  {
    icon: ClipboardCheck,
    name: "Handoff District",
    function: "Packages the next contract, checksum and reconstruction test.",
    gate: "Handoff",
  },
  {
    icon: AlertTriangle,
    name: "Boundary District",
    function: "Names protected areas before they drift into a public surface.",
    gate: "BoundaryCheck",
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

function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "en" || value === "es" || value === "ru" || value === "zh";
}

function readInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguageCode(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(typeof window === "undefined" ? "/" : window.location.pathname));
  const [language, setLanguage] = useState<LanguageCode>(() => readInitialLanguage());
  const copy = I18N[language] ?? I18N[DEFAULT_LANGUAGE];

  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [path]);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Language persistence is optional and never blocks rendering.
    }
  }, [language]);

  const goTo = useCallback((href: string) => {
    const next = normalizePath(href);
    window.history.pushState(null, "", next);
    setPath(next);
  }, []);

  const navigate = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    goTo(href);
  }, [goTo]);

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
              {copy.nav[item.href] ?? item.label}
            </a>
          ))}
        </nav>
        <LanguageSelect language={language} label={copy.languageLabel} onChange={setLanguage} />
      </header>

      {copy.translationStatus ? <p className="translation-status" role="status">{copy.translationStatus}</p> : null}

      {path === "/" ? <Overview navigate={navigate} /> : null}
      {path === "/landing" ? <LandingRoute navigate={navigate} copy={copy.landing} /> : null}
      {path === "/about" ? <AboutRoute navigate={navigate} /> : null}
      {path === "/books" ? <BooksRoute navigate={navigate} /> : null}
      {path === "/store" ? <StoreRoute navigate={navigate} /> : null}
      {path === "/prompts" ? <PromptsRoute navigate={navigate} /> : null}
      {path === "/blog" ? <BlogRoute navigate={navigate} /> : null}
      {path === "/blog/prompts-definitivos" ? <PromptCampaignRoute navigate={navigate} /> : null}
      {path === "/despertar-preview" || path === "/despertar-preview.html" ? <DespertarPreviewRoute navigate={navigate} /> : null}
      {path === "/gumroad" ? <GumroadRoute navigate={navigate} /> : null}
      {path === "/products" ? <ProductsRoute navigate={navigate} /> : null}
      {path === "/audit" ? <AuditRoute navigate={navigate} /> : null}
      {path === "/commercial-audit" ? <CommercialAuditRoute navigate={navigate} /> : null}
      {path === "/status" ? <StatusRoute navigate={navigate} /> : null}
      {path === "/boundary" ? <BoundaryRoute navigate={navigate} /> : null}
      {path === "/canon" ? <CanonRoute navigate={navigate} /> : null}
      {path === "/tools" ? <ToolsRoute navigate={navigate} /> : null}
      {path === "/hub" ? <HubRoute navigate={navigate} /> : null}
      {path === "/agents" ? <AgentsRoute navigate={navigate} /> : null}
      {path === "/theory" ? <TheoryRoute navigate={navigate} /> : null}
      {path === "/roadmap" ? <RoadmapRoute navigate={navigate} /> : null}
      {path === "/updates/2026-05-18" || path === "/updates-2026-05-18" ? <Update20260518Route navigate={navigate} /> : null}
      {path === "/duat" ? <DuatRoute /> : null}
      {path === "/telecom" || path === "/teleco" ? <TelecomCore /> : null}
      {path === "/handoff" || path === "/handoff-hub" ? <HandoffHubRoute navigate={navigate} /> : null}
      {path === "/handoff-engine" ? <HandoffEngineRoute navigate={navigate} /> : null}
      {path === "/duat-devday" ? <DevDayRoute /> : null}
      {path === "/duat-city" ? <DuatCityRoute navigate={navigate} goTo={goTo} copy={copy.duatCity} /> : null}
      {path === "/docs" ? <DocsRoute /> : null}
      {!ROUTE_PATHS.includes(path) ? <NotFound navigate={navigate} /> : null}
    </main>
  );
}

function LanguageSelect({ language, label, onChange }: { language: LanguageCode; label: string; onChange: (language: LanguageCode) => void }) {
  return (
    <label className="language-select">
      <span>{label}</span>
      <select value={language} onChange={(event) => onChange(event.target.value as LanguageCode)} aria-label={label}>
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>{option.label}</option>
        ))}
      </select>
    </label>
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
            <a className="command-link" href="/store" onClick={(event) => navigate(event, "/store")}>
              <ShoppingCart size={18} />
              Store
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
        <Metric label="Store" value="Gumroad link" />
        <Metric label="Secrets" value="Scan gated" />
      </section>

      <section className="section-band community-release">
        <RouteHeader
          eyebrow="Gracias a la comunidad"
          title="3 prompts gratuitos y un libro corto"
          body="La primera liberacion publica de esta campana comparte herramientas utiles sin entregar el nucleo privado: scanner local, ahorro de tokens, handoff persistente y una introduccion corta a informacion, residuo y observacion."
        />
        <div className="content-grid">
          {communityPrompts.map((prompt) => (
            <article className="content-panel prompt-card" key={prompt.id}>
              <ClipboardCheck size={20} />
              <div className="panel-kicker">
                <span>{prompt.status}</span>
                <span className="evidence-badge">PUBLIC_SAFE</span>
              </div>
              <h2>{prompt.shortTitle}</h2>
              <p>{prompt.problemSolved}</p>
              <a className="command-link" href={prompt.publicPath}>
                Open prompt
                <FileText size={16} />
              </a>
            </article>
          ))}
        </div>
        <div className="route-actions">
          <a className="command-link primary" href={shortBook.publicPath}>
            <BookOpenText size={18} />
            Read short book
          </a>
          <a className="command-link" href="/blog/prompts-definitivos" onClick={(event) => navigate(event, "/blog/prompts-definitivos")}>
            Campaign note
            <ArrowRight size={17} />
          </a>
          <a className="command-link" href="/duat" onClick={(event) => navigate(event, "/duat")}>
            See DUAT
            <Activity size={17} />
          </a>
        </div>
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

function LandingRoute({ navigate, copy }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void; copy: LocalizedCopy["landing"] }) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const advancedId = "landing-advanced-osit";

  return (
    <section className="route-surface simple-landing" data-testid="simple-mode-landing">
      <RouteHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        body={copy.body}
      />
      <div className="simple-mode-panel">
        <div className="simple-mode-copy">
          <p className="section-title">{copy.panelKicker}</p>
          <h2>{copy.panelTitle}</h2>
          <p>{copy.panelBody}</p>
          <div className="route-actions">
            <a className="command-link primary" href="/tools" onClick={(event) => navigate(event, "/tools")}>
              {copy.exploreTools}
              <ArrowRight size={17} />
            </a>
            <a className="command-link" href="/handoff" onClick={(event) => navigate(event, "/handoff")}>
              {copy.viewHandoff}
              <GitBranch size={17} />
            </a>
          </div>
        </div>
        <div className="simple-card-grid" aria-label={copy.cardsLabel}>
          <article className="simple-card">
            <CheckCircle2 size={20} />
            <h3>{copy.evidence}</h3>
            <p>{copy.evidenceBody}</p>
          </article>
          <article className="simple-card">
            <ShieldCheck size={20} />
            <h3>{copy.boundaries}</h3>
            <p>{copy.boundariesBody}</p>
          </article>
          <article className="simple-card">
            <GitBranch size={20} />
            <h3>{copy.continuity}</h3>
            <p>{copy.continuityBody}</p>
          </article>
        </div>
      </div>
      <section className="content-panel advanced-toggle-panel">
        <button
          className="icon-button"
          type="button"
          aria-expanded={advancedOpen}
          aria-controls={advancedId}
          onClick={() => setAdvancedOpen((current) => !current)}
        >
          {advancedOpen ? <Pause size={17} /> : <Play size={17} />}
          {copy.advancedButton}
        </button>
        <div id={advancedId} className={advancedOpen ? "advanced-details open" : "advanced-details"} hidden={!advancedOpen}>
          <p>
            OSIT keeps this public surface low-claim: observe state, separate evidence from inference, apply ActionGate and write a handoff before the next session.
          </p>
          <ul className="check-list">
            <li><CheckCircle2 size={16} /> No private runtime payloads.</li>
            <li><CheckCircle2 size={16} /> No unsupported scientific claims.</li>
            <li><CheckCircle2 size={16} /> No public action without a gate.</li>
          </ul>
        </div>
      </section>
    </section>
  );
}

function PromptsRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <BackButton navigate={navigate} />
      <RouteHeader
        eyebrow="Free prompts"
        title="3 public-safe prompts"
        body="These prompts are complete and free. They expose the public method only: evidence before action, residue reduction, source boundaries, claim review and reconstructable handoffs."
      />
      <div className="content-grid">
        {communityPrompts.map((prompt) => (
          <article className="content-panel prompt-card" key={prompt.id}>
            <ClipboardCheck size={20} />
            <div className="panel-kicker">
              <span>{prompt.status}</span>
              <span className="status-badge">download</span>
            </div>
            <h2>{prompt.title}</h2>
            <p>{prompt.problemSolved}</p>
            <a className="command-link primary" href={prompt.publicPath}>
              Open prompt
              <FileText size={16} />
            </a>
          </article>
        ))}
      </div>
      <section className="content-panel">
        <h2>{shortBook.title}</h2>
        <p>{shortBook.description}</p>
        <div className="route-actions">
          <a className="command-link primary" href={shortBook.publicPath}>
            Read manuscript
            <BookOpenText size={16} />
          </a>
          <a className="command-link" href="/blog/prompts-definitivos" onClick={(event) => navigate(event, "/blog/prompts-definitivos")}>
            Read campaign note
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </section>
  );
}

function BlogRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Blog"
        title="Public-safe notes"
        body="Short, crawlable notes about MEDIOEVO prompts, agent workflows, ActionGate, handoffs and DUAT without exposing private canon or internal runtime."
      />
      <div className="content-grid two">
        <article className="content-panel lead-panel">
          <FileText size={22} />
          <h2>Los 3 prompts definitivos para empezar con IA local</h2>
          <p>Scanner local, ahorro de tokens y handoff persistente como puerta de entrada publica a MEDIOEVO.</p>
          <a className="command-link primary" href="/blog/prompts-definitivos" onClick={(event) => navigate(event, "/blog/prompts-definitivos")}>
            Read note
            <ArrowRight size={16} />
          </a>
        </article>
        <article className="content-panel">
          <BookOpenText size={22} />
          <h2>{shortBook.title}</h2>
          <p>{shortBook.description}</p>
          <a className="command-link" href={shortBook.publicPath}>
            Open book draft
            <FileText size={16} />
          </a>
        </article>
      </div>
    </section>
  );
}

function PromptCampaignRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface campaign-page">
      <BackButton navigate={navigate} />
      <RouteHeader
        eyebrow="Prompt campaign"
        title="Los 3 prompts definitivos para empezar con IA local"
        body="La campana libera tres herramientas public-safe como lead magnet para video, comunidad y el libro corto de informacion MEDIOEVO."
      />
      <div className="content-grid">
        {communityPrompts.map((prompt, index) => (
          <article className="content-panel prompt-card" key={prompt.id}>
            <div className="panel-kicker">
              <ClipboardCheck size={18} />
              <span>Prompt {index + 1}</span>
            </div>
            <h2>{prompt.title}</h2>
            <p>{prompt.problemSolved}</p>
            <a className="command-link primary" href={prompt.publicPath}>
              Open full prompt
              <FileText size={16} />
            </a>
          </article>
        ))}
      </div>

      <section className="content-panel">
        <h2>CTA principal</h2>
        <p>{shortBook.description}</p>
        <div className="route-actions">
          <a className="command-link primary" href={shortBook.publicPath}>
            Read {shortBook.title}
            <BookOpenText size={16} />
          </a>
          <a className="command-link" href="/duat" onClick={(event) => navigate(event, "/duat")}>
            Open DUAT demo
            <Activity size={16} />
          </a>
        </div>
      </section>

      <section className="content-grid two">
        {promptCampaignPolls.map((poll) => (
          <article className="content-panel poll-card" key={poll.id}>
            <BarChart3 size={20} />
            <h2>{poll.question}</h2>
            <ul className="check-list">
              {poll.options.map((option) => (
                <li key={option}><CheckCircle2 size={16} />{option}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="content-panel">
        <h2>Observatorio agents</h2>
        <div className="agent-roster">
          {observatorioAgents.map((agent) => (
            <article className="mini-card" key={agent.id}>
              <UserRound size={18} />
              <div>
                <strong>{agent.role}</strong>
                <p>{agent.publicFunction}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <h2>Inspiracion simbolica</h2>
        <p className="muted-line">Public naming inspiration only. No endorsement, no claim and no private mythology release.</p>
        <div className="tag-row">
          {symbolicAgentExamples.map((name) => <span className="tag" key={name}>{name}</span>)}
        </div>
      </section>
    </section>
  );
}

function AboutRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Public identity"
        title={publicIdentity.publicName}
        body={publicIdentity.spanishBio}
      />
      <div className="content-grid two">
        <article className="content-panel lead-panel">
          <UserRound size={24} />
          <h2>{publicIdentity.primaryRole}</h2>
          <p>{publicIdentity.englishBio}</p>
          <div className="tag-row">
            {publicIdentity.roles.map((role) => (
              <span className="tag" key={role}>{role}</span>
            ))}
          </div>
        </article>
        <article className="content-panel">
          <ShieldCheck size={24} />
          <h2>Public release boundary</h2>
          <ul className="check-list">
            {publicIdentity.publicBoundaries.map((boundary) => (
              <li key={boundary}><CheckCircle2 size={16} />{boundary}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="content-grid two">
        <article className="content-panel">
          <h2>What MEDIOEVO is</h2>
          <p>{publicIdentity.medioevo}</p>
        </article>
        <article className="content-panel">
          <h2>What DUAT is</h2>
          <p>{publicIdentity.duat}</p>
        </article>
      </div>
      <section className="content-panel">
        <h2>Public offer surface</h2>
        <div className="module-grid compact">
          {publicIdentity.offerings.map((offering) => (
            <article className="mini-card" key={offering}>
              <PackageCheck size={18} />
              <strong>{offering}</strong>
            </article>
          ))}
        </div>
        <div className="route-actions">
          <a className="command-link primary" href="/store" onClick={(event) => navigate(event, "/store")}>
            <ShoppingCart size={18} />
            Open store
          </a>
          <a className="command-link" href="/books" onClick={(event) => navigate(event, "/books")}>
            <Library size={18} />
            Books
          </a>
        </div>
      </section>
    </section>
  );
}

function BooksRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Books"
        title="Public books catalog"
        body="This route is prepared for approved book descriptions and purchase links only. It does not include manuscripts, private canon, full drafts or vault material."
      />
      <div className="content-grid">
        {booksCatalog.map((book) => (
          <article className="content-panel product-panel" key={book.id}>
            <div className="panel-kicker">
              <Library size={18} />
              <span>{book.category}</span>
              <span className="status-badge">{book.status}</span>
            </div>
            {book.coverImage ? <img className="book-cover" src={book.coverImage} alt="" aria-hidden="true" /> : null}
            <h2>{book.title}</h2>
            {book.subtitle ? <p className="muted-line">{book.subtitle}</p> : null}
            <p>{book.description}</p>
            <p className="boundary-note">{book.privateBoundary}</p>
            {book.purchaseLink ? (
              <a className="command-link primary" href={book.purchaseLink} target="_blank" rel="noreferrer">
                View book
                <ExternalLink size={16} />
              </a>
            ) : (
              <span className="pending-link">Link pending</span>
            )}
          </article>
        ))}
      </div>
      <section className="content-panel">
        <h2>Catalog notes</h2>
        <ul className="check-list">
          {bookCatalogNotes.map((note) => (
            <li key={note}><CheckCircle2 size={16} />{note}</li>
          ))}
        </ul>
        <div className="route-actions">
          <a className="command-link" href="/store" onClick={(event) => navigate(event, "/store")}>
            <ShoppingCart size={18} />
            Store
          </a>
        </div>
      </section>
    </section>
  );
}

function DespertarPreviewRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  const product = gumroadProducts.find((item) => item.id === "medioevo-despertar-preview");
  const book = booksCatalog.find((item) => item.id === "medioevo-despertar-preview");

  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="MEDIOEVO books"
        title="DESPERTAR is the public entry"
        body="A single reader-facing door into MEDIOEVO, prepared with a human reading gate and local editorial QA. It stays separate from private archives, protected game material and external science claims."
      />
      <div className="content-grid two">
        <article className="content-panel lead-panel">
          <BookOpenText size={24} />
          {book?.coverImage ? <img className="book-cover feature-cover" src={book.coverImage} alt="" aria-hidden="true" /> : null}
          <h2>{book?.title ?? "MEDIOEVO: Despertar Preview"}</h2>
          <p>{book?.description}</p>
          <p className="boundary-note">{book?.privateBoundary}</p>
          <div className="route-actions">
            <a className="command-link primary" href={product?.gumroadUrl ?? "https://lrgonzalez.gumroad.com/l/dmqgzi"} target="_blank" rel="noreferrer">
              Open on Gumroad
              <ExternalLink size={16} />
            </a>
            <a className="command-link" href="/store" onClick={(event) => navigate(event, "/store")}>
              <ShoppingCart size={18} />
              Store
            </a>
          </div>
        </article>
        <article className="content-panel">
          <ShieldCheck size={24} />
          <h2>Publication boundary</h2>
          <ul className="check-list">
            <li><CheckCircle2 size={16} /> Public-safe preview only.</li>
            <li><CheckCircle2 size={16} /> No full private archive.</li>
            <li><CheckCircle2 size={16} /> No protected game-system distribution from this route.</li>
            <li><CheckCircle2 size={16} /> No real bestseller claim until market evidence exists.</li>
            <li><CheckCircle2 size={16} /> Diegetic systems remain fiction unless separately validated.</li>
          </ul>
        </article>
      </div>
      <section className="content-panel">
        <h2>What the preview solves</h2>
        <div className="module-grid compact">
          <article className="mini-card">
            <PackageCheck size={18} />
            <strong>One clean starting point</strong>
          </article>
          <article className="mini-card">
            <ShieldCheck size={18} />
            <strong>Private canon protected</strong>
          </article>
          <article className="mini-card">
            <ClipboardCheck size={18} />
            <strong>Market test ready locally</strong>
          </article>
        </div>
      </section>
    </section>
  );
}

function StoreRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  const visibleProducts = productMatrix.filter((product) => product.publicSafe && product.status !== "private");
  const bookProducts = visibleProducts.filter((product) => product.type === "book");
  const templateProducts = visibleProducts.filter((product) => ["template", "agent-pack"].includes(product.type) && product.status !== "live");
  const auditProducts = visibleProducts.filter((product) => ["audit", "consulting"].includes(product.type));
  const comingSoonProducts = visibleProducts.filter((product) => ["coming-soon", "needs-review"].includes(product.status) && !["book", "audit", "consulting"].includes(product.type));

  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Store"
        title="Commercial public surface"
        body="Direct Gumroad links only. No Gumroad API, tokens, dashboard writes or external scripts are used by this public site."
      />
      <section className="store-feature">
        {gumroadProducts.map((product) => (
          <article className="content-panel product-panel featured" key={product.id}>
            <img src={product.image} alt="" aria-hidden="true" />
            <div>
              <div className="panel-kicker">
                <ShoppingCart size={18} />
                <span>{product.status}</span>
                <span className="status-badge">{product.priceDisplay}</span>
              </div>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <p className="boundary-note">{product.publishRecommendation}</p>
              <div className="route-actions">
                <a className="command-link primary" href={product.gumroadUrl} target="_blank" rel="noreferrer">
                  Buy on Gumroad
                  <ExternalLink size={16} />
                </a>
                <a className="command-link" href="/gumroad" onClick={(event) => navigate(event, "/gumroad")}>
                  View product
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>
      <ProductSection title="Books" products={bookProducts} navigate={navigate} />
      <ProductSection title="Templates / packs" products={templateProducts} navigate={navigate} />
      <ProductSection title="Audits / services" products={auditProducts} navigate={navigate} />
      <ProductSection title="Coming soon" products={comingSoonProducts} navigate={navigate} />
      <section className="content-panel">
        <h2>Store order</h2>
        <ol className="ordered-list">
          {storeOrder.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </section>
    </section>
  );
}

function GumroadRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Gumroad"
        title="External checkout only"
        body="This page documents Gumroad integration as safe external links. The public site does not require or store Gumroad credentials."
      />
      <div className="content-grid">
        {gumroadProducts.map((product) => (
          <article className="content-panel product-panel" key={product.id}>
            <img className="product-thumb" src={product.image} alt="" aria-hidden="true" />
            <div className="panel-kicker">
              <ExternalLink size={18} />
              <span>{product.sitePlacement}</span>
              <span className="status-badge">{product.status}</span>
            </div>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <ul className="check-list">
              {product.auditNotes.map((note) => (
                <li key={note}><CheckCircle2 size={16} />{note}</li>
              ))}
            </ul>
            <div className="route-actions">
              <a className="command-link primary" href={product.gumroadUrl} target="_blank" rel="noreferrer">
                Open product
                <ExternalLink size={16} />
              </a>
              <a className="command-link" href={gumroadStoreUrl} target="_blank" rel="noreferrer">
                Open store
                <ExternalLink size={16} />
              </a>
              <a className="command-link" href="/store" onClick={(event) => navigate(event, "/store")}>
                Back to Store
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductsRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Product matrix"
        title="Publication order and risk map"
        body="This matrix separates live, draft, coming-soon and needs-review offers. It is not a publication action and does not expose private material."
      />
      <div className="product-matrix">
        {productMatrix.map((product) => (
          <article className="content-panel matrix-card" key={product.id}>
            <div className="panel-kicker">
              <PackageCheck size={18} />
              <span>{product.type}</span>
              <span className="status-badge">{product.status}</span>
              <span className="evidence-badge">{product.evidenceLevel}</span>
            </div>
            <h2>{product.title}</h2>
            <p>{product.longDescription}</p>
            <dl className="detail-list">
              <div><dt>Audience</dt><dd>{product.audience}</dd></div>
              <div><dt>Problem</dt><dd>{product.problemSolved}</dd></div>
              <div><dt>Value</dt><dd>{product.valueProposition}</dd></div>
              <div><dt>Price hypothesis</dt><dd>{product.priceRecommendation}</dd></div>
              <div><dt>Next action</dt><dd>{product.nextAction}</dd></div>
            </dl>
            <div className="risk-list">
              {product.risks.map((risk) => (
                <span key={risk}><AlertTriangle size={15} />{risk}</span>
              ))}
            </div>
            <ProductCta product={product} navigate={navigate} />
          </article>
        ))}
      </div>
    </section>
  );
}

function AuditRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  const audit = observacionismoAudit.currentSiteAudit;
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Observacionismo audit"
        title={observacionismoAudit.title}
        body={observacionismoAudit.purpose}
      />
      <section className="content-panel">
        <h2>{observacionismoAudit.subtitle}</h2>
        <div className="tag-row">
          {observacionismoAudit.fields.map((field) => <span className="tag" key={field}>{field}</span>)}
        </div>
      </section>
      <div className="content-grid two">
        <article className="content-panel">
          <h2>Regimenes</h2>
          {observacionismoAudit.regimes.map((regime) => (
            <StatusLine key={regime.name} label={regime.name} status={regime.description} tone={regime.name === "SATURADO" ? "blocked" : "ok"} />
          ))}
        </article>
        <article className="content-panel">
          <h2>Current site state</h2>
          <Metric label="ESTADO" value={audit.estado} />
          <Metric label="R estimado" value={audit.rEstimated} />
          <p className="boundary-note">{audit.actionGate}</p>
        </article>
      </div>
      <AuditColumn title="CERTEZA" items={audit.certeza} icon={CheckCircle2} />
      <AuditColumn title="INFERENCIA" items={audit.inferencia} icon={BarChart3} />
      <AuditColumn title="INCOGNITA" items={audit.incognita} icon={Eye} />
      <AuditColumn title="BLOQUEO" items={audit.bloqueo} icon={AlertTriangle} />
      <section className="content-panel">
        <h2>ACCION</h2>
        <p>{audit.recommendation}</p>
        <p className="boundary-note">{audit.nextAction}</p>
        <div className="route-actions">
          <a className="command-link" href="/commercial-audit" onClick={(event) => navigate(event, "/commercial-audit")}>
            <ClipboardCheck size={18} />
            Commercial audit
          </a>
        </div>
      </section>
    </section>
  );
}

function CommercialAuditRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Commercial audit"
        title="Professional publication path"
        body="A low-claim commercial review of positioning, ICP, product ladder, Gumroad strategy, conversion risks and manual metrics."
      />
      <section className="content-panel lead-panel">
        <ClipboardCheck size={24} />
        <h2>Positioning</h2>
        <p>{commercialAudit.positioning}</p>
      </section>
      <div className="content-grid two">
        <InfoList title="ICP" items={commercialAudit.icp} />
        <InfoList title="Product ladder" items={commercialAudit.productLadder} />
        <InfoList title="Gumroad strategy" items={commercialAudit.gumroadStrategy} />
        <InfoList title="Conversion audit" items={commercialAudit.conversionAudit} />
        <InfoList title="Commercial risk" items={commercialAudit.commercialRisk} tone="warn" />
        <InfoList title="Manual metrics" items={commercialAudit.manualMetrics} />
      </div>
      <section className="content-panel">
        <h2>Recommended publication sequence</h2>
        <ol className="ordered-list">
          {commercialAudit.recommendedSequence.map((item) => <li key={item}>{item}</li>)}
        </ol>
        <div className="route-actions">
          <a className="command-link primary" href="/store" onClick={(event) => navigate(event, "/store")}>
            <ShoppingCart size={18} />
            Store
          </a>
          <a className="command-link" href="/products" onClick={(event) => navigate(event, "/products")}>
            <PackageCheck size={18} />
            Product matrix
          </a>
        </div>
      </section>
    </section>
  );
}

function DuatRoute() {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="DUAT Display"
        title="Visual demo for observable agent state"
        body="A local synthetic simulation demonstrates live telemetry, state transitions and low-claim observability. It is a prototype display, not autonomous general intelligence or validated physics."
      />
      <DuatField />
    </section>
  );
}

function StatusRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Public status"
        title="Current public release state"
        body="This is a public-safe prototype release. It exposes the DUAT visual demo, MessageBus surface, Handoff v2.1 contract, boundary documents and toy/synthetic tooling only."
      />
      <div className="content-grid two">
        <article className="content-panel">
          <h2>Ready now</h2>
          <ul className="check-list">
            <li><CheckCircle2 size={16} /> ActionGate / WitnessLog documentation</li>
            <li><CheckCircle2 size={16} /> Handoff v2.1 public contract and templates</li>
            <li><CheckCircle2 size={16} /> DUAT display prototype with synthetic telemetry</li>
            <li><CheckCircle2 size={16} /> MessageBus and agent orchestration overview</li>
            <li><CheckCircle2 size={16} /> Public boundary and claim boundary docs</li>
          </ul>
        </article>
        <article className="content-panel">
          <h2>Blocked from public release</h2>
          <ul className="check-list warn">
            <li><AlertTriangle size={16} /> Private canon, internal prompt libraries and source vaults</li>
            <li><AlertTriangle size={16} /> Full books, manuscripts, protected game systems and DUAT/GEODIA internals</li>
            <li><AlertTriangle size={16} /> Credentials, tokens, local runtime logs and .env files</li>
            <li><AlertTriangle size={16} /> Unsupported claims about autonomous general intelligence, consciousness or physics</li>
          </ul>
        </article>
      </div>
      <section className="content-panel">
        <h2>Release gate</h2>
        <p>Publication remains gated by SecretScan, BoundaryCheck, Build, RouteCheck, Handoff v2.1 schema validation and reconstruction test.</p>
        <div className="route-actions">
          <a className="command-link primary" href="/handoff" onClick={(event) => navigate(event, "/handoff")}>
            <GitBranch size={18} />
            Handoff v2.1
          </a>
          <a className="command-link" href="/boundary" onClick={(event) => navigate(event, "/boundary")}>
            <ShieldCheck size={18} />
            Boundary
          </a>
        </div>
      </section>
    </section>
  );
}

function BoundaryRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <BackButton navigate={navigate} />
      <RouteHeader
        eyebrow="Publication boundary"
        title="Public-safe surface only"
        body="The public repository may publish methods, templates, gates and synthetic demos. It must not publish protected creative or private runtime assets."
      />
      <div className="content-grid two">
        <InfoList title="Publicable" items={["ActionGate", "WitnessLog", "Handoff v2.1", "Source Cards", "Claim Classifier", "Secret Scanner", "Canon Compiler", "Context Compressor", "agent templates", "toy demos", "synthetic data", "public roadmap"]} />
        <InfoList title="Protected" tone="warn" items={["full books and unpublished manuscripts", "protected game systems and assets", "complete DUAT/GEODIA", "Wabi-Sabi internals", "Claudio private runtime", "internal prompt libraries", "private datasets", "source zips", "credentials and local logs"]} />
      </div>
    </section>
  );
}

function CanonRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <BackButton navigate={navigate} />
      <RouteHeader
        eyebrow="Public canon"
        title="Operational canon, not private vault"
        body="This route summarizes the public-safe operating rules: evidence first, unknowns first, reversible action, explicit gates and handoff continuity."
      />
      <div className="content-grid">
        <WorkflowNode icon={Eye} title="Unknowns First" body="Start every handoff by naming gaps, blockers and decisions needed before action." />
        <WorkflowNode icon={ShieldCheck} title="ActionGate" body="Classify actions as APPROVE, REVIEW or BLOCK before execution." />
        <WorkflowNode icon={FileText} title="Source Cards" body="Preserve provenance without publishing raw private sources." />
        <WorkflowNode icon={GitBranch} title="Reconstruction Test" body="A new agent must recover state, next action, do-not list and gates from the handoff." />
      </div>
    </section>
  );
}

function ToolsRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <BackButton navigate={navigate} />
      <RouteHeader
        eyebrow="Public tools"
        title="Release-safe developer modules"
        body="The open-source lane is a toolkit for safer agent workflows and public demos. It is not a dump of private runtime or protected canon."
      />
      <div className="content-grid two">
        <InfoList title="Tooling candidates" items={["SecretScan", "BoundaryCheck", "Claim Classifier", "Handoff v2.1 validator", "Context Compressor", "Canon Compiler", "Source Card template", "WitnessLog reader"]} />
        <InfoList title="Demo constraints" tone="warn" items={["synthetic data only", "no local machine paths", "no credentials", "no private books", "no private prompt libraries", "no protected runtime internals"]} />
      </div>
    </section>
  );
}

function HandoffHubRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <BackButton navigate={navigate} />
      <RouteHeader
        eyebrow="Handoff v2.1"
        title="Unknowns-first continuity contract"
        body="The public HandoffHub now uses the HANDOFF v2.1 H-MIN/H-STD contract: unknowns first, next contract, required gates, semantic checksum, reconstruction test and append-only ledger path."
      />
      <div className="workflow-lanes">
        <WorkflowNode icon={Eye} title="Unknowns First" body="INCOGNITA, BLOQUEO and decisions needed are listed before recommendations." />
        <WorkflowNode icon={ClipboardCheck} title="Next Contract" body="Do now, do not, required gates, success criteria and stop conditions are explicit." />
        <WorkflowNode icon={GitBranch} title="Semantic Checksum" body="Canonical claims, hash and a check question prevent semantic drift." />
        <WorkflowNode icon={Database} title="Ledger" body="Append-only ledger path records sequence, supersession and evidence." />
      </div>
      <section className="handoff-panel">
        <p className="section-title">Current public handoff</p>
        <h2>HANDOFF v2.1 H-STD</h2>
        <p>Schema version 2.1. Public release state is REVIEW until SecretScan, BoundaryCheck, build, route check, schema validation and reconstruction test pass on the public package.</p>
        <ul className="check-list">
          <li><CheckCircle2 size={16} /> Unknowns First</li>
          <li><CheckCircle2 size={16} /> Next Contract</li>
          <li><CheckCircle2 size={16} /> Do Not list</li>
          <li><CheckCircle2 size={16} /> Required Gates</li>
          <li><CheckCircle2 size={16} /> Semantic Check</li>
          <li><CheckCircle2 size={16} /> Reconstruction Test</li>
          <li><CheckCircle2 size={16} /> Ledger path: docs/handoff_ledger.jsonl</li>
        </ul>
      </section>
    </section>
  );
}

function HandoffEngineRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <BackButton navigate={navigate} />
      <RouteHeader
        eyebrow="Handoff Engine"
        title="Continuity checks before the next agent"
        body="A public-safe read-only route for the handoff engine contract: state fingerprint, unknowns first, next contract, semantic check and ledger discipline."
      />
      <div className="workflow-lanes">
        <WorkflowNode icon={Eye} title="Read state" body="Start from the current fingerprint and explicit unknowns instead of implicit memory." />
        <WorkflowNode icon={ClipboardCheck} title="Check gates" body="Confirm ActionGate, SecretCheck and BoundaryCheck before changing state." />
        <WorkflowNode icon={GitBranch} title="Carry continuity" body="Record the next contract so another agent can continue without re-deriving context." />
      </div>
      <section className="handoff-panel">
        <p className="section-title">Engine boundary</p>
        <h2>Read-only public route</h2>
        <p>This route explains the continuity model. It does not connect to a backend, publish private handoffs or expose local runtime logs.</p>
      </section>
    </section>
  );
}

function DuatCityRoute({
  navigate,
  goTo,
  copy,
}: {
  navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  goTo: (href: string) => void;
  copy: LocalizedCopy["duatCity"];
}) {
  return (
    <section className="route-surface duat-city-page">
      <BackButton navigate={navigate} />
      <section className="duat-city-hero">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="duat-city-lede">{copy.lede}</p>
        <div className="duat-city-notice" role="note">
          <ShieldCheck size={18} />
          <p>{copy.notice}</p>
        </div>
      </section>

      <section className="duat-city-section">
        <div>
          <p className="section-title">{copy.cityKicker}</p>
          <h2>{copy.cityTitle}</h2>
          <p>{copy.cityBody}</p>
        </div>
        <div className="duat-city-grid">
          {DUAT_CITY_DISTRICTS.map((district) => (
            <DuatCityDistrictCard key={district.name} district={district} />
          ))}
        </div>
      </section>

      <section className="duat-city-argus">
        <div>
          <p className="section-title">{copy.argusKicker}</p>
          <h2>{copy.argusTitle}</h2>
          <p>{copy.argusBody}</p>
        </div>
        <a className="command-link primary" href="/tools" onClick={(event) => navigate(event, "/tools")}>
          {copy.exploreTools}
          <ArrowRight size={16} />
        </a>
      </section>

      <DuatCityCommandShell copy={copy} goTo={goTo} />
    </section>
  );
}

function DuatCityCommandShell({ copy, goTo }: { copy: LocalizedCopy["duatCity"]; goTo: (href: string) => void }) {
  const [command, setCommand] = useState("");
  const [visualEffects, setVisualEffects] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([
    copy.commandHelp,
  ]);

  useEffect(() => {
    setTranscript([copy.commandHelp]);
  }, [copy.commandHelp]);

  const runCommand = useCallback((rawCommand: string) => {
    const normalized = rawCommand.trim().toLowerCase();
    if (!normalized) return;

    const respond = (message: string) => setTranscript((current) => [...current, `> ${rawCommand}`, message].slice(-8));

    if (normalized === "help" || normalized === "open menu") {
      respond(copy.commandHelp);
      return;
    }
    if (normalized === "go landing") {
      respond("Opening /landing.");
      goTo("/landing");
      return;
    }
    if (normalized === "go tools") {
      respond("Opening /tools.");
      goTo("/tools");
      return;
    }
    if (normalized === "back") {
      respond("Returning to Simple Mode.");
      goTo("/landing");
      return;
    }
    if (normalized === "inspect") {
      respond("Inspect: public demo route, six districts, no private runtime connected.");
      return;
    }
    if (normalized === "equip" || normalized === "attack") {
      respond("Demo shell only: command logged, no game state or combat is executed.");
      return;
    }
    respond("Unknown command. Try: help, open menu, go landing, go tools, inspect, back.");
  }, [copy.commandHelp, goTo]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(command);
    setCommand("");
  };

  return (
    <section className={visualEffects ? "duat-command-shell" : "duat-command-shell effects-muted"} aria-labelledby="duat-command-shell-title">
      <div>
        <p className="section-title">Accessible shell</p>
        <h2 id="duat-command-shell-title">{copy.commandTitle}</h2>
        <p>{copy.commandBody}</p>
        <p className="muted-line">{copy.commandHelp}</p>
      </div>
      <label className="visual-effects-toggle">
        <input type="checkbox" checked={visualEffects} onChange={(event) => setVisualEffects(event.target.checked)} aria-label={copy.visualEffects} />
        <span>{copy.visualEffects}</span>
      </label>
      <form className="command-form" onSubmit={onSubmit}>
        <label>
          <span>{copy.commandInputLabel}</span>
          <input value={command} onChange={(event) => setCommand(event.target.value)} placeholder={copy.commandPlaceholder} autoComplete="off" aria-label={copy.commandInputLabel} />
        </label>
        <button className="command-link primary" type="submit">{copy.commandRun}</button>
      </form>
      <div className="command-transcript" role="log" aria-live="polite" aria-label={copy.transcriptLabel}>
        {transcript.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
    </section>
  );
}

function DuatCityDistrictCard({ district }: { district: (typeof DUAT_CITY_DISTRICTS)[number] }) {
  const Icon = district.icon;
  return (
    <article className="duat-city-card">
      <Icon size={20} />
      <h3>{district.name}</h3>
      <p>{district.function}</p>
      <dl>
        <div>
          <dt>Status</dt>
          <dd>PUBLIC_DEMO</dd>
        </div>
        <div>
          <dt>Gate</dt>
          <dd>{district.gate}</dd>
        </div>
      </dl>
    </article>
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
             This page uses the approved DUAT DevDay asset pack and keeps the claim boundary explicit: orchestration display, prototype and public demo, not externally verified autonomous general intelligence.
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

function HubRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="MEDIOEVO Hub v0.1"
        title="Public-safe OSIT and local-agent status"
        body="A public overview of the MEDIOEVO / OSIT method, DUAT synthetic simulation work, Wabi local workbench evidence and the Agent Hub concept. This page is read-only and does not connect to private Claudio or Wabi runtimes."
      />
      <div className="signal-strip">
        <Metric label="Public layer" value="READ_ONLY" />
        <Metric label="Local execution" value="NOT_CONNECTED" />
        <Metric label="Claim gate" value="ACTIVE" />
        <Metric label="Private runtime" value="PROTECTED" />
      </div>
      <div className="module-grid" style={{ marginTop: 18 }}>
        <ModuleCard icon={BrainCircuit} title="OSIT method" body="State-aware information work: observe from an existing state, reduce residue, use gates and preserve evidence." />
        <ModuleCard icon={BarChart3} title="DUAT status" body="Synthetic simulation and display lane for public demos, replay, evidence panels and falsifier-oriented work." />
        <ModuleCard icon={Workflow} title="Wabi status" body="Local workbench summary: provider state remains reviewed; gated workpack and BrowserBridge selection are local-only and evidence-backed." />
        <ModuleCard icon={Network} title="Agent Hub" body="Public concept for agent roles, queues, gates, workpacks and handoffs. Private messages and local execution are not exposed." />
        <ModuleCard icon={MonitorCog} title="Mission Control" body="Local read-only command surface for agents, chat search, workpacks, scheduler, BrowserBridge, provider state, risks and evidence." />
        <ModuleCard icon={Cable} title="Wabi MCP Bridge" body="Planned local bridge for safe tools: read-only first, prepare-only drafts second and gated-write only with evidence." />
        <ModuleCard icon={ShieldCheck} title="Boundary" body="Public pages exclude protected manuscripts, private canon, protected game systems, internal prompts, datasets and internal runtime." />
        <ModuleCard icon={ClipboardCheck} title="QA" body="Public updates ship with build, test, secret scan, boundary scan and source-intake review before publication." />
      </div>
      <div className="route-actions">
        <a className="command-link primary" href="/theory" onClick={(event) => navigate(event, "/theory")}>Read theory summary</a>
        <a className="command-link" href="/agents" onClick={(event) => navigate(event, "/agents")}>View agent roles</a>
        <a className="command-link" href="/roadmap" onClick={(event) => navigate(event, "/roadmap")}>View roadmap</a>
        <a className="command-link" href="/updates/2026-05-18" onClick={(event) => navigate(event, "/updates/2026-05-18")}>View update</a>
      </div>
    </section>
  );
}

function AgentsRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  const publicAgents = [
    ["Core Orchestrator", "Routes local tasks through evidence and gates."],
    ["Gatekeeper", "Blocks unsafe publication, cloud calls and unsupported claims."],
    ["Memory Keeper", "Maintains handoff, witness and continuity records."],
    ["Wabi Local Programmer", "Represents fallback-only local coding loops in sandbox."],
    ["Test Runner", "Keeps local proof tied to tests and compile checks."],
    ["Release Sentinel", "Separates public-safe updates from protected internal work."],
    ["Mission Control Reader", "Summarizes local operational evidence without executing or mutating."],
    ["MCP Bridge Planner", "Designs safe read-only and draft-only tool access before any gated write path."],
    ["DUAT Display Agent", "Maintains display concepts and synthetic evidence panels."],
    ["GEODIA Sim Agent", "Tracks synthetic simulation work without real prediction claims."],
  ];
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Agent Hub v0.1"
        title="Agent roles without private execution"
        body="These cards describe public-safe roles. They are not live internal agents, do not expose local messages and cannot execute Claudio from the website."
      />
      <div className="content-grid">
        {publicAgents.map(([name, body]) => (
          <article className="content-panel" key={name}>
            <Network size={20} />
            <h2>{name}</h2>
            <p>{body}</p>
            <p className="muted-line">Public status: role card only.</p>
          </article>
        ))}
      </div>
      <div className="content-grid two">
        <InfoList title="Public buttons allowed" items={["View roadmap", "Read theory summary", "Open update", "Copy public-safe prompt text"]} />
        <InfoList title="Private actions blocked" tone="warn" items={["Run Claudio", "Queue internal work", "Read private messages", "Access local Wabi endpoints"]} />
      </div>
      <div className="route-actions">
        <a className="command-link" href="/hub" onClick={(event) => navigate(event, "/hub")}>Back to hub</a>
      </div>
    </section>
  );
}

function TheoryRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Public-safe theory"
        title="OSIT as an operational framework"
        body="The public theory layer is presented as proposed theory and engineering method. It is intentionally smaller than the private canon and does not present proof-level physics claims."
      />
      <div className="workflow-lanes">
        <WorkflowNode icon={Eye} title="Observer state" body="Work begins from an existing state, not from a blank context." />
        <WorkflowNode icon={Activity} title="Residue" body="Accumulated unresolved state should be reduced before expanding scope." />
        <WorkflowNode icon={ShieldCheck} title="Gates" body="ActionGate and GhostGate separate planning from side effects and rollback." />
        <WorkflowNode icon={FileText} title="Handoff" body="Continuity is externalized into evidence, briefs and fingerprints." />
      </div>
      <div className="content-grid two">
        <InfoList title="Safe public framing" items={["Proposed theory", "Operational method", "Synthetic simulation", "Local-first tooling", "Evidence-gated workflow"]} />
        <InfoList title="Blocked framing" tone="warn" items={["General-intelligence achievement claims", "New-physics proof claims", "Real-world prediction guarantees", "Absolute safety claims", "Private canon transfer"]} />
      </div>
      <div className="route-actions">
        <a className="command-link primary" href="/roadmap" onClick={(event) => navigate(event, "/roadmap")}>View roadmap</a>
        <a className="command-link" href="/hub" onClick={(event) => navigate(event, "/hub")}>Back to hub</a>
      </div>
    </section>
  );
}

function RoadmapRoute({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Roadmap"
        title="Public-safe pending work"
        body="The roadmap separates completed public-safe progress from research and blocked work. Private execution remains local."
      />
      <div className="content-grid">
        <InfoList title="Done" items={["Wabi Operational Workbench consolidated", "Local Execute v0.2", "Workpack Bridge v0.1", "Agent Chat Routing v0.2", "Agent Chat persistence/search v0.3", "Workpack Scheduler v0.1", "Multi-step Workpacks v0.2", "BrowserBridge Selector Pack v0.2", "Claudio Mission Control v0.1", "Source Intake registration discipline"]} />
        <InfoList title="Next" items={["Wabi MCP Server scaffold v0.2", "Mission Control v0.2 read-only alerts and filters", "Scheduler priorities/dependencies v0.2", "BrowserBridge setup guide", "Source Intake falsifier tests"]} />
        <InfoList title="Research" items={["OSIT public-safe articles", "DUAT/Wabi evidence navigation", "Manual NVIDIA route review before retry"]} />
        <InfoList title="Blocked" tone="warn" items={["NVIDIA smoke retry until route review passes", "Public bridge into private Claudio", "MCP publish, deploy or delete tools", "Publishing full canon or private runtime"]} />
      </div>
      <div className="route-actions">
        <a className="command-link primary" href="/updates/2026-05-18" onClick={(event) => navigate(event, "/updates/2026-05-18")}>Read update</a>
        <a className="command-link" href="/hub" onClick={(event) => navigate(event, "/hub")}>Back to hub</a>
      </div>
    </section>
  );
}

function Update20260518Route({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <section className="route-surface">
      <RouteHeader
        eyebrow="Update 2026-05-18"
        title="MEDIOEVO Hub and local agent hub split"
        body="This update introduces a public-safe hub and a separate local operator hub. Public pages are informational. Local execution remains gated and private."
      />
      <div className="content-grid two">
        <article className="content-panel">
          <h2>Public hub</h2>
          <p>Summarizes OSIT, DUAT, Wabi, Agent Hub roles, roadmap and boundaries. It does not expose private paths, local endpoints, internal messages or protected source material.</p>
        </article>
        <article className="content-panel">
          <h2>Local hub</h2>
          <p>Runs only on the owner machine. It prepares TaskSpecs, runs gates, packages workpacks, schedules manual ticks and records witness events. It does not expose private execution to the public site.</p>
        </article>
      </div>
      <div className="content-grid">
        <StatusLine label="Wabi provider public-safe status" status="SMOKE_FAIL_REDACTED / route REVIEW" tone="blocked" />
        <StatusLine label="NVIDIA next smoke" status="DO_NOT_CALL" tone="blocked" />
        <StatusLine label="Coding acceptance" status="v0.3 PASS locally" />
        <StatusLine label="Workpack scheduler" status="manual tick / local-only" />
        <StatusLine label="Multi-step workpacks" status="v0.2 PASS locally" />
        <StatusLine label="Agent Chat search" status="v0.3 local-only / no public export" />
        <StatusLine label="Mission Control" status="v0.1 read-only / no execution" />
        <StatusLine label="Wabi MCP Bridge" status="v0.1 plan / read-only first" />
        <StatusLine label="BrowserBridge selector" status="dry-run first / proposal-only" />
        <StatusLine label="Source Intake" status="registered before import" />
        <StatusLine label="Publication boundary" status="Public-safe summaries only" />
      </div>
      <div className="route-actions">
        <a className="command-link primary" href="/hub" onClick={(event) => navigate(event, "/hub")}>Open hub</a>
        <a className="command-link" href="/theory" onClick={(event) => navigate(event, "/theory")}>Theory summary</a>
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
        body="These files are curated for a public repository. They avoid private routes, secrets, unreviewed vault material and unsupported autonomous general intelligence claims."
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
      <RouteHeader eyebrow="404" title="Route not found" body="The public release exposes Overview, About, Books, Store, Prompts, Blog, Gumroad, Products, Audit, Status, Boundary, Canon, Tools, DUAT, Telecom Core, Handoff v2.1, DevDay, City and Docs routes." />
      <a className="command-link primary" href="/" onClick={(event) => navigate(event, "/")}>
        <ArrowRight size={17} />
        Return overview
      </a>
    </section>
  );
}

function ProductSection({ title, products, navigate }: { title: string; products: ProductMatrixItem[]; navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  if (products.length === 0) return null;
  return (
    <section className="store-section">
      <h2>{title}</h2>
      <div className="content-grid">
        {products.map((product) => (
          <article className="content-panel product-panel" key={product.id}>
            <div className="panel-kicker">
              <PackageCheck size={18} />
              <span>{product.type}</span>
              <span className="status-badge">{product.status}</span>
              <span className="evidence-badge">{product.evidenceLevel}</span>
            </div>
            <h3>{product.title}</h3>
            <p>{product.valueProposition}</p>
            <p className="muted-line">{product.priceRecommendation}</p>
            <ProductCta product={product} navigate={navigate} />
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductCta({ product, navigate }: { product: ProductMatrixItem; navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  if (product.gumroadUrl) {
    return (
      <a className="command-link primary" href={product.gumroadUrl} target="_blank" rel="noreferrer">
        Buy on Gumroad
        <ExternalLink size={16} />
      </a>
    );
  }
  if (product.siteUrl) {
    return (
      <a className="command-link" href={product.siteUrl} onClick={(event) => navigate(event, product.siteUrl ?? "/")}>
        View details
      </a>
    );
  }
  return <span className="pending-link">Not public yet</span>;
}

function AuditColumn({ title, items, icon: Icon }: { title: string; items: string[]; icon: LucideIcon }) {
  return (
    <section className="content-panel">
      <h2>{title}</h2>
      <ul className="check-list">
        {items.map((item) => (
          <li key={item}><Icon size={16} />{item}</li>
        ))}
      </ul>
    </section>
  );
}

function InfoList({ title, items, tone = "ok" }: { title: string; items: string[]; tone?: "ok" | "warn" }) {
  return (
    <article className="content-panel">
      <h2>{title}</h2>
      <ul className={tone === "warn" ? "check-list warn" : "check-list"}>
        {items.map((item) => (
          <li key={item}>{tone === "warn" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}{item}</li>
        ))}
      </ul>
    </article>
  );
}

function BackButton({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void }) {
  return (
    <a className="back-button" href="/landing" onClick={(event) => navigate(event, "/landing")}>
      <ArrowLeft size={17} />
      Back to Simple Mode
    </a>
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

  const fillPercent = Math.round(metrics.mean * 100);
  const eventUnlocked = !compact && (metrics.mean >= 0.045 || metrics.liveness >= 0.56 || metrics.cosmologyState === "MAAT" || metrics.cosmologyState === "OSIRIS");

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
            <div className={eventUnlocked ? "duat-unlock-panel unlocked" : "duat-unlock-panel"} aria-live="polite">
              <div className="unlock-sigil" aria-hidden="true">{eventUnlocked ? "III" : "--"}</div>
              <div>
                <span className="section-title">Unlocked event</span>
                <strong>{eventUnlocked ? "Continuity node opened" : "Fill threshold pending"}</strong>
                <p>
                  {eventUnlocked
                    ? "The field has enough public demo activity to surface a continuity reward: record state, evidence and next action."
                    : `Current fill ${fillPercent}%. Draw, seed DUAT or observe until the public-safe threshold opens.`}
                </p>
                <a className="command-link" href="/prompts/03_handoff_memoria_persistente.md">
                  Relevant prompt
                  <FileText size={15} />
                </a>
              </div>
            </div>
            <div className="duat-next-panel">
              <span className="section-title">Where this goes</span>
              <p>
                This public simulation can grow into synthetic scenarios, benchmarkable handoffs and teaching views. It does not expose private DUAT/GEODIA runtime, datasets, formulas or autonomous execution.
              </p>
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
  if (path === "/despertar-preview.html") return "/despertar-preview";
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}
