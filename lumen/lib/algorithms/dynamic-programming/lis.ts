import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const lisMeta: AlgorithmMeta = {
  name: "Longest Increasing Subsequence", slug: "lis", category: "dynamic-programming", difficulty: "intermediate",
  tags: ["dynamic-programming", "lis", "subsequence"],
  description: "Longest Increasing Subsequence finds the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.",
  complexity: { best: "O(n log n)", average: "O(n²)", worst: "O(n²)", space: "O(n)" },
  pseudocode: [
    "initialize dp array with size n and fill with 1",
    "for i = 1 to n-1:",
    "  for j = 0 to i-1:",
    "    if arr[i] > arr[j] and dp[i] < dp[j] + 1:",
    "      dp[i] = dp[j] + 1",
    "return max element in dp",
  ],
  codeSnippets: {
    javascript: `function lis(arr) {
  let n = arr.length;
  if (n === 0) return 0;
  let dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
        dp[i] = dp[j] + 1;
      }
    }
  }
  return Math.max(...dp);
}`,
    python: `def lis(arr):
    n = len(arr)
    if n == 0: return 0
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if arr[i] > arr[j] and dp[i] < dp[j] + 1:
                dp[i] = dp[j] + 1
    return max(dp)`,
    java: `int lis(int[] arr) {
    int n = arr.length;
    if (n == 0) return 0;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
            }
        }
    }
    int max = 1;
    for (int v : dp) if (v > max) max = v;
    return max;
}`,
    cpp: `int lis(vector<int>& arr) {
    int n = arr.size();
    if (n == 0) return 0;
    vector<int> dp(n, 1);
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
            }
        }
    }
    return *max_element(dp.begin(), dp.end());
}`,
  },
  defaultInput: [10, 22, 9, 33, 21, 50, 41, 60],
};

export function generateSteps(input: number[]): Step[] {
  const arr = Array.isArray(input) ? input : lisMeta.defaultInput as number[];
  const steps: Step[] = [];
  const { compare, mark, set, msg } = createStepBuilder();

  const n = arr.length;
  if (n === 0) return steps;

  steps.push(msg(`Initializing LIS search on [${arr.join(", ")}]`, "LIS started", 0));

  const dp = new Array(n).fill(1);

  for (let idx = 0; idx < n; idx++) {
    steps.push({
      type: "fillCell",
      row: 0,
      col: idx,
      value: 1,
      state: "default",
      narration: `Set initial LIS length at position ${idx} to 1`,
      pseudocodeLine: 0,
    });
  }

  for (let i = 1; i < n; i++) {
    steps.push(mark(i, "pivot", `Outer loop: evaluating index ${i} (${arr[i]})`, 1));
    for (let j = 0; j < i; j++) {
      steps.push(compare([i, j], `Comparing arr[${i}] = ${arr[i]} with arr[${j}] = ${arr[j]}`, 3));
      if (arr[i] > arr[j]) {
        if (dp[i] < dp[j] + 1) {
          dp[i] = dp[j] + 1;
          steps.push({
            type: "fillCell",
            row: 0,
            col: i,
            value: dp[i],
            state: "sorted",
            narration: `Increasing subsequence found. Updated LIS length at ${i} to ${dp[i]}`,
            pseudocodeLine: 4,
          });
        }
      }
    }
  }

  steps.push(msg(`Longest Increasing Subsequence length is ${Math.max(...dp)}`, "LIS complete", 5));
  return steps;
}
