import { DuatEngine } from "../simulation/engine";
import {
  CHI_STAR,
  type ActiveObserver,
  type CosmologyState,
  type SimulationMetrics,
  type SimulationParams,
} from "../simulation/types";
import { DEFAULT_PARAMS } from "./benchmarks";
import { MetricsTracker } from "./metrics";
import { DEFAULT_OBSERVER_A } from "./observers";

export interface SweepConfig {
  chis: number[];
  sigmas: number[];
  noises: number[];
  observerStrengths: number[];
  seeds: number[];
  steps: number;
  width: number;
  height: number;
}

export interface SweepRow {
  chi: number;
  sigma: number;
  noise: number;
  observerStrength: number;
  seed: number;
  frame: number;
  cosmologyState: CosmologyState;
  mean: number;
  liveness: number;
  residue: number;
  phiEff: number;
  dimObs: number;
  atumScore: number;
  osirisScore: number;
  spectralEntropy: number;
  clipArtifactRatio: number;
}

export interface SweepSummary {
  rows: number;
  fertileRows: number;
  lowClipRows: number;
  meanLiveness: number;
  meanResidue: number;
  maxClipArtifactRatio: number;
  observerEffectLivenessDelta: number;
  bestLiveness: number;
  bestState: CosmologyState;
  bestParams: Pick<SweepRow, "chi" | "sigma" | "noise" | "observerStrength" | "seed">;
  phaseCounts: Record<CosmologyState, number>;
}

export interface PhaseMapCell {
  chi: number;
  sigma: number;
  cases: number;
  dominantState: CosmologyState;
  meanLiveness: number;
  meanResidue: number;
  maxClipArtifactRatio: number;
  phaseCounts: Record<CosmologyState, number>;
}

export const DEFAULT_SWEEP_CONFIG: SweepConfig = {
  chis: [round3(CHI_STAR - 0.08), round3(CHI_STAR), round3(CHI_STAR + 0.08)],
  sigmas: [0.09, 0.135, 0.2],
  noises: [0, 0.011],
  observerStrengths: [0, 0.65],
  seeds: [42, 1919, 5150],
  steps: 34,
  width: 48,
  height: 30,
};

export function runDuatSweep(
  baseParams: SimulationParams = DEFAULT_PARAMS,
  config: SweepConfig = DEFAULT_SWEEP_CONFIG,
): SweepRow[] {
  const rows: SweepRow[] = [];
  for (const chi of config.chis) {
    for (const sigma of config.sigmas) {
      for (const noise of config.noises) {
        for (const observerStrength of config.observerStrengths) {
          for (const seed of config.seeds) {
            const params = { ...baseParams, chi, sigma, noise, observerStrength, running: true, ruleMode: "duat" as const };
            rows.push(runSweepCase(params, seed, config));
          }
        }
      }
    }
  }
  return rows;
}

export function summarizeSweep(rows: SweepRow[]): SweepSummary {
  const phaseCounts = emptyPhaseCounts();
  let best = rows[0];
  let livenessTotal = 0;
  let residueTotal = 0;
  let maxClipArtifactRatio = 0;
  for (const row of rows) {
    phaseCounts[row.cosmologyState] += 1;
    if (!best || row.liveness > best.liveness) best = row;
    livenessTotal += row.liveness;
    residueTotal += row.residue;
    maxClipArtifactRatio = Math.max(maxClipArtifactRatio, row.clipArtifactRatio);
  }
  return {
    rows: rows.length,
    fertileRows: rows.filter((row) => row.liveness > 0.38 && row.mean > 0.025).length,
    lowClipRows: rows.filter((row) => row.clipArtifactRatio < 0.18).length,
    meanLiveness: livenessTotal / Math.max(1, rows.length),
    meanResidue: residueTotal / Math.max(1, rows.length),
    maxClipArtifactRatio,
    observerEffectLivenessDelta: meanByObserver(rows, true) - meanByObserver(rows, false),
    bestLiveness: best?.liveness ?? 0,
    bestState: best?.cosmologyState ?? "NU",
    bestParams: {
      chi: best?.chi ?? 0,
      sigma: best?.sigma ?? 0,
      noise: best?.noise ?? 0,
      observerStrength: best?.observerStrength ?? 0,
      seed: best?.seed ?? 0,
    },
    phaseCounts,
  };
}

export function sweepRowsToCsv(rows: SweepRow[]): string {
  const headers = [
    "chi",
    "sigma",
    "noise",
    "observerStrength",
    "seed",
    "frame",
    "cosmologyState",
    "mean",
    "liveness",
    "residue",
    "phiEff",
    "dimObs",
    "atumScore",
    "osirisScore",
    "spectralEntropy",
    "clipArtifactRatio",
  ];
  const body = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header as keyof SweepRow];
        return typeof value === "number" ? formatNumber(value) : String(value);
      })
      .join(","),
  );
  return [headers.join(","), ...body].join("\n");
}

