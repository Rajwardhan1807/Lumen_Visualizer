import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const reverseMeta: AlgorithmMeta = {
  name: "Reverse Linked List", slug: "ll-reverse", category: "linked-lists", difficulty: "intermediate",
  tags: ["linked-lists", "pointer-manipulation"],
  description: "Reverses a linked list in place by changing the direction of pointers. The head becomes the tail, and the tail becomes the new head.",
  complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)" },
  pseudocode: [
    "prev = null; curr = head; next = null",
    "while curr is not null:",
    "  next = curr.next",
    "  curr.next = prev",
    "  prev = curr",
    "  curr = next",
    "return prev",
  ],
  codeSnippets: {
    javascript: `function reverse(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev;
}`,
    python: `def reverse(head):
    prev = None
    curr = head
    while curr is not None:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    java: `Node reverse(Node head) {
    Node prev = null;
    Node curr = head;
    while (curr != null) {
        Node next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    cpp: `Node* reverse(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    while (curr != nullptr) {
        Node* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
  },
  defaultInput: [10, 20, 30, 40],
};

export function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  if (input.length === 0) return steps;

  steps.push({
    type: "llSetPointer",
    name: "prev",
    nodeId: null,
    narration: "Set prev = null",
    pseudocodeLine: 0,
  });

  steps.push({
    type: "llSetPointer",
    name: "curr",
    nodeId: "n0",
    narration: "Set curr = head (n0)",
    pseudocodeLine: 0,
  });

  for (let i = 0; i < input.length; i++) {
    const currNodeId = `n${i}`;
    const nextNodeId = i < input.length - 1 ? `n${i + 1}` : null;

    steps.push({
      type: "llSetPointer",
      name: "next",
      nodeId: nextNodeId,
      narration: `Set next = curr.next (${nextNodeId})`,
      pseudocodeLine: 2,
    });

    steps.push({
      type: "llMark",
      nodeId: currNodeId,
      state: "swapping",
      narration: `Reverse pointer: point ${currNodeId} back to prev`,
      pseudocodeLine: 3,
    });

    steps.push({
      type: "llSetPointer",
      name: "prev",
      nodeId: currNodeId,
      narration: `Set prev = curr (${currNodeId})`,
      pseudocodeLine: 4,
    });

    steps.push({
      type: "llSetPointer",
      name: "curr",
      nodeId: nextNodeId,
      narration: `Set curr = next (${nextNodeId})`,
      pseudocodeLine: 5,
    });
  }

  steps.push(msg("Reversal complete!", "The list has been reversed.", "success"));
  return steps;
}
