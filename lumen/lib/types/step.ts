// ─────────────────────────────────────────────────────────────────────────────
// LUMEN Animation Engine — Unified Step/Event Types
// Every algorithm emits Steps; renderers consume them deterministically.
// ─────────────────────────────────────────────────────────────────────────────

export type ElementState =
  | "default"
  | "comparing"
  | "swapping"
  | "sorted"
  | "pivot"
  | "queued"
  | "current"
  | "eliminated"
  | "visited"
  | "path"
  | "selected"
  | "highlighted"
  | "error"
  | "success";

// Base mixin present on every step
export interface BaseStep {
  /** Human-readable description shown in the Explanation panel */
  narration?: string;
  /** 0-based index into pseudocode lines array */
  pseudocodeLine: number;
  /** Per-language 0-based line numbers for the code editor */
  codeLine?: Partial<Record<"javascript" | "python" | "java" | "cpp", number>>;
  /** Optional running counters to show in the stats panel */
  stats?: {
    comparisons?: number;
    swaps?: number;
    accesses?: number;
  };
}

// ── Array / Sorting / Searching ──────────────────────────────────────────────

export interface CompareStep extends BaseStep {
  type: "compare";
  indices: number[];
}

export interface SwapStep extends BaseStep {
  type: "swap";
  indices: [number, number];
}

export interface SetStep extends BaseStep {
  type: "set";
  index: number;
  value: number;
}

export interface MarkStep extends BaseStep {
  type: "mark";
  index: number;
  state: ElementState;
}

export interface MarkRangeStep extends BaseStep {
  type: "markRange";
  start: number;
  end: number;
  state: ElementState;
}

export interface MoveStep extends BaseStep {
  type: "move";
  fromIndex: number;
  toIndex: number;
}

// ── Graph ────────────────────────────────────────────────────────────────────

export interface VisitNodeStep extends BaseStep {
  type: "visitNode";
  nodeId: string;
  state: ElementState;
}

export interface VisitEdgeStep extends BaseStep {
  type: "visitEdge";
  from: string;
  to: string;
  state: ElementState;
}

export interface SetDistanceStep extends BaseStep {
  type: "setDistance";
  nodeId: string;
  distance: number;
  via?: string;
}

export interface UnvisitNodeStep extends BaseStep {
  type: "unvisitNode";
  nodeId: string;
}

// ── Tree ─────────────────────────────────────────────────────────────────────

export interface TreeInsertStep extends BaseStep {
  type: "treeInsert";
  nodeId: string;
  parentId: string | null;
  value: number;
  isLeft?: boolean;
}

export interface TreeMarkStep extends BaseStep {
  type: "treeMark";
  nodeId: string;
  state: ElementState;
}

export interface TreeDeleteStep extends BaseStep {
  type: "treeDelete";
  nodeId: string;
}

export interface TreeRotateStep extends BaseStep {
  type: "treeRotate";
  pivotId: string;
  direction: "left" | "right";
}

// ── Linked List ──────────────────────────────────────────────────────────────

export interface LinkedListInsertStep extends BaseStep {
  type: "llInsert";
  index: number;
  value: number;
  nodeId: string;
  afterId: string | null;
}

export interface LinkedListDeleteStep extends BaseStep {
  type: "llDelete";
  nodeId: string;
}

export interface LinkedListMarkStep extends BaseStep {
  type: "llMark";
  nodeId: string;
  state: ElementState;
}

export interface LinkedListSetPointerStep extends BaseStep {
  type: "llSetPointer";
  name: string; // e.g. "prev", "curr", "next"
  nodeId: string | null;
}

// ── Stack / Queue ────────────────────────────────────────────────────────────

export interface PushStep extends BaseStep {
  type: "push";
  value: number | string;
}

export interface PopStep extends BaseStep {
  type: "pop";
  value?: number | string;
}

export interface PeekStep extends BaseStep {
  type: "peek";
  value: number | string;
}

export interface EnqueueStep extends BaseStep {
  type: "enqueue";
  value: number | string;
}

export interface DequeueStep extends BaseStep {
  type: "dequeue";
  value?: number | string;
}

export interface HighlightTopStep extends BaseStep {
  type: "highlightTop";
  index: number;
}

// ── Recursion / Call Stack ───────────────────────────────────────────────────

export interface CallStep extends BaseStep {
  type: "call";
  fn: string;
  args: Record<string, unknown>;
  callId: string;
  parentCallId: string | null;
  depth: number;
  returnType?: string;
}

