import type { AlgorithmEntry, AlgorithmCategory } from "@/lib/types/algorithm";

// Sorting
import * as bubble from "./sorting/bubble";
import * as insertion from "./sorting/insertion";
import * as selection from "./sorting/selection";
import * as merge from "./sorting/merge";
import * as quick from "./sorting/quick";
import * as heap from "./sorting/heap";
import * as counting from "./sorting/counting";
import * as radix from "./sorting/radix";
import * as bucket from "./sorting/bucket";
import * as shell from "./sorting/shell";

// Searching
import * as linear from "./searching/linear";
import * as jump from "./searching/jump";
import * as exponential from "./searching/exponential";
import * as interpolation from "./searching/interpolation";

// Linked Lists
import * as llTraversal from "./linked-lists/traversal";
import * as llInsert from "./linked-lists/insert";
import * as llDelete from "./linked-lists/delete";
import * as llReverse from "./linked-lists/reverse";
import * as llDetectCycle from "./linked-lists/detect-cycle";
import * as llMergeLists from "./linked-lists/merge-lists";

// Stacks
import * as stackOps from "./stacks/stack";

// Queues
import * as queueOps from "./queues/queue";

// Trees
import * as bst from "./trees/bst";
import * as avl from "./trees/avl";
import * as treeHeap from "./trees/heap";
import * as trie from "./trees/trie";
import * as segmentTree from "./trees/segment-tree";
import * as fenwickTree from "./trees/fenwick-tree";

// Graphs
import * as bfs from "./graphs/bfs";
import * as dfs from "./graphs/dfs";
import * as dijkstra from "./graphs/dijkstra";
import * as bellmanFord from "./graphs/bellman-ford";
import * as floydWarshall from "./graphs/floyd-warshall";
import * as prim from "./graphs/prim";
import * as kruskal from "./graphs/kruskal";
import * as topologicalSort from "./graphs/topological-sort";
import * as unionFind from "./graphs/union-find";

// Dynamic Programming
import * as fibMemo from "./dynamic-programming/fib-memo";
import * as coinChange from "./dynamic-programming/coin-change";
import * as knapsack from "./dynamic-programming/knapsack";
import * as lis from "./dynamic-programming/lis";
import * as lcs from "./dynamic-programming/lcs";
import * as editDistance from "./dynamic-programming/edit-distance";
import * as matrixChain from "./dynamic-programming/matrix-chain";

// Greedy
import * as huffman from "./greedy/huffman";
import * as activitySelection from "./greedy/activity-selection";
import * as fractionalKnapsack from "./greedy/fractional-knapsack";

// Backtracking
import * as nQueens from "./backtracking/n-queens";
import * as sudoku from "./backtracking/sudoku";
import * as ratInMaze from "./backtracking/rat-in-maze";
import * as wordSearch from "./backtracking/word-search";
import * as permutations from "./backtracking/permutations";

// Recursion
import * as factorial from "./recursion/factorial";
import * as hanoi from "./recursion/tower-of-hanoi";
import * as recBinarySearch from "./recursion/recursive-binary-search";
import * as mergeSortRec from "./recursion/merge-sort-rec";
import * as quickSortRec from "./recursion/quick-sort-rec";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toEntry = (meta: any, generateSteps: any): AlgorithmEntry => ({
  meta,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateSteps: (input: any) => generateSteps(input),
});

