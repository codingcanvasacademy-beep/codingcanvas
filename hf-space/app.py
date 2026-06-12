"""
CodingCanvas Python Execution Sandbox
Deployed on Hugging Face Docker Spaces.

Provides a stateless HTTP endpoint that receives Python code,
runs it in a sandboxed subprocess, and returns stdout/stderr.
Supports: standard Python, turtle (headless via Xvfb), matplotlib (PNG output),
pygame (headless frame capture), and manim (rendered MP4 animation).
"""

import os
import glob
import re
import subprocess
import tempfile
import base64
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CodingCanvas Sandbox", version="1.1.0")

# Allow requests from any origin (the Next.js frontend on Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

EXECUTION_TIMEOUT = 15        # seconds — prevents runaway loops
MANIM_TIMEOUT = 90            # manim rendering is much slower than plain scripts

class CodeRequest(BaseModel):
    code: str
    language: str = "python"  # reserved for future languages

class CodeResponse(BaseModel):
    stdout: str
    stderr: str
    image: str | None = None  # base64-encoded PNG for matplotlib/turtle/pygame output
    video: str | None = None  # base64-encoded MP4 for manim animations
    error: bool

@app.get("/")
def health():
    """Health check — Hugging Face Spaces calls this to verify the Space is alive."""
    return {"status": "ok", "sandbox": "CodingCanvas Python Sandbox v1.1"}


def _eps_to_png(eps_path: str, png_path: str) -> bool:
    """Convert a turtle postscript snapshot to PNG using ghostscript."""
    try:
        result = subprocess.run(
            ["gs", "-dSAFER", "-dBATCH", "-dNOPAUSE", "-dEPSCrop",
             "-sDEVICE=png16m", "-r100", f"-sOutputFile={png_path}", eps_path],
            capture_output=True,
            timeout=20,
        )
        return result.returncode == 0 and os.path.exists(png_path)
    except Exception:
        return False


def _find_manim_scene(code: str) -> str | None:
    """Find the first class that subclasses a manim Scene so we can render it
    non-interactively (manim prompts when multiple scenes exist)."""
    match = re.search(r"class\s+(\w+)\s*\(\s*\w*Scene\w*\s*\)", code)
    return match.group(1) if match else None


def _run_manim(code: str, tmpdir: str) -> CodeResponse:
    """Render a manim scene to MP4 and return it base64-encoded."""
    scene = _find_manim_scene(code)
    if not scene:
        return CodeResponse(
            stdout="",
            stderr="Could not find a Scene class. Define one like:\n\nclass MyScene(Scene):\n    def construct(self):\n        ...",
            error=True,
        )

    code_file = os.path.join(tmpdir, "main.py")
    media_dir = os.path.join(tmpdir, "media")
    with open(code_file, "w") as f:
        f.write(code)

    env = os.environ.copy()
    env["DISPLAY"] = ":99"

    try:
        result = subprocess.run(
            [sys.executable, "-m", "manim", "render", "-ql",
             "--media_dir", media_dir, code_file, scene],
            capture_output=True,
            text=True,
            timeout=MANIM_TIMEOUT,
            cwd=tmpdir,
            env=env,
        )
    except subprocess.TimeoutExpired:
        return CodeResponse(
            stdout="",
            stderr=f"⏱ Rendering timed out after {MANIM_TIMEOUT} seconds. Try a shorter or simpler animation.",
            error=True,
        )

    video_b64 = None
    videos = glob.glob(os.path.join(media_dir, "videos", "**", "*.mp4"), recursive=True)
    # Prefer the final combined video over partial movie files
    videos = [v for v in videos if "partial_movie_files" not in v]
    if videos:
        with open(videos[0], "rb") as vf:
            video_b64 = base64.b64encode(vf.read()).decode("utf-8")

    return CodeResponse(
        stdout=result.stdout,
        stderr="" if video_b64 else result.stderr,
        video=video_b64,
        error=result.returncode != 0 and video_b64 is None,
    )


