# Architecture

The public architecture is split into presentation, coordination and safety gates.

## Presentation

- `src/App.tsx`: public routes for overview, DUAT, HandoffHub, DevDay and docs.
- `src/ui/FieldCanvas.tsx`: DUAT visual field renderer.
- `assets/` and `public/duat-assets/`: public-safe generated SVG assets.

## Coordination

- `src/messagebus/types.ts`: typed MEDIOEVO MessageBus contract.
- `src/messagebus/seed.ts`: mock public state for channels, agents, messages and WitnessLog events.
- `src/ui/TelecomCore.tsx`: DUAT Telecom Core dashboard.

## Simulation

- `src/simulation/`: synthetic field engine for the DUAT visual demo.
- `src/theory/`: local metrics used by the demo and tests.

## Safety

External publication requires focused secret scan, build proof, file manifest, target confirmation and deploy gate.
