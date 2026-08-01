import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const enqueueMeta: AlgorithmMeta = {
  name: "Queue Enqueue", slug: "queue-enqueue", category: "queues", difficulty: "beginner",
  tags: ["queue", "enqueue", "data-structures"],
  description: "Enqueue adds an element to the back (tail) of the queue. First-In, First-Out (FIFO) ordering is preserved.",
  complexity: { best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
  pseudocode: [
    "if queue is full: return overflow",
    "tail = tail + 1",
    "queue[tail] = value",
  ],
  codeSnippets: {
    javascript: `function enqueue(queue, value) {
  queue.push(value);
  return queue;
}`,
    python: `def enqueue(queue, value):
    queue.append(value)
    return queue`,
    java: `void enqueue(Queue<Integer> q, int value) {
    q.add(value);
}`,
    cpp: `void enqueue(queue<int>& q, int value) {
    q.push(value);
}`,
  },
  defaultInput: [10, 20, 30],
};

export const dequeueMeta: AlgorithmMeta = {
  name: "Queue Dequeue", slug: "queue-dequeue", category: "queues", difficulty: "beginner",
  tags: ["queue", "dequeue", "data-structures"],
  description: "Dequeue removes and returns the front (head) element of the queue.",
  complexity: { best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
  pseudocode: [
    "if queue is empty: return underflow",
    "value = queue[head]",
    "head = head + 1",
    "return value",
  ],
  codeSnippets: {
    javascript: `function dequeue(queue) {
  if (queue.length === 0) return null;
  return queue.shift();
}`,
    python: `def dequeue(queue):
    if len(queue) == 0: return None
    return queue.pop(0)`,
    java: `int dequeue(Queue<Integer> q) {
    if (q.isEmpty()) return -1;
    return q.poll();
}`,
    cpp: `int dequeue(queue<int>& q) {
    if (q.empty()) return -1;
    int val = q.front();
    q.pop();
    return val;
}`,
  },
  defaultInput: [10, 20, 30],
};

export const circularMeta: AlgorithmMeta = {
  name: "Circular Queue", slug: "circular-queue", category: "queues", difficulty: "intermediate",
  tags: ["queue", "circular", "data-structures"],
  description: "Circular Queue connects the end back to the start to utilize empty space created by de-queuing.",
  complexity: { best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(n)" },
  pseudocode: [
    "enqueue(value):",
    "  if (tail + 1) % size == head: return overflow",
    "  tail = (tail + 1) % size",
    "  queue[tail] = value",
  ],
  codeSnippets: {
    javascript: `class CircularQueue {
  enqueue(val) {
    if ((this.tail + 1) % this.size === this.head) return "Overflow";
    this.tail = (this.tail + 1) % this.size;
    this.arr[this.tail] = val;
  }
}`,
    python: `def enqueue(self, val):
    if (self.tail + 1) % self.size == self.head: return "Overflow"
    self.tail = (self.tail + 1) % self.size
    self.arr[self.tail] = val`,
    java: `boolean enqueue(int val) {
    if ((tail + 1) % size == head) return false;
    tail = (tail + 1) % size;
    arr[tail] = val;
    return true;
}`,
    cpp: `bool enqueue(int val) {
    if ((tail + 1) % size == head) return false;
    tail = (tail + 1) % size;
    arr[tail] = val;
    return true;
}`,
  },
  defaultInput: [10, 20, 30],
};

export const priorityMeta: AlgorithmMeta = {
  name: "Priority Queue", slug: "priority-queue", category: "queues", difficulty: "intermediate",
  tags: ["queue", "priority", "min-heap", "max-heap"],
  description: "Priority Queue dequeues the highest priority element first, regardless of arrival order. Often backed by a binary heap.",
  complexity: { best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
  pseudocode: [
    "insert(value, priority):",
    "  heap.add(value)",
    "  heapifyUp(heap.length - 1)",
    "extractMin():",
    "  swap(heap[0], heap[last])",
    "  heapifyDown(0)",
  ],
  codeSnippets: {
    javascript: `class PriorityQueue {
  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.bubbleUp();
  }
}`,
    python: `import heapq
class PriorityQueue:
    def enqueue(self, val, priority):
        heapq.heappush(self.heap, (priority, val))`,
    java: `PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.add(val);`,
    cpp: `priority_queue<int, vector<int>, greater<int>> pq;
pq.push(val);`,
  },
  defaultInput: [30, 10, 20],
};

export function generateEnqueueSteps(input: number[], val = 40): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();
  steps.push(msg(`Initiating Queue Enqueue of value ${val}`, "Enqueue operation started", 0));
  steps.push({
    type: "enqueue",
    value: val,
    narration: `Added value ${val} to the back of the queue`,
    pseudocodeLine: 2,
  });
  return steps;
}

export function generateDequeueSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();
  if (input.length === 0) {
    steps.push(msg("Queue is empty. Underflow exception.", "Underflow error", 0));
    return steps;
  }
  const frontVal = input[0];
  steps.push(msg(`Initiating Queue Dequeue. Current front is ${frontVal}`, "Dequeue operation started", 0));
  steps.push({
    type: "dequeue",
    value: frontVal,
    narration: `Dequeued front element ${frontVal} from queue`,
    pseudocodeLine: 2,
  });
  return steps;
}

export function generateCircularSteps(input: number[], val = 50): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();
  steps.push(msg(`Enqueuing ${val} into Circular Queue`, "Circular queue write initialized", 0));
  steps.push({
    type: "enqueue",
    value: val,
    narration: `Enqueuing ${val} into the circular array index`,
    pseudocodeLine: 3,
  });
  return steps;
}

export function generatePrioritySteps(input: number[], val = 15): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();
  steps.push(msg(`Enqueuing ${val} into Priority Queue`, "Priority queue insert initialized", 0));
  steps.push({
    type: "enqueue",
    value: val,
    narration: `Element inserted and heapified based on priority value ${val}`,
    pseudocodeLine: 2,
  });
  return steps;
}
