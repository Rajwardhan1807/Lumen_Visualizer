import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const traversalMeta: AlgorithmMeta = {
  name: "Linked List Traversal", slug: "ll-traversal", category: "linked-lists", difficulty: "beginner",
  tags: ["linked-lists", "traversal"],
  description: "Traversal means visiting each node in the linked list sequentially from the head to the tail, performing an operation on each node.",
  complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)" },
  pseudocode: [
    "curr = head",
    "while curr is not null:",
    "  visit(curr)",
    "  curr = curr.next",
  ],
  codeSnippets: {
    javascript: `function traverse(head) {
  let curr = head;
  while (curr !== null) {
    console.log(curr.value);
    curr = curr.next;
  }
}`,
    python: `def traverse(head):
    curr = head
    while curr is not None:
        print(curr.value)
        curr = curr.next`,
    java: `void traverse(Node head) {
    Node curr = head;
    while (curr != null) {
        System.out.println(curr.value);
        curr = curr.next;
    }
}`,
    cpp: `void traverse(Node* head) {
    Node* curr = head;
    while (curr != nullptr) {
        cout << curr->value << endl;
        curr = curr->next;
    }
}`,
  },
  defaultInput: [10, 20, 30, 40, 50],
};

export function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  if (input.length === 0) {
    steps.push(msg("Linked List is empty.", "Empty head node", 0));
    return steps;
  }

  // Set initial pointers and nodes
  steps.push({
    type: "llSetPointer",
    name: "curr",
    nodeId: "n0",
    narration: "Initialize curr pointer to the head of the list",
    pseudocodeLine: 0,
  });

  for (let i = 0; i < input.length; i++) {
    const nodeId = `n${i}`;
    steps.push({
      type: "llMark",
      nodeId,
      state: "comparing",
      narration: `Visiting node at index ${i} with value ${input[i]}`,
      pseudocodeLine: 2,
    });

    steps.push({
      type: "llMark",
      nodeId,
      state: "sorted",
      narration: `Processed value ${input[i]}`,
      pseudocodeLine: 2,
    });

    if (i < input.length - 1) {
      steps.push({
        type: "llSetPointer",
        name: "curr",
        nodeId: `n${i + 1}`,
        narration: `Move curr pointer to next node: n${i + 1}`,
        pseudocodeLine: 3,
      });
    } else {
      steps.push({
        type: "llSetPointer",
        name: "curr",
        nodeId: null,
        narration: "curr reached null (end of list)",
        pseudocodeLine: 3,
      });
    }
  }

  return steps;
}
