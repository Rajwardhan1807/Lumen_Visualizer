import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const shellMeta: AlgorithmMeta = {
  name: "Shell Sort", slug: "shell-sort", category: "sorting", difficulty: "intermediate",
  tags: ["sorting", "comparison", "in-place", "unstable"],
  description: "Shell Sort is a generalization of insertion sort that allows the exchange of far apart elements. The distance between elements decreases after each pass, until it becomes 1 (which is standard insertion sort).",
  complexity: { best: "O(n log n)", average: "O(n^1.25) or O(n^1.5)", worst: "O(n²)", space: "O(1)" },
  pseudocode: [
    "for gap = n/2 down to 1:",
    "  for i = gap to n-1:",
    "    temp = arr[i]",
    "    j = i",
    "    while j >= gap and arr[j - gap] > temp:",
    "      arr[j] = arr[j - gap]",
    "      j -= gap",
    "    arr[j] = temp",
  ],
  codeSnippets: {
    javascript: `function shellSort(arr) {
  let n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
  }
  return arr;
}`,
    python: `def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2
    return arr`,
    java: `void shellSort(int[] arr) {
    int n = arr.length;
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`,
    cpp: `void shellSort(vector<int>& arr) {
    int n = arr.size();
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`,
  },
  defaultInput: [12, 34, 54, 2, 3],
};

export function generateSteps(input: number[]): Step[] {
  const arr = [...input];
  const n = arr.length;
  const steps: Step[] = [];
  const { compare, set, mark, msg } = createStepBuilder();

  for (let gap = Math.floor(n / 2); gap > 0; Math.floor(gap /= 2)) {
    steps.push(msg(`Changing gap size to ${gap}`, `Performing gap insertion sort with gap = ${gap}`, 0));
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      steps.push(mark(i, "pivot", `Selecting element at index ${i} (${temp}) with gap ${gap}`, 2));

      while (j >= gap) {
        steps.push(compare([j - gap, i], `Comparing arr[${j - gap}] = ${arr[j - gap]} with temp ${temp}`, 4));
        if (arr[j - gap] > temp) {
          steps.push(set(j, arr[j - gap], `Moving arr[${j - gap}] to index ${j}`, 5));
          arr[j] = arr[j - gap];
          j -= gap;
        } else {
          break;
        }
      }
      if (j !== i) {
        steps.push(set(j, temp, `Inserting temp ${temp} at index ${j}`, 7));
        arr[j] = temp;
      }
    }
  }

  for (let i = 0; i < n; i++) {
    steps.push(mark(i, "sorted", `Fully sorted!`, 0));
  }

  return steps;
}
