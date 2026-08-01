import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const wordSearchMeta: AlgorithmMeta = {
  name: "Word Search", slug: "word-search", category: "backtracking", difficulty: "intermediate",
  tags: ["backtracking", "word-search", "matrix"],
  description: "Find if a word exists in a 2D grid of characters. The word can be constructed from letters of sequentially adjacent cells.",
  complexity: { best: "O(n * m * 4^l)", average: "O(n * m * 4^l)", worst: "O(n * m * 4^l)", space: "O(l)" },
  pseudocode: [
    "exist(board, word):",
    "  for r = 0 to rows:",
    "    for c = 0 to cols:",
    "      if dfs(r, c, 0): return true",
    "  return false",
    "dfs(r, c, idx):",
    "  if idx == word.length: return true",
    "  if outOfBounds or board[r][c] != word[idx]: return false",
    "  mark board[r][c] as visited",
    "  explore Up, Down, Left, Right neighbors",
    "  backtrack visited mark",
  ],
  codeSnippets: {
    javascript: `function exist(board, word) {
  let R = board.length, C = board[0].length;
  function dfs(r, c, idx) {
    if (idx === word.length) return true;
    if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] !== word[idx]) return false;
    let temp = board[r][c];
    board[r][c] = '*';
    let found = dfs(r+1, c, idx+1) || dfs(r-1, c, idx+1) || dfs(r, c+1, idx+1) || dfs(r, c-1, idx+1);
    board[r][c] = temp;
    return found;
  }
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
    python: `def exist(board, word):
    R, C = len(board), len(board[0])
    def dfs(r, c, idx):
        if idx == len(word): return True
        if r < 0 or r >= R or c < 0 or c >= C or board[r][c] != word[idx]: return False
        temp = board[r][c]
        board[r][c] = '*'
        found = dfs(r+1, c, idx+1) or dfs(r-1, c, idx+1) or dfs(r, c+1, idx+1) or dfs(r, c-1, idx+1)
        board[r][c] = temp
        return found
    for r in range(R):
        for c in range(C):
            if dfs(r, c, 0): return True
    return False`,
    java: `boolean exist(char[][] board, String word) {
    for (int r = 0; r < board.length; r++) {
        for (int c = 0; c < board[0].length; c++) {
            if (dfs(board, word, r, c, 0)) return true;
        }
    }
    return false;
}
boolean dfs(char[][] board, String word, int r, int c, int idx) {
    if (idx == word.length()) return true;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != word.charAt(idx)) return false;
    char temp = board[r][c];
    board[r][c] = '*';
    boolean found = dfs(board, word, r + 1, c, idx + 1) || dfs(board, word, r - 1, c, idx + 1) || dfs(board, word, r, c + 1, idx + 1) || dfs(board, word, r, c - 1, idx + 1);
    board[r][c] = temp;
    return found;
}`,
    cpp: `bool exist(vector<vector<char>>& board, string word) {
    for (int r = 0; r < board.size(); r++) {
        for (int c = 0; c < board[0].size(); c++) {
            if (dfs(board, word, r, c, 0)) return true;
        }
    }
    return false;
}
bool dfs(vector<vector<char>>& board, string& word, int r, int c, int idx) {
    if (idx == word.size()) return true;
    if (r < 0 || r >= board.size() || c < 0 || c >= board[0].size() || board[r][c] != word[idx]) return false;
    char temp = board[r][c];
    board[r][c] = '*';
    bool found = dfs(board, word, r+1, c, idx+1) || dfs(board, word, r-1, c, idx+1) || dfs(board, word, r, c+1, idx+1) || dfs(board, word, r, c-1, idx+1);
    board[r][c] = temp;
    return found;
}`,
  },
  defaultInput: [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"]
  ],
};

export function generateSteps(input: string[][], word = "ABCCED"): Step[] {
  const board = input && Array.isArray(input) ? input.map((row) => [...row]) : wordSearchMeta.defaultInput as string[][];
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  const R = board.length;
  const C = board[0].length;

  steps.push(msg(`Searching for word "${word}" in grid`, "Backtracking word search started", 0));

  function dfs(r: number, c: number, idx: number): boolean {
    if (idx === word.length) return true;
    if (r < 0 || r >= R || c < 0 || c >= C) return false;

    steps.push({
      type: "boardMark",
      row: r,
      col: c,
      state: "comparing",
      narration: `Checking letter at (${r}, ${c}) = '${board[r][c]}' vs word[${idx}] = '${word[idx]}'`,
      pseudocodeLine: 7,
    });

    if (board[r][c] !== word[idx]) {
      return false;
    }

    const temp = board[r][c];
    board[r][c] = "*"; // mark visited
    steps.push({
      type: "boardMark",
      row: r,
      col: c,
      state: "sorted",
      narration: `Match found! Character '${temp}' matches word[${idx}]`,
      pseudocodeLine: 8,
    });

    // Check neighbors
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dr, dc] of directions) {
      if (dfs(r + dr, c + dc, idx + 1)) return true;
    }

    board[r][c] = temp; // backtrack
    steps.push({
      type: "boardFill",
      row: r,
      col: c,
      value: temp,
      narration: `Backtracking: unmarking (${r}, ${c})`,
      pseudocodeLine: 10,
    });

    return false;
  }

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (dfs(r, c, 0)) {
        steps.push(msg(`Word "${word}" successfully found!`, "Word found", 0));
        return steps;
      }
    }
  }

  steps.push(msg(`Word "${word}" not found in grid.`, "Word search failed", 0));
  return steps;
}
