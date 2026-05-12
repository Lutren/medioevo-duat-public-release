import type { KernelCell } from "./types";

export function clamp(value: number, lo: number, hi: number): number {
  return value < lo ? lo : value > hi ? hi : value;
}

export function bell(x: number, mean: number, sigma: number): number {
  return Math.exp(-((x - mean) ** 2) / (2 * sigma * sigma));
}

export function ix(x: number, y: number, width: number, height: number): number {
  return ((y % height + height) % height) * width + ((x % width + width) % width);
}

export function buildGravityKernel(radius: number): KernelCell[] {
  const cells: KernelCell[] = [];
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const r = Math.sqrt(dx * dx + dy * dy) / radius;
      if (r > 1) continue;
      const w = Math.exp(-((r - 0.5) ** 2) / (2 * 0.22 ** 2));
      cells.push({ dx, dy, w });
    }
  }
  return normalize(cells);
}

export function buildLightKernel(innerRadius: number, outerRadius: number): KernelCell[] {
  const cells: KernelCell[] = [];
  for (let dy = -outerRadius; dy <= outerRadius; dy += 1) {
    for (let dx = -outerRadius; dx <= outerRadius; dx += 1) {
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r < innerRadius || r > outerRadius) continue;
      cells.push({ dx, dy, w: 1 });
    }
  }
  return normalize(cells);
}

function normalize(cells: KernelCell[]): KernelCell[] {
  const sum = cells.reduce((acc, cell) => acc + cell.w, 0);
  if (sum === 0) return cells;
  return cells.map((cell) => ({ ...cell, w: cell.w / sum }));
}
