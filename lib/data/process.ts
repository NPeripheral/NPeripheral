export type ProcessStage = {
  step: string;
  title: string;
  description: string;
  /** What actually changes hands at this stage. */
  output: string;
};

/**
 * Four steps, ending in the brand line. Each stage says what happens, not
 * what it will achieve.
 */
export const processStages: ProcessStage[] = [
  {
    step: "01",
    title: "Discover",
    description:
      "We learn about your business, your audience, your goals, and how your online presence looks right now.",
    output: "A clear read on where you currently stand",
  },
  {
    step: "02",
    title: "Strategize",
    description:
      "We identify the opportunities worth acting on and develop a social media approach built around your business — not a template.",
    output: "A written plan you sign off before anything ships",
  },
  {
    step: "03",
    title: "Create",
    description:
      "We develop the content and marketing materials your strategy calls for, formatted for the platforms they are going to live on.",
    output: "Content ready to publish",
  },
  {
    step: "04",
    title: "Appear",
    description:
      "We help you show up consistently in front of your audience, then keep refining the approach as we learn what your audience responds to.",
    output: "A presence that keeps running, and improves",
  },
];
