"use client";
import { useState, useEffect, useRef } from "react";

type BlockType = "print" | "loop" | "variable" | "math" | "logic" | "custom";

type BlockDef = {
  id: string;
  label: string;
  type: BlockType;
  defaultVal?: string;
  template: (val: string) => string;
};

const BASE_TOOLBOX: BlockDef[] = [
  { id: "print_str", label: "Print Text", type: "print", defaultVal: '"Hello"', template: (v) => `print(${v})` },
  { id: "print_var", label: "Print Variable", type: "print", defaultVal: "x", template: (v) => `print(${v})` },
  { id: "var_assign", label: "Set Variable", type: "variable", defaultVal: "x = 10", template: (v) => `${v}` },
  { id: "var_add", label: "Increment", type: "variable", defaultVal: "x += 1", template: (v) => `${v}` },
  { id: "loop_for", label: "Repeat N Times", type: "loop", defaultVal: "5", template: (v) => `for i in range(${v}):\n    pass` },
  { id: "loop_while", label: "While Loop", type: "loop", defaultVal: "x > 0", template: (v) => `while ${v}:\n    pass` },
  { id: "logic_if", label: "If Condition", type: "logic", defaultVal: "x == 10", template: (v) => `if ${v}:\n    pass` },
  { id: "logic_elif", label: "Else If", type: "logic", defaultVal: "x < 5", template: (v) => `elif ${v}:\n    pass` },
  { id: "logic_else", label: "Else", type: "logic", defaultVal: "", template: () => `else:\n    pass` },
  { id: "math_op", label: "Math Action", type: "math", defaultVal: "y = x * 2", template: (v) => `${v}` },
  { id: "math_sqrt", label: "Square Root", type: "math", defaultVal: "16", template: (v) => `import math\nresult = math.sqrt(${v})` },
  { id: "input_read", label: "Read Input", type: "variable", defaultVal: "name", template: (v) => `${v} = input("Enter value: ")` },
  { id: "list_create", label: "Create List", type: "variable", defaultVal: "nums = [1,2,3]", template: (v) => `${v}` },
  { id: "list_append", label: "Append to List", type: "variable", defaultVal: "nums.append(4)", template: (v) => `${v}` },
  { id: "print_fstr", label: "Print F-String", type: "print", defaultVal: "name", template: (v) => `print(f"Hello, {${v}}!")` },
  { id: "func_def", label: "Define Function", type: "logic", defaultVal: "my_func", template: (v) => `def ${v}():\n    pass` },
  { id: "func_call", label: "Call Function", type: "logic", defaultVal: "my_func()", template: (v) => `${v}` },
  { id: "range_loop", label: "Count Up/Down", type: "loop", defaultVal: "1, 10, 2", template: (v) => `for i in range(${v}):\n    print(i)` },
];

type WorkspaceBlock = {
  instanceId: string;
  defId: string;
  label: string;
  type: BlockType;
  value: string;
  template: (val: string) => string;
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pyodide: any;
  }
}

