import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta, GraphInput } from "@/lib/types/algorithm";

export const primMeta: AlgorithmMeta = {
  name: "Prim's Algorithm", slug: "prim", category: "graphs", difficulty: "intermediate",
  tags: ["graphs", "mst", "greedy"],
  description: "Prim's algorithm finds a Minimum Spanning Tree (MST) for a weighted undirected graph by growing the tree one vertex at a time from a starting vertex.",
  complexity: { best: "O(E log V)", average: "O(E log V)", worst: "O(E log V)", space: "O(V)" },
  pseudocode: [
    "initialize MST = empty, visited = {startNode}",
    "while visited size < V:",
    "  find minimum weight edge (u, v) such that u is in visited, v is not",
    "  add v to visited",
    "  add edge (u, v) to MST",
  ],
  codeSnippets: {
    javascript: `function prims(nodes, edges, start) {
  let visited = new Set([start]);
  let mst = [];
  while (visited.size < nodes.length) {
    let minEdge = null;
    for (let e of edges) {
      let containsFrom = visited.has(e.from);
      let containsTo = visited.has(e.to);
      if (containsFrom !== containsTo) {
        if (!minEdge || e.weight < minEdge.weight) {
          minEdge = e;
        }
      }
    }
    if (minEdge) {
      mst.push(minEdge);
      visited.add(minEdge.from);
      visited.add(minEdge.to);
    }
  }
  return mst;
}`,
    python: `def prims(nodes, edges, start):
    visited = {start}
    mst = []
    while len(visited) < len(nodes):
        min_edge = None
        for u, v, w in edges:
            u_in = u in visited
            v_in = v in visited
            if u_in != v_in:
                if not min_edge or w < min_edge[2]:
                    min_edge = (u, v, w)
        if min_edge:
            mst.append(min_edge)
            visited.add(min_edge[0])
            visited.add(min_edge[1])
    return mst`,
    java: `List<Edge> prims(List<Node> nodes, List<Edge> edges, String start) {
    Set<String> visited = new HashSet<>();
    visited.add(start);
    List<Edge> mst = new ArrayList<>();
    while (visited.size() < nodes.size()) {
        Edge minEdge = null;
        for (Edge e : edges) {
            boolean fromVis = visited.contains(e.from);
            boolean toVis = visited.contains(e.to);
            if (fromVis ^ toVis) {
                if (minEdge == null || e.weight < minEdge.weight) {
                    minEdge = e;
                }
            }
        }
        if (minEdge != null) {
            mst.add(minEdge);
            visited.add(minEdge.from);
            visited.add(minEdge.to);
        }
    }
    return mst;
}`,
    cpp: `vector<Edge> prims(vector<Node>& nodes, vector<Edge>& edges, string start) {
    set<string> visited = {start};
    vector<Edge> mst;
    while (visited.size() < nodes.size()) {
        Edge minEdge;
        bool found = false;
        for (auto& e : edges) {
            bool fromVis = visited.count(e.from);
            bool toVis = visited.count(e.to);
            if (fromVis != toVis) {
                if (!found || e.weight < minEdge.weight) {
                    minEdge = e;
                    found = true;
                }
            }
        }
        if (found) {
            mst.push_back(minEdge);
            visited.insert(minEdge.from);
            visited.insert(minEdge.to);
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
    startNode: "A",
  } as GraphInput,
};

export function generateSteps(graphInput: GraphInput): Step[] {
  const effectiveInput = (graphInput && graphInput.nodes) ? graphInput : (primMeta.defaultInput as GraphInput);
  const { nodes, edges, startNode = nodes[0].id } = effectiveInput;
  const steps: Step[] = [];

  const visited = new Set<string>([startNode]);
  steps.push({
    type: "visitNode",
    nodeId: startNode,
    state: "sorted",
    narration: `Starting Prim's MST from node ${startNode}`,
    pseudocodeLine: 0,
  });

  const V = nodes.length;
  while (visited.size < V) {
    let minEdge: (typeof edges)[0] | null = null;
    for (const e of edges) {
      const containsFrom = visited.has(e.from);
      const containsTo = visited.has(e.to);
      if (containsFrom !== containsTo) {
        steps.push({
          type: "visitEdge",
          from: e.from,
          to: e.to,
          state: "comparing",
          narration: `Checking frontier edge ${e.from} — ${e.to} (weight: ${e.weight})`,
          pseudocodeLine: 2,
        });
        if (!minEdge || (e.weight ?? 0) < (minEdge.weight ?? 0)) {
          minEdge = e;
        }
      }
    }

    if (minEdge) {
      const nextNode = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
      visited.add(nextNode);
      steps.push({
        type: "visitNode",
        nodeId: nextNode,
        state: "sorted",
        narration: `Added node ${nextNode} to visited set`,
        pseudocodeLine: 3,
      });
      steps.push({
        type: "visitEdge",
        from: minEdge.from,
        to: minEdge.to,
        state: "sorted",
        narration: `Edge ${minEdge.from} — ${minEdge.to} added to MST`,
        pseudocodeLine: 4,
      });
    } else {
      break;
    }
  }

  return steps;
}
