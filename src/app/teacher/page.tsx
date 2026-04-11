"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherPortal() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const handleLaunchMeeting = (overrideRoom?: string) => {
    const targetRoom = overrideRoom || roomId;
    if (!targetRoom) return;
    router.push(`/meeting?room=${targetRoom}&name=Instructor_Sarah`);
  };

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full gap-8 flex flex-col">
      <div className="flex justify-between items-center bg-cc-surface-highest p-8 rounded-[3rem] shadow-[0_4px_32px_rgba(22,29,31,0.06)] flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cc-secondary tracking-tight">Good morning, Instructor Sarah</h1>
          <p className="text-[#5a403c] mt-2">You have 3 live sessions scheduled for today.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Room ID..." 
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="px-4 py-3 rounded-full border border-gray-200 focus:border-cc-primary focus:outline-none"
          />
          <button 
            onClick={() => handleLaunchMeeting()}
            disabled={!roomId}
            className="disabled:opacity-50 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-tr from-cc-primary to-[#ff8c7a] hover:brightness-110 shadow-lg shadow-cc-primary/20 transition-all">
            Launch Live Classroom
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-cc-surface-lowest rounded-3xl p-6 shadow-sm border border-[#e3beb8]/20 text-center">
          <div className="text-4xl font-black text-cc-secondary">3</div>
          <div className="text-sm text-gray-500 font-bold uppercase mt-2 tracking-wider">Active Classes Today</div>
        </div>
        <div className="bg-cc-surface-lowest rounded-3xl p-6 shadow-sm border border-[#e3beb8]/20 text-center">
          <div className="text-4xl font-black text-cc-tertiary">42</div>
          <div className="text-sm text-gray-500 font-bold uppercase mt-2 tracking-wider">Total Students</div>
        </div>
        <div className="bg-cc-surface-lowest rounded-3xl p-6 shadow-sm border border-[#e3beb8]/20 text-center">
          <div className="text-4xl font-black text-cc-primary">12</div>
          <div className="text-sm text-gray-500 font-bold uppercase mt-2 tracking-wider">Assignments to Grade</div>
        </div>
        <div className="bg-cc-surface-lowest rounded-3xl p-6 shadow-sm border border-[#e3beb8]/20 text-center">
          <div className="text-4xl font-black text-[#006492]">100%</div>
          <div className="text-sm text-gray-500 font-bold uppercase mt-2 tracking-wider">Avg Attendance</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-end mb-6">
             <h2 className="text-2xl font-bold text-cc-secondary">Today&apos;s Schedule</h2>
             <button className="text-sm font-bold text-cc-primary">View Full Week</button>
          </div>
          <div className="flex flex-col gap-4">
            {[ 
              { time: '4:00 PM', title: 'Grade 5: Intro to Loops & Turtles', status: 'next' },
              { time: '5:30 PM', title: 'Grade 6: Advanced Arrays', status: 'upcoming' },
              { time: '7:00 PM', title: 'Grade 4: Basic Math in Python', status: 'upcoming' }
            ].map((session, i) => (
              <div key={i} className={`p-6 rounded-3xl flex justify-between items-center border ${session.status === 'next' ? 'bg-cc-surface-lowest border-cc-primary shadow-sm' : 'bg-transparent border-[#e3beb8]/40'}`}>
                <div className="flex gap-4 items-center">
                  <div className="w-16 text-right font-bold text-gray-500">{session.time}</div>
                  <div className="w-1 h-12 bg-gray-200 rounded-full"></div>
                  <div className="font-bold text-lg text-cc-secondary">{session.title}</div>
                </div>
                {session.status === 'next' && (
                   <button 
                     onClick={() => handleLaunchMeeting(session.title.replace(/[^a-zA-Z0-9]/g, '_'))}
                     className="px-6 py-2 rounded-full font-bold text-white bg-cc-primary text-sm transition-transform hover:-translate-y-1">
                     Start
                   </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
           <div className="flex justify-between items-end mb-6">
             <h2 className="text-2xl font-bold text-cc-secondary">Student Roster Alerts</h2>
             <button className="text-sm font-bold text-cc-primary">View All Students</button>
          </div>
          <div className="bg-cc-surface-lowest rounded-[3rem] p-6 shadow-sm border border-[#e3beb8]/20 flex flex-col gap-4">
            {[1, 2, 3].map((student, i) => (
              <div key={i} className="flex justify-between items-center p-2">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-cc-surface-low border border-cc-secondary-container"></div>
                   <div>
                     <div className="font-bold text-cc-secondary">Student {student}</div>
                     <div className="text-xs text-gray-500">Module: For Loops</div>
                   </div>
                 </div>
                 {i === 0 ? (
                   <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full border border-red-200">Needs Help</span>
                 ) : (
                   <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">On Track</span>
                 )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
