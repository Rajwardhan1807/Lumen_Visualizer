"use client";

import { useEffect, useState, useMemo } from "react";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import type { Step } from "@/lib/types/step";
import { cn } from "@/lib/utils/cn";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  state?: string;
}

interface GraphRendererProps {
  nodes: Array<{ id: string; label: string }>;
  edges: Array<{ from: string; to: string; weight?: number }>;
  steps: Step[];
}

const NODE_STATE_COLORS: Record<string, string> = {
  default: "var(--bg-elevated)",
  sorted: "var(--success-500)",
  comparing: "var(--warning-500)",
  swapping: "var(--danger-500)",
  queued: "var(--info-500)",
  pivot: "var(--primary-500)",
  visited: "var(--success-500)",
  frontier: "var(--info-500)",
};

const EDGE_STATE_COLORS: Record<string, string> = {
  default: "var(--border-subtle)",
  comparing: "var(--warning-500)",
  sorted: "var(--success-500)",
  queued: "var(--info-500)",
};

function layoutNodes(nodes: Array<{ id: string; label: string }>): GraphNode[] {
  const n = nodes.length;
  const W = 500, H = 350;
  const cx = W / 2, cy = H / 2;
  const r = Math.min(W, H) * 0.35;

  return nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      ...node,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
}

export function GraphRenderer({ nodes: rawNodes, edges: rawEdges, steps }: GraphRendererProps) {
  const { currentStep } = usePlaybackStore();

  const layouted = useMemo(() => layoutNodes(rawNodes), [rawNodes]);
  const nodeMap = useMemo(() => new Map(layouted.map((n) => [n.id, n])), [layouted]);

  const [nodeStates, setNodeStates] = useState<Map<string, string>>(new Map());
  const [edgeStates, setEdgeStates] = useState<Map<string, string>>(new Map());
  const [distances, setDistances] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const ns = new Map<string, string>();
    const es = new Map<string, string>();
    const dist = new Map<string, number>();

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];

      if (step.type === "visitNode") {
        ns.set(step.nodeId, step.state);
      } else if (step.type === "visitEdge") {
        const key = `${step.from}-${step.to}`;
        es.set(key, step.state);
        es.set(`${step.to}-${step.from}`, step.state);
      } else if (step.type === "setDistance") {
        dist.set(step.nodeId, step.distance);
      }
    }

    setNodeStates(ns);
    setEdgeStates(es);
    setDistances(dist);
  }, [currentStep, steps]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 500 350" className="w-full h-full max-w-xl" style={{ overflow: "visible" }}>
        {/* Edges */}
        {rawEdges.map((edge, i) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          const key = `${edge.from}-${edge.to}`;
          const state = edgeStates.get(key) ?? "default";
          const color = EDGE_STATE_COLORS[state] ?? EDGE_STATE_COLORS.default;
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;

          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={color}
                strokeWidth={state !== "default" ? 2.5 : 1.5}
                strokeLinecap="round"
                style={{ transition: "stroke 300ms, stroke-width 300ms" }}
              />
              {edge.weight !== undefined && (
                <text
                  x={mx} y={my - 5}
                  textAnchor="middle"
                  className="text-caption"
                  fill="var(--text-tertiary)"
                  fontSize={10}
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {layouted.map((node) => {
          const state = nodeStates.get(node.id) ?? "default";
          const bg = NODE_STATE_COLORS[state] ?? NODE_STATE_COLORS.default;
          const isHighlighted = state !== "default";
          const dist = distances.get(node.id);

          return (
            <g key={node.id} style={{ transition: "all 300ms" }}>
              {/* Outer glow for highlighted */}
              {isHighlighted && (
                <circle
                  cx={node.x} cy={node.y} r={26}
                  fill={bg}
                  opacity={0.2}
                />
              )}
              <circle
                cx={node.x} cy={node.y} r={22}
                fill={isHighlighted ? bg : "var(--bg-elevated)"}
                stroke={isHighlighted ? bg : "var(--border-subtle)"}
                strokeWidth={2}
                style={{
                  filter: isHighlighted
                    ? `drop-shadow(0 0 8px ${bg}88)`
                    : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  transition: "all 300ms",
                }}
              />
              <text
                x={node.x} y={node.y + 5}
                textAnchor="middle"
                fill={isHighlighted ? "#fff" : "var(--text-primary)"}
                fontSize={13}
                fontWeight={600}
                style={{ transition: "fill 300ms" }}
              >
                {node.label}
              </text>
              {dist !== undefined && dist !== Infinity && (
                <text
                  x={node.x} y={node.y + 35}
                  textAnchor="middle"
                  fill="var(--primary-500)"
                  fontSize={10}
                  fontWeight={600}
                >
                  d={dist}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
