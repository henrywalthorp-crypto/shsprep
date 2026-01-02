"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ChevronRight, HelpCircle, ArrowRight } from "lucide-react";

import { useRouter } from "next/navigation";

const PaywallPage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">("annual");

  const features = [
    "Personalized adaptive study plans",
    "10,000+ practice questions",
    "20+ full-length practice tests",
    "24/7 hints and explanations from our AI tutor",
    "Plus, prep for the SHSAT, Hunter College High School, and more",
  ];

  return (
    <div className="min-h-screen bg-deep-forest relative flex flex-col items-center p-6 md:p-12 overflow-x-hidden">
      {/* Wavy Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves-paywall" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q 25 10 50 20 T 100 20" fill="none" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves-paywall)" />
        </svg>
      </div>

      {/* Logo */}
      <div className="mb-8 z-20">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 bg-mint rounded-xl flex items-center justify-center text-deep-forest font-bold text-xl shadow-lg shadow-mint/20">
            S
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-display">
            SHS<span className="text-white/60">prep</span>
          </span>
        </Link>
      </div>

      {/* Paywall Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px] bg-white rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10 mb-12"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-deep-forest mb-8 font-display tracking-tight leading-tight">
          Experience expert-built, personalized SHS prep
        </h1>

        <div className="space-y-4 mb-8">
          <p className="text-sm font-bold text-deep-forest uppercase tracking-wider">You&apos;ll get:</p>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-mint/20 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-deep-forest" />
                </div>
                <span className="text-sm font-medium text-text-gray">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-mint/5 rounded-2xl p-6 mb-8 border border-mint/10">
          <p className="text-sm font-medium text-deep-forest leading-relaxed">
            Enjoy a 3-day free trial. Cancel anytime before your plan starts with no charge.
          </p>
          <p className="text-[11px] text-gray-500 mt-2">
            We&apos;re invested in your success with our Money-Back Guarantee.
          </p>
        </div>

        {/* Pricing Options */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => setSelectedPlan("annual")}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative ${
              selectedPlan === "annual"
                ? "border-deep-forest bg-deep-forest/5 ring-1 ring-deep-forest/10"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            {selectedPlan === "annual" && (
              <div className="absolute top-4 right-4 h-5 w-5 rounded-full bg-deep-forest flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-mint" />
              </div>
            )}
            <div className="flex justify-between items-start mb-1">
              <div>
                <span className="text-sm font-bold text-deep-forest">Annual</span>
                <span className="ml-2 inline-block px-2 py-0.5 bg-mint text-deep-forest text-[10px] font-bold rounded-full uppercase tracking-tighter">
                  Save 50%
                </span>
              </div>
              <span className="text-lg font-bold text-deep-forest">$599</span>
            </div>
            <p className="text-xs text-text-gray">
              Renews every 12 months <br />
              ($49.92/month)
            </p>
          </button>

          <button
            onClick={() => setSelectedPlan("monthly")}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all relative ${
              selectedPlan === "monthly"
                ? "border-deep-forest bg-deep-forest/5 ring-1 ring-deep-forest/10"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            {selectedPlan === "monthly" && (
              <div className="absolute top-4 right-4 h-5 w-5 rounded-full bg-deep-forest flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-mint" />
              </div>
            )}
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-deep-forest">Monthly</span>
              <span className="text-lg font-bold text-deep-forest">$99</span>
            </div>
            <p className="text-xs text-text-gray">Renews every month</p>
          </button>
        </div>

        <button className="text-xs font-bold text-deep-forest/60 hover:text-deep-forest flex items-center gap-1 transition-colors mb-8">
          <ChevronRight className="w-3 h-3 rotate-90" />
          Hide other options
        </button>

        {/* Money Back Guarantee */}
        <div className="bg-[#F3F9E8] rounded-2xl p-5 mb-10 flex gap-4 items-start border border-[#E1EFD0]">
          <div className="h-10 w-10 bg-mint rounded-xl flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-deep-forest" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-deep-forest mb-1">Our Money-Back Guarantee</h4>
            <p className="text-[11px] text-gray-600 leading-normal">
              We guarantee an increase of at least 200 points on the SHSAT. If not, we&apos;ll provide a full refund. View our full{" "}
              <Link href="/terms" className="underline hover:text-deep-forest">
                terms and conditions
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Payment Method Section (Mock) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-deep-forest uppercase tracking-wider">Payment Method</h3>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
              <HelpCircle className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Mock Stripe Link UI */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-8 bg-[#00D66F] rounded flex items-center justify-center text-[8px] text-white font-black italic">
                    link
                  </div>
                  <div className="h-4 w-4 bg-gray-200 rounded-full" />
                </div>
                <div className="flex gap-1">
                  <div className="h-1 w-1 bg-gray-300 rounded-full" />
                  <div className="h-1 w-1 bg-gray-300 rounded-full" />
                  <div className="h-1 w-1 bg-gray-300 rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 bg-[#1A1F71] rounded flex items-center justify-center text-[10px] text-white font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-deep-forest">Visa</p>
                    <p className="text-[10px] text-gray-400">•••• 5227</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>

              <button className="w-full mt-4 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all">
                Use this card
              </button>
            </div>

            {/* Billing Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Country</label>
                <div className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-medium text-deep-forest flex justify-between items-center">
                  United States
                  <ChevronRight className="w-3 h-3 rotate-90 text-gray-300" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">ZIP code</label>
                <input
                  type="text"
                  placeholder="ZIP"
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-mint text-xs font-medium"
                />
              </div>
            </div>

            <button className="text-[10px] font-bold text-gray-400 hover:text-deep-forest transition-colors ml-1">
              + Add promo code
            </button>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-3 pt-6 border-t border-gray-50">
            <div className="flex justify-between text-[11px] font-medium text-gray-500">
              <span>Billing Frequency</span>
              <span className="text-deep-forest font-bold">{selectedPlan === "annual" ? "Annual" : "Monthly"}</span>
            </div>
            <div className="flex justify-between text-[11px] font-medium text-gray-500">
              <span>Subtotal</span>
              <span className="text-deep-forest font-bold">{selectedPlan === "annual" ? "$599.00" : "$99.00"}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-deep-forest">
              <span>Total Billed After Trial</span>
              <span>{selectedPlan === "annual" ? "$599.00" : "$99.00"}</span>
            </div>
            <div className="flex justify-between text-[13px] font-bold text-deep-forest pt-1">
              <span>Due Today</span>
              <span className="text-mint-dark">$0</span>
            </div>
          </div>

          <button 
            onClick={() => router.push(`/signup/success?plan=${selectedPlan}`)}
            className="w-full py-5 bg-mint text-deep-forest rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/20 group"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[10px] text-gray-400 text-center leading-relaxed px-4">
            No payment due today. Cancel anytime.
          </p>

          <p className="text-[9px] text-gray-400 leading-relaxed text-center px-4">
            You&apos;ll get full access to your SHSprep plan until your trial ends on{" "}
            <span className="font-bold">January 1, 2026</span>. After that, you&apos;ll be billed {selectedPlan === "annual" ? "$599.00 annually" : "$99.00 monthly"} until cancelled. By providing your payment method, you authorize SHSprep Inc. to charge you according to their terms and agree to the <Link href="/terms" className="underline">Terms of Use</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </motion.div>

      <div className="mt-4 text-center pb-12 z-20">
        <p className="text-xs font-medium text-white/60 mb-3">Have another account?</p>
        <button className="px-8 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white hover:bg-white/20 transition-all">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default PaywallPage;
