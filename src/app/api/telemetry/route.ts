import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/telemetry
 *
 * Receives student code execution events from the compiler frontend
 * and forwards them to the n8n webhook for progress analysis.
 *
 * n8n workflow responsibilities:
 *   - Classify students as on-track / struggling / advanced
 *   - Aggregate error patterns to surface to instructors
 *   - Power the Help AI with real usage context
 */
export async function POST(req: NextRequest) {
  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

  let body: {
    event?: string;
    stderr?: string;
    codeLength?: number;
    [key: string]: unknown;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = {
    source: "codingcanvas_compiler",
    timestamp: new Date().toISOString(),
    event: body.event ?? "unknown", // "run_success" | "run_error"
    stderr: body.stderr ?? "",
    codeLength: body.codeLength ?? 0,
    // Additional fields passed through as-is
    ...body,
  };

  // If n8n is not yet configured, log locally and return gracefully
  if (!N8N_WEBHOOK_URL) {
    console.log("[Telemetry] N8N_WEBHOOK_URL not set — logging locally:", payload);
    return NextResponse.json({ status: "logged_locally", payload });
  }

  try {
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!n8nResponse.ok) {
      console.error("[Telemetry] n8n webhook returned:", n8nResponse.status);
      return NextResponse.json({ error: "n8n webhook error", status: n8nResponse.status }, { status: 502 });
    }

    return NextResponse.json({ status: "forwarded_to_n8n" });
  } catch (err) {
    console.error("[Telemetry] Failed to reach n8n:", err);
    return NextResponse.json({ error: "Could not reach n8n", detail: String(err) }, { status: 503 });
  }
}
