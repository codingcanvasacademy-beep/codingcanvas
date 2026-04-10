"use client";
import { useState } from "react";

type BlockType = 'print' | 'loop' | 'variable' | 'math' | 'logic' | 'turtle';

type BlockDef = {
  id: string;
  label: string;
  type: BlockType;
  defaultVal?: string;
  template: (val: string) => string;
};

const TOOLBOX: BlockDef[] = [
  // Output
  { id: 'print_str', label: 'Print Text', type: 'print', defaultVal: '"Hello"', template: (v) => `print(${v})` },
  { id: 'print_var', label: 'Print Value', type: 'print', defaultVal: 'x', template: (v) => `print(${v})` },
  
  // Variables
  { id: 'var_assign', label: 'Assign Variable', type: 'variable', defaultVal: 'x = 10', template: (v) => `${v}` },
  { id: 'var_add', label: 'Add to Variable', type: 'variable', defaultVal: 'x += 1', template: (v) => `${v}` },
  
  // Loops
  { id: 'loop_for', label: 'Repeat N Times', type: 'loop', defaultVal: '3', template: (v) => `for i in range(${v}):\n    pass` },
  { id: 'loop_while', label: 'While Loop', type: 'loop', defaultVal: 'x > 0', template: (v) => `while ${v}:\n    pass` },
  
  // Logic
  { id: 'logic_if', label: 'If Condition', type: 'logic', defaultVal: 'x == 10', template: (v) => `if ${v}:\n    pass` },
  { id: 'logic_elif', label: 'Else If', type: 'logic', defaultVal: 'x < 5', template: (v) => `elif ${v}:\n    pass` },
  { id: 'logic_else', label: 'Else', type: 'logic', defaultVal: '', template: () => `else:\n    pass` },

  // Math
  { id: 'math_add', label: 'Math Action', type: 'math', defaultVal: 'y = x + 5', template: (v) => `${v}` },
  
  // Turtle Basics
  { id: 'tur_forward', label: 'Turtle Forward', type: 'turtle', defaultVal: '100', template: (v) => `turtle.forward(${v})` },
  { id: 'tur_right', label: 'Turtle Right Turn', type: 'turtle', defaultVal: '90', template: (v) => `turtle.right(${v})` },
];

type WorkspaceBlock = {
  instanceId: string;
  defId: string;
  label: string;
  type: BlockType;
  value: string;
  template: (val: string) => string;
};

