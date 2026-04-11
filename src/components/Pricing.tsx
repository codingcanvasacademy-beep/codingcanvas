"use client";
import { motion } from "framer-motion";
import { Check, Info, ArrowRight } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cc-primary-light text-cc-primary font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-cc-primary animate-pulse"></span>
              LIMITED TIME OFFER
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Premium Education, <br />
              <span className="text-cc-primary">Accessible Pricing.</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium max-w-xl leading-relaxed">
              We believe quality coding education should be transformative, not prohibitive. Start with a free trial and see the magic yourself.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                "1:4 Student-Teacher Ratio",
                "Personal Progress Reports",
                "Lifetime Project Access",
                "Live Expert Guidance"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 font-bold text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center border border-green-100">
                    <Check className="w-4 h-4" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-1 bg-gradient-to-br from-cc-primary to-orange-400 rounded-[40px] shadow-2xl shadow-cc-primary/20"
            >
              <div className="bg-white rounded-[38px] p-12 flex flex-col items-center text-center space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">Standard Batch</h3>
                  <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">8 CLASSES PER MONTH</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-foreground">₹2,000</span>
                  <span className="text-xl text-gray-400 font-bold">/mo</span>
                </div>

                <div className="w-full space-y-4">
                  <button 
                    onClick={() => {
                      const modalBtn = document.querySelector('button[onClick*="setShowModal(true)"]') as HTMLButtonElement | null;
                      modalBtn?.click();
                    }}
                    className="w-full py-5 rounded-3xl bg-cc-primary text-white font-black text-xl hover:brightness-105 transition-all shadow-lg shadow-cc-primary/20 flex items-center justify-center gap-2 group"
                  >
                    Claim Free Class
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-sm font-bold text-gray-400 flex items-center justify-center gap-2">
                    <Info className="w-4 h-4" />
                    No commitments. Pay monthly.
                  </p>
                </div>
              </div>

              {/* Float Badge */}
              <div className="absolute -top-6 -right-6 px-6 py-4 rounded-3xl bg-foreground text-white shadow-xl rotate-6">
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Value Pack</p>
                <p className="text-xl font-black">₹250/class</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
