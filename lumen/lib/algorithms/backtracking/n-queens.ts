import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const nQueensMeta: AlgorithmMeta = {
  name: "N-Queens",
  slug: "n-queens",
  category: "backtracking",
  difficulty: "advanced",
  description: "Place N chess queens on an N×N board so no two queens threaten each other. Uses backtracking to explore placements and prune dead-end branches.",
  complexity: { best: "O(n!)", average: "O(n!)", worst: "O(n!)", space: "O(n)" },
  pseudocode: [
    "solve(board, row):",
    "  if row == n: solution found!",
    "  for col = 0 to n-1:",
    "    if isSafe(board, row, col):",
    "      place queen at (row, col)",
    "      solve(board, row + 1)",
    "      remove queen from (row, col)  // backtrack",
  ],
  codeSnippets: {
    javascript: `function nQueens(n) {
  const board = Array(n).fill(-1);
  const solutions = [];
  function solve(row) {
    if (row === n) { solutions.push([...board]); return; }
    for (let col = 0; col < n; col++) {
      if (isSafe(board, row, col, n)) {
        board[row] = col;
        solve(row + 1);
        board[row] = -1;
      }
    }
  }
  solve(0);
  return solutions;
}`,
    python: `def n_queens(n):
    board = [-1] * n
    solutions = []
    def solve(row):
        if row == n: solutions.append(board[:])
        for col in range(n):
            if is_safe(board, row, col, n):
                board[row] = col
                solve(row + 1)
                board[row] = -1
    solve(0); return solutions`,
    java: `void solve(int[] board, int row, int n, List<int[]> sols) {
    if (row == n) { sols.add(board.clone()); return; }
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col; solve(board, row+1, n, sols); board[row] = -1;
        }
    }
}`,
    cpp: `void solve(vector<int>& board, int row, int n, vector<vector<int>>& sols) {
    if (row == n) { sols.push_back(board); return; }
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col; solve(board, row+1, n, sols); board[row] = -1;
        }
    }
}`,
  },
  defaultInput: { n: 4 },
};

function isSafe(board: number[], row: number, col: number): boolean {
  for (let r = 0; r < row; r++) {
    if (board[r] === col) return false;
    if (Math.abs(board[r] - col) === Math.abs(r - row)) return false;
  }
  return true;
}

export function generateSteps(input: { n: number }): Step[] {
  const { n } = input;
  const steps: Step[] = [];
  const board: number[] = new Array(n).fill(-1);
  let nodeId = 0;

  function solve(row: number, parentId: string) {
    if (row === n) {
      steps.push({ type: "message", text: "Solution found!", narration: `🎉 Solution found! Queens at columns: [${board.join(", ")}]`, pseudocodeLine: 1, codeLine: { javascript: 5, python: 5, java: 2, cpp: 2 } });
      return;
    }

    for (let col = 0; col < n; col++) {
      const nid = `q-${nodeId++}`;
      steps.push({ type: "placeQueen", row, col, narration: `Trying queen at row ${row}, col ${col}`, pseudocodeLine: 2, codeLine: { javascript: 6, python: 6, java: 4, cpp: 4 } });

      if (isSafe(board, row, col)) {
        board[row] = col;
        steps.push({ type: "placeQueen", row, col, narration: `✓ Safe! Placing queen at (${row}, ${col})`, pseudocodeLine: 4, codeLine: { javascript: 8, python: 8, java: 5, cpp: 5 } });
        solve(row + 1, nid);
        board[row] = -1;
        steps.push({ type: "removeQueen", row, col, narration: `Backtracking: removing queen from (${row}, ${col})`, pseudocodeLine: 6, codeLine: { javascript: 10, python: 10, java: 6, cpp: 6 } });
      } else {
        steps.push({ type: "prune", nodeId: nid, narration: `✗ Conflict at (${row}, ${col}) — pruning this branch`, pseudocodeLine: 3, codeLine: { javascript: 7, python: 7, java: 4, cpp: 4 } });
      }
    }
  }

  solve(0, "root");
  return steps;
}
