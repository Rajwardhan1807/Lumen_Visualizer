import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const hanoiMeta: AlgorithmMeta = {
  name: "Tower of Hanoi", slug: "hanoi", category: "recursion", difficulty: "intermediate",
  tags: ["recursion", "hanoi", "puzzles"],
  description: "Tower of Hanoi is a mathematical puzzle where we have three rods and n disks. The objective is to move the entire stack to another rod under simple rules.",
  complexity: { best: "O(2^n)", average: "O(2^n)", worst: "O(2^n)", space: "O(n)" },
  pseudocode: [
    "solveHanoi(n, from, to, aux):",
    "  if n == 1: move disk 1 from -> to; return",
    "  solveHanoi(n-1, from, aux, to)",
    "  move disk n from -> to",
    "  solveHanoi(n-1, aux, to, from)",
  ],
  codeSnippets: {
    javascript: `function solveHanoi(n, from, to, aux) {
  if (n === 1) {
    console.log(\`Move disk 1 from \${from} to \${to}\`);
    return;
  }
  solveHanoi(n - 1, from, aux, to);
  console.log(\`Move disk \${n} from \${from} to \${to}\`);
  solveHanoi(n - 1, aux, to, from);
}`,
    python: `def solve_hanoi(n, from_rod, to_rod, aux_rod):
    if n == 1:
        print(f"Move disk 1 from {from_rod} to {to_rod}")
        return
    solve_hanoi(n - 1, from_rod, aux_rod, to_rod)
    print(f"Move disk {n} from {from_rod} to {to_rod}")
    solve_hanoi(n - 1, aux_rod, to_rod, from_rod)`,
    java: `void solveHanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        System.out.println("Move disk 1 from " + from + " to " + to);
        return;
    }
    solveHanoi(n - 1, from, aux, to);
    System.out.println("Move disk " + n + " from " + from + " to " + to);
    solveHanoi(n - 1, aux, to, from);
}`,
    cpp: `void solveHanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        cout << "Move disk 1 from " << from << " to " << to << endl;
        return;
    }
    solveHanoi(n - 1, from, aux, to);
    cout << "Move disk " << n << " from " << from << " to " << to << endl;
    solveHanoi(n - 1, aux, to, from);
}`,
  },
  defaultInput: 3,
};

export function generateSteps(n: number): Step[] {
  let disks = typeof n === "number" ? n : 3;
  if (isNaN(disks) || disks < 1 || disks > 5) disks = 3;

  const steps: Step[] = [];
  const { msg } = createStepBuilder();
  let callIdCounter = 0;

  function hanoi(d: number, from: string, to: string, aux: string, parentCallId: string | null, depth: number) {
    const callId = `hanoi-${callIdCounter++}`;
    steps.push({
      type: "call",
      fn: "solveHanoi",
      args: { n: d, from, to, aux },
      callId,
      parentCallId,
      depth,
      narration: `Call solveHanoi(n=${d}, from=${from}, to=${to}, aux=${aux})`,
      pseudocodeLine: 0,
    });

    if (d === 1) {
      steps.push({
        type: "move",
        fromIndex: from === "A" ? 0 : from === "B" ? 1 : 2,
        toIndex: to === "A" ? 0 : to === "B" ? 1 : 2,
        narration: `Move disk 1 from rod ${from} to rod ${to}`,
        pseudocodeLine: 1,
      });
      steps.push({
        type: "return",
        callId,
        value: null,
        narration: "Base case return",
        pseudocodeLine: 1,
      });
      return;
    }

    hanoi(d - 1, from, aux, to, callId, depth + 1);

    steps.push({
      type: "move",
      fromIndex: from === "A" ? 0 : from === "B" ? 1 : 2,
      toIndex: to === "A" ? 0 : to === "B" ? 1 : 2,
      narration: `Move disk ${d} from rod ${from} to rod ${to}`,
      pseudocodeLine: 3,
    });

    hanoi(d - 1, aux, to, from, callId, depth + 1);

    steps.push({
      type: "return",
      callId,
      value: null,
      narration: `solveHanoi(n=${d}) finished`,
      pseudocodeLine: 4,
    });
  }

  hanoi(disks, "A", "C", "B", null, 0);
  return steps;
}
