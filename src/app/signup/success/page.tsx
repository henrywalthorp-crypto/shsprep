"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "monthly";
  
  const isAnnual = plan === "annual";
  const subtotal = isAnnual ? 599.0 : 99.0;
  const taxes = Number((subtotal * 0.0838).toFixed(2));
  const total = Number((subtotal + taxes).toFixed(2));

  return (
    <div className="min-h-screen bg-deep-forest relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Wavy Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves-success" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q 25 10 50 20 T 100 20" fill="none" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves-success)" />
        </svg>
      </div>

      {/* Logo */}
      <div className="absolute top-12 mb-8 z-20">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 bg-mint rounded-xl flex items-center justify-center text-deep-forest font-bold text-xl shadow-lg shadow-mint/20">
            S
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-display">
            SHS<span className="text-white/60">prep</span>
          </span>
        </Link>
      </div>

      {/* Success Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <h1 className="text-2xl font-bold text-deep-forest mb-8 font-display">
          Your plan details
        </h1>

        {/* Plan Summary Box */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-bold text-deep-forest mb-4">
            SHSprep {isAnnual ? "Annual" : "Monthly"}
          </h2>
          
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>Estimated Taxes (8.38%)</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-900 font-bold pt-1">
              <span>Total billed today</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-xs text-gray-900 font-bold border-t border-gray-100 pt-3 mt-1">
              <div className="flex flex-col">
                <span>Total billed after trial</span>
                <span className="text-[10px] text-gray-400 font-normal mt-0.5">Due January 01, 2026</span>
              </div>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Box */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Payment method
          </h3>
          <p className="text-sm font-medium text-deep-forest">
            Link: <span className="text-gray-500">fardinc2320@gmail.com</span>
          </p>
        </div>

        <button 
          onClick={() => window.location.href = "/signup/onboarding"}
          className="w-full py-4 bg-mint text-deep-forest rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/20 group"
        >
          Continue
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep-forest" />}>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
