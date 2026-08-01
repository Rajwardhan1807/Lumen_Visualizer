import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const mergeListsMeta: AlgorithmMeta = {
  name: "Merge Sorted Lists", slug: "ll-merge-lists", category: "linked-lists", difficulty: "intermediate",
  tags: ["linked-lists", "two-pointers", "sorting"],
  description: "Merge two sorted linked lists into a single sorted linked list by splicing their nodes together.",
  complexity: { best: "O(n + m)", average: "O(n + m)", worst: "O(n + m)", space: "O(1)" },
  pseudocode: [
    "dummy = new Node(0); tail = dummy",
    "while l1 and l2 are not null:",
    "  if l1.val <= l2.val:",
    "    tail.next = l1; l1 = l1.next",
    "  else:",
    "    tail.next = l2; l2 = l2.next",
    "  tail = tail.next",
    "tail.next = l1 ? l1 : l2",
  ],
  codeSnippets: {
    javascript: `function mergeTwoLists(l1, l2) {
  let dummy = { value: 0, next: null };
  let tail = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.value <= l2.value) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 !== null ? l1 : l2;
  return dummy.next;
}`,
    python: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 if l1 else l2
    return dummy.next`,
    java: `Node mergeTwoLists(Node l1, Node l2) {
    Node dummy = new Node(0);
    Node tail = dummy;
    while (l1 != null && l2 != null) {
        if (l1.value <= l2.value) {
            tail.next = l1; l1 = l1.next;
        } else {
            tail.next = l2; l2 = l2.next;
        }
        tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`,
    cpp: `Node* mergeTwoLists(Node* l1, Node* l2) {
    Node dummy(0);
    Node* tail = &dummy;
    while (l1 != nullptr && l2 != nullptr) {
        if (l1->value <= l2->value) {
            tail->next = l1; l1 = l1->next;
        } else {
            tail->next = l2; l2 = l2->next;
        }
        tail = tail->next;
    }
    tail->next = (l1 != nullptr) ? l1 : l2;
    return dummy.next;
}`,
  },
  defaultInput: [1, 3, 5],
};

export function generateSteps(l1: number[], l2: number[] = [2, 4, 6]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg(`Merging List 1 [${l1.join(", ")}] and List 2 [${l2.join(", ")}]`, "Initiating merge sort on sorted lists", 0));

  steps.push({
    type: "llSetPointer",
    name: "l1",
    nodeId: "a0",
    narration: "Set pointer l1 to start of list A",
    pseudocodeLine: 1,
  });

  steps.push({
    type: "llSetPointer",
    name: "l2",
    nodeId: "b0",
    narration: "Set pointer l2 to start of list B",
    pseudocodeLine: 1,
  });

  let i = 0, j = 0;
  while (i < l1.length && j < l2.length) {
    const val1 = l1[i];
    const val2 = l2[j];

    steps.push({
      type: "llMark",
      nodeId: `a${i}`,
      state: "comparing",
      narration: `Comparing l1: a${i} (${val1}) with l2: b${j} (${val2})`,
      pseudocodeLine: 2,
    });

    steps.push({
      type: "llMark",
      nodeId: `b${j}`,
      state: "comparing",
      narration: `Comparing l2: b${j} (${val2}) with l1: a${i} (${val1})`,
      pseudocodeLine: 2,
    });

    if (val1 <= val2) {
      steps.push({
        type: "llMark",
        nodeId: `a${i}`,
        state: "sorted",
        narration: `Splicing a${i} (${val1}) into output list`,
        pseudocodeLine: 3,
      });
      i++;
      steps.push({
        type: "llSetPointer",
        name: "l1",
        nodeId: i < l1.length ? `a${i}` : null,
        narration: `Advance l1 to a${i}`,
        pseudocodeLine: 3,
      });
    } else {
      steps.push({
        type: "llMark",
        nodeId: `b${j}`,
        state: "sorted",
        narration: `Splicing b${j} (${val2}) into output list`,
        pseudocodeLine: 5,
      });
      j++;
      steps.push({
        type: "llSetPointer",
        name: "l2",
        nodeId: j < l2.length ? `b${j}` : null,
        narration: `Advance l2 to b${j}`,
        pseudocodeLine: 5,
      });
    }
  }

  while (i < l1.length) {
    steps.push({
      type: "llMark",
      nodeId: `a${i}`,
      state: "sorted",
      narration: `List 2 is empty. Splicing remaining a${i} into output list`,
      pseudocodeLine: 7,
    });
    i++;
  }

  while (j < l2.length) {
    steps.push({
      type: "llMark",
      nodeId: `b${j}`,
      state: "sorted",
      narration: `List 1 is empty. Splicing remaining b${j} into output list`,
      pseudocodeLine: 7,
    });
    j++;
  }

  steps.push(msg("Merge complete!", "All nodes spliced successfully", "success"));
  return steps;
}
