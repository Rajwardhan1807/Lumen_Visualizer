import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta, GraphInput } from "@/lib/types/algorithm";

export const bellmanFordMeta: AlgorithmMeta = {
  name: "Bellman-Ford", slug: "bellman-ford", category: "graphs", difficulty: "intermediate",
  tags: ["graphs", "shortest-path", "negative-weights"],
  description: "Bellman-Ford computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. Unlike Dijkstra's, it supports negative edge weights and can detect negative cycles.",
  complexity: { best: "O(E)", average: "O(V*E)", worst: "O(V*E)", space: "O(V)" },
  pseudocode: [
    "initialize dist[v] = infinity, dist[source] = 0",
    "repeat V-1 times:",
    "  for each edge (u, v) with weight w:",
    "    if dist[u] + w < dist[v]:",
    "      dist[v] = dist[u] + w",
    "for each edge (u, v) with weight w:",
    "  if dist[u] + w < dist[v]: error 'Negative cycle detected'",
  ],
  codeSnippets: {
    javascript: `function bellmanFord(nodes, edges, source) {
  let dist = {};
  for (let n of nodes) dist[n.id] = Infinity;
  dist[source] = 0;
  for (let i = 0; i < nodes.length - 1; i++) {
    for (let e of edges) {
      if (dist[e.from] + e.weight < dist[e.to]) {
        dist[e.to] = dist[e.from] + e.weight;
      }
    }
  }
  return dist;
}`,
    python: `def bellman_ford(nodes, edges, source):
    dist = {n.id: float('inf') for n in nodes}
    dist[source] = 0
    for _ in range(len(nodes) - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist`,
    java: `Map<String, Integer> bellmanFord(List<Node> nodes, List<Edge> edges, String src) {
    Map<String, Integer> dist = new HashMap<>();
    for (Node n : nodes) dist.put(n.id, Integer.MAX_VALUE);
    dist.put(src, 0);
    for (int i = 0; i < nodes.size() - 1; i++) {
        for (Edge e : edges) {
            if (dist.get(e.from) != Integer.MAX_VALUE && dist.get(e.from) + e.weight < dist.get(e.to)) {
                dist.put(e.to, dist.get(e.from) + e.weight);
            }
        }
    }
    return dist;
}`,
    cpp: `map<string, int> bellmanFord(vector<Node>& nodes, vector<Edge>& edges, string src) {
    map<string, int> dist;
    for (auto& n : nodes) dist[n.id] = 1e9;
    dist[src] = 0;
    for (int i = 0; i < nodes.size() - 1; i++) {
        for (auto& e : edges) {
            if (dist[e.from] + e.weight < dist[e.to])
                dist[e.to] = dist[e.from] + e.weight;
        }
    }
    return dist;
}`,
  },
  defaultInput: {
    nodes: [
      { id: "A", label: "A" }, { id: "B", label: "B" },
      { id: "C", label: "C" }, { id: "D", label: "D" },
    ],
    edges: [
      { from: "A", to: "B", weight: 6 },
      { from: "A", to: "C", weight: 4 },
      { from: "C", to: "B", weight: -3 },
      { from: "B", to: "D", weight: 3 },
      { from: "C", to: "D", weight: 9 },
    ],
    directed: true,
    startNode: "A",
  } as GraphInput,
};

export function generateSteps(graphInput: GraphInput): Step[] {
  const effectiveInput = (graphInput && graphInput.nodes) ? graphInput : (bellmanFordMeta.defaultInput as GraphInput);
  const { nodes, edges, startNode = nodes[0].id } = effectiveInput;
  const steps: Step[] = [];

  const dist: Record<string, number> = {};
  for (const n of nodes) dist[n.id] = Infinity;
  dist[startNode] = 0;

  steps.push({
    type: "setDistance",
    nodeId: startNode,
    distance: 0,
    narration: `Initializing distances: dist[${startNode}] = 0`,
    pseudocodeLine: 0,
  });

  const V = nodes.length;
  for (let i = 0; i < V - 1; i++) {
    steps.push({
      type: "message",
      text: `Pass ${i + 1} of ${V - 1}`,
      narration: `Starting edge relaxation pass ${i + 1}`,
      pseudocodeLine: 1,
    });

    for (const e of edges) {
      const u = e.from;
      const v = e.to;
      const w = e.weight ?? 0;

      steps.push({
        type: "visitEdge",
        from: u,
        to: v,
        state: "comparing",
        narration: `Checking edge ${u} → ${v} (weight: ${w})`,
        pseudocodeLine: 2,
      });

      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        steps.push({
          type: "setDistance",
          nodeId: v,
          distance: dist[v],
          narration: `Relaxed edge! Updated dist[${v}] = ${dist[v]}`,
          pseudocodeLine: 4,
        });
        steps.push({
          type: "visitEdge",
          from: u,
          to: v,
          state: "sorted",
          narration: `Edge relaxation successful`,
          pseudocodeLine: 4,
        });
      }
    }
  }

  return steps;
}
