"use client";
import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    const text = encodeURIComponent("Hi, I want to book a free trial class on CodingCanvas!");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    setShowModal(false);
    setPhone("");
  };
  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    const text = encodeURIComponent("Hi, I want to book a free trial class on CodingCanvas!");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    setShowModal(false);
    setPhone("");
  };
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
          <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-tr from-cc-primary to-[#ff8c7a] hover:brightness-110 shadow-xl shadow-cc-primary/20 transition-all transform hover:-translate-y-1"
          >
            Book a Free Trial Class
          </button>
          <button className="px-8 py-4 rounded-full font-bold text-lg text-cc-secondary bg-cc-surface-lowest hover:bg-cc-surface-low border border-[#e3beb8]/40 transition-all">
            Explore Curriculum
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#351000]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-black text-cc-secondary mb-2">Book Your Free Trial</h2>
            <p className="text-gray-500 mb-6 font-medium">Enter your WhatsApp number so we can book the class for you!</p>
            
            <form onSubmit={handleBook} className="flex flex-col gap-4 text-left">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
                <div className="flex bg-gray-50 rounded-xl overflow-hidden border border-gray-200 focus-within:border-cc-primary transition-colors">
                  <span className="flex items-center px-4 bg-gray-100 text-gray-500 font-bold border-r border-gray-200">+91</span>
                  <input 
                    type="tel" 
                    placeholder="98765 43210" 
                    className="w-full px-4 py-3 bg-transparent outline-none font-medium text-black"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="mt-2 w-full px-6 py-4 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all"
              >
                Send WhatsApp Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Decorative floating elements */}
      <div className="fixed top-32 left-10 w-32 h-32 bg-cc-tertiary-container rounded-3xl -rotate-12 opacity-50 blur-xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-48 h-48 bg-cc-primary-container rounded-full opacity-40 blur-2xl pointer-events-none"></div>
    </div>
  );
}