export interface ReturnStep extends BaseStep {
  type: "return";
  callId: string;
  value: unknown;
}

// ── DP Table ─────────────────────────────────────────────────────────────────

export interface FillCellStep extends BaseStep {
  type: "fillCell";
  row: number;
  col: number;
  value: number | string;
  state: ElementState;
}

export interface HighlightCellStep extends BaseStep {
  type: "highlightCell";
  cells: Array<[number, number]>;
  state: ElementState;
}

// ── Backtracking / Board ─────────────────────────────────────────────────────

export interface PlaceQueenStep extends BaseStep {
  type: "placeQueen";
  row: number;
  col: number;
}

export interface RemoveQueenStep extends BaseStep {
  type: "removeQueen";
  row: number;
  col: number;
}

export interface BoardMarkStep extends BaseStep {
  type: "boardMark";
  row: number;
  col: number;
  state: ElementState;
}

export interface BoardFillStep extends BaseStep {
  type: "boardFill";
  row: number;
  col: number;
  value: number | string;
}

export interface PruneStep extends BaseStep {
  type: "prune";
  nodeId: string;
}

// ── Greedy ───────────────────────────────────────────────────────────────────

export interface GreedyPickStep extends BaseStep {
  type: "greedyPick";
  itemIndex: number;
  runningTotal: number;
  picked: boolean;
  reason?: string;
}

// ── Generic ──────────────────────────────────────────────────────────────────

export interface MessageStep extends BaseStep {
  type: "message";
  text: string;
  level?: "info" | "success" | "warning" | "error";
}

export interface UpdateVarStep extends BaseStep {
  type: "updateVar";
  name: string;
  value: unknown;
}

// ── Discriminated Union ───────────────────────────────────────────────────────

export type Step =
  | CompareStep | SwapStep | SetStep | MarkStep | MarkRangeStep | MoveStep
  | VisitNodeStep | VisitEdgeStep | SetDistanceStep | UnvisitNodeStep
  | TreeInsertStep | TreeMarkStep | TreeDeleteStep | TreeRotateStep
  | LinkedListInsertStep | LinkedListDeleteStep | LinkedListMarkStep | LinkedListSetPointerStep
  | PushStep | PopStep | PeekStep | EnqueueStep | DequeueStep | HighlightTopStep
  | CallStep | ReturnStep
  | FillCellStep | HighlightCellStep
  | PlaceQueenStep | RemoveQueenStep | BoardMarkStep | BoardFillStep | PruneStep
  | GreedyPickStep
  | MessageStep | UpdateVarStep;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Create a step builder with running comparison/swap counters */
export function createStepBuilder() {
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  const stats = () => ({ comparisons, swaps, accesses });

  const compare = (indices: number[], narration: string, pseudocodeLine = 0): CompareStep => {
    comparisons++;
    accesses += indices.length;
    return { type: "compare", indices, narration, pseudocodeLine, stats: stats() };
  };

  const swap = (indices: [number, number], narration: string, pseudocodeLine = 0): SwapStep => {
    swaps++;
    accesses += 2;
    return { type: "swap", indices, narration, pseudocodeLine, stats: stats() };
  };

  const mark = (index: number, state: ElementState, narration: string, pseudocodeLine = 0): MarkStep =>
    ({ type: "mark", index, state, narration, pseudocodeLine, stats: stats() });

  const markRange = (start: number, end: number, state: ElementState, narration: string, pseudocodeLine = 0): MarkRangeStep =>
    ({ type: "markRange", start, end, state, narration, pseudocodeLine, stats: stats() });

  const set = (index: number, value: number, narration: string, pseudocodeLine = 0): SetStep => {
    accesses++;
    return { type: "set", index, value, narration, pseudocodeLine, stats: stats() };
  };

  const msg = (
    text: string,
    narration = text,
    levelOrLine: "info" | "success" | "warning" | "error" | number = "info",
    pseudocodeLine = 0
  ): MessageStep => {
    let finalLevel: "info" | "success" | "warning" | "error" = "info";
    let finalLine = pseudocodeLine;
    if (typeof levelOrLine === "number") {
      finalLine = levelOrLine;
    } else if (levelOrLine) {
      finalLevel = levelOrLine;
    }
    return { type: "message", text, narration, pseudocodeLine: finalLine, level: finalLevel };
  };

  return { compare, swap, mark, markRange, set, msg, stats };
}
