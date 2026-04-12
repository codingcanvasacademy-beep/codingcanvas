"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

const DEBOUNCE_MS = 1500; // Auto-save delay after typing stops
const DEFAULT_CODE = `# Welcome to CodingCanvas Python Glass Lab! 🎨
# Write your Python code below and click Run ▶

print("Hello from Glass Lab!")
`;

export default function StudentCompiler() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [error, setError] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  // ── Auto-save: debounced upsert to Supabase on every keystroke ────────────
  const saveToSupabase = useCallback(
    async (latestCode: string) => {
      setSaveStatus("saving");
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        await supabase.from("student_progress").upsert(
          {
            user_id: user?.id ?? "anonymous",
            code: latestCode,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
        setSaveStatus("saved");
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSaveStatus("unsaved");
      }
    },
    [supabase]
  );

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    setSaveStatus("unsaved");

    // Debounce: clear previous timer, set a new one
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      saveToSupabase(newCode);
    }, DEBOUNCE_MS);
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Load previously saved code on mount
  useEffect(() => {
    const loadSavedCode = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("student_progress")
          .select("code")
          .eq("user_id", user.id)
          .single();

        if (data?.code) {
          setCode(data.code);
          setSaveStatus("saved");
        }
      } catch {
        // No saved code — use default. Silently continue.
      }
    };
    loadSavedCode();
  }, [supabase]);

  // ── Run Code: send to Hugging Face Space sandbox ──────────────────────────
  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setOutputImage(null);
    setError(false);

    const hfSpaceUrl = process.env.NEXT_PUBLIC_HF_SPACE_URL;

    if (!hfSpaceUrl) {
      // Graceful fallback when sandbox URL is not configured
      setOutput(
        "⚙️ Sandbox not configured.\n" +
          "Set NEXT_PUBLIC_HF_SPACE_URL in your environment to enable cloud execution.\n\n" +
          "For now, here's what your code would output:\n> (deploy sandbox to see results)"
      );
      setIsRunning(false);
      return;
    }

    try {
      const response = await fetch(`${hfSpaceUrl}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "python" }),
      });

      if (!response.ok) {
        throw new Error(`Sandbox returned HTTP ${response.status}`);
      }

      const result = await response.json();
      setError(result.error);
      setOutput(
        result.stdout ||
          result.stderr ||
          (result.error ? "❌ Execution failed with no output." : "✅ Code ran successfully with no output.")
      );
      if (result.image) {
        setOutputImage(result.image);
      }

      // Send telemetry to n8n for student progress tracking
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: result.error ? "run_error" : "run_success",
          stderr: result.stderr,
          codeLength: code.length,
        }),
      }).catch(() => {}); // fire-and-forget, never block UI
    } catch (err) {
      setError(true);
      setOutput(`❌ Could not reach the execution sandbox.\n${err}`);
    } finally {
      setIsRunning(false);
    }
  };

  const saveStatusLabel = {
    saved: "✓ Saved",
    saving: "Saving…",
    unsaved: "Unsaved",
  }[saveStatus];

  const saveStatusColor = {
    saved: "bg-green-100 text-green-700 border-green-200",
    saving: "bg-yellow-100 text-yellow-700 border-yellow-200",
    unsaved: "bg-gray-100 text-gray-500 border-gray-200",
  }[saveStatus];

  return (
    <div className="flex-1 flex flex-col p-6 h-screen bg-[#f4fafd]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#006492]">Python Glass Lab</h1>
        <div className="flex items-center gap-3">
          {/* Auto-save indicator */}
          <div
            className={`font-bold text-xs px-3 py-1.5 rounded-full border flex items-center gap-2 ${saveStatusColor}`}
          >
            {saveStatus === "saving" && (
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            )}
            {saveStatus === "saved" && <span className="w-2 h-2 rounded-full bg-green-500" />}
            {saveStatusLabel}
          </div>
          <button
            onClick={() => alert("Assignment submitted! Your instructor has been notified.")}
            className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-[#006492] shadow-sm border border-[#e3beb8]/30"
          >
            Submit Assignment
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 h-full min-h-0 bg-transparent">
        {/* Code Editor */}
        <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-[#e3beb8]/30 shadow-lg flex flex-col overflow-hidden">
          <div className="bg-[#f0f5f8] px-6 py-3 border-b border-[#e3beb8]/20 flex justify-between items-center">
            <span className="font-bold text-[#5a403c] text-sm font-mono">main.py</span>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="bg-gradient-to-r from-cc-primary to-[#ff8c7a] px-5 py-1.5 rounded-full text-white font-bold text-sm shadow-md hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running…
                </>
              ) : (
                "▶ Run Code"
              )}
            </button>
          </div>

          {/* Editable code textarea */}
          <textarea
            value={code}
            onChange={handleCodeChange}
            spellCheck={false}
            className="flex-1 p-6 font-mono text-base bg-[#161d1f] text-[#f4fafd] resize-none outline-none leading-relaxed"
            placeholder="# Write your Python code here…"
          />
        </div>

        {/* Side Panel */}
        <div className="w-80 flex flex-col gap-4 min-h-0">
          {/* Console Output */}
          <div className="h-1/2 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-[#e3beb8]/30 shadow-lg flex flex-col">
            <div className="bg-[#f0f5f8] px-6 py-3 border-b border-[#e3beb8]/20">
              <span className="font-bold text-[#006492] text-sm">Console Output</span>
            </div>
            <div
              className={`flex-1 p-4 font-mono text-sm overflow-y-auto w-full whitespace-pre-wrap break-words ${
                error ? "text-red-600 bg-red-50/50" : "text-[#161d1f] bg-black/5"
              }`}
            >
              {output || "> _"}
            </div>
            {/* Visual output (matplotlib / turtle images) */}
            {outputImage && (
              <div className="p-3 border-t border-[#e3beb8]/20">
                <p className="text-xs text-gray-400 mb-1">Visual Output</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/png;base64,${outputImage}`}
                  alt="Code visual output"
                  className="rounded-xl w-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Teacher Notes */}
          <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-[#e3beb8]/30 shadow-lg flex flex-col relative overflow-hidden">
            <div className="absolute -inset-2 bg-gradient-to-br from-yellow-100 to-transparent opacity-50 pointer-events-none rounded-[2rem]" />
            <div className="bg-[#ffdad4]/30 px-6 py-3 border-b border-[#ffdad4]">
              <span className="font-bold text-cc-primary text-sm">Teacher Notes</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 z-10">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-[#e3beb8]/20 text-sm">
                <span className="font-bold text-[#006492] block mb-1">Ms. Sarah (2 mins ago)</span>
                Great start! Don&apos;t forget to close your parenthesis on line 1.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
