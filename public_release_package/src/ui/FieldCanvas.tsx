import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import type { ActiveObserver, ObserverProfile, OverlayMode } from "../simulation/types";

interface FieldCanvasProps {
  width: number;
  height: number;
  psi: Float32Array;
  gravity: Float32Array;
  light: Float32Array;
  overlay: OverlayMode;
  observerA: ObserverProfile;
  observerB: ObserverProfile;
  activeObserver: ActiveObserver | null;
  renderTick: number;
  onFieldPointerDown: (event: PointerEvent<HTMLCanvasElement>) => void;
  onFieldPointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
  onFieldPointerUp: () => void;
}

export function FieldCanvas({
  width,
  height,
  psi,
  gravity,
  light,
  overlay,
  observerA,
  observerB,
  activeObserver,
  renderTick,
  onFieldPointerDown,
  onFieldPointerMove,
  onFieldPointerUp,
}: FieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const scale = 5;
    const targetWidth = width * scale;
    const targetHeight = height * scale;
    if (canvas.width !== targetWidth) canvas.width = targetWidth;
    if (canvas.height !== targetHeight) canvas.height = targetHeight;

    const image = ctx.createImageData(targetWidth, targetHeight);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const id = y * width + x;
        const [r, g, b] = colorForCell(psi[id], gravity[id], light[id], overlay, observerA, observerB);
        const observerGlow = observerContribution(x, y, activeObserver);
        const px = x * scale;
        const py = y * scale;
        for (let oy = 0; oy < scale; oy += 1) {
          for (let ox = 0; ox < scale; ox += 1) {
            const p = ((py + oy) * targetWidth + px + ox) * 4;
            data[p] = Math.min(255, r + observerGlow * 40);
            data[p + 1] = Math.min(255, g + observerGlow * 58);
            data[p + 2] = Math.min(255, b + observerGlow * 82);
            data[p + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(image, 0, 0);
  }, [activeObserver, gravity, height, light, observerA, observerB, overlay, psi, renderTick, width]);

  return (
    <canvas
      ref={canvasRef}
      className="field-canvas"
      aria-label="Campo vivo DUAT Genesis"
      onPointerDown={onFieldPointerDown}
      onPointerMove={onFieldPointerMove}
      onPointerUp={onFieldPointerUp}
      onPointerLeave={onFieldPointerUp}
    />
  );
}

function colorForCell(
  psi: number,
  gravity: number,
  light: number,
  overlay: OverlayMode,
  observerA: ObserverProfile,
  observerB: ObserverProfile,
): [number, number, number] {
  if (overlay === "gravity") {
    return [Math.round(gravity * 255), Math.round((gravity + psi) * 92), Math.round(psi * 30)];
  }
  if (overlay === "light") {
    return [Math.round(psi * 35), Math.round((light + psi) * 130), Math.round(light * 255)];
  }
  if (overlay === "observer-delta") {
    const a = 1 - Math.exp(-psi * (1 + observerA.saturation * 2.8));
    const b = 1 - Math.exp(-psi * (1 + observerB.saturation * 2.8));
    const delta = Math.abs(a - b);
    return [Math.round(delta * 230), Math.round((1 - delta) * psi * 190), Math.round((delta + light) * 150)];
  }

  const balance = 1 - Math.min(1, Math.abs(gravity - light) * 8);
  return [
    Math.round(psi * (80 + gravity * 180)),
    Math.round(psi * (75 + balance * 170)),
    Math.round(psi * (70 + light * 185)),
  ];
}

function observerContribution(x: number, y: number, observer: ActiveObserver | null): number {
  if (!observer) return 0;
  const dx = x - observer.x;
  const dy = y - observer.y;
  const d2 = dx * dx + dy * dy;
  return d2 < 40 ? Math.exp(-d2 / 10) * observer.strength : 0;
}
