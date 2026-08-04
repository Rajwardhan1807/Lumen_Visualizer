import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const coinChangeMeta: AlgorithmMeta = {
  name: "Coin Change", slug: "coin-change", category: "dynamic-programming", difficulty: "intermediate",
  tags: ["dynamic-programming", "coin-change", "minimum"],
  description: "Given a set of coins and a target amount, find the minimum number of coins needed to make that amount.",
  complexity: { best: "O(n * amount)", average: "O(n * amount)", worst: "O(n * amount)", space: "O(amount)" },
  pseudocode: [
    "dp[0] = 0, all other dp[i] = infinity",
    "for i = 1 to amount:",
    "  for coin in coins:",
    "    if i - coin >= 0:",
    "      dp[i] = min(dp[i], dp[i - coin] + 1)",
  ],
  codeSnippets: {
    javascript: `function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    python: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    java: `int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
  },
  defaultInput: { coins: [1, 2, 5], amount: 11 },
};

export function generateSteps(input: { coins: number[]; amount: number }): Step[] {
  const { coins, amount } = input || coinChangeMeta.defaultInput;
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg(`Finding min coins for amount ${amount} using coins: [${coins.join(", ")}]`, "DP coin change started", 0));

  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let idx = 0; idx <= amount; idx++) {
    steps.push({
      type: "fillCell",
      row: 0,
      col: idx,
      value: dp[idx] === Infinity ? "∞" : dp[idx],
      state: idx === 0 ? "sorted" : "default",
      narration: `Initialize dp[${idx}] = ${dp[idx] === Infinity ? "∞" : 0}`,
      pseudocodeLine: 0,
    });
  }

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        steps.push({
          type: "highlightCell",
          cells: [[0, i], [0, i - coin]],
          state: "comparing",
          narration: `Checking dp[${i}] against dp[${i} - ${coin}] + 1`,
          pseudocodeLine: 3,
        });

        const original = dp[i];
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);

        if (dp[i] < original) {
          steps.push({
            type: "fillCell",
            row: 0,
            col: i,
            value: dp[i],
            state: "sorted",
            narration: `Updated dp[${i}] to min(${original === Infinity ? "∞" : original}, ${dp[i - coin]} + 1) = ${dp[i]}`,
            pseudocodeLine: 4,
          });
        }
      }
    }
  }

  return steps;
}
