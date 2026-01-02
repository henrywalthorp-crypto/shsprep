"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";

const PartnershipStep = () => {
  const router = useRouter();

  const features = [
    "We'll build a plan to fit your goals and schedule so you know where to focus.",
    "We'll pinpoint the areas that will help you improve faster and adapt as you learn.",
    "You'll move fast with instant hints and explanations so you never get stuck.",
    "You'll build up your stamina with full-length practice exams.",
    "You'll know when you're ready with accurate score predictions.",
  ];

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
            initial={{ width: "33.33%" }}
            animate={{ width: "66.66%" }}
            className="h-full bg-mint"
          />
        </div>
      </div>

      <div className="max-w-[600px] w-full flex flex-col items-center">
        {/* Illustration Placeholder */}
        <div className="flex gap-4 mb-12">
           <div className="w-20 h-24 bg-white/10 rounded-2xl transform -rotate-12 border border-white/5 flex items-center justify-center">
             <div className="w-10 h-1 bg-mint/40 rounded-full" />
           </div>
           <div className="w-24 h-28 bg-mint/20 rounded-2xl border border-mint/20 flex flex-col items-center justify-center gap-2 shadow-xl shadow-mint/10 z-10">
              <div className="w-12 h-1 bg-mint rounded-full" />
              <div className="w-8 h-1 bg-mint/60 rounded-full" />
           </div>
           <div className="w-20 h-24 bg-white/10 rounded-2xl transform rotate-12 border border-white/5 flex items-center justify-center">
             <div className="w-10 h-1 bg-mint/40 rounded-full" />
           </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 font-display leading-tight text-center">
          You&apos;re in the right place.
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-white/80 mb-12 font-display text-center">
          Here&apos;s how we&apos;ll partner up to give you an edge on test day:
        </h2>

        <div className="w-full space-y-6 mb-16">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="h-6 w-6 rounded-full bg-mint flex items-center justify-center shrink-0 mt-1">
                <Check className="w-4 h-4 text-deep-forest stroke-[3px]" />
              </div>
              <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed">
                {feature}
              </p>
            </motion.div>
          ))}
        </div>

        <button 
          onClick={() => router.push("/signup/onboarding/score")}
          className="w-full max-w-[400px] py-5 bg-mint text-deep-forest rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/30 group mb-12"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PartnershipStep;
