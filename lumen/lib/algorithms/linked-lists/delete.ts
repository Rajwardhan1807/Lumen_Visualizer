import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const deleteMeta: AlgorithmMeta = {
  name: "Linked List Delete", slug: "ll-delete", category: "linked-lists", difficulty: "beginner",
  tags: ["linked-lists", "deletion"],
  description: "Deletion removes a node from the linked list at a specified position and updates the pointer of the preceding node to point to the subsequent node.",
  complexity: { best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
  pseudocode: [
    "if head is null: return null",
    "if index == 0:",
    "  temp = head",
    "  head = head.next",
    "  delete temp",
    "curr = head; count = 0",
    "while curr is not null and count < index - 1:",
    "  curr = curr.next; count++",
    "temp = curr.next",
    "curr.next = temp.next",
    "delete temp",
  ],
  codeSnippets: {
    javascript: `function deleteAt(head, index) {
  if (head === null) return null;
  if (index === 0) {
    return head.next;
  }
  let curr = head;
  let count = 0;
  while (curr !== null && count < index - 1) {
    curr = curr.next;
    count++;
  }
  if (curr !== null && curr.next !== null) {
    curr.next = curr.next.next;
  }
  return head;
}`,
    python: `def delete_at(head, index):
    if head is None: return None
    if index == 0:
        return head.next
    curr = head
    count = 0
    while curr is not None and count < index - 1:
        curr = curr.next
        count += 1
    if curr is not None and curr.next is not None:
        curr.next = curr.next.next
    return head`,
    java: `Node deleteAt(Node head, int index) {
    if (head == null) return null;
    if (index == 0) return head.next;
    Node curr = head;
    int count = 0;
    while (curr != null && count < index - 1) {
        curr = curr.next;
        count++;
    }
    if (curr != null && curr.next != null) {
        curr.next = curr.next.next;
    }
    return head;
}`,
    cpp: `Node* deleteAt(Node* head, int index) {
    if (head == nullptr) return nullptr;
    if (index == 0) {
        Node* temp = head->next;
        delete head;
        return temp;
    }
    Node* curr = head;
    int count = 0;
    while (curr != nullptr && count < index - 1) {
        curr = curr->next;
        count++;
    }
    if (curr != nullptr && curr->next != nullptr) {
        Node* temp = curr->next;
        curr->next = temp->next;
        delete temp;
    }
    return head;
}`,
  },
  defaultInput: [10, 20, 30, 40],
};

export function generateSteps(input: number[], deleteIndex = 2): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  if (input.length === 0) {
    steps.push(msg("Linked List is empty. Nothing to delete.", "Deletion error", 0));
    return steps;
  }

  const index = Math.max(0, Math.min(deleteIndex, input.length - 1));
  steps.push(msg(`Preparing to delete node at index ${index}`, "Delete operation initialized", 0));

  if (index === 0) {
    steps.push({
      type: "llMark",
      nodeId: "n0",
      state: "swapping",
      narration: "Deleting head node",
      pseudocodeLine: 2,
    });
    steps.push({
      type: "llDelete",
      nodeId: "n0",
      narration: "Head node removed",
      pseudocodeLine: 3,
    });
    return steps;
  }

  // Traversal to find index - 1
  steps.push({
    type: "llSetPointer",
    name: "curr",
    nodeId: "n0",
    narration: "Start traverse: curr points to head",
    pseudocodeLine: 5,
  });

  for (let i = 0; i < index - 1; i++) {
    steps.push({
      type: "llMark",
      nodeId: `n${i}`,
      state: "comparing",
      narration: `Checking node at index ${i}`,
      pseudocodeLine: 6,
    });

    steps.push({
      type: "llSetPointer",
      name: "curr",
      nodeId: `n${i + 1}`,
      narration: `Move curr to next node (index ${i + 1})`,
      pseudocodeLine: 6,
    });
  }

  const prevNodeId = `n${index - 1}`;
  const targetNodeId = `n${index}`;

  steps.push({
    type: "llMark",
    nodeId: targetNodeId,
    state: "swapping",
    narration: `Mark node ${targetNodeId} for deletion`,
    pseudocodeLine: 8,
  });

  steps.push({
    type: "llDelete",
    nodeId: targetNodeId,
    narration: `Bypassing node ${targetNodeId} — pointing ${prevNodeId} to its next sibling`,
    pseudocodeLine: 9,
  });

  return steps;
}
