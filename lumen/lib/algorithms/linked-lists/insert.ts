import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const insertMeta: AlgorithmMeta = {
  name: "Linked List Insert", slug: "ll-insert", category: "linked-lists", difficulty: "beginner",
  tags: ["linked-lists", "insertion"],
  description: "Insertion operation adds a new node at a given index (0-based) in the linked list by updating adjacent pointers.",
  complexity: { best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
  pseudocode: [
    "newNode = createNode(value)",
    "if index == 0:",
    "  newNode.next = head",
    "  head = newNode",
    "curr = head; count = 0",
    "while curr is not null and count < index - 1:",
    "  curr = curr.next; count++",
    "newNode.next = curr.next",
    "curr.next = newNode",
  ],
  codeSnippets: {
    javascript: `function insertAt(head, value, index) {
  const newNode = { value, next: null };
  if (index === 0) {
    newNode.next = head;
    return newNode;
  }
  let curr = head;
  let count = 0;
  while (curr !== null && count < index - 1) {
    curr = curr.next;
    count++;
  }
  if (curr !== null) {
    newNode.next = curr.next;
    curr.next = newNode;
  }
  return head;
}`,
    python: `def insert_at(head, value, index):
    new_node = Node(value)
    if index == 0:
        new_node.next = head
        return new_node
    curr = head
    count = 0
    while curr is not None and count < index - 1:
        curr = curr.next
        count += 1
    if curr is not None:
        new_node.next = curr.next
        curr.next = new_node
    return head`,
    java: `Node insertAt(Node head, int value, int index) {
    Node newNode = new Node(value);
    if (index == 0) {
        newNode.next = head;
        return newNode;
    }
    Node curr = head;
    int count = 0;
    while (curr != null && count < index - 1) {
        curr = curr.next;
        count++;
    }
    if (curr != null) {
        newNode.next = curr.next;
        curr.next = newNode;
    }
    return head;
}`,
    cpp: `Node* insertAt(Node* head, int value, int index) {
    Node* newNode = new Node(value);
    if (index == 0) {
        newNode->next = head;
        return newNode;
    }
    Node* curr = head;
    int count = 0;
    while (curr != nullptr && count < index - 1) {
        curr = curr->next;
        count++;
    }
    if (curr != nullptr) {
        newNode->next = curr->next;
        curr->next = newNode;
    }
    return head;
}`,
  },
  defaultInput: [10, 20, 30, 40],
};

export function generateSteps(input: number[], val = 25, insertIndex = 2): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  // Clamp insert index
  const index = Math.max(0, Math.min(insertIndex, input.length));

  steps.push(msg(`Preparing to insert value ${val} at index ${index}`, "Insert operation initialized", 0));

  if (index === 0) {
    steps.push({
      type: "llInsert",
      index: 0,
      value: val,
      nodeId: "new-node",
      afterId: null,
      narration: `Creating new node with value ${val} and pointing next to current head`,
      pseudocodeLine: 2,
    });
    return steps;
  }

  // Traversal to find index - 1
  steps.push({
    type: "llSetPointer",
    name: "curr",
    nodeId: "n0",
    narration: "Start traverse: curr points to head",
    pseudocodeLine: 4,
  });

  for (let i = 0; i < index - 1; i++) {
    steps.push({
      type: "llMark",
      nodeId: `n${i}`,
      state: "comparing",
      narration: `Checking node at index ${i}`,
      pseudocodeLine: 5,
    });

    steps.push({
      type: "llSetPointer",
      name: "curr",
      nodeId: `n${i + 1}`,
      narration: `Move curr to next node (index ${i + 1})`,
      pseudocodeLine: 6,
    });
  }

  steps.push({
    type: "llInsert",
    index,
    value: val,
    nodeId: "new-node",
    afterId: `n${index - 1}`,
    narration: `Inserting new node after index ${index - 1}`,
    pseudocodeLine: 8,
  });

  return steps;
}
