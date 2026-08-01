import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const radixMeta: AlgorithmMeta = {
  name: "Radix Sort", slug: "radix-sort", category: "sorting", difficulty: "intermediate",
  tags: ["sorting", "non-comparison", "integer", "stable"],
  description: "Radix Sort sorts elements digit by digit, from least significant digit (LSD) to most significant digit (MSD). It uses Counting Sort as a subroutine.",
  complexity: { best: "O(d * (n + k))", average: "O(d * (n + k))", worst: "O(d * (n + k))", space: "O(n + k)" },
  pseudocode: [
    "find the maximum number to know number of digits",
    "for exp = 1, 10, 100, ...:",
    "  do a stable counting sort on digit represented by exp",
    "countingSort(arr, exp):",
    "  count digits (arr[i] / exp) % 10",
    "  place elements in output according to count boundary positions",
  ],
  codeSnippets: {
    javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortForRadix(arr, exp);
  }
  return arr;
}
function countingSortForRadix(arr, exp) {
  const output = new Array(arr.length);
  const count = new Array(10).fill(0);
  for (let i = 0; i < arr.length; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  for (let i = 0; i < arr.length; i++) arr[i] = output[i];
}`,
    python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_radix(arr, exp)
        exp *= 10
    return arr

def counting_sort_radix(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for i in range(n):
        digit = (arr[i] // exp) % 10
        count[digit] += 1
    for i in range(1, 10):
        count[i] += count[i-1]
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        output[count[digit] - 1] = arr[i]
        count[digit] -= 1
    for i in range(n):
        arr[i] = output[i]`,
    java: `void radixSort(int[] arr) {
    int max = getMax(arr);
    for (int exp = 1; max / exp > 0; exp *= 10)
        countingSort(arr, exp);
}
void countingSort(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n];
    int[] count = new int[10];
    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i-1];
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    System.arraycopy(output, 0, arr, 0, n);
}`,
    cpp: `void radixSort(vector<int>& arr) {
    int max = *max_element(arr.begin(), arr.end());
    for (int exp = 1; max / exp > 0; exp *= 10)
        countingSort(arr, exp);
}
void countingSort(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n), count(10, 0);
    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i-1];
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }
    arr = output;
}`,
  },
  defaultInput: [170, 45, 75, 90, 802, 24, 2, 66],
};

export function generateSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [];
  const { set, mark, msg } = createStepBuilder();

  if (arr.length === 0) return steps;

  const max = Math.max(...arr);
  steps.push(msg(`Max value is ${max}. Starting sorting digits.`, "Finding max element to check total digits", 0));

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    steps.push(msg(`Sorting digits at 10^${Math.log10(exp)} place`, `Stable sort by digit at place value ${exp}`, 1));

    const output = new Array(arr.length);
    const count = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      steps.push(mark(i, "comparing", `Inspecting element ${arr[i]} (digit: ${digit} at place ${exp})`, 4));
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const pos = count[digit] - 1;
      output[pos] = arr[i];
      count[digit]--;
      steps.push(set(pos, arr[i], `Placing element ${arr[i]} based on digit ${digit} at output index ${pos}`, 5));
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
      steps.push(set(i, arr[i], `Writing back sorted digit order: index ${i} = ${arr[i]}`, 2));
      if (Math.floor(max / (exp * 10)) === 0) {
        steps.push(mark(i, "sorted", `Index ${i} is fully sorted`, 2));
      }
    }
  }

  return steps;
}
