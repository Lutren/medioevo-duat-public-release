export const observacionismoAudit = {
  title: "Observacionismo Public Audit",
  subtitle: "Evidence-first public audit framework",
  purpose:
    "Use a public-safe Observacionismo format to separate what was observed, what is inferred, what remains unknown, what is blocked, and what action is justified.",
  fields: [
    "Objetivo",
    "Senal observada",
    "Ruido detectado",
    "R estimado",
    "CERTEZA",
    "INFERENCIA",
    "INCOGNITA",
    "BLOQUEO",
    "ActionGate",
    "Evidencia",
    "Recomendacion",
    "Proxima accion",
  ],
  regimes: [
    { name: "OPTIMO", description: "High clarity, low residue, next action is safe." },
    { name: "FUNCIONAL", description: "Usable surface with known improvements." },
    { name: "CARGADO", description: "Too much noise, risk or missing evidence for publication." },
    { name: "SATURADO", description: "Stop and reduce scope before any public action." },
  ],
  currentSiteAudit: {
    estado: "FUNCIONAL",
    rEstimated: "0.42",
    actionGate: "LOCAL_ONLY_APPROVE, external publication remains blocked unless separately authorized.",
    certeza: [
      "The repo already exposes public-safe DUAT routes and docs.",
      "The README states that private canon, vaults, credentials and unpublished research are excluded.",
      "The site had no dedicated About, Store, Books, Audit or Commercial Audit route before this agent pass.",
    ],
    inferencia: [
      "Buyer journey improves if the live DUAT Templates link is visible from Store and About.",
      "Commercial trust improves when product status, claim boundary and next action are explicit.",
    ],
    incognita: [
      "Exact approved book links are not present in this repo.",
      "Current Gumroad price is intentionally left to Gumroad as source of truth.",
      "No analytics or external conversion data was consulted.",
    ],
    bloqueo: [
      "No Gumroad API, deploy, DNS, Cloudflare, GitHub push or release action is authorized for this pass.",
      "No private canon, full books, internal vaults or local runtime logs can be imported.",
    ],
    recommendation:
      "Keep the public surface low-claim: prototype, public release, orchestration display, template pack, audit framework and commercial catalog.",
    nextAction: "Run local QA, verify routes, verify external Gumroad URL and hand off blockers.",
  },
};
