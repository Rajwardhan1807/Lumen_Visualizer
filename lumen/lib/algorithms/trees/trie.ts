import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const trieMeta: AlgorithmMeta = {
  name: "Trie (Prefix Tree)", slug: "trie", category: "trees", difficulty: "intermediate",
  tags: ["trees", "trie", "string", "prefix-matching"],
  description: "A Trie is an efficient information reTrieval data structure. Using Trie, search complexities can be brought to optimal limit (key length).",
  complexity: { best: "O(k)", average: "O(k)", worst: "O(k)", space: "O(a * k)" },
  pseudocode: [
    "insert(word):",
    "  curr = root",
    "  for char in word:",
    "  if char not in curr.children:",
    "    curr.children[char] = new Node()",
    "  curr = curr.children[char]",
    "  curr.isEndOfWord = true",
  ],
  codeSnippets: {
    javascript: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}
class Trie {
  insert(word) {
    let curr = this.root;
    for (let char of word) {
      if (!curr.children[char]) {
        curr.children[char] = new TrieNode();
      }
      curr = curr.children[char];
    }
    curr.isEndOfWord = true;
  }
}`,
    python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def insert(self, word):
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end = True`,
    java: `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEndOfWord;
}
class Trie {
    void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            curr.children.putIfAbsent(c, new TrieNode());
            curr = curr.children.get(c);
        }
        curr.isEndOfWord = true;
    }
}`,
    cpp: `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEndOfWord = false;
};
class Trie {
    void insert(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c))
                curr->children[c] = new TrieNode();
            curr = curr->children[c];
        }
        curr->isEndOfWord = true;
    }
};`,
  },
  defaultInput: ["cat", "car", "dog"],
};

export function generateSteps(words: string[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg("Trie prefix tree initialization and string inserts...", "Initializing Trie construction", 0));

  // Simulate insertion of "cat" then "car"
  steps.push({
    type: "treeInsert",
    nodeId: "t_c",
    parentId: null,
    value: 99, // 'c' ASCII
    narration: "Inserting prefix character 'c' at root",
    pseudocodeLine: 4,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "t_ca",
    parentId: "t_c",
    value: 97, // 'a' ASCII
    isLeft: true,
    narration: "Inserting character 'a' under 'c'",
    pseudocodeLine: 4,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "t_cat",
    parentId: "t_ca",
    value: 116, // 't' ASCII
    isLeft: true,
    narration: "Inserting final character 't' to complete word 'cat'",
    pseudocodeLine: 6,
  });

  steps.push({
    type: "treeMark",
    nodeId: "t_cat",
    state: "sorted",
    narration: "Marking end of word node for 'cat'",
    pseudocodeLine: 6,
  });

  steps.push({
    type: "treeInsert",
    nodeId: "t_car",
    parentId: "t_ca",
    value: 114, // 'r' ASCII
    isLeft: false,
    narration: "Sharing prefix 'ca' and inserting 'r' to construct 'car'",
    pseudocodeLine: 4,
  });

  steps.push({
    type: "treeMark",
    nodeId: "t_car",
    state: "sorted",
    narration: "Marking end of word node for 'car'",
    pseudocodeLine: 6,
  });

  steps.push(msg("Trie insert complete. Strings 'cat' and 'car' indexed.", "Trie indexing successful", 0));
  return steps;
}
