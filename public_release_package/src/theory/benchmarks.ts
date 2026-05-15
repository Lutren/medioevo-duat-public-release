import { DuatEngine } from "../simulation/engine";
import { CHI_STAR, type AblationMode, type BenchmarkResult, type SimulationMetrics, type SimulationParams } from "../simulation/types";
import { computeDimObsAndAtum, computeLGModeSpectrum, MetricsTracker } from "./metrics";
import {
  calibrateObservers,
  computeCalibrationClosureError,
  computeCalibrationIdempotenceError,
  DEFAULT_OBSERVER_A,
  DEFAULT_OBSERVER_B,
  DEFAULT_OBSERVER_C,
  measureObserver,
} from "./observers";

export const DEFAULT_PARAMS: SimulationParams = {
  chi: CHI_STAR,
  sigma: 0.135,
  dt: 0.19,
  noise: 0.011,
  observerStrength: 0.65,
  speed: 1,
  running: true,
  ruleMode: "duat",
};

const BENCH_WIDTH = 64;
const BENCH_HEIGHT = 40;
const BENCH_CX = Math.floor(BENCH_WIDTH / 2);
const BENCH_CY = Math.floor(BENCH_HEIGHT / 2);

export function runBenchmarks(params: SimulationParams = DEFAULT_PARAMS): BenchmarkResult[] {
  return [
    benchmarkReproducibility(params),
    benchmarkBounds(params),
    benchmarkEmergence(params),
    benchmarkResilience(params),
    benchmarkCalibration(params),
    benchmarkFalsation(params),
    benchmarkNullModel(params),
    benchmarkAblationSignal(params),
    benchmarkCalibrationClosure(params),
    benchmarkLGModeSpectrum(params),
    benchmarkClipArtifact(params),
  ];
}

function benchmarkReproducibility(params: SimulationParams): BenchmarkResult {
  const a = new DuatEngine(1919, BENCH_WIDTH, BENCH_HEIGHT);
  const b = new DuatEngine(1919, BENCH_WIDTH, BENCH_HEIGHT);
  a.seedDuat(BENCH_CX, BENCH_CY);
  b.seedDuat(BENCH_CX, BENCH_CY);
  for (let i = 0; i < 20; i += 1) {
    a.step(params);
    b.step(params);
  }
  const maxDelta = maxArrayDelta(a.psi, b.psi);
  return result(
    "reproducibility",
    "Reproducibilidad determinista",
    maxDelta <= 1e-7,
    maxDelta.toExponential(2),
    "<= 1e-7",
    "Misma semilla, operador y parámetros producen el mismo campo.",
  );
}

function benchmarkBounds(params: SimulationParams): BenchmarkResult {
  const engine = new DuatEngine(2026, BENCH_WIDTH, BENCH_HEIGHT);
  engine.seedAtum(BENCH_CX - 8, BENCH_CY);
  for (let i = 0; i < 28; i += 1) engine.step(params);
  let valid = true;
  for (const field of [engine.psi, engine.gravity, engine.light]) {
    for (const value of field) {
      if (!Number.isFinite(value) || value < 0 || value > 1) {
        valid = false;
        break;
      }
    }
  }
  return result("bounds", "Conservación de límites", valid, valid ? "todos en [0,1]" : "valor inválido", "campos finitos [0,1]", "ψ, G y L no rompen los límites numéricos.");
}

function benchmarkEmergence(params: SimulationParams): BenchmarkResult {
  const engine = new DuatEngine(42, BENCH_WIDTH, BENCH_HEIGHT);
  const tracker = new MetricsTracker();
  engine.seedDuat(BENCH_CX, BENCH_CY);
  let metric = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, params);
  for (let i = 0; i < 52; i += 1) {
    engine.step(params);
    metric = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, params, engine.lastClipRatio);
  }
  return result(
    "emergence",
    "Emergencia por persistencia",
    metric.liveness > 0.38 && metric.mean > 0.025,
    `vida=${metric.liveness.toFixed(3)}, ψ̄=${metric.mean.toFixed(3)}`,
    "vida > 0.38 y ψ̄ > 0.025",
    "La vida se mide por persistencia, no por una captura visual aislada.",
  );
}

