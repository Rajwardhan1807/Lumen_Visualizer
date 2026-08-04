import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta, GraphInput } from "@/lib/types/algorithm";

export const dijkstraMeta: AlgorithmMeta = {
  name: "Dijkstra's Algorithm",
  slug: "dijkstra",
  category: "graphs",
  difficulty: "intermediate",
  description: "Dijkstra's algorithm finds the shortest path from a source to all other vertices in a weighted graph using a priority queue. Works with non-negative edge weights.",
  complexity: { best: "O((V+E) log V)", average: "O((V+E) log V)", worst: "O((V+E) log V)", space: "O(V)" },
  pseudocode: [
    "dist[source]=0, all others=∞",
    "priority queue Q = {source}",
    "while Q not empty:",
    "  u = vertex with min dist",
    "  for each neighbor v of u:",
    "    if dist[u] + weight(u,v) < dist[v]:",
    "      dist[v] = dist[u] + weight(u,v)",
    "      Q.update(v)",
  ],
  codeSnippets: {
    javascript: `function dijkstra(graph, source) {
  const dist = {}, visited = new Set();
  for (const node in graph) dist[node] = Infinity;
  dist[source] = 0;
  const pq = [[0, source]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,
    python: `import heapq
def dijkstra(graph, source):
    dist = {n: float('inf') for n in graph}
    dist[source] = 0
    pq = [(0, source)]
    while pq:
        d, u = heapq.heappop(pq)
        for v, w in graph[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
    java: `Map<String,Integer> dijkstra(Map<String,List<int[]>> g, String src) {
    Map<String,Integer> dist = new HashMap<>();
    for (String n : g.keySet()) dist.put(n, Integer.MAX_VALUE);
    dist.put(src, 0);
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    // implementation continues...
    return dist;
}`,
    cpp: `map<string,int> dijkstra(map<string,vector<pair<string,int>>>& g, string src) {
    map<string,int> dist; for (auto& p : g) dist[p.first] = INT_MAX;
    dist[src] = 0;
    priority_queue<pair<int,string>, vector<pair<int,string>>, greater<>> pq;
    pq.push({0, src});
    // implementation continues...
    return dist;
}`,
  },
  defaultInput: {
    nodes: [
      { id: "A", label: "A" }, { id: "B", label: "B" },
      { id: "C", label: "C" }, { id: "D", label: "D" },
    ],
    edges: [
      { from: "A", to: "B", weight: 1 },
      { from: "A", to: "C", weight: 4 },
      { from: "B", to: "C", weight: 2 },
      { from: "B", to: "D", weight: 5 },
      { from: "C", to: "D", weight: 1 },
    ],
    directed: false,
    startNode: "A",
  } as GraphInput,
};

export function generateSteps(graphInput: GraphInput): Step[] {
  const effectiveInput = (graphInput && graphInput.nodes) ? graphInput : (dijkstraMeta.defaultInput as GraphInput);
  const { nodes, edges, startNode = nodes[0].id } = effectiveInput;
  const steps: Step[] = [];

  const adj: Record<string, Array<[string, number]>> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    adj[e.from].push([e.to, e.weight ?? 1]);
    if (!graphInput.directed) adj[e.to].push([e.from, e.weight ?? 1]);
  }

  const dist: Record<string, number> = {};
  for (const n of nodes) dist[n.id] = Infinity;
  dist[startNode] = 0;

  steps.push({ type: "setDistance", nodeId: startNode, distance: 0, narration: `Set dist[${startNode}] = 0, all others = ∞`, pseudocodeLine: 0, codeLine: { javascript: 4, python: 4, java: 5, cpp: 5 } });

  const visited = new Set<string>();
  const pq: Array<[number, string]> = [[0, startNode]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    if (visited.has(u)) continue;
    visited.add(u);

    steps.push({ type: "visitNode", nodeId: u, state: "sorted", narration: `Processing node ${u} with dist=${d}`, pseudocodeLine: 3, codeLine: { javascript: 7, python: 7, java: 8, cpp: 8 } });

    for (const [v, w] of adj[u]) {
      steps.push({ type: "visitEdge", from: u, to: v, state: "comparing", narration: `Checking edge ${u}→${v} (weight=${w}): dist[${u}]+${w}=${d + w} vs dist[${v}]=${dist[v]}`, pseudocodeLine: 5, codeLine: { javascript: 11, python: 9, java: 11, cpp: 10 } });

      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.push([dist[v], v]);
        steps.push({ type: "setDistance", nodeId: v, distance: dist[v], narration: `Updated dist[${v}] = ${dist[v]}`, pseudocodeLine: 6, codeLine: { javascript: 13, python: 11, java: 12, cpp: 11 } });
        steps.push({ type: "visitNode", nodeId: v, state: "queued", narration: `${v} added/updated in priority queue`, pseudocodeLine: 7, codeLine: { javascript: 14, python: 12, java: 13, cpp: 12 } });
        steps.push({ type: "visitEdge", from: u, to: v, state: "sorted", narration: `Shorter path found: ${u}→${v}`, pseudocodeLine: 6, codeLine: { javascript: 13, python: 11, java: 12, cpp: 11 } });
      }
    }
  }

  return steps;
}
