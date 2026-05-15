import { bell, buildGravityKernel, buildLightKernel, clamp, ix } from "./kernels";
import { Mulberry32 } from "./rng";
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  type ActiveObserver,
  type EngineSnapshot,
  type SimulationParams,
} from "./types";

const GK = buildGravityKernel(3);
const LK = buildLightKernel(4, 8);

export class DuatEngine {
  readonly width: number;
  readonly height: number;
  readonly psi: Float32Array;
  readonly nextPsi: Float32Array;
  readonly gravity: Float32Array;
  readonly light: Float32Array;
  readonly previous: Float32Array;
  frame = 0;
  lastClipRatio = 0;
  seed: number;
  rng: Mulberry32;

  constructor(seed = 734567, width = GRID_WIDTH, height = GRID_HEIGHT) {
    this.width = width;
    this.height = height;
    this.seed = seed;
    this.rng = new Mulberry32(seed);
    this.psi = new Float32Array(width * height);
    this.nextPsi = new Float32Array(width * height);
    this.gravity = new Float32Array(width * height);
    this.light = new Float32Array(width * height);
    this.previous = new Float32Array(width * height);
    this.resetNu();
  }

  reset(seed = this.seed): void {
    this.seed = seed;
    this.rng = new Mulberry32(seed);
    this.frame = 0;
    this.lastClipRatio = 0;
    this.resetNu();
  }

  resetNu(): void {
    this.psi.fill(0);
    this.nextPsi.fill(0);
    this.gravity.fill(0);
    this.light.fill(0);
    this.previous.fill(0);
    this.lastClipRatio = 0;
    for (let i = 0; i < this.psi.length; i += 1) {
      this.psi[i] = this.rng.next() < 0.012 ? this.rng.next() * 0.35 : 0;
    }
  }

  step(params: SimulationParams, observer?: ActiveObserver | null): void {
    this.previous.set(this.psi);
    if (params.ruleMode === "conway") {
      this.stepConway(params, observer);
    } else {
      this.stepDuat(params, observer);
    }
    this.psi.set(this.nextPsi);
    this.frame += 1;
  }

