# Wabi Local Workbench - Public Status

Wabi is the local-first operational workbench used for provider status, tree health, coding acceptance, rollback and witness evidence.

This document is a public-safe status note. It does not publish private Wabi/Claudio runtime code.

## Current Public-Safe State

- Operational workbench: created.
- Tree health panel: created.
- Coding acceptance: fallback-only local acceptance demonstrated in sandbox.
- Local Execute: sandbox/docs tasks require TaskSpec, GhostGate, rollback and WitnessLog.
- Workpack Scheduler: manual-tick queue demonstrated locally with gates and dependency checks.
- Multi-step Workpacks: demonstrated locally with per-step gates, per-step rollback and full workpack rollback.
- Provider status: honest review state.
- NVIDIA retry: blocked until route review.
- Public execution bridge: not provided.

## Provider Boundary

The public status does not claim cloud provider success. The current public-safe wording is:

- provider route under review;
- cloud LLM not used for private workspace;
- local fallback remains the safe operational route;
- no pass claim without evidence.

## Local Coding Direction

The local coding lane has moved from single sandbox tasks into gated workpacks:

- Local Execute allows only sandbox/docs-local execution after TaskSpec, GhostGate, rollback snapshot and WitnessLog.
- Workpack Bridge packages local tasks into reviewable workpacks.
- Workpack Scheduler runs by manual tick only; it is not hidden autonomy.
- Multi-step Workpacks allow step dependencies and rollback per step.

Public pages describe the method and status only. They do not expose internal workpack manifests, local endpoints, local paths or execution controls.

## What Is Not Included

- private runtime internals;
- private prompts;
- local path details;
- internal work queues;
- internal agent chat messages;
- credentials;
- protected creative material.
