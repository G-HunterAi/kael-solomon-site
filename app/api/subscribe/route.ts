import { NextResponse } from "next/server";

const SOURCE_LABELS: Record<string, string> = {
  "ks-map":      "Map of Me",
  "ks-connect":  "Connect (homepage)",
  "ks-diagnose": "Diagnose page",
};

async function notifyDiscord(email: string, tag: string) {
  const webhookUrl = process.env.DISCORD_NOTIFY_WEBHOOK;
  if (!webhookUrl) return;
  const source = SOURCE_LABELS[tag] ?? tag ?? "Unknown";
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `📬 **New signup** — \`${email}\`\n📍 Source: **${source}**`,
    }),
  }).catch(() => {});
}

async function notifyEmail(email: string, tag: string, apiKey: string) {
  const notifyTo = process.env.NOTIFY_EMAIL;
  if (!notifyTo) return;
  const source = SOURCE_LABELS[tag] ?? tag ?? "Unknown";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Kael Solomon <onboarding@resend.dev>",
      to: [notifyTo],
      subject: `New signup: ${email}`,
      html: `<p><strong>New subscriber</strong></p>
             <p>Email: <code>${email}</code></p>
             <p>Source: ${source}</p>`,
    }),
  }).catch(() => {});
}

export async function POST(request: Request) {
  try {
    const { email, tag } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const API_KEY = process.env.RESEND_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
    if (!AUDIENCE_ID) {
      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    // Add to Resend audience
    const res = await fetch(
      `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          ...(tag ? { first_name: tag } : {}),
        }),
      }
    );

    if (res.ok) {
      // Fire notifications in background — don't block response
      Promise.all([
        notifyDiscord(email, tag),
        notifyEmail(email, tag, API_KEY),
      ]);
      return NextResponse.json({ success: true });
    }

    const errorBody = await res.text();
    console.error("Resend API error:", res.status, errorBody);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
