import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta, GraphInput } from "@/lib/types/algorithm";

export const bfsMeta: AlgorithmMeta = {
  name: "Breadth-First Search",
  slug: "bfs",
  category: "graphs",
  difficulty: "beginner",
  description: "BFS explores a graph level by level using a queue. Starting from the source node, it visits all neighbors before going deeper — ideal for finding shortest paths in unweighted graphs.",
  complexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
  pseudocode: [
    "BFS(graph, start):",
    "  visited = {start}",
    "  queue = [start]",
    "  while queue not empty:",
    "    node = queue.dequeue()",
    "    for each neighbor of node:",
    "      if neighbor not visited:",
    "        visited.add(neighbor)",
    "        queue.enqueue(neighbor)",
  ],
  codeSnippets: {
    javascript: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,
    python: `def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,
    java: `List<String> bfs(Map<String,List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    Queue<String> queue = new LinkedList<>();
    List<String> order = new ArrayList<>();
    queue.add(start); visited.add(start);
    while (!queue.isEmpty()) {
        String node = queue.poll();
        order.add(node);
        for (String nb : graph.getOrDefault(node, List.of()))
            if (visited.add(nb)) queue.add(nb);
    }
    return order;
}`,
    cpp: `vector<string> bfs(map<string,vector<string>>& g, string start) {
    set<string> visited; queue<string> q;
    vector<string> order;
    q.push(start); visited.insert(start);
    while (!q.empty()) {
        string node = q.front(); q.pop();
        order.push_back(node);
        for (auto& nb : g[node])
            if (!visited.count(nb)) { visited.insert(nb); q.push(nb); }
    }
    return order;
}`,
  },
  defaultInput: {
    nodes: [
      { id: "A", label: "A" }, { id: "B", label: "B" },
      { id: "C", label: "C" }, { id: "D", label: "D" },
      { id: "E", label: "E" }, { id: "F", label: "F" },
    ],
    edges: [
      { from: "A", to: "B" }, { from: "A", to: "C" },
      { from: "B", to: "D" }, { from: "B", to: "E" },
      { from: "C", to: "F" },
    ],
    startNode: "A",
  } as GraphInput,
};

export function generateSteps(graphInput: GraphInput): Step[] {
  const effectiveInput = (graphInput && graphInput.nodes) ? graphInput : (bfsMeta.defaultInput as GraphInput);
  const { nodes, edges, startNode = nodes[0].id } = effectiveInput;
  const steps: Step[] = [];

  // Build adjacency list
  const adj: Record<string, string[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    adj[e.from].push(e.to);
    if (!graphInput.directed) adj[e.to].push(e.from);
  }

  const visited = new Set<string>();
  const queue: string[] = [startNode];
  visited.add(startNode);

  steps.push({ type: "visitNode", nodeId: startNode, state: "pivot", narration: `Starting BFS from node ${startNode}. Adding to queue.`, pseudocodeLine: 1, codeLine: { javascript: 2, python: 2, java: 5, cpp: 4 } });

  while (queue.length > 0) {
    const node = queue.shift()!;
    steps.push({ type: "visitNode", nodeId: node, state: "sorted", narration: `Dequeued node ${node} — visiting it`, pseudocodeLine: 4, codeLine: { javascript: 6, python: 7, java: 6, cpp: 7 } });

    for (const neighbor of adj[node]) {
      steps.push({ type: "visitEdge", from: node, to: neighbor, state: "comparing", narration: `Exploring edge ${node} → ${neighbor}`, pseudocodeLine: 5, codeLine: { javascript: 8, python: 8, java: 8, cpp: 9 } });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push({ type: "visitNode", nodeId: neighbor, state: "queued", narration: `${neighbor} not visited — adding to queue`, pseudocodeLine: 7, codeLine: { javascript: 11, python: 10, java: 10, cpp: 11 } });
        steps.push({ type: "visitEdge", from: node, to: neighbor, state: "sorted", narration: `Edge ${node}→${neighbor} added to BFS tree`, pseudocodeLine: 8, codeLine: { javascript: 11, python: 10, java: 10, cpp: 11 } });
      }
    }
  }

  return steps;
}
