import { describe, expect, it } from "vitest";
import { DuatEngine } from "./engine";
import { buildGravityKernel, buildLightKernel, ix } from "./kernels";
import { DEFAULT_PARAMS, runBenchmarks } from "../theory/benchmarks";
import { computeDimObsAndAtum, computeFisherL, computeLGModeSpectrum, computeRestrictionMatrixG, MetricsTracker } from "../theory/metrics";
import {
  calibrateObservers,
  computeCalibrationClosureError,
  computeCalibrationIdempotenceError,
  DEFAULT_OBSERVER_A,
  DEFAULT_OBSERVER_B,
  DEFAULT_OBSERVER_C,
  measureObserver,
} from "../theory/observers";
import { runDuatSweep, summarizeSweep, sweepPhaseMapToMarkdown, sweepRowsToCsv } from "../theory/sweeps";

describe("kernels", () => {
  it("normaliza los kernels de gravedad y luz", () => {
    const gravitySum = buildGravityKernel(3).reduce((acc, cell) => acc + cell.w, 0);
    const lightSum = buildLightKernel(4, 8).reduce((acc, cell) => acc + cell.w, 0);
    expect(gravitySum).toBeCloseTo(1, 6);
    expect(lightSum).toBeCloseTo(1, 6);
  });

  it("aplica índice toroidal", () => {
    expect(ix(-1, 0, 10, 10)).toBe(9);
    expect(ix(0, -1, 10, 10)).toBe(90);
    expect(ix(11, 12, 10, 10)).toBe(21);
  });
});

