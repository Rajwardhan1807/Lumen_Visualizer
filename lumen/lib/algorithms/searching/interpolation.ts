import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const interpolationSearchMeta: AlgorithmMeta = {
  name: "Interpolation Search", slug: "interpolation-search", category: "searching", difficulty: "intermediate",
  tags: ["searching", "comparison", "sorted", "math"],
  description: "Interpolation Search is an improved variant of Binary Search for sorted arrays of uniformly distributed values. It estimates the target position using interpolation formula, achieving average-case O(log log n) time.",
  complexity: { best: "O(1)", average: "O(log log n)", worst: "O(n)", space: "O(1)" },
  pseudocode: [
    "low = 0, high = n-1",
    "while low <= high and target >= arr[low] and target <= arr[high]:",
    "  pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])",
    "  if arr[pos] == target: return pos",
    "  if arr[pos] < target: low = pos + 1",
    "  else: high = pos - 1",
    "return -1",
  ],
  codeSnippets: {
    javascript: `function interpolationSearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }
    let pos = low + Math.floor(
      ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
    );
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
    python: `def interpolation_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high and arr[low] <= target <= arr[high]:
        if low == high:
            if arr[low] == target: return low
            return -1
        pos = low + int(((target - arr[low]) * (high - low)) // (arr[high] - arr[low]))
        if arr[pos] == target:
            return pos
        if arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1`,
    java: `int interpolationSearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low == high) {
            if (arr[low] == target) return low;
            return -1;
        }
        int pos = low + (((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
    cpp: `int interpolationSearch(vector<int> arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low == high) {
            if (arr[low] == target) return low;
            return -1;
        }
        int pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low]);
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
  },
  defaultInput: [10, 12, 13, 16, 18, 19, 20, 21, 22, 23, 24, 33, 35, 42, 47],
};

export function generateSteps(input: number[], target = 33): Step[] {
  const arr = [...input].sort((a, b) => a - b);
  const steps: Step[] = [];
  const { compare, mark, markRange, msg } = createStepBuilder();

  let low = 0, high = arr.length - 1;
  steps.push(msg(`Sorted array is [${arr.join(", ")}]. Starting Interpolation Search for target ${target}`, "Search initialization", 0));

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      steps.push(compare([low], `Checking final element arr[${low}] = ${arr[low]}`, 1));
      if (arr[low] === target) {
        steps.push(mark(low, "sorted", `Target ${target} found at index ${low}!`, 1));
      } else {
        steps.push(msg(`Target ${target} not found in array`, "Search failed", 1));
      }
      return steps;
    }

    const divisor = arr[high] - arr[low];
    if (divisor === 0) {
      steps.push(msg("Range denominator is 0. Check duplicate range elements.", "Denominator is zero", 2));
      if (arr[low] === target) {
        steps.push(mark(low, "sorted", `Target ${target} found at index ${low}!`, 2));
      }
      return steps;
    }

    const pos = low + Math.floor(((target - arr[low]) * (high - low)) / divisor);

    if (pos < 0 || pos >= arr.length) {
      steps.push(msg(`Estimated position ${pos} is out of array bounds.`, "Position out of bounds", 2));
      break;
    }

    steps.push(mark(pos, "pivot", `Interpolated position calculated: pos = ${pos}, arr[pos] = ${arr[pos]}`, 2));

    if (arr[pos] === target) {
      steps.push(mark(pos, "sorted", `Target ${target} found at index ${pos}!`, 3));
      return steps;
    }

    if (arr[pos] < target) {
      steps.push(markRange(low, pos, "eliminated", `arr[pos] < target, eliminating index ${low} to ${pos}`, 4));
      low = pos + 1;
    } else {
      steps.push(markRange(pos, high, "eliminated", `arr[pos] > target, eliminating index ${pos} to ${high}`, 5));
      high = pos - 1;
    }
  }

  steps.push(msg(`Target ${target} not found in array`, "Search failed", 6));
  return steps;
}
