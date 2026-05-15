export type CommunityPrompt = {
  id: string;
  title: string;
  shortTitle: string;
  problemSolved: string;
  publicPath: string;
  status: "free" | "draft";
};

export type PromptPoll = {
  id: string;
  question: string;
  options: string[];
};

export type ObservatorioAgent = {
  id: string;
  role: string;
  publicFunction: string;
};

export const communityPrompts: CommunityPrompt[] = [
  {
    id: "scanner-seguridad-local",
    title: "Scanner de seguridad local para IA",
    shortTitle: "Scanner local",
    problemSolved:
      "Ayuda a revisar una carpeta, repo o paquete antes de que un agente ejecute cambios: no imprime secretos, no borra y separa riesgos de soluciones propuestas.",
    publicPath: "/prompts/01_scanner_seguridad_local.md",
    status: "free",
  },
  {
    id: "ahorro-tokens-extremo",
    title: "Ahorro de tokens extremo",
    shortTitle: "Ahorro tokens",
    problemSolved:
      "Convierte conversaciones largas o proyectos saturados en objetivo, estado, evidencia, omisiones y siguiente accion sin arrastrar contexto basura.",
    publicPath: "/prompts/02_ahorro_tokens_extremo.md",
    status: "free",
  },
  {
    id: "handoff-memoria-persistente",
    title: "Handoff de memoria persistente",
    shortTitle: "Handoff v2.1 lite",
    problemSolved:
      "Deja un cierre que otro agente puede reconstruir: CERTEZA, INFERENCIA, INCOGNITA, BLOQUEO, ACCION, ARTEFACTO y prueba de reconstruccion.",
    publicPath: "/prompts/03_handoff_memoria_persistente.md",
    status: "free",
  },
];

export const promptCampaignPolls: PromptPoll[] = [
  {
    id: "next-release",
    question: "Que quieres que libere despues?",
    options: [
      "Framework de sueno/memoria para IA local",
      "Biblioteca de nombres/personas de agentes",
      "Mini-simulacion DUAT publica",
    ],
  },
  {
    id: "agent-family",
    question: "Que familia de agentes quieres ver primero?",
    options: ["Observacionistas", "Cientificos / figuras historicas", "Dioses y mitologias"],
  },
];

export const observatorioAgents: ObservatorioAgent[] = [
  {
    id: "social-media-observatorio",
    role: "social-media-observatorio",
    publicFunction: "convierte avances tecnicos en publicaciones public-safe sin exponer el nucleo privado.",
  },
  {
    id: "prensa-observatorio",
    role: "prensa-observatorio",
    publicFunction: "prepara notas, preguntas y contexto para prensa o perfiles publicos.",
  },
  {
    id: "publicidad-growth-observatorio",
    role: "publicidad-growth-observatorio",
    publicFunction: "ordena experimentos de crecimiento sin promesas de resultado ni claims exagerados.",
  },
  {
    id: "editorial-research-release",
    role: "editorial-research-release",
    publicFunction: "traduce investigacion en briefs, muestras y notas revisadas.",
  },
  {
    id: "claims-falsifier-observatorio",
    role: "claims-falsifier-observatorio",
    publicFunction: "degrada, bloquea o pide evidencia para claims antes de publicarlos.",
  },
  {
    id: "community-sponsors-observatorio",
    role: "community-sponsors-observatorio",
    publicFunction: "mantiene la relacion con comunidad y sponsors sin vender acceso crudo al IP central.",
  },
];

export const symbolicAgentExamples = [
  "Maat-Curador",
  "Hypatia-Falsifier",
  "Hermes-Comms",
  "Ada-Workflow",
  "Ibn Sina-Research",
  "Quetzalcoatl-Community",
];

export const shortBook = {
  title: "MEDIOEVO: Informacion, Residuo y Observacion",
  status: "public-safe manuscript draft",
  publicPath: "/books/medioevo-informacion-residuo-observacion.md",
  description:
    "Libro corto y publico sobre la teoria de informacion MEDIOEVO como practica operativa: observar desde un estado, reducir residuo y cerrar con evidencia.",
};
