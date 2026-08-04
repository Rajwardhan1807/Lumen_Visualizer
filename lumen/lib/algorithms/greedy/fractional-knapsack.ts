import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const fractionalKnapsackMeta: AlgorithmMeta = {
  name: "Fractional Knapsack", slug: "fractional-knapsack", category: "greedy", difficulty: "intermediate",
  tags: ["greedy", "knapsack", "optimization"],
  description: "Fractional Knapsack allows breaking items into fractions to maximize total knapsack value. We sort items by value-to-weight ratio in descending order.",
  complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  pseudocode: [
    "sort items by value/weight ratio descending",
    "totalValue = 0, remainingCapacity = W",
    "for each item:",
    "  if item.weight <= remainingCapacity:",
    "    totalValue += item.value; remainingCapacity -= item.weight",
    "  else:",
    "    fraction = remainingCapacity / item.weight",
    "    totalValue += item.value * fraction; break",
  ],
  codeSnippets: {
    javascript: `function fractionalKnapsack(W, items) {
  items.sort((a, b) => (b.val/b.wt) - (a.val/a.wt));
  let totalVal = 0, cap = W;
  for (let item of items) {
    if (item.wt <= cap) {
      totalVal += item.val;
      cap -= item.wt;
    } else {
      totalVal += item.val * (cap / item.wt);
      break;
    }
  }
  return totalVal;
}`,
    python: `def fractional_knapsack(W, items):
    items.sort(key=lambda x: x['val']/x['wt'], reverse=True)
    total_val = 0.0
    cap = W
    for item in items:
        if item['wt'] <= cap:
            total_val += item['val']
            cap -= item['wt']
        else:
            total_val += item['val'] * (cap / item['wt'])
            break
    return total_val`,
    java: `double fractionalKnapsack(int W, Item[] items) {
    Arrays.sort(items, (a, b) -> Double.compare((double)b.val/b.wt, (double)a.val/a.wt));
    double totalVal = 0;
    int cap = W;
    for (Item item : items) {
        if (item.wt <= cap) {
            totalVal += item.val;
            cap -= item.wt;
        } else {
            totalVal += item.val * ((double)cap / item.wt);
            break;
        }
    }
    return totalVal;
}`,
    cpp: `double fractionalKnapsack(int W, vector<Item>& items) {
    sort(items.begin(), items.end(), [](Item a, Item b){ return (double)b.val/b.wt < (double)a.val/a.wt; });
    double totalVal = 0;
    int cap = W;
    for (auto& item : items) {
        if (item.wt <= cap) {
            totalVal += item.val;
            cap -= item.wt;
        } else {
            totalVal += item.val * ((double)cap / item.wt);
            break;
        }
    }
    return totalVal;
}`,
  },
  defaultInput: {
    items: [
      { weight: 10, value: 60 },
      { weight: 20, value: 100 },
      { weight: 30, value: 120 },
    ],
    capacity: 50,
  },
};

export function generateSteps(input: { items: Array<{ weight: number; value: number }>; capacity: number }): Step[] {
  const { items, capacity } = input || fractionalKnapsackMeta.defaultInput;
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg("Sorting items by value/weight ratio descending", "Fractional knapsack started", 0));

  const sorted = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));

  for (let idx = 0; idx < sorted.length; idx++) {
    const ratio = (sorted[idx].value / sorted[idx].weight).toFixed(2);
    steps.push({
      type: "greedyPick",
      itemIndex: idx,
      runningTotal: 0,
      picked: false,
      reason: `Item ratio: ${ratio} (wt: ${sorted[idx].weight}, val: ${sorted[idx].value})`,
      pseudocodeLine: 0,
    });
  }

  let totalValue = 0;
  let remaining = capacity;

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    steps.push({
      type: "greedyPick",
      itemIndex: i,
      runningTotal: totalValue,
      picked: false,
      reason: `Evaluating item (wt: ${item.weight}, val: ${item.value}). Remaining capacity: ${remaining}`,
      pseudocodeLine: 3,
    });

    if (item.weight <= remaining) {
      totalValue += item.value;
      remaining -= item.weight;
      steps.push({
        type: "greedyPick",
        itemIndex: i,
        runningTotal: totalValue,
        picked: true,
        reason: `Fits entirely! Added ${item.value} value. Remaining capacity: ${remaining}`,
        pseudocodeLine: 4,
      });
    } else {
      const fraction = remaining / item.weight;
      const addedVal = item.value * fraction;
      totalValue += addedVal;
      steps.push({
        type: "greedyPick",
        itemIndex: i,
        runningTotal: totalValue,
        picked: true,
        reason: `Fits partially! Took fraction ${fraction.toFixed(2)} (${remaining} kg) adding ${addedVal.toFixed(2)} value.`,
        pseudocodeLine: 7,
      });
      break;
    }
  }

  steps.push(msg(`Fractional Knapsack complete. Total optimized value = ${totalValue.toFixed(2)}`, "Optimization complete", 0));
  return steps;
}
