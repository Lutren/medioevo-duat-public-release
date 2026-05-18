# OSIT Runtime Architecture - Public-Safe Summary

OSIT Runtime Architecture is a local operational layer for evidence-aware workflows.

## Public Concepts

- SourceCards: provenance units for what the system is allowed to use.
- ObservationEnvelope: a structured record of observations.
- ActionGate: a gate for local, review or blocked actions.
- ScienceClaimGate: a guardrail for preventing strong unsupported claims.
- GhostGate: a check against acting on stale or invisible state.
- BoundaryCheck: a public/private separation check.
- WitnessLog: append-only evidence.
- Handoff: a reconstruction aid for the next operator or agent.
- ReconstructionTest: a way to verify that the state can be rebuilt from artifacts.

## Public Boundary

This is a high-level operational summary. It does not publish private runtime data, internal implementation details, credentials, private prompts or private research materials.

## Status

The runtime architecture is active locally as an evidence and contract layer. Public copy should describe it as a method and architecture, not as proof of universal physics or real-world prediction.
