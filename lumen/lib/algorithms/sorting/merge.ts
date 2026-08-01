import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const mergeMeta: AlgorithmMeta = {
  name: "Merge Sort",
  slug: "merge-sort",
  category: "sorting",
  difficulty: "intermediate",
  description:
    "Merge Sort is a divide-and-conquer algorithm that splits the array in half recursively until single elements, then merges sorted halves back together. It guarantees O(n log n) performance.",
  complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  pseudocode: [
    "mergeSort(arr, l, r):",
    "  if l >= r: return",
    "  mid = (l + r) / 2",
    "  mergeSort(arr, l, mid)",
    "  mergeSort(arr, mid+1, r)",
    "  merge(arr, l, mid, r)",
    "merge(arr, l, mid, r):",
    "  copy left[0..mid-l] and right[0..r-mid]",
    "  merge back into arr[l..r] in order",
  ],
  codeSnippets: {
    javascript: `function mergeSort(arr, l = 0, r = arr.length - 1) {
  if (l >= r) return arr;
  const mid = Math.floor((l + r) / 2);
  mergeSort(arr, l, mid);
  mergeSort(arr, mid + 1, r);
  merge(arr, l, mid, r);
  return arr;
}

function merge(arr, l, mid, r) {
  const left = arr.slice(l, mid + 1);
  const right = arr.slice(mid + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else arr[k++] = right[j++];
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`,
    python: `def merge_sort(arr, l=0, r=None):
    if r is None: r = len(arr) - 1
    if l >= r: return
    mid = (l + r) // 2
    merge_sort(arr, l, mid)
    merge_sort(arr, mid + 1, r)
    merge(arr, l, mid, r)

def merge(arr, l, mid, r):
    left = arr[l:mid+1]
    right = arr[mid+1:r+1]
    i = j = 0; k = l
    while i < len(left) and j < len(right):
        if left[i] <= right[j]: arr[k] = left[i]; i += 1
        else: arr[k] = right[j]; j += 1
        k += 1
    while i < len(left): arr[k] = left[i]; i += 1; k += 1
    while j < len(right): arr[k] = right[j]; j += 1; k += 1`,
    java: `public static void mergeSort(int[] arr, int l, int r) {
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
  const arr = [...input];
  const steps: Step[] = [];

  function merge(l: number, mid: number, r: number) {
    const left = arr.slice(l, mid + 1);
    const right = arr.slice(mid + 1, r + 1);
    let i = 0, j = 0, k = l;

    steps.push({
      type: "message",
      text: `Merging subarrays [${l}..${mid}] and [${mid + 1}..${r}]`,
      narration: `Merging subarrays [${l}..${mid}] and [${mid + 1}..${r}]`,
      pseudocodeLine: 6,
      codeLine: { javascript: 13, python: 12, java: 6, cpp: 6 },
    });

    while (i < left.length && j < right.length) {
      steps.push({
        type: "compare",
        indices: [l + i, mid + 1 + j],
        narration: `Comparing ${left[i]} and ${right[j]}`,
        pseudocodeLine: 8,
        codeLine: { javascript: 14, python: 13, java: 10, cpp: 10 },
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        steps.push({
          type: "set",
          index: k,
          value: left[i],
          narration: `Placing ${left[i]} at position ${k}`,
          pseudocodeLine: 8,
          codeLine: { javascript: 15, python: 14, java: 10, cpp: 10 },
        });
        i++;
      } else {
        arr[k] = right[j];
        steps.push({
          type: "set",
          index: k,
          value: right[j],
          narration: `Placing ${right[j]} at position ${k}`,
          pseudocodeLine: 8,
          codeLine: { javascript: 16, python: 15, java: 10, cpp: 10 },
        });
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        type: "set",
        index: k,
        value: left[i],
        narration: `Copying remaining left element ${left[i]} to position ${k}`,
        pseudocodeLine: 8,
        codeLine: { javascript: 18, python: 17, java: 12, cpp: 12 },
      });
      i++; k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        type: "set",
        index: k,
        value: right[j],
        narration: `Copying remaining right element ${right[j]} to position ${k}`,
        pseudocodeLine: 8,
        codeLine: { javascript: 19, python: 18, java: 13, cpp: 13 },
      });
      j++; k++;
    }

    for (let idx = l; idx <= r; idx++) {
      steps.push({
        type: "mark",
        index: idx,
        state: l === 0 && r === arr.length - 1 ? "sorted" : "queued",
        narration: `Subarray [${l}..${r}] merged`,
        pseudocodeLine: 6,
        codeLine: { javascript: 6, python: 6, java: 6, cpp: 6 },
      });
    }
  }

  function sort(l: number, r: number) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    steps.push({
      type: "message",
      text: `Splitting [${l}..${r}] at mid=${mid}`,
      narration: `Dividing array: [${l}..${mid}] and [${mid + 1}..${r}]`,
      pseudocodeLine: 2,
      codeLine: { javascript: 3, python: 3, java: 3, cpp: 3 },
    });
    sort(l, mid);
    sort(mid + 1, r);
    merge(l, mid, r);
  }

  sort(0, arr.length - 1);

  // Final pass — mark all sorted
  arr.forEach((_, idx) => {
    steps.push({
      type: "mark",
      index: idx,
      state: "sorted",
      narration: "Array fully sorted!",
      pseudocodeLine: 5,
      codeLine: { javascript: 6, python: 5, java: 5, cpp: 5 },
    });
  });

  return steps;
}