@app.post("/run", response_model=CodeResponse)
def run_code(request: CodeRequest):
    """
    Execute Python code in an isolated subprocess and return the output.

    For visual libraries:
    - matplotlib: forced onto the Agg backend, figure auto-saved to PNG
    - turtle: runs under Xvfb, canvas snapshotted to EPS then converted to PNG
    - pygame: SDL dummy driver, display.flip/update monkeypatched to save the frame
    - manim: rendered via the manim CLI, returned as base64 MP4
    """
    code = request.code.strip()
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    uses_matplotlib = "import matplotlib" in code or "from matplotlib" in code
    uses_turtle = "import turtle" in code or "from turtle" in code
    uses_pygame = "import pygame" in code or "from pygame" in code
    uses_manim = "import manim" in code or "from manim" in code

    # Prepare a temp directory for the run
    with tempfile.TemporaryDirectory() as tmpdir:
        if uses_manim:
            return _run_manim(code, tmpdir)

        code_file = os.path.join(tmpdir, "main.py")
        output_image = os.path.join(tmpdir, "output.png")
        output_eps = os.path.join(tmpdir, "output.eps")

        preamble = ""
        postamble = ""

        if uses_matplotlib:
            # Force the non-GUI backend and auto-save the current figure
            preamble = (
                "import matplotlib\n"
                "matplotlib.use('Agg')\n"
            )
            postamble = (
                "\nimport matplotlib.pyplot as _plt\n"
                f"if _plt.get_fignums():\n"
                f"    _plt.savefig({output_image!r}, bbox_inches='tight', dpi=100)\n"
            )
        elif uses_turtle:
            # Snapshot the turtle canvas to EPS; converted to PNG after the run
            postamble = (
                "\ntry:\n"
                "    import turtle as _t\n"
                "    _canvas = _t.getscreen().getcanvas()\n"
                "    _canvas.update()\n"
                f"    _canvas.postscript(file={output_eps!r}, colormode='color')\n"
                "    _t.bye()\n"
                "except Exception:\n"
                "    pass\n"
            )
        elif uses_pygame:
            # Headless pygame: save the screen surface every time the student
            # flips/updates the display, so the last frame becomes the output
            preamble = (
                "import os as _os\n"
                "_os.environ.setdefault('SDL_VIDEODRIVER', 'dummy')\n"
                "_os.environ.setdefault('SDL_AUDIODRIVER', 'dummy')\n"
                "import pygame as _pg\n"
                "_orig_flip, _orig_update = _pg.display.flip, _pg.display.update\n"
                "def _capture():\n"
                "    try:\n"
                "        _surf = _pg.display.get_surface()\n"
                f"        if _surf: _pg.image.save(_surf, {output_image!r})\n"
                "    except Exception: pass\n"
                "def _flip(*a, **k):\n"
                "    r = _orig_flip(*a, **k); _capture(); return r\n"
                "def _update(*a, **k):\n"
                "    r = _orig_update(*a, **k); _capture(); return r\n"
                "_pg.display.flip, _pg.display.update = _flip, _update\n"
            )

        full_code = preamble + code + postamble

        with open(code_file, "w") as f:
            f.write(full_code)

        # Build environment — set virtual display for GUI libs
        env = os.environ.copy()
        env["DISPLAY"] = ":99"
        env["MPLBACKEND"] = "Agg"

        try:
            result = subprocess.run(
                [sys.executable, code_file],
                capture_output=True,
                text=True,
                timeout=EXECUTION_TIMEOUT,
                cwd=tmpdir,
                env=env,
            )
            stdout = result.stdout
            stderr = result.stderr
            has_error = result.returncode != 0

        except subprocess.TimeoutExpired:
            return CodeResponse(
                stdout="",
                stderr=f"⏱ Execution timed out after {EXECUTION_TIMEOUT} seconds. Check for infinite loops.",
                image=None,
                error=True,
            )
        except Exception as exc:
            return CodeResponse(
                stdout="",
                stderr=f"Sandbox error: {exc}",
                image=None,
                error=True,
            )

        # Turtle produces an EPS snapshot — convert it to PNG for the browser
        if uses_turtle and os.path.exists(output_eps):
            _eps_to_png(output_eps, output_image)

        # Try to return image output if generated
        image_b64 = None
        if os.path.exists(output_image):
            with open(output_image, "rb") as img_f:
                image_b64 = base64.b64encode(img_f.read()).decode("utf-8")

        return CodeResponse(
            stdout=stdout,
            stderr=stderr,
            image=image_b64,
            error=has_error,
        )
