# ─────────────────────────────────────────────────────────────────────────────
# CodingCanvas Python Execution Sandbox
# Hugging Face Docker Space
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.10-slim

# System packages:
#   xvfb          — Virtual framebuffer (headless display for turtle/pygame/Qt)
#   x11-utils     — Provides xdpyinfo, useful for display diagnostics
#   python3-tk    — Tkinter backend for turtle graphics
#   libsdl2-dev   — SDL2 for pygame
#   ghostscript   — EPS-to-PNG conversion for turtle screenshots
#   fonts-dejavu  — Readable fonts for matplotlib plots
#   ffmpeg/cairo/pango/build-essential — required to build and run manim
RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb \
    x11-utils \
    python3-tk \
    libsdl2-dev \
    libsdl2-image-dev \
    libsdl2-mixer-dev \
    libsdl2-ttf-dev \
    ghostscript \
    fonts-dejavu \
    ffmpeg \
    build-essential \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user (security best practice for HF Spaces)
RUN useradd -m -u 1000 sandbox
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application
COPY app.py .

# Switch to non-root user
USER sandbox

# Start Xvfb virtual display on :99, then launch the FastAPI server
# Xvfb runs in background; uvicorn serves on port 7860 (HF Spaces default)
CMD Xvfb :99 -screen 0 1280x1024x24 -ac +extension GLX +render -noreset & \
    sleep 1 && \
    uvicorn app:app --host 0.0.0.0 --port 7860
