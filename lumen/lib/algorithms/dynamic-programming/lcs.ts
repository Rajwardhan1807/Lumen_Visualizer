import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const lcsMeta: AlgorithmMeta = {
  name: "Longest Common Subsequence", slug: "lcs", category: "dynamic-programming", difficulty: "intermediate",
  tags: ["dynamic-programming", "lcs", "strings"],
  description: "Longest Common Subsequence finds the longest subsequence common to two sequences, matching characters in order without requiring contiguity.",
  complexity: { best: "O(m * n)", average: "O(m * n)", worst: "O(m * n)", space: "O(m * n)" },
  pseudocode: [
    "create table dp[m+1][n+1] with 0",
    "for i = 1 to m:",
    "  for j = 1 to n:",
    "    if S1[i-1] == S2[j-1]:",
    "      dp[i][j] = 1 + dp[i-1][j-1]",
    "    else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
  ],
  codeSnippets: {
    javascript: `function lcs(s1, s2) {
  let m = s1.length, n = s2.length;
  let dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    python: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = 1 + dp[i-1][j-1]
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
    java: `int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}`,
    cpp: `int lcs(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}`,
  },
  defaultInput: { s1: "ABCDGH", s2: "AEDFHR" },
};

export function generateSteps(input: { s1: string; s2: string }): Step[] {
  const { s1, s2 } = input || lcsMeta.defaultInput;
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  const m = s1.length;
  const n = s2.length;

  steps.push(msg(`Finding LCS between "${s1}" and "${s2}"`, "LCS DP started", 0));

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Initialize dp table
  for (let r = 0; r <= m; r++) {
    for (let c = 0; c <= n; c++) {
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

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s1[i - 1] === s2[j - 1];
      steps.push({
        type: "highlightCell",
        cells: match ? [[i - 1, j - 1]] : [[i - 1, j], [i, j - 1]],
        state: "comparing",
        narration: `Comparing S1[${i - 1}] = '${s1[i - 1]}' with S2[${j - 1}] = '${s2[j - 1]}'`,
        pseudocodeLine: 3,
      });

      if (match) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        steps.push({
          type: "fillCell",
          row: i,
          col: j,
          value: dp[i][j],
          state: "sorted",
          narration: `Match found! Increment subproblem: dp[${i}][${j}] = 1 + dp[${i - 1}][${j - 1}] = ${dp[i][j]}`,
          pseudocodeLine: 4,
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          type: "fillCell",
          row: i,
          col: j,
          value: dp[i][j],
          state: "default",
          narration: `No match. Carry forward max: dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}`,
          pseudocodeLine: 5,
        });
      }
    }
  }

  return steps;
}
