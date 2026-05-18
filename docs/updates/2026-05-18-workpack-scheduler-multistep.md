# Workpack Scheduler and Multi-step Workpacks Update - 2026-05-18

This public-safe note summarizes recent local MEDIOEVO / Wabi / Claudio progress.

The local operator system now has a gated workpack lane:

- **Local Execute v0.2**: sandbox/docs-local tasks require TaskSpec, GhostGate, rollback snapshot, tests and WitnessLog.
- **Claudio Workpack Bridge v0.1**: local tasks can be packaged as reviewable workpacks before execution.
- **Agent Chat Routing v0.2**: local messages can create TaskSpec and Workpack drafts, but do not execute work.
- **Workpack Scheduler v0.1**: approved workpacks can run by manual tick, with max concurrency 1 and dependency checks.
- **Multi-step Workpacks v0.2**: workpacks can contain multiple local steps, each with its own gate, rollback and evidence.
- **BrowserBridge Selector Pack v0.2**: local browser bridge selection is dry-run first, ranks service readiness, and keeps external responses as proposal-only artifacts.
- **Source Intake discipline**: new source material is registered with boundaries before any import, cleanup or publication.

## Public Boundary

This update does not publish private runtime code, internal workpack manifests,
local paths, internal messages, raw prompts, datasets, protected canon, books,
RPG/TCG material or credentials.

The public site does not execute Claudio, Wabi or local workpacks. It is a
read-only status and roadmap layer.

## Provider Boundary

The public provider status remains conservative:

- NVIDIA retry remains blocked until manual route review.
- DeepSeek remains under quota/billing review.
- Private workspace material is not sent to cloud LLMs.
- Browser send remains double opt-in only and was not used for this public update.
- No public page claims cloud-provider success.

## Why It Matters

The workpack lane is meant to make agent work reconstructable. A task should
show what was requested, what was allowed, what was blocked, what changed, what
tests ran and how rollback would work.

The direction remains evidence-first: local agents should preserve uncertainty,
pass gates, leave witness records and keep publication separate from execution.