  paint(x: number, y: number, radius: number, value: number): void {
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx * dx + dy * dy > radius * radius) continue;
        this.psi[ix(x + dx, y + dy, this.width, this.height)] = clamp(value, 0, 1);
      }
    }
  }

  seedAtum(cx: number, cy: number): void {
    this.paint(cx, cy, 0, 1);
    for (let r = 1; r <= 3; r += 1) {
      for (let a = 0; a < 12; a += 1) {
        const dx = Math.round(Math.cos((a * Math.PI) / 6) * r);
        const dy = Math.round(Math.sin((a * Math.PI) / 6) * r);
        const id = ix(cx + dx, cy + dy, this.width, this.height);
        this.psi[id] = Math.max(this.psi[id], 0.55 * (1 - r / 4));
      }
    }
  }

  seedDuat(cx: number, cy: number): void {
    for (let i = 0; i < 42; i += 1) {
      const angle = (i / 42) * Math.PI * 2;
      const ring = i < 14 ? 6 : i < 28 ? 12 : 18;
      const x = Math.round(cx + Math.cos(angle) * ring);
      const y = Math.round(cy + Math.sin(angle) * ring * 0.62);
      this.psi[ix(x, y, this.width, this.height)] = 0.62 + this.rng.next() * 0.34;
    }
  }

  seedOsiris(cx: number, cy: number): void {
    for (let dy = -6; dy <= 6; dy += 1) {
      for (let dx = -6; dx <= 6; dx += 1) {
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r > 6) continue;
        const value = Math.exp(-(r * r) / (2 * 2.35 * 2.35));
        const id = ix(cx + dx, cy + dy, this.width, this.height);
        this.psi[id] = Math.max(this.psi[id], value);
      }
    }
  }

  snapshot(params: SimulationParams): EngineSnapshot {
    return {
      width: this.width,
      height: this.height,
      frame: this.frame,
      seed: this.seed,
      rngState: this.rng.state,
      params,
      cells: Array.from(this.psi, (v) => Number(v.toFixed(6))),
    };
  }

  restore(snapshot: EngineSnapshot): void {
    if (snapshot.width !== this.width || snapshot.height !== this.height) {
      throw new Error("Snapshot dimensions do not match engine dimensions.");
    }
    this.frame = snapshot.frame;
    this.seed = snapshot.seed;
    this.rng = new Mulberry32(snapshot.seed);
    this.rng.state = snapshot.rngState;
    this.psi.set(snapshot.cells);
    this.previous.set(snapshot.cells);
    this.nextPsi.fill(0);
  }

  private stepDuat(params: SimulationParams, observer?: ActiveObserver | null): void {
    const mu = params.chi * 0.42 + 0.04;
    const ablation = params.ablationMode ?? "full";
    let clipped = 0;
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const id = ix(x, y, this.width, this.height);
        let g = 0;
        let l = 0;
        for (const cell of GK) g += this.psi[ix(x + cell.dx, y + cell.dy, this.width, this.height)] * cell.w;
        for (const cell of LK) l += this.psi[ix(x + cell.dx, y + cell.dy, this.width, this.height)] * cell.w;
        const effectiveG = ablation === "no-g" ? 0 : g;
        const effectiveL = ablation === "no-l" ? 0 : l;
        this.gravity[id] = effectiveG;
        this.light[id] = effectiveL;

        let obs = 0;
        if (observer && ablation !== "no-observer") {
          const dx = x - observer.x;
          const dy = y - observer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 32) {
            const saturationGate = 1 - observer.profile.saturation * 0.45;
            obs = observer.strength * saturationGate * Math.exp(-d2 / 6);
          }
        }

        const growth = 2 * bell(effectiveG, mu, params.sigma) - 1;
        const sourceGate = clamp((effectiveG + effectiveL + this.psi[id]) * 2.8 + obs * 0.8, 0, 1);
        const capacity = 1 - this.psi[id];
        const growthTerm = growth >= 0 ? growth * sourceGate * capacity : growth * sourceGate * this.psi[id];
        const vacuumDrag = this.psi[id] * (1 - sourceGate) * 0.08;
        const lightCoupling = (params.chi - 0.5) * effectiveL * 0.55;
        const lightTerm = lightCoupling >= 0 ? lightCoupling * capacity : lightCoupling * this.psi[id];
        const observerTerm = obs * 0.28 * capacity;
        const rawNoise = ablation === "no-noise" ? 0 : this.rng.centered(params.noise);
        const negativeNoiseGate = clamp(this.psi[id] + sourceGate, 0, 1);
        const noise = rawNoise < 0 ? rawNoise * negativeNoiseGate : rawNoise;
        const raw = this.psi[id] + params.dt * (growthTerm - vacuumDrag + lightTerm + observerTerm) + noise;
        if (raw < 0 || raw > 1) clipped += 1;
        this.nextPsi[id] = clamp(raw, 0, 1);
      }
    }
    this.lastClipRatio = clipped / this.psi.length;
  }

  private stepConway(params: SimulationParams, observer?: ActiveObserver | null): void {
    this.lastClipRatio = 0;
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const id = ix(x, y, this.width, this.height);
        let live = 0;
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0) continue;
            live += this.psi[ix(x + dx, y + dy, this.width, this.height)] > 0.5 ? 1 : 0;
          }
        }
        const alive = this.psi[id] > 0.5;
        let next = alive ? (live === 2 || live === 3 ? 1 : 0) : live === 3 ? 1 : 0;
        if (observer) {
          const dx = x - observer.x;
          const dy = y - observer.y;
          if (dx * dx + dy * dy < 16 && this.rng.next() < params.observerStrength * 0.08) {
            next = 1 - next;
          }
        }
        this.gravity[id] = live / 8;
        this.light[id] = Math.abs(live - 3) / 8;
        this.nextPsi[id] = next;
      }
    }
  }
}
