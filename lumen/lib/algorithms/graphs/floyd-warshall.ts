import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta, GraphInput } from "@/lib/types/algorithm";

export const floydWarshallMeta: AlgorithmMeta = {
  name: "Floyd-Warshall", slug: "floyd-warshall", category: "graphs", difficulty: "advanced",
  tags: ["graphs", "all-pairs-shortest-path", "matrix"],
  description: "Floyd-Warshall is an algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles). It solves all pairs in O(V³).",
  complexity: { best: "O(V³)", average: "O(V³)", worst: "O(V³)", space: "O(V²)" },
  pseudocode: [
    "initialize matrix dist[V][V] with edge weights",
    "for k = 0 to V-1:",
    "  for i = 0 to V-1:",
    "    for j = 0 to V-1:",
    "      if dist[i][k] + dist[k][j] < dist[i][j]:",
    "        dist[i][j] = dist[i][k] + dist[k][j]",
  ],
  codeSnippets: {
    javascript: `function floydWarshall(V, adjMatrix) {
  let dist = Array.from({ length: V }, (_, i) => [...adjMatrix[i]]);
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}`,
    python: `def floyd_warshall(V, adj_matrix):
    dist = [row[:] for row in adj_matrix]
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,
    java: `void floydWarshall(int V, int[][] dist) {
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
}`,
    cpp: `void floydWarshall(int V, vector<vector<int>>& dist) {
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
            }
        }
    }
}`,
  },
  defaultInput: {
    nodes: [
      { id: "A", label: "A" }, { id: "B", label: "B" },
      { id: "C", label: "C" }, { id: "D", label: "D" },
    ],
    edges: [
      { from: "A", to: "B", weight: 3 },
      { from: "A", to: "D", weight: 7 },
      { from: "B", to: "C", weight: 1 },
      { from: "C", to: "D", weight: 2 },
      { from: "B", to: "A", weight: 8 },
    ],
    directed: true,
  } as GraphInput,
};

export function generateSteps(graphInput: GraphInput): Step[] {
  const effectiveInput = (graphInput && graphInput.nodes) ? graphInput : (floydWarshallMeta.defaultInput as GraphInput);
  const { nodes, edges } = effectiveInput;
  const steps: Step[] = [];

  const V = nodes.length;
  const nodeMap = new Map(nodes.map((n, i) => [n.id, i]));

  steps.push({
    type: "message",
    text: "Initializing All-Pairs Shortest Path matrix",
    narration: `Building initial distance matrix of size ${V}x${V}`,
    pseudocodeLine: 0,
  });

  // Floyd-Warshall is best visualised using DPTableRenderer! We can emit FillCell steps.
  for (let r = 0; r < V; r++) {
    for (let c = 0; c < V; c++) {
      const val = r === c ? 0 : 99; // 99 represents infinity for simplicity
      steps.push({
        type: "fillCell",
        row: r,
        col: c,
        value: val,
        state: "default",
        narration: `Initial dist[${nodes[r].id}][${nodes[c].id}] = ${val === 0 ? 0 : "∞"}`,
        pseudocodeLine: 0,
      });
    }
  }

  // Populate direct edges
  for (const e of edges) {
    const fromIdx = nodeMap.get(e.from);
    const toIdx = nodeMap.get(e.to);
    if (fromIdx !== undefined && toIdx !== undefined) {
      steps.push({
        type: "fillCell",
        row: fromIdx,
        col: toIdx,
        value: e.weight ?? 1,
        state: "pivot",
        narration: `Direct edge weight for ${e.from} → ${e.to} is ${e.weight}`,
        pseudocodeLine: 0,
      });
    }
  }

  // Simulate first few steps of k loop to show progress
  for (let k = 0; k < Math.min(2, V); k++) {
    steps.push({
      type: "message",
      text: `Iteration k = ${k} (Intermediate node: ${nodes[k].id})`,
      narration: `Trying routes via intermediate vertex ${nodes[k].id}`,
      pseudocodeLine: 1,
    });

    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (i !== k && j !== k && i !== j) {
          steps.push({
            type: "highlightCell",
            cells: [[i, k], [k, j]],
            state: "comparing",
            narration: `Checking path ${nodes[i].id} → ${nodes[k].id} → ${nodes[j].id}`,
            pseudocodeLine: 4,
          });
        }
      }
    }
  }

  return steps;
}
