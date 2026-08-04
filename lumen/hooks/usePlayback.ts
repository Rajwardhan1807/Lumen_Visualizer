"use client";

import { useEffect, useRef } from "react";
import { usePlaybackStore } from "@/lib/store/playbackStore";

/**
 * Drives the step-advance interval loop.
 * Base step duration = 600ms, scaled by 1/speed.
 * Uses requestAnimationFrame for smooth timing.
 */
export function usePlayback() {
  const { isPlaying, currentStep, totalSteps, speed, stepForward } =
    usePlaybackStore();

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying || currentStep >= totalSteps - 1) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastTimeRef.current = null;
      }
      return;
    }

    const baseMs = 600; // ms per step at 1× speed
    const stepMs = baseMs / speed;

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed >= stepMs) {
        lastTimeRef.current = timestamp;
        stepForward();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastTimeRef.current = null;
      }
    };
  }, [isPlaying, currentStep, totalSteps, speed, stepForward]);
}
