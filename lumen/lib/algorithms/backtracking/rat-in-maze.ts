import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const ratInMazeMeta: AlgorithmMeta = {
  name: "Rat in a Maze", slug: "rat-in-maze", category: "backtracking", difficulty: "intermediate",
  tags: ["backtracking", "maze-solving", "paths"],
  description: "A rat starts from (0,0) and wants to reach (N-1,N-1) in an NxN grid. It can only move Down and Right. 0 denotes blockages, 1 denotes path.",
  complexity: { best: "O(2^(n*n))", average: "O(2^(n*n))", worst: "O(2^(n*n))", space: "O(n²)" },
  pseudocode: [
    "solveMaze(x, y):",
    "  if x, y is destination: return true",
    "  if isSafe(x, y):",
    "    mark (x, y) in solution path",
    "    if solveMaze(x + 1, y) == true: return true",
    "    if solveMaze(x, y + 1) == true: return true",
    "    unmark (x, y) // backtrack",
  ],
  codeSnippets: {
    javascript: `function solveMaze(maze, x, y, sol) {
  let N = maze.length;
  if (x === N - 1 && y === N - 1) {
    sol[x][y] = 1;
    return true;
  }
  if (isSafe(maze, x, y)) {
    sol[x][y] = 1;
    if (solveMaze(maze, x + 1, y, sol)) return true;
    if (solveMaze(maze, x, y + 1, sol)) return true;
    sol[x][y] = 0;
    return false;
  }
  return false;
}`,
    python: `def solve_maze(maze, x, y, sol):
    N = len(maze)
    if x == N - 1 and y == N - 1:
        sol[x][y] = 1
        return True
    if is_safe(maze, x, y):
        sol[x][y] = 1
        if solve_maze(maze, x + 1, y, sol): return True
        if solve_maze(maze, x, y + 1, sol): return True
        sol[x][y] = 0
        return False
    return False`,
    java: `boolean solveMaze(int[][] maze, int x, int y, int[][] sol) {
    int N = maze.length;
    if (x == N - 1 && y == N - 1) {
        sol[x][y] = 1;
        return true;
    }
    if (isSafe(maze, x, y)) {
        sol[x][y] = 1;
        if (solveMaze(maze, x + 1, y, sol)) return true;
        if (solveMaze(maze, x, y + 1, sol)) return true;
        sol[x][y] = 0;
        return false;
    }
    return false;
}`,
    cpp: `bool solveMaze(vector<vector<int>>& maze, int x, int y, vector<vector<int>>& sol) {
    int N = maze.size();
    if (x == N - 1 && y == N - 1) {
        sol[x][y] = 1;
        return true;
    }
    if (isSafe(maze, x, y)) {
        sol[x][y] = 1;
        if (solveMaze(maze, x + 1, y, sol)) return true;
        if (solveMaze(maze, x, y + 1, sol)) return true;
        sol[x][y] = 0;
        return false;
    }
    return false;
}`,
  },
  defaultInput: [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ],
};

export function generateSteps(input: number[][]): Step[] {
  const maze = input && Array.isArray(input) ? input.map((row) => [...row]) : ratInMazeMeta.defaultInput as number[][];
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  const N = maze.length;
  const sol = Array.from({ length: N }, () => new Array(N).fill(0));

  steps.push(msg("Solving Rat in a Maze", "Backtracking solver started", 0));

  function solve(x: number, y: number): boolean {
    if (x === N - 1 && y === N - 1) {
      sol[x][y] = 1;
      steps.push({
        type: "boardFill",
        row: x,
        col: y,
        value: "🐭",
        narration: `Rat reached destination at (${x}, ${y})!`,
        pseudocodeLine: 1,
      });
      return true;
    }

    if (x >= 0 && x < N && y >= 0 && y < N && maze[x][y] === 1) {
      sol[x][y] = 1;
      steps.push({
        type: "boardFill",
        row: x,
        col: y,
        value: "🐾",
        narration: `Rat exploring path at (${x}, ${y})`,
        pseudocodeLine: 3,
      });

      steps.push({
        type: "boardMark",
        row: x,
        col: y,
        state: "comparing",
        narration: `Attempting Down move from (${x}, ${y}) to (${x + 1}, ${y})`,
        pseudocodeLine: 4,
      });
      if (solve(x + 1, y)) return true;

      steps.push({
        type: "boardMark",
        row: x,
        col: y,
        state: "comparing",
        narration: `Attempting Right move from (${x}, ${y}) to (${x}, ${y + 1})`,
        pseudocodeLine: 5,
      });
      if (solve(x, y + 1)) return true;

      sol[x][y] = 0;
      steps.push({
        type: "boardFill",
        row: x,
        col: y,
        value: " ",
        narration: `Backtracking from (${x}, ${y})`,
        pseudocodeLine: 6,
      });
    }

    return false;
  }

  solve(0, 0);
  steps.push(msg("Path finding completed.", "Backtracking execution ended", 0));
  return steps;
}
