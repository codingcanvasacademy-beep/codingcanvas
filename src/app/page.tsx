export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="inline-block px-4 py-2 rounded-full bg-cc-tertiary-container text-cc-tertiary font-bold text-sm uppercase tracking-wider mb-4 border border-[#e3beb8]/20">
          The Premier Python Platform For Kids
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-cc-secondary tracking-tight leading-tight">
          Where Logic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cc-primary to-[#ff8c7a]">Meets Play.</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#5a403c] max-w-2xl mx-auto leading-relaxed">
          CodingCanvas is a digital laboratory where kids build real Python projects, transitioning seamlessly from visual blocks to professional code.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-tr from-cc-primary to-[#ff8c7a] hover:brightness-110 shadow-xl shadow-cc-primary/20 transition-all transform hover:-translate-y-1">
            Book a Free Trial Class
          </button>
          <button className="px-8 py-4 rounded-full font-bold text-lg text-cc-secondary bg-cc-surface-lowest hover:bg-cc-surface-low border border-[#e3beb8]/40 transition-all">
            Explore Curriculum
          </button>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="fixed top-32 left-10 w-32 h-32 bg-cc-tertiary-container rounded-3xl -rotate-12 opacity-50 blur-xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-48 h-48 bg-cc-primary-container rounded-full opacity-40 blur-2xl pointer-events-none"></div>
    </div>
  );
}
