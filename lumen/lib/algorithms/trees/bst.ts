import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const bstMeta: AlgorithmMeta = {
  name: "Binary Search Tree",
  slug: "bst",
  category: "trees",
  difficulty: "intermediate",
  description: "A BST is a binary tree where each node's left subtree contains only nodes with smaller values, and the right subtree contains only larger values. Enables O(log n) search, insert, and delete on average.",
  complexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)", space: "O(n)" },
  pseudocode: [
    "insert(node, value):",
    "  if node is null: return new Node(value)",
    "  if value < node.val: node.left = insert(node.left, value)",
    "  else if value > node.val: node.right = insert(node.right, value)",
    "  return node",
    "search(node, target):",
    "  if node is null or node.val == target: return node",
    "  if target < node.val: return search(node.left, target)",
    "  return search(node.right, target)",
  ],
  codeSnippets: {
    javascript: `class BST {
  insert(val) {
    this.root = this._insert(this.root, val);
  }
  _insert(node, val) {
    if (!node) return { val, left: null, right: null };
    if (val < node.val) node.left = this._insert(node.left, val);
    else if (val > node.val) node.right = this._insert(node.right, val);
    return node;
  }
  search(val) { return this._search(this.root, val); }
  _search(node, val) {
    if (!node || node.val === val) return node;
    return val < node.val ? this._search(node.left, val) : this._search(node.right, val);
  }
}`,
    python: `class BST:
    def insert(self, root, val):
        if not root: return Node(val)
        if val < root.val: root.left = self.insert(root.left, val)
        elif val > root.val: root.right = self.insert(root.right, val)
        return root

    def search(self, root, val):
        if not root or root.val == val: return root
        if val < root.val: return self.search(root.left, val)
        return self.search(root.right, val)`,
    java: `// BST insert
Node insert(Node root, int val) {
    if (root == null) return new Node(val);
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    return root;
}`,
    cpp: `Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val) root->left = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    return root;
}`,
  },
  defaultInput: { id: "root", value: 50 },
};

let nodeCounter = 0;

interface SimpleNode {
  id: string;
  value: number;
  left?: SimpleNode | null;
  right?: SimpleNode | null;
}

function createNode(value: number): SimpleNode {
  return { id: `n${++nodeCounter}`, value, left: null, right: null };
}

export function generateInsertSteps(values: number[]): Step[] {
  nodeCounter = 0;
  const steps: Step[] = [];
  let root: SimpleNode | null = null;

  function insert(node: SimpleNode | null, value: number, parentId: string | null): SimpleNode {
    if (!node) {
      const newNode = createNode(value);
      steps.push({ type: "treeInsert", nodeId: newNode.id, parentId, value, narration: `Inserting ${value}: ${parentId ? `placed as child of node ${parentId}` : "root of tree"}`, pseudocodeLine: 1, codeLine: { javascript: 5, python: 3, java: 2, cpp: 2 } });
      return newNode;
    }

    steps.push({ type: "treeMark", nodeId: node.id, state: "comparing", narration: `Comparing ${value} with node ${node.value}`, pseudocodeLine: 2, codeLine: { javascript: 6, python: 4, java: 3, cpp: 3 } });

    if (value < node.value) {
      steps.push({ type: "treeMark", nodeId: node.id, state: "queued", narration: `${value} < ${node.value}, going LEFT`, pseudocodeLine: 2, codeLine: { javascript: 7, python: 4, java: 3, cpp: 3 } });
      node.left = insert(node.left ?? null, value, node.id);
    } else if (value > node.value) {
      steps.push({ type: "treeMark", nodeId: node.id, state: "queued", narration: `${value} > ${node.value}, going RIGHT`, pseudocodeLine: 3, codeLine: { javascript: 8, python: 5, java: 4, cpp: 4 } });
      node.right = insert(node.right ?? null, value, node.id);
    } else {
      steps.push({ type: "treeMark", nodeId: node.id, state: "sorted", narration: `${value} already exists in tree — no duplicate`, pseudocodeLine: 3, codeLine: { javascript: 9, python: 6, java: 5, cpp: 5 } });
    }

    steps.push({ type: "treeMark", nodeId: node.id, state: "sorted", narration: `Node ${node.value} remains in place`, pseudocodeLine: 4, codeLine: { javascript: 10, python: 7, java: 6, cpp: 6 } });
    return node;
  }

  for (const v of values) {
    root = insert(root, v, null);
  }

  return steps;
}
