"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowRight, Check, AlertTriangle, Layout, Clock, Target, Lightbulb } from "lucide-react";
import { saveOnboardingStep } from "@/lib/actions/onboarding";

const options = [
  { id: "math", label: "Math", icon: Target },
  { id: "reading", label: "Reading and Writing", icon: Layout },
  { id: "time", label: "Time Management", icon: Clock },
  { id: "strategy", label: "Test Taking Strategy", icon: AlertTriangle },
];

  const WorriesScreen = () => {
    const router = useRouter();
    const [selected, setSelected] = useState("reading");

    const handleContinue = () => {
      const selectedOption = options.find(o => o.id === selected);
      if (selectedOption) {
        localStorage.setItem("shs_onboarding_worry", selectedOption.label);
        saveOnboardingStep("worries", { worry: selectedOption.label });
      }
      router.push("/signup/onboarding/help");
    };

    return (
      <div className="min-h-screen relative flex flex-col items-center pt-8 px-6 pb-24">

      {/* Top Header with Progress */}
      <div className="w-full max-w-[600px] flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-white/60 hover:text-white transition-colors text-sm font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "94.44%" }}
            animate={{ width: "100%" }}
            className="h-full bg-mint"
          />
        </div>
      </div>

      <div className="max-w-[500px] w-full flex flex-col items-center text-center">
        {/* Illustration Placeholder */}
        <div className="relative w-full h-48 mb-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="w-64 h-40 bg-white/5 rounded-[32px] border border-white/10 flex items-center justify-center">
               <Lightbulb className="w-24 h-24 text-white/20" />
            </div>
            {/* Floaties */}
            <motion.div 
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ repeat: Infinity, duration: 4 }}
               className="absolute -top-4 -left-4 bg-[#FFB8E0] p-3 rounded-2xl shadow-xl"
            >
               <AlertTriangle className="w-6 h-6 text-deep-forest" />
            </motion.div>
          </motion.div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 font-display leading-tight">
          Which part of the exam worries you the most?
        </h1>

        <div className="w-full space-y-4 mb-12">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                selected === option.id 
                  ? "bg-[#1A1F3F] border-white/20 text-white shadow-xl shadow-black/20" 
                  : "bg-white border-transparent text-deep-forest hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <option.icon className={`w-5 h-5 ${selected === option.id ? "text-mint" : "text-gray-400"}`} />
                <span className="font-bold">{option.label}</span>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                selected === option.id 
                  ? "bg-mint border-mint" 
                  : "border-gray-200 bg-transparent"
              }`}>
                {selected === option.id && <Check className="w-4 h-4 text-deep-forest" />}
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={handleContinue}
          className="w-full py-5 bg-mint text-deep-forest rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#B8E26B] transition-all shadow-lg shadow-mint/30 group"
        >
          Continue
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default WorriesScreen;
