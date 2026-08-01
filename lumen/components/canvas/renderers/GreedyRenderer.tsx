"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import type { Step } from "@/lib/types/step";

interface GreedyItem {
  index: number;
  label: string;
  picked: boolean;
  status: "idle" | "evaluating" | "picked" | "rejected";
  reason?: string;
}

interface GreedyRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultInput: any;
  steps: Step[];
  slug: string;
}

export function GreedyRenderer({ defaultInput, steps, slug }: GreedyRendererProps) {
  const { currentStep } = usePlaybackStore();
  const [items, setItems] = useState<GreedyItem[]>([]);
  const [runningVal, setRunningVal] = useState<number>(0);

  useEffect(() => {
    // Generate initial state items based on algorithm type
    let list: GreedyItem[] = [];
    if (slug === "activity-selection") {
      const activities = defaultInput.activities || [];
      const sorted = [...activities].sort((a, b) => a.finish - b.finish);
      list = sorted.map((act, i) => ({
        index: i,
        label: `${act.name} [${act.start} - ${act.finish}]`,
        picked: false,
        status: "idle",
      }));
    } else if (slug === "fractional-knapsack") {
      const itemsInput = defaultInput.items || [];
      const sorted = [...itemsInput].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
      list = sorted.map((item, i) => ({
        index: i,
        label: `Wt: ${item.weight}kg, Val: $${item.value} (ratio: ${(item.value / item.weight).toFixed(1)})`,
        picked: false,
        status: "idle",
      }));
    }

    let valTotal = 0;

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];
      if (step.type === "greedyPick") {
        list = list.map((item) => {
          if (item.index === step.itemIndex) {
            return {
              ...item,
              picked: step.picked,
              status: step.picked ? "picked" : "rejected",
              reason: step.reason,
            };
          }
          return item;
        });
        valTotal = step.runningTotal;
      }
    }

    setItems(list);
    setRunningVal(valTotal);
  }, [currentStep, steps, defaultInput, slug]);

  return (
    <div className="w-full h-full flex flex-col p-5 overflow-auto">
      {/* Header Stat */}
      <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
        <span className="text-body font-semibold text-text-secondary">Greedy Choices Timeline</span>
        <div className="bg-primary-500/10 text-primary-500 font-bold px-3 py-1.5 rounded-lg text-caption font-mono shadow-sm">
          {slug === "activity-selection" ? `Selected: ${runningVal}` : `Total Value: $${runningVal.toFixed(1)}`}
        </div>
      </div>

      {/* Item Picker Cards */}
      <div className="space-y-2 flex-1">
        {items.map((item) => {
          const isEvaluating = item.status === "evaluating";
          const isPicked = item.status === "picked";
          const isRejected = item.status === "rejected";

          return (
            <div
              key={item.index}
              className="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 bg-bg-elevated"
              style={{
                borderColor: isPicked
                  ? "var(--success-500)"
                  : isRejected
                  ? "var(--danger-500)"
                  : "var(--border-subtle)",
                boxShadow: isPicked
                  ? "0 0 10px var(--success-500)22"
                  : "none",
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span
                  className="text-body font-bold"
                  style={{
                    color: isPicked
                      ? "var(--success-500)"
                      : isRejected
                      ? "var(--text-tertiary)"
                      : "var(--text-primary)",
                  }}
                >
                  {item.label}
                </span>
                {item.reason && (
                  <span className="text-[11px] text-text-tertiary italic">
                    {item.reason}
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5">
                {isPicked && (
                  <div className="w-6 h-6 rounded-full bg-success-500/10 flex items-center justify-center text-success-500">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                {isRejected && (
                  <div className="w-6 h-6 rounded-full bg-danger-500/10 flex items-center justify-center text-danger-500">
                    <X className="w-3.5 h-3.5" />
                  </div>
                )}
                {!isPicked && !isRejected && (
                  <span className="text-caption text-text-tertiary">Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
