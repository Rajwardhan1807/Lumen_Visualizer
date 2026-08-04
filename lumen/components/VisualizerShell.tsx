"use client";

import { useEffect } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightPanel } from "@/components/layout/RightPanel";
import { Footer } from "@/components/layout/Footer";
import { AlgorithmCanvas } from "@/components/canvas/AlgorithmCanvas";
import { useAlgorithmStore } from "@/lib/store/algorithmStore";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import { algorithmRegistry } from "@/lib/algorithms/registry";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { usePlayback } from "@/hooks/usePlayback";

export function VisualizerShell() {
  const { selectedSlug, selectedCategory, input } = useAlgorithmStore();
  const { setSteps } = usePlaybackStore();

  // Register keyboard shortcuts
  useKeyboardShortcuts();

  // Drive the playback loop
  usePlayback();

  // Generate steps whenever algorithm or input changes
  useEffect(() => {
    const entry = algorithmRegistry[selectedSlug];
    if (!entry) return;

    const effectiveInput = input ?? entry.meta.defaultInput;
    try {
      const steps = entry.generateSteps(effectiveInput as never);
      setSteps(steps);
    } catch (err) {
      console.error("Step generation error:", err);
    }
  }, [selectedSlug, input, setSteps]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-base">
      <TopNav />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden p-5 gap-0 min-w-0">
          <AlgorithmCanvas />
        </main>

        {/* Right Panel */}
        <RightPanel />
      </div>

      <Footer />
    </div>
  );
}
