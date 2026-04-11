import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(req: NextRequest) {
  const { mode, prompt, history } = await req.json();

  try {
    // Use gemini-1.5-flash which is powered by Gemma architecture and is free-tier available
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
      systemInstruction = `You are a friendly, helpful AI assistant for CodingCanvas, an educational Python coding platform for kids.
Your role is to:
1. Help parents and students understand the platform
2. Answer questions about Python programming in simple terms
3. Explain pricing, class schedules, and curriculum
4. Be warm, encouraging, and patient
Keep responses concise (2-3 sentences max) and friendly. Never be technical unless asked.
Platform info: CodingCanvas teaches kids Python through visual blocks (Scratch-like) and then transitions to real code. Classes are live online with a teacher. First class is free.`;
    } else if (mode === "password_judge") {
      systemInstruction = `You are a strict cybersecurity expert who evaluates password strength.
You must respond with ONLY a valid JSON object (no markdown) in this exact format:
{
  "strength": "WEAK" | "MEDIUM" | "STRONG",
  "feedback": "Snappy, 1-sentence feedback explaining why it's weak/medium/strong (e.g., 'Too short!', 'Good mix of characters, but add a number.')"
}`;
    }

    const chat = model.startChat({
      history: (history || []).map((m: { role: string; text: string }) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      systemInstruction: systemInstruction,
    });

    const result = await chat.sendMessage(userPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "AI service unavailable. Please try again." },
      { status: 500 }
    );
  }
}
