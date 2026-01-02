"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ArrowRight } from "lucide-react";

const GoalScoreContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current score from query or default to 500
  const currentScoreStr = searchParams.get("current");
  const currentScore = currentScoreStr ? parseInt(currentScoreStr) : 500;
  
  const [goalScore, setGoalScore] = useState(700);
  const maxScore = 800;

  // Calculate bars for the graph
  // We'll show 20 bars total
  const totalBars = 20;
  const currentBarIndex = Math.floor((currentScore / maxScore) * totalBars);
  const goalBarIndex = Math.floor((goalScore / maxScore) * totalBars);

  const diff = goalScore - currentScore;

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
            initial={{ width: "66.66%" }}
            animate={{ width: "77.77%" }}
            className="h-full bg-mint"
          />
        </div>
      </div>

      <div className="max-w-[600px] w-full flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display leading-tight">
          Now, what&apos;s your goal score?
        </h1>
        <p className="text-white/60 text-sm md:text-base font-medium mb-12">
          An estimate works great if you&apos;re not sure yet.
        </p>

        {/* Dynamic Graph */}
        <div className="w-full mb-16 relative px-4">
          <div className="flex items-end justify-between h-40 gap-1 mb-4">
            {Array.from({ length: totalBars }).map((_, i) => {
              const isActive = i <= goalBarIndex;
              const isCurrent = i <= currentBarIndex;
              const isDiff = i > currentBarIndex && i <= goalBarIndex;
              
              // Height based on index (logarithmic/stepped look)
              const height = 10 + (i / totalBars) * 90;

              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex-1 rounded-t-full transition-colors duration-500 ${
                    isDiff ? "bg-mint" : isCurrent ? "bg-white" : "bg-white/10"
                  }`}
                />
              );
            })}
          </div>

          {/* Labels */}
          <div className="flex justify-between text-white/40 text-xs font-bold uppercase tracking-wider">
            <div className="text-left">
              <div>Current</div>
              <div className="text-white text-lg mt-1">{currentScore}</div>
            </div>
            <div className="text-right">
              <div>Max</div>
              <div className="text-white text-lg mt-1">{maxScore}</div>
            </div>
          </div>

          {/* Diff Badge */}
          {diff > 0 && (
            <motion.div 
              key={diff}
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="absolute top-0 bg-mint text-deep-forest px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              style={{ left: `${(goalBarIndex / totalBars) * 100}%`, transform: 'translateX(-50%)' }}
            >
              +{diff} pts
            </motion.div>
          )}
        </div>

        {/* Input Card */}
        <div className="w-full space-y-6 mb-12">
          <div className="relative group">
            <input 
              type="number" 
              value={goalScore}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) setGoalScore(Math.min(val, maxScore));
              }}
              className="w-full p-6 bg-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-mint/20 transition-all text-deep-forest placeholder:text-gray-400 font-bold text-3xl text-center shadow-2xl"
            />
          </div>

          <button 
            onClick={() => router.push("/signup/onboarding/personalizing")}
            className="text-white/60 hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2 w-full group"
          >
            I don&apos;t have a goal score yet
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

          <button 
            onClick={() => {
              localStorage.setItem("shs_onboarding_goal", goalScore.toString());
              router.push("/signup/onboarding/personalizing");
            }}
            className="w-full py-5 bg-mint text-deep-forest rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/30 group"
          >
            Continue
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
      </div>
    </div>
  );
};

const GoalScoreScreen = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep-forest" />}>
      <GoalScoreContent />
    </Suspense>
  );
};

export default GoalScoreScreen;
