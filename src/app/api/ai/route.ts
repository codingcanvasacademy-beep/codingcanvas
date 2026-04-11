import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(req: NextRequest) {
  const { mode, prompt, history } = await req.json();

  try {
    // Use gemini-1.5-flash which is powered by Gemma architecture and is free-tier available
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
          customFaqsText = "\nHere are custom FAQs provided by the host. Please use these to answer matching user questions exactly:\n" + faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
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
      systemInstruction: systemInstruction 
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
    if (String(error).includes("API_KEY_INVALID") || process.env.GOOGLE_AI_API_KEY?.startsWith("AIzaSyAV") || !process.env.GOOGLE_AI_API_KEY) {
      if (mode === "support_chat") {
         return NextResponse.json({ response: "For demo purposes: Python classes start at just $15/session, and the first entire month is free! Let us know if you need help setting up." });
      } else if (mode === "password_judge") {
         return NextResponse.json({ response: '{"strength": "MEDIUM", "feedback": "Nice try, but add a symbol or number!"}' });
      } else if (mode === "block_generator") {
         return NextResponse.json({ response: '{"label": "Mock Print", "type": "print", "defaultVal": "Hello", "pythonCode": "print({val})"}' });
      }
    }

    return NextResponse.json(
      { error: "AI service unavailable. Please try again." },
      { status: 500 }
    );
  }
}
