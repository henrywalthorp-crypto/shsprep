"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const FinalReadyScreen = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex flex-col items-center pt-8 px-6 pb-24">
      {/* Top Header with Progress */}
      <div className="w-full max-w-[600px] flex items-center gap-4 mb-16">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-white/60 hover:text-white transition-colors text-sm font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 h-1.5 bg-mint rounded-full" />
      </div>

      <div className="max-w-[600px] w-full flex flex-col items-center text-center">
        {/* Skateboarder Illustration Placeholder */}
        <div className="relative w-full aspect-square max-w-[400px] mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full h-full relative"
          >
            {/* Main Character Body (Simplified SVG) */}
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Background decorative elements */}
              <circle cx="300" cy="150" r="40" fill="#D6FF62" opacity="0.2" />
              <path d="M100 250 L120 230" stroke="#D6FF62" strokeWidth="8" strokeLinecap="round" />
              <path d="M80 270 L100 250" stroke="#CEF1FF" strokeWidth="8" strokeLinecap="round" />
              
              {/* Skateboard */}
              <rect x="120" y="320" width="160" height="12" rx="6" fill="#152822" />
              <circle cx="150" cy="340" r="12" fill="#152822" />
              <circle cx="250" cy="340" r="12" fill="#152822" />

              {/* Character (Abstract) */}
              <motion.g
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <rect x="180" y="150" width="40" height="120" rx="20" fill="#CEF1FF" />
                <circle cx="200" cy="120" r="35" fill="#152822" />
                <path d="M150 180 Q 200 150 250 180" fill="none" stroke="#152822" strokeWidth="12" strokeLinecap="round" />
              </motion.g>
            </svg>

            {/* Floaties */}
            <motion.div 
               animate={{ rotate: [0, 15, -15, 0] }}
               transition={{ repeat: Infinity, duration: 3 }}
               className="absolute top-1/4 right-10 w-12 h-12 bg-mint rounded-xl shadow-lg flex items-center justify-center transform rotate-12"
            >
               <span className="text-2xl font-bold text-deep-forest">★</span>
            </motion.div>
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-16 font-display leading-tight">
          Are you ready to get your personalized SHSAT plan?
        </h1>

        <button 
          onClick={() => router.push("/signup/onboarding/summary")}
          className="w-full max-w-[280px] py-6 bg-mint text-deep-forest rounded-[32px] font-black text-2xl flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-xl shadow-mint/20 active:scale-95"
        >
          Let's go!
        </button>
      </div>
    </div>
  );
};

export default FinalReadyScreen;
