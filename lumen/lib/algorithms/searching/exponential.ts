import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const exponentialSearchMeta: AlgorithmMeta = {
  name: "Exponential Search", slug: "exponential-search", category: "searching", difficulty: "intermediate",
  tags: ["searching", "comparison", "sorted"],
  description: "Exponential Search is useful for searching sorted unbounded arrays. It works by finding the range where the target resides (using exponential powers of 2) and then performing a binary search within that range.",
  complexity: { best: "O(1)", average: "O(log i)", worst: "O(log i)", space: "O(1)" },
  pseudocode: [
    "if arr[0] == target: return 0",
    "i = 1",
    "while i < n and arr[i] <= target:",
    "  i = i * 2",
    "do binarySearch(arr, target, i/2, min(i, n-1))",
  ],
  codeSnippets: {
    javascript: `function exponentialSearch(arr, target) {
  let n = arr.length;
  if (n === 0) return -1;
  if (arr[0] === target) return 0;
  let i = 1;
  while (i < n && arr[i] <= target) {
    i = i * 2;
  }
  return binarySearchRange(arr, target, Math.floor(i / 2), Math.min(i, n - 1));
}`,
    python: `def exponential_search(arr, target):
    n = len(arr)
    if n == 0: return -1
    if arr[0] == target: return 0
    i = 1
    while i < n and arr[i] <= target:
        i = i * 2
    return binary_search_range(arr, target, i // 2, min(i, n - 1))`,
    java: `int exponentialSearch(int[] arr, int target) {
    int n = arr.length;
    if (n == 0) return -1;
    if (arr[0] == target) return 0;
    int i = 1;
    while (i < n && arr[i] <= target) i = i * 2;
    return binarySearchRange(arr, target, i / 2, Math.min(i, n - 1));
}`,
    cpp: `int exponentialSearch(vector<int> arr, int target) {
    int n = arr.size();
    if (n == 0) return -1;
    if (arr[0] == target) return 0;
    int i = 1;
    while (i < n && arr[i] <= target) i = i * 2;
    return binarySearchRange(arr, target, i / 2, min(i, n - 1));
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

  steps.push(compare([0], `Checking first element arr[0] = ${arr[0]}`, 0));
  if (arr[0] === target) {
    steps.push(mark(0, "sorted", `Target ${target} found at index 0!`, 0));
    return steps;
  }

  let i = 1;
  while (i < n && arr[i] <= target) {
    steps.push(compare([i], `Comparing arr[${i}] = ${arr[i]} with target ${target}`, 2));
    steps.push(markRange(0, i - 1, "eliminated", `Eliminating index 0 to ${i - 1}`, 3));
    i *= 2;
  }

  const low = Math.floor(i / 2);
  const high = Math.min(i, n - 1);
  steps.push(msg(`Target range is between index ${low} and ${high}. Doing binary search in range.`, "Initiating binary search sub-range", 4));

  // Binary search implementation
  let l = low, h = high;
  while (l <= h) {
    const mid = Math.floor((l + h) / 2);
    steps.push(mark(mid, "pivot", `mid = ${mid}, arr[mid] = ${arr[mid]}. Search range: [${l}..${h}]`, 4));

    if (arr[mid] === target) {
      steps.push(mark(mid, "sorted", `Found! arr[${mid}] = ${arr[mid]} = target ${target}`, 4));
      return steps;
    }

    if (arr[mid] < target) {
      steps.push(markRange(l, mid, "eliminated", `arr[${mid}] < ${target}, eliminating left half [${l}..${mid}]`, 4));
      l = mid + 1;
    } else {
      steps.push(markRange(mid, h, "eliminated", `arr[${mid}] > ${target}, eliminating right half [${mid}..${h}]`, 4));
      h = mid - 1;
    }
  }

  steps.push(msg(`Target ${target} not found in array`, "Search failed", 4));
  return steps;
}