function benchmarkResilience(params: SimulationParams): BenchmarkResult {
  const engine = new DuatEngine(9001, BENCH_WIDTH, BENCH_HEIGHT);
  const tracker = new MetricsTracker();
  engine.seedOsiris(BENCH_CX, BENCH_CY);
  let before = 0;
  let after = 0;
  for (let i = 0; i < 32; i += 1) {
    engine.step(params);
    before = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, params, engine.lastClipRatio).liveness;
  }
  for (let i = 0; i < 24; i += 1) {
    engine.step(params, { x: BENCH_CX, y: BENCH_CY, strength: 0.55, profile: DEFAULT_OBSERVER_A });
    after = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, params, engine.lastClipRatio).liveness;
  }
  const retention = before > 0 ? after / before : 0;
  return result(
    "resilience",
    "Resiliencia ante observación",
    retention > 0.45,
    `retención=${retention.toFixed(3)}`,
    "> 0.45",
    "La estructura OSIRIS debe conservar parte de su vida bajo perturbación moderada.",
  );
}

function benchmarkCalibration(params: SimulationParams): BenchmarkResult {
  const engine = new DuatEngine(31415, BENCH_WIDTH, BENCH_HEIGHT);
  const tracker = new MetricsTracker();
  engine.seedDuat(BENCH_CX, BENCH_CY);
  let metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, params);
  for (let i = 0; i < 24; i += 1) {
    engine.step(params);
    metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, params, engine.lastClipRatio);
  }
  const calibration = calibrateObservers(engine.psi, engine.width, engine.height, DEFAULT_OBSERVER_A, DEFAULT_OBSERVER_B, metrics);
  return result(
    "calibration",
    "Calibración intersubjetiva",
    calibration.calibratedDivergence < calibration.divergence,
    `${calibration.divergence.toFixed(3)} -> ${calibration.calibratedDivergence.toFixed(3)}`,
    "divergencia calibrada menor",
    "El lenguaje compartido reduce distancia entre observadores con canales distintos.",
  );
}

function benchmarkFalsation(params: SimulationParams): BenchmarkResult {
  const falsationParams = { ...params, chi: 0.19, noise: 0, observerStrength: 0 };
  const engine = new DuatEngine(7, BENCH_WIDTH, BENCH_HEIGHT);
  const tracker = new MetricsTracker();
  engine.psi.fill(0);
  let metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, falsationParams);
  for (let i = 0; i < 36; i += 1) {
    engine.step(falsationParams);
    metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, falsationParams, engine.lastClipRatio);
  }
  return result(
    "falsation",
    "Falsación sin maquillaje",
    metrics.cosmologyState === "NU" || metrics.mean < 0.02,
    `${metrics.cosmologyState}, ψ̄=${metrics.mean.toFixed(4)}`,
    "NU o ψ̄ < 0.02",
    "Una configuración infértil debe registrarse como muerte del campo, no como éxito.",
  );
}

function benchmarkNullModel(params: SimulationParams): BenchmarkResult {
  const full = runSeededMetric(8128, params, "full", "duat", 42);
  const nullMetric = runSeededMetric(8128, { ...params, noise: 0.035, observerStrength: 0 }, "no-g", "none", 42);
  const gain = full.liveness - nullMetric.liveness;
  return result(
    "null-model",
    "Modelo supera null",
    gain > 0.08 && full.dimObs >= nullMetric.dimObs,
    `Δvida=${gain.toFixed(3)}, dim=${full.dimObs}/${nullMetric.dimObs}`,
    "Δvida > 0.08",
    "El patrón estructurado debe superar ruido sin G/observador.",
  );
}

function benchmarkAblationSignal(params: SimulationParams): BenchmarkResult {
  const full = runSeededMetric(4242, params, "full", "osiris", 44);
  const noG = runSeededMetric(4242, params, "no-g", "osiris", 44);
  const noL = runSeededMetric(4242, params, "no-l", "osiris", 44);
  const weakestDelta = Math.min(full.liveness - noG.liveness, full.liveness - noL.liveness);
  return result(
    "ablation-signal",
    "Ablation G/L",
    weakestDelta > 0.035,
    `full=${full.liveness.toFixed(3)}, noG=${noG.liveness.toFixed(3)}, noL=${noL.liveness.toFixed(3)}`,
    "full supera no-G/no-L",
    "G y L deben aportar algo medible frente a sus ablaciones.",
  );
}

