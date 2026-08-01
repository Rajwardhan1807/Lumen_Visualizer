import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const knapsackMeta: AlgorithmMeta = {
  name: "0/1 Knapsack", slug: "knapsack", category: "dynamic-programming", difficulty: "intermediate",
  tags: ["dynamic-programming", "knapsack", "optimization"],
  description: "0/1 Knapsack solves the optimization problem where we must select a subset of items to maximize value without exceeding capacity W.",
  complexity: { best: "O(n * W)", average: "O(n * W)", worst: "O(n * W)", space: "O(n * W)" },
  pseudocode: [
    "create table dp[N+1][W+1] with 0",
    "for i = 1 to N:",
    "  for w = 1 to W:",
    "    if weights[i-1] <= w:",
    "      dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])",
    "    else: dp[i][w] = dp[i-1][w]",
  ],
  codeSnippets: {
    javascript: `function knapsack(W, wt, val, n) {
  let dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (wt[i - 1] <= w) {
        dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][W];
}`,
    python: `def knapsack(W, wt, val, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i-1] <= w:
                dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][W]`,
    java: `int knapsack(int W, int[] wt, int[] val, int n) {
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,
    cpp: `int knapsack(int W, vector<int>& wt, vector<int>& val, int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}`,
  },
  defaultInput: {
    items: [
      { weight: 2, value: 3 },
      { weight: 3, value: 4 },
      { weight: 4, value: 5 },
    ],
    capacity: 5,
  },
};

export function generateSteps(input: { items: Array<{ weight: number; value: number }>; capacity: number }): Step[] {
  const { items, capacity } = input || knapsackMeta.defaultInput;
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  const N = items.length;
  steps.push(msg(`Solving 0/1 Knapsack for Capacity = ${capacity} with ${N} items`, "Knapsack started", 0));

  const dp = Array.from({ length: N + 1 }, () => new Array(capacity + 1).fill(0));

  // Initialize first row and column
  for (let r = 0; r <= N; r++) {
    for (let c = 0; c <= capacity; c++) {
      steps.push({
        type: "fillCell",
        row: r,
        col: c,
        value: 0,
        state: "default",
        narration: `Initializing dp[${r}][${c}] = 0`,
        pseudocodeLine: 0,
      });
    }
  }

  for (let i = 1; i <= N; i++) {
    const item = items[i - 1];
    for (let w = 1; w <= capacity; w++) {
      if (item.weight <= w) {
        steps.push({
          type: "highlightCell",
          cells: [[i - 1, w], [i - 1, w - item.weight]],
          state: "comparing",
          narration: `Item ${i} (wt: ${item.weight}, val: ${item.value}) fits in capacity ${w}. Compare including it vs excluding.`,
          pseudocodeLine: 3,
        });

        dp[i][w] = Math.max(item.value + dp[i - 1][w - item.weight], dp[i - 1][w]);
      } else {
        steps.push({
          type: "highlightCell",
          cells: [[i - 1, w]],
          state: "comparing",
          narration: `Item ${i} (wt: ${item.weight}) too heavy for capacity ${w}. Carry forward previous value.`,
          pseudocodeLine: 5,
        });

        dp[i][w] = dp[i - 1][w];
      }

      steps.push({
        type: "fillCell",
        row: i,
        col: w,
        value: dp[i][w],
        state: "sorted",
        narration: `Set dp[${i}][${w}] = ${dp[i][w]}`,
        pseudocodeLine: 4,
      });
    }
  }

  return steps;
}
