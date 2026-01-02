"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Layout, 
  BarChart2, 
  BookOpen, 
  Users, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Settings,
  PenTool,
  FileText,
  Info
} from "lucide-react";

const DashboardPage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("Fardin");
  const [testDate, setTestDate] = useState("");
  const [scores, setScores] = useState({
    reading: { current: 550, goal: 600 },
    math: { current: 550, goal: 600 }
  });

  useEffect(() => {
    const savedName = localStorage.getItem("shs_student_name");
    if (savedName) setUserName(savedName);
  }, []);

  const handleScoreChange = (type: 'reading' | 'math', field: 'current' | 'goal', value: string) => {
    const val = parseInt(value);
    if (!isNaN(val)) {
      setScores(prev => ({
        ...prev,
        [type]: { ...prev[type], [field]: Math.min(val, 800) }
      }));
    }
  };

  const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active ? "bg-[#1E293B] text-white" : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </div>
  );

  const ScoreCard = ({ title, type }: { title: string, type: 'reading' | 'math' }) => {
    const current = scores[type].current;
    const goal = scores[type].goal;
    const diff = goal - current;

    return (
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-deep-forest font-bold text-lg tracking-tight">{title}</h3>
          {diff > 0 && (
            <div className="bg-[#D6FF62] text-deep-forest px-3 py-1 rounded-full text-[10px] font-black">
              +{diff}pts
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Score:</label>
            <input 
              type="number" 
              value={current}
              onChange={(e) => handleScoreChange(type, 'current', e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold text-2xl"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Goal Score:</label>
            <input 
              type="number" 
              value={goal}
              onChange={(e) => handleScoreChange(type, 'goal', e.target.value)}
              className="w-full p-4 bg-[#D6FF62]/20 rounded-2xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold text-2xl"
            />
          </div>
        </div>

        <div className="relative pt-6 pb-2">
          <div className="h-2 w-full bg-slate-100 rounded-full relative">
            <div className="absolute left-0 h-full bg-[#D6FF62] rounded-full" style={{ width: `${(goal / 800) * 100}%` }} />
            <div 
               className="absolute top-1/2 -translate-y-1/2 h-6 w-6 bg-white border-4 border-[#D6FF62] rounded-full shadow-lg cursor-pointer"
               style={{ left: `${(goal / 800) * 100}%` }}
            />
            <div 
               className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-[#4F46E5] rounded-full shadow-md"
               style={{ left: `${(current / 800) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span>200</span>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-[#4F46E5] rounded-full" />
               <span>Current</span>
               <div className="w-2 h-2 bg-[#D6FF62] rounded-full" />
               <span>Goal</span>
            </div>
            <span>800</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-64 bg-[#0F172A] flex flex-col p-6 fixed inset-y-0 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="h-8 w-8 bg-mint rounded-lg flex items-center justify-center text-deep-forest font-bold text-lg shadow-lg shadow-mint/20">
            S
          </div>
          <span className="text-xl font-bold text-white tracking-tight font-display">
            SHS<span className="text-white/40">prep</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={PenTool} label="Practice" onClick={() => router.push("/dashboard/practice")} />
          <SidebarItem icon={BookOpen} label="Mock Exams" onClick={() => router.push("/dashboard/mock-exams")} />
          <SidebarItem icon={Layout} label="Study Plan" active />
          <SidebarItem icon={BarChart2} label="Performance" onClick={() => router.push("/dashboard/performance")} />
          
          <div className="pt-8 pb-4">
             <span className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Additional Tools</span>
          </div>
          
          <SidebarItem icon={Users} label="Partner Directory" onClick={() => router.push("/dashboard/partners")} />
          <SidebarItem icon={Info} label="Exam Info" onClick={() => router.push("/dashboard/exam-info")} />
          <SidebarItem icon={FileText} label="Resources" onClick={() => router.push("/dashboard/resources")} />
        </nav>

        <div 
          onClick={() => router.push("/dashboard/profile")}
          className="pt-6 border-t border-slate-800 flex items-center justify-between mt-auto cursor-pointer hover:bg-[#1E293B] -mx-2 px-2 py-3 rounded-xl transition-all"
        >
           <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-mint rounded-lg flex items-center justify-center text-deep-forest font-bold text-sm">
                {userName[0]}
              </div>
              <span className="text-sm font-bold text-slate-300">{userName}</span>
           </div>
           <Settings className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
        </div>
      </aside>

      <main className="flex-1 ml-64 p-12">
        <div className="max-w-4xl">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-deep-forest font-display">Create a Study Plan</h1>
            </div>
            <p className="text-slate-400 font-medium">Fill out the information below to generate a plan to improve your score on the SHSAT.</p>
          </header>

          <section className="space-y-12">
            <div>
              <h2 className="text-lg font-black text-deep-forest mb-6 tracking-tight">Enter Your Test Date</h2>
              <div className="relative max-w-sm">
                 <input 
                   type="text" 
                   placeholder="Select a test date"
                   value={testDate}
                   onChange={(e) => setTestDate(e.target.value)}
                   className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-sm font-medium pr-10"
                 />
                 <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-deep-forest mb-6 tracking-tight">Enter Your Current and Goal Scores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreCard title="Reading & Writing:" type="reading" />
                <ScoreCard title="Math:" type="math" />
              </div>
            </div>

            <div>
               <h2 className="text-lg font-black text-deep-forest mb-6 tracking-tight">Enter your Preferred Day for Mock Exams</h2>
               <p className="text-xs text-slate-400 font-medium mb-4 -mt-4">Your plan will include a weekly mock exam on this day of week.</p>
               <div className="relative max-w-sm">
                  <select className="w-full p-4 bg-white border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-[#4F46E5] text-sm font-bold text-deep-forest cursor-pointer">
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
            </div>

            <div className="flex justify-center pt-8">
              <button className="px-10 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all active:scale-95">
                Commit To My Goal
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
