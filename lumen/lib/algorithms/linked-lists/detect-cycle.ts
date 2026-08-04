import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const detectCycleMeta: AlgorithmMeta = {
  name: "Detect Cycle (Floyd)", slug: "ll-detect-cycle", category: "linked-lists", difficulty: "intermediate",
  tags: ["linked-lists", "cycle-detection", "two-pointers"],
  description: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) uses two pointers moving at different speeds to detect cycles in linear time and O(1) space.",
  complexity: { best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
  pseudocode: [
    "slow = head, fast = head",
    "while fast and fast.next is not null:",
    "  slow = slow.next",
    "  fast = fast.next.next",
    "  if slow == fast: return true // cycle detected",
    "return false",
  ],
  codeSnippets: {
    javascript: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    python: `def has_cycle(head):
    slow, fast = head, head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
    java: `boolean hasCycle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    cpp: `bool hasCycle(Node* head) {
    Node *slow = head, *fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
  },
  defaultInput: [10, 20, 30, 40, 50],
};

export function generateSteps(input: number[], hasCycle = true): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  const n = input.length;
  if (n <= 1) return steps;

  steps.push({
    type: "llSetPointer",
    name: "slow",
    nodeId: "n0",
    narration: "Set slow pointer to head (n0)",
    pseudocodeLine: 0,
  });

  steps.push({
    type: "llSetPointer",
    name: "fast",
    nodeId: "n0",
    narration: "Set fast pointer to head (n0)",
    pseudocodeLine: 0,
  });

  let slowIdx = 0;
  let fastIdx = 0;
  
  // We simulate 10 iterations max to prevent infinite loops
  for (let it = 0; it < 15; it++) {
    // slow moves 1 step
    slowIdx = (slowIdx + 1) % n;
    
    // fast moves 2 steps
    if (hasCycle) {
      fastIdx = (fastIdx + 2) % n;
    } else {
      fastIdx += 2;
      if (fastIdx >= n) {
        steps.push({
          type: "llSetPointer",
          name: "fast",
          nodeId: null,
          narration: "fast pointer reached end of list. No cycle detected.",
          pseudocodeLine: 1,
        });
        steps.push(msg("Fast pointer hit tail. No cycle detected.", "No cycle", "success"));
        return steps;
      }
    }

    const slowNode = `n${slowIdx}`;
    const fastNode = `n${fastIdx}`;

    steps.push({
      type: "llSetPointer",
      name: "slow",
      nodeId: slowNode,
      narration: `slow pointer moves to index ${slowIdx}`,
      pseudocodeLine: 2,
    });

    steps.push({
      type: "llSetPointer",
      name: "fast",
      nodeId: fastNode,
      narration: `fast pointer moves to index ${fastIdx}`,
      pseudocodeLine: 3,
    });

    steps.push({
      type: "llMark",
      nodeId: slowNode,
      state: "comparing",
      narration: `Checking if slow (${slowNode}) equals fast (${fastNode})`,
      pseudocodeLine: 4,
    });

    if (slowIdx === fastIdx) {
      steps.push({
        type: "llMark",
        nodeId: slowNode,
        state: "sorted",
        narration: `Cycle detected! slow and fast met at node n${slowIdx}`,
        pseudocodeLine: 4,
      });
      steps.push(msg("Cycle successfully detected!", "Tortoise and Hare met", "success"));
      return steps;
    }
  }

  return steps;
}
