import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/site-config";

const leadSchema = z.object({
  name: z.string().min(1, "Please tell us your name.").max(120),
  business: z.string().max(120).optional().default(""),
  email: z.string().email("That email address looks incomplete."),
  phone: z.string().max(40).optional().default(""),
  website: z.string().max(300).optional().default(""),
  interests: z.array(z.string().max(80)).min(1, "Pick at least one service.").max(20),
  budget: z.string().max(60).optional().default(""),
  goals: z.string().min(1, "Tell us a little about your goals.").max(4000),
  contactPreference: z.enum(["email", "phone", "text"]).default("email"),
  /* Consent is required, not merely recorded — the request is rejected
     without it rather than stored with a false flag. */
  consent: z.literal(true, {
    message: "We need your permission before we can get in touch.",
  }),
  source: z.string().max(80).optional().default(""),
  /* Honeypot. Real people never see this field, so anything in it is a bot. */
  company_website: z.string().max(200).optional().default(""),
});

type Lead = z.infer<typeof leadSchema>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(lead: Lead) {
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Business", lead.business || "—"],
    ["Email", lead.email],
    ["Phone", lead.phone || "—"],
    ["Website / social", lead.website || "—"],
    ["Services", lead.interests.join(", ")],
    ["Budget", lead.budget || "Not specified"],
    ["Preferred contact", lead.contactPreference],
  ];

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Goals:",
    lead.goals,
    "",
    `Consent given: yes`,
    `Submitted: ${new Date().toISOString()}`,
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:640px;color:#111">
      <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#e2542a;margin:0 0 4px">
        New quote request
      </p>
      <h1 style="font-size:22px;margin:0 0 20px">${escapeHtml(lead.business || lead.name)}</h1>
      <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <td style="padding:8px 12px 8px 0;color:#666;white-space:nowrap;vertical-align:top;border-bottom:1px solid #eee">${escapeHtml(k)}</td>
              <td style="padding:8px 0;border-bottom:1px solid #eee">${escapeHtml(v)}</td>
            </tr>`,
          )
          .join("")}
      </table>
      <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#666;margin:24px 0 6px">Goals</p>
      <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0">${escapeHtml(lead.goals)}</p>
      <p style="font-size:12px;color:#888;margin:28px 0 0">
        Consent given · Reply directly to this email to reach ${escapeHtml(lead.name)}.
      </p>
    </div>`;

  return { text, html };
}

/**
 * Quote request endpoint.
 *
 * Delivery policy matters more than the transport here: a lead that vanishes
 * because an email API had a bad minute is worse than an error message.
 *
 *   - No delivery configured (local dev): log it, return ok. Nothing is lost
 *     because nothing was expected.
 *   - Configured and it worked: return ok.
 *   - Configured and it FAILED: return 502 with an actionable message. The
 *     form then tells the visitor to email directly, so the enquiry survives
 *     even when our plumbing does not.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return NextResponse.json(
      { error: first ?? "Please check your details and try again." },
      { status: 400 },
    );
  }

  const lead = parsed.data;

  // Silently accept and discard bot submissions — no error to tune against.
  if (lead.company_website.trim().length > 0) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL ?? "NPeripheral <onboarding@resend.dev>";
  const configured = Boolean(resendKey && notifyTo);

  if (!configured) {
    console.info(
      "[lead] no delivery configured — logged only\n" + buildEmail(lead).text,
    );
    return NextResponse.json({
      ok: true,
      delivered: false,
      message: "Thanks — we'll be in touch within one business day.",
    });
  }

  const { text, html } = buildEmail(lead);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [notifyTo],
        reply_to: lead.email,
        subject: `Quote request — ${lead.business || lead.name}`,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[lead] resend rejected the send", res.status, detail);
      console.error("[lead] UNDELIVERED ENQUIRY:\n" + text);
      return NextResponse.json(
        {
          error: `We couldn't send that automatically. Please email ${siteConfig.email} directly and we'll pick it up straight away.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      delivered: true,
      message: "Thanks — we'll be in touch within one business day.",
    });
  } catch (error) {
    console.error("[lead] resend threw", error);
    console.error("[lead] UNDELIVERED ENQUIRY:\n" + text);
    return NextResponse.json(
      {
        error: `We couldn't send that automatically. Please email ${siteConfig.email} directly and we'll pick it up straight away.`,
      },
      { status: 502 },
    );
  }
}