export const algorithmRegistry: Record<string, AlgorithmEntry> = {
  // Sorting
  "bubble-sort": toEntry(bubble.bubbleMeta, bubble.generateSteps),
  "insertion-sort": toEntry(insertion.insertionMeta, insertion.generateSteps),
  "selection-sort": toEntry(selection.selectionMeta, selection.generateSteps),
  "merge-sort": toEntry(merge.mergeMeta, merge.generateSteps),
  "quick-sort": toEntry(quick.quickMeta, quick.generateSteps),
  "heap-sort": toEntry(heap.heapMeta, heap.generateSteps),
  "counting-sort": toEntry(counting.countingMeta, counting.generateSteps),
  "radix-sort": toEntry(radix.radixMeta, radix.generateSteps),
  "bucket-sort": toEntry(bucket.bucketMeta, bucket.generateSteps),
  "shell-sort": toEntry(shell.shellMeta, shell.generateSteps),

  // Searching
  "linear-search": toEntry(linear.linearSearchMeta, (input: number[]) => linear.generateSteps(input, 10)),
  "binary-search": toEntry(linear.binarySearchMeta, (input: number[]) => linear.generateBinarySearchSteps(input, 10)),
  "jump-search": toEntry(jump.jumpSearchMeta, (input: number[]) => jump.generateSteps(input, 70)),
  "exponential-search": toEntry(exponential.exponentialSearchMeta, (input: number[]) => exponential.generateSteps(input, 70)),
  "interpolation-search": toEntry(interpolation.interpolationSearchMeta, (input: number[]) => interpolation.generateSteps(input, 33)),

  // Linked Lists
  "ll-traversal": toEntry(llTraversal.traversalMeta, llTraversal.generateSteps),
  "ll-insert": toEntry(llInsert.insertMeta, (input: number[]) => llInsert.generateSteps(input, 25, 2)),
  "ll-delete": toEntry(llDelete.deleteMeta, (input: number[]) => llDelete.generateSteps(input, 2)),
  "ll-reverse": toEntry(llReverse.reverseMeta, llReverse.generateSteps),
  "ll-detect-cycle": toEntry(llDetectCycle.detectCycleMeta, (input: number[]) => llDetectCycle.generateSteps(input, true)),
  "ll-merge-lists": toEntry(llMergeLists.mergeListsMeta, (input: number[]) => llMergeLists.generateSteps([1, 3, 5], [2, 4, 6])),

  // Stacks
  "stack-push": toEntry(stackOps.pushMeta, (input: number[]) => stackOps.generatePushSteps(input, 40)),
  "stack-pop": toEntry(stackOps.popMeta, stackOps.generatePopSteps),
  "stack-peek": toEntry(stackOps.peekMeta, stackOps.generatePeekSteps),

  // Queues
  "queue-enqueue": toEntry(queueOps.enqueueMeta, (input: number[]) => queueOps.generateEnqueueSteps(input, 40)),
  "queue-dequeue": toEntry(queueOps.dequeueMeta, queueOps.generateDequeueSteps),
  "circular-queue": toEntry(queueOps.circularMeta, (input: number[]) => queueOps.generateCircularSteps(input, 50)),
  "priority-queue": toEntry(queueOps.priorityMeta, (input: number[]) => queueOps.generatePrioritySteps(input, 15)),

  // Trees
  "bst": toEntry(bst.bstMeta, (input: number[]) => bst.generateInsertSteps(input)),
  "avl": toEntry(avl.avlMeta, avl.generateSteps),
  "tree-heap": toEntry(treeHeap.treeHeapMeta, treeHeap.generateSteps),
  "trie": toEntry(trie.trieMeta, trie.generateSteps),
  "segment-tree": toEntry(segmentTree.segmentTreeMeta, segmentTree.generateSteps),
  "fenwick-tree": toEntry(fenwickTree.fenwickMeta, fenwickTree.generateSteps),

  // Graphs
  "bfs": toEntry(bfs.bfsMeta, bfs.generateSteps),
  "dfs": toEntry(dfs.dfsMeta, dfs.generateSteps),
  "dijkstra": toEntry(dijkstra.dijkstraMeta, dijkstra.generateSteps),
  "bellman-ford": toEntry(bellmanFord.bellmanFordMeta, bellmanFord.generateSteps),
  "floyd-warshall": toEntry(floydWarshall.floydWarshallMeta, floydWarshall.generateSteps),
  "prim": toEntry(prim.primMeta, prim.generateSteps),
  "kruskal": toEntry(kruskal.kruskalMeta, kruskal.generateSteps),
  "topological-sort": toEntry(topologicalSort.topologicalSortMeta, topologicalSort.generateSteps),
  "union-find": toEntry(unionFind.unionFindMeta, unionFind.generateSteps),

  // Dynamic Programming
  "fib-memo": toEntry(fibMemo.dpFibMeta, fibMemo.generateSteps),
  "coin-change": toEntry(coinChange.coinChangeMeta, coinChange.generateSteps),
  "knapsack": toEntry(knapsack.knapsackMeta, knapsack.generateSteps),
  "lis": toEntry(lis.lisMeta, lis.generateSteps),
  "lcs": toEntry(lcs.lcsMeta, lcs.generateSteps),
  "edit-distance": toEntry(editDistance.editDistanceMeta, editDistance.generateSteps),
  "matrix-chain": toEntry(matrixChain.matrixChainMeta, matrixChain.generateSteps),

  // Greedy
  "huffman": toEntry(huffman.huffmanMeta, huffman.generateSteps),
  "activity-selection": toEntry(activitySelection.activitySelectionMeta, activitySelection.generateSteps),
  "fractional-knapsack": toEntry(fractionalKnapsack.fractionalKnapsackMeta, fractionalKnapsack.generateSteps),

  // Backtracking
  "n-queens": toEntry(nQueens.nQueensMeta, nQueens.generateSteps),
  "sudoku": toEntry(sudoku.sudokuMeta, sudoku.generateSteps),
  "rat-in-maze": toEntry(ratInMaze.ratInMazeMeta, ratInMaze.generateSteps),
  "word-search": toEntry(wordSearch.wordSearchMeta, wordSearch.generateSteps),
  "permutations": toEntry(permutations.permutationsMeta, permutations.generateSteps),

  // Recursion
  "factorial": toEntry(factorial.factorialMeta, factorial.generateSteps),
  "hanoi": toEntry(hanoi.hanoiMeta, hanoi.generateSteps),
  "rec-binary-search": toEntry(recBinarySearch.recBinarySearchMeta, (input: number[]) => recBinarySearch.generateSteps(input, 40)),
  "merge-sort-rec": toEntry(mergeSortRec.mergeSortRecMeta, mergeSortRec.generateSteps),
  "quick-sort-rec": toEntry(quickSortRec.quickSortRecMeta, quickSortRec.generateSteps),
};