function benchmarkCalibrationClosure(params: SimulationParams): BenchmarkResult {
  const engine = new DuatEngine(2718, BENCH_WIDTH, BENCH_HEIGHT);
  const tracker = new MetricsTracker();
  engine.seedDuat(BENCH_CX, BENCH_CY);
  let metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, params);
  for (let i = 0; i < 28; i += 1) {
    engine.step(params);
    metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, params, engine.lastClipRatio);
  }
  const calibration = calibrateObservers(engine.psi, engine.width, engine.height, DEFAULT_OBSERVER_A, DEFAULT_OBSERVER_B, metrics);
  const measurements = [
    calibration.observerA,
    calibration.observerB,
    measureObserver(engine.psi, engine.width, engine.height, DEFAULT_OBSERVER_C, metrics),
  ];
  const closureError = computeCalibrationClosureError(measurements);
  const idempotenceError = computeCalibrationIdempotenceError(calibration);
  return result(
    "calibration-closure",
    "Cierre e idempotencia Cij",
    closureError < 0.13 && idempotenceError <= 1e-9,
    `closure=${closureError.toFixed(4)}, idem=${idempotenceError.toExponential(1)}`,
    "closure < 0.13; idem <= 1e-9",
    "La calibración no debe introducir deriva al cerrar un triángulo de observadores.",
  );
}

function benchmarkLGModeSpectrum(params: SimulationParams): BenchmarkResult {
  const metric = runSeededMetric(1618, params, "full", "duat", 38);
  return result(
    "lg-mode-spectrum",
    "Espectro L/G y dim_obs",
    metric.dimObs >= 3 && metric.spectralEntropy > 0.45 && metric.atumScore > 0.38,
    `dim=${metric.dimObs}, H=${metric.spectralEntropy.toFixed(3)}, ATUM=${metric.atumScore.toFixed(3)}`,
    "dim >= 3; H > 0.45",
    "El sistema debe producir distinciones observacionales no triviales.",
  );
}

function benchmarkClipArtifact(params: SimulationParams): BenchmarkResult {
  const metric = runSeededMetric(5150, params, "full", "duat", 36);
  return result(
    "clip-artifact",
    "Clipping no domina",
    metric.clipArtifactRatio < 0.18,
    `clip=${metric.clipArtifactRatio.toFixed(4)}`,
    "< 0.18",
    "La vida no debe depender de saturar el clamp numérico.",
  );
}

function result(id: string, label: string, passed: boolean, value: string, threshold: string, evidence: string): BenchmarkResult {
  return { id, label, passed, value, threshold, evidence };
}

function runSeededMetric(
  seed: number,
  params: SimulationParams,
  ablationMode: AblationMode,
  seedMode: "duat" | "osiris" | "atum" | "none",
  steps: number,
): SimulationMetrics {
  const engine = new DuatEngine(seed, BENCH_WIDTH, BENCH_HEIGHT);
  const tracker = new MetricsTracker();
  const runParams = { ...params, ablationMode };
  if (seedMode === "duat") engine.seedDuat(BENCH_CX, BENCH_CY);
  if (seedMode === "osiris") engine.seedOsiris(BENCH_CX, BENCH_CY);
  if (seedMode === "atum") engine.seedAtum(BENCH_CX, BENCH_CY);
  let metric = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, runParams);
  for (let i = 0; i < steps; i += 1) {
    engine.step(runParams);
    metric = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, runParams, engine.lastClipRatio);
  }
  const spectrum = computeLGModeSpectrum(engine.psi, engine.gravity, engine.light, engine.width, engine.height);
  const obs = computeDimObsAndAtum(spectrum, metric.entropy, metric.edge);
  return { ...metric, dimObs: obs.dimObs, atumScore: obs.atumScore, spectralEntropy: spectrum.spectralEntropy, lgBalance: spectrum.lgBalance };
}

function maxArrayDelta(a: Float32Array, b: Float32Array): number {
  let max = 0;
  for (let i = 0; i < a.length; i += 1) max = Math.max(max, Math.abs(a[i] - b[i]));
  return max;
}
