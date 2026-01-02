"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, BrainCircuit } from "lucide-react";

const ScoreStep = () => {
  const router = useRouter();
  const [score, setScore] = useState("");

    const handleContinue = () => {
      if (score) {
        localStorage.setItem("shs_onboarding_score", score);
        router.push(`/signup/onboarding/goal-score?current=${score}`);
      } else {
        localStorage.removeItem("shs_onboarding_score");
        router.push("/signup/onboarding/no-score");
      }
    };

  return (
    <div className="min-h-screen relative flex flex-col items-center pt-8 px-6">
      {/* Top Header with Progress */}
      <div className="w-full max-w-[600px] flex items-center gap-4 mb-16">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-white/60 hover:text-white transition-colors text-sm font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "44.44%" }}
            animate={{ width: "55.55%" }}
            className="h-full bg-mint"
          />
        </div>
      </div>

      <div className="max-w-[480px] w-full flex flex-col items-center text-center">
        {/* Illustration Placeholder */}
        <div className="w-32 h-32 bg-mint/10 rounded-full flex items-center justify-center mb-10">
           <BrainCircuit className="w-12 h-12 text-mint animate-float-up" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 font-display leading-tight">
          Do you have an official or practice SHSAT test score?
        </h1>
        <p className="text-white/60 text-sm md:text-base font-medium mb-12">
          No stress if it wasn&apos;t your best! Your score helps us start your plan in the right place.
        </p>

        <div className="w-full space-y-6 mb-12">
           <div className="relative group">
              <input 
                type="number" 
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Enter recent score"
                className="w-full p-6 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-mint/20 transition-all text-deep-forest placeholder:text-gray-400 font-bold text-xl text-center shadow-2xl"
              />
              <div className="absolute inset-x-0 -bottom-1 h-1 bg-mint/20 rounded-full scale-x-0 group-focus-within:scale-x-90 transition-transform" />
           </div>

           <button 
              onClick={() => router.push("/signup/onboarding/no-score")}
              className="text-white/60 hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2 w-full group"
           >
             I don&apos;t have a score yet
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        <button 
          onClick={handleContinue}
          className="w-full py-5 bg-mint text-deep-forest rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/30 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ScoreStep;
