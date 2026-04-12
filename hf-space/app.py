"""
CodingCanvas Python Execution Sandbox
Deployed on Hugging Face Docker Spaces.

Provides a stateless HTTP endpoint that receives Python code,
runs it in a sandboxed subprocess, and returns stdout/stderr.
Supports: standard Python, turtle (headless via Xvfb), matplotlib (PNG output), pygame (headless).
"""

import os
import subprocess
import tempfile
import base64
import sys
import signal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CodingCanvas Sandbox", version="1.0.0")

# Allow requests from any origin (the Next.js frontend on Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

EXECUTION_TIMEOUT = 15  # seconds — prevents runaway loops

class CodeRequest(BaseModel):
    code: str
    language: str = "python"  # reserved for future languages

class CodeResponse(BaseModel):
    stdout: str
    stderr: str
    image: str | None = None  # base64-encoded PNG for matplotlib/turtle output
    error: bool

@app.get("/")
def health():
    """Health check — Hugging Face Spaces calls this to verify the Space is alive."""
    return {"status": "ok", "sandbox": "CodingCanvas Python Sandbox v1.0"}

@app.post("/run", response_model=CodeResponse)
def run_code(request: CodeRequest):
    """
    Execute Python code in an isolated subprocess and return the output.
    
    For visual libraries (matplotlib, turtle, pygame):
    - Runs with DISPLAY=:99 (Xvfb virtual framebuffer)
    - matplotlib plots are saved to a temp PNG and returned as base64
    - turtle graphics are captured via the same mechanism
    """
    code = request.code.strip()
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    # Detect visual mode — inject display capture boilerplate
    uses_matplotlib = "import matplotlib" in code or "from matplotlib" in code
    uses_turtle = "import turtle" in code or "from turtle" in code

    # Prepare a temp directory for the run
    with tempfile.TemporaryDirectory() as tmpdir:
        code_file = os.path.join(tmpdir, "main.py")
        output_image = os.path.join(tmpdir, "output.png")

        # For matplotlib: auto-save the figure instead of showing it
        if uses_matplotlib:
            preamble = (
                "import matplotlib\n"
                "matplotlib.use('Agg')\n"
            )
            # Append savefig at end if plt.show() is called
            postamble = (
                "\nimport matplotlib.pyplot as _plt\n"
                f"_plt.savefig('{output_image}', bbox_inches='tight', dpi=100)\n"
            )
            full_code = preamble + code + postamble
        elif uses_turtle:
            # Capture turtle canvas to PNG via Xvfb + PIL
            preamble = (
                "import turtle as _t\n"
                "_t.hideturtle()\n"
            )
            postamble = (
                "\nimport time as _time\n"
                "_time.sleep(0.5)\n"
                "try:\n"
                "    _screen = _t.getscreen()\n"
                "    _canvas = _screen.getcanvas()\n"
                "    _canvas.postscript(file='" + output_image.replace(".png", ".eps") + "')\n"
                "except Exception:\n"
                "    pass\n"
                "_t.bye()\n"
            )
            full_code = preamble + code + postamble
        else:
            full_code = code

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
