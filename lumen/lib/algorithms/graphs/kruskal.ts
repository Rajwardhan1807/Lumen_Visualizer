import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta, GraphInput } from "@/lib/types/algorithm";

export const kruskalMeta: AlgorithmMeta = {
  name: "Kruskal's Algorithm", slug: "kruskal", category: "graphs", difficulty: "intermediate",
  tags: ["graphs", "mst", "greedy", "union-find"],
  description: "Kruskal's algorithm finds a Minimum Spanning Tree (MST) for a connected weighted graph. It sorts all edges and greedily adds them to the tree unless they form a cycle.",
  complexity: { best: "O(E log E)", average: "O(E log E)", worst: "O(E log E)", space: "O(V + E)" },
  pseudocode: [
    "initialize MST = empty",
    "create Disjoint Set for all vertices",
    "sort edges by weight ascending",
    "for each edge (u, v) in sorted edges:",
    "  if find(u) != find(v):",
    "    add edge (u, v) to MST",
    "    union(u, v)",
  ],
  codeSnippets: {
    javascript: `function kruskal(nodes, edges) {
  let parent = {};
  for (let n of nodes) parent[n.id] = n.id;
  function find(i) {
    if (parent[i] === i) return i;
    return find(parent[i]);
  }
  function union(i, j) {
    let rootI = find(i);
    let rootJ = find(j);
    parent[rootI] = rootJ;
  }
  let sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  let mst = [];
  for (let e of sortedEdges) {
    if (find(e.from) !== find(e.to)) {
      mst.push(e);
      union(e.from, e.to);
    }
  }
  return mst;
}`,
    python: `def kruskal(nodes, edges):
    parent = {n.id: n.id for n in nodes}
    def find(i):
        if parent[i] == i: return i
        return find(parent[i])
    def union(i, j):
        parent[find(i)] = find(j)
    sorted_edges = sorted(edges, key=lambda e: e.weight)
    mst = []
    for e in sorted_edges:
        if find(e.from) != find(e.to):
            mst.append(e)
            union(e.from, e.to)
    return mst`,
    java: `List<Edge> kruskal(List<Node> nodes, List<Edge> edges) {
    Map<String, String> parent = new HashMap<>();
    for (Node n : nodes) parent.put(n.id, n.id);
    // find/union operations...
    List<Edge> sorted = new ArrayList<>(edges);
    sorted.sort(Comparator.comparingInt(e -> e.weight));
    List<Edge> mst = new ArrayList<>();
    for (Edge e : sorted) {
        if (!find(parent, e.from).equals(find(parent, e.to))) {
            mst.add(e);
            union(parent, e.from, e.to);
        }
    }
    return mst;
}`,
    cpp: `vector<Edge> kruskal(vector<Node>& nodes, vector<Edge>& edges) {
    map<string, string> parent;
    for (auto& n : nodes) parent[n.id] = n.id;
    // DSU implementation...
    sort(edges.begin(), edges.end(), [](Edge a, Edge b) { return a.weight < b.weight; });
    vector<Edge> mst;
    for (auto& e : edges) {
        if (find(parent, e.from) != find(parent, e.to)) {
            mst.push_back(e);
            union_set(parent, e.from, e.to);
        }
    }
    return mst;
}`,
  },
  defaultInput: {
    nodes: [
      { id: "A", label: "A" }, { id: "B", label: "B" },
      { id: "C", label: "C" }, { id: "D", label: "D" },
    ],
    edges: [
      { from: "A", to: "B", weight: 2 },
      { from: "A", to: "C", weight: 3 },
      { from: "B", to: "C", weight: 1 },
      { from: "B", to: "D", weight: 4 },
      { from: "C", to: "D", weight: 5 },
    ],
    directed: false,
  } as GraphInput,
};

export function generateSteps(graphInput: GraphInput): Step[] {
  const effectiveInput = (graphInput && graphInput.nodes) ? graphInput : (kruskalMeta.defaultInput as GraphInput);
  const { nodes, edges } = effectiveInput;
  const steps: Step[] = [];

  const parent: Record<string, string> = {};
  for (const n of nodes) parent[n.id] = n.id;

  function find(i: string): string {
    if (parent[i] === i) return i;
    return find(parent[i]);
  }

  function union(i: string, j: string) {
    const rootI = find(i);
    const rootJ = find(j);
    parent[rootI] = rootJ;
  }

  steps.push({
    type: "message",
    text: "Sorting edges by weight ascending",
    narration: "Sorting all edges in graph by weight",
    pseudocodeLine: 2,
  });

  const sortedEdges = [...edges].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));

  for (const e of sortedEdges) {
    const root1 = find(e.from);
    const root2 = find(e.to);

    steps.push({
      type: "visitEdge",
      from: e.from,
      to: e.to,
      state: "comparing",
      narration: `Inspecting sorted edge ${e.from} — ${e.to} (weight: ${e.weight})`,
      pseudocodeLine: 3,
    });

    if (root1 !== root2) {
      steps.push({
        type: "visitEdge",
        from: e.from,
        to: e.to,
        state: "sorted",
        narration: `Roots differ (${root1} != ${root2}). Adding edge ${e.from} — ${e.to} to MST.`,
        pseudocodeLine: 5,
      });
      union(e.from, e.to);
    } else {
      steps.push({
        type: "visitEdge",
        from: e.from,
        to: e.to,
        state: "eliminated",
        narration: `Edge ${e.from} — ${e.to} forms a cycle (already same root ${root1}). Skipping.`,
        pseudocodeLine: 4,
      });
    }
  }

  return steps;
}
