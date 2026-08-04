import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta, GraphInput } from "@/lib/types/algorithm";

export const dfsMeta: AlgorithmMeta = {
  name: "Depth-First Search",
  slug: "dfs",
  category: "graphs",
  difficulty: "beginner",
  description: "DFS explores as far as possible along each branch before backtracking. Uses a stack (implicit via recursion). Great for topological sorting, cycle detection, and maze solving.",
  complexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
  pseudocode: [
    "DFS(graph, node, visited):",
    "  visited.add(node)",
    "  process(node)",
    "  for each neighbor of node:",
    "    if neighbor not in visited:",
    "      DFS(graph, neighbor, visited)",
  ],
  codeSnippets: {
    javascript: `function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  console.log(node);
  for (const neighbor of graph[node] || []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`,
    python: `def dfs(graph, node, visited=None):
    if visited is None: visited = set()
    visited.add(node)
    print(node)
    for neighbor in graph.get(node, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)`,
    java: `void dfs(Map<String,List<String>> g, String node, Set<String> visited) {
    visited.add(node);
    System.out.println(node);
    for (String nb : g.getOrDefault(node, List.of()))
        if (visited.add(nb)) dfs(g, nb, visited);
}`,
    cpp: `void dfs(map<string,vector<string>>& g, string node, set<string>& visited) {
    visited.insert(node);
    cout << node << endl;
    for (auto& nb : g[node])
        if (!visited.count(nb)) dfs(g, nb, visited);
}`,
  },
  defaultInput: {
    nodes: [
      { id: "A", label: "A" }, { id: "B", label: "B" },
      { id: "C", label: "C" }, { id: "D", label: "D" },
      { id: "E", label: "E" },
    ],
    edges: [
      { from: "A", to: "B" }, { from: "A", to: "C" },
      { from: "B", to: "D" }, { from: "C", to: "E" },
    ],
    startNode: "A",
  } as GraphInput,
};

export function generateSteps(graphInput: GraphInput): Step[] {
  const effectiveInput = (graphInput && graphInput.nodes) ? graphInput : (dfsMeta.defaultInput as GraphInput);
  const { nodes, edges, startNode = nodes[0].id } = effectiveInput;
  const steps: Step[] = [];

  const adj: Record<string, string[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    adj[e.from].push(e.to);
    if (!graphInput.directed) adj[e.to].push(e.from);
  }

  const visited = new Set<string>();

  function dfs(node: string) {
    visited.add(node);
    steps.push({ type: "visitNode", nodeId: node, state: "sorted", narration: `Visiting node ${node}`, pseudocodeLine: 1, codeLine: { javascript: 2, python: 3, java: 2, cpp: 2 } });

    for (const neighbor of adj[node]) {
      steps.push({ type: "visitEdge", from: node, to: neighbor, state: "comparing", narration: `Exploring edge ${node} → ${neighbor}`, pseudocodeLine: 3, codeLine: { javascript: 4, python: 5, java: 4, cpp: 4 } });

      if (!visited.has(neighbor)) {
        steps.push({ type: "visitEdge", from: node, to: neighbor, state: "sorted", narration: `Going deeper: visiting ${neighbor}`, pseudocodeLine: 5, codeLine: { javascript: 6, python: 7, java: 5, cpp: 5 } });
        dfs(neighbor);
      } else {
        steps.push({ type: "visitNode", nodeId: neighbor, state: "sorted", narration: `${neighbor} already visited — backtracking`, pseudocodeLine: 4, codeLine: { javascript: 5, python: 6, java: 4, cpp: 4 } });
      }
    }
  }

  dfs(startNode);
  return steps;
}
