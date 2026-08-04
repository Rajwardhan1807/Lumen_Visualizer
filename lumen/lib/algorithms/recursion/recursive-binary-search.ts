import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const recBinarySearchMeta: AlgorithmMeta = {
  name: "Recursive Binary Search", slug: "rec-binary-search", category: "recursion", difficulty: "beginner",
  tags: ["recursion", "searching", "binary-search"],
  description: "Recursive Binary Search is a divide-and-conquer algorithm that halves the search space each step by recursively invoking itself with updated low and high boundaries.",
  complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(log n)" },
  pseudocode: [
    "binarySearch(low, high):",
    "  if low > high: return -1",
    "  mid = (low + high) / 2",
    "  if arr[mid] == target: return mid",
    "  if arr[mid] > target: return binarySearch(low, mid - 1)",
    "  return binarySearch(mid + 1, high)",
  ],
  codeSnippets: {
    javascript: `function binarySearch(arr, target, low, high) {
  if (low > high) return -1;
  let mid = Math.floor((low + high) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] > target) return binarySearch(arr, target, low, mid - 1);
  return binarySearch(arr, target, mid + 1, high);
}`,
    python: `def binary_search(arr, target, low, high):
    if low > high: return -1
    mid = (low + high) // 2
    if arr[mid] == target: return mid
    elif arr[mid] > target:
        return binary_search(arr, target, low, mid - 1)
    else:
        return binary_search(arr, target, mid + 1, high)`,
    java: `int binarySearch(int[] arr, int target, int low, int high) {
    if (low > high) return -1;
    int mid = (low + high) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] > target) return binarySearch(arr, target, low, mid - 1);
    return binarySearch(arr, target, mid + 1, high);
}`,
    cpp: `int binarySearch(vector<int>& arr, int target, int low, int high) {
    if (low > high) return -1;
    int mid = (low + high) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] > target) return binarySearch(arr, target, low, mid - 1);
    return binarySearch(arr, target, mid + 1, high);
}`,
  },
  defaultInput: [2, 3, 4, 10, 40, 50, 60, 70, 80],
};

export function generateSteps(input: number[], target = 40): Step[] {
  const arr = Array.isArray(input) ? [...input].sort((a, b) => a - b) : [2, 3, 4, 10, 40, 50, 60, 70, 80];
  const steps: Step[] = [];
  const { compare, mark, markRange, msg } = createStepBuilder();
  let callIdCounter = 0;

  steps.push(msg(`Starting Recursive Binary Search for target ${target}`, "Search initialized", 0));

  function search(low: number, high: number, parentCallId: string | null, depth: number): number {
    const callId = `search-${callIdCounter++}`;
    steps.push({
      type: "call",
      fn: "binarySearch",
      args: { low, high },
      callId,
      parentCallId,
      depth,
      narration: `Calling binarySearch(low=${low}, high=${high})`,
      pseudocodeLine: 0,
    });

    if (low > high) {
      steps.push({
        type: "return",
        callId,
        value: -1,
        narration: `Base case: low (${low}) > high (${high}), target not found`,
        pseudocodeLine: 1,
      });
      return -1;
    }

    const mid = Math.floor((low + high) / 2);
    steps.push(mark(mid, "pivot", `Calculating mid = ${mid}, value = ${arr[mid]}`, 2));
    steps.push(compare([mid], `Comparing arr[mid]=${arr[mid]} with target ${target}`, 3));

    if (arr[mid] === target) {
      steps.push(mark(mid, "sorted", `Target found at index ${mid}!`, 3));
      steps.push({
        type: "return",
        callId,
        value: mid,
        narration: `Found target! Returning index ${mid}`,
        pseudocodeLine: 3,
      });
      return mid;
    }

    if (arr[mid] > target) {
      steps.push(markRange(mid, high, "eliminated", `arr[mid] > target, eliminating right half [${mid}..${high}]`, 4));
      const res = search(low, mid - 1, callId, depth + 1);
      steps.push({
        type: "return",
        callId,
        value: res,
        narration: `Returning result of left half search: ${res}`,
        pseudocodeLine: 4,
      });
      return res;
    } else {
      steps.push(markRange(low, mid, "eliminated", `arr[mid] < target, eliminating left half [${low}..${mid}]`, 5));
      const res = search(mid + 1, high, callId, depth + 1);
      steps.push({
        type: "return",
        callId,
        value: res,
        narration: `Returning result of right half search: ${res}`,
        pseudocodeLine: 5,
      });
      return res;
    }
  }

  search(0, arr.length - 1, null, 0);
  return steps;
}
