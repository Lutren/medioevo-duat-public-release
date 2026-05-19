# Public Agent Hub Overview

The public Agent Hub is a role map for the local MEDIOEVO agent system.

It does not expose private work queues, local messages, private source material or execution controls.

## Public Roles

- **Core Orchestrator** - converts work into state, tasks and evidence.
- **Gatekeeper** - classifies actions as approve, review or block.
- **Memory Keeper** - preserves decisions, assumptions, risks, briefs and fingerprints.
- **Wabi Programmer** - handles local coding acceptance inside sandboxed tasks.
- **Safe Executor** - separates planning from apply and requires rollback.
- **Boundary Scanner** - checks private/public, secret and claim boundaries.
- **Mission Control Reader** - summarizes local operational evidence without executing or mutating.
- **MCP Bridge Planner** - designs safe read-only and draft-only tool access before any gated write path.
- **DUAT Display Agent** - summarizes synthetic simulation and evidence surfaces.
- **GEODIA Simulation Agent** - tracks simulation status and replay-friendly evidence.

## Local-Only Internal Version

The internal Agent Hub is local-only. It uses:

- TaskSpec;
- ActionGate;
- GhostGate;
- rollback;
- WitnessLog;
- local queue;
- local agent chat.

The public site does not connect to it and cannot execute local actions.

## Boundary

No internal agent messages, private tasks, protected canon, private runtime code, local paths, datasets or credentials are published.
