export const GRID_WIDTH = 130;
export const GRID_HEIGHT = 82;
export const CHI_STAR = 0.5671432904097838;

export type CosmologyState = "NU" | "ATUM" | "DUAT" | "MAAT" | "OSIRIS" | "COLAPSO";
export type RuleMode = "duat" | "conway";
export type AblationMode = "full" | "no-g" | "no-l" | "no-observer" | "no-noise";
export type ViewMode = "life" | "calibration" | "dual-observer" | "blind-society" | "peer-review";
export type OverlayMode = "psi" | "gravity" | "light" | "observer-delta";
export type ToolMode = "draw" | "erase" | "observe" | "atum" | "duat" | "osiris";
export type ObserverModality = "visual" | "sonora" | "tactil";

export interface SimulationParams {
  chi: number;
  sigma: number;
  dt: number;
  noise: number;
  observerStrength: number;
  speed: number;
  running: boolean;
  ruleMode: RuleMode;
  ablationMode?: AblationMode;
}

export interface ObserverProfile {
  id: "a" | "b" | "c";
  name: string;
  resolution: number;
  saturation: number;
  noise: number;
  temporalWindow: number;
  modality: ObserverModality;
}

export interface ActiveObserver {
  x: number;
  y: number;
  strength: number;
  profile: ObserverProfile;
}

export interface KernelCell {
  dx: number;
  dy: number;
  w: number;
}

export interface EngineSnapshot {
  width: number;
  height: number;
  frame: number;
  seed: number;
  rngState: number;
  params: SimulationParams;
  cells: number[];
}

export interface SimulationMetrics {
  mean: number;
  variance: number;
  entropy: number;
  activity: number;
  edge: number;
  gMean: number;
  lMean: number;
  balance: number;
  lgBalance: number;
  spectralEntropy: number;
  dimObs: number;
  atumScore: number;
  osirisScore: number;
  clipArtifactRatio: number;
  liveness: number;
  residue: number;
  phiEff: number;
  centroidX: number;
  centroidY: number;
  persistentFrames: number;
  cosmologyState: CosmologyState;
}

export interface ObserverMeasurement {
  observerId: ObserverProfile["id"];
  label: string;
  modality: ObserverModality;
  measuredMean: number;
  measuredEntropy: number;
  saturationLoad: number;
  languageVector: [number, number, number, number, number];
  symbol: string;
}

export interface CalibrationResult {
  divergence: number;
  calibratedDivergence: number;
  invariantScore: number;
  sharedLanguage: string;
  observerA: ObserverMeasurement;
  observerB: ObserverMeasurement;
}

export interface BenchmarkResult {
  id: string;
  label: string;
  passed: boolean;
  value: string;
  threshold: string;
  evidence: string;
}
