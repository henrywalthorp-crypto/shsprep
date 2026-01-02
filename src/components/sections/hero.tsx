"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
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

  return (
    <section className="relative w-full bg-off-white overflow-hidden mesh-gradient">
      <div className="container px-5 pt-20 pb-10 mx-auto md:px-20 md:pt-28 md:pb-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full bg-deep-forest rounded-[32px] overflow-hidden min-h-[600px] md:min-h-[720px] flex flex-col md:grid md:grid-cols-12 shadow-[0_40px_100px_-20px_rgba(21,40,34,0.3)]"
        >
          {/* Noise Pattern Overlay */}
          <div className="absolute inset-0 noise" />
          
          {/* Background Decorative Elements */}
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-mint/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-pastel-purple/5 rounded-full blur-[150px]" />

          {/* Content Side */}
          <div className="relative z-20 col-span-12 md:col-span-7 flex flex-col justify-between p-8 md:p-20">
            <div className="max-w-xl">
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
              >
                <Sparkles className="w-4 h-4 text-mint" />
                <span className="text-white/80 text-xs font-bold tracking-widest uppercase">The Future of SHSAT Prep</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-white text-[56px] md:text-[88px] font-bold leading-[0.95] mb-8 tracking-tighter font-display text-gradient"
              >
                SHSAT Prep <br />
                <span className="text-mint relative inline-block">
                  On Your Terms
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
                    className="absolute bottom-4 left-0 h-2 bg-mint/20 -z-10 rounded-full"
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-white/70 text-lg md:text-2xl leading-relaxed max-w-[38ch] mb-12"
              >
                The digital platform built for NYC's most competitive exam. Master the SHSAT with <span className="text-white font-semibold underline decoration-mint/50 underline-offset-8">adaptive practice</span> and personalized analytics.
              </motion.p>
            </div>

            {/* Desktop CTAs */}
            <motion.div 
              variants={itemVariants}
              className="hidden md:grid grid-cols-2 gap-6 mt-auto"
            >
              <motion.a 
                href="/signup" 
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-row justify-between h-full p-8 bg-mint rounded-[28px] transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(200,242,123,0.3)]"
              >
                <span className="text-deep-forest font-bold text-2xl font-display">Start Practice</span>
                <div className="flex items-end justify-end">
                  <div className="w-12 h-12 bg-deep-forest rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110">
                    <ArrowUpRight className="w-6 h-6 text-mint" strokeWidth={2.5} />
                  </div>
                </div>
              </motion.a>

              <motion.a 
                href="/results" 
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-row justify-between h-full p-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-[28px] transition-all duration-300 pb-20"
              >
                <span className="text-white font-bold text-2xl font-display">See Results</span>
                <div className="flex items-start justify-end">
                  <div className="w-12 h-12 bg-mint rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-mint/20">
                    <ArrowUpRight className="w-6 h-6 text-deep-forest" strokeWidth={2.5} />
                  </div>
                </div>
              </motion.a>
            </motion.div>
          </div>

          {/* Asset Side */}
          <div className="relative col-span-12 md:col-span-5 h-[400px] md:h-full flex items-center justify-center md:items-end bg-gradient-to-br from-deep-forest to-black overflow-hidden">
            <div className="absolute inset-0 noise opacity-5" />
            
            <div className="relative w-full h-full flex items-center justify-center p-8 md:p-12">
               {/* Animated Dashboard Elements */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                 animate={{ opacity: 1, scale: 1, rotate: 3 }}
                 transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                 className="relative w-full max-w-[480px] space-y-6 perspective-1000 preserve-3d"
               >
                   {/* Card 1 */}
                   <div className="glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl animate-float-up">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 bg-mint rounded-2xl flex items-center justify-center text-deep-forest font-black text-2xl shadow-xl shadow-mint/20">98</div>
                        <div>
                          <div className="text-white font-bold text-xl font-display">ELA Mastery</div>
                          <div className="text-white/40 text-sm font-medium">99th Percentile Performance</div>
                        </div>
                      </div>
                      <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "92%" }}
                          transition={{ delay: 1.5, duration: 1.5 }}
                          className="bg-gradient-to-r from-mint to-mint/60 w-[92%] h-full rounded-full shimmer" 
                        />
                      </div>
                   </div>
  
                   {/* Card 2 */}
                   <div className="glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl translate-x-12 relative z-10 animate-float-down">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 bg-pastel-purple rounded-2xl flex items-center justify-center text-deep-forest font-black text-2xl shadow-xl shadow-pastel-purple/20">800</div>
                        <div>
                          <div className="text-white font-bold text-xl font-display">Math perfection</div>
                          <div className="text-white/40 text-sm font-medium">Stuyvesant Target Goal</div>
                        </div>
                      </div>
                      <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 1.8, duration: 1.5 }}
                          className="bg-gradient-to-r from-pastel-purple to-pastel-purple/60 w-full h-full rounded-full shimmer" 
                        />
                      </div>
                   </div>

                 
                 {/* Decorative Glow */}
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-mint/10 rounded-full blur-[80px]" />
               </motion.div>
            </div>
          </div>

          {/* Mobile CTAs */}
          <div className="flex md:hidden flex-col gap-4 p-8 pt-0 z-20">
             <motion.a 
               href="/signup" 
               whileTap={{ scale: 0.95 }}
               className="flex flex-row justify-between items-center p-6 bg-mint rounded-[24px] shadow-xl"
             >
                <span className="text-deep-forest font-bold text-xl font-display">Start Practice</span>
                <div className="w-12 h-12 bg-deep-forest rounded-2xl flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-mint" strokeWidth={2.5} />
                </div>
              </motion.a>
              <motion.a 
                href="/results" 
                whileTap={{ scale: 0.95 }}
                className="flex flex-row justify-between items-center p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-[24px]"
              >
                <span className="text-white font-bold text-xl font-display">See Results</span>
                <div className="w-12 h-12 bg-mint rounded-2xl flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-deep-forest" strokeWidth={2.5} />
                </div>
              </motion.a>
          </div>
        </motion.div>

        {/* Trusted By NYC Middle Schools */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 md:mt-32 text-center"
        >
          <p className="text-text-gray/50 text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-12">
            Trusted by top performers from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-30 font-display font-bold text-deep-forest text-2xl md:text-3xl">
             <motion.span whileHover={{ opacity: 1, scale: 1.1 }} className="cursor-default transition-all">MS 54</motion.span>
             <motion.span whileHover={{ opacity: 1, scale: 1.1 }} className="cursor-default transition-all">Anderson</motion.span>
             <motion.span whileHover={{ opacity: 1, scale: 1.1 }} className="cursor-default transition-all">IS 98</motion.span>
             <motion.span whileHover={{ opacity: 1, scale: 1.1 }} className="cursor-default transition-all">Wagner</motion.span>
             <motion.span whileHover={{ opacity: 1, scale: 1.1 }} className="cursor-default transition-all">Clinton</motion.span>
             <motion.span whileHover={{ opacity: 1, scale: 1.1 }} className="cursor-default transition-all">Hunter</motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;