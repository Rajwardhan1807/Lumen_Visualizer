"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import type { Step, ElementState } from "@/lib/types/step";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STATE_COLORS: Record<ElementState, string> = {
  default: "var(--text-tertiary)",
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

interface ArrayRendererProps {
  initialArray: number[];
  steps: Step[];
}

interface BarState {
  value: number;
  state: ElementState;
  opacity: number;
}

export function ArrayRenderer({ initialArray, steps }: ArrayRendererProps) {
  const { currentStep } = usePlaybackStore();
  const reducedMotion = useReducedMotion();

  const [barStates, setBarStates] = useState<BarState[]>(() =>
    initialArray.map((v) => ({ value: v, state: "default" as ElementState, opacity: 1 }))
  );

  // Replay all steps up to currentStep to derive bar states
  useEffect(() => {
    const arr: number[] = [...initialArray];
    const states: ElementState[] = new Array(arr.length).fill("default");
    const opacities: number[] = new Array(arr.length).fill(1);

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];

      // Reset highlighting from previous step (keep sorted)
      for (let j = 0; j < states.length; j++) {
        if (states[j] !== "sorted" && states[j] !== "eliminated") {
          states[j] = "default";
        }
      }

      switch (step.type) {
        case "compare":
          step.indices.forEach((idx) => {
            if (idx >= 0 && idx < states.length) states[idx] = "comparing";
          });
          break;

        case "swap": {
          const [a, b] = step.indices;
          [arr[a], arr[b]] = [arr[b], arr[a]];
          states[a] = "swapping";
          states[b] = "swapping";
          break;
        }

        case "set":
          arr[step.index] = step.value;
          states[step.index] = "current";
          break;

        case "mark":
          states[step.index] = step.state;
          break;

        case "markRange":
          for (let j = step.start; j <= step.end && j < states.length; j++) {
            states[j] = step.state;
            if (step.state === "eliminated") opacities[j] = 0.2;
          }
          break;

        default:
          break;
      }
    }

    setBarStates(arr.map((v, i) => ({
      value: v,
      state: states[i],
      opacity: opacities[i],
    })));
  }, [currentStep, steps, initialArray]);

  const maxValue = useMemo(() => Math.max(...initialArray, 1), [initialArray]);

  const springConfig = reducedMotion
    ? { type: "tween" as const, duration: 0.1 }
    : { type: "spring" as const, stiffness: 400, damping: 30 };

  return (
    <div className="w-full h-full flex items-end justify-center gap-1 px-4 pb-4 pt-8 min-h-[200px]">
      {barStates.map((bar, i) => {
        const heightPct = (bar.value / maxValue) * 100;
        const color = STATE_COLORS[bar.state];
        const isActive = bar.state === "comparing" || bar.state === "swapping" || bar.state === "pivot";

        return (
          <motion.div
            key={i}
            layout={!reducedMotion}
            animate={{
              height: `${heightPct}%`,
              backgroundColor: color,
              opacity: bar.opacity,
              scale: isActive ? 1.05 : 1,
            }}
            transition={springConfig}
            className="flex-1 min-w-0 rounded-t-sm relative flex items-start justify-center"
            style={{
              maxWidth: 60,
              boxShadow: isActive
                ? `0 -4px 12px ${color}66, var(--shadow-1)`
                : undefined,
            }}
          >
            {/* Value label — only show for small arrays */}
            {initialArray.length <= 20 && (
              <span
                className="absolute -top-5 text-caption tabular-nums text-text-tertiary font-medium"
                style={{ color: isActive ? color : undefined }}
              >
                {bar.value}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