export default function BlocksToPython() {
  const [workspaceBlocks, setWorkspaceBlocks] = useState<WorkspaceBlock[]>([]);
  const [customBlocks, setCustomBlocks] = useState<BlockDef[]>([]);
  const [inMeeting, setInMeeting] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  // AI Block Generator state
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const pyodideRef = useRef<unknown>(null);

  const allBlocks = [...BASE_TOOLBOX, ...customBlocks];

  // Load Pyodide script
  useEffect(() => {
    if (inMeeting && !pyodideReady && !pyodideLoading) {
      setPyodideLoading(true);
      setConsoleOutput(["> Loading Python engine (Pyodide)..."]);

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
      script.onload = async () => {
        try {
          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
          });
          pyodideRef.current = pyodide;
          window.pyodide = pyodide;
          setPyodideReady(true);
          setPyodideLoading(false);
          setConsoleOutput(["> ✅ Python engine ready! Build your code and click Run."]);
        } catch {
          setConsoleOutput(["> ❌ Failed to load Python engine. Please refresh."]);
          setPyodideLoading(false);
        }
      };
      document.head.appendChild(script);
    }
  }, [inMeeting, pyodideReady, pyodideLoading]);

  const addBlock = (def: BlockDef) => {
    if (!inMeeting) return;
    setWorkspaceBlocks((prev) => [
      ...prev,
      {
        instanceId: Math.random().toString(36).slice(2),
        defId: def.id,
        label: def.label,
        type: def.type,
        value: def.defaultVal || "",
        template: def.template,
      },
    ]);
  };

  const updateBlockValue = (instanceId: string, val: string) => {
    setWorkspaceBlocks((blocks) =>
      blocks.map((b) => (b.instanceId === instanceId ? { ...b, value: val } : b))
    );
  };

  const removeBlock = (instanceId: string) => {
    setWorkspaceBlocks((blocks) => blocks.filter((b) => b.instanceId !== instanceId));
  };

  const clearWorkspace = () => {
    setWorkspaceBlocks([]);
    setConsoleOutput([]);
  };

  const pythonCode = workspaceBlocks.map((b) => b.template(b.value)).join("\n");

  const handleRunCode = async () => {
    if (!pyodideReady) {
      setConsoleOutput(["> Python engine is still loading. Please wait..."]);
      return;
    }
    if (!pythonCode.trim()) {
      setConsoleOutput(["> Nothing to run. Add some blocks first!"]);
      return;
    }

    setIsRunning(true);
    setConsoleOutput(["> Running with Pyodide..."]);

    try {
      const pyodide = pyodideRef.current as {
        runPythonAsync: (code: string) => Promise<unknown>;
        globals: { set: (key: string, val: unknown) => void };
      };
      const outputLines: string[] = [];

      // Redirect print to capture output
      await pyodide.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
`);

      await pyodide.runPythonAsync(pythonCode);

      const output = await pyodide.runPythonAsync("sys.stdout.getvalue()") as string;
      if (output && output.trim()) {
        outputLines.push(...output.trim().split("\n").map((l) => `> ${l}`));
      } else {
        outputLines.push("> ✅ Code ran successfully with no output.");
      }

      // Reset stdout
      await pyodide.runPythonAsync("sys.stdout = sys.__stdout__");

      setConsoleOutput(outputLines);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setConsoleOutput([`> ❌ Error: ${msg.split("\n").at(-1)}`]);
    } finally {
      setIsRunning(false);
    }
  };

  // AI Block Generator
  const handleGenerateBlock = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "block_generator", prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Parse the JSON response from the AI
      const blockData = JSON.parse(data.response.replace(/```json|```/g, "").trim());
      const newBlock: BlockDef = {
        id: `custom_${Date.now()}`,
        label: blockData.label,
        type: "custom",
        defaultVal: blockData.defaultVal,
        template: (v: string) => blockData.pythonCode.replace("{val}", v),
      };
      setCustomBlocks((prev) => [...prev, newBlock]);
      setAiPrompt("");
      setShowAIGenerator(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setAiError(`Could not create block: ${msg}`);
    } finally {
      setAiLoading(false);
    }
  };

  const getColor = (type: string) => {
    const colors: Record<string, string> = {
      print: "bg-cc-tertiary",
      loop: "bg-cc-primary",
      variable: "bg-[#0369a1]",
      math: "bg-amber-500",
      logic: "bg-purple-600",
      custom: "bg-emerald-600",
    };
    return colors[type] ?? "bg-gray-500";
  };

  // Lock Screen
  if (!inMeeting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-4xl mx-auto text-center gap-6">
        <div className="w-28 h-28 bg-cc-surface-lowest rounded-full flex items-center justify-center shadow-2xl border-4 border-cc-primary/20 mb-4 text-5xl">
          🔒
        </div>
        <h1 className="text-5xl font-extrabold text-cc-secondary tracking-tight">Blocks Lab</h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl">
          Join the live classroom session to start building Python code with blocks. Real Python execution powered by Pyodide.
        </p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => { setInMeeting(true); setIsTeacher(false); }}
            className="px-10 py-4 bg-gradient-to-r from-cc-primary to-[#ff8c7a] text-white font-extrabold rounded-full text-lg shadow-[0_8px_32px_rgba(255,107,74,0.3)] hover:-translate-y-1 transition-transform"
          >
            Join as Student
          </button>
          <button
            onClick={() => { setInMeeting(true); setIsTeacher(true); }}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold rounded-full text-lg shadow-[0_8px_32px_rgba(99,102,241,0.3)] hover:-translate-y-1 transition-transform"
          >
            Join as Teacher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 max-w-[1400px] mx-auto w-full gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-cc-secondary tracking-tight">
            Blocks → Python {isTeacher && <span className="text-purple-600 text-lg ml-2 font-bold">(Teacher Mode)</span>}
          </h1>
          <p className="text-gray-500 font-medium mt-0.5 text-sm flex items-center gap-2">
            {pyodideReady
              ? <><span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span> Pyodide ready — real Python execution enabled</>
              : <><span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span> Loading Python engine...</>
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isTeacher && (
            <button
              onClick={() => setShowAIGenerator(!showAIGenerator)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full text-sm hover:brightness-110 shadow-md"
            >
              🤖 AI Block Creator
            </button>
          )}
          <div className="flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1.5 rounded-full font-bold text-xs border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Live Session Active
          </div>
          <button
            onClick={() => setInMeeting(false)}
            className="text-sm font-bold text-gray-400 hover:text-red-500 border border-gray-200 px-3 py-1.5 rounded-full transition-colors"
          >
            Leave
          </button>
        </div>
      </div>

      {/* AI Block Generator Panel */}
      {showAIGenerator && isTeacher && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-5">
          <h3 className="font-extrabold text-purple-800 text-lg mb-1">🤖 AI Block Generator</h3>
          <p className="text-purple-600 text-sm mb-4 font-medium">Describe a Python concept or code snippet and Gemma will create a new block for your students!</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerateBlock()}
              placeholder='e.g. "a block that checks if a number is even"'
              className="flex-1 bg-white border-2 border-purple-200 rounded-xl px-4 py-3 font-medium text-gray-800 focus:outline-none focus:border-purple-500 text-sm"
            />
            <button
              onClick={handleGenerateBlock}
              disabled={aiLoading || !aiPrompt.trim()}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl text-sm disabled:opacity-50 hover:bg-purple-700 whitespace-nowrap"
            >
              {aiLoading ? "Generating..." : "Create Block ✨"}
            </button>
          </div>
          {aiError && <p className="text-red-500 text-sm mt-2 font-medium">{aiError}</p>}
          {customBlocks.length > 0 && (
            <div className="mt-3">
              <p className="text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">Your Custom Blocks ({customBlocks.length})</p>
              <div className="flex flex-wrap gap-2">
                {customBlocks.map((b) => (
                  <span key={b.id} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                    ✨ {b.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 min-h-[580px] gap-5">
        {/* Left: Toolbox + Workspace */}
        <div className="w-1/2 flex flex-col gap-4 bg-cc-surface-lowest p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-cc-secondary">Blocks Toolbox</h2>
            <button onClick={clearWorkspace} className="text-xs font-bold text-red-400 hover:text-red-600">Clear All</button>
          </div>

          {/* Block Buttons */}
          <div className="flex gap-1.5 flex-wrap pb-3 border-b border-gray-100 max-h-52 overflow-y-auto">
            {allBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => addBlock(block)}
                className={`px-2.5 py-1 rounded-lg font-bold text-white text-xs transition-transform hover:-translate-y-0.5 shadow-sm ${getColor(block.type)}`}
              >
                + {block.label}
              </button>
            ))}
          </div>

          {/* Block Workspace (drop zone) */}
          <div className="flex-1 bg-white rounded-xl p-3 flex flex-col gap-2 overflow-y-auto border-2 border-dashed border-gray-200">
            {workspaceBlocks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-medium">
                Click blocks above to start building!
              </div>
            ) : (
              workspaceBlocks.map((block, i) => (
                <div
                  key={block.instanceId}
                  className={`p-2.5 rounded-xl text-white font-bold shadow-sm flex items-center gap-2 group ${getColor(block.type)}`}
                >
                  <span className="opacity-60 text-xs w-5">{i + 1}.</span>
                  <span className="text-sm">{block.label}</span>
                  {block.defId !== "logic_else" && (
                    <input
                      type="text"
                      value={block.value}
                      onChange={(e) => updateBlockValue(block.instanceId, e.target.value)}
                      className="ml-auto bg-black/20 text-white border border-white/30 rounded-lg px-2 py-0.5 text-xs font-mono w-28 focus:outline-none focus:ring-1 focus:ring-white/60"
                    />
                  )}
                  <button
                    onClick={() => removeBlock(block.instanceId)}
                    className="opacity-0 group-hover:opacity-100 bg-black/20 hover:bg-black/40 rounded-full w-5 h-5 flex items-center justify-center transition-all text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Code + Console */}
        <div className="w-1/2 flex flex-col gap-4 bg-[#1a2235] p-5 rounded-2xl shadow-xl border border-[#2d3f5e]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-white">Python Code</h2>
            <button
              onClick={handleRunCode}
              disabled={isRunning || !pyodideReady || workspaceBlocks.length === 0}
              className="px-5 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-cc-primary to-[#ff8c7a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all flex items-center gap-2"
            >
              {isRunning ? (
                <><span className="animate-spin">⟳</span> Running...</>
              ) : (
                "▶ Run with Python"
              )}
            </button>
          </div>

          {/* Code Display */}
          <div className="flex-1 font-mono text-sm text-green-400 p-4 bg-black/40 rounded-xl overflow-y-auto whitespace-pre-wrap leading-relaxed border border-[#2d3f5e]">
            {pythonCode || <span className="opacity-40"># Your Python code will appear here...</span>}
          </div>

          {/* Console Output */}
          <div className="h-44 rounded-xl bg-black/60 p-4 flex flex-col border border-[#2d3f5e]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">Console</span>
              {consoleOutput.length > 0 && (
                <button onClick={() => setConsoleOutput([])} className="text-gray-600 hover:text-gray-400 text-xs">clear</button>
              )}
            </div>
            <div className="font-mono text-sm text-gray-200 flex-1 overflow-y-auto flex flex-col gap-0.5">
              {consoleOutput.length === 0 ? (
                <span className="opacity-40 text-gray-400">&gt; Waiting for execution...</span>
              ) : (
                consoleOutput.map((l, i) => (
                  <div key={i} className={l.includes("❌") ? "text-red-400" : l.includes("✅") ? "text-green-400" : "text-gray-200"}>
                    {l}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
