"use client";

export default function StudentCompiler() {
  return (
    <div className="flex-1 flex flex-col p-6 h-screen bg-[#f4fafd]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#006492]">Python Glass Lab</h1>
        <div className="flex items-center gap-3">
           <div className="bg-green-100 text-green-700 font-bold text-xs px-3 py-1.5 rounded-full border border-green-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Sync Active
           </div>
           <button onClick={() => alert('Assignment submitted correctly! Instructor has been notified.')} className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-[#006492] shadow-sm border border-[#e3beb8]/30">
             Submit Assignment
           </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 h-full min-h-0 bg-transparent">
        {/* Code Editor */}
        <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-[#e3beb8]/30 shadow-lg flex flex-col overflow-hidden">
          <div className="bg-[#f0f5f8] px-6 py-3 border-b border-[#e3beb8]/20 flex justify-between items-center">
            <span className="font-bold text-[#5a403c] text-sm font-mono">main.py</span>
            <button onClick={() => alert('Code execution queued on server. Allocating secure container...')} className="bg-gradient-to-r from-cc-primary to-[#ff8c7a] px-5 py-1.5 rounded-full text-white font-bold text-sm shadow-md hover:brightness-110">
              ▶ Run Code
            </button>
          </div>
          <div className="flex-1 p-6 font-mono text-lg bg-[#161d1f] text-[#f4fafd]">
            <div className="flex">
              <div className="w-8 text-gray-600 text-right pr-4 select-none">1</div>
              <div className="text-pink-400">print<span className="text-gray-300">(</span><span className="text-yellow-300">&quot;Hello from Glass Lab!&quot;</span><span className="text-gray-300">)</span></div>
            </div>
            <div className="flex">
              <div className="w-8 text-gray-600 text-right pr-4 select-none">2</div>
              <div></div>
            </div>
            <div className="flex">
              <div className="w-8 text-gray-600 text-right pr-4 select-none">3</div>
              <div className="text-gray-500 italic"># Write your python code below!</div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex flex-col gap-4 min-h-0">
          <div className="h-1/2 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-[#e3beb8]/30 shadow-lg flex flex-col">
            <div className="bg-[#f0f5f8] px-6 py-3 border-b border-[#e3beb8]/20">
               <span className="font-bold text-[#006492] text-sm">Console Output</span>
            </div>
            <div className="flex-1 p-4 font-mono text-sm bg-black/5 text-[#161d1f] overflow-y-auto w-full">
              &gt; _
            </div>
          </div>

          <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-[#e3beb8]/30 shadow-lg flex flex-col relative overflow-hidden">
            <div className="absolute -inset-2 bg-gradient-to-br from-yellow-100 to-transparent opacity-50 pointer-events-none rounded-[2rem]"></div>
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
