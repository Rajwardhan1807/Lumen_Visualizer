import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const mergeSortRecMeta: AlgorithmMeta = {
  name: "Recursive Merge Sort", slug: "merge-sort-rec", category: "recursion", difficulty: "intermediate",
  tags: ["recursion", "sorting", "merge-sort"],
  description: "Recursive Merge Sort uses divide-and-conquer to split the array in half, recursively sort both halves, and then merge the sorted halves.",
  complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  pseudocode: [
    "mergeSort(l, r):",
    "  if l >= r: return",
    "  mid = (l + r) / 2",
    "  mergeSort(l, mid)",
    "  mergeSort(mid + 1, r)",
    "  merge(l, mid, r)",
  ],
  codeSnippets: {
    javascript: `function mergeSort(arr, l, r) {
  if (l >= r) return;
  let mid = Math.floor((l + r) / 2);
  mergeSort(arr, l, mid);
  mergeSort(arr, mid + 1, r);
  merge(arr, l, mid, r);
}`,
    python: `def merge_sort(arr, l, r):
    if l >= r: return
    mid = (l + r) // 2
    merge_sort(arr, l, mid)
    merge_sort(arr, mid + 1, r)
    merge(arr, l, mid, r)`,
    java: `void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}`,
    cpp: `void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}`,
  },
  defaultInput: [38, 27, 43, 3, 9, 82, 10],
};

export function generateSteps(input: number[]): Step[] {
  const arr = Array.isArray(input) ? [...input] : [38, 27, 43, 3, 9, 82, 10];
  const steps: Step[] = [];
  const { set, compare, mark, msg } = createStepBuilder();
  let callIdCounter = 0;

  steps.push(msg("Starting Recursive Merge Sort...", "Merge Sort recursion started", 0));

  function solve(l: number, r: number, parentCallId: string | null, depth: number) {
    const callId = `merge-${callIdCounter++}`;
    steps.push({
      type: "call",
      fn: "mergeSort",
      args: { l, r },
      callId,
      parentCallId,
      depth,
      narration: `Calling mergeSort(l=${l}, r=${r})`,
      pseudocodeLine: 0,
    });

    if (l >= r) {
      steps.push({
        type: "return",
        callId,
        value: null,
        narration: `Base case reached: l (${l}) >= r (${r})`,
        pseudocodeLine: 1,
      });
      return;
    }

    const mid = Math.floor((l + r) / 2);
    solve(l, mid, callId, depth + 1);
    solve(mid + 1, r, callId, depth + 1);

    // Merge logic
    const temp: number[] = [];
    let i = l, j = mid + 1;
    while (i <= mid && j <= r) {
      steps.push(compare([i, j], `Comparing values at index ${i} (${arr[i]}) and index ${j} (${arr[j]}) during merge`, 5));
      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }
    while (i <= mid) temp.push(arr[i++]);
    while (j <= r) temp.push(arr[j++]);

    for (let k = 0; k < temp.length; k++) {
      arr[l + k] = temp[k];
      steps.push(set(l + k, temp[k], `Merging back sorted element ${temp[k]} to index ${l + k}`, 5));
    }

    steps.push({
      type: "return",
      callId,
      value: null,
      narration: `Merged sub-array [${l}..${r}] successfully`,
      pseudocodeLine: 5,
    });
  }

  solve(0, arr.length - 1, null, 0);
  for (let i = 0; i < arr.length; i++) {
    steps.push(mark(i, "sorted", "Fully sorted!", 0));
  }
  return steps;
}
