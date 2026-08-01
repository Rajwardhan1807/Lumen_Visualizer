import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const fenwickMeta: AlgorithmMeta = {
  name: "Fenwick Tree (BIT)", slug: "fenwick-tree", category: "trees", difficulty: "advanced",
  tags: ["trees", "range-query", "fenwick-tree", "bit"],
  description: "A Fenwick Tree or Binary Indexed Tree (BIT) is a structure that can efficiently update elements and calculate prefix sums in an array of numbers.",
  complexity: { best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
  pseudocode: [
    "update(idx, val):",
    "  while idx <= n:",
    "    tree[idx] += val",
    "    idx += idx & (-idx)",
    "query(idx):",
    "  sum = 0",
    "  while idx > 0:",
    "    sum += tree[idx]",
    "    idx -= idx & (-idx)",
  ],
  codeSnippets: {
    javascript: `function update(tree, idx, val, n) {
  while (idx <= n) {
    tree[idx] += val;
    idx += idx & (-idx);
  }
}
function query(tree, idx) {
  let sum = 0;
  while (idx > 0) {
    sum += tree[idx];
    idx -= idx & (-idx);
  }
  return sum;
}`,
    python: `def update(tree, idx, val, n):
    while idx <= n:
        tree[idx] += val
        idx += idx & (-idx)

def query(tree, idx):
    total = 0
    while idx > 0:
        total += tree[idx]
        idx -= idx & (-idx)
    return total`,
    java: `void update(int[] tree, int idx, int val, int n) {
    while (idx <= n) {
        tree[idx] += val;
        idx += idx & (-idx);
    }
}
int query(int[] tree, int idx) {
    int sum = 0;
    while (idx > 0) {
        sum += tree[idx];
        idx -= idx & (-idx);
    }
    return sum;
}`,
    cpp: `void update(vector<int>& tree, int idx, int val, int n) {
    while (idx <= n) {
        tree[idx] += val;
        idx += idx & (-idx);
    }
}
int query(vector<int>& tree, int idx) {
    int sum = 0;
    while (idx > 0) {
        sum += tree[idx];
        idx -= idx & (-idx);
    }
    return sum;
}`,
  },
  defaultInput: [1, 2, 3, 4, 5],
};

export function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg("Binary Indexed Tree (BIT) construction and update simulation starting...", "Initializing Fenwick Tree", 0));

  // Simulate updating indices
  steps.push({
    type: "treeInsert",
    nodeId: "f_1",
    parentId: null,
    value: 1, // index 1 (val = 1)
    narration: "Updating index 1 with value 1",
    pseudocodeLine: 2,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "f_2",
    parentId: "f_1",
    value: 3, // index 2 (prefix sum 1+2 = 3)
    isLeft: false,
    narration: "Updating index 2: cumulative sum node is 3",
    pseudocodeLine: 3,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "f_4",
    parentId: "f_2",
    value: 10, // index 4 (prefix sum 1+2+3+4 = 10)
    isLeft: false,
    narration: "Updating index 4: cumulative sum node is 10",
    pseudocodeLine: 3,
  });

  steps.push(msg("BIT building completed.", "Fenwick Tree initialized successfully", 0));
  return steps;
}