export const categoriesConfig: Record<AlgorithmCategory, { label: string; algorithms: string[] }> = {
  sorting: {
    label: "Sorting",
    algorithms: [
      "bubble-sort",
      "selection-sort",
      "insertion-sort",
      "merge-sort",
      "quick-sort",
      "heap-sort",
      "counting-sort",
      "radix-sort",
      "bucket-sort",
      "shell-sort",
    ],
  },
  searching: {
    label: "Searching",
    algorithms: [
      "linear-search",
      "binary-search",
      "jump-search",
      "exponential-search",
      "interpolation-search",
    ],
  },
  "linked-lists": {
    label: "Linked Lists",
    algorithms: [
      "ll-traversal",
      "ll-insert",
      "ll-delete",
      "ll-reverse",
      "ll-detect-cycle",
      "ll-merge-lists",
    ],
  },
  stacks: {
    label: "Stacks",
    algorithms: ["stack-push", "stack-pop", "stack-peek"],
  },
  queues: {
    label: "Queues",
    algorithms: ["queue-enqueue", "queue-dequeue", "circular-queue", "priority-queue"],
  },
  trees: {
    label: "Trees",
    algorithms: ["bst", "avl", "tree-heap", "trie", "segment-tree", "fenwick-tree"],
  },
  graphs: {
    label: "Graphs",
    algorithms: [
      "bfs",
      "dfs",
      "dijkstra",
      "bellman-ford",
      "floyd-warshall",
      "prim",
      "kruskal",
      "topological-sort",
      "union-find",
    ],
  },
  "dynamic-programming": {
    label: "Dynamic Programming",
    algorithms: ["fib-memo", "coin-change", "knapsack", "lis", "lcs", "edit-distance", "matrix-chain"],
  },
  greedy: {
    label: "Greedy",
    algorithms: ["huffman", "activity-selection", "fractional-knapsack"],
  },
  backtracking: {
    label: "Backtracking",
    algorithms: ["n-queens", "sudoku", "rat-in-maze", "word-search", "permutations"],
  },
  recursion: {
    label: "Recursion",
    algorithms: ["factorial", "hanoi", "rec-binary-search", "merge-sort-rec", "quick-sort-rec"],
  },
};
