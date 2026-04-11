"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pyodide: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Blockly: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    python_generator: any;
  }
}

export default function BlocksLabClient() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workspaceRef = useRef<any>(null);
  const [inMeeting, setInMeeting] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [blocklyReady, setBlocklyReady] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const pyodideRef = useRef<unknown>(null);

  // Load Blockly + Pyodide once session starts
  useEffect(() => {
    if (!inMeeting) return;

    // Load Blockly
    const loadBlockly = async () => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/blockly/blockly_compressed.js";
      script.onload = () => {
        const pyScript = document.createElement("script");
        pyScript.src = "https://unpkg.com/blockly/python_compressed.js";
        pyScript.onload = () => setBlocklyReady(true);
        document.head.appendChild(pyScript);
      };
      document.head.appendChild(script);
    };

    // Load Pyodide
    const loadPy = async () => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
      script.onload = async () => {
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
        });
        pyodideRef.current = py;
        window.pyodide = py;
        setPyodideReady(true);
      };
      document.head.appendChild(script);
    };

    loadBlockly();
    loadPy();
  }, [inMeeting]);

  // Initialize Blockly workspace once scripts are loaded
  useEffect(() => {
    if (!blocklyReady || !blocklyDiv.current || workspaceRef.current) return;

    const Blockly = window.Blockly;

    const toolboxConfig = {
      kind: "categoryToolbox",
      contents: [
        {
          kind: "category", name: "Output", colour: "#FF6B4A",
          contents: [
            { kind: "block", type: "text_print" },
            { kind: "block", type: "text" },
          ],
        },
        {
          kind: "category", name: "Variables", colour: "#0369a1",
          custom: "VARIABLE",
        },
        {
          kind: "category", name: "Loops", colour: "#F97316",
          contents: [
            { kind: "block", type: "controls_repeat_ext" },
            { kind: "block", type: "controls_whileUntil" },
            { kind: "block", type: "controls_for" },
            { kind: "block", type: "controls_forEach" },
          ],
        },
        {
          kind: "category", name: "Logic", colour: "#9333ea",
          contents: [
            { kind: "block", type: "controls_if" },
            { kind: "block", type: "logic_compare" },
            { kind: "block", type: "logic_boolean" },
            { kind: "block", type: "logic_negate" },
            { kind: "block", type: "logic_operation" },
          ],
        },
        {
          kind: "category", name: "Math", colour: "#EAB308",
          contents: [
            { kind: "block", type: "math_number" },
            { kind: "block", type: "math_arithmetic" },
            { kind: "block", type: "math_single" },
            { kind: "block", type: "math_random_int" },
            { kind: "block", type: "math_modulo" },
          ],
        },
        {
          kind: "category", name: "Text", colour: "#06b6d4",
          contents: [
            { kind: "block", type: "text" },
            { kind: "block", type: "text_join" },
            { kind: "block", type: "text_length" },
          ],
        },
        {
          kind: "category", name: "Lists", colour: "#10b981",
          contents: [
            { kind: "block", type: "lists_create_with" },
            { kind: "block", type: "lists_length" },
            { kind: "block", type: "lists_getIndex" },
            { kind: "block", type: "lists_setIndex" },
          ],
        },
        {
          kind: "category", name: "Functions", colour: "#6366f1",
          custom: "PROCEDURE",
        },
      ],
    };

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxConfig,
      grid: { spacing: 20, length: 3, colour: "#f0f0f0", snap: true },
      zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
      trashcan: true,
      theme: {
        fontStyle: { family: "var(--font-outfit), sans-serif", size: 12, weight: "bold" },
        componentStyles: {
          workspaceBackgroundColour: "#ffffff",
          toolboxBackgroundColour: "#111827",
          toolboxForegroundColour: "#ffffff",
          flyoutBackgroundColour: "#1F2937",
          flyoutForegroundColour: "#ffffff",
          scrollbarColour: "var(--brand-crimson)",
          scrollbarOpacity: 0.1,
        },
      },
    });

    workspaceRef.current = workspace;

    // Add starter blocks
    const xml = Blockly.utils.xml.textToDom(`
      <xml>
        <block type="controls_repeat_ext" x="50" y="50">
          <value name="TIMES">
            <block type="math_number"><field name="NUM">5</field></block>
          </value>
          <statement name="DO">
            <block type="text_print">
              <value name="TEXT">
                <block type="text"><field name="TEXT">Hello, World!</field></block>
              </value>
            </block>
          </statement>
        </block>
      </xml>
    `);
    Blockly.Xml.domToWorkspace(xml, workspace);

    // Live code generation
    workspace.addChangeListener(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pythonGen = (window as any).Blockly?.Python || (window as any).python_generator;
        if (pythonGen) {
          const code = pythonGen.workspaceToCode(workspace);
          setGeneratedCode(code);
        }
      } catch {
        // ignore
      }
    });
  }, [blocklyReady]);

  const handleRunCode = async () => {
    if (!pyodideReady || !generatedCode.trim()) {
      setConsoleOutput(["> Add some blocks first, then run!"]);
      return;
    }
    setIsRunning(true);
    setConsoleOutput(["> Running your Python code..."]);

    try {
      const py = pyodideRef.current as { runPythonAsync: (c: string) => Promise<unknown> };
      await py.runPythonAsync(`import sys, io; sys.stdout = io.StringIO()`);
      await py.runPythonAsync(generatedCode);
      const output = await py.runPythonAsync("sys.stdout.getvalue()") as string;
      await py.runPythonAsync("sys.stdout = sys.__stdout__");

      if (output?.trim()) {
        setConsoleOutput(output.trim().split("\n").map((l) => `> ${l}`));
      } else {
        setConsoleOutput(["> ✅ Code ran successfully (no output)"]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setConsoleOutput([`> ❌ ${msg.split("\n").at(-1)}`]);
    } finally {
      setIsRunning(false);
    }
  };

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

      const blockData = JSON.parse(data.response.replace(/```json|```/g, "").trim());
      const Blockly = window.Blockly;

      // Dynamically register a new custom block
      Blockly.defineBlocksWithJsonArray([{
        type: `custom_${Date.now()}`,
        message0: `🤖 ${blockData.label}: %1`,
        args0: [{ type: "field_input", name: "VAL", text: blockData.defaultVal }],
        previousStatement: null,
        nextStatement: null,
        colour: "#10b981",
        tooltip: `AI Generated: ${blockData.label}`,
      }]);

      setAiPrompt("");
      setShowAIModal(false);
      alert(`✨ Block "${blockData.label}" created! Find it in the workspace.`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setAiError(`Could not create block: ${msg}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Lock Screen
  if (!inMeeting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 w-full text-center gap-10 bg-white relative overflow-hidden">
        <div className="cc-blob cc-blob-pink top-[-200px] left-[-200px] opacity-[0.1]"></div>
        <div className="cc-blob cc-blob-coral bottom-[-200px] right-[-100px] opacity-[0.05]"></div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-40 h-40 bg-cc-primary rounded-[40px] flex items-center justify-center shadow-2xl shadow-cc-primary/20 text-6xl rotate-3 relative z-10">
            🧩
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl shadow-lg z-20 animate-bounce">
            ✨
          </div>
        </motion.div>
        
        <div className="space-y-4 relative z-10">
          <h1 className="text-6xl md:text-7xl font-black text-foreground tracking-tight">Blocks Lab</h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Drag, snap, and build real Python code — just like Scratch. Powered by Google Blockly + Pyodide.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-4 relative z-10">
          <button
            onClick={() => { setInMeeting(true); setIsTeacher(false); }}
            className="px-12 py-5 bg-cc-primary text-white font-black rounded-3xl text-xl shadow-xl shadow-cc-primary/30 hover:-translate-y-1 transition-all active:scale-95"
          >
            👧 Join as Student
          </button>
          <button
            onClick={() => { setInMeeting(true); setIsTeacher(true); }}
            className="px-12 py-5 bg-gray-900 text-white font-black rounded-3xl text-xl shadow-xl shadow-gray-200 hover:-translate-y-1 transition-all active:scale-95"
          >
            👩‍🏫 Join as Teacher
          </button>
        </div>
        
        <p className="text-gray-400 text-sm font-bold mt-8 uppercase tracking-widest relative z-10">
          WASM PYTHON • GOOGLE BLOCKLY • CLOUD SYNC
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-80px)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1a2235] text-white border-b border-[#2d3f5e]">
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold tracking-tight">🧩 Blocks Lab</span>
          {isTeacher && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Teacher Mode</span>
          )}
          <div className="flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            Live Session
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border border-white/10">
            {pyodideReady
              ? <><span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span> Python Ready</>
              : <><span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse inline-block"></span> Loading Python...</>
            }
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isTeacher && (
            <button
              onClick={() => setShowAIModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold rounded-xl hover:brightness-110 shadow-md"
            >
              🤖 AI Block Creator
            </button>
          )}
          <button
            onClick={handleRunCode}
            disabled={isRunning || !pyodideReady || !generatedCode.trim()}
            className="px-5 py-2 bg-gradient-to-r from-cc-primary to-[#ff8c7a] text-white font-bold text-sm rounded-xl disabled:opacity-50 hover:brightness-110 flex items-center gap-2"
          >
            {isRunning ? <><span className="animate-spin">⟳</span> Running...</> : "▶ Run Python"}
          </button>
          <button
            onClick={() => setInMeeting(false)}
            className="text-gray-400 hover:text-red-400 text-sm border border-white/10 px-3 py-2 rounded-xl"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Blockly Canvas */}
        <div ref={blocklyDiv} className="flex-1 h-full" />

        {/* Right Panel: Code + Console */}
        <div className="w-80 flex flex-col bg-[#0d1724] border-l border-[#2d3f5e]">
          {/* Python Code */}
          <div className="flex-1 flex flex-col p-4 border-b border-[#2d3f5e]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Python Code</span>
              <span className="text-gray-500 text-xs">🐍 Live Preview</span>
            </div>
            <pre className="font-mono text-xs text-green-400 overflow-y-auto flex-1 leading-relaxed whitespace-pre-wrap">
              {generatedCode || <span className="opacity-30"># Drag blocks to generate code...</span>}
            </pre>
          </div>

          {/* Console */}
          <div className="h-52 flex flex-col p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Console</span>
              {consoleOutput.length > 0 && (
                <button onClick={() => setConsoleOutput([])} className="text-gray-600 hover:text-gray-400 text-xs">clear</button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-1">
              {consoleOutput.length === 0 ? (
                <span className="text-gray-600 text-xs font-mono">&gt; Click Run to execute...</span>
              ) : (
                consoleOutput.map((l, i) => (
                  <div key={i} className={`font-mono text-xs ${l.includes("❌") ? "text-red-400" : l.includes("✅") ? "text-green-400" : "text-gray-200"}`}>
                    {l}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Block Creator Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">🤖 AI Block Creator</h3>
            <p className="text-gray-500 mb-6 text-sm font-medium">Describe what you want and Gemma will create a custom block for your students.</p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder='e.g. "a block that checks if a number is a palindrome"'
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-3 font-medium text-gray-800 focus:outline-none focus:border-purple-400 text-sm resize-none h-28"
            />
            {aiError && <p className="text-red-500 text-sm mt-2">{aiError}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowAIModal(false)} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleGenerateBlock}
                disabled={aiLoading || !aiPrompt.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl disabled:opacity-50 hover:brightness-110"
              >
                {aiLoading ? "Generating..." : "✨ Create Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
