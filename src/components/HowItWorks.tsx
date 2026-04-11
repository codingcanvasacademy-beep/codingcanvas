"use client";
import { motion } from "framer-motion";
import { Calendar, Monitor, Rocket } from "lucide-react";

const steps = [
  {
    title: "Book Free Class",
    desc: "Pick a time that works for you and your child. No credit card required.",
    icon: <Calendar className="w-8 h-8 text-cc-primary" />,
    color: "bg-pink-50"
  },
  {
    title: "Join the Lobby",
    desc: "Connect via our virtual classroom with a live expert mentor.",
    icon: <Monitor className="w-8 h-8 text-blue-500" />,
    color: "bg-blue-50"
  },
  {
    title: "Start Building",
    desc: "Go from your first line of code to your own playable Python game.",
    icon: <Rocket className="w-8 h-8 text-orange-500" />,
    color: "bg-orange-50"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">How It Works</h2>
          <p className="text-xl text-gray-500 font-medium">Simple steps to kickstart your child's coding adventure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-pink-100 via-blue-100 to-orange-100 -translate-y-1/2 hidden md:block z-0 opacity-50"></div>

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center space-y-6"
            >
              <div className={`w-20 h-20 rounded-3xl ${step.color} flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 duration-300`}>
                {step.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed max-w-[280px]">{step.desc}</p>
              </div>
              {/* Step Number Badge */}
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center font-black text-sm text-gray-300 shadow-sm">
                0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
