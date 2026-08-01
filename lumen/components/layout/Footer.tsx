"use client";

import { GitBranch, HelpCircle } from "lucide-react";
import { useAlgorithmStore } from "@/lib/store/algorithmStore";
import { algorithmRegistry } from "@/lib/algorithms/registry";
import { cn } from "@/lib/utils/cn";

export function Footer() {
  const { selectedSlug, selectedCategory } = useAlgorithmStore();
  const entry = algorithmRegistry[selectedSlug];

  return (
    <footer
      className="h-9 flex items-center justify-between px-6 border-t border-border-subtle"
      style={{ backgroundColor: "var(--bg-sunken)" }}
    >
      {/* Left — current algorithm */}
      <div className="flex items-center gap-2 text-caption text-text-tertiary">
        {entry && (
          <>
            <span className="text-text-secondary font-medium">{entry.meta.name}</span>
            <span>·</span>
            <span className="capitalize">{selectedCategory.replace(/-/g, " ")}</span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-xs text-label capitalize",
                entry.meta.difficulty === "beginner"
                  ? "text-success-500 bg-success-500/10"
                  : entry.meta.difficulty === "intermediate"
                  ? "text-warning-500 bg-warning-500/10"
                  : "text-danger-500 bg-danger-500/10"
              )}
            >
              {entry.meta.difficulty}
            </span>
          </>
        )}
      </div>

      {/* Right — links */}
      <div className="flex items-center gap-3 text-caption text-text-tertiary">
        <span>v1.0.0</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          className="hover:text-text-secondary transition-colors"
        >
          <GitBranch className="w-3.5 h-3.5" />
        </a>
        <button
          aria-label="Keyboard shortcuts (press ?)"
          className="flex items-center gap-1 hover:text-text-secondary transition-colors"
          title="Press ? for shortcuts"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Press <kbd className="font-mono">?</kbd></span>
        </button>
      </div>
    </footer>
  );
}
