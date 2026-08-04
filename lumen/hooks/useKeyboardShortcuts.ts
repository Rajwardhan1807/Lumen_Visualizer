"use client";

import { useEffect } from "react";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import { useAlgorithmStore } from "@/lib/store/algorithmStore";

export function useKeyboardShortcuts() {
  const { toggle, stepForward, stepBack, reset } = usePlaybackStore();
  const { toggleSidebar, toggleRightPanel, toggleCodeEditor } = useAlgorithmStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't fire shortcuts when typing in inputs, textareas, contenteditable
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest(".monaco-editor")
      ) {
        return;
      }

      const isMeta = e.metaKey || e.ctrlKey;

      switch (true) {
        // Space — play/pause
        case e.code === "Space" && !isMeta:
          e.preventDefault();
          toggle();
          break;

        // ← step back
        case e.code === "ArrowLeft" && !isMeta:
          e.preventDefault();
          stepBack();
          break;

        // → step forward
        case e.code === "ArrowRight" && !isMeta:
          e.preventDefault();
          stepForward();
          break;

        // R — reset
        case e.code === "KeyR" && !isMeta:
          e.preventDefault();
          reset();
          break;

        // ⌘B — toggle sidebar
        case e.code === "KeyB" && isMeta:
          e.preventDefault();
          toggleSidebar();
          break;

        // ⌘/ — toggle right panel
        case e.code === "Slash" && isMeta:
          e.preventDefault();
          toggleRightPanel();
          break;

        // ⌘J — toggle code editor
        case e.code === "KeyJ" && isMeta:
          e.preventDefault();
          toggleCodeEditor();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, stepForward, stepBack, reset, toggleSidebar, toggleRightPanel, toggleCodeEditor]);
}
