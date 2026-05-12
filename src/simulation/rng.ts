export class Mulberry32 {
  private stateValue: number;

  constructor(seed: number) {
    this.stateValue = seed >>> 0;
  }

  get state(): number {
    return this.stateValue >>> 0;
  }

  set state(value: number) {
    this.stateValue = value >>> 0;
  }

  next(): number {
    this.stateValue += 0x6d2b79f5;
    let t = this.stateValue;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  centered(scale = 1): number {
    return (this.next() - 0.5) * scale;
  }
}
