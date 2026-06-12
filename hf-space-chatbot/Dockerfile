# ─────────────────────────────────────────────────────────────────────────────
# CodingCanvas AI Support Chatbot
# Hugging Face Docker Space
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim

RUN useradd -m -u 1000 bot
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

USER bot

# HF Spaces serve on port 7860 by default
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
