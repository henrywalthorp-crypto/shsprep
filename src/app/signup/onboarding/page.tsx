"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

const OnboardingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6">
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

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-deep-forest mb-2 font-display tracking-tight leading-tight">
          Tell us about your parent or guardian
        </h1>
        <p className="text-text-gray text-sm mb-10 leading-relaxed font-medium">
          We'll invite them to receive status updates and progress reports.
        </p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-deep-forest uppercase tracking-wider">
              Parent or guardian's email address
            </label>
            <input 
              type="email" 
              placeholder="email@address.com"
              className="w-full p-4 bg-off-white border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint focus:bg-white transition-all text-deep-forest placeholder:text-gray-400 font-medium"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[13px] font-bold text-deep-forest uppercase tracking-wider block">
              Parent or guardian's full name
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="First name"
                className="w-full p-4 bg-off-white border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint focus:bg-white transition-all text-deep-forest placeholder:text-gray-400 font-medium"
              />
              <input 
                type="text" 
                placeholder="Last name"
                className="w-full p-4 bg-off-white border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint focus:bg-white transition-all text-deep-forest placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="button"
              onClick={() => router.push("/signup/onboarding/ready")}
              className="w-full py-5 bg-mint text-deep-forest rounded-[24px] font-bold text-base flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/20 group"
            >
              Continue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
