"""
CodingCanvas AI Support Chatbot
Deployed on Hugging Face Docker Spaces.

A customer-support assistant trained (via a curated knowledge base + system
prompt) to help parents and students with questions about CodingCanvas —
classes, pricing, curriculum, booking, and basic Python questions.

Endpoints:
  GET  /       — health check
  POST /chat   — {"message": str, "history": [{"role": "user"|"model", "text": str}]}
                 → {"response": str}

Set the HF_TOKEN secret on the Space to enable LLM answers via the
Hugging Face Inference API. Without it, the bot falls back to keyword-matched
answers from the knowledge base so it still works out of the box.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CodingCanvas Support Bot", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

MODEL_ID = os.environ.get("CHAT_MODEL", "meta-llama/Llama-3.2-3B-Instruct")

# ── The "training": everything the bot knows about CodingCanvas ──────────────
KNOWLEDGE_BASE = """
ABOUT CODINGCANVAS
- CodingCanvas is a premium online Python coding academy for kids (ages 7-16).
- Kids start with visual drag-and-drop blocks (Scratch-like) and smoothly
  transition to writing real Python code.
- Classes are LIVE and online, taught by expert teachers in small groups so no
  student feels stuck or left behind.
- Students get their own dashboard with a Python Glass Lab (an in-browser
  Python compiler supporting matplotlib charts, turtle graphics, pygame games,
  and manim animations), badges, and live virtual classrooms.

BOOKING & TRIAL
- The FIRST CLASS IS COMPLETELY FREE. Book it via the "Book Free Class" button
  on the website — a parent fills in their name, the child's name, email, and
  phone number, and the team reaches out within 24 hours to schedule.
- Contact via WhatsApp: +91 98990 41906.

CURRICULUM (3 stages)
1. Visual Blocks — logic, loops, and sequencing through drag-and-drop play.
2. Real Python — variables, functions, conditionals, and projects in the
   industry-standard language used at Google, NASA, and Pixar.
3. Creative Projects — games with pygame, art with turtle, charts with
   matplotlib, and math animations with manim.

WHY PARENTS CHOOSE US
- Designed by engineers and educators.
- Tactile, playful learning — "Where Logic Meets Play."
- Live teacher feedback directly inside the student's code editor.

TONE RULES
- Be warm, encouraging, and patient. Keep answers to 2-3 short sentences.
- Never be technical unless the user asks a programming question.
- If asked something you don't know (exact schedules, refunds, custom
  pricing), say the team will help directly and share the WhatsApp number.
- Always nudge interested parents toward booking the free trial class.
"""

SYSTEM_PROMPT = (
    "You are the friendly AI support assistant for CodingCanvas, an online "
    "Python coding academy for kids. Answer ONLY using the knowledge base "
    "below. Follow its tone rules strictly.\n\n" + KNOWLEDGE_BASE
)

# Keyword fallback used when no HF_TOKEN is configured or the LLM call fails
FAQ_FALLBACKS: list[tuple[tuple[str, ...], str]] = [
    (("price", "pricing", "cost", "fee", "charge"),
     "Your first class is completely free! 🎉 For full pricing details, check the Pricing section on our website or message us on WhatsApp at +91 98990 41906."),
    (("free", "trial", "book", "demo"),
     "You can book a totally free trial class right from the website — just hit 'Book Free Class' and our teachers will reach out within 24 hours! 🚀"),
    (("age", "old", "young", "kid"),
     "CodingCanvas is designed for kids aged 7 to 16 — we start with fun visual blocks and grow into real Python code at each child's pace. 😊"),
    (("python", "language", "learn", "code", "coding"),
     "Kids learn real Python — the same language used at Google and NASA — starting with playful drag-and-drop blocks and moving to real code, games, and animations!"),
    (("teacher", "class", "live", "online", "schedule"),
     "All classes are live and online with expert teachers in small groups, so your child always gets personal attention. Book a free class to experience it!"),
    (("contact", "phone", "whatsapp", "email", "reach"),
     "You can reach our team on WhatsApp at +91 98990 41906 — or book a free class and we'll contact you within 24 hours!"),
]

DEFAULT_FALLBACK = (
    "Great question! Our team can help you with that directly on WhatsApp at "
    "+91 98990 41906 — or book a free trial class and we'll reach out within 24 hours! 😊"
)


class ChatMessage(BaseModel):
    role: str  # "user" | "model"
    text: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    response: str
    source: str  # "llm" | "faq"


@app.get("/")
def health():
    return {"status": "ok", "bot": "CodingCanvas Support Bot v1.0"}


def _faq_answer(message: str) -> str:
    lowered = message.lower()
    for keywords, answer in FAQ_FALLBACKS:
        if any(k in lowered for k in keywords):
            return answer
    return DEFAULT_FALLBACK


def _llm_answer(message: str, history: list[ChatMessage]) -> str | None:
    token = os.environ.get("HF_TOKEN")
    if not token:
        return None
    try:
        from huggingface_hub import InferenceClient

        client = InferenceClient(api_key=token)
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for m in history[-10:]:  # cap context to the last 10 turns
            messages.append({
                "role": "assistant" if m.role == "model" else "user",
                "content": m.text,
            })
        messages.append({"role": "user", "content": message})

        completion = client.chat_completion(
            model=MODEL_ID,
            messages=messages,
            max_tokens=200,
            temperature=0.7,
        )
        return completion.choices[0].message.content
    except Exception as exc:
        print(f"[SupportBot] LLM call failed, using FAQ fallback: {exc}")
        return None


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    message = request.message.strip()
    if not message:
        return ChatResponse(response="Hi! How can I help you with CodingCanvas today? 😊", source="faq")

    answer = _llm_answer(message, request.history)
    if answer:
        return ChatResponse(response=answer.strip(), source="llm")
    return ChatResponse(response=_faq_answer(message), source="faq")
