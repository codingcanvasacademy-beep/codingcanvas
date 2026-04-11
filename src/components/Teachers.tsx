"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Globe } from "lucide-react";

const teachers = [
  {
    name: "Alex Rivera",
    role: "Senior Python Educator",
    bio: "Ex-Software Engineer at a top tech firm. Loves making complex logic feel like a puzzle game.",
    img: "/teachers/teacher-1.png",
    links: { twitter: "#", linkedin: "#", github: "#" }
  },
  {
    name: "Dr. Elena Vance",
    role: "Curriculum Director",
    bio: "Specializes in early childhood computational thinking. Over 10 years of experience in STEM education.",
    img: "/teachers/teacher-2.png",
    links: { twitter: "#", linkedin: "#", github: "#" }
  }
];

export default function Teachers() {
  return (
    <section id="teachers" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
          <div className="max-w-xl space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Meet Your Mentors</h2>
            <p className="text-xl text-gray-500 font-medium">World-class engineers and educators dedicated to mentoring the next generation of creators.</p>
          </div>
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center font-black text-cc-primary">
               2
             </div>
             <p className="font-bold text-gray-400">Expert Batch Mentors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {teachers.map((teacher, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-[40px] bg-cc-surface-muted border-2 border-transparent hover:border-cc-primary/10 flex flex-col sm:flex-row items-center gap-8 transition-all group"
            >
              <div className="relative w-48 h-48 flex-shrink-0">
                <div className="absolute inset-0 bg-cc-primary rotate-6 rounded-[32px] group-hover:rotate-12 transition-transform duration-500 -z-10 opacity-10"></div>
                <div className="w-full h-full rounded-[32px] overflow-hidden bg-white shadow-lg border-4 border-white">
                  <Image 
                    src={teacher.img} 
                    alt={teacher.name} 
                    width={200} 
                    height={200}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
              
              <div className="space-y-4 text-center sm:text-left">
                <div>
                  <h3 className="text-3xl font-black tracking-tight">{teacher.name}</h3>
                  <p className="text-cc-primary font-black uppercase tracking-widest text-xs">{teacher.role}</p>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed">{teacher.bio}</p>
                
                <div className="flex justify-center sm:justify-start gap-3">
                  <a href={teacher.links.twitter} title="Twitter" className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-cc-primary hover:shadow-md transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href={teacher.links.linkedin} title="LinkedIn" className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-cc-primary hover:shadow-md transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554V14.85c0-1.334-.027-3.052-1.86-3.052-1.861 0-2.147 1.453-2.147 2.956v5.698h-3.556V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.205 24 24 23.227 24 22.271V1.729C24 .774 23.205 0 22.225 0z"/></svg>
                  </a>
                  <a href={teacher.links.github} title="GitHub" className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-cc-primary hover:shadow-md transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.11.81 2.235 0 1.62-.015 2.925-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
