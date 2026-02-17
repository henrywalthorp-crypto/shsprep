"use client";

import React from "react";
import { Check, Crown, Sparkles } from "lucide-react";

interface PricingCardsProps {
  onSelect: (plan: "monthly" | "annual") => void;
  compact?: boolean;
  loading?: "monthly" | "annual" | null;
}

const FEATURES = [
  "Unlimited practice questions",
  "Full mock exams",
  "Detailed analytics & trends",
  "All categories & subcategories",
  "Access through December 31st",
  "Priority support",
];

export function PricingCards({ onSelect, compact = false, loading = null }: PricingCardsProps) {
  return (
    <div className="space-y-6">
      {/* Plans */}
      <div className={`grid ${compact ? "grid-cols-1 gap-3" : "grid-cols-1 md:grid-cols-2 gap-4"}`}>
        {/* Monthly */}
        <button
          onClick={() => onSelect("monthly")}
          disabled={loading !== null}
          className="relative p-5 rounded-2xl border-2 border-slate-200 hover:border-[#4F46E5] bg-white text-left transition-all hover:shadow-md disabled:opacity-60 group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-[#4F46E5]" />
            <span className="text-sm font-black text-deep-forest">Monthly</span>
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-black text-deep-forest">$30</span>
            <span className="text-xs text-slate-400 font-bold">/month</span>
          </div>
          {!compact && (
            <ul className="space-y-1.5 mb-4">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                  <Check className="w-3 h-3 text-[#22C55E] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          <div className="w-full py-2.5 bg-[#4F46E5]/5 text-[#4F46E5] rounded-xl font-black text-xs text-center group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
            {loading === "monthly" ? "Loading..." : "Get Started"}
          </div>
        </button>

        {/* Annual */}
        <button
          onClick={() => onSelect("annual")}
          disabled={loading !== null}
          className="relative p-5 rounded-2xl border-2 border-[#4F46E5] bg-white text-left transition-all shadow-md hover:shadow-lg disabled:opacity-60 group"
        >
          {/* Badge */}
          <div className="absolute -top-3 right-4 px-3 py-1 bg-[#4F46E5] text-white text-[10px] font-black rounded-full uppercase tracking-wide">
            Best Value
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <span className="text-sm font-black text-deep-forest">Annual</span>
            <span className="ml-auto px-2 py-0.5 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-black rounded-full">
              Save 58%
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-black text-deep-forest">$150</span>
            <span className="text-xs text-slate-400 font-bold">/year</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mb-3">Just $12.50/month</p>
          {!compact && (
            <ul className="space-y-1.5 mb-4">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                  <Check className="w-3 h-3 text-[#22C55E] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          <div className="w-full py-2.5 bg-[#4F46E5] text-white rounded-xl font-black text-xs text-center group-hover:bg-[#4338CA] transition-all">
            {loading === "annual" ? "Loading..." : "Get Started"}
          </div>
        </button>
      </div>
    </div>
  );
}
