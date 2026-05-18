# OSIT Formal Lab - Public-Safe Summary

The OSIT Formal Lab is a reproducible public-safe repository for operational metrics used in MEDIOEVO / OSIT:

- Shannon entropy;
- normalized residue `R`;
- effective update/integration `Phi_eff`;
- usable information `H_eff`;
- MTS channel residue;
- MTS channel `Phi_eff`;
- channel gates: `APPROVE`, `REVIEW`, `BLOCK`.

Repository:

- <https://github.com/Lutren/medioevo-osit-formal-lab>

## Boundary

This is a formal-lab and testing surface. It does not claim proof of physics, consciousness, AGI, guaranteed prediction or a replacement for Shannon information theory.

It excludes private MEDIOEVO books, RPG/TCG material, Claudio/Wabi/DUAT private runtime, raw prompts, real datasets, credentials and proprietary calibration.

## Current Evidence

- Python package scaffold: `src/osit_lab`.
- Metrics modules: `measure_tools`, `mts`, `gates`.
- Tests: `pytest` coverage for entropy, `H_eff`, channel residue, channel `Phi_eff` and gates.
- Minimal synthetic examples:
  - `examples/basic_measure_tools.py`;
  - `examples/mts_channel_demo.py`;
  - `examples/gates_demo.py`.
- Claim boundary: `CLAIMS.md`.
- Private exclusions: `PRIVATE_EXCLUSIONS.md`.

## Example Boundary

The examples use synthetic values only. They do not use real social data,
private runtime telemetry, protected MEDIOEVO canon, raw prompts or deployment
logs. They demonstrate API usage and gate posture, not prediction or scientific
proof.
