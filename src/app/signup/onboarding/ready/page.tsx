"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";

const ReadyStep = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 md:p-12">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="absolute top-8 left-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-20 border border-white/10"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="absolute top-12 mb-8 z-20 flex flex-col items-center">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 bg-mint rounded-xl flex items-center justify-center text-deep-forest font-bold text-xl shadow-lg shadow-mint/20">
            S
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-display">
            SHS<span className="text-white/60">prep</span>
          </span>
        </Link>
      </div>

      <div className="max-w-[600px] w-full flex flex-col items-center text-center mt-12">
        {/* Illustration Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] bg-mint/10 rounded-full flex items-center justify-center">
             {/* Simple stylized illustration using icons and shapes */}
             <div className="absolute -top-4 -right-4 bg-mint p-6 rounded-3xl shadow-xl shadow-mint/20 flex flex-col items-center">
                <span className="text-[10px] font-bold text-deep-forest uppercase tracking-wider mb-1">Question Accuracy:</span>
                <span className="text-4xl font-black text-deep-forest font-display">94%</span>
                <span className="text-[10px] font-medium text-deep-forest/60 mt-1 text-center">30 correct out of 32 questions</span>
             </div>
             
             <div className="relative z-10 flex flex-col items-center gap-4">
               <TrendingUp className="w-24 h-24 text-mint animate-float-up" />
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-mint/40 animate-pulse" />
                 <div className="w-3 h-3 rounded-full bg-mint/60 animate-pulse delay-75" />
                 <div className="w-3 h-3 rounded-full bg-mint animate-pulse delay-150" />
               </div>
             </div>

             {/* Stylized background shapes */}
             <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-mint/20 rounded-full blur-2xl" />
             <div className="absolute top-1/2 -left-12 w-16 h-16 bg-white/5 rounded-full blur-xl" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white mb-6 font-display leading-tight"
        >
          We&apos;re going to get you ready for your test and help you reach a score you&apos;re proud of.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-base md:text-lg font-medium mb-12"
        >
          Ready to build your study plan?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-[400px]"
        >
          <button 
            onClick={() => router.push("/signup/onboarding/feeling")}
            className="w-full py-5 bg-mint text-deep-forest rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/30 group"
          >
            Continue
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ReadyStep;
