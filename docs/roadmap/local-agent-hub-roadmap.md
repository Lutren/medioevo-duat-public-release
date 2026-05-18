# Local Agent Hub Roadmap

This roadmap describes the public-safe direction of the MEDIOEVO local agent system. It is a public overview, not a live bridge into the private local runtime.

## Done

- Public MEDIOEVO Hub created.
- Public Agent Hub role map created.
- Local Operator Hub v0.1 created inside the local Wabi/Claudio environment.
- Local agent chat v0.1 created as a local-only coordination surface.
- Task preparation, GhostGate review and local queue flow are defined for internal use.
- Direct execution remains blocked in v0.1.

## Next

### Local Execute v0.2

Local Execute v0.2 should support only sandbox or documentation tasks. It must require:

- a TaskSpec;
- an ActionGate decision;
- GhostGate review;
- rollback snapshot before apply;
- append-only WitnessLog;
- tests or explicit verification evidence;
- no cloud LLM;
- no NVIDIA retry;
- no publication side effect.

### Agent Chat v0.2

Planned improvements:

- local search;
- room filters;
- message-to-TaskSpec draft;
- evidence links;
- stronger redaction checks.

### Public Updates

Future public updates may include additional public-safe theory articles, DUAT synthetic replay notes and Wabi workbench summaries. They must not include private runtime, protected canon, internal prompt material, private datasets or local paths.

## Blocked

- Public execution bridge.
- Automatic publication from the local hub.
- Cloud LLM use over private workspace.
- NVIDIA retry before manual route review.
- Strong claims about prediction, physical proof or autonomous safety.
