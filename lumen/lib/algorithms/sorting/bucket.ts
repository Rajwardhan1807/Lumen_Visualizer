import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const bucketMeta: AlgorithmMeta = {
  name: "Bucket Sort", slug: "bucket-sort", category: "sorting", difficulty: "intermediate",
  tags: ["sorting", "non-comparison", "stable", "distribution"],
  description: "Bucket Sort distributes the elements of an array into multiple buckets. Each bucket is then sorted individually, either using a different sorting algorithm, or by recursively applying the bucket sorting algorithm.",
  complexity: { best: "O(n + k)", average: "O(n + k)", worst: "O(n²)", space: "O(n + k)" },
  pseudocode: [
    "create n empty buckets",
    "insert each element into bucket[index_hash(element)]",
    "sort individual buckets using insertion sort",
    "concatenate all sorted buckets into output array",
  ],
  codeSnippets: {
    javascript: `function bucketSort(arr) {
  const n = arr.length;
  if (n <= 0) return arr;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min;
  const buckets = Array.from({ length: n }, () => []);
  for (let val of arr) {
    let idx = Math.floor(((val - min) / range) * (n - 1));
    buckets[idx].push(val);
  }
  for (let b of buckets) b.sort((x, y) => x - y);
  let index = 0;
  for (let b of buckets) {
    for (let val of b) arr[index++] = val;
  }
  return arr;
}`,
    python: `def bucket_sort(arr):
    n = len(arr)
    if n <= 0: return arr
    min_val, max_val = min(arr), max(arr)
    bucket_range = max_val - min_val
    if bucket_range == 0: return arr
    buckets = [[] for _ in range(n)]
    for val in arr:
        idx = int(((val - min_val) / bucket_range) * (n - 1))
        buckets[idx].append(val)
    for b in buckets:
        b.sort()
    index = 0
    for b in buckets:
        for val in b:
            arr[index] = val
            index += 1
    return arr`,
    java: `void bucketSort(int[] arr) {
    int n = arr.length;
    if (n <= 0) return;
    int min = arr[0], max = arr[0];
    for (int v : arr) {
        if (v < min) min = v;
        if (v > max) max = v;
    }
    List<Integer>[] buckets = new List[n];
    for (int i = 0; i < n; i++) buckets[i] = new ArrayList<>();
    for (int v : arr) {
        int idx = (v - min) * (n - 1) / (max - min);
        buckets[idx].add(v);
    }
    for (List<Integer> b : buckets) Collections.sort(b);
    int index = 0;
    for (List<Integer> b : buckets) {
        for (int v : b) arr[index++] = v;
    }
}`,
    cpp: `void bucketSort(vector<int>& arr) {
    int n = arr.size();
    if (n <= 0) return;
    int min = *min_element(arr.begin(), arr.end());
    int max = *max_element(arr.begin(), arr.end());
    int range = max - min;
    vector<vector<int>> buckets(n);
    for (int v : arr) {
        int idx = range == 0 ? 0 : (v - min) * (n - 1) / range;
        buckets[idx].push_back(v);
    }
    for (auto& b : buckets) sort(b.begin(), b.end());
    int index = 0;
    for (auto& b : buckets) {
        for (int v : b) arr[index++] = v;
    }
}`,
  },
  defaultInput: [29, 25, 3, 49, 9, 37, 21, 43],
};

export function generateSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [];
  const { set, mark, msg } = createStepBuilder();

  const n = arr.length;
  if (n <= 1) return steps;

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min;

  steps.push(msg(`Min: ${min}, Max: ${max}, Range: ${range}. Allocating ${n} buckets.`, "Distributing elements into buckets", 0));

  const buckets: number[][] = Array.from({ length: n }, () => []);

  for (let i = 0; i < n; i++) {
    const val = arr[i];
    const idx = range === 0 ? 0 : Math.floor(((val - min) / range) * (n - 1));
    buckets[idx].push(val);
    steps.push(mark(i, "comparing", `Distributing ${val} into Bucket ${idx}`, 1));
  }

  // Sort buckets & merge back
  let index = 0;
  for (let bIdx = 0; bIdx < n; bIdx++) {
    const b = buckets[bIdx];
    if (b.length > 0) {
      steps.push(msg(`Sorting Bucket ${bIdx}: [${b.join(", ")}]`, `Sorting individual bucket`, 2));
      b.sort((x, y) => x - y);
      for (const val of b) {
        arr[index] = val;
        steps.push(set(index, val, `Merged back ${val} from Bucket ${bIdx} to position ${index}`, 3));
        steps.push(mark(index, "sorted", `Index ${index} is now sorted`, 3));
        index++;
      }
    }
  }

  return steps;
}
