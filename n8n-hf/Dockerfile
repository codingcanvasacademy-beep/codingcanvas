# ─────────────────────────────────────────────────────────────────────────────
# CodingCanvas n8n Automation Server - Brute Force Fix
# ─────────────────────────────────────────────────────────────────────────────
FROM n8nio/n8n:latest

USER root
# Ensure the config directory is writable even on restricted environments
RUN mkdir -p /home/node/.n8n && chmod -R 777 /home/node/.n8n

# Hugging Face Config
ENV N8N_PORT=7860
ENV N8N_HOST=0.0.0.0
ENV N8N_PROTOCOL=https
ENV N8N_EDITOR_BASE_URL=https://codingcanvas-n8n.hf.space/

# Fix "Cannot GET /" by explicitly setting the path
ENV N8N_PATH=/
ENV WEBHOOK_URL=https://codingcanvas-n8n.hf.space/

# Security: Set a fixed encryption key to avoid "No encryption key" errors
ENV N8N_ENCRYPTION_KEY=codingcanvas_automation_secret_2026

# Run as node user
USER node
EXPOSE 7860
