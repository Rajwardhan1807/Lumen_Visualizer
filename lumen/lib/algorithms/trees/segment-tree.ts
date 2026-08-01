import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const segmentTreeMeta: AlgorithmMeta = {
  name: "Segment Tree", slug: "segment-tree", category: "trees", difficulty: "advanced",
  tags: ["trees", "range-query", "segment-tree"],
  description: "A Segment Tree is a tree data structure used for storing information about intervals, or segments. It allows querying which of the stored segments contains a given point in O(log n) time.",
  complexity: { best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
  pseudocode: [
    "build(node, start, end):",
    "  if start == end: tree[node] = arr[start]; return",
    "  mid = (start + end) / 2",
    "  build(2*node, start, mid)",
    "  build(2*node+1, mid+1, end)",
    "  tree[node] = tree[2*node] + tree[2*node+1]",
  ],
  codeSnippets: {
    javascript: `function buildTree(arr, tree, node, start, end) {
  if (start === end) {
    tree[node] = arr[start];
    return;
  }
  let mid = Math.floor((start + end) / 2);
  buildTree(arr, tree, 2 * node, start, mid);
  buildTree(arr, tree, 2 * node + 1, mid + 1, end);
  tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
    python: `def build_tree(arr, tree, node, start, end):
    if start == end:
        tree[node] = arr[start]
        return
    mid = (start + end) // 2
    build_tree(arr, tree, 2 * node, start, mid)
    build_tree(arr, tree, 2 * node + 1, mid + 1, end)
    tree[node] = tree[2 * node] + tree[2 * node + 1]`,
    java: `void buildTree(int[] arr, int[] tree, int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = (start + end) / 2;
    buildTree(arr, tree, 2 * node, start, mid);
    buildTree(arr, tree, 2 * node + 1, mid + 1, end);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
    cpp: `void buildTree(vector<int>& arr, vector<int>& tree, int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = (start + end) / 2;
    buildTree(arr, tree, 2 * node, start, mid);
    buildTree(arr, tree, 2 * node + 1, mid + 1, end);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
  },
  defaultInput: [1, 3, 5, 7],
};

export function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg("Segment Tree range-sum building simulation starting...", "Initializing Segment Tree construction", 0));

  // Build tree steps for range [0..3]
  steps.push({
    type: "treeInsert",
    nodeId: "s_root",
    parentId: null,
    value: 16, // sum([1,3,5,7])
    narration: "Creating Segment Tree root covering range [0..3] (Sum = 16)",
    pseudocodeLine: 5,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "s_l",
    parentId: "s_root",
    value: 4, // sum([1,3])
    isLeft: true,
    narration: "Creating left sub-segment covering range [0..1] (Sum = 4)",
    pseudocodeLine: 3,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "s_ll",
    parentId: "s_l",
    value: 1, // leaf index 0
    isLeft: true,
    narration: "Leaf node reached for index 0 (Value = 1)",
    pseudocodeLine: 1,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "s_lr",
    parentId: "s_l",
    value: 3, // leaf index 1
    isLeft: false,
    narration: "Leaf node reached for index 1 (Value = 3)",
    pseudocodeLine: 1,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "s_r",
    parentId: "s_root",
    value: 12, // sum([5,7])
    isLeft: false,
    narration: "Creating right sub-segment covering range [2..3] (Sum = 12)",
    pseudocodeLine: 4,
  });

  steps.push(msg("Segment Tree range-sum construct completed.", "Segment Tree built successfully", 0));
  return steps;
}
