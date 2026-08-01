"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import type { Step, ElementState } from "@/lib/types/step";

interface LLNode {
  id: string;
  value: number;
  state: ElementState;
}

interface LinkedListRendererProps {
  initialArray: number[];
  steps: Step[];
}

export function LinkedListRenderer({ initialArray, steps }: LinkedListRendererProps) {
  const { currentStep } = usePlaybackStore();
  const [nodes, setNodes] = useState<LLNode[]>([]);
  const [pointers, setPointers] = useState<Record<string, string | null>>({});

  useEffect(() => {
    // Replay steps
    let currentNodes: LLNode[] = initialArray.map((v, i) => ({
      id: `n${i}`,
      value: v,
      state: "default",
    }));

    const currentPointers: Record<string, string | null> = {
      curr: null,
      prev: null,
      next: null,
      slow: null,
      fast: null,
      l1: null,
      l2: null,
    };

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];

      // Reset non-sorted / non-eliminated highlights
      currentNodes = currentNodes.map((node) => ({
        ...node,
        state: node.state === "sorted" || node.state === "eliminated" ? node.state : "default",
      }));

      switch (step.type) {
        case "llMark":
          currentNodes = currentNodes.map((n) =>
            n.id === step.nodeId ? { ...n, state: step.state } : n
          );
          break;

        case "llSetPointer":
          currentPointers[step.name] = step.nodeId;
          break;

        case "llInsert": {
          const insertNode: LLNode = {
            id: step.nodeId,
            value: step.value,
            state: "sorted",
          };
          if (step.afterId === null) {
            currentNodes = [insertNode, ...currentNodes];
          } else {
            const idx = currentNodes.findIndex((n) => n.id === step.afterId);
            if (idx !== -1) {
              currentNodes = [
                ...currentNodes.slice(0, idx + 1),
                insertNode,
                ...currentNodes.slice(idx + 1),
              ];
            } else {
              currentNodes.push(insertNode);
            }
          }
          break;
        }

        case "llDelete":
          currentNodes = currentNodes.filter((n) => n.id !== step.nodeId);
          break;

        default:
          break;
      }
    }

    setNodes(currentNodes);
    setPointers(currentPointers);
  }, [currentStep, steps, initialArray]);

  const STATE_COLORS: Record<ElementState, string> = {
    default: "var(--bg-elevated)",
    comparing: "var(--warning-500)",
    swapping: "var(--danger-500)",
    sorted: "var(--success-500)",
    pivot: "var(--primary-500)",
    queued: "var(--info-500)",
    current: "var(--primary-400)",
    eliminated: "var(--text-tertiary)",
    visited: "var(--success-500)",
    path: "var(--success-500)",
    selected: "var(--primary-500)",
    highlighted: "var(--warning-500)",
    error: "var(--danger-500)",
    success: "var(--success-500)",
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 overflow-auto">
      <div className="flex items-center gap-2 flex-wrap justify-center min-h-[140px]">
        {nodes.map((node, i) => {
          const activePointers = Object.entries(pointers)
            .filter(([, nid]) => nid === node.id)
            .map(([name]) => name);

          const color = STATE_COLORS[node.state] || "var(--border-subtle)";
          const isHighlighted = node.state !== "default";

          return (
            <div key={node.id} className="flex items-center gap-2">
              {/* Node Card */}
              <div className="flex flex-col items-center gap-1.5">
                {/* Pointers above node */}
                <div className="h-6 flex gap-1 items-center justify-center">
                  {activePointers.map((name) => (
                    <span
                      key={name}
                      className="text-label text-[9px] px-1.5 py-0.5 rounded bg-primary-500 text-white font-bold uppercase shadow-sm"
                    >
                      {name}
                    </span>
                  ))}
                  {activePointers.length === 0 && <span className="w-4" />}
                </div>

                {/* Node Box */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-body-lg font-bold border-2 transition-all duration-300"
                  style={{
                    backgroundColor: isHighlighted ? `${color}15` : "var(--bg-elevated)",
                    borderColor: color,
                    boxShadow: isHighlighted
                      ? `0 0 14px ${color}44, var(--shadow-1)`
                      : "var(--shadow-1)",
                  }}
                >
                  <span style={{ color: isHighlighted ? color : "var(--text-primary)" }}>
                    {node.value}
                  </span>
                </div>

                {/* Index tag */}
                <span className="text-[10px] text-text-tertiary font-mono">
                  idx: {i}
                </span>
              </div>

              {/* Link Arrow */}
              {i < nodes.length - 1 && (
                <div className="pt-6">
                  <ArrowRight className="w-5 h-5 text-text-tertiary" />
                </div>
              )}
            </div>
          );
        })}

        {nodes.length === 0 && (
          <p className="text-body text-text-tertiary">List is empty</p>
        )}
      </div>
    </div>
  );
}
