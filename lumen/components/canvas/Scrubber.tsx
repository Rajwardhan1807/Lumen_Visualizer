"use client";

import { useRef, useCallback } from "react";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import type { Step } from "@/lib/types/step";

interface ScrubberProps {
  steps: Step[];
}

export function Scrubber({ steps }: ScrubberProps) {
  const { currentStep, totalSteps, seekTo, isPlaying } = usePlaybackStore();
  const trackRef = useRef<HTMLDivElement>(null);

  const getStepAtX = useCallback((clientX: number): number => {
    const track = trackRef.current;
    if (!track || totalSteps === 0) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (totalSteps - 1));
  }, [totalSteps]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    seekTo(getStepAtX(e.clientX));
  }, [getStepAtX, seekTo]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    seekTo(getStepAtX(e.clientX));
  }, [getStepAtX, seekTo]);

  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  // Build event density markers
  const compareMarkers: number[] = [];
  const swapMarkers: number[] = [];
  if (totalSteps > 0) {
    steps.forEach((step, i) => {
      const pct = (i / (totalSteps - 1)) * 100;
      if (step.type === "compare") compareMarkers.push(pct);
      if (step.type === "swap") swapMarkers.push(pct);
    });
  }

  return (
    <div className="mt-3 mb-2 px-1 space-y-1.5">
      {/* Density heatmap strip */}
      <div className="h-2 w-full rounded-full relative overflow-hidden" style={{ backgroundColor: "var(--bg-sunken)" }}>
        {compareMarkers.map((pct, i) => (
          <div
            key={`c-${i}`}
            className="absolute top-0 bottom-0 w-0.5 opacity-60"
            style={{ left: `${pct}%`, backgroundColor: "var(--warning-500)" }}
          />
        ))}
        {swapMarkers.map((pct, i) => (
          <div
            key={`s-${i}`}
            className="absolute top-0 bottom-0 w-0.5 opacity-60"
            style={{ left: `${pct}%`, backgroundColor: "var(--danger-500)" }}
          />
        ))}
      </div>

      {/* Main scrubber track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative h-2 rounded-full cursor-pointer"
        style={{ boxShadow: "var(--shadow-inset)", backgroundColor: "var(--bg-sunken)" }}
        role="slider"
        aria-label="Playback position"
        aria-valuenow={currentStep}
        aria-valuemin={0}
        aria-valuemax={Math.max(0, totalSteps - 1)}
        tabIndex={0}
      >
        {/* Filled track */}
        <div
          className="absolute left-0 top-0 bottom-0 rounded-full transition-none"
          style={{
            width: `${progress}%`,
            backgroundColor: "var(--primary-500)",
          }}
        />

        {/* Playhead */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-level-2 bg-bg-elevated border-2 border-primary-500 transition-none"
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* Step narration below scrubber */}
      {steps[currentStep]?.narration && (
        <p className="text-caption text-text-tertiary text-center truncate px-2" aria-live="polite">
          {steps[currentStep].narration}
        </p>
      )}
    </div>
  );
}
