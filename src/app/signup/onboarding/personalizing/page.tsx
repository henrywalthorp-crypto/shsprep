"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, CheckCircle2, Target } from "lucide-react";

const PersonalizingScreen = () => {
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
            initial={{ width: "77.77%" }}
            animate={{ width: "88.88%" }}
            className="h-full bg-mint"
          />
        </div>
      </div>

      <div className="max-w-[500px] w-full flex flex-col items-center text-center">
        {/* Task Card Illustration */}
        <div className="relative w-full mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-8 shadow-2xl relative overflow-visible"
          >
            {/* Goal Badge */}
            <div className="absolute -top-4 -right-4 bg-[#A3E9FF] text-deep-forest px-4 py-2 rounded-2xl font-bold flex items-center gap-2 shadow-lg">
              <Target className="w-4 h-4" />
              800
            </div>

            <h3 className="text-deep-forest text-xl font-bold text-left mb-6">Your Daily Tasks</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-mint/10 rounded-2xl border border-mint/20">
                <CheckCircle2 className="w-6 h-6 text-mint fill-current" />
                <div className="h-2 w-32 bg-mint/20 rounded-full" />
                <div className="h-2 w-12 bg-mint/20 rounded-full ml-auto" />
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-6 h-6 rounded-lg border-2 border-gray-200" />
                <div className="h-2 w-40 bg-gray-200 rounded-full" />
                <div className="h-2 w-10 bg-gray-200 rounded-full ml-auto" />
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl opacity-60">
                <div className="w-6 h-6 rounded-lg border-2 border-gray-200" />
                <div className="h-2 w-36 bg-gray-200 rounded-full" />
                <div className="h-2 w-14 bg-gray-200 rounded-full ml-auto" />
              </div>
            </div>
          </motion.div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display leading-tight">
          Got it, let&apos;s get you there!
        </h1>
        <p className="text-white/60 text-sm md:text-base font-medium mb-12">
          We&apos;re almost done personalizing your plan. We just need a few more details about you.
        </p>

        <button 
          onClick={() => router.push("/signup/onboarding/confidence")}
          className="w-full py-5 bg-mint text-deep-forest rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/30 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PersonalizingScreen;
