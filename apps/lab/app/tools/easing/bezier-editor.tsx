"use client";

import type { CubicBezier } from "@cds/motion";
import { useId, useRef, type KeyboardEvent, type PointerEvent } from "react";

const SIZE = 280;
const PAD = 28;
const Y_MIN = -0.5;
const Y_MAX = 1.5;

export type BezierSlot = {
  id: string;
  bezier: CubicBezier;
  color: string;
  enabled: boolean;
};

function toSvg(x: number, y: number) {
  const inner = SIZE - PAD * 2;
  return {
    x: PAD + x * inner,
    y: PAD + (1 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * inner,
  };
}

function fromSvg(x: number, y: number): { x: number; y: number } {
  const inner = SIZE - PAD * 2;
  return {
    x: (x - PAD) / inner,
    y: Y_MIN + (1 - (y - PAD) / inner) * (Y_MAX - Y_MIN),
  };
}

function samplePath(bezier: CubicBezier) {
  const points: string[] = [];
  for (let i = 0; i <= 48; i += 1) {
    const t = i / 48;
    const mt = 1 - t;
    const x =
      3 * mt * mt * t * bezier[0] + 3 * mt * t * t * bezier[2] + t * t * t;
    const y =
      3 * mt * mt * t * bezier[1] + 3 * mt * t * t * bezier[3] + t * t * t;
    const point = toSvg(x, y);
    points.push(`${i === 0 ? "M" : "L"}${String(point.x)} ${String(point.y)}`);
  }
  return points.join(" ");
}

function clampX(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function BezierEditor({
  slots,
  activeId,
  onChange,
}: {
  slots: BezierSlot[];
  activeId: string;
  onChange: (id: string, bezier: CubicBezier) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<"p1" | "p2" | null>(null);
  const graphId = useId();
  const active = slots.find((slot) => slot.id === activeId) ?? slots[0];

  function clientToBezier(event: PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) {
      return { x: 0, y: 0 };
    }
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * SIZE;
    const y = ((event.clientY - rect.top) / rect.height) * SIZE;
    return fromSvg(x, y);
  }

  function updateHandle(handle: "p1" | "p2", next: { x: number; y: number }) {
    if (!active) {
      return;
    }
    const bezier: CubicBezier =
      handle === "p1"
        ? [clampX(next.x), next.y, active.bezier[2], active.bezier[3]]
        : [active.bezier[0], active.bezier[1], clampX(next.x), next.y];
    onChange(active.id, bezier);
  }

  function onPointerDown(handle: "p1" | "p2") {
    return (event: PointerEvent<SVGCircleElement>) => {
      dragRef.current = handle;
      event.currentTarget.setPointerCapture(event.pointerId);
    };
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!dragRef.current) {
      return;
    }
    updateHandle(dragRef.current, clientToBezier(event));
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function onHandleKeyDown(handle: "p1" | "p2") {
    return (event: KeyboardEvent) => {
      if (!active) {
        return;
      }
      const step = event.shiftKey ? 0.05 : 0.01;
      let x = handle === "p1" ? active.bezier[0] : active.bezier[2];
      let y = handle === "p1" ? active.bezier[1] : active.bezier[3];
      if (event.key === "ArrowLeft") x -= step;
      else if (event.key === "ArrowRight") x += step;
      else if (event.key === "ArrowUp") y += step;
      else if (event.key === "ArrowDown") y -= step;
      else return;
      event.preventDefault();
      updateHandle(handle, { x, y });
    };
  }

  if (!active) {
    return null;
  }

  const p1 = toSvg(active.bezier[0], active.bezier[1]);
  const p2 = toSvg(active.bezier[2], active.bezier[3]);
  const start = toSvg(0, 0);
  const end = toSvg(1, 1);

  return (
    <div className="min-w-0">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${String(SIZE)} ${String(SIZE)}`}
        width={SIZE}
        height={SIZE}
        role="img"
        aria-labelledby={graphId}
        className="h-auto w-full max-w-full border border-border bg-surface"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <title id={graphId}>Cubic Bézier easing graph</title>
        <line
          x1={start.x}
          y1={toSvg(0, 1).y}
          x2={end.x}
          y2={toSvg(1, 1).y}
          stroke="currentColor"
          strokeOpacity="0.12"
        />
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="currentColor"
          strokeOpacity="0.18"
        />
        {slots
          .filter((slot) => slot.enabled)
          .map((slot) => (
            <path
              key={slot.id}
              d={samplePath(slot.bezier)}
              fill="none"
              stroke={slot.color}
              strokeWidth={slot.id === active.id ? 2.4 : 1.4}
              strokeOpacity={slot.id === active.id ? 1 : 0.55}
            />
          ))}
        <line
          x1={start.x}
          y1={start.y}
          x2={p1.x}
          y2={p1.y}
          stroke="currentColor"
          strokeOpacity="0.45"
        />
        <line
          x1={end.x}
          y1={end.y}
          x2={p2.x}
          y2={p2.y}
          stroke="currentColor"
          strokeOpacity="0.45"
        />
        <circle
          cx={p1.x}
          cy={p1.y}
          r={7}
          fill="var(--accent)"
          data-testid="bezier-handle-p1-visual"
          onPointerDown={onPointerDown("p1")}
        />
        <circle
          cx={p2.x}
          cy={p2.y}
          r={7}
          fill="var(--accent)"
          data-testid="bezier-handle-p2-visual"
          onPointerDown={onPointerDown("p2")}
        />
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="h-9 border border-border bg-surface px-2 text-left font-mono text-xs"
          role="slider"
          aria-label="First control point"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={Number(active.bezier[0].toFixed(2))}
          aria-valuetext={`X1 ${active.bezier[0].toFixed(2)}, Y1 ${active.bezier[1].toFixed(2)}`}
          data-testid="bezier-handle-p1"
          onKeyDown={onHandleKeyDown("p1")}
        >
          P1 {active.bezier[0].toFixed(2)}, {active.bezier[1].toFixed(2)}
        </button>
        <button
          type="button"
          className="h-9 border border-border bg-surface px-2 text-left font-mono text-xs"
          role="slider"
          aria-label="Second control point"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={Number(active.bezier[2].toFixed(2))}
          aria-valuetext={`X2 ${active.bezier[2].toFixed(2)}, Y2 ${active.bezier[3].toFixed(2)}`}
          data-testid="bezier-handle-p2"
          onKeyDown={onHandleKeyDown("p2")}
        >
          P2 {active.bezier[2].toFixed(2)}, {active.bezier[3].toFixed(2)}
        </button>
      </div>
    </div>
  );
}