export function sweepSummaryToMarkdown(summary: SweepSummary): string {
  return `# DUAT Sweep Summary

## Resultado

- Casos: ${summary.rows}
- Fertiles: ${summary.fertileRows}
- Clip bajo: ${summary.lowClipRows}
- Vida media: ${summary.meanLiveness.toFixed(4)}
- Residuo medio: ${summary.meanResidue.toFixed(4)}
- Clip maximo: ${summary.maxClipArtifactRatio.toFixed(4)}
- Delta vida con observador: ${summary.observerEffectLivenessDelta.toFixed(4)}
- Mejor vida: ${summary.bestLiveness.toFixed(4)}
- Mejor estado: ${summary.bestState}

## Mejores parametros

| chi | sigma | noise | observerStrength | seed |
|---:|---:|---:|---:|---:|
| ${summary.bestParams.chi.toFixed(3)} | ${summary.bestParams.sigma.toFixed(3)} | ${summary.bestParams.noise.toFixed(3)} | ${summary.bestParams.observerStrength.toFixed(3)} | ${summary.bestParams.seed} |

## Fases

| Fase | Conteo |
|---|---:|
${Object.entries(summary.phaseCounts)
  .map(([phase, count]) => `| ${phase} | ${count} |`)
  .join("\n")}
`;
}

export function buildPhaseMap(rows: SweepRow[]): PhaseMapCell[] {
  const groups = new Map<string, SweepRow[]>();
  for (const row of rows) {
    const key = `${row.chi}|${row.sigma}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return Array.from(groups.values())
    .map((group) => {
      const phaseCounts = emptyPhaseCounts();
      let livenessTotal = 0;
      let residueTotal = 0;
      let maxClipArtifactRatio = 0;
      for (const row of group) {
        phaseCounts[row.cosmologyState] += 1;
        livenessTotal += row.liveness;
        residueTotal += row.residue;
        maxClipArtifactRatio = Math.max(maxClipArtifactRatio, row.clipArtifactRatio);
      }
      return {
        chi: group[0].chi,
        sigma: group[0].sigma,
        cases: group.length,
        dominantState: dominantPhase(phaseCounts),
        meanLiveness: livenessTotal / group.length,
        meanResidue: residueTotal / group.length,
        maxClipArtifactRatio,
        phaseCounts,
      };
    })
    .sort((a, b) => a.chi - b.chi || a.sigma - b.sigma);
}

export function sweepPhaseMapToMarkdown(rows: SweepRow[]): string {
  const cells = buildPhaseMap(rows);
  return `# DUAT Phase Map

Agrupacion por chi/sigma. Cada celda agrega seeds, ruido y observador.

| chi | sigma | casos | fase dominante | vida media | residuo medio | clip maximo | fases |
|---:|---:|---:|---|---:|---:|---:|---|
${cells
  .map(
    (cell) =>
      `| ${cell.chi.toFixed(3)} | ${cell.sigma.toFixed(3)} | ${cell.cases} | ${cell.dominantState} | ${cell.meanLiveness.toFixed(4)} | ${cell.meanResidue.toFixed(4)} | ${cell.maxClipArtifactRatio.toFixed(4)} | ${formatPhaseCounts(cell.phaseCounts)} |`,
  )
  .join("\n")}
`;
}

function runSweepCase(params: SimulationParams, seed: number, config: SweepConfig): SweepRow {
  const engine = new DuatEngine(seed, config.width, config.height);
  const tracker = new MetricsTracker();
  const cx = Math.floor(config.width / 2);
  const cy = Math.floor(config.height / 2);
  engine.seedDuat(cx, cy);
  const activeObserver: ActiveObserver | null =
    params.observerStrength > 0
      ? { x: cx, y: cy, strength: params.observerStrength, profile: DEFAULT_OBSERVER_A }
      : null;
  let metrics: SimulationMetrics = tracker.update(
    engine.psi,
    engine.previous,
    engine.gravity,
    engine.light,
    engine.width,
    engine.height,
    params,
  );
  for (let frame = 0; frame < config.steps; frame += 1) {
    engine.step(params, activeObserver);
    metrics = tracker.update(
      engine.psi,
      engine.previous,
      engine.gravity,
      engine.light,
      engine.width,
      engine.height,
      params,
      engine.lastClipRatio,
    );
  }
  return {
    chi: params.chi,
    sigma: params.sigma,
    noise: params.noise,
    observerStrength: params.observerStrength,
    seed,
    frame: engine.frame,
    cosmologyState: metrics.cosmologyState,
    mean: metrics.mean,
    liveness: metrics.liveness,
    residue: metrics.residue,
    phiEff: metrics.phiEff,
    dimObs: metrics.dimObs,
    atumScore: metrics.atumScore,
    osirisScore: metrics.osirisScore,
    spectralEntropy: metrics.spectralEntropy,
    clipArtifactRatio: metrics.clipArtifactRatio,
  };
}

function emptyPhaseCounts(): Record<CosmologyState, number> {
  return { NU: 0, ATUM: 0, DUAT: 0, MAAT: 0, OSIRIS: 0, COLAPSO: 0 };
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(6);
}

function round3(value: number): number {
  return Number(value.toFixed(3));
}

function meanByObserver(rows: SweepRow[], active: boolean): number {
  const filtered = rows.filter((row) => (active ? row.observerStrength > 0 : row.observerStrength === 0));
  if (filtered.length === 0) return 0;
  return filtered.reduce((acc, row) => acc + row.liveness, 0) / filtered.length;
}

function dominantPhase(phaseCounts: Record<CosmologyState, number>): CosmologyState {
  return (Object.entries(phaseCounts) as [CosmologyState, number][]).reduce((best, current) =>
    current[1] > best[1] ? current : best,
  )[0];
}

function formatPhaseCounts(phaseCounts: Record<CosmologyState, number>): string {
  return (Object.entries(phaseCounts) as [CosmologyState, number][])
    .filter(([, count]) => count > 0)
    .map(([phase, count]) => `${phase}:${count}`)
    .join(" ");
}
