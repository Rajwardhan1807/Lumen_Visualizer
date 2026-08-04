import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const bubbleMeta: AlgorithmMeta = {
  name: "Bubble Sort", slug: "bubble-sort", category: "sorting", difficulty: "beginner",
  tags: ["sorting", "comparison", "in-place", "stable"],
  description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order. The pass is repeated until the list is sorted. Named for the way smaller elements 'bubble' to the top.",
  complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  pseudocode: [
    "for i = 0 to n-1:",
    "  swapped = false",
    "  for j = 0 to n-i-2:",
    "    if arr[j] > arr[j+1]:",
    "      swap(arr[j], arr[j+1])",
    "      swapped = true",
    "  if not swapped: break",
    "return arr",
  ],
  codeSnippets: {
    javascript: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
    java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        bool swapped = false;
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  },
  defaultInput: [64, 34, 25, 12, 22, 11, 90],
};

export function generateSteps(input: number[]): Step[] {
  const arr = [...input];
  const n = arr.length;
  const steps: Step[] = [];
  const { compare, swap, mark, msg } = createStepBuilder();

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push(compare([j, j + 1], `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}`, 3));
      if (arr[j] > arr[j + 1]) {
        steps.push(swap([j, j + 1], `Swapping ${arr[j]} and ${arr[j+1]}`, 4));
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    steps.push(mark(n - i - 1, "sorted", `Position ${n-i-1} is sorted`, 0));
    if (!swapped) {
      steps.push(msg("No swaps — array is sorted early!", "Early exit: no swaps in pass", "success"));
      break;
    }
  }
  steps.push(mark(0, "sorted", "Array fully sorted!", 7));
  return steps;
}
