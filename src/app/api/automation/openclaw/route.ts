import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendTelegramMessage } from "@/utils/automation/telegram";

/**
 * OpenClaw Bot Orchestrator
 * Triggered by Vercel Cron.
 */
export async function GET(req: NextRequest) {
  // Check auth for cron (optional but good practice)
  // In Vercel, cron requests have 'Authorization: Bearer <CRON_SECRET>'
  
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const istHours = istTime.getUTCHours();
  const istMinutes = istTime.getUTCMinutes();

  console.log(`[OpenClaw] Checking IST Time: ${istHours}:${istMinutes}`);

  // ── Time Window Logic (10:00 AM to 7:00 PM IST) ───────────────────────────
  const isTooLate = istHours >= 19; // 7 PM or later
  const isTooEarly = istHours < 10; // Before 10 AM
  
  if (isTooLate || isTooEarly) {
    console.log("[OpenClaw] Out of vibing hours. Zzz...");
    return NextResponse.json({ status: "sleeping", istTime: `${istHours}:${istMinutes}` });
  }

  try {
    const supabase = await createClient();
    const token = process.env.INTERNAL_BOT_TOKEN;

    // ── Step 1: Query MCP (Internal Fetch) ──────────────────────────────────
    // We call our own API to keep logic separated
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.get("host")}`;
    const mcpRes = await fetch(`${baseUrl}/api/mcp/messages`, {
      headers: { "x-mcp-token": token || "" }
    });

    if (!mcpRes.ok) throw new Error("MCP fetch failed");
    const { bookings } = await mcpRes.json();

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ status: "no_new_messages" });
    }

    // ── Step 2: "Chill" Vibes Notification ──────────────────────────────────
    const vibes = [
      "Yo! Just vibing here, but you got a new free class request! ✨",
      "Fresh lead alert! Someone wants to learn Python on CodingCanvas. 🐍",
      "Hey Vaibh, the website is buzzing. Check this out! 🚀",
      "Beep boop... new friend incoming! Someone just booked a slot. 🎈"
    ];

    for (const booking of bookings) {
      const vibe = vibes[Math.floor(Math.random() * vibes.length)];
      const message = `
<b>${vibe}</b>

👤 <b>Parent:</b> ${booking.parent_name}
👶 <b>Student:</b> ${booking.child_name}
📧 <b>Email:</b> ${booking.email}
📱 <b>Phone:</b> ${booking.phone}

<i>Sent from your OpenClaw Bot</i>
      `.trim();

      const { success } = await sendTelegramMessage(message);

      if (success) {
        // Mark as notified so we don't repeat
        await supabase
          .from("free_class_requests")
          .update({ notified: true })
          .eq("id", booking.id);
      }
    }

    return NextResponse.json({ status: "success", notifiedCount: bookings.length });
  } catch (error) {
    console.error("[OpenClaw] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
