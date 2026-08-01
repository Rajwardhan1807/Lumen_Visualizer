import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const selectionMeta: AlgorithmMeta = {
  name: "Selection Sort", slug: "selection-sort", category: "sorting", difficulty: "beginner",
  tags: ["sorting", "comparison", "in-place", "unstable"],
  description: "Selection Sort divides the array into sorted and unsorted parts. It repeatedly finds the minimum element from the unsorted portion and moves it to the sorted portion.",
  complexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  pseudocode: [
    "for i = 0 to n-1:",
    "  minIdx = i",
    "  for j = i+1 to n-1:",
    "    if arr[j] < arr[minIdx]:",
    "      minIdx = j",
    "  swap(arr[i], arr[minIdx])",
    "  mark arr[i] as sorted",
  ],
  codeSnippets: {
    javascript: `function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  return arr;
}`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    java: `void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length-1; i++) {
        int min = i;
        for (int j = i+1; j < arr.length; j++)
            if (arr[j] < arr[min]) min = j;
        int t = arr[min]; arr[min] = arr[i]; arr[i] = t;
    }
}`,
    cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        int min = i;
        for (int j = i+1; j < n; j++)
            if (arr[j] < arr[min]) min = j;
        swap(arr[i], arr[min]);
    }
}`,
  },
  defaultInput: [64, 25, 12, 22, 11],
};

export function generateSteps(input: number[]): Step[] {
  const arr = [...input];
  const n = arr.length;
  const steps: Step[] = [];
  const { compare, swap, mark } = createStepBuilder();

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push(mark(i, "pivot", `Finding minimum in unsorted portion [${i}..${n-1}]`, 1));
    for (let j = i + 1; j < n; j++) {
      steps.push(compare([j, minIdx], `Is arr[${j}]=${arr[j]} < arr[${minIdx}]=${arr[minIdx]}?`, 3));
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push(mark(minIdx, "current", `New minimum at index ${minIdx}: ${arr[minIdx]}`, 4));
      }
    }
    if (minIdx !== i) {
      steps.push(swap([i, minIdx], `Placing minimum ${arr[minIdx]} at position ${i}`, 5));
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    steps.push(mark(i, "sorted", `arr[${i}]=${arr[i]} is in its final position`, 6));
  }
  steps.push(mark(n - 1, "sorted", "Array fully sorted!", 0));
  return steps;
}
