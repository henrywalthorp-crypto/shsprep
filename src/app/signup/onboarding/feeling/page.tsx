"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, Check, Smile, Ghost, Rocket, HelpCircle } from "lucide-react";
import { saveOnboardingStep } from "@/lib/actions/onboarding";

const FeelingStep = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("Confident");

  const options = [
    { label: "Confident", icon: <Rocket className="w-5 h-5" /> },
    { label: "Nervous", icon: <Ghost className="w-5 h-5" /> },
    { label: "Just Getting Started", icon: <Smile className="w-5 h-5" /> },
    { label: "Unsure", icon: <HelpCircle className="w-5 h-5" /> },
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
            initial={{ width: 0 }}
            animate={{ width: "33.33%" }}
            className="h-full bg-mint"
          />
        </div>
      </div>

      <div className="max-w-[480px] w-full flex flex-col items-center text-center">
        {/* Illustration Placeholder */}
        <div className="w-32 h-32 bg-mint/10 rounded-full flex items-center justify-center mb-10">
           <HelpCircle className="w-12 h-12 text-mint animate-float-up" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-12 font-display leading-tight">
          Before we dive in...<br />how are you feeling about test prep right now?
        </h1>

        <div className="w-full space-y-3 mb-12">
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => setSelected(option.label)}
              className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all border-2 ${
                selected === option.label 
                  ? "bg-deep-forest border-mint shadow-lg shadow-mint/10" 
                  : "bg-white border-transparent hover:border-mint/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`${selected === option.label ? "text-mint" : "text-deep-forest"}`}>
                  {option.icon}
                </div>
                <span className={`font-bold text-base ${selected === option.label ? "text-white" : "text-deep-forest"}`}>
                  {option.label}
                </span>
              </div>
              {selected === option.label && (
                <div className="h-6 w-6 rounded-full bg-mint flex items-center justify-center">
                  <Check className="w-4 h-4 text-deep-forest stroke-[3px]" />
                </div>
              )}
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            saveOnboardingStep("feeling", { feeling: selected });
            router.push("/signup/onboarding/partnership");
          }}
          className="w-full py-5 bg-mint text-deep-forest rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/30 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default FeelingStep;
