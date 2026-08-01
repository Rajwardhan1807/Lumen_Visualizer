import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const quickMeta: AlgorithmMeta = {
  name: "Quick Sort",
  slug: "quick-sort",
  category: "sorting",
  difficulty: "intermediate",
  description:
    "Quick Sort picks a pivot element, partitions the array around it (elements smaller go left, larger go right), then recursively sorts each partition. Average O(n log n) with great cache performance.",
  complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
  pseudocode: [
    "quickSort(arr, low, high):",
    "  if low < high:",
    "    pivot = partition(arr, low, high)",
    "    quickSort(arr, low, pivot-1)",
    "    quickSort(arr, pivot+1, high)",
    "partition(arr, low, high):",
    "  pivot = arr[high]",
    "  i = low - 1",
    "  for j = low to high-1:",
    "    if arr[j] <= pivot: swap(arr[++i], arr[j])",
    "  swap(arr[i+1], arr[high])",
    "  return i+1",
  ],
  codeSnippets: {
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    python: `def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`,
    java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
  },
  defaultInput: [10, 80, 30, 90, 40, 50, 70],
};

export function generateSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [];
  const sortedIndices = new Set<number>();

  function partition(low: number, high: number): number {
    const pivotVal = arr[high];
    steps.push({
      type: "mark",
      index: high,
      state: "pivot",
      narration: `Pivot selected: arr[${high}] = ${pivotVal}`,
      pseudocodeLine: 6,
      codeLine: { javascript: 10, python: 8, java: 8, cpp: 8 },
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({
        type: "compare",
        indices: [j, high],
        narration: `Comparing arr[${j}] = ${arr[j]} with pivot ${pivotVal}`,
        pseudocodeLine: 8,
        codeLine: { javascript: 13, python: 11, java: 10, cpp: 10 },
      });

      if (arr[j] <= pivotVal) {
        i++;
        if (i !== j) {
          steps.push({
            type: "swap",
            indices: [i, j],
            narration: `arr[${j}] = ${arr[j]} ≤ pivot, swapping with arr[${i}] = ${arr[i]}`,
            pseudocodeLine: 9,
            codeLine: { javascript: 15, python: 13, java: 11, cpp: 11 },
          });
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }

    steps.push({
      type: "swap",
      indices: [i + 1, high],
      narration: `Placing pivot ${pivotVal} at its final position ${i + 1}`,
      pseudocodeLine: 10,
      codeLine: { javascript: 18, python: 14, java: 13, cpp: 13 },
    });
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low >= high) {
      if (low === high && !sortedIndices.has(low)) {
        sortedIndices.add(low);
        steps.push({
          type: "mark",
          index: low,
          state: "sorted",
          narration: `Single element arr[${low}] = ${arr[low]} is in place`,
          pseudocodeLine: 1,
          codeLine: { javascript: 2, python: 2, java: 2, cpp: 2 },
        });
      }
      return;
    }

    const pi = partition(low, high);
    sortedIndices.add(pi);
    steps.push({
      type: "mark",
      index: pi,
      state: "sorted",
      narration: `Pivot arr[${pi}] = ${arr[pi]} is now in its final position`,
      pseudocodeLine: 2,
      codeLine: { javascript: 3, python: 4, java: 3, cpp: 3 },
    });

    sort(low, pi - 1);
    sort(pi + 1, high);
  }

  sort(0, arr.length - 1);
  return steps;
}