describe("DuatEngine", () => {
  it("mantiene los campos en límites válidos", () => {
    const engine = new DuatEngine(1234, 64, 40);
    engine.seedDuat(32, 20);
    for (let i = 0; i < 20; i += 1) engine.step(DEFAULT_PARAMS);
    for (const field of [engine.psi, engine.gravity, engine.light]) {
      for (const value of field) {
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });

  it("produce la misma evolución con semilla y parámetros iguales", () => {
    const a = new DuatEngine(777, 64, 40);
    const b = new DuatEngine(777, 64, 40);
    a.seedAtum(32, 20);
    b.seedAtum(32, 20);
    for (let i = 0; i < 14; i += 1) {
      a.step(DEFAULT_PARAMS);
      b.step(DEFAULT_PARAMS);
    }
    for (let i = 0; i < a.psi.length; i += 1) {
      expect(a.psi[i]).toBeCloseTo(b.psi[i], 7);
    }
  });

  it("genera una lectura cosmológica derivada", () => {
    const engine = new DuatEngine(987, 64, 40);
    const tracker = new MetricsTracker();
    engine.seedOsiris(32, 20);
    let metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, DEFAULT_PARAMS);
    for (let i = 0; i < 32; i += 1) {
      engine.step(DEFAULT_PARAMS);
      metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, DEFAULT_PARAMS);
    }
    expect(["ATUM", "DUAT", "MAAT", "OSIRIS"]).toContain(metrics.cosmologyState);
    expect(metrics.liveness).toBeGreaterThan(0.2);
  });

  it("reduce divergencia mediante calibración de lenguaje", () => {
    const engine = new DuatEngine(222, 64, 40);
    const tracker = new MetricsTracker();
    engine.seedDuat(32, 20);
    let metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, DEFAULT_PARAMS);
    for (let i = 0; i < 18; i += 1) {
      engine.step(DEFAULT_PARAMS);
      metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, DEFAULT_PARAMS);
    }
    const calibration = calibrateObservers(engine.psi, engine.width, engine.height, DEFAULT_OBSERVER_A, DEFAULT_OBSERVER_B, metrics);
    expect(calibration.calibratedDivergence).toBeLessThan(calibration.divergence);
    expect(calibration.sharedLanguage.length).toBeGreaterThan(0);
  });

  it("ejecuta el paquete de benchmarks", () => {
    const results = runBenchmarks(DEFAULT_PARAMS);
    expect(results).toHaveLength(11);
    expect(results.filter((result) => !result.passed)).toEqual([]);
    expect(results.find((result) => result.id === "clip-artifact")?.value).toMatch(/clip=/);
  });

  it("calcula operadores LG y dimensión observacional", () => {
    const engine = new DuatEngine(404, 64, 40);
    engine.seedDuat(32, 20);
    for (let i = 0; i < 18; i += 1) engine.step(DEFAULT_PARAMS);
    const restriction = computeRestrictionMatrixG(engine.psi, engine.width, engine.height);
    const fisher = computeFisherL(engine.psi, engine.width, engine.height);
    const spectrum = computeLGModeSpectrum(engine.psi, engine.gravity, engine.light, engine.width, engine.height);
    const obs = computeDimObsAndAtum(spectrum, 0.3, 0.04);
    expect(restriction.length).toBe(engine.psi.length);
    expect(fisher.length).toBe(engine.psi.length);
    expect(spectrum.modes).toHaveLength(5);
    expect(obs.dimObs).toBeGreaterThanOrEqual(1);
    expect(obs.atumScore).toBeGreaterThan(0);
  });

  it("mide cierre de calibración entre tres observadores", () => {
    const engine = new DuatEngine(909, 64, 40);
    const tracker = new MetricsTracker();
    engine.seedDuat(32, 20);
    let metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, DEFAULT_PARAMS);
    for (let i = 0; i < 18; i += 1) {
      engine.step(DEFAULT_PARAMS);
      metrics = tracker.update(engine.psi, engine.previous, engine.gravity, engine.light, engine.width, engine.height, DEFAULT_PARAMS, engine.lastClipRatio);
    }
    const calibration = calibrateObservers(engine.psi, engine.width, engine.height, DEFAULT_OBSERVER_A, DEFAULT_OBSERVER_B, metrics);
    const closure = computeCalibrationClosureError([
      calibration.observerA,
      calibration.observerB,
      measureObserver(engine.psi, engine.width, engine.height, DEFAULT_OBSERVER_C, metrics),
    ]);
    expect(computeCalibrationIdempotenceError(calibration)).toBeLessThanOrEqual(1e-9);
    expect(closure).toBeLessThan(0.16);
  });

  it("genera barridos P1 exportables", () => {
    const rows = runDuatSweep(DEFAULT_PARAMS, {
      chis: [DEFAULT_PARAMS.chi],
      sigmas: [DEFAULT_PARAMS.sigma],
      noises: [0, DEFAULT_PARAMS.noise],
      observerStrengths: [DEFAULT_PARAMS.observerStrength],
      seeds: [42, 1919],
      steps: 12,
      width: 32,
      height: 20,
    });
    const summary = summarizeSweep(rows);
    const csv = sweepRowsToCsv(rows);
    const phaseMap = sweepPhaseMapToMarkdown(rows);
    expect(rows).toHaveLength(4);
    expect(summary.rows).toBe(4);
    expect(summary.lowClipRows).toBe(4);
    expect(csv).toContain("chi,sigma,noise,observerStrength");
    expect(phaseMap).toContain("# DUAT Phase Map");
    expect(phaseMap).toContain("fase dominante");
  });

  it("hace que observerStrength altere el barrido cuando hay observador activo", () => {
    const rows = runDuatSweep(DEFAULT_PARAMS, {
      chis: [DEFAULT_PARAMS.chi],
      sigmas: [DEFAULT_PARAMS.sigma],
      noises: [0],
      observerStrengths: [0, DEFAULT_PARAMS.observerStrength],
      seeds: [42],
      steps: 12,
      width: 32,
      height: 20,
    });
    const inactive = rows.find((row) => row.observerStrength === 0);
    const active = rows.find((row) => row.observerStrength > 0);
    expect(rows).toHaveLength(2);
    expect(inactive).toBeDefined();
    expect(active).toBeDefined();
    expect(Math.abs((active?.liveness ?? 0) - (inactive?.liveness ?? 0))).toBeGreaterThan(0.001);
  });
});
