import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta, GraphInput } from "@/lib/types/algorithm";

export const unionFindMeta: AlgorithmMeta = {
  name: "Union Find (DSU)", slug: "union-find", category: "graphs", difficulty: "intermediate",
  tags: ["graphs", "disjoint-set", "union-find"],
  description: "Union Find (Disjoint Set Union) keeps track of elements split into non-overlapping sets. It supports Union and Find operations in near-constant time.",
  complexity: { best: "O(1)", average: "O(α(n))", worst: "O(α(n))", space: "O(n)" },
  pseudocode: [
    "find(i):",
    "  if parent[i] == i: return i",
    "  return parent[i] = find(parent[i])  // path compression",
    "union(i, j):",
    "  rootI = find(i); rootJ = find(j)",
    "  if rootI != rootJ: parent[rootI] = rootJ",
  ],
  codeSnippets: {
    javascript: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }
  find(i) {
    if (this.parent[i] === i) return i;
    return this.parent[i] = this.find(this.parent[i]);
  }
  union(i, j) {
    let rootI = this.find(i);
    let rootJ = this.find(j);
    if (rootI !== rootJ) this.parent[rootI] = rootJ;
  }
}`,
    python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
    def find(self, i):
        if self.parent[i] == i: return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            self.parent[root_i] = root_j`,
    java: `class UnionFind {
    int[] parent;
    UnionFind(int n) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    void union(int i, int j) {
        int rI = find(i);
        int rJ = find(j);
        if (rI != rJ) parent[rI] = rJ;
    }
}`,
    cpp: `class UnionFind {
    vector<int> parent;
public:
    UnionFind(int n) {
        parent.resize(n);
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    void unionSets(int i, int j) {
        int rI = find(i);
        int rJ = find(j);
        if (rI != rJ) parent[rI] = rJ;
    }
};`,
  },
  defaultInput: {
    nodes: [
      { id: "0", label: "0" }, { id: "1", label: "1" },
      { id: "2", label: "2" }, { id: "3", label: "3" },
    ],
    edges: [
      { from: "0", to: "1" },
      { from: "2", to: "3" },
      { from: "1", to: "2" },
    ],
    directed: false,
  } as GraphInput,
};

export function generateSteps(graphInput: GraphInput): Step[] {
  const effectiveInput = (graphInput && graphInput.nodes) ? graphInput : (unionFindMeta.defaultInput as GraphInput);
  const { nodes, edges } = effectiveInput;
  const steps: Step[] = [];

  const parent: Record<string, string> = {};
  for (const n of nodes) parent[n.id] = n.id;

  steps.push({
    type: "message",
    text: "Disjoint Set initialized. Every element is its own parent.",
    narration: "Initializing Union-Find sets",
    pseudocodeLine: 0,
  });

  for (const e of edges) {
    steps.push({
      type: "visitEdge",
      from: e.from,
      to: e.to,
      state: "comparing",
      narration: `Union request for: union(${e.from}, ${e.to})`,
      pseudocodeLine: 4,
    });

    // Trace find(e.from)
    steps.push({
      type: "visitNode",
      nodeId: e.from,
      state: "comparing",
      narration: `Find operation on ${e.from}`,
      pseudocodeLine: 1,
    });

    const root1 = parent[e.from];
    
    // Trace find(e.to)
    steps.push({
      type: "visitNode",
      nodeId: e.to,
      state: "comparing",
      narration: `Find operation on ${e.to}`,
      pseudocodeLine: 1,
    });

    const root2 = parent[e.to];

    if (root1 !== root2) {
      steps.push({
        type: "visitNode",
        nodeId: root1,
        state: "sorted",
        narration: `Roots differ. Splicing root of ${e.from} (${root1}) to root of ${e.to} (${root2})`,
        pseudocodeLine: 5,
      });
      parent[root1] = root2;
      steps.push({
        type: "visitEdge",
        from: e.from,
        to: e.to,
        state: "sorted",
        narration: `Set union successful: parent[${root1}] = ${root2}`,
        pseudocodeLine: 5,
      });
    } else {
      steps.push({
        type: "message",
        text: `Already in same set: root is ${root1}`,
        narration: `Elements are already connected in same tree partition`,
        pseudocodeLine: 5,
      });
    }
  }

  return steps;
}
