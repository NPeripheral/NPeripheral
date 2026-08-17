import { NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

/**
 * Newsletter signup endpoint.
 *
 * Ready to connect to a real ESP — set NEWSLETTER_PROVIDER_API_KEY and
 * NEWSLETTER_PROVIDER_LIST_ID (e.g. Klaviyo, Mailchimp, HubSpot marketing
 * email) and replace the block below with that provider's subscribe call.
 * Until those env vars are set, submissions are accepted and logged only.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.NEWSLETTER_PROVIDER_API_KEY;

  if (!apiKey) {
    console.info("[newsletter] (stub, no provider configured)", parsed.data);
    return NextResponse.json({
      ok: true,
      stub: true,
      message: "You're on the list — connect NEWSLETTER_PROVIDER_API_KEY to go live.",
    });
  }

  // Example real integration (Klaviyo) once NEWSLETTER_PROVIDER_API_KEY exists:
  // await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Klaviyo-API-Key ${apiKey}`,
  //     "Content-Type": "application/vnd.api+json",
  //     revision: "2024-10-15",
  //   },
  //   body: JSON.stringify({ /* ... */ }),
  // });

  return NextResponse.json({ ok: true });
}
