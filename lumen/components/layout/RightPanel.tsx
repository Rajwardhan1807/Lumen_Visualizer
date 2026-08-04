"use client";

import { BookOpen, Gauge, FileCode, History, PanelRight, Activity, Terminal } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlgorithmStore } from "@/lib/store/algorithmStore";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import { algorithmRegistry } from "@/lib/algorithms/registry";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { id: "explanation", label: "Explanation", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "complexity", label: "Complexity", icon: <Gauge className="w-3.5 h-3.5" /> },
  { id: "pseudocode", label: "Pseudocode", icon: <FileCode className="w-3.5 h-3.5" /> },
  { id: "compare", label: "Compare", icon: <History className="w-3.5 h-3.5" /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function RightPanel() {
  const { rightPanelOpen, toggleRightPanel, selectedSlug } = useAlgorithmStore();
  const { steps, currentStep } = usePlaybackStore();
  const [activeTab, setActiveTab] = useState<TabId>("explanation");

  const entry = algorithmRegistry[selectedSlug];
  const currentStepData = steps[currentStep];
  const narration = currentStepData?.narration ?? "Press Play to start the visualization.";

  // Extracted statistics from current step
  const comparisons = currentStepData?.stats?.comparisons ?? 0;
  const swaps = currentStepData?.stats?.swaps ?? 0;
  const accesses = currentStepData?.stats?.accesses ?? 0;

  // Derive active variables depending on step properties
  const variables: Array<{ name: string; value: string | number }> = [];
  if (currentStepData) {
    if ("indices" in currentStepData) {
      variables.push({ name: "active_indices", value: `[${currentStepData.indices.join(", ")}]` });
    }
    if ("index" in currentStepData) {
      variables.push({ name: "target_index", value: currentStepData.index });
    }
    if ("value" in currentStepData && currentStepData.value !== undefined) {
      variables.push({ name: "value", value: String(currentStepData.value) });
    }
    if ("nodeId" in currentStepData && currentStepData.nodeId !== null) {
      variables.push({ name: "node_id", value: currentStepData.nodeId });
    }
    if ("depth" in currentStepData) {
      variables.push({ name: "recursion_depth", value: currentStepData.depth });
    }
  }

  return (
    <AnimatePresence>
      {rightPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex flex-col h-full bg-bg-elevated border-l border-border-subtle overflow-hidden shrink-0"
        >
          {/* Tab bar */}
          <div className="p-3 border-b border-border-subtle flex items-center gap-1">
            <div
              className="flex items-center gap-1 flex-1 p-1 rounded-lg"
              style={{ boxShadow: "var(--shadow-inset)", backgroundColor: "var(--bg-sunken)" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-caption font-medium transition-all duration-[160ms]",
                    activeTab === tab.id
                      ? "bg-primary-500 text-white shadow-level-1"
                      : "text-text-tertiary hover:text-text-secondary"
                  )}
                >
                  {tab.icon}
                  <span className="hidden lg:block">{tab.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={toggleRightPanel}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-tertiary hover:text-text-secondary shadow-level-1 hover:shadow-level-2 bg-bg-elevated transition-all duration-[160ms] ml-1"
              aria-label="Close panel"
            >
              <PanelRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === "explanation" && (
              <>
                <ExplanationTab
                  description={entry?.meta.description ?? ""}
                  narration={narration}
                />
                
                {/* Stats panel */}
                <div className="p-4 rounded-lg bg-bg-sunken border border-border-subtle space-y-3">
                  <div className="flex items-center gap-2 text-text-primary font-semibold text-caption uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-primary-500" />
                    <span>Real-time Metrics</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded bg-bg-elevated shadow-sm">
                      <div className="text-caption text-text-tertiary">Compares</div>
                      <div className="text-body font-mono font-bold text-warning-500">{comparisons}</div>
                    </div>
                    <div className="text-center p-2 rounded bg-bg-elevated shadow-sm">
                      <div className="text-caption text-text-tertiary">Swaps</div>
                      <div className="text-body font-mono font-bold text-danger-500">{swaps}</div>
                    </div>
                    <div className="text-center p-2 rounded bg-bg-elevated shadow-sm">
                      <div className="text-caption text-text-tertiary">Accesses</div>
                      <div className="text-body font-mono font-bold text-info-500">{accesses}</div>
                    </div>
                  </div>
                </div>

                {/* Debugger variables panel */}
                {variables.length > 0 && (
                  <div className="p-4 rounded-lg bg-bg-sunken border border-border-subtle space-y-3">
                    <div className="flex items-center gap-2 text-text-primary font-semibold text-caption uppercase tracking-wider">
                      <Terminal className="w-4 h-4 text-success-500" />
                      <span>Variables Inspector</span>
                    </div>
                    <div className="space-y-1.5 font-mono text-[12px] text-text-secondary">
                      {variables.map((v) => (
                        <div key={v.name} className="flex justify-between border-b border-border-subtle/50 pb-1">
                          <span className="text-text-tertiary">{v.name}:</span>
                          <span className="text-success-500 font-bold">{v.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {activeTab === "complexity" && (
              <ComplexityTab complexity={entry?.meta.complexity} />
            )}
            {activeTab === "pseudocode" && (
              <PseudocodeTab
                pseudocode={entry?.meta.pseudocode ?? []}
                currentLine={currentStepData?.pseudocodeLine ?? -1}
              />
            )}
            {activeTab === "compare" && (
              <CompareTab />
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// ── Explanation Tab ────────────────────────────────────────────────────
function ExplanationTab({ description, narration }: { description: string; narration: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-h3 text-text-primary mb-3">How it works</h3>
        <p className="text-body text-text-secondary leading-relaxed">{description}</p>
      </div>

      {/* Live narration */}
      <div
        className="p-4 rounded-lg border border-primary-500/20"
        style={{ backgroundColor: "color-mix(in srgb, var(--primary-500) 6%, var(--bg-elevated))" }}
      >
        <p className="text-caption text-primary-500 font-semibold mb-1 uppercase tracking-wider">Current step</p>
        <p className="text-body text-primary-500 leading-relaxed font-medium" aria-live="polite">
          {narration}
        </p>
      </div>

      {/* Algorithm state legend */}
      <div>
        <h4 className="text-label text-text-tertiary mb-2">Color Legend</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { color: "var(--warning-500)", label: "Comparing" },
            { color: "var(--danger-500)", label: "Swapping / Mutating" },
            { color: "var(--success-500)", label: "Sorted / Visited" },
            { color: "var(--primary-500)", label: "Pivot / Special" },
            { color: "var(--info-500)", label: "Queued / Frontier" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-caption text-text-secondary">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Complexity Tab ─────────────────────────────────────────────────────
function ComplexityTab({ complexity }: { complexity?: { best: string; average: string; worst: string; space: string } }) {
  if (!complexity) return <p className="text-body text-text-tertiary">Select an algorithm to view complexity.</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-h3 text-text-primary">Time & Space Complexity</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Best Case", value: complexity.best, color: "var(--success-500)" },
          { label: "Average", value: complexity.average, color: "var(--warning-500)" },
          { label: "Worst Case", value: complexity.worst, color: "var(--danger-500)" },
          { label: "Space", value: complexity.space, color: "var(--info-500)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-lg" style={{ boxShadow: "var(--shadow-inset)", backgroundColor: "var(--bg-sunken)" }}>
            <p className="text-label text-text-tertiary mb-1">{label}</p>
            <p className="text-code font-mono tabular-nums text-lg font-semibold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-bg-sunken border border-border-subtle">
        <p className="text-caption text-text-tertiary">
          <strong className="text-text-secondary">Pro tip:</strong> Big-O notation describes the upper bound on algorithm performance as input size n grows.
        </p>
      </div>
    </div>
  );
}

// ── Pseudocode Tab ─────────────────────────────────────────────────────
function PseudocodeTab({ pseudocode, currentLine }: { pseudocode: string[]; currentLine: number }) {
  return (
    <div className="space-y-3">
      <h3 className="text-h3 text-text-primary">Pseudocode</h3>
      <div
        className="rounded-lg overflow-hidden font-mono"
        style={{ boxShadow: "var(--shadow-inset)", backgroundColor: "var(--bg-sunken)" }}
      >
        <div className="p-4 space-y-0.5">
          {pseudocode.map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-2 py-1 rounded-md transition-all duration-[160ms]"
              style={{
                backgroundColor: i === currentLine ? "color-mix(in srgb, var(--primary-500) 12%, transparent)" : "transparent",
              }}
              aria-current={i === currentLine ? "step" : undefined}
            >
              <span className="text-code text-text-tertiary select-none w-4 shrink-0 tabular-nums text-right">
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-code",
                  i === currentLine ? "text-primary-500 font-medium" : "text-text-secondary"
                )}
              >
                {line}
              </span>
            </div>
          ))}
          {pseudocode.length === 0 && (
            <p className="text-body text-text-tertiary py-2">No pseudocode available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Compare Tab ────────────────────────────────────────────────────────
function CompareTab() {
  const { compareSlug, setCompareSlug, toggleCompareMode } = useAlgorithmStore();
  const reg = algorithmRegistry;

  return (
    <div className="space-y-4">
      <h3 className="text-h3 text-text-primary">Compare Algorithms</h3>
      <p className="text-body text-text-secondary">
        Select a second algorithm to run side-by-side on the same input.
      </p>

      <div className="space-y-2">
        {Object.entries(reg).map(([slug, entry]) => (
          <button
            key={slug}
            onClick={() => {
              setCompareSlug(slug);
              toggleCompareMode();
            }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-[160ms]",
              compareSlug === slug
                ? "bg-primary-500/10 text-primary-500 shadow-inset"
                : "text-text-secondary hover:text-text-primary shadow-level-1 hover:shadow-level-2 bg-bg-elevated"
            )}
          >
            <span className="text-body font-medium">{entry.meta.name}</span>
            <span className="text-caption text-text-tertiary">{entry.meta.complexity.average}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
