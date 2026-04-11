"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rishi Verma",
    role: "Parent of 10-yo",
    text: "The transition from blocks to real Python was seamless. My son no longer just 'plays' with code, he actually understands what he's writing.",
    rating: 5
  },
  {
    name: "Sarah Joseph",
    role: "Parent of 8-yo",
    text: "Interactive, fun, and extremely professional. The 1:4 ratio means my child gets the attention she needs whenever she hits a snag.",
    rating: 5
  },
  {
    name: "Anil Kapoor",
    role: "Student, Level 3",
    text: "I built my first calculator app in just two weeks! The teachers make everything so easy to understand.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-cc-surface-muted relative overflow-hidden">
      <div className="cc-blob cc-blob-coral bottom-[-100px] left-[-100px] opacity-[0.05]"></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Parent Stories</h2>
          <p className="text-xl text-gray-500 font-medium">Join hundreds of families who've chosen the premium path to computational literacy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="cc-glass p-10 rounded-[40px] border-2 border-white/50 backdrop-blur-md shadow-xl shadow-gray-200/50 flex flex-col space-y-6 group hover:shadow-2xl transition-all"
            >
              <div className="flex gap-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-cc-primary text-cc-primary" />
                ))}
              </div>
              
              <div className="relative flex-1">
                <Quote className="absolute -top-4 -left-4 w-12 h-12 text-cc-primary/5 -z-10" />
                <p className="text-lg font-bold text-gray-700 leading-relaxed italic">&quot;{item.text}&quot;</p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-coral-100 flex items-center justify-center font-black text-cc-primary">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-foreground">{item.name}</h4>
                  <p className="text-sm text-gray-400 font-bold">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
