"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, Map } from "lucide-react";

const HelpScreen = () => {
  const router = useRouter();
  const [worry, setWorry] = useState("the exam");

  useEffect(() => {
    const savedWorry = localStorage.getItem("shs_onboarding_worry");
    if (savedWorry) {
      setWorry(savedWorry.toLowerCase());
    }
  }, []);

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
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "100%" }}
            className="h-full bg-mint"
          />
        </div>
      </div>

      <div className="max-w-[500px] w-full flex flex-col items-center text-center">
        {/* Road Illustration */}
        <div className="relative w-full aspect-square max-w-[320px] mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full bg-white rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-8"
          >
            {/* Mock Exam Results */}
            <div className="w-full grid grid-cols-2 gap-3 mb-8">
              <div className="bg-[#D6FF62] p-4 rounded-2xl">
                <div className="h-4 w-12 bg-black/10 rounded-full mb-2" />
                <div className="h-6 w-20 bg-black/20 rounded-full" />
              </div>
              <div className="bg-[#CEF1FF] p-4 rounded-2xl">
                <div className="h-4 w-12 bg-black/10 rounded-full mb-2" />
                <div className="h-6 w-16 bg-black/20 rounded-full" />
              </div>
            </div>

            {/* Road Path */}
            <svg viewBox="0 0 200 120" className="w-full drop-shadow-lg">
              <path 
                d="M10 100 Q 40 100 50 70 T 90 40 T 130 70 T 190 70" 
                fill="none" 
                stroke="#152822" 
                strokeWidth="12" 
                strokeLinecap="round"
              />
              <motion.circle 
                initial={{ offset: 0 }}
                animate={{ cx: [10, 50, 90, 130, 190], cy: [100, 70, 40, 70, 70] }}
                transition={{ duration: 3, repeat: Infinity }}
                r="6" 
                fill="#C8F27B" 
              />
            </svg>
            
            <div className="absolute top-1/2 right-4">
               <motion.div 
                 animate={{ rotate: [0, 10, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-8 h-8 bg-mint rounded-lg shadow-lg flex items-center justify-center"
               >
                 <Map className="w-4 h-4 text-deep-forest" />
               </motion.div>
            </div>
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
          We're here to help!
        </h1>

        <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-[400px]">
          A lot of students struggle with <span className="text-mint font-bold italic">{worry}</span> too. 
          That's why we're designing your plan to help you level up fast and confidently.
        </p>

        <button 
          onClick={() => router.push("/signup/onboarding/final-ready")}
          className="w-full py-5 bg-mint text-deep-forest rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/30 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default HelpScreen;
