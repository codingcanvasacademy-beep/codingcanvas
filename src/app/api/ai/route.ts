import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Primary AI: Google Gemini (reliable, free-tier available)
// Secondary AI: Hugging Face Inference API (huggingface mode)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Hugging Face Inference API endpoint
const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

/**
 * Calls the Hugging Face Inference API as a fallback/alternative AI provider.
 * Used when mode === "huggingface" or when HUGGINGFACE_API_KEY is set and Gemini fails.
 */
async function callHuggingFace(systemPrompt: string, userPrompt: string): Promise<string> {
  const hfKey = process.env.HUGGINGFACE_API_KEY;
  if (!hfKey) throw new Error("HUGGINGFACE_API_KEY not set");

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hfKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: `<s>[INST] ${systemPrompt}\n\nUser: ${userPrompt} [/INST]`,
      parameters: { max_new_tokens: 256, temperature: 0.7 },
    }),
  });

  if (!response.ok) throw new Error(`HF API error: ${response.status}`);
  const data = await response.json();
  // HF returns an array with generated_text
  const raw: string = Array.isArray(data) ? data[0]?.generated_text || "" : data.generated_text || "";
  // Strip the instruction prefix echoed back by the model
  const marker = "[/INST]";
  const idx = raw.lastIndexOf(marker);
  return idx !== -1 ? raw.slice(idx + marker.length).trim() : raw.trim();
}

export async function POST(req: NextRequest) {
  const { mode, prompt, history } = await req.json();

  // ── Support chat via the dedicated HF Spaces chatbot (when deployed) ──────
  // Falls through to Gemini below if the Space is unreachable.
  if (mode === "support_chat" && process.env.HF_CHATBOT_URL) {
    try {
      const res = await fetch(`${process.env.HF_CHATBOT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, history: history || [] }),
        signal: AbortSignal.timeout(20000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          return NextResponse.json({ response: data.response });
        }
      }
      console.error("[AI] HF chatbot Space returned:", res.status);
    } catch (err) {
      console.error("[AI] HF chatbot Space unreachable, falling back to Gemini:", err);
    }
  }

  // ── Hugging Face direct mode ──────────────────────────────────────────────
  if (mode === "huggingface") {
    try {
      const systemPrompt =
        "You are a friendly AI assistant for CodingCanvas, a Python coding platform for kids. Answer helpfully and concisely.";
      const answer = await callHuggingFace(systemPrompt, prompt || "");
      return NextResponse.json({ response: answer });
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 503 });
    }
  }

  // ── Gemini modes (primary) ────────────────────────────────────────────────
  try {
    let systemInstruction = "";
    const userPrompt = prompt;

    if (mode === "block_generator") {
      systemInstruction = `You are a Python coding expert helping a teacher create custom code blocks for a kids' visual programming sandbox.
The teacher will describe a Python concept or code they want as a block.
You must respond with ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "label": "Human-friendly block name (max 3 words)",
  "type": "print|loop|variable|math|logic",
  "defaultVal": "the default value shown in the block input",
  "pythonCode": "the Python code template where {val} is the placeholder for user input"
}
Example: if teacher says "block that prints a number doubled", respond:
{"label":"Print Doubled","type":"print","defaultVal":"5","pythonCode":"print({val} * 2)"}`;
    } else if (mode === "support_chat") {
      let customFaqsText = "";
      try {
        const { createClient } = await import("@/utils/supabase/server");
        const supabase = await createClient();
        const { data: faqs } = await supabase.from("ai_faqs").select("question, answer");
        if (faqs && faqs.length > 0) {
          customFaqsText =
            "\nHere are custom FAQs provided by the host. Please use these to answer matching user questions exactly:\n" +
            faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
        }
      } catch (e) {
        console.error("Failed to load FAQs", e);
      }

      systemInstruction = `You are a friendly, helpful AI assistant for CodingCanvas, an educational Python coding platform for kids.
Your role is to:
1. Help parents and students understand the platform
2. Answer questions about Python programming in simple terms
3. Explain pricing, class schedules, and curriculum
4. Be warm, encouraging, and patient
Keep responses concise (2-3 sentences max) and friendly. Never be technical unless asked.
Platform info: CodingCanvas teaches kids Python through visual blocks (Scratch-like) and then transitions to real code. Classes are live online with a teacher. First class is free.${customFaqsText}`;
    } else if (mode === "password_judge") {
      systemInstruction = `You are a strict cybersecurity expert who evaluates password strength.
You must respond with ONLY a valid JSON object (no markdown) in this exact format:
{
  "strength": "WEAK" | "MEDIUM" | "STRONG",
  "feedback": "Snappy, 1-sentence feedback explaining why it's weak/medium/strong (e.g., 'Too short!', 'Good mix of characters, but add a number.')"
}`;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const chat = model.startChat({
      history: (history || []).map((m: { role: string; text: string }) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    });

    const result = await chat.sendMessage(userPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("AI API error:", error);

    // Fallback Mock Responses for Demo Environment when API Key is invalid
    if (
      String(error).includes("API_KEY_INVALID") ||
      process.env.GOOGLE_AI_API_KEY?.startsWith("AIzaSyAV") ||
      !process.env.GOOGLE_AI_API_KEY
    ) {
      if (mode === "support_chat") {
        return NextResponse.json({
          response:
            "For demo purposes: Python classes start at just $15/session, and the first entire month is free! Let us know if you need help setting up.",
        });
      } else if (mode === "password_judge") {
        return NextResponse.json({
          response: '{"strength": "MEDIUM", "feedback": "Nice try, but add a symbol or number!"}',
        });
      } else if (mode === "block_generator") {
        return NextResponse.json({
          response: '{"label": "Mock Print", "type": "print", "defaultVal": "Hello", "pythonCode": "print({val})"}',
        });
      }
    }

    return NextResponse.json({ error: "AI service unavailable. Please try again." }, { status: 500 });
  }
}
