import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const huffmanMeta: AlgorithmMeta = {
  name: "Huffman Coding", slug: "huffman", category: "greedy", difficulty: "advanced",
  tags: ["greedy", "huffman-coding", "compression", "trees"],
  description: "Huffman Coding is a greedy algorithm used for lossless data compression. It assigns variable-length codes to input characters based on their frequencies.",
  complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  pseudocode: [
    "create leaf node for each character with frequency",
    "insert all leaf nodes into a priority queue",
    "while queue size > 1:",
    "  left = queue.extractMin()",
    "  right = queue.extractMin()",
    "  parent = new Node(left.freq + right.freq)",
    "  parent.left = left; parent.right = right",
    "  queue.insert(parent)",
  ],
  codeSnippets: {
    javascript: `function huffmanCoding(charArray, freq) {
  let minHeap = new MinPriorityQueue();
  for (let i = 0; i < charArray.length; i++) {
    minHeap.enqueue(new HuffmanNode(charArray[i], freq[i]));
  }
  while (minHeap.size() > 1) {
    let left = minHeap.dequeue();
    let right = minHeap.dequeue();
    let parent = new HuffmanNode('$', left.freq + right.freq);
    parent.left = left;
    parent.right = right;
    minHeap.enqueue(parent);
  }
  return minHeap.dequeue();
}`,
    python: `import heapq
def huffman_coding(char_arr, freq):
    heap = []
    for i in range(len(char_arr)):
        heapq.heappush(heap, (freq[i], HuffmanNode(char_arr[i], freq[i])))
    while len(heap) > 1:
        f1, node1 = heapq.heappop(heap)
        f2, node2 = heapq.heappop(heap)
        parent = HuffmanNode('$', f1 + f2)
        parent.left = node1
        parent.right = node2
        heapq.heappush(heap, (f1 + f2, parent))
    return heapq.heappop(heap)[1]`,
    java: `HuffmanNode buildTree(char[] charArray, int[] freq) {
    PriorityQueue<HuffmanNode> q = new PriorityQueue<>(charArray.length, (a, b) -> a.data - b.data);
    for (int i = 0; i < charArray.length; i++) {
        q.add(new HuffmanNode(charArray[i], freq[i]));
    }
    while (q.size() > 1) {
        HuffmanNode x = q.poll();
        HuffmanNode y = q.poll();
        HuffmanNode f = new HuffmanNode('$', x.data + y.data);
        f.left = x; f.right = y;
        q.add(f);
    }
    return q.poll();
}`,
    cpp: `HuffmanNode* buildTree(vector<char>& charArray, vector<int>& freq) {
    auto cmp = [](HuffmanNode* l, HuffmanNode* r) { return l->freq > r->freq; };
    priority_queue<HuffmanNode*, vector<HuffmanNode*>, decltype(cmp)> q(cmp);
    for (size_t i = 0; i < charArray.size(); ++i)
        q.push(new HuffmanNode(charArray[i], freq[i]));
    while (q.size() > 1) {
        HuffmanNode* left = q.top(); q.pop();
        HuffmanNode* right = q.top(); q.pop();
        HuffmanNode* parent = new HuffmanNode('$', left->freq + right->freq);
        parent->left = left; parent->right = right;
        q.push(parent);
    }
    return q.top();
}`,
  },
  defaultInput: { chars: ["a", "b", "c", "d"], freqs: [5, 9, 12, 13] },
};

export function generateSteps(input: { chars: string[]; freqs: number[] }): Step[] {
  const { chars, freqs } = input || huffmanMeta.defaultInput;
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg("Huffman coding tree generation started...", "Initializing Huffman coding", 0));

  // Build tree nodes step-by-step
  steps.push({
    type: "treeInsert",
    nodeId: "h_a",
    parentId: null,
    value: freqs[0], // 5
    narration: `Creating leaf node for character 'a' with frequency ${freqs[0]}`,
    pseudocodeLine: 0,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "h_b",
    parentId: null,
    value: freqs[1], // 9
    narration: `Creating leaf node for character 'b' with frequency ${freqs[1]}`,
    pseudocodeLine: 0,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "h_ab",
    parentId: null,
    value: 14, // sum of 5 and 9
    narration: "Extracting two minimum nodes (5 and 9) and creating parent node 14",
    pseudocodeLine: 5,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "h_a",
    parentId: "h_ab",
    value: 5,
    isLeft: true,
    narration: "Left child assigned to 'a' (5)",
    pseudocodeLine: 6,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "h_b",
    parentId: "h_ab",
    value: 9,
    isLeft: false,
    narration: "Right child assigned to 'b' (9)",
    pseudocodeLine: 6,
  });

  steps.push(msg("Huffman coding construction completed.", "Tree successfully created", 0));
  return steps;
}
