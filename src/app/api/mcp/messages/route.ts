import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/mcp/messages
 * 
 * Secure endpoint for the OpenClaw bot to fetch unprocessed activity.
 * Protected by INTERNAL_BOT_TOKEN.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("x-mcp-token");
  const expectedToken = process.env.INTERNAL_BOT_TOKEN;

  if (!expectedToken || authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // 1. Fetch unnotified Bookings
    const { data: bookings, error: bookingError } = await supabase
      .from("free_class_requests")
      .select("*")
      .eq("notified", false)
      .order("created_at", { ascending: true });

    if (bookingError) throw bookingError;

    // 2. Fetch unnotified Telemetry (Significant events)
    // For now, we focus on bookings as per user request
    
    return NextResponse.json({
      bookings: bookings || [],
      count: (bookings?.length || 0),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[MCP] Fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
