import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, tag } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    // Server-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const API_KEY = process.env.RESEND_API_KEY;
    if (!API_KEY) {
      console.error("RESEND_API_KEY environment variable not configured");
      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
    if (!AUDIENCE_ID) {
      console.error("RESEND_AUDIENCE_ID environment variable not configured");
      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 }
      );
    }

    // Resend Contacts API — add contact to audience
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
          // Tag identifies source: "ks-connect" (site), "ks-diagnose" (RDTE gate)
          ...(tag ? { first_name: tag } : {}),
        }),
      }
    );

    if (res.ok) {
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
