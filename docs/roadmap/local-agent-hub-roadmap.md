# Local Agent Hub Roadmap

This roadmap describes the public-safe direction of the MEDIOEVO local agent system. It is a public overview, not a live bridge into the private local runtime.

## Done

- Public MEDIOEVO Hub created.
- Public Agent Hub role map created.
- Local Operator Hub v0.1 created inside the local Wabi/Claudio environment.
- Local agent chat v0.1 created as a local-only coordination surface.
- Task preparation, GhostGate review and local queue flow are defined for internal use.
- Local Execute v0.2 demonstrated sandbox/docs-local execution with TaskSpec, GhostGate, rollback and WitnessLog.
- Workpack Bridge v0.1 connected local hub tasks to reviewable workpacks.
- Agent Chat Routing v0.2 can create TaskSpec and Workpack drafts without executing them.
- Workpack Scheduler v0.1 demonstrated manual-tick execution with dependencies and blocked cloud lanes.
- Multi-step Workpacks v0.2 demonstrated step dependencies, per-step rollback and full workpack rollback.
- BrowserBridge Selector Pack v0.2 demonstrated dry-run-first service selection, council ranking and proposal-only conversion without external send.
- Source Intake discipline registered protected/review material before any import, cleanup or publication.
- Agent Chat persistence/search v0.3 added local append-only storage, hash-chain verification, local search and internal exports without public publication.
- Claudio Mission Control v0.1 added a local read-only command surface over agents, chat, workpacks, scheduler, BrowserBridge, provider state, tree health, risks and evidence.

## Next

### Wabi MCP Server scaffold v0.2

Planned improvements:

- localhost-only scaffold;
- read-only tools first;
- prepare-only draft tools after redaction checks;
- gated-write disabled by default until TaskSpec, GhostGate, rollback and WitnessLog tests exist.

### Mission Control v0.2

Planned improvements:

- read-only alerts and filters;
- evidence navigation;
- no direct execution buttons.

### Scheduler priorities/dependencies v0.2

Planned improvements:

- clearer priority review;
- dependency visualization;
- retry policy review;
- manual operator confirmation for higher-risk queues;
- no hidden autonomy.

### BrowserBridge setup notes

Planned improvements:

- redacted setup guide for optional browser adapters;
- public synthetic smoke only after explicit double opt-in;
- no private workspace, prompts or local paths in browser payloads.

### Source Intake falsifier tests

Planned improvements:

- choose one registered source delta;
- write a falsifier/test before any selective extraction;
- keep raw source adoption blocked.

## Local Execution Contract

Internal local execution must continue to require:

- a TaskSpec;
- an ActionGate decision;
- GhostGate review;
- rollback snapshot before apply;
- append-only WitnessLog;
- tests or explicit verification evidence;
- no cloud LLM;
- no NVIDIA retry;
- no publication side effect.
- no browser send without explicit double opt-in and public/sanitized payload.
- no MCP gated-write without TaskSpec, GhostGate, rollback and WitnessLog.

### Public Updates

Future public updates may include additional public-safe theory articles, DUAT synthetic replay notes and Wabi workbench summaries. They must not include private runtime, protected canon, internal prompt material, private datasets or local paths.

## Blocked

- Public execution bridge.
- Automatic publication from the local hub.
- Cloud LLM use over private workspace.
- NVIDIA retry before manual route review.
- Strong claims about prediction, physical proof or autonomous safety.
- MCP tools that publish, deploy, delete, expose secrets or export internal chat publicly.
