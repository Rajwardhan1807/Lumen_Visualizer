import type { Step } from "@/lib/types/step";
import { createStepBuilder } from "@/lib/types/step";
import type { AlgorithmMeta } from "@/lib/types/algorithm";

export const activitySelectionMeta: AlgorithmMeta = {
  name: "Activity Selection", slug: "activity-selection", category: "greedy", difficulty: "beginner",
  tags: ["greedy", "activity-selection", "scheduling"],
  description: "Activity Selection selects the maximum number of mutually compatible activities that can be performed by a single person or machine.",
  complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
  pseudocode: [
    "sort activities by finish time ascending",
    "selected = [activities[0]]",
    "lastFinishTime = activities[0].finish",
    "for i = 1 to n-1:",
    "  if activities[i].start >= lastFinishTime:",
    "    selected.push(activities[i])",
    "    lastFinishTime = activities[i].finish",
  ],
  codeSnippets: {
    javascript: `function activitySelection(activities) {
  activities.sort((a, b) => a.finish - b.finish);
  let selected = [activities[0]];
  let lastFinish = activities[0].finish;
  for (let i = 1; i < activities.length; i++) {
    if (activities[i].start >= lastFinish) {
      selected.push(activities[i]);
      lastFinish = activities[i].finish;
    }
  }
  return selected;
}`,
    python: `def activity_selection(activities):
    activities.sort(key=lambda x: x['finish'])
    selected = [activities[0]]
    last_finish = activities[0]['finish']
    for i in range(1, len(activities)):
        if activities[i]['start'] >= last_finish:
            selected.append(activities[i])
            last_finish = activities[i]['finish']
    return selected`,
    java: `List<Activity> selectActivities(List<Activity> list) {
    list.sort(Comparator.comparingInt(a -> a.finish));
    List<Activity> selected = new ArrayList<>();
    selected.add(list.get(0));
    int lastFinish = list.get(0).finish;
    for (int i = 1; i < list.size(); i++) {
        if (list.get(i).start >= lastFinish) {
            selected.add(list.get(i));
            lastFinish = list.get(i).finish;
        }
    }
    return selected;
}`,
    cpp: `vector<Activity> selectActivities(vector<Activity>& list) {
    sort(list.begin(), list.end(), [](Activity a, Activity b){ return a.finish < b.finish; });
    vector<Activity> selected = {list[0]};
    int lastFinish = list[0].finish;
    for (size_t i = 1; i < list.size(); i++) {
        if (list[i].start >= lastFinish) {
            selected.push_back(list[i]);
            lastFinish = list[i].finish;
        }
    }
    return selected;
}`,
  },
  defaultInput: {
    activities: [
      { start: 1, finish: 4, name: "A1" },
      { start: 3, finish: 5, name: "A2" },
      { start: 0, finish: 6, name: "A3" },
      { start: 5, finish: 7, name: "A4" },
      { start: 8, finish: 9, name: "A5" },
    ],
  },
};

export function generateSteps(input: { activities: Array<{ start: number; finish: number; name: string }> }): Step[] {
  const { activities } = input || activitySelectionMeta.defaultInput;
  const steps: Step[] = [];
  const { msg } = createStepBuilder();

  steps.push(msg("Sorting activities by finish time ascending", "Activity selection started", 0));

  const sorted = [...activities].sort((a, b) => a.finish - b.finish);

  for (let idx = 0; idx < sorted.length; idx++) {
    steps.push({
      type: "greedyPick",
      itemIndex: idx,
      runningTotal: 0,
      picked: false,
      reason: `Sorted item: ${sorted[idx].name} (start: ${sorted[idx].start}, finish: ${sorted[idx].finish})`,
      pseudocodeLine: 0,
    });
  }

  // Select first activity
  steps.push({
    type: "greedyPick",
    itemIndex: 0,
    runningTotal: 1,
    picked: true,
    reason: `Greedily pick first activity ${sorted[0].name}`,
    pseudocodeLine: 1,
  });

  let lastFinish = sorted[0].finish;
  let count = 1;

  for (let i = 1; i < sorted.length; i++) {
    const act = sorted[i];
    steps.push({
      type: "greedyPick",
      itemIndex: i,
      runningTotal: count,
      picked: false,
      reason: `Evaluating ${act.name}: start ${act.start} vs last finish ${lastFinish}`,
      pseudocodeLine: 4,
    });

    if (act.start >= lastFinish) {
      count++;
      lastFinish = act.finish;
      steps.push({
        type: "greedyPick",
        itemIndex: i,
        runningTotal: count,
        picked: true,
        reason: `Compatible! Picking ${act.name}`,
        pseudocodeLine: 5,
      });
    } else {
      steps.push({
        type: "greedyPick",
        itemIndex: i,
        runningTotal: count,
        picked: false,
        reason: `Overlaps with last finish time ${lastFinish}. Skipping ${act.name}.`,
        pseudocodeLine: 4,
      });
    }
  }

  return steps;
}
