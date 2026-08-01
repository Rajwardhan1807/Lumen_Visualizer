import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const dpFibMeta: AlgorithmMeta = {
  name: "Fibonacci (Memoized)",
  slug: "fib-memo",
  category: "dynamic-programming",
  difficulty: "beginner",
  description: "Memoized Fibonacci stores previously computed values in a table, turning O(2^n) naive recursion into O(n). This is the classic introduction to dynamic programming.",
  complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)" },
  pseudocode: [
    "dp = array of size n+1, filled with -1",
    "fib(n):",
    "  if n <= 1: return n",
    "  if dp[n] != -1: return dp[n]  // cache hit",
    "  dp[n] = fib(n-1) + fib(n-2)",
    "  return dp[n]",
  ],
  codeSnippets: {
    javascript: `function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}`,
    python: `def fib(n, memo={}):
    if n <= 1: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]`,
    java: `int fib(int n, int[] dp) {
    if (n <= 1) return n;
    if (dp[n] != -1) return dp[n];
    dp[n] = fib(n-1, dp) + fib(n-2, dp);
    return dp[n];
}`,
    cpp: `int fib(int n, vector<int>& dp) {
    if (n <= 1) return n;
    if (dp[n] != -1) return dp[n];
    dp[n] = fib(n-1, dp) + fib(n-2, dp);
    return dp[n];
}`,
  },
  defaultInput: 7,
};

export function generateSteps(n: number): Step[] {
  const steps: Step[] = [];
  const dp: number[] = new Array(n + 1).fill(-1);

  // Initialize table
  for (let i = 0; i <= n; i++) {
    steps.push({ type: "fillCell", row: 0, col: i, value: -1, state: "default", narration: `Initialize dp[${i}] = -1`, pseudocodeLine: 0, codeLine: { javascript: 1, python: 1, java: 1, cpp: 1 } });
  }

  function fib(i: number): number {
    if (i <= 1) {
      dp[i] = i;
      steps.push({ type: "fillCell", row: 0, col: i, value: i, state: "sorted", narration: `Base case: dp[${i}] = ${i}`, pseudocodeLine: 2, codeLine: { javascript: 2, python: 2, java: 2, cpp: 2 } });
      return i;
    }

    if (dp[i] !== -1) {
      steps.push({ type: "highlightCell", cells: [[0, i]], state: "pivot", narration: `Cache hit! dp[${i}] = ${dp[i]} (already computed)`, pseudocodeLine: 3, codeLine: { javascript: 3, python: 3, java: 3, cpp: 3 } });
      return dp[i];
    }

    steps.push({ type: "highlightCell", cells: [[0, i - 1], [0, i - 2]], state: "queued", narration: `Computing dp[${i}] = dp[${i - 1}] + dp[${i - 2}]`, pseudocodeLine: 4, codeLine: { javascript: 4, python: 4, java: 4, cpp: 4 } });
    dp[i] = fib(i - 1) + fib(i - 2);
    steps.push({ type: "fillCell", row: 0, col: i, value: dp[i], state: "sorted", narration: `Stored dp[${i}] = ${dp[i]}`, pseudocodeLine: 5, codeLine: { javascript: 5, python: 5, java: 5, cpp: 5 } });
    return dp[i];
  }

  fib(n);
  return steps;
}
