import type { Step } from "./step";

export type AlgorithmCategory =
  | "sorting"
  | "searching"
  | "graphs"
  | "trees"
  | "linked-lists"
  | "stacks"
  | "queues"
  | "recursion"
  | "dynamic-programming"
  | "greedy"
  | "backtracking";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Language = "javascript" | "python" | "java" | "cpp";

export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface AlgorithmMeta {
  name: string;
  slug: string;
  category: AlgorithmCategory;
  difficulty: Difficulty;
  description: string;
  complexity: ComplexityInfo;
  pseudocode: string[];
  codeSnippets: Record<Language, string>;
  defaultInput?: unknown;
  tags?: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface GraphInput {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed?: boolean;
  startNode?: string;
}

export interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  parent?: string | null;
}

export interface LinkedListNode {
  id: string;
  value: number;
  next: string | null;
}

export type AlgorithmInput =
  | number[]          // sorting, searching, stack, queue
  | GraphInput        // graphs
  | TreeNode          // trees
  | LinkedListNode[]  // linked lists
  | number            // recursion (factorial / fib input)
  | { items: Array<{ weight: number; value: number }>; capacity: number } // knapsack
  | { s1: string; s2: string } // LCS
  | { coins: number[]; amount: number } // coin change
  | { activities: Array<{ start: number; finish: number; name: string }> } // activity selection
  | { n: number } // n-queens
  | { numbers: number[]; target: number }; // subset sum

// Registry entry with generator function
export interface AlgorithmEntry {
  meta: AlgorithmMeta;
  generateSteps: (input: AlgorithmInput) => Step[];
}
