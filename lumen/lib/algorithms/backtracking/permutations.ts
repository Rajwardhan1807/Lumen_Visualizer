import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const permutationsMeta: AlgorithmMeta = {
  name: "Permutations", slug: "permutations", category: "backtracking", difficulty: "intermediate",
  tags: ["backtracking", "permutations", "combinatorics"],
  description: "Generate all permutations of a distinct array of numbers by swapping elements.",
  complexity: { best: "O(n * n!)", average: "O(n * n!)", worst: "O(n * n!)", space: "O(n)" },
  pseudocode: [
    "permute(l, r):",
    "  if l == r: output current permutation",
    "  for i = l to r:",
    "    swap(arr[l], arr[i])",
    "    permute(l + 1, r)",
    "    swap(arr[l], arr[i]) // backtrack",
  ],
  codeSnippets: {
    javascript: `function permute(arr, l = 0, r = arr.length - 1) {
  if (l === r) {
    console.log([...arr]);
    return;
  }
  for (let i = l; i <= r; i++) {
    [arr[l], arr[i]] = [arr[i], arr[l]];
    permute(arr, l + 1, r);
    [arr[l], arr[i]] = [arr[i], arr[l]];
  }
}`,
    python: `def permute(arr, l=0, r=None):
    if r is None: r = len(arr) - 1
    if l == r:
        print(arr[:])
        return
    for i in range(l, r + 1):
        arr[l], arr[i] = arr[i], arr[l]
        permute(arr, l + 1, r)
        arr[l], arr[i] = arr[i], arr[l]`,
    java: `void permute(int[] arr, int l, int r) {
    if (l == r) {
        System.out.println(Arrays.toString(arr));
        return;
    }
    for (int i = l; i <= r; i++) {
        swap(arr, l, i);
        permute(arr, l + 1, r);
        swap(arr, l, i);
    }
}`,
    cpp: `void permute(vector<int>& arr, int l, int r) {
    if (l == r) {
        print(arr);
        return;
    }
    for (int i = l; i <= r; i++) {
        swap(arr[l], arr[i]);
        permute(arr, l + 1, r);
        swap(arr[l], arr[i]);
    }
}`,
  },
  defaultInput: [1, 2, 3],
};

export function generateSteps(input: number[]): Step[] {
  const arr = Array.isArray(input) ? [...input] : [1, 2, 3];
  const steps: Step[] = [];
  const { swap, mark, msg } = createStepBuilder();

  steps.push(msg("Generating all permutations...", "Backtracking permute started", "info"));

  function permute(l: number, r: number) {
    if (l === r) {
      steps.push(msg(`Found permutation: [${arr.join(", ")}]`, "New permutation yielded", "info"));
      return;
    }

    for (let i = l; i <= r; i++) {
      steps.push(mark(l, "pivot", `Outer selection boundary: index ${l}`, 2));
      steps.push(swap([l, i], `Swapping element ${arr[l]} and ${arr[i]}`, 3));
      [arr[l], arr[i]] = [arr[i], arr[l]];

      permute(l + 1, r);

      steps.push(swap([l, i], `Backtracking swap: restoring ${arr[l]} and ${arr[i]}`, 5));
      [arr[l], arr[i]] = [arr[i], arr[l]];
    }
  }

  permute(0, arr.length - 1);
  return steps;
}
