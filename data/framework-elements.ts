export interface FrameworkElement {
  order: number;
  name: string;
  description: string;
}

// TODO: Replace all 8 element names and descriptions with final copy from G
export const frameworkElements: FrameworkElement[] = [
  {
    order: 1,
    name: "Recognition",
    description:
      "The first step is seeing the pattern. Not analyzing it, not fixing it — just seeing it clearly enough to name it.",
  },
  {
    order: 2,
    name: "Examination",
    description:
      "Once you see the pattern, you examine its structure. Where did it start? What does it protect you from?",
  },
  {
    order: 3,
    name: "Permission",
    description:
      "You give yourself permission to operate differently. Not to be different — to operate differently. The distinction matters.",
  },
  {
    order: 4,
    name: "Replacement",
    description:
      "Old patterns don't disappear. They get replaced by patterns that serve you better. This is structural, not emotional.",
  },
  {
    order: 5,
    name: "Observation",
    description:
      "You watch the new pattern in action. Not with judgment — with curiosity. Does it hold under pressure?",
  },
  {
    order: 6,
    name: "Grounding",
    description:
      "The new pattern needs a foundation. You anchor it in daily practice until it becomes the default, not the exception.",
  },
  {
    order: 7,
    name: "Reinforcement",
    description:
      "Every time the old pattern surfaces, you choose the new one. This is not willpower. This is architecture.",
  },
  {
    order: 8,
    name: "Mastery",
    description:
      "The new pattern becomes invisible. You no longer choose it — it chooses you. The structure holds without effort.",
  },
];
