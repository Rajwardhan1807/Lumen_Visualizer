import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const linearSearchMeta: AlgorithmMeta = {
  name: "Linear Search",
  slug: "linear-search",
  category: "searching",
  difficulty: "beginner",
  description: "Linear Search scans each element from left to right until the target is found or the array is exhausted. Simple and works on unsorted arrays — O(n) time.",
  complexity: { best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
  pseudocode: ["for i = 0 to n-1:", "  if arr[i] == target:", "    return i", "return -1"],
  codeSnippets: {
    javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1`,
    java: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++)
        if (arr[i] == target) return i;
    return -1;
}`,
    cpp: `int linearSearch(vector<int> arr, int target) {
    for (int i = 0; i < arr.size(); i++)
        if (arr[i] == target) return i;
    return -1;
}`,
  },
  defaultInput: [2, 3, 4, 10, 40],
};

export function generateSteps(input: number[], target = 10): Step[] {
  const steps: Step[] = [];
  for (let i = 0; i < input.length; i++) {
    steps.push({ type: "compare", indices: [i], narration: `Checking arr[${i}] = ${input[i]}${input[i] === target ? " — FOUND!" : " ≠ " + target}`, pseudocodeLine: 1, codeLine: { javascript: 3, python: 3, java: 2, cpp: 2 } });
    if (input[i] === target) {
      steps.push({ type: "mark", index: i, state: "sorted", narration: `Target ${target} found at index ${i}!`, pseudocodeLine: 2, codeLine: { javascript: 3, python: 4, java: 2, cpp: 2 } });
      return steps;
    }
    steps.push({ type: "mark", index: i, state: "eliminated", narration: `${input[i]} ≠ ${target}, continuing...`, pseudocodeLine: 0, codeLine: { javascript: 2, python: 2, java: 2, cpp: 2 } });
  }
  steps.push({ type: "message", text: `Target ${target} not found`, narration: `Target ${target} not found in the array`, pseudocodeLine: 3, codeLine: { javascript: 5, python: 5, java: 3, cpp: 3 } });
  return steps;
}

export const binarySearchMeta: AlgorithmMeta = {
  name: "Binary Search",
  slug: "binary-search",
  category: "searching",
  difficulty: "beginner",
  description: "Binary Search halves the search space each step by comparing the target with the middle element of a sorted array. O(log n) time — extremely efficient for large datasets.",
  complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)" },
  pseudocode: ["low=0, high=n-1", "while low <= high:", "  mid = (low+high)/2", "  if arr[mid] == target: return mid", "  if arr[mid] < target: low = mid+1", "  else: high = mid-1", "return -1"],
  codeSnippets: {
    javascript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`,
    java: `public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    cpp: `int binarySearch(vector<int> arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
  },
  defaultInput: [2, 3, 4, 10, 40, 60, 80, 100],
};

export function generateBinarySearchSteps(input: number[], target = 10): Step[] {
  const arr = [...input].sort((a, b) => a - b);
  const steps: Step[] = [];
  let low = 0, high = arr.length - 1;

  steps.push({ type: "message", text: "Array must be sorted — using sorted version", narration: "Binary search requires a sorted array", pseudocodeLine: 0, codeLine: { javascript: 2, python: 2, java: 2, cpp: 2 } });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ type: "mark", index: mid, state: "pivot", narration: `mid = ${mid}, arr[mid] = ${arr[mid]}. Search range: [${low}..${high}]`, pseudocodeLine: 2, codeLine: { javascript: 4, python: 4, java: 4, cpp: 4 } });

    if (arr[mid] === target) {
      steps.push({ type: "mark", index: mid, state: "sorted", narration: `Found! arr[${mid}] = ${arr[mid]} = target ${target}`, pseudocodeLine: 3, codeLine: { javascript: 5, python: 5, java: 5, cpp: 5 } });
      return steps;
    }

    if (arr[mid] < target) {
      steps.push({ type: "markRange", start: 0, end: mid, state: "eliminated", narration: `arr[${mid}]=${arr[mid]} < ${target}, eliminating left half [0..${mid}]`, pseudocodeLine: 4, codeLine: { javascript: 6, python: 6, java: 6, cpp: 6 } });
      low = mid + 1;
    } else {
      steps.push({ type: "markRange", start: mid, end: arr.length - 1, state: "eliminated", narration: `arr[${mid}]=${arr[mid]} > ${target}, eliminating right half [${mid}..${arr.length - 1}]`, pseudocodeLine: 5, codeLine: { javascript: 7, python: 7, java: 7, cpp: 7 } });
      high = mid - 1;
    }
  }

  steps.push({ type: "message", text: `${target} not found`, narration: `Target ${target} not in array`, pseudocodeLine: 6, codeLine: { javascript: 9, python: 9, java: 9, cpp: 9 } });
  return steps;
}
