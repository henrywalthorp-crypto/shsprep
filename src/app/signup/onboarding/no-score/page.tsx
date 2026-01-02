"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, Mountain, Flag, Star } from "lucide-react";

const NoScoreScreen = () => {
  const router = useRouter();

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
            initial={{ width: "55.55%" }}
            animate={{ width: "66.66%" }}
            className="h-full bg-mint"
          />
        </div>
      </div>

      <div className="max-w-[500px] w-full flex flex-col items-center text-center">
        {/* Mountain Illustration Placeholder */}
        <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Mountain className="w-48 h-48 text-white/20" />
            
            {/* Floaties */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 right-10"
            >
              <div className="bg-mint p-2 rounded-lg shadow-xl rotate-12">
                <Flag className="w-6 h-6 text-deep-forest fill-current" />
              </div>
            </motion.div>

            {/* Score Cards Floating */}
            <motion.div 
              animate={{ x: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute top-10 -left-12 bg-[#B8E26B] p-4 rounded-xl shadow-2xl text-deep-forest font-bold"
            >
              <div className="text-2xl">96%</div>
              <div className="text-[10px] uppercase opacity-60">Strongest Section</div>
            </motion.div>

            <motion.div 
              animate={{ x: [5, -5, 5] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
              className="absolute top-24 -right-12 bg-[#FFB8E0] p-4 rounded-xl shadow-2xl text-deep-forest font-bold"
            >
              <div className="text-2xl">82%</div>
              <div className="text-[10px] uppercase opacity-60">Biggest Opportunity</div>
            </motion.div>

            {/* Stars */}
            <Star className="absolute top-0 right-0 w-6 h-6 text-mint fill-current opacity-20" />
            <Star className="absolute bottom-10 left-0 w-4 h-4 text-white fill-current opacity-10" />
          </motion.div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 font-display leading-tight">
          No practice test? No problem.
        </h1>
        <p className="text-white/60 text-sm md:text-base font-medium mb-12 max-w-[400px]">
          You&apos;re starting exactly where most students do. We&apos;ll build your personalized plan from here and help you see progress from day one.
        </p>

        <button 
          onClick={() => router.push("/signup/onboarding/goal-score")}
          className="w-full py-5 bg-mint text-deep-forest rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/30 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default NoScoreScreen;
