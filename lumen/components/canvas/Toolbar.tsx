"use client";

import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle, Gauge,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import { cn } from "@/lib/utils/cn";

interface ToolbarProps {
  onShuffle?: () => void;
}

export function Toolbar({ onShuffle }: ToolbarProps) {
  const {
    isPlaying, toggle, stepBack, stepForward, reset, speed, setSpeed,
    currentStep, totalSteps,
  } = usePlaybackStore();

  const speedOptions = [0.25, 0.5, 1, 1.5, 2, 3, 4];

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full h-14 mb-4"
      style={{
        backgroundColor: "var(--bg-elevated)",
        boxShadow: "var(--shadow-1)",
      }}
    >
      {/* Step Back */}
      <ToolbarIconButton onClick={stepBack} label="Step backward" disabled={currentStep === 0}>
        <SkipBack className="w-4 h-4" />
      </ToolbarIconButton>

      {/* Play/Pause — primary button */}
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? "Pause" : "Play"}
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-[160ms]",
          "bg-primary-500 text-white",
          "shadow-level-1 hover:shadow-level-2 active:shadow-inset"
        )}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
      </motion.button>

      {/* Step Forward */}
      <ToolbarIconButton
        onClick={stepForward}
        label="Step forward"
        disabled={currentStep >= totalSteps - 1}
      >
        <SkipForward className="w-4 h-4" />
      </ToolbarIconButton>

      {/* Reset */}
      <ToolbarIconButton onClick={reset} label="Reset">
        <RotateCcw className="w-4 h-4" />
      </ToolbarIconButton>

      {/* Shuffle */}
      {onShuffle && (
        <ToolbarIconButton onClick={onShuffle} label="Randomize input">
          <Shuffle className="w-4 h-4" />
        </ToolbarIconButton>
      )}

      {/* Divider */}
      <div className="w-px h-6 bg-border-subtle mx-1" />

      {/* Speed control */}
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-text-tertiary shrink-0" />
        <div className="flex items-center gap-1">
          {speedOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn(
                "text-caption tabular-nums px-2 py-1 rounded-sm transition-all duration-[160ms]",
                speed === s
                  ? "bg-primary-500 text-white"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border-subtle mx-1" />

      {/* Step counter */}
      <div className="text-code text-text-tertiary tabular-nums whitespace-nowrap">
        Step{" "}
        <span className="text-text-primary font-medium">{Math.min(currentStep + 1, totalSteps)}</span>
        {" / "}
        <span>{totalSteps}</span>
      </div>
    </div>
  );
}

interface ToolbarIconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
  disabled?: boolean;
}

function ToolbarIconButton({ children, onClick, label, disabled }: ToolbarIconButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={disabled ? {} : { scale: 0.92 }}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-[160ms]",
        "bg-bg-elevated text-text-secondary",
        "shadow-level-1 hover:shadow-level-2 active:shadow-inset",
        disabled && "opacity-40 cursor-not-allowed shadow-none hover:shadow-none"
      )}
    >
      {children}
    </motion.button>
  );
}
