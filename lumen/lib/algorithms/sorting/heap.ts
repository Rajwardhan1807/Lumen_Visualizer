import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const heapMeta: AlgorithmMeta = {
  name: "Heap Sort",
  slug: "heap-sort",
  category: "sorting",
  difficulty: "intermediate",
  description:
    "Heap Sort builds a max-heap from the input, then repeatedly extracts the maximum element and places it at the end. It achieves O(n log n) in all cases with O(1) auxiliary space.",
  complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
  pseudocode: [
    "buildMaxHeap(arr):",
    "  for i = n/2-1 downto 0: heapify(arr, n, i)",
    "heapSort(arr):",
    "  buildMaxHeap(arr)",
    "  for i = n-1 downto 1:",
    "    swap(arr[0], arr[i])",
    "    heapify(arr, i, 0)",
    "heapify(arr, n, i):",
    "  largest = i; l = 2i+1; r = 2i+2",
    "  if l<n and arr[l]>arr[largest]: largest=l",
    "  if r<n and arr[r]>arr[largest]: largest=r",
    "  if largest != i: swap; heapify(arr, n, largest)",
  ],
  codeSnippets: {
    javascript: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let largest = i, l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) { [arr[i], arr[largest]] = [arr[largest], arr[i]]; heapify(arr, n, largest); }
}`,
    python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i; l = 2*i+1; r = 2*i+2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    java: `public static void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n/2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;
        heapify(arr, i, 0);
    }
}`,
    cpp: `void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
  },
  defaultInput: [12, 11, 13, 5, 6, 7],
};

export function generateSteps(input: number[]): Step[] {
  const arr = [...input];
  const n = arr.length;
  const steps: Step[] = [];

  function heapify(size: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < size) {
      steps.push({ type: "compare", indices: [l, largest], narration: `Comparing arr[${l}]=${arr[l]} with arr[${largest}]=${arr[largest]}`, pseudocodeLine: 9, codeLine: { javascript: 12, python: 11, java: 10, cpp: 10 } });
      if (arr[l] > arr[largest]) largest = l;
    }
    if (r < size) {
      steps.push({ type: "compare", indices: [r, largest], narration: `Comparing arr[${r}]=${arr[r]} with arr[${largest}]=${arr[largest]}`, pseudocodeLine: 10, codeLine: { javascript: 13, python: 12, java: 11, cpp: 11 } });
      if (arr[r] > arr[largest]) largest = r;
    }

    if (largest !== i) {
      steps.push({ type: "swap", indices: [i, largest], narration: `Swapping arr[${i}]=${arr[i]} with arr[${largest}]=${arr[largest]}`, pseudocodeLine: 11, codeLine: { javascript: 14, python: 14, java: 12, cpp: 12 } });
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(size, largest);
    }
  }

  steps.push({ type: "message", text: "Building max-heap...", narration: "Building max-heap from array", pseudocodeLine: 0, codeLine: { javascript: 3, python: 3, java: 3, cpp: 3 } });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);

  for (let i = n - 1; i > 0; i--) {
    steps.push({ type: "swap", indices: [0, i], narration: `Extracting max arr[0]=${arr[0]}, placing at position ${i}`, pseudocodeLine: 5, codeLine: { javascript: 6, python: 6, java: 5, cpp: 5 } });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({ type: "mark", index: i, state: "sorted", narration: `arr[${i}]=${arr[i]} is now in its final sorted position`, pseudocodeLine: 5, codeLine: { javascript: 7, python: 7, java: 6, cpp: 6 } });
    heapify(i, 0);
  }
  steps.push({ type: "mark", index: 0, state: "sorted", narration: "Array fully sorted!", pseudocodeLine: 6, codeLine: { javascript: 8, python: 8, java: 7, cpp: 7 } });

  return steps;
}
