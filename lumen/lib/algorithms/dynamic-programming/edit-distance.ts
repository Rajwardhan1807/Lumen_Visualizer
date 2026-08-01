import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const editDistanceMeta: AlgorithmMeta = {
  name: "Edit Distance", slug: "edit-distance", category: "dynamic-programming", difficulty: "advanced",
  tags: ["dynamic-programming", "edit-distance", "strings", "levenshtein"],
  description: "Edit Distance (Levenshtein Distance) measures the minimum number of single-character edits (insertions, deletions or substitutions) required to change one word into another.",
  complexity: { best: "O(m * n)", average: "O(m * n)", worst: "O(m * n)", space: "O(m * n)" },
  pseudocode: [
    "create table dp[m+1][n+1]",
    "fill dp[i][0] = i and dp[0][j] = j",
    "for i = 1 to m:",
    "  for j = 1 to n:",
    "    if S1[i-1] == S2[j-1]: dp[i][j] = dp[i-1][j-1]",
    "    else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
  ],
  codeSnippets: {
    javascript: `function editDistance(s1, s2) {
  let m = s1.length, n = s2.length;
  let dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    python: `def edit_distance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]`,
    java: `int editDistance(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
            }
        }
    }
    return dp[m][n];
}`,
    cpp: `int editDistance(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
            }
        }
    }
    return dp[m][n];
}`,
  },
  defaultInput: { s1: "cat", s2: "cut" },
};

export function generateSteps(input: { s1: string; s2: string }): Step[] {
  const { s1, s2 } = input || editDistanceMeta.defaultInput;
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  const m = s1.length;
  const n = s2.length;

  steps.push(msg(`Finding minimum Edit Distance between "${s1}" and "${s2}"`, "Edit Distance DP started", 0));

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Initialize dp table
  for (let r = 0; r <= m; r++) {
    for (let c = 0; c <= n; c++) {
      let val = 0;
      if (r === 0) val = c;
      else if (c === 0) val = r;
      dp[r][c] = val;
      steps.push({
        type: "fillCell",
        row: r,
        col: c,
        value: val,
        state: "default",
        narration: `Initializing base case dp[${r}][${c}] = ${val}`,
        pseudocodeLine: 1,
      });
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s1[i - 1] === s2[j - 1];
      steps.push({
        type: "highlightCell",
        cells: [[i - 1, j], [i, j - 1], [i - 1, j - 1]],
        state: "comparing",
        narration: `Comparing characters S1[${i - 1}] = '${s1[i - 1]}' and S2[${j - 1}] = '${s2[j - 1]}'`,
        pseudocodeLine: 4,
      });

      if (match) {
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({
          type: "fillCell",
          row: i,
          col: j,
          value: dp[i][j],
          state: "sorted",
          narration: `Match found! No operation needed: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}`,
          pseudocodeLine: 4,
        });
      } else {
        const replace = dp[i - 1][j - 1];
        const insert = dp[i][j - 1];
        const del = dp[i - 1][j];
        dp[i][j] = 1 + Math.min(replace, insert, del);
        steps.push({
          type: "fillCell",
          row: i,
          col: j,
          value: dp[i][j],
          state: "default",
          narration: `No match. Compute 1 + min(replace: ${replace}, insert: ${insert}, delete: ${del}) = ${dp[i][j]}`,
          pseudocodeLine: 5,
        });
      }
    }
  }

  return steps;
}
