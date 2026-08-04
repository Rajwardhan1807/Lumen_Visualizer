"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { usePlaybackStore } from "@/lib/store/playbackStore";
import { useAlgorithmStore } from "@/lib/store/algorithmStore";
import { algorithmRegistry } from "@/lib/algorithms/registry";
import { Toolbar } from "./Toolbar";
import { Scrubber } from "./Scrubber";
import { ArrayRenderer } from "./renderers/ArrayRenderer";
import { GraphRenderer } from "./renderers/GraphRenderer";
import { RecursionTreeRenderer, DPTableRenderer } from "./renderers/RecursionAndDPRenderers";
import { LinkedListRenderer } from "./renderers/LinkedListRenderer";
import { StackQueueRenderer } from "./renderers/StackQueueRenderer";
import { GreedyRenderer } from "./renderers/GreedyRenderer";
import type { GraphInput } from "@/lib/types/algorithm";
import type { Step } from "@/lib/types/step";

function generateRandomArray(size: number, min = 5, max = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function AlgorithmCanvas() {
  const { selectedSlug, inputSize, setInput, input } = useAlgorithmStore();
  const { setSteps, steps } = usePlaybackStore();

  const entry = algorithmRegistry[selectedSlug];
  const category = entry?.meta.category;

  const handleShuffle = useCallback(() => {
    const newInput = generateRandomArray(inputSize);
    setInput(newInput);
    if (entry) {
      const newSteps = entry.generateSteps(newInput);
      setSteps(newSteps);
    }
  }, [entry, inputSize, setInput, setSteps]);

  return (
    <div className="flex flex-col h-full">
      <Toolbar onShuffle={handleShuffle} />

      {/* Canvas Well */}
      <div
        className="flex-1 rounded-xl overflow-hidden relative"
        style={{
          boxShadow: "var(--shadow-inset)",
          backgroundColor: "var(--bg-sunken)",
          minHeight: 280,
        }}
      >
        <CanvasContent
          category={category}
          entry={entry}
          steps={steps}
          input={input}
          slug={selectedSlug}
        />
      </div>

      <Scrubber steps={steps} />
    </div>
  );
}

// Separated to avoid hooks-in-conditional issues
interface CanvasContentProps {
  category: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entry: any;
  steps: Step[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: any;
  slug: string;
}

function CanvasContent({ category, entry, steps, input, slug }: CanvasContentProps) {
  if (!entry || steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-text-tertiary">
        <div className="w-16 h-16 rounded-full bg-bg-elevated shadow-level-1 flex items-center justify-center text-3xl">
          🎯
        </div>
        <p className="text-body-lg">Select an algorithm and press Play to start</p>
        <p className="text-body text-text-tertiary">Use the sidebar to browse algorithms</p>
      </div>
    );
  }

  if (category === "sorting" || category === "searching") {
    const defaultArray = entry.meta.defaultInput as number[];
    const arrayInput = Array.isArray(input) ? input : defaultArray;
    return (
      <ArrayRenderer
        initialArray={arrayInput}
        steps={steps}
      />
    );
  }

  if (category === "linked-lists") {
    const defaultArray = entry.meta.defaultInput as number[];
    const arrayInput = Array.isArray(input) ? input : defaultArray;
    return (
      <LinkedListRenderer
        initialArray={arrayInput}
        steps={steps}
      />
    );
  }

  if (category === "stacks") {
    const defaultArray = entry.meta.defaultInput as number[];
    const arrayInput = Array.isArray(input) ? input : defaultArray;
    return (
      <StackQueueRenderer
        initialArray={arrayInput}
        steps={steps}
        mode="stack"
      />
    );
  }

  if (category === "queues") {
    const defaultArray = entry.meta.defaultInput as number[];
    const arrayInput = Array.isArray(input) ? input : defaultArray;
    return (
      <StackQueueRenderer
        initialArray={arrayInput}
        steps={steps}
        mode="queue"
      />
    );
  }

  if (category === "graphs") {
    const graphInput = entry.meta.defaultInput as GraphInput;
    return (
      <GraphRenderer
        nodes={graphInput.nodes}
        edges={graphInput.edges}
        steps={steps}
      />
    );
  }

  if (category === "recursion") {
    // If it's merge-sort or quick-sort recursion, we can render with ArrayRenderer or RecursionTreeRenderer
    if (slug.includes("sort")) {
      const defaultArray = entry.meta.defaultInput as number[];
      const arrayInput = Array.isArray(input) ? input : defaultArray;
      return <ArrayRenderer initialArray={arrayInput} steps={steps} />;
    }
    return <RecursionTreeRenderer steps={steps} />;
  }

  if (category === "dynamic-programming") {
    if (slug === "fib-memo" || slug === "lis") {
      const n = typeof input === "number" ? input : 7;
      const numCols = slug === "lis" ? (Array.isArray(entry.meta.defaultInput) ? entry.meta.defaultInput.length : 8) : n + 1;
      return (
        <DPTableRenderer
          rows={1}
          cols={numCols}
          steps={steps}
          colLabels={Array.from({ length: numCols }, (_, i) => String(i))}
        />
      );
    }

    // 2D DP algorithms: lcs, knapsack, coin-change, edit-distance, matrix-chain
    let rows = 5, cols = 5;
    if (slug === "lcs" || slug === "edit-distance") {
      const s1 = (input?.s1 ?? entry.meta.defaultInput.s1) as string;
      const s2 = (input?.s2 ?? entry.meta.defaultInput.s2) as string;
      rows = s1.length + 1;
      cols = s2.length + 1;
    } else if (slug === "knapsack") {
      const items = (input?.items ?? entry.meta.defaultInput.items) as Array<{ weight: number; value: number }>;
      const cap = (input?.capacity ?? entry.meta.defaultInput.capacity) as number;
      rows = items.length + 1;
      cols = cap + 1;
    } else if (slug === "coin-change") {
      rows = 1;
      cols = ((input?.amount ?? entry.meta.defaultInput.amount) as number) + 1;
    } else if (slug === "matrix-chain") {
      const p = Array.isArray(input) ? input : entry.meta.defaultInput as number[];
      rows = p.length;
      cols = p.length;
    }

    return (
      <DPTableRenderer
        rows={rows}
        cols={cols}
        steps={steps}
      />
    );
  }

  if (category === "greedy") {
    // huffman uses tree, others use list picker
    if (slug === "huffman") {
      return <RecursionTreeRenderer steps={steps} />;
    }
    return (
      <GreedyRenderer
        defaultInput={entry.meta.defaultInput}
        steps={steps}
        slug={slug}
      />
    );
  }

  if (category === "backtracking") {
    if (slug === "n-queens") {
      return <NQueensRenderer n={4} steps={steps} />;
    }
    if (slug === "sudoku") {
      return <SudokuBoardRenderer steps={steps} />;
    }
    if (slug === "rat-in-maze") {
      return <MazeRenderer steps={steps} />;
    }
    if (slug === "word-search") {
      return <WordSearchRenderer steps={steps} />;
    }
    if (slug === "permutations") {
      const defaultArray = entry.meta.defaultInput as number[];
      const arrayInput = Array.isArray(input) ? input : defaultArray;
      return <ArrayRenderer initialArray={arrayInput} steps={steps} />;
    }
  }

  return (
    <div className="flex items-center justify-center h-full text-text-tertiary text-body">
      Visualization coming soon for {category}
    </div>
  );
}

// ── N-Queens Board Renderer ──────────────────────────────────────────
function NQueensRenderer({ n, steps }: { n: number; steps: Step[] }) {
  const { currentStep } = usePlaybackStore();

  const board = useMemo(() => {
    const b: Array<Array<"empty" | "queen" | "conflict">> = Array.from({ length: n }, () =>
      new Array(n).fill("empty")
    );

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];
      if (step.type === "placeQueen") {
        b[step.row][step.col] = "queen";
      } else if (step.type === "removeQueen") {
        b[step.row][step.col] = "empty";
      }
    }
    return b;
  }, [currentStep, steps, n]);

  const cellSize = Math.min(80, 320 / n);

  return (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div
        className="inline-grid rounded-lg overflow-hidden border border-border-subtle"
        style={{ gridTemplateColumns: `repeat(${n}, ${cellSize}px)` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isDark = (r + c) % 2 === 0;
            return (
              <div
                key={`${r}-${c}`}
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: isDark
                    ? "color-mix(in srgb, var(--primary-500) 12%, var(--bg-sunken))"
                    : "var(--bg-elevated)",
                  fontSize: cellSize * 0.55,
                }}
              >
                {cell === "queen" && "♛"}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Sudoku Board Renderer ────────────────────────────────────────────
function SudokuBoardRenderer({ steps }: { steps: Step[] }) {
  const { currentStep } = usePlaybackStore();
  const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  const [board, setBoard] = useState<number[][]>(initialBoard);
  const [highlightCell, setHighlightCell] = useState<[number, number] | null>(null);

  useEffect(() => {
    const b = initialBoard.map((r) => [...r]);
    let active: [number, number] | null = null;

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];
      if (step.type === "boardFill") {
        b[step.row][step.col] = Number(step.value);
        active = [step.row, step.col];
      } else if (step.type === "boardMark") {
        active = [step.row, step.col];
      }
    }
    setBoard(b);
    setHighlightCell(active);
  }, [currentStep, steps]);

  const size = 30;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="grid grid-cols-9 border-2 border-text-primary rounded-lg overflow-hidden">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isSubGridDark = (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 0;
            const isHighlighted = highlightCell && highlightCell[0] === r && highlightCell[1] === c;

            return (
              <div
                key={`${r}-${c}`}
                className="flex items-center justify-center border border-border-subtle/40 font-mono text-caption font-bold transition-all duration-300"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: isHighlighted
                    ? "var(--primary-500)"
                    : isSubGridDark
                    ? "var(--bg-sunken)"
                    : "var(--bg-elevated)",
                  color: isHighlighted ? "#fff" : "var(--text-primary)",
                }}
              >
                {cell === 0 ? " " : cell}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Maze Renderer ────────────────────────────────────────────────────
function MazeRenderer({ steps }: { steps: Step[] }) {
  const { currentStep } = usePlaybackStore();
  const initialMaze = [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ];

  const [grid, setGrid] = useState<string[][]>(initialMaze.map((row) => row.map((c) => (c === 0 ? "🧱" : " "))));

  useEffect(() => {
    const g: string[][] = initialMaze.map((row) => row.map((c) => (c === 0 ? "🧱" : " ")));

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];
      if (step.type === "boardFill") {
        g[step.row][step.col] = String(step.value);
      }
    }
    setGrid(g);
  }, [currentStep, steps]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="grid grid-cols-4 border border-border-subtle rounded-lg overflow-hidden">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className="w-12 h-12 flex items-center justify-center font-mono text-body-lg bg-bg-elevated border border-border-subtle/30"
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Word Search Renderer ─────────────────────────────────────────────
function WordSearchRenderer({ steps }: { steps: Step[] }) {
  const { currentStep } = usePlaybackStore();
  const letters = [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"]
  ];

  const [highlighted, setHighlighted] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const h = new Map<string, string>();
    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i];
      if (step.type === "boardMark") {
        h.set(`${step.row}-${step.col}`, step.state);
      } else if (step.type === "boardFill") {
        h.delete(`${step.row}-${step.col}`);
      }
    }
    setHighlighted(h);
  }, [currentStep, steps]);

  const STATE_COLORS: Record<string, string> = {
    comparing: "var(--warning-500)",
    sorted: "var(--success-500)",
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="grid grid-cols-4 border border-border-subtle rounded-lg overflow-hidden">
        {letters.map((row, r) =>
          row.map((letter, c) => {
            const state = highlighted.get(`${r}-${c}`);
            const isHighlighted = !!state;

            return (
              <div
                key={`${r}-${c}`}
                className="w-12 h-12 flex items-center justify-center font-mono text-body font-bold border border-border-subtle/30 transition-all duration-300"
                style={{
                  backgroundColor: isHighlighted ? STATE_COLORS[state] : "var(--bg-elevated)",
                  color: isHighlighted ? "#fff" : "var(--text-primary)",
                }}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
