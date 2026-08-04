"use client";

import { useEffect, useState } from "react";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import type { Step } from "@/lib/types/step";

interface RecursionTreeNode {
  callId: string;
  parentCallId: string | null;
  fn: string;
  args: Record<string, unknown>;
  returnValue?: unknown;
  depth: number;
  x?: number;
  y?: number;
}

interface RecursionTreeRendererProps {
  steps: Step[];
}

export function RecursionTreeRenderer({ steps }: RecursionTreeRendererProps) {
  const { currentStep } = usePlaybackStore();
  const [nodes, setNodes] = useState<RecursionTreeNode[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  useEffect(() => {
    const nodeMap = new Map<string, RecursionTreeNode>();
    let lastCallId: string | null = null;

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];
      if (step.type === "call") {
        nodeMap.set(step.callId, {
          callId: step.callId,
          parentCallId: step.parentCallId,
          fn: step.fn,
          args: step.args,
          depth: step.depth,
        });
        lastCallId = step.callId;
      } else if (step.type === "return") {
        const node = nodeMap.get(step.callId);
        if (node) {
          nodeMap.set(step.callId, { ...node, returnValue: step.value });
          lastCallId = step.callId;
        }
      }
    }

    // Layout nodes by depth
    const allNodes = Array.from(nodeMap.values());
    const byDepth = new Map<number, RecursionTreeNode[]>();
    for (const n of allNodes) {
      if (!byDepth.has(n.depth)) byDepth.set(n.depth, []);
      byDepth.get(n.depth)!.push(n);
    }

    const W = 600, nodeH = 60;
    const positioned = allNodes.map((n) => {
      const siblings = byDepth.get(n.depth) ?? [];
      const idx = siblings.indexOf(n);
      const total = siblings.length;
      return {
        ...n,
        x: total > 1 ? (idx / (total - 1)) * (W - 100) + 50 : W / 2,
        y: n.depth * nodeH + 30,
      };
    });

    setNodes(positioned);
    setActiveCallId(lastCallId);
  }, [currentStep, steps]);

  const nodeMap = new Map(nodes.map((n) => [n.callId, n]));
  const maxY = nodes.reduce((acc, n) => Math.max(acc, n.y ?? 0), 0) + 80;

  return (
    <div className="w-full h-full overflow-auto p-4">
      <svg viewBox={`0 0 600 ${maxY}`} className="w-full" style={{ minHeight: 200 }}>
        {/* Edges */}
        {nodes.map((node) => {
          if (!node.parentCallId) return null;
          const parent = nodeMap.get(node.parentCallId);
          if (!parent) return null;
          return (
            <line
              key={`e-${node.callId}`}
              x1={parent.x} y1={(parent.y ?? 0) + 15}
              x2={node.x} y2={(node.y ?? 0) - 15}
              stroke="var(--border-subtle)"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = node.callId === activeCallId;
          const hasReturn = node.returnValue !== undefined;
          const bg = isActive
            ? "var(--primary-500)"
            : hasReturn
            ? "var(--success-500)"
            : "var(--bg-elevated)";
          const textColor = isActive || hasReturn ? "#fff" : "var(--text-primary)";

          const label = `${node.fn}(${Object.values(node.args).join(", ")})`;
          const returnLabel = hasReturn ? `= ${node.returnValue}` : "";

          return (
            <g key={node.callId}>
              <rect
                x={(node.x ?? 0) - 55} y={(node.y ?? 0) - 16}
                width={110} height={30}
                rx={8}
                fill={bg}
                stroke={isActive ? "var(--primary-500)" : "var(--border-subtle)"}
                strokeWidth={1.5}
                style={{
                  filter: isActive ? "drop-shadow(0 0 6px var(--primary-500)88)" : "none",
                  transition: "all 200ms",
                }}
              />
              <text
                x={node.x} y={(node.y ?? 0) + 5}
                textAnchor="middle"
                fill={textColor}
                fontSize={11}
                fontFamily="var(--font-geist-mono, monospace)"
              >
                {label.length > 18 ? label.slice(0, 16) + "…" : label}
              </text>
              {returnLabel && (
                <text
                  x={node.x} y={(node.y ?? 0) + 25}
                  textAnchor="middle"
                  fill="var(--success-500)"
                  fontSize={10}
                  fontFamily="var(--font-geist-mono, monospace)"
                >
                  {returnLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── DP Table Renderer ────────────────────────────────────────────────
interface DPTableRendererProps {
  rows: number;
  cols: number;
  steps: Step[];
  rowLabels?: string[];
  colLabels?: string[];
}

export function DPTableRenderer({ rows, cols, steps, rowLabels, colLabels }: DPTableRendererProps) {
  const { currentStep } = usePlaybackStore();
  const [cells, setCells] = useState<Array<Array<{ value: number | string; state: string }>>>(() =>
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ value: -1, state: "default" }))
    )
  );

  useEffect(() => {
    const grid: Array<Array<{ value: number | string; state: string }>> = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ value: -1, state: "default" }))
    );

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];
      if (step.type === "fillCell" && step.row < rows && step.col < cols) {
        grid[step.row][step.col] = { value: step.value, state: step.state };
      } else if (step.type === "highlightCell") {
        // Reset highlights
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++)
            if (grid[r][c].state === "queued") grid[r][c] = { ...grid[r][c], state: "default" };

        for (const [r, c] of step.cells) {
          if (r < rows && c < cols) grid[r][c] = { ...grid[r][c], state: step.state };
        }
      }
    }

    setCells(grid);
  }, [currentStep, steps, rows, cols]);

  const STATE_COLORS: Record<string, string> = {
    default: "var(--bg-elevated)",
    sorted: "var(--success-500)",
    queued: "var(--info-500)",
    pivot: "var(--primary-500)",
    comparing: "var(--warning-500)",
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
      <table className="border-collapse">
        <thead>
          <tr>
            <th />
            {colLabels?.map((l, i) => (
              <th key={i} className="text-caption text-text-tertiary px-2 py-1 font-mono">{l}</th>
            ))}
            {!colLabels && Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="text-caption text-text-tertiary px-2 py-1 font-mono tabular-nums">{i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((row, r) => (
            <tr key={r}>
              <td className="text-caption text-text-tertiary px-2 font-mono pr-3">
                {rowLabels?.[r] ?? r}
              </td>
              {row.map((cell, c) => (
                <td key={c} className="p-0.5">
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-md text-code tabular-nums font-medium transition-all duration-300"
                    style={{
                      backgroundColor: cell.state !== "default" ? STATE_COLORS[cell.state] : "var(--bg-elevated)",
                      color: cell.state !== "default" ? "#fff" : "var(--text-secondary)",
                      boxShadow: cell.state !== "default"
                        ? `0 0 12px ${STATE_COLORS[cell.state]}66`
                        : "var(--shadow-inset)",
                    }}
                  >
                    {cell.value === -1 ? "—" : cell.value}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
