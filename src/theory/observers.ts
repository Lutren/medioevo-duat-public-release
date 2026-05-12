import { ix } from "../simulation/kernels";
import type { CalibrationResult, ObserverMeasurement, ObserverProfile, SimulationMetrics } from "../simulation/types";

const LABELS = ["vacío", "forma", "flujo", "saturación", "colapso"] as const;

export const DEFAULT_OBSERVER_A: ObserverProfile = {
  id: "a",
  name: "Observador A",
  resolution: 1,
  saturation: 0.38,
  noise: 0.012,
  temporalWindow: 16,
  modality: "visual",
};

export const DEFAULT_OBSERVER_B: ObserverProfile = {
  id: "b",
  name: "Observador B",
  resolution: 0.42,
  saturation: 0.68,
  noise: 0.026,
  temporalWindow: 8,
  modality: "sonora",
};

export const BLIND_SOCIETY_B: ObserverProfile = {
  id: "b",
  name: "Sociedad sin vista",
  resolution: 0.34,
  saturation: 0.52,
  noise: 0.018,
  temporalWindow: 22,
  modality: "sonora",
};

export const DEFAULT_OBSERVER_C: ObserverProfile = {
  id: "c",
  name: "Observador C",
  resolution: 0.62,
  saturation: 0.46,
  noise: 0.018,
  temporalWindow: 12,
  modality: "tactil",
};

export function measureObserver(
  psi: Float32Array,
  width: number,
  height: number,
  profile: ObserverProfile,
  metrics: SimulationMetrics,
): ObserverMeasurement {
  const stride = Math.max(1, Math.round(1 / Math.max(0.08, profile.resolution)));
  let sum = 0;
  let sum2 = 0;
  let count = 0;
  let waves = 0;

  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const raw = psi[ix(x, y, width, height)];
      const saturated = 1 - Math.exp(-raw * (1 + profile.saturation * 2.8));
      const noisy = clamp01(saturated + deterministicNoise(x, y, profile.noise));
      sum += noisy;
      sum2 += noisy * noisy;
      waves += Math.abs(noisy - psi[ix(x + stride, y, width, height)]);
      count += 1;
    }
  }

  const mean = sum / Math.max(1, count);
  const variance = Math.max(0, sum2 / Math.max(1, count) - mean * mean);
  const entropy = -mean * Math.log(mean + 1e-9) - (1 - mean) * Math.log(1 - mean + 1e-9);
  const waveSignal = waves / Math.max(1, count);
  const vector = languageVector(profile, mean, entropy, variance, waveSignal, metrics);
  const labelIndex = vector.indexOf(Math.max(...vector));

  return {
    observerId: profile.id,
    label: profile.name,
    modality: profile.modality,
    measuredMean: mean,
    measuredEntropy: entropy,
    saturationLoad: clamp01(profile.saturation * mean + variance),
    languageVector: vector,
    symbol: LABELS[labelIndex],
  };
}

export function computeCalibrationIdempotenceError(calibration: CalibrationResult): number {
  const first = midpoint(calibration.observerA.languageVector, calibration.observerB.languageVector);
  const second = midpoint(first, first);
  return vectorDistance(first, second);
}

export function computeCalibrationClosureError(measurements: ObserverMeasurement[]): number {
  if (measurements.length < 3) return 0;
  const centroid = averageVectors(measurements.map((measurement) => measurement.languageVector));
  const pairwise = [
    midpoint(measurements[0].languageVector, measurements[1].languageVector),
    midpoint(measurements[1].languageVector, measurements[2].languageVector),
    midpoint(measurements[2].languageVector, measurements[0].languageVector),
  ];
  return pairwise.reduce((acc, vector) => acc + vectorDistance(vector, centroid), 0) / pairwise.length;
}

export function calibrateObservers(
  psi: Float32Array,
  width: number,
  height: number,
  a: ObserverProfile,
  b: ObserverProfile,
  metrics: SimulationMetrics,
): CalibrationResult {
  const observerA = measureObserver(psi, width, height, a, metrics);
  const observerB = measureObserver(psi, width, height, b, metrics);
  const divergence = vectorDistance(observerA.languageVector, observerB.languageVector);
  const midpoint = observerA.languageVector.map((value, i) => (value + observerB.languageVector[i]) / 2) as [
    number,
    number,
    number,
    number,
    number,
  ];
  const calibratedDivergence =
    (vectorDistance(observerA.languageVector, midpoint) + vectorDistance(observerB.languageVector, midpoint)) / 2;
  const sharedLanguage = LABELS[midpoint.indexOf(Math.max(...midpoint))];

  return {
    divergence,
    calibratedDivergence,
    invariantScore: clamp01(1 - calibratedDivergence),
    sharedLanguage,
    observerA,
    observerB,
  };
}

function languageVector(
  profile: ObserverProfile,
  mean: number,
  entropy: number,
  variance: number,
  waveSignal: number,
  metrics: SimulationMetrics,
): [number, number, number, number, number] {
  const modalityWeight =
    profile.modality === "visual"
      ? [0.9, 1.2, 0.7, 0.8, 0.6]
      : profile.modality === "sonora"
        ? [0.7, 0.65, 1.35, 0.8, 0.9]
        : [0.8, 0.9, 0.75, 1.2, 0.85];

  const raw = [
    (1 - mean) * (1 - entropy * 0.45),
    variance * 8 + metrics.edge * 2,
    waveSignal * 3 + metrics.activity * 4,
    profile.saturation * mean + metrics.residue * 0.35,
    mean > 0.7 ? mean : Math.max(0, 1 - metrics.phiEff) * 0.8,
  ].map((value, i) => clamp01(value * modalityWeight[i]));

  const total = raw.reduce((acc, value) => acc + value, 0) || 1;
  return raw.map((value) => value / total) as [number, number, number, number, number];
}

export function vectorDistance(a: [number, number, number, number, number], b: [number, number, number, number, number]) {
  return Math.sqrt(a.reduce((acc, value, i) => acc + (value - b[i]) ** 2, 0));
}

function midpoint(
  a: [number, number, number, number, number],
  b: [number, number, number, number, number],
): [number, number, number, number, number] {
  return a.map((value, i) => (value + b[i]) / 2) as [number, number, number, number, number];
}

function averageVectors(vectors: [number, number, number, number, number][]): [number, number, number, number, number] {
  const totals = [0, 0, 0, 0, 0] as [number, number, number, number, number];
  for (const vector of vectors) {
    for (let i = 0; i < totals.length; i += 1) totals[i] += vector[i];
  }
  return totals.map((value) => value / vectors.length) as [number, number, number, number, number];
}

function deterministicNoise(x: number, y: number, amount: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return ((n - Math.floor(n)) - 0.5) * amount;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
