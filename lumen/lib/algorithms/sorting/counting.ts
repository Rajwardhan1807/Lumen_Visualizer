import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const countingMeta: AlgorithmMeta = {
  name: "Counting Sort", slug: "counting-sort", category: "sorting", difficulty: "intermediate",
  tags: ["sorting", "non-comparison", "integer", "stable"],
  description: "Counting Sort is a non-comparison-based sorting algorithm that works by counting the number of objects having each distinct key value, then calculating their starting positions. It runs in O(n + k) time.",
  complexity: { best: "O(n + k)", average: "O(n + k)", worst: "O(n + k)", space: "O(n + k)" },
  pseudocode: [
    "find max element in array",
    "create count array of size max + 1 filled with 0",
    "count each element frequency: count[arr[i]]++",
    "accumulate sum of counts: count[i] += count[i-1]",
    "place elements in output array using count array positions",
    "copy output back to original array",
  ],
  codeSnippets: {
    javascript: `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  for (let val of arr) count[val]++;
  for (let i = 1; i <= max; i++) count[i] += count[i - 1];
  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  return arr;
}`,
    python: `def counting_sort(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)
    for val in arr:
        count[val] += 1
    for i in range(1, max_val + 1):
        count[i] += count[i-1]
    output = [0] * len(arr)
    for val in reversed(arr):
        output[count[val] - 1] = val
        count[val] -= 1
    for i in range(len(arr)):
        arr[i] = output[i]
    return arr`,
    java: `void countingSort(int[] arr) {
    int max = arr[0];
    for (int v : arr) if (v > max) max = v;
    int[] count = new int[max + 1];
    for (int v : arr) count[v]++;
    for (int i = 1; i <= max; i++) count[i] += count[i-1];
    int[] output = new int[arr.length];
    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    System.arraycopy(output, 0, arr, 0, arr.length);
}`,
    cpp: `void countingSort(vector<int>& arr) {
    int max = *max_element(arr.begin(), arr.end());
    vector<int> count(max + 1, 0);
    for (int v : arr) count[v]++;
    for (int i = 1; i <= max; i++) count[i] += count[i-1];
    vector<int> output(arr.size());
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    arr = output;
}`,
  },
  defaultInput: [4, 2, 2, 8, 3, 3, 1],
};

export function generateSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [];
  const { compare, set, mark, msg } = createStepBuilder();

  if (arr.length === 0) return steps;
  
  // Find max
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    steps.push(compare([i, arr.indexOf(max)], `Finding max value: comparing arr[${i}] = ${arr[i]} with current max ${max}`, 0));
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  steps.push(msg(`Max value found is ${max}`, `Maximum element is ${max}. Initializing count array of size ${max + 1}.`, "info"));

  const count = new Array(max + 1).fill(0);
  // Counting frequencies
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
    steps.push(mark(i, "comparing", `Incrementing count of ${arr[i]} (count[${arr[i]}] = ${count[arr[i]]})`, 2));
  }

  // Accumulating counts
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  steps.push(msg("Accumulated prefix sums in count array", "Prefix sums updated to determine index boundaries.", "info"));

  // Rebuilding output
  const output = new Array(arr.length).fill(0);
  for (let i = arr.length - 1; i >= 0; i--) {
    const val = arr[i];
    const pos = count[val] - 1;
    output[pos] = val;
    count[val]--;
    steps.push(set(pos, val, `Placing arr[${i}] = ${val} at index ${pos} of temporary sorted array`, 4));
  }

  // Copy back
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
    steps.push(set(i, arr[i], `Copying sorted value ${arr[i]} back to original array at index ${i}`, 5));
    steps.push(mark(i, "sorted", `Index ${i} is sorted`, 5));
  }

  return steps;
}
