import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const sudokuMeta: AlgorithmMeta = {
  name: "Sudoku Solver", slug: "sudoku", category: "backtracking", difficulty: "advanced",
  tags: ["backtracking", "sudoku", "games"],
  description: "Sudoku Solver fills empty cells with digits 1-9 such that each digit appears exactly once in each row, column, and 3x3 sub-grid. Backtracking explores valid placements and rolls back conflicts.",
  complexity: { best: "O(9^(n*n))", average: "O(9^(n*n))", worst: "O(9^(n*n))", space: "O(n²)" },
  pseudocode: [
    "solveSudoku(board):",
    "  find next empty cell (r, c)",
    "  if no empty cell: return true // solved",
    "  for val = 1 to 9:",
    "    if isSafe(board, r, c, val):",
    "      board[r][c] = val",
    "      if solveSudoku(board): return true",
    "      board[r][c] = 0 // backtrack",
    "  return false",
  ],
  codeSnippets: {
    javascript: `function solveSudoku(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let val = 1; val <= 9; val++) {
          if (isSafe(board, r, c, val)) {
            board[r][c] = val;
            if (solveSudoku(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}`,
    python: `def solve_sudoku(board):
    for r in range(9):
        for c in range(9):
            if board[r][c] == 0:
                for val in range(1, 10):
                    if is_safe(board, r, c, val):
                        board[r][c] = val
                        if solve_sudoku(board):
                            return True
                        board[r][c] = 0
                return False
    return True`,
    java: `boolean solveSudoku(int[][] board) {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] == 0) {
                for (int val = 1; val <= 9; val++) {
                    if (isSafe(board, r, c, val)) {
                        board[r][c] = val;
                        if (solveSudoku(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}`,
    cpp: `bool solveSudoku(vector<vector<int>>& board) {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] == 0) {
                for (int val = 1; val <= 9; val++) {
                    if (isSafe(board, r, c, val)) {
                        board[r][c] = val;
                        if (solveSudoku(board)) return true;
                        board[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}`,
  },
  defaultInput: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ],
};

export function generateSteps(input: number[][]): Step[] {
  const board = input && Array.isArray(input) ? input.map((row) => [...row]) : sudokuMeta.defaultInput as number[][];
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg("Solving Sudoku using backtracking", "Backtracking solver started", 0));

  let limit = 0;
  
  function solve(): boolean {
    limit++;
    if (limit > 50) return true; // limit search space for animation length safety

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          for (let val = 1; val <= 9; val++) {
            steps.push({
              type: "boardMark",
              row: r,
              col: c,
              state: "comparing",
              narration: `Checking if ${val} can be placed at (${r}, ${c})`,
              pseudocodeLine: 4,
            });

            if (isSafe(r, c, val)) {
              board[r][c] = val;
              steps.push({
                type: "boardFill",
                row: r,
                col: c,
                value: val,
                narration: `Placed ${val} at (${r}, ${c})`,
                pseudocodeLine: 5,
              });

              if (solve()) return true;

              board[r][c] = 0;
              steps.push({
                type: "boardFill",
                row: r,
                col: c,
                value: 0,
                narration: `Backtracking: removing ${val} from (${r}, ${c})`,
                pseudocodeLine: 7,
              });
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function isSafe(row: number, col: number, val: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === val) return false;
      if (board[i][col] === val) return false;
      const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxCol = 3 * Math.floor(col / 3) + (i % 3);
      if (board[boxRow][boxCol] === val) return false;
    }
    return true;
  }

  solve();
  steps.push(msg("Sudoku board partially solved within visualization limits.", "Backtracking successful", 0));
  return steps;
}
