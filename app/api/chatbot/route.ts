import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  stage: z.enum(["welcome", "business", "goal", "platforms", "qualified"]),
  message: z.string().max(500).optional(),
});

type Stage = z.infer<typeof requestSchema>["stage"];

type BotReply = {
  reply: string;
  nextStage: Stage;
  quickReplies?: string[];
  recommendation?: {
    services: string[];
    cta: string;
  };
};

const businessTypes = [
  "Local or service business",
  "Product or e-commerce brand",
  "Food, drink or hospitality",
  "Professional services",
  "Something else",
];

const goals = [
  "Post more consistently",
  "Look more professional",
  "Reach more local people",
  "Not sure yet",
];

const platformCounts = ["Just one", "Two or three", "Four or more", "None yet"];

/**
 * A short, honest triage.
 *
 * It asks three questions and suggests which services are likely relevant,
 * then hands off to the quote form. It deliberately does not estimate a
 * price, promise a result, or claim a "strategist" is standing by — it is a
 * rule-based form in conversational clothing and it should not pretend
 * otherwise.
 *
 * To upgrade to a real model later, set ANTHROPIC_API_KEY and replace the
 * branches below with a call that keeps the same constraint: suggest scope,
 * never promise outcomes.
 */
function respond(stage: Stage, message: string | undefined): BotReply {
  switch (stage) {
    case "welcome":
      return {
        reply:
          "Hi — three quick questions and I'll point you at the services that are probably relevant. It takes about twenty seconds. What kind of business is it?",
        nextStage: "business",
        quickReplies: businessTypes,
      };
    case "business":
      return {
        reply: `Got it${message ? ` — ${message.toLowerCase()}` : ""}. What would you most like social media to do better right now?`,
        nextStage: "goal",
        quickReplies: goals,
      };
    case "goal":
      return {
        reply:
          "That helps. How many platforms are you currently trying to keep active?",
        nextStage: "platforms",
        quickReplies: platformCounts,
      };
    case "platforms": {
      return {
        reply:
          "Based on that, these are the services likely worth quoting. Send the form and you'll get a real scope and price — usually within one business day.",
        nextStage: "qualified",
        recommendation: {
          services: recommendServices(message),
          cta: "Get a custom quote",
        },
      };
    }
    case "qualified":
    default:
      return {
        reply:
          "That's everything I can usefully ask. The quote form takes a couple of minutes and gets you a scope and a price with no obligation.",
        nextStage: "qualified",
      };
  }
}

/** Suggestions only — the real scope comes from a conversation. */
function recommendServices(platforms: string | undefined): string[] {
  if (!platforms || platforms.includes("None")) {
    return ["Social Media Strategy", "Social Media Optimization", "Content Strategy"];
  }
  if (platforms.includes("one")) {
    return ["Social Media Management", "Content Creation", "Community Engagement"];
  }
  if (platforms.includes("two") || platforms.includes("three")) {
    return ["Content Strategy", "Social Media Management", "Short-Form Video"];
  }
  return ["Social Media Strategy", "Social Media Optimization", "Content Strategy"];
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = respond(parsed.data.stage, parsed.data.message);
  return NextResponse.json(result);
}
