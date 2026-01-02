"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SignUpSelectionPage = () => {
  return (
    <div className="min-h-screen bg-deep-forest relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Wavy Background Pattern - SVG Emulation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q 25 10 50 20 T 100 20" fill="none" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-mint/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-mint/5 rounded-full blur-[120px] animate-pulse" />

      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10"
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 bg-mint rounded-xl flex items-center justify-center text-deep-forest font-bold text-xl shadow-lg shadow-mint/20">
            S
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-display">
            SHS<span className="text-white/60">prep</span>
          </span>
        </Link>
      </motion.div>

      {/* Main Selection Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-[480px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-deep-forest text-center mb-10 font-display tracking-tight">
          Who's signing up today?
        </h1>

        <div className="space-y-4">
          {/* Option: Parent */}
          <Link href="/signup/parent" className="block group">
            <div className="flex items-center justify-between p-6 bg-off-white rounded-2xl border border-transparent hover:border-mint/30 hover:bg-mint/5 transition-all duration-300">
              <span className="text-lg font-bold text-deep-forest">I'm a parent</span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-deep-forest shadow-sm group-hover:bg-mint group-hover:text-deep-forest transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Option: Student */}
          <Link href="/signup/student" className="block group">
            <div className="flex items-center justify-between p-6 bg-off-white rounded-2xl border border-transparent hover:border-mint/30 hover:bg-mint/5 transition-all duration-300">
              <span className="text-lg font-bold text-deep-forest">I'm a student</span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-deep-forest shadow-sm group-hover:bg-mint group-hover:text-deep-forest transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>

        {/* Social Proof Box */}
        <div className="mt-8 p-6 bg-mint/10 rounded-[24px] text-center border border-mint/20">
          <div className="flex justify-center -space-x-2 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-sage">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} 
                  alt="Student" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-deep-forest leading-relaxed px-4">
            Join the <span className="font-bold text-deep-forest">40k+ students</span> already using SHSprep to reach their goal
          </p>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-gray font-medium">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-deep-forest font-bold hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpSelectionPage;
