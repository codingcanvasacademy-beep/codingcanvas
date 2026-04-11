"use client";
import { motion } from "framer-motion";
import { Blocks, Code, Binary, Gamepad2 } from "lucide-react";

const levels = [
  {
    title: "Foundation",
    subtitle: "Ages 8-10",
    icon: <Blocks className="text-blue-500" />,
    desc: "Drag-and-drop mechanics to understand core logic, loops, and conditions without typing errors.",
    badge: "Blockly"
  },
  {
    title: "The Bridge",
    subtitle: "Ages 10-12",
    icon: <Binary className="text-pink-500" />,
    desc: "Parallel learning where blocks translate instantly to Python syntax. Seeing the code 'behind' the blocks.",
    badge: "Hybrid"
  },
  {
    title: "Mastery",
    subtitle: "Ages 12-16",
    icon: <Code className="text-orange-500" />,
    desc: "Full text-based Python programming using professional libraries to build real-world applications.",
    badge: "Pure Python"
  }
];

export default function Curriculum() {
  return (
    <section id="curriculum" className="py-24 bg-cc-surface-muted relative">
      <div className="cc-blob cc-blob-pink top-[-50px] right-[-100px] opacity-[0.05]"></div>
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-xl space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">A Curriculum That <br /> Grows With Them.</h2>
            <p className="text-xl text-gray-500 font-medium">From visual logic to industrial-strength code, we bridge the gap at every stage of their development.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center gap-3">
              <Gamepad2 className="w-5 h-5 text-cc-primary" />
              <span className="font-bold text-sm">Project-Based Learning</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {levels.map((level, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[40px] bg-white border-2 border-transparent hover:border-cc-primary/10 shadow-xl shadow-gray-100/50 flex flex-col space-y-8 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl bg-cc-surface-muted flex items-center justify-center text-3xl font-bold border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all">
                  {level.icon}
                </div>
                <span className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">{level.badge}</span>
              </div>
              
              <div className="space-y-3">
                <p className="text-cc-primary font-black text-sm uppercase tracking-wider">{level.subtitle}</p>
                <h3 className="text-3xl font-black">{level.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{level.desc}</p>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <ul className="space-y-3">
                  {["Logic & Flow", "Variables & Types", "Problem Solving"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-cc-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
