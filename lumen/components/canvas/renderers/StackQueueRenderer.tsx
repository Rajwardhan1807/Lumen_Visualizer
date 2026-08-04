"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import type { Step } from "@/lib/types/step";

interface StackQueueRendererProps {
  initialArray: number[];
  steps: Step[];
  mode: "stack" | "queue";
}

export function StackQueueRenderer({ initialArray, steps, mode }: StackQueueRendererProps) {
  const { currentStep } = usePlaybackStore();
  const [elements, setElements] = useState<Array<{ id: string; value: string | number }>>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Reconstruct stack/queue state
    let list: Array<{ id: string; value: string | number }> = initialArray.map((v, i) => ({ id: `el-${i}`, value: v }));
    let highlightIdx: number | null = null;

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];
      if (step.type === "push" || step.type === "enqueue") {
        list.push({ id: `step-${i}`, value: step.value });
      } else if (step.type === "pop") {
        list.pop();
      } else if (step.type === "dequeue") {
        list.shift();
      } else if (step.type === "peek") {
        highlightIdx = list.length - 1;
      } else if (step.type === "highlightTop") {
        highlightIdx = step.index;
      }
    }

    setElements(list);
    setHighlightedIndex(highlightIdx);
  }, [currentStep, steps, initialArray]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 overflow-auto">
      {mode === "stack" ? (
        // Stack layout (Vertical container)
        <div className="flex flex-col items-center">
          <p className="text-caption text-text-tertiary mb-3 uppercase tracking-wider">Top of Stack</p>
          <div
            className="w-32 min-h-[220px] max-h-[300px] border-x-4 border-b-4 border-border-subtle rounded-b-xl p-3 flex flex-col-reverse justify-start gap-2 bg-bg-sunken/40 overflow-y-auto"
            style={{ boxShadow: "var(--shadow-inset)" }}
          >
            <AnimatePresence initial={false}>
              {elements.map((el, idx) => {
                const isTop = idx === elements.length - 1;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <motion.div
                    key={el.id}
                    initial={{ opacity: 0, y: -20, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-full h-11 rounded-lg flex items-center justify-center text-body font-bold shadow-sm transition-all duration-300"
                    style={{
                      backgroundColor: isHighlighted
                        ? "var(--warning-500)"
                        : isTop
                        ? "var(--primary-500)"
                        : "var(--bg-elevated)",
                      color: isHighlighted || isTop ? "#fff" : "var(--text-primary)",
                    }}
                  >
                    {el.value}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <p className="text-caption text-text-tertiary mt-3 uppercase tracking-wider">Bottom of Stack</p>
        </div>
      ) : (
        // Queue layout (Horizontal pipe)
        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="flex justify-between w-full text-caption text-text-tertiary px-4 mb-2 uppercase tracking-wider">
            <span>Front (Dequeue)</span>
            <span>Back (Enqueue)</span>
          </div>

          <div
            className="w-full h-24 border-y-4 border-border-subtle rounded-lg p-3 flex items-center gap-2 bg-bg-sunken/40 overflow-x-auto justify-start"
            style={{ boxShadow: "var(--shadow-inset)" }}
          >
            <AnimatePresence initial={false}>
              {elements.map((el, idx) => {
                const isFront = idx === 0;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <motion.div
                    key={el.id}
                    initial={{ opacity: 0, x: 50, scale: 0.85 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-body-lg font-bold shadow-sm shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: isHighlighted
                        ? "var(--warning-500)"
                        : isFront
                        ? "var(--primary-500)"
                        : "var(--bg-elevated)",
                      color: isHighlighted || isFront ? "#fff" : "var(--text-primary)",
                    }}
                  >
                    {el.value}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
