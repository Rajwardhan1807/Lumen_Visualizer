import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const matrixChainMeta: AlgorithmMeta = {
  name: "Matrix Chain Multiplication", slug: "matrix-chain", category: "dynamic-programming", difficulty: "advanced",
  tags: ["dynamic-programming", "matrix", "optimization"],
  description: "Matrix Chain Multiplication finds the most efficient way to multiply a given sequence of matrices by optimizing the placement of parentheses.",
  complexity: { best: "O(n³)", average: "O(n³)", worst: "O(n³)", space: "O(n²)" },
  pseudocode: [
    "initialize m[n][n] matrix with 0",
    "for L = 2 to n-1: // L is chain length",
    "  for i = 1 to n-L:",
    "    j = i + L - 1",
    "    m[i][j] = infinity",
    "    for k = i to j-1:",
    "      q = m[i][k] + m[k+1][j] + p[i-1]*p[k]*p[j]",
    "      m[i][j] = min(m[i][j], q)",
  ],
  codeSnippets: {
    javascript: `function matrixChainOrder(p) {
  let n = p.length;
  let m = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let L = 2; L < n; L++) {
    for (let i = 1; i < n - L + 1; i++) {
      let j = i + L - 1;
      m[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        let q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
        if (q < m[i][j]) m[i][j] = q;
      }
    }
  }
  return m[1][n - 1];
}`,
    python: `def matrix_chain_order(p):
    n = len(p)
    m = [[0] * n for _ in range(n)]
    for L in range(2, n):
        for i in range(1, n - L + 1):
            j = i + L - 1
            m[i][j] = float('inf')
            for k in range(i, j):
                q = m[i][k] + m[k+1][j] + p[i-1]*p[k]*p[j]
                if q < m[i][j]:
                    m[i][j] = q
    return m[1][n-1]`,
    java: `int matrixChainOrder(int[] p) {
    int n = p.length;
    int[][] m = new int[n][n];
    for (int L = 2; L < n; L++) {
        for (int i = 1; i < n - L + 1; i++) {
            int j = i + L - 1;
            m[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {
                int q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (q < m[i][j]) m[i][j] = q;
            }
        }
    }
    return m[1][n - 1];
}`,
    cpp: `int matrixChainOrder(vector<int>& p) {
    int n = p.size();
    vector<vector<int>> m(n, vector<int>(n, 0));
    for (int L = 2; L < n; L++) {
        for (int i = 1; i < n - L + 1; i++) {
            int j = i + L - 1;
            m[i][j] = 1e9;
            for (int k = i; k < j; k++) {
                int q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (q < m[i][j]) m[i][j] = q;
            }
        }
    }
    return m[1][n - 1];
}`,
  },
  defaultInput: [10, 20, 30, 40, 30],
};

export function generateSteps(input: number[]): Step[] {
  const p = Array.isArray(input) ? input : matrixChainMeta.defaultInput as number[];
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  const n = p.length;
  steps.push(msg(`Finding min multiplications for matrix chain dimensions: [${p.join(", ")}]`, "MCM DP started", 0));

  const m = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      steps.push({
        type: "fillCell",
        row: i,
        col: j,
        value: 0,
        state: "default",
        narration: `Initializing cost cell dp[${i}][${j}] = 0`,
        pseudocodeLine: 0,
      });
    }
  }

  for (let L = 2; L < n; L++) {
    for (let i = 1; i < n - L + 1; i++) {
      const j = i + L - 1;
      m[i][j] = Infinity;
      
      steps.push({
        type: "fillCell",
        row: i,
        col: j,
        value: "∞",
        state: "pivot",
        narration: `Calculating minimum cost to multiply matrices from index ${i} to ${j}`,
        pseudocodeLine: 4,
      });

      for (let k = i; k < j; k++) {
        steps.push({
          type: "highlightCell",
          cells: [[i, k], [k + 1, j]],
          state: "comparing",
          narration: `Evaluating split at k = ${k}: cost(A[${i}..${k}]) + cost(A[${k+1}..${j}]) + ${p[i-1]}*${p[k]}*${p[j]}`,
          pseudocodeLine: 6,
        });

        const q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
        if (q < m[i][j]) {
          m[i][j] = q;
          steps.push({
            type: "fillCell",
            row: i,
            col: j,
            value: q,
            state: "sorted",
            narration: `Found new minimum cost = ${q} at split k = ${k}`,
            pseudocodeLine: 7,
          });
        }
      }
    }
  }

  return steps;
}
