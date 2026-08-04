import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const quickSortRecMeta: AlgorithmMeta = {
  name: "Recursive Quick Sort", slug: "quick-sort-rec", category: "recursion", difficulty: "intermediate",
  tags: ["recursion", "sorting", "quick-sort"],
  description: "Recursive Quick Sort partitions the array around a pivot element and recursively sorts the sub-arrays.",
  complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
  pseudocode: [
    "quickSort(l, r):",
    "  if l >= r: return",
    "  p = partition(l, r)",
    "  quickSort(l, p - 1)",
    "  quickSort(p + 1, r)",
  ],
  codeSnippets: {
    javascript: `function quickSort(arr, l, r) {
  if (l >= r) return;
  let p = partition(arr, l, r);
  quickSort(arr, l, p - 1);
  quickSort(arr, p + 1, r);
}`,
    python: `def quick_sort(arr, l, r):
    if l >= r: return
    p = partition(arr, l, r)
    quick_sort(arr, l, p - 1)
    quick_sort(arr, p + 1, r)`,
    java: `void quickSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int p = partition(arr, l, r);
    quickSort(arr, l, p - 1);
    quickSort(arr, p + 1, r);
}`,
    cpp: `void quickSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int p = partition(arr, l, r);
    quickSort(arr, l, p - 1);
    quickSort(arr, p + 1, r);
}`,
  },
  defaultInput: [10, 80, 30, 90, 40, 50, 70],
};

export function generateSteps(input: number[]): Step[] {
  const arr = Array.isArray(input) ? [...input] : [10, 80, 30, 90, 40, 50, 70];
  const steps: Step[] = [];
  const { swap, compare, mark, msg } = createStepBuilder();
  let callIdCounter = 0;

  steps.push(msg("Starting Recursive Quick Sort...", "Quick Sort recursion started", 0));

  function solve(l: number, r: number, parentCallId: string | null, depth: number) {
    const callId = `quick-${callIdCounter++}`;
    steps.push({
      type: "call",
      fn: "quickSort",
      args: { l, r },
      callId,
      parentCallId,
      depth,
      narration: `Calling quickSort(l=${l}, r=${r})`,
      pseudocodeLine: 0,
    });

    if (l >= r) {
      if (l === r) steps.push(mark(l, "sorted", `Element at index ${l} is sorted`, 1));
      steps.push({
        type: "return",
        callId,
        value: null,
        narration: `Base case: sub-array size <= 1`,
        pseudocodeLine: 1,
      });
      return;
    }

    // Partition
    const pivotVal = arr[r];
    steps.push(mark(r, "pivot", `Choosing rightmost element arr[${r}] = ${pivotVal} as pivot`, 2));
    let i = l - 1;

    for (let j = l; j < r; j++) {
      steps.push(compare([j, r], `Comparing arr[${j}] = ${arr[j]} with pivot ${pivotVal}`, 2));
      if (arr[j] < pivotVal) {
        i++;
        steps.push(swap([i, j], `Swapping arr[${i}] and arr[${j}]`, 2));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    const pivotIdx = i + 1;
    steps.push(swap([pivotIdx, r], `Placing pivot ${pivotVal} at its correct position index ${pivotIdx}`, 2));
    [arr[pivotIdx], arr[r]] = [arr[r], arr[pivotIdx]];
    steps.push(mark(pivotIdx, "sorted", `Pivot at index ${pivotIdx} is in its final position`, 2));

    solve(l, pivotIdx - 1, callId, depth + 1);
    solve(pivotIdx + 1, r, callId, depth + 1);

    steps.push({
      type: "return",
      callId,
      value: null,
      narration: `quickSort(l=${l}, r=${r}) partition complete`,
      pseudocodeLine: 4,
    });
  }

  solve(0, arr.length - 1, null, 0);
  for (let i = 0; i < arr.length; i++) {
    steps.push(mark(i, "sorted", "Fully sorted!", 0));
  }
  return steps;
}
