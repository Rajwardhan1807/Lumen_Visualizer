import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const avlMeta: AlgorithmMeta = {
  name: "AVL Tree", slug: "avl", category: "trees", difficulty: "advanced",
  tags: ["trees", "self-balancing", "avl", "search-trees"],
  description: "AVL Tree is a self-balancing Binary Search Tree where the height difference (balance factor) between left and right subtrees is at most 1.",
  complexity: { best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
  pseudocode: [
    "insert(node, val):",
    "  standard BST insert",
    "  updateHeight(node)",
    "  balance = getBalance(node)",
    "  if balance > 1 and val < node.left.val: rotateRight(node)",
    "  if balance < -1 and val > node.right.val: rotateLeft(node)",
    "  if balance > 1 and val > node.left.val: leftRotate(node.left); rotateRight(node)",
    "  if balance < -1 and val < node.right.val: rightRotate(node.right); rotateLeft(node)",
  ],
  codeSnippets: {
    javascript: `class AVLTree {
  insert(node, val) {
    if (!node) return { val, height: 1 };
    if (val < node.val) node.left = this.insert(node.left, val);
    else node.right = this.insert(node.right, val);
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    let balance = this.getBalance(node);
    if (balance > 1 && val < node.left.val) return this.rightRotate(node);
    if (balance < -1 && val > node.right.val) return this.leftRotate(node);
    if (balance > 1 && val > node.left.val) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && val < node.right.val) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }
    return node;
  }
}`,
    python: `def insert(node, val):
    if not node: return AVLNode(val)
    if val < node.val:
        node.left = insert(node.left, val)
    else:
        node.right = insert(node.right, val)
    node.height = 1 + max(get_height(node.left), get_height(node.right))
    balance = get_balance(node)
    # Right Rotation
    if balance > 1 and val < node.left.val:
        return right_rotate(node)
    # Left Rotation
    if balance < -1 and val > node.right.val:
        return left_rotate(node)
    # Left-Right Rotation
    if balance > 1 and val > node.left.val:
        node.left = left_rotate(node.left)
        return right_rotate(node)
    # Right-Left Rotation
    if balance < -1 and val < node.right.val:
        node.right = right_rotate(node.right)
        return left_rotate(node)
    return node`,
    java: `Node insert(Node node, int val) {
    if (node == null) return new Node(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    node.height = 1 + Math.max(height(node.left), height(node.right));
    int balance = getBalance(node);
    if (balance > 1 && val < node.left.val) return rightRotate(node);
    if (balance < -1 && val > node.right.val) return leftRotate(node);
    if (balance > 1 && val > node.left.val) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }
    if (balance < -1 && val < node.right.val) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }
    return node;
}`,
    cpp: `Node* insert(Node* node, int val) {
    if (!node) return new Node(val);
    if (val < node->val) node->left = insert(node->left, val);
    else node->right = insert(node->right, val);
    node->height = 1 + max(height(node->left), height(node->right));
    int balance = getBalance(node);
    if (balance > 1 && val < node->left->val) return rightRotate(node);
    if (balance < -1 && val > node->right->val) return leftRotate(node);
    if (balance > 1 && val > node->left->val) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    if (balance < -1 && val < node->right->val) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}`,
  },
  defaultInput: [30, 20, 10, 40, 50, 25],
};

export function generateSteps(values: number[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg("AVL Tree creation and balancing simulation starting...", "Initializing AVL insertion", 0));

  // Simulating BST values inserting and rotations
  // 30 -> 20 -> 10 triggers right rotation at 30
  steps.push({
    type: "treeInsert",
    nodeId: "n1",
    parentId: null,
    value: 30,
    narration: "Inserting root 30",
    pseudocodeLine: 1,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "n2",
    parentId: "n1",
    value: 20,
    isLeft: true,
    narration: "Inserting 20 as left child of 30",
    pseudocodeLine: 1,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "n3",
    parentId: "n2",
    value: 10,
    isLeft: true,
    narration: "Inserting 10 as left child of 20",
    pseudocodeLine: 1,
  });

  steps.push({
    type: "treeMark",
    nodeId: "n1",
    state: "comparing",
    narration: "Left-Left imbalance detected at node 30 (Balance Factor = 2)",
    pseudocodeLine: 3,
  });

  steps.push({
    type: "treeRotate",
    pivotId: "n1",
    direction: "right",
    narration: "Performing Right Rotation around node 30 to balance tree",
    pseudocodeLine: 4,
  });

  steps.push(msg("Tree balanced successfully. Root is now 20.", "Re-balanced AVL Tree", 0));
  return steps;
}