export default function BlocksToPython() {
  const [workspaceBlocks, setWorkspaceBlocks] = useState<WorkspaceBlock[]>([]);
  const [inMeeting, setInMeeting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addBlock = (def: BlockDef) => {
    if (!inMeeting) return;
    setWorkspaceBlocks([...workspaceBlocks, { 
      instanceId: Math.random().toString(), 
      defId: def.id, 
      label: def.label, 
      type: def.type, 
      value: def.defaultVal || '',
      template: def.template
    }]);
  };

  const updateBlockValue = (instanceId: string, newValue: string) => {
    setWorkspaceBlocks(blocks => 
      blocks.map(b => b.instanceId === instanceId ? { ...b, value: newValue } : b)
    );
  };

  const removeBlock = (instanceId: string) => {
    setWorkspaceBlocks(blocks => blocks.filter(b => b.instanceId !== instanceId));
  };

  const clearWorkspace = () => {
    setWorkspaceBlocks([]);
    setConsoleOutput([]);
  };

  const handleRunCode = () => {
    if (!inMeeting) {
      setConsoleOutput(['> Error: Access denied. Please join the classroom meeting to execute code.']);
      return;
    }

    setIsRunning(true);
    setConsoleOutput(['> Executing...']);
    
    setTimeout(() => {
      const lines = pythonOutput.split('\n');
      const outputs: string[] = [];
      const variables: Record<string, string | number> = {};

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('print(')) {
          const content = trimmed.substring(6, trimmed.length - 1);
          if (content.startsWith('"') || content.startsWith("'")) {
            outputs.push(content.replace(/['"]/g, ''));
          } else if (variables[content] !== undefined) {
             outputs.push(String(variables[content]));
          } else {
             outputs.push(content);
          }
        } else if (trimmed.includes('=') && !trimmed.includes('==') && !trimmed.includes('for') && !trimmed.includes('if')) {
           const parts = trimmed.split('=');
           if (parts.length === 2 && !trimmed.includes('+=')) {
              let val = parts[1].trim();
              variables[parts[0].trim()] = val;
           }
        }
      });

      if (outputs.length === 0) {
        outputs.push('> Program ran successfully with no output.');
      }
      setConsoleOutput(outputs);
      setIsRunning(false);
    }, 600);
  };

  const pythonOutput = workspaceBlocks.map(b => b.template(b.value)).join('\n');

  const getColor = (type: string) => {
    switch (type) {
      case 'print': return 'bg-cc-tertiary'; // Pink
      case 'loop': return 'bg-cc-primary'; // Orange
      case 'variable': return 'bg-[#006492]'; // Blue
      case 'math': return 'bg-amber-500'; // Yellow
      case 'logic': return 'bg-purple-500'; // Purple
      case 'turtle': return 'bg-green-600'; // Green
      default: return 'bg-gray-500';
    }
  };

  if (!inMeeting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-4xl mx-auto text-center gap-6">
        <div className="w-24 h-24 bg-cc-surface-lowest rounded-full flex items-center justify-center shadow-xl border border-cc-primary/20 mb-4 text-4xl">
          🔒
        </div>
        <h1 className="text-5xl font-extrabold text-cc-secondary tracking-tight">Blocks Lab Locked</h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl">
          This playground is designed for interactive learning. You need to be in an active meeting with your teacher to drag, drop, and execute code blocks.
        </p>
        <button 
          onClick={() => setInMeeting(true)}
          className="mt-8 px-12 py-5 bg-gradient-to-r from-cc-primary to-[#ff8c7a] text-white font-extrabold rounded-full text-xl shadow-[0_8px_32px_rgba(255,107,74,0.3)] hover:-translate-y-1 transition-transform"
        >
          Join Teacher&apos;s Classroom
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8 max-w-7xl mx-auto w-full gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-cc-secondary tracking-tight">Blocks to Python Sandbox</h1>
          <p className="text-gray-500 font-medium mt-1">Drag and drop blocks to write code visually.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setInMeeting(false)}
            className="text-sm font-bold text-gray-500 hover:text-red-500 border border-gray-200 px-4 py-2 rounded-full transition-colors"
          >
            Leave Meeting
          </button>
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Teacher Sync Active
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 min-h-[600px] gap-6">
        {/* Left: Block Workspace */}
        <div className="w-1/2 flex flex-col gap-4 bg-cc-surface-lowest p-6 rounded-3xl shadow-[0_4px_32px_rgba(22,29,31,0.04)] border border-[#e3beb8]/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-cc-secondary">Blocks Toolbox</h2>
            <button onClick={clearWorkspace} className="text-sm font-medium text-red-500 hover:text-red-700">Clear All</button>
          </div>
          
          <div className="flex gap-2 flex-wrap mb-4 pb-4 border-b border-gray-100 max-h-48 overflow-y-auto">
            {TOOLBOX.map((block) => (
              <button
                key={block.id}
                onClick={() => addBlock(block)}
                className={`px-3 py-1.5 rounded-lg font-bold text-white text-sm transition-transform hover:-translate-y-1 shadow-sm ${getColor(block.type)}`}
              >
                + {block.label}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-cc-surface-low rounded-2xl p-4 flex flex-col gap-2 overflow-y-auto border-2 border-dashed border-[#e3beb8]/50">
            {workspaceBlocks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
                Click a block from the toolbox to build your code!
              </div>
            ) : (
              workspaceBlocks.map((block, index) => (
                <div 
                  key={block.instanceId} 
                  className={`p-3 rounded-xl text-white font-bold shadow-sm flex items-center gap-3 group ${getColor(block.type)}`}
                >
                  <span className="opacity-70 text-sm">{index + 1}.</span>
                  <span>{block.label}</span>
                  
                  {block.value !== undefined && block.defId !== 'logic_else' && (
                    <input 
                      type="text" 
                      value={block.value}
                      onChange={(e) => updateBlockValue(block.instanceId, e.target.value)}
                      className="ml-auto bg-black/20 text-white border border-white/30 rounded px-2 py-1 text-sm font-mono w-24 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  )}
                  
                  <button 
                    onClick={() => removeBlock(block.instanceId)}
                    className="ml-auto md:ml-2 opacity-0 group-hover:opacity-100 bg-black/20 hover:bg-black/40 rounded-full w-6 h-6 flex items-center justify-center transition-all"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Python Code View */}
        <div className="w-1/2 flex flex-col gap-4 bg-[#1e293b] p-6 rounded-3xl shadow-xl border-4 border-cc-surface-lowest">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Python Output</h2>
            <button 
              onClick={handleRunCode}
              disabled={isRunning || workspaceBlocks.length === 0}
              className="px-6 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-cc-primary to-[#ff8c7a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {isRunning ? 'Running...' : '▶ Run Code'}
            </button>
          </div>
          
          <div className="flex-1 font-mono text-lg text-green-400 p-4 bg-black/30 rounded-2xl overflow-y-auto whitespace-pre-wrap">
            {pythonOutput || '# Your Python code will appear here...'}
          </div>

          <div className="h-48 rounded-2xl bg-black/50 p-4 border-t border-gray-700 mt-4 flex flex-col">
            <span className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-2">Console Output</span>
            <div className="font-mono text-gray-200 flex-1 overflow-y-auto break-all">
              {consoleOutput.length === 0 ? (
                <span className="opacity-50">&gt; Waiting for execution...</span>
              ) : (
                consoleOutput.map((l, i) => <div key={i}>{l}</div>)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
