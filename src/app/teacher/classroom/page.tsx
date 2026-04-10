export default function TeacherVirtualClassroom() {
  return (
    <div className="flex-1 bg-[#1a1a24] text-white flex flex-col p-4 font-sans h-screen">
      <div className="flex justify-between items-center mb-4 px-4">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cc-primary to-[#ff8c7a]">Grade 5: Intro to Loops</h1>
        <div className="flex gap-4">
          <div className="bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div> REC
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-full font-mono text-sm border border-white/20">
            00:15:42
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Main Workspace (Compiler) */}
        <div className="flex-1 bg-[#242433] rounded-3xl border border-white/10 flex flex-col overflow-hidden">
          <div className="bg-black/40 p-4 font-medium flex justify-between items-center border-b border-white/10">
            <span>Teacher&apos;s Global Python Workspace</span>
            <button className="bg-cc-primary text-white text-xs font-bold px-4 py-1.5 rounded-full">Sync to Students</button>
          </div>
          <div className="flex-1 p-6 font-mono text-lg text-green-400">
            {`# Everyone, let's look at this loop!
for i in range(5):
    print("Welcome to CodingCanvas!")
    
# Can someone tell me what this outputs?`}
          </div>
        </div>

        {/* Sidebar Gallery */}
        <div className="w-72 flex flex-col gap-4">
          <div className="bg-[#242433] rounded-2xl h-48 border-2 border-cc-primary overflow-hidden relative">
            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs">Instructor Sarah</div>
            {/* Teacher placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">Camera Active</div>
          </div>
          
          <div className="flex-1 bg-[#242433] rounded-3xl border border-white/10 p-4 flex flex-col gap-4 overflow-y-auto">
            <h3 className="font-bold text-sm text-gray-400 uppercase">Student Gallery (12)</h3>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-black/40 rounded-xl h-24 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute bottom-1 left-1 bg-black/60 px-2 py-0.5 rounded text-[10px]">Student {i}</div>
                 <div className="text-gray-600 text-xs">Cam {i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="h-16 mt-4 flex items-center justify-center gap-6">
        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition-colors">
          🎤
        </button>
        <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition-colors">
          📷
        </button>
        <button className="px-6 h-12 rounded-full bg-cc-primary hover:brightness-110 font-bold transition-all shadow-[0_0_15px_rgba(255,90,67,0.4)]">
          End Class
        </button>
      </div>
    </div>
  );
}
