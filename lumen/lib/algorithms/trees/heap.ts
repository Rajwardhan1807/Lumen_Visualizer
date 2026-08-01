import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const treeHeapMeta: AlgorithmMeta = {
  name: "Binary Heap (Tree)", slug: "tree-heap", category: "trees", difficulty: "intermediate",
  tags: ["trees", "heap", "priority-queue"],
  description: "A Binary Heap is a complete binary tree where the key at the root must be minimum (Min Heap) or maximum (Max Heap) among all keys present in its subtree.",
  complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
  pseudocode: [
    "insert(val):",
    "  arr.push(val)",
    "  heapifyUp(arr.length - 1)",
    "heapifyUp(i):",
    "  while i > 0 and arr[parent(i)] > arr[i]:",
    "    swap(arr[parent(i)], arr[i])",
    "    i = parent(i)",
  ],
  codeSnippets: {
    javascript: `class MinHeap {
  insert(val) {
    this.heap.push(val);
    this.heapifyUp(this.heap.length - 1);
  }
  heapifyUp(idx) {
    while (idx > 0) {
      let pIdx = Math.floor((idx - 1) / 2);
      if (this.heap[pIdx] <= this.heap[idx]) break;
      [this.heap[pIdx], this.heap[idx]] = [this.heap[idx], this.heap[pIdx]];
      idx = pIdx;
    }
  }
}`,
    python: `class MinHeap:
    def insert(self, val):
        self.heap.append(val)
        self.heapify_up(len(self.heap) - 1)
        
    def heapify_up(self, idx):
        while idx > 0:
            p_idx = (idx - 1) // 2
            if self.heap[p_idx] <= self.heap[idx]:
                break
            self.heap[p_idx], self.heap[idx] = self.heap[idx], self.heap[p_idx]
            idx = p_idx`,
    java: `class MinHeap {
    void insert(int val) {
        heap.add(val);
        heapifyUp(heap.size() - 1);
    }
    void heapifyUp(int idx) {
        while (idx > 0) {
            int pIdx = (idx - 1) / 2;
            if (heap.get(pIdx) <= heap.get(idx)) break;
            int temp = heap.get(pIdx);
            heap.set(pIdx, heap.get(idx));
            heap.set(idx, temp);
            idx = pIdx;
        }
    }
}`,
    cpp: `class MinHeap {
    void insert(int val) {
        heap.push_back(val);
        heapifyUp(heap.size() - 1);
    }
    void heapifyUp(int idx) {
        while (idx > 0) {
            int pIdx = (idx - 1) / 2;
            if (heap[pIdx] <= heap[idx]) break;
            swap(heap[pIdx], heap[idx]);
            idx = pIdx;
        }
    }
};`,
  },
  defaultInput: [10, 20, 15, 30, 40],
};

export function generateSteps(values: number[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg("Binary Min Heap insertion simulation starting...", "Initializing Heap insert", 0));

  // Build tree heap representation step-by-step
  // 10 -> 20 -> 5 (will bubble up 5 to root)
  steps.push({
    type: "treeInsert",
    nodeId: "h1",
    parentId: null,
    value: 10,
    narration: "Inserting 10 into the heap",
    pseudocodeLine: 1,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "h2",
    parentId: "h1",
    value: 20,
    isLeft: true,
    narration: "Inserting 20 as left child of 10",
    pseudocodeLine: 1,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "h3",
    parentId: "h1",
    value: 5,
    isLeft: false,
    narration: "Inserting 5 as right child of 10",
    pseudocodeLine: 1,
  });

  steps.push({
    type: "treeMark",
    nodeId: "h3",
    state: "comparing",
    narration: "Comparing node 5 with its parent 10",
    pseudocodeLine: 4,
  });

  steps.push({
    type: "treeMark",
    nodeId: "h1",
    state: "comparing",
    narration: "Heap property violated: parent 10 > child 5",
    pseudocodeLine: 4,
  });

  steps.push({
    type: "treeRotate",
    pivotId: "h1", // represents heap swapping node 5 with parent 10
    direction: "right",
    narration: "Swapping 5 with its parent 10 to satisfy heap property",
    pseudocodeLine: 5,
  });

  steps.push(msg("Heapification complete. Root is now 5.", "Min Heap balanced", 0));
  return steps;
}
