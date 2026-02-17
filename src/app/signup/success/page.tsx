"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Crown, Loader2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(!!sessionId);
  const [premiumActivated, setPremiumActivated] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Verify Stripe session if present
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/stripe/status?session_id=${sessionId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.subscription_status === "active") {
          setPremiumActivated(true);
        }
      })
      .catch(() => {})
      .finally(() => setVerifying(false));
  }, [sessionId]);

  // Auto-redirect after 3 seconds
  useEffect(() => {
    if (verifying) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          router.push("/dashboard");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [verifying, router]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-deep-forest flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-mint mx-auto mb-4" />
          <p className="text-white/60 text-sm font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

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
      <div className="absolute top-12 z-20">
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
        className="w-full max-w-[440px] bg-white rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10 text-center"
      >
        {premiumActivated ? (
          <>
            <div className="h-16 w-16 bg-[#22C55E]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-[#22C55E]" />
            </div>
            <h1 className="text-2xl font-bold text-deep-forest mb-3 font-display">
              Premium Activated! 🎉
            </h1>
            <p className="text-sm text-slate-400 font-medium mb-8">
              You now have unlimited access to all questions, mock exams, and detailed analytics.
            </p>
          </>
        ) : (
          <>
            <div className="h-16 w-16 bg-mint/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-deep-forest" />
            </div>
            <h1 className="text-2xl font-bold text-deep-forest mb-3 font-display">
              Welcome to SHS Prep! 🎉
            </h1>
            <p className="text-sm text-slate-400 font-medium mb-8">
              Your account is ready. Subscribe to get started with unlimited practice!
            </p>
          </>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-4 bg-mint text-deep-forest rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/20 group"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-xs text-slate-400 mt-4">
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
        </p>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep-forest" />}>
      <SuccessContent />
    </Suspense>
  );
}
