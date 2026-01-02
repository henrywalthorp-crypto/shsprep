"use client";

import React from 'react';
import { motion } from "framer-motion";
import { ShieldCheck, Mail, LineChart, Users, Smartphone, ArrowRight, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const Enterprise = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="w-full bg-white py-24 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-[0.03]" />
      
      <div className="container px-6 md:px-20 mx-auto max-w-[1280px] relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pastel-purple/20 border border-pastel-purple/20 text-deep-forest text-xs font-black uppercase tracking-[0.2em] mb-8"
          >
            <Users className="w-3.5 h-3.5" />
            Family Dashboard
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[56px] md:text-[80px] font-bold text-deep-forest leading-[0.95] mb-8 tracking-tighter font-display text-balance"
          >
            Built for <span className="text-text-gray/40">Families.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-text-gray max-w-[640px] mx-auto leading-relaxed font-medium"
          >
            The Parent Portal gives you complete visibility into your child's progress, strengths, and areas for improvement.
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
          {/* Card 1: Progress Reports */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="md:col-span-4 bg-muted rounded-[40px] p-10 flex flex-col justify-between border border-black/5 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-mint/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-deep-forest shadow-sm mb-8">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-deep-forest mb-4 font-display">Weekly Progress Reports</h3>
              <p className="text-base text-text-gray mb-8 font-medium">Detailed insights sent directly to your inbox every Sunday morning.</p>
            </div>
            <div className="mt-4 space-y-3 relative z-10">
               <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ delay: 0.5, duration: 1 }} className="h-2.5 bg-white rounded-full w-full relative overflow-hidden shadow-inner"><div className="absolute inset-0 shimmer opacity-50" /></motion.div>
               <motion.div initial={{ width: 0 }} whileInView={{ width: "80%" }} transition={{ delay: 0.7, duration: 1 }} className="h-2.5 bg-white rounded-full w-[80%] relative overflow-hidden shadow-inner"><div className="absolute inset-0 shimmer opacity-50" /></motion.div>
               <motion.div initial={{ width: 0 }} whileInView={{ width: "65%" }} transition={{ delay: 0.9, duration: 1 }} className="h-2.5 bg-white rounded-full w-[65%] relative overflow-hidden shadow-inner"><div className="absolute inset-0 shimmer opacity-50" /></motion.div>
            </div>
          </motion.div>

          {/* Center Column: Impact Stat (Dark Card) */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="md:col-span-4 bg-deep-forest rounded-[40px] p-12 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden shadow-2xl"
          >
             <div className="absolute inset-0 noise opacity-10" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-mint/5 rounded-full blur-[80px]" />
             
             <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative z-10 text-center"
             >
               <div className="text-mint text-[96px] font-black font-display leading-none mb-4 tracking-tighter drop-shadow-[0_0_40px_rgba(200,242,123,0.3)]">98%</div>
               <div className="text-white font-bold text-lg mb-2">Success Rate</div>
               <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Avg score growth among active students</div>
             </motion.div>
          </motion.div>

          {/* Card 3: Expert Support */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="md:col-span-4 bg-pastel-orange/10 rounded-[40px] p-10 border border-pastel-orange/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-pastel-orange rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pastel-orange/20 mb-8">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-deep-forest mb-4 font-display">Expert Support</h3>
              <p className="text-base text-text-gray font-medium">Direct access to NYC-based specialized school alumni for complex questions.</p>
            </div>
            <div className="mt-12 space-y-3">
              {[
                { t: "24/7 Question Support", icon: Zap },
                { t: "Video Solutions", icon: Target },
                { t: "Strategy Sessions", icon: Users }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-black/[0.03]">
                  <item.icon className="w-4 h-4 text-pastel-orange" />
                  <span className="text-sm text-deep-forest font-bold">{item.t}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 4: Topic Mastery */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="md:col-span-6 bg-pastel-purple/20 rounded-[40px] p-10 border border-black/5 min-h-[320px] flex flex-col lg:flex-row gap-10 items-center overflow-hidden"
          >
            <div className="flex-1">
              <div className="w-12 h-12 bg-pastel-purple rounded-2xl flex items-center justify-center text-deep-forest shadow-md mb-8">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-deep-forest mb-4 font-display">Topic Mastery</h3>
              <p className="text-base text-text-gray font-medium">See exactly which concepts need more focus before test day.</p>
            </div>
            <div className="flex-1 w-full grid grid-cols-2 gap-3 relative">
               <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
               {[
                 { t: "ALGEBRA", v: "92%", c: "bg-mint" },
                 { t: "GEOM", v: "45%", c: "bg-white" },
                 { t: "READING", v: "88%", c: "bg-mint" },
                 { t: "LOGIC", v: "70%", c: "bg-white" }
               ].map((m, i) => (
                 <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-5 rounded-[24px] shadow-sm relative z-10 border border-black/[0.03]"
                 >
                   <div className="text-[10px] font-black text-text-gray/40 uppercase tracking-widest mb-1">{m.t}</div>
                   <div className="text-2xl font-black text-deep-forest font-display">{m.v}</div>
                   <div className={cn("h-1 w-full mt-3 rounded-full overflow-hidden bg-muted")}>
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: m.v }}
                        transition={{ delay: 0.5 + i*0.1, duration: 1 }}
                        className={cn("h-full", m.c)} 
                      />
                   </div>
                 </motion.div>
               ))}
            </div>
          </motion.div>

          {/* Card 5: Mobile Access */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="md:col-span-6 bg-sage/40 rounded-[40px] p-10 border border-black/5 min-h-[320px] flex flex-col lg:flex-row gap-10 items-center overflow-hidden"
          >
            <div className="flex-1">
              <div className="w-12 h-12 bg-sage rounded-2xl flex items-center justify-center text-deep-forest shadow-md mb-8">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-deep-forest mb-4 font-display">Practice Anywhere</h3>
              <p className="text-base text-text-gray font-medium">Seamlessly transition from desktop to mobile for quick drills on the commute.</p>
              <motion.a href="#" className="inline-flex items-center gap-2 mt-8 text-deep-forest font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform">
                Get the mobile app <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>
            <div className="flex-1 flex justify-center items-end h-full pt-10">
               <motion.div 
                initial={{ y: 100 }}
                whileInView={{ y: 20 }}
                transition={{ duration: 0.8 }}
                className="w-48 h-80 bg-deep-forest rounded-[40px] border-[8px] border-white shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-white rounded-b-2xl z-20" />
                  <div className="absolute inset-0 p-4 pt-10 flex flex-col gap-4">
                     <div className="w-full h-24 bg-mint/20 rounded-2xl flex items-center justify-center"><Zap className="w-8 h-8 text-mint" /></div>
                     <div className="space-y-2">
                        <div className="w-full h-3 bg-white/10 rounded-full" />
                        <div className="w-2/3 h-3 bg-white/10 rounded-full" />
                     </div>
                     <div className="mt-auto grid grid-cols-2 gap-2">
                        <div className="aspect-square bg-white/5 rounded-xl" />
                        <div className="aspect-square bg-white/5 rounded-xl" />
                     </div>
                  </div>
               </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Enterprise;