import type { Step } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const factorialMeta: AlgorithmMeta = {
  name: "Factorial (Recursion)",
  slug: "factorial",
  category: "recursion",
  difficulty: "beginner",
  description: "Factorial demonstrates recursion: n! = n × (n-1)! with base case 0! = 1. Each recursive call pushes a frame onto the call stack; return values bubble back up.",
  complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)" },
  pseudocode: [
    "factorial(n):",
    "  if n == 0: return 1  // base case",
    "  result = n * factorial(n - 1)",
    "  return result",
  ],
  codeSnippets: {
    javascript: `function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}`,
    python: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)`,
    java: `int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}`,
    cpp: `int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}`,
  },
  defaultInput: 5,
};

export function generateSteps(n: number): Step[] {
  let startVal = typeof n === "number" ? n : 5;
  if (isNaN(startVal) || startVal < 0 || startVal > 10) startVal = 5;
  const steps: Step[] = [];
  let callIdCounter = 0;

  function factorial(val: number, parentCallId: string | null, depth: number): number {
    const callId = `call-${callIdCounter++}`;

    steps.push({
      type: "call",
      fn: "factorial",
      args: { n: val },
      callId,
      parentCallId,
      depth,
      narration: `Calling factorial(${val})`,
      pseudocodeLine: 0,
      codeLine: { javascript: 1, python: 1, java: 1, cpp: 1 },
    });

    if (val === 0) {
      steps.push({
        type: "return",
        callId,
        value: 1,
        narration: `Base case: factorial(0) = 1`,
        pseudocodeLine: 1,
        codeLine: { javascript: 2, python: 2, java: 2, cpp: 2 },
      });
      return 1;
    }

    const subResult = factorial(val - 1, callId, depth + 1);
    const result = val * subResult;

    steps.push({
      type: "return",
      callId,
      value: result,
      narration: `factorial(${val}) = ${val} × ${subResult} = ${result}`,
      pseudocodeLine: 2,
      codeLine: { javascript: 3, python: 4, java: 3, cpp: 3 },
    });

    return result;
  }

  factorial(startVal, null, 0);
  return steps;
}
