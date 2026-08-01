import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const pushMeta: AlgorithmMeta = {
  name: "Stack Push", slug: "stack-push", category: "stacks", difficulty: "beginner",
  tags: ["stack", "push", "data-structures"],
  description: "Push adds an element to the top of the stack. Last-In, First-Out (LIFO) ordering is preserved.",
  complexity: { best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
  pseudocode: [
    "if stack is full: return overflow",
    "top = top + 1",
    "stack[top] = value",
  ],
  codeSnippets: {
    javascript: `function push(stack, value) {
  stack.push(value);
  return stack;
}`,
    python: `def push(stack, value):
    stack.append(value)
    return stack`,
    java: `void push(Stack<Integer> stack, int value) {
    stack.push(value);
}`,
    cpp: `void push(stack<int>& s, int value) {
    s.push(value);
}`,
  },
  defaultInput: [10, 20, 30],
};

export const popMeta: AlgorithmMeta = {
  name: "Stack Pop", slug: "stack-pop", category: "stacks", difficulty: "beginner",
  tags: ["stack", "pop", "data-structures"],
  description: "Pop removes and returns the top element of the stack. Decrements the top pointer.",
  complexity: { best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
  pseudocode: [
    "if stack is empty: return underflow",
    "value = stack[top]",
    "top = top - 1",
    "return value",
  ],
  codeSnippets: {
    javascript: `function pop(stack) {
  if (stack.length === 0) return null;
  return stack.pop();
}`,
    python: `def pop(stack):
    if len(stack) == 0: return None
    return stack.pop()`,
    java: `int pop(Stack<Integer> stack) {
    if (stack.isEmpty()) return -1;
    return stack.pop();
}`,
    cpp: `int pop(stack<int>& s) {
    if (s.empty()) return -1;
    int val = s.top();
    s.pop();
    return val;
}`,
  },
  defaultInput: [10, 20, 30],
};

export const peekMeta: AlgorithmMeta = {
  name: "Stack Peek", slug: "stack-peek", category: "stacks", difficulty: "beginner",
  tags: ["stack", "peek", "data-structures"],
  description: "Peek returns the top element of the stack without removing it.",
  complexity: { best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
  pseudocode: [
    "if stack is empty: return null",
    "return stack[top]",
  ],
  codeSnippets: {
    javascript: `function peek(stack) {
  if (stack.length === 0) return null;
  return stack[stack.length - 1];
}`,
    python: `def peek(stack):
    if len(stack) == 0: return None
    return stack[-1]`,
    java: `int peek(Stack<Integer> stack) {
    if (stack.isEmpty()) return -1;
    return stack.peek();
}`,
    cpp: `int peek(stack<int>& s) {
    if (s.empty()) return -1;
    return s.top();
}`,
  },
  defaultInput: [10, 20, 30],
};

export function generatePushSteps(input: number[], val = 40): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();
  steps.push(msg(`Initiating Stack Push of value ${val}`, "Push operation started", 0));
  steps.push({
    type: "push",
    value: val,
    narration: `Pushed value ${val} to the top of the stack`,
    pseudocodeLine: 2,
  });
  return steps;
}

export function generatePopSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();
  if (input.length === 0) {
    steps.push(msg("Stack is empty. Underflow exception.", "Underflow error", 0));
    return steps;
  }
  const topVal = input[input.length - 1];
  steps.push(msg(`Initiating Stack Pop. Current top is ${topVal}`, "Pop operation started", 0));
  steps.push({
    type: "pop",
    value: topVal,
    narration: `Popped top element ${topVal} from stack`,
    pseudocodeLine: 2,
  });
  return steps;
}

export function generatePeekSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  const { msg } = createStepBuilder();
  if (input.length === 0) {
    steps.push(msg("Stack is empty. Cannot peek.", "Peek error", 0));
    return steps;
  }
  const topVal = input[input.length - 1];
  steps.push(msg(`Initiating Stack Peek`, "Peek operation started", 0));
  steps.push({
    type: "peek",
    value: topVal,
    narration: `Inspected top element: ${topVal}`,
    pseudocodeLine: 1,
  });
  return steps;
}
