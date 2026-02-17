"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PricingCards } from "@/components/billing/PricingCards";

const features = [
  "Personalized adaptive study plans",
  "10,000+ practice questions",
  "20+ full-length practice tests",
  "24/7 hints and explanations from our AI tutor",
  "Plus, prep for the SHSAT, Hunter College High School, and more",
];

function PaywallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<"monthly" | "annual" | null>(null);
  const [stripeError, setStripeError] = useState(false);

  const handleSelect = async (plan: "monthly" | "annual") => {
    setLoading(plan);
    setStripeError(false);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setStripeError(true);
        setLoading(null);
      }
    } catch {
      setStripeError(true);
      setLoading(null);
    }
  };

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
            All plans include unlimited access through December 31st. We&apos;re invested in your success with our Money-Back Guarantee.
          </p>
        </div>

        {stripeError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-sm font-bold text-amber-700">Payment system temporarily unavailable</p>
            <p className="text-xs text-amber-600 mt-1">Please try again in a moment.</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mb-8">
          <PricingCards onSelect={handleSelect} loading={loading} />
        </div>

        <p className="text-[10px] text-gray-400 text-center leading-relaxed px-4">
          By continuing you agree to the{" "}
          <Link href="/terms" className="underline">Terms of Use</Link> and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  );
}

export default function PaywallPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep-forest" />}>
      <PaywallContent />
    </Suspense>
  );
}
