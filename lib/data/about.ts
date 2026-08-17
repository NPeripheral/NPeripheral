/**
 * About.
 *
 * No founding date we cannot evidence, no client count, no milestones that
 * did not happen. What is here is a position and a set of commitments — both
 * things that are true on day one.
 */

export type Value = {
  title: string;
  description: string;
};

export const values: Value[] = [
  {
    title: "Say what the work is",
    description:
      "Scope, timelines and pricing in plain language before anything starts. No line item you cannot explain to your accountant.",
  },
  {
    title: "Consistency over spikes",
    description:
      "A steady presence beats one viral post you cannot repeat. We build for the version of your business that still has to post next month.",
  },
  {
    title: "Fit the business, not the template",
    description:
      "The right plan for a two-person shop is not a shrunken version of an enterprise plan. Scope follows what you actually need.",
  },
  {
    title: "Honest about what marketing does",
    description:
      "Social media improves how you show up and who finds you. It is not a guarantee of revenue, and anyone promising one is selling something else.",
  },
];

export const commitments = [
  "You always know what is being posted, where, and why.",
  "You own every account, asset and login we touch — they are yours, not ours.",
  "If something is not working, you hear it from us before you notice it yourself.",
  "No long lock-in. The work should keep you, not a contract.",
];

export const positioning = {
  headline: "Your business doesn't need to be everywhere.",
  emphasis: "It needs to appear where your audience is.",
  body: "NPeripheral is a social media marketing company built on a simple idea: most businesses do not have a visibility problem so much as a consistency problem. Being present on five platforms badly is worse than being present on one deliberately. We help you pick the ground worth holding, then help you hold it.",
};
