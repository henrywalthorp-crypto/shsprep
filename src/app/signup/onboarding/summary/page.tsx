"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Target, ArrowRight, Zap, Brain } from "lucide-react";
import { completeOnboarding } from "@/lib/actions/onboarding";

const SummaryScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: "Student",
    currentScore: 500,
    goalScore: 700,
    strength: "Math",
    focus: "Time Management"
  });

  useEffect(() => {
    // Load data from localStorage
    const name = localStorage.getItem("shs_student_name") || "Student";
    const current = localStorage.getItem("shs_onboarding_score");
    const goal = localStorage.getItem("shs_onboarding_goal");
    const strength = localStorage.getItem("shs_onboarding_confidence");
    const focus = localStorage.getItem("shs_onboarding_worry");

    setData({
      name,
      currentScore: current ? parseInt(current) : 500,
      goalScore: goal ? parseInt(goal) : 700,
      strength: strength || "Math",
      focus: focus || "Time Management"
    });

    // Simulated loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const diff = data.goalScore - data.currentScore;
  const maxScore = 800;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-deep-forest overflow-hidden">
      {/* Wavy Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves-summary" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q 25 10 50 20 T 100 20" fill="none" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves-summary)" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center z-10"
          >
            <div className="relative w-32 h-32 mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-mint/20 border-t-mint rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-12 h-12 text-mint" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 font-display tracking-tight">
              Personalizing your plan...
            </h2>
            <p className="text-white/60 font-medium">Almost there!</p>
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-[800px] z-10"
          >
            <div className="text-center mb-12">
               <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-mint rounded-xl flex items-center justify-center text-deep-forest font-bold text-xl shadow-lg shadow-mint/20">
                  S
                </div>
                <span className="text-2xl font-bold text-white tracking-tight font-display">
                  SHS<span className="text-white/60">prep</span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-mint/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
               
               <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative">
                 <div className="flex-1 space-y-8 w-full">
                    <div className="flex items-center justify-between">
                      <h1 className="text-4xl font-black text-deep-forest font-display">
                        {data.name}’s Plan
                      </h1>
                      <div className="bg-mint/10 text-mint px-4 py-2 rounded-full text-xs font-black flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Built for you
                      </div>
                    </div>

                    {/* Graph */}
                    <div className="relative pt-8 pb-4">
                      <div className="flex items-end gap-1.5 h-32">
                        {Array.from({ length: 24 }).map((_, i) => {
                          const maxBars = 24;
                          const currentBarIndex = Math.floor((data.currentScore / maxScore) * maxBars);
                          const goalBarIndex = Math.floor((data.goalScore / maxScore) * maxBars);
                          
                          const isActive = i <= goalBarIndex;
                          const isDiff = i > currentBarIndex && i <= goalBarIndex;
                          
                          const height = 15 + (i / maxBars) * 85;

                          return (
                            <div 
                              key={i} 
                              className={`flex-1 rounded-full transition-all duration-1000 ${
                                isDiff ? "bg-mint" : isActive ? "bg-[#4F46E5]" : "bg-gray-100"
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          );
                        })}
                      </div>
                      
                      {/* Diff Badge */}
                      <div 
                        className="absolute top-0 bg-[#D6FF62] text-deep-forest px-3 py-1 rounded-full text-[10px] font-black shadow-lg"
                        style={{ left: `${(Math.floor((data.goalScore / maxScore) * 24) / 24) * 100}%`, transform: 'translateX(-50%)' }}
                      >
                        +{diff} pts
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-gray-50 p-6 rounded-3xl">
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                             <Target className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Current Score</span>
                          </div>
                          <div className="text-3xl font-black text-deep-forest">{data.currentScore}</div>
                       </div>
                       <div className="bg-mint p-6 rounded-3xl">
                          <div className="flex items-center gap-2 text-deep-forest/40 mb-2">
                             <Zap className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Goal Score</span>
                          </div>
                          <div className="text-3xl font-black text-deep-forest">{data.goalScore}</div>
                       </div>
                    </div>
                 </div>

                 <div className="w-full md:w-72 space-y-4">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Core Strength</div>
                       <div className="text-xl font-black text-deep-forest flex items-center gap-2">
                          <div className="w-8 h-8 bg-mint/20 rounded-lg flex items-center justify-center">
                             <Brain className="w-4 h-4 text-mint" />
                          </div>
                          {data.strength}
                       </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Focus Area</div>
                       <div className="text-xl font-black text-deep-forest flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#CEF1FF] rounded-lg flex items-center justify-center">
                             <Target className="w-4 h-4 text-[#00A3FF]" />
                          </div>
                          {data.focus}
                       </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={async () => {
                          await completeOnboarding();
                          router.push("/dashboard");
                        }}
                        className="w-full py-5 bg-[#4F46E5] text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-2 hover:bg-[#4338CA] transition-all shadow-xl shadow-[#4F46E5]/20 group"
                      >
                        Start Plan
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SummaryScreen;
