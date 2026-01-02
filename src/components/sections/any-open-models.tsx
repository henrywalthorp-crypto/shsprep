"use client";

import React from 'react';
import { motion } from "framer-motion";
import { BookOpen, Target, GraduationCap, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const AnyOpenModels = () => {
  const modelTags = [
    { name: 'Algebra II', dotColor: '#EF4444' },
    { name: 'Reading Comp', dotColor: '#F9B384' },
    { name: 'Grammar', dotColor: '#C8F27B' },
    { name: 'Word Problems', dotColor: '#D9D9E9' },
    { name: 'Geometry', dotColor: '#F9B384' },
    { name: 'Logical Reas.', dotColor: '#C8F27B' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section className="w-full bg-off-white py-24 md:py-40 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 noise opacity-[0.03]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-mint/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pastel-purple/5 rounded-full blur-[120px]" />

      <div className="container px-6 md:px-20 mx-auto max-w-[1280px] relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left Content Column */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="w-full lg:w-[45%]"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/20 text-deep-forest text-xs font-black uppercase tracking-widest mb-6">
              <BookOpen className="w-3 h-3" />
              Content Library
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-[48px] md:text-[64px] font-bold leading-[0.95] text-deep-forest mb-8 tracking-tighter font-display text-balance">
              Practice Every Section <br />
              <span className="text-text-gray/40">of the SHSAT</span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-text-gray text-lg md:text-xl leading-relaxed mb-12 max-w-[48ch]">
              Master both ELA and Math with our comprehensive question bank. Tailored for the new digital testing format used in New York City.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-6">
              {/* Feature Card 1 */}
              <motion.div 
                whileHover={{ scale: 1.02, x: 10 }}
                className="bg-white rounded-[28px] p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-black/[0.03] group transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-pastel-orange/20 flex items-center justify-center text-pastel-orange group-hover:bg-pastel-orange group-hover:text-white transition-colors">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-deep-forest font-display">2,000+ Realistic Questions</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {modelTags.map((tag, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 bg-off-white px-3 py-2 rounded-xl text-[12px] font-bold text-deep-forest border border-black/[0.02]"
                    >
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: tag.dotColor }}
                      ></span>
                      {tag.name}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Feature Card 2 */}
              <motion.div 
                whileHover={{ scale: 1.02, x: 10 }}
                className="bg-deep-forest rounded-[28px] p-8 shadow-2xl flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-mint">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">Full-Length Mock Exams</h3>
                    <p className="text-white/50 text-sm">10+ timed diagnostic tests</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-mint group-hover:text-deep-forest transition-all">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Image Column - Practice Interface Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: -2 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[55%] relative perspective-1000"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-mint/20 to-pastel-purple/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative bg-deep-forest rounded-[40px] p-6 md:p-12 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col gap-8 border border-white/10 preserve-3d">
                <div className="absolute top-0 right-0 w-full h-full noise opacity-5" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <div className="w-3 h-3 rounded-full bg-pastel-orange" />
                      <div className="w-3 h-3 rounded-full bg-mint" />
                    </div>
                    <span className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 bg-white/5 rounded-full border border-white/5">
                      SHSAT Terminal v4.0
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-mint animate-pulse" />
                    <span className="text-mint text-[10px] font-black tracking-widest uppercase">Live Proctoring</span>
                  </div>
                </div>

                <div className="flex-1 bg-white/[0.03] rounded-3xl p-8 md:p-12 border border-white/5 flex flex-col gap-10 relative overflow-hidden backdrop-blur-md">
                   <div className="absolute top-0 left-0 w-1 h-full bg-mint shadow-[0_0_20px_rgba(200,242,123,0.5)]" />
                   
                   <div className="text-white text-2xl md:text-3xl font-bold leading-tight font-display">
                    "Based on the passage, which inference can be made about the narrator's perspective on the industrial revolution?"
                  </div>
                  
                  <div className="grid gap-4">
                    {[
                      { l: "A", t: "It brought unprecedented prosperity to all social classes." },
                      { l: "B", t: "It created a profound sense of alienation from nature.", active: true },
                      { l: "C", t: "It was a necessary evil for modern progress." },
                      { l: "D", t: "It represented a pinnacle of human intellectual achievement." }
                    ].map((opt, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.08)" }}
                        className={cn(
                          "group/opt p-5 rounded-2xl text-white/80 text-base md:text-lg border transition-all cursor-pointer flex items-center gap-5",
                          opt.active 
                            ? "bg-mint/10 border-mint/30 text-white shadow-[0_0_30px_rgba(200,242,123,0.1)]" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        )}
                      >
                        <span className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors shadow-lg",
                          opt.active ? "bg-mint text-deep-forest" : "bg-white/5 text-white/40 group-hover/opt:bg-white/10 group-hover/opt:text-white"
                        )}>
                          {opt.l}
                        </span>
                        <span className="font-medium tracking-tight">{opt.t}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-white/30 text-xs font-bold relative z-10 px-2">
                  <div className="flex items-center gap-4">
                    <span>Question 14 of 57</span>
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="w-1/4 h-full bg-mint" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-mint" /> 2:45:12 REMAINING</span>
                    <div className="px-6 py-2 bg-mint text-deep-forest rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg shadow-mint/20 cursor-pointer hover:scale-105 transition-transform">Next Section</div>
                  </div>
                </div>
              </div>

              {/* Decorative floating bits */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-10 -right-10 bg-pastel-purple p-6 rounded-3xl shadow-2xl z-20 border border-white/20 hidden md:block"
              >
                <div className="text-deep-forest font-black text-2xl font-display">ELA 98%</div>
                <div className="text-deep-forest/40 text-[10px] font-bold uppercase tracking-widest mt-1">Mastery Level</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnyOpenModels;