"use client";

import React from 'react';
import { motion } from "framer-motion";
import { ArrowUpRight, Compass, Pencil, Trophy, Sparkles, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const PathToProduction = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const steps = [
    {
      id: 1,
      title: "Diagnostic Test",
      desc: "Identify your baseline and discover your strongest sections in 180 minutes.",
      footer: "Full ELA and Math assessment",
      icon: Compass,
      color: "bg-white",
      textColor: "text-deep-forest",
      colSpan: "md:col-span-3"
    },
    {
      id: 2,
      title: "Skill Building",
      desc: "Targeted practice modules for every ELA and Math topic with instant solutions.",
      footer: "2,000+ adaptive questions",
      icon: Pencil,
      color: "bg-mint",
      textColor: "text-deep-forest",
      colSpan: "md:col-span-3"
    },
    {
      id: 3,
      title: "Mock Exams",
      desc: "Simulate the actual test environment with 10+ timed diagnostic exams.",
      footer: "Detailed school-specific reports",
      icon: Sparkles,
      color: "bg-deep-forest",
      textColor: "text-white",
      colSpan: "md:col-span-3",
      visual: true
    },
    {
      id: 4,
      title: "Admission",
      desc: "Celebrate your placement at NYC's top specialized high schools.",
      footer: "90% top choice success rate",
      icon: Trophy,
      color: "bg-[#4D5E4E]",
      textColor: "text-white",
      colSpan: "md:col-span-3"
    }
  ];

  return (
    <section className="w-full py-24 md:py-40 bg-off-white relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-[0.03]" />
      
      <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
        {/* Header Section */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 text-mint font-black text-xs uppercase tracking-[0.3em] mb-6"
          >
            <div className="w-10 h-[1px] bg-mint" />
            The Journey
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="text-[64px] md:text-[96px] font-bold leading-[0.9] tracking-tighter text-deep-forest mb-8 font-display"
          >
            The Success <br />
            <span className="text-text-gray/30">Roadmap</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl leading-relaxed text-text-gray max-w-[540px] font-medium"
          >
            From diagnostic to delivery, we provide the tools you need to ace the exam and secure your future.
          </motion.p>
        </div>

        {/* Bento Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr"
          >
            {steps.map((step) => (
              <motion.div 
                key={step.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className={cn(
                  "group rounded-[40px] p-10 flex flex-col justify-between overflow-hidden relative border border-black/[0.03] transition-colors duration-500",
                  step.color,
                  step.textColor,
                  step.colSpan
                )}
              >

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg",
                    step.id % 2 === 0 ? "bg-deep-forest text-white" : "bg-mint text-deep-forest"
                  )}>
                    {step.id}
                  </div>
                  <step.icon className={cn("w-6 h-6 opacity-30 group-hover:opacity-100 transition-opacity", step.textColor)} />
                </div>
                <h3 className="text-3xl font-bold leading-tight mb-4 font-display tracking-tight">
                  {step.title}
                </h3>
                <p className={cn("text-base leading-relaxed mb-10 font-medium opacity-80", step.textColor)}>
                  {step.desc}
                </p>
              </div>

              {step.visual && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none scale-150">
                   <Sparkles className="w-64 h-64 text-mint animate-[spin_20s_linear_infinite]" />
                </div>
              )}

              <div className="mt-auto relative z-10">
                <div className="flex items-center justify-between group/link cursor-pointer">
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-40">
                    {step.footer}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Large Visual Feature Card */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-12 bg-deep-forest rounded-[48px] p-12 md:p-20 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute inset-0 noise opacity-10" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-mint/5 rounded-full blur-[150px]" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <h3 className="text-white text-[48px] md:text-[72px] font-bold leading-[0.95] tracking-tighter font-display mb-8">
                  Your Path to <br />
                  <span className="text-mint">Stuyvesant</span> Starts Here.
                </h3>
                <p className="text-white/60 text-xl leading-relaxed mb-12 max-w-[45ch]">
                  Don't leave your admission to chance. Join the platform that has helped 5,000+ NYC students get into their top-choice specialized school.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-10 py-5 bg-mint text-deep-forest font-black rounded-2xl shadow-xl shadow-mint/20 hover:scale-105 transition-transform">
                    Claim Your Free Diagnostic
                  </button>
                  <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-colors">
                    View Success Rates
                  </button>
                </div>
              </div>

                <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[400px]">
                  {/* School Medallion Visuals */}
                  <div className="absolute top-0 right-10 p-8 glass-dark rounded-[40px] border border-white/10 shadow-2xl rotate-3 animate-float-up-large">
                    <div className="text-mint text-4xl font-black font-display mb-1">98%</div>
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">Score Growth</div>
                  </div>

                  <div className="absolute bottom-10 left-0 p-8 glass-dark rounded-[40px] border border-white/10 shadow-2xl -rotate-6 animate-float-down-large">
                    <div className="text-pastel-purple text-4xl font-black font-display mb-1">Top 1%</div>
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">National Percentile</div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">

                   <div className="w-64 h-64 bg-mint/10 rounded-full blur-3xl animate-pulse" />
                   <div className="w-32 h-32 bg-mint rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(200,242,123,0.4)]">
                      <GraduationCap className="w-16 h-16 text-deep-forest" />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PathToProduction;