import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta, GraphInput } from "@/lib/types/algorithm";

export const topologicalSortMeta: AlgorithmMeta = {
  name: "Topological Sort", slug: "topological-sort", category: "graphs", difficulty: "intermediate",
  tags: ["graphs", "sorting", "dag", "dfs"],
  description: "Topological Sort of a Directed Acyclic Graph (DAG) is a linear ordering of vertices such that for every directed edge u → v, vertex u comes before v in the ordering.",
  complexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
  pseudocode: [
    "for each vertex v in graph:",
    "  if v is not visited:",
    "    dfsHelper(v, visited, stack)",
    "dfsHelper(v, visited, stack):",
    "  mark v as visited",
    "  for each neighbor of v: dfsHelper(neighbor)",
    "  push v to stack",
  ],
  codeSnippets: {
    javascript: `function topologicalSort(nodes, adjList) {
  let visited = new Set();
  let stack = [];
  function dfs(u) {
    visited.add(u);
    for (let v of adjList[u] || []) {
      if (!visited.has(v)) dfs(v);
    }
    stack.push(u);
  }
  for (let n of nodes) {
    if (!visited.has(n.id)) dfs(n.id);
  }
  return stack.reverse();
}`,
    python: `def topological_sort(nodes, adj_list):
    visited = set()
    stack = []
    def dfs(u):
        visited.add(u)
        for v in adj_list.get(u, []):
            if v not in visited:
                dfs(v)
        stack.append(u)
    for n in nodes:
        if n.id not in visited:
            dfs(n.id)
    return stack[::-1]`,
    java: `List<String> topologicalSort(List<Node> nodes, Map<String, List<String>> adj) {
    Set<String> visited = new HashSet<>();
    Stack<String> stack = new Stack<>();
    for (Node n : nodes) {
        if (!visited.contains(n.id)) {
            dfs(n.id, visited, stack, adj);
        }
    }
    List<String> order = new ArrayList<>();
    while (!stack.isEmpty()) order.add(stack.pop());
    return order;
}
void dfs(String u, Set<String> visited, Stack<String> stack, Map<String, List<String>> adj) {
    visited.add(u);
    for (String v : adj.getOrDefault(u, List.of())) {
        if (!visited.contains(v)) dfs(v, visited, stack, adj);
    }
    stack.push(u);
}`,
    cpp: `vector<string> topologicalSort(vector<Node>& nodes, map<string, vector<string>>& adj) {
    set<string> visited;
    vector<string> order;
    for (auto& n : nodes) {
        if (!visited.count(n.id)) dfs(n.id, visited, order, adj);
    }
    reverse(order.begin(), order.end());
    return order;
}
void dfs(string u, set<string>& visited, vector<string>& order, map<string, vector<string>>& adj) {
    visited.insert(u);
    for (auto& v : adj[u]) {
        if (!visited.count(v)) dfs(v, visited, order, adj);
    }
    order.push_back(u);
}`,
  },
  defaultInput: {
    nodes: [
      { id: "A", label: "A" }, { id: "B", label: "B" },
      { id: "C", label: "C" }, { id: "D", label: "D" },
    ],
    edges: [
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "B", to: "D" },
      { from: "C", to: "D" },
    ],
    directed: true,
  } as GraphInput,
};

export function generateSteps(graphInput: GraphInput): Step[] {
  const effectiveInput = (graphInput && graphInput.nodes) ? graphInput : (topologicalSortMeta.defaultInput as GraphInput);
  const { nodes, edges } = effectiveInput;
  const steps: Step[] = [];

  const adj: Record<string, string[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    adj[e.from].push(e.to);
  }

  const visited = new Set<string>();
  const stack: string[] = [];

  steps.push({
    type: "message",
    text: "Starting Topological Sort DFS traversals",
    narration: "Topological Sort DFS starting",
    pseudocodeLine: 0,
  });

  function dfs(u: string) {
    visited.add(u);
    steps.push({
      type: "visitNode",
      nodeId: u,
      state: "comparing",
      narration: `DFS: visiting vertex ${u}`,
      pseudocodeLine: 4,
    });

    for (const v of adj[u]) {
      steps.push({
        type: "visitEdge",
        from: u,
        to: v,
        state: "comparing",
        narration: `Checking neighbor edge ${u} → ${v}`,
        pseudocodeLine: 5,
      });

      if (!visited.has(v)) {
        dfs(v);
      }
    }

    stack.push(u);
    steps.push({
      type: "visitNode",
      nodeId: u,
      state: "sorted",
      narration: `Finished vertex ${u}. Pushing to topological stack.`,
      pseudocodeLine: 6,
    });
  }

  for (const n of nodes) {
    if (!visited.has(n.id)) {
      dfs(n.id);
    }
  }

  steps.push({
    type: "message",
    text: `Topological Order: ${[...stack].reverse().join(" → ")}`,
    narration: "Reversing stack to yield topological linear ordering",
    pseudocodeLine: 0,
  });

  return steps;
}
