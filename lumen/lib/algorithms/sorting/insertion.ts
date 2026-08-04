import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const insertionMeta: AlgorithmMeta = {
  name: "Insertion Sort",
  slug: "insertion-sort",
  category: "sorting",
  difficulty: "beginner",
  description:
    "Insertion Sort builds a sorted array one element at a time by picking each element and inserting it into its correct position among already-sorted elements — like sorting playing cards in your hand.",
  complexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  pseudocode: [
    "for i = 1 to n-1:",
    "  key = arr[i]",
    "  j = i - 1",
    "  while j >= 0 and arr[j] > key:",
    "    arr[j+1] = arr[j]",
    "    j = j - 1",
    "  arr[j+1] = key",
  ],
  codeSnippets: {
    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    java: `public static int[] insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
    cpp: `vector<int> insertionSort(vector<int> arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
  },
  defaultInput: [64, 34, 25, 12, 22, 11, 90],
};

export function generateSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [];

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      type: "mark",
      index: i,
      state: "pivot",
      narration: `Picking key = arr[${i}] = ${key}`,
      pseudocodeLine: 1,
      codeLine: { javascript: 3, python: 3, java: 3, cpp: 3 },
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        type: "compare",
        indices: [j, i],
        narration: `arr[${j}] = ${arr[j]} > key (${key}), shifting right`,
        pseudocodeLine: 3,
        codeLine: { javascript: 5, python: 5, java: 5, cpp: 5 },
      });

      steps.push({
        type: "set",
        index: j + 1,
        value: arr[j],
        narration: `Shifting arr[${j}] = ${arr[j]} to position ${j + 1}`,
        pseudocodeLine: 4,
        codeLine: { javascript: 6, python: 6, java: 6, cpp: 6 },
      });

      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
    steps.push({
      type: "set",
      index: j + 1,
      value: key,
      narration: `Placing key ${key} at position ${j + 1}`,
      pseudocodeLine: 6,
      codeLine: { javascript: 9, python: 8, java: 9, cpp: 9 },
    });

    // Mark sorted portion
    steps.push({
      type: "markRange",
      start: 0,
      end: i,
      state: "sorted",
      narration: `Positions 0 to ${i} are now sorted`,
      pseudocodeLine: 0,
      codeLine: { javascript: 2, python: 2, java: 2, cpp: 2 },
    });
  }

  return steps;
}
