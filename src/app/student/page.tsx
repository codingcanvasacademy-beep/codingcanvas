"use client";
import Link from "next/link";
import { useState } from "react";

export default function StudentPortal() {
  const [inMeeting, setInMeeting] = useState(false);

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full gap-8 flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-cc-secondary tracking-tight">Welcome back, Alex! 👋</h1>
        <div className="bg-cc-surface-lowest px-4 py-2 rounded-full shadow-sm border border-[#e3beb8]/20 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-cc-tertiary text-white flex items-center justify-center text-xs font-bold">12</span>
          <span className="font-bold text-cc-secondary text-sm">Python Badges</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-cc-surface-lowest to-cc-surface rounded-[3rem] p-8 shadow-[0_4px_32px_rgba(22,29,31,0.04)] border border-[#e3beb8]/20 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl font-bold text-cc-secondary">Jump into Code</h2>
            <p className="text-gray-600 max-w-md">Continue where you left off or start a brand new Python adventure in the Glass Lab!</p>
            <div className="flex gap-4 pt-4">
              {inMeeting ? (
                <>
                  <Link href="/student/compiler" className="inline-block px-8 py-4 rounded-full font-bold text-white bg-gradient-to-tr from-cc-primary to-[#ff8c7a] hover:brightness-110 shadow-xl shadow-cc-primary/20 transition-transform hover:-translate-y-1">
                    Open Python Compiler
                  </Link>
                  <Link href="/blocks" className="inline-block px-8 py-4 rounded-full font-bold text-cc-secondary bg-white border border-[#e3beb8]/40 hover:bg-cc-surface-low transition-all">
                    Practice Blocks
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
                  <span>🔒 Compiler locked (Join a meeting to unlock)</span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cc-primary-container rounded-full opacity-30 blur-3xl pointer-events-none"></div>
        </div>

        {/* Next Class */}
        <div className="bg-cc-surface-lowest rounded-[3rem] p-8 shadow-[0_4px_32px_rgba(22,29,31,0.04)] border border-[#e3beb8]/20 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-cc-secondary">Next Live Class</h2>
          <div className="bg-cc-surface-low rounded-2xl p-6 border-l-4 border-cc-primary flex flex-col gap-2">
            <span className="text-sm font-bold text-cc-primary uppercase tracking-wider">Today, 4:00 PM</span>
            <span className="font-bold text-lg text-cc-secondary">Intro to Loops & Turtles</span>
            <span className="text-sm text-gray-500">Instructor: Ms. Sarah</span>
          </div>
          <button 
            onClick={() => setInMeeting(!inMeeting)}
            className={`w-full mt-auto py-3 rounded-full font-bold text-white transition-colors ${inMeeting ? 'bg-red-500 hover:bg-red-700' : 'bg-[#006492] hover:bg-[#004a6d]'}`}
          >
            {inMeeting ? 'Leave Classroom' : 'Join Classroom'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-cc-secondary mb-6">Recent Projects</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[300px] h-48 bg-cc-surface-lowest rounded-3xl border border-[#e3beb8]/20 shadow-sm p-6 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-cc-tertiary-container text-cc-tertiary flex items-center justify-center font-bold text-xl mb-4">
                P
              </div>
              <h3 className="font-bold text-lg text-cc-secondary">Space Invaders App</h3>
              <p className="text-sm text-gray-500 mt-1">Edited 2 days ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
