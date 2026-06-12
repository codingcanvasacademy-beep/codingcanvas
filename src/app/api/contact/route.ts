import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendTelegramMessage } from "@/utils/automation/telegram";

/**
 * POST /api/contact
 *
 * Handles "Book a Free Class" form submissions:
 * 1. Saves the lead to Supabase (free_class_requests table)
 * 2. Sends an instant Telegram alert to the owner's chat
 * 3. Forwards booking details to n8n webhook for Gmail notification
 *
 * n8n workflow responsibilities:
 *   - Send confirmation email to the parent via Gmail
 *   - Notify the teacher team in their group chat
 *   - Tag lead in CRM / tracking sheet
 */
export async function POST(req: NextRequest) {
  let body: {
    parent_name?: string;
    child_name?: string;
    email?: string;
    phone?: string;
    [key: string]: unknown;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { parent_name, child_name, email, phone } = body;

  // Validate required fields
  if (!parent_name || !child_name || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields: parent_name, child_name, email, phone" }, { status: 422 });
  }

  // ── Step 1: Save to Supabase ──────────────────────────────────────────────
  try {
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("free_class_requests").insert([
      {
        parent_name,
        child_name,
        email,
        phone,
        status: "pending",
      },
    ]);

    if (dbError) {
      console.error("[Contact] Supabase insert error:", dbError);
      return NextResponse.json({ error: "Database error. Please try again." }, { status: 500 });
    }
  } catch (err) {
    console.error("[Contact] Supabase connection error:", err);
    return NextResponse.json({ error: "Could not save your request." }, { status: 500 });
  }

  // ── Step 2: Instant Telegram alert to the owner ───────────────────────────
  // Non-blocking: a Telegram failure must never fail the booking itself.
  try {
    const tg = await sendTelegramMessage(
      `🎉 <b>New Free Class Request!</b>\n\n` +
        `👤 Parent: <b>${parent_name}</b>\n` +
        `🧒 Child: <b>${child_name}</b>\n` +
        `📧 Email: ${email}\n` +
        `📱 Phone: +91 ${phone}\n\n` +
        `⏰ ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST\n` +
        `Reach out within 24 hours to schedule the trial class!`
    );
    if (!tg.success) {
      console.error("[Contact] Telegram notification failed:", tg.error);
    }
  } catch (err) {
    console.error("[Contact] Telegram notification error:", err);
  }

  // ── Step 3: Forward to n8n for Gmail notification ─────────────────────────
  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

  if (N8N_WEBHOOK_URL) {
    try {
      const n8nPayload = {
        source: "codingcanvas_booking",
        event: "free_class_requested",
        timestamp: new Date().toISOString(),
        lead: {
          parent_name,
          child_name,
          email,
          phone,
        },
      };

      const n8nRes = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload),
      });

      if (!n8nRes.ok) {
        // Non-blocking: log the failure but don't fail the user request
        console.error("[Contact] n8n webhook returned:", n8nRes.status);
      }
    } catch (err) {
      // Non-blocking: n8n is optional
      console.error("[Contact] Failed to reach n8n:", err);
    }
  } else {
    // Log booking locally when n8n is not configured
    console.log("[Contact] N8N_WEBHOOK_URL not set — booking saved to Supabase only:", {
      parent_name,
      child_name,
      email,
    });
  }

  return NextResponse.json({ status: "success", message: "Your free class request has been received!" });
}
