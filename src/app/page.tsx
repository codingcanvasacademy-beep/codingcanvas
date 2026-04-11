"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Blocks, Terminal, Users, CheckCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createClient();

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !parentName || !childName || !email) return;

    setIsSubmitting(true);
    
    const { error } = await supabase.from("free_class_requests").insert([{
      parent_name: parentName,
      child_name: childName,
      email: email,
      phone: phone,
      status: "pending"
    }]);

    setIsSubmitting(false);

    if (error) {
      alert("Something went wrong! Please try again.");
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setIsSuccess(false);
        setPhone("");
        setParentName("");
        setChildName("");
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background Decorations */}
      <div className="cc-blob cc-blob-pink top-[-200px] left-[-200px] opacity-[0.15]"></div>
      <div className="cc-blob cc-blob-coral bottom-[-200px] right-[-100px] opacity-[0.1]"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 px-6">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cc-primary-light text-cc-primary font-bold text-sm tracking-wide">
              <span className="w-2 h-2 rounded-full bg-cc-primary animate-pulse"></span>
              FUTURE-READY CODING FOR KIDS
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-foreground leading-[1.1] tracking-tight">
              Where Logic <br />
              <span className="text-cc-primary">Meets Play.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-xl leading-relaxed">
              The premium Python coding platform where kids transform from block-builders to real-world programmers through tactile play and professional mentorship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setShowModal(true)}
                className="group px-8 py-5 rounded-full font-bold text-xl text-white bg-cc-primary hover:bg-cc-primary/90 shadow-xl shadow-cc-primary/20 transition-all flex items-center justify-center gap-2"
              >
                Book Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
              <Image 
                src="/hero-kids.png" 
                alt="Kids learning to code" 
                width={800} 
                height={600}
                className="w-full object-contain"
              />
              
              {/* Python Code Overlay */}
              <div className="absolute top-10 right-10 cc-glass p-4 rounded-2xl shadow-lg border-2 border-white/50 animate-bounce duration-[3000ms]">
                <code className="text-sm font-bold text-cc-primary">
                  def canvas_magic():<br />&nbsp;&nbsp;print(&quot;Hello Coding!&quot;)
                </code>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advantage Section */}
      <section className="py-24 bg-cc-surface-muted relative">
        <div className="container mx-auto px-6 text-center space-y-16">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">The CodingCanvas Advantage</h2>
            <p className="text-xl text-gray-500 font-medium">
              Designed by engineers and educators to bridge the gap between creative play and computational mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Blocks className="text-blue-500" />}
              title="Visual Blocks"
              desc="Transition smoothly from drag-and-drop mechanics to professional syntax without losing the fun."
              color="border-blue-200"
            />
            <FeatureCard 
              icon={<Terminal className="text-orange-500" />}
              title="Real Python"
              desc="Learn the industry-standard language used by professionals at Google, NASA, and Pixar."
              color="border-orange-200"
            />
            <FeatureCard 
              icon={<Users className="text-cc-primary" />}
              title="Live Teachers"
              desc="Expert mentorship in small, interactive groups ensures no student ever feels stuck or left behind."
              color="border-pink-200"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="book" className="py-20 px-6">
        <div className="container mx-auto max-w-5xl rounded-[40px] bg-cc-primary-light p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-left space-y-4">
            <h2 className="text-4xl font-black">Ready to start the journey?</h2>
            <p className="text-xl font-medium text-gray-600">Join 5,000+ young innovators already building their dreams on CodingCanvas.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="whitespace-nowrap px-10 py-5 rounded-full font-bold text-xl text-white bg-cc-primary hover:bg-cc-primary/90 transition-all shadow-lg shadow-cc-primary/30"
          >
            Claim Your Free Class
          </button>
        </div>
      </section>

      {/* Modal Integration */}
      {showModal && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-10 rounded-[40px] shadow-2xl max-w-lg w-full relative"
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 text-2xl"
            >
              ×
            </button>
            <h2 className="text-3xl font-black mb-2">Book Your Free Trial</h2>
            <p className="text-gray-500 mb-8 font-medium">Enter your details and our teachers will reach out to schedule!</p>
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-cc-secondary mb-2">Request Received!</h3>
                <p className="text-gray-500 text-center font-medium">We usually reach out within 24 hours. Get ready for an amazing coding journey!</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-700">Parent Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane Doe" 
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-cc-primary rounded-2xl outline-none font-bold transition-all"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-700">Child Name</label>
                    <input 
                      type="text" 
                      placeholder="Alex" 
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-cc-primary rounded-2xl outline-none font-bold transition-all"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-cc-primary rounded-2xl outline-none font-bold transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">Phone Number</label>
                  <div className="flex bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 focus-within:border-cc-primary focus-within:bg-white transition-colors">
                    <span className="flex items-center px-5 bg-gray-100/50 text-gray-500 font-bold border-r-2 border-gray-100">+91</span>
                    <input 
                      type="tel" 
                      placeholder="99999 00000" 
                      className="w-full px-5 py-4 bg-transparent outline-none font-bold"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 px-8 py-5 rounded-2xl font-black text-xl text-white bg-cc-primary hover:bg-cc-primary/90 shadow-xl shadow-cc-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Submit Request ✨"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="font-black text-xl">CodingCanvas</span>
          </div>
          <div className="flex gap-8 text-gray-400 font-medium">
            <Link href="#features" className="hover:text-cc-primary transition-colors">Curriculum</Link>
            <Link href="/login" className="hover:text-cc-primary transition-colors">For Teachers</Link>
            <Link href="#" className="hover:text-cc-primary transition-colors">Privacy</Link>
            <Link href="#book" className="hover:text-cc-primary transition-colors">Contact</Link>
          </div>
          <p className="text-gray-400 text-sm">© 2026 CodingCanvas Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`p-10 rounded-[40px] bg-white border-2 border-transparent hover:border-cc-primary/10 shadow-xl shadow-gray-100 flex flex-col items-center text-center space-y-6 transition-all`}
    >
      <div className={`w-16 h-16 rounded-2xl bg-cc-surface-muted flex items-center justify-center text-3xl shadow-sm border ${color}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black tracking-tight">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}
