import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const jumpSearchMeta: AlgorithmMeta = {
  name: "Jump Search", slug: "jump-search", category: "searching", difficulty: "beginner",
  tags: ["searching", "comparison", "sorted"],
  description: "Jump Search works on sorted arrays. It checks fewer elements than linear search by jumping ahead by fixed steps (usually √n) and then performing a linear search backwards.",
  complexity: { best: "O(1)", average: "O(√n)", worst: "O(√n)", space: "O(1)" },
  pseudocode: [
    "step = floor(sqrt(n))",
    "prev = 0",
    "while arr[min(step, n)-1] < target:",
    "  prev = step; step += floor(sqrt(n))",
    "  if prev >= n: return -1",
    "while arr[prev] < target:",
    "  prev++",
    "  if prev == min(step, n): return -1",
    "if arr[prev] == target: return prev",
    "return -1",
  ],
  codeSnippets: {
    javascript: `function jumpSearch(arr, target) {
  let n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  if (arr[prev] === target) return prev;
  return -1;
}`,
    python: `import math
def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1
    if arr[prev] == target:
        return prev
    return -1`,
    java: `int jumpSearch(int[] arr, int target) {
    int n = arr.length;
    int step = (int)Math.floor(Math.sqrt(n));
    int prev = 0;
    while (arr[Math.min(step, n) - 1] < target) {
        prev = step;
        step += (int)Math.floor(Math.sqrt(n));
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        prev++;
        if (prev == Math.min(step, n)) return -1;
    }
    if (arr[prev] == target) return prev;
    return -1;
}`,
    cpp: `int jumpSearch(vector<int> arr, int target) {
    int n = arr.size();
    int step = sqrt(n);
    int prev = 0;
    while (arr[min(step, n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        prev++;
        if (prev == min(step, n)) return -1;
    }
    if (arr[prev] == target) return prev;
    return -1;
}`,
  },
  defaultInput: [2, 3, 4, 10, 40, 50, 60, 70, 80, 90, 100],
};

export function generateSteps(input: number[], target = 70): Step[] {
  const arr = [...input].sort((a, b) => a - b);
  const steps: Step[] = [];
  const { compare, mark, markRange, msg } = createStepBuilder();

  const n = arr.length;
  if (n === 0) return steps;

  const stepSize = Math.floor(Math.sqrt(n));
  let step = stepSize;
  let prev = 0;

  steps.push(msg(`Sorted array is [${arr.join(", ")}]. Starting Jump Search with step size = ${stepSize}.`, "Jump Search initialization", 0));

  while (arr[Math.min(step, n) - 1] < target) {
    const end = Math.min(step, n) - 1;
    steps.push(compare([end], `Comparing jump boundary element arr[${end}] = ${arr[end]} with target ${target}`, 2));
    steps.push(markRange(0, end, "eliminated", `Eliminated values from index 0 to ${end}`, 3));
    prev = step;
    step += stepSize;
    if (prev >= n) {
      steps.push(msg("Boundary reached, element not found.", "Search failed", 4));
      return steps;
    }
  }

  // Linear search in range
  const searchEnd = Math.min(step, n);
  steps.push(msg(`Performing linear search from index ${prev} to ${searchEnd - 1}`, "Sub-array linear search", 5));

  while (arr[prev] < target) {
    steps.push(compare([prev], `Comparing arr[${prev}] = ${arr[prev]} with target ${target}`, 5));
    steps.push(mark(prev, "eliminated", `Eliminating index ${prev}`, 6));
    prev++;
    if (prev === searchEnd) {
      steps.push(msg("Target not found in range.", "Search failed", 7));
      return steps;
    }
  }

  steps.push(compare([prev], `Checking final candidate arr[${prev}] = ${arr[prev]} with target ${target}`, 8));
  if (arr[prev] === target) {
    steps.push(mark(prev, "sorted", `Target ${target} found at index ${prev}!`, 8));
  } else {
    steps.push(msg(`Target not found in array`, "Search failed", 9));
  }

  return steps;
}
