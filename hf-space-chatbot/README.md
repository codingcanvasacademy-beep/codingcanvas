---
title: CodingCanvas Support Bot
emoji: 🤖
colorFrom: pink
colorTo: red
sdk: docker
app_port: 7860
pinned: false
---

# CodingCanvas AI Support Chatbot

Customer-support assistant for the CodingCanvas website. It answers parent and
student questions about classes, pricing, curriculum, and booking, using a
curated knowledge base baked into the system prompt.

## Deploy

1. Create a new **Docker** Space on Hugging Face.
2. Upload `app.py`, `requirements.txt`, `Dockerfile`, and this `README.md`.
3. (Recommended) In Space **Settings → Variables and secrets**, add a secret
   `HF_TOKEN` with a Hugging Face access token so the bot can call the
   Inference API for natural LLM answers. Without it, the bot still works
   using built-in FAQ answers.
4. Optionally set the `CHAT_MODEL` variable to override the default model
   (`meta-llama/Llama-3.2-3B-Instruct`).
5. Copy the Space URL (e.g. `https://you-codingcanvas-support.hf.space`) into
   the website's `HF_CHATBOT_URL` environment variable on Vercel.

## API

```
POST /chat
{ "message": "How much do classes cost?", "history": [] }
→ { "response": "...", "source": "llm" | "faq" }
```
