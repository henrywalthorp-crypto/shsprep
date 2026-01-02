"use client";

import React from 'react';
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Zap, GraduationCap } from 'lucide-react';

const CTABottom = () => {
  return (
    <section className="w-full px-5 py-24 md:py-40 bg-white relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-[0.02]" />
      
      <div className="container max-w-[1280px] mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-deep-forest rounded-[48px] p-12 md:p-24 lg:p-32 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.4)]"
        >
          {/* Animated Background Graphics */}
          <div className="absolute inset-0 noise opacity-10" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-mint/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pastel-purple/10 rounded-full blur-[100px]" 
          />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-20">
            <div className="flex-1 max-w-[700px] text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10"
              >
                <Sparkles className="w-4 h-4 text-mint" />
                <span className="text-white/80 text-[10px] font-black tracking-[0.3em] uppercase">Ready for excellence?</span>
              </motion.div>
              
              <h2 className="text-[64px] md:text-[88px] font-black text-white leading-[0.9] tracking-tighter mb-10 font-display">
                Start your <br />
                <span className="text-mint underline decoration-mint/20 underline-offset-8">SHSAT journey.</span>
              </h2>
              <p className="text-white/50 text-xl md:text-2xl leading-relaxed max-w-[38ch] font-medium mx-auto lg:mx-0 mb-12">
                Join thousands of students who have secured their future at NYC's most prestigious specialized high schools.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-10 opacity-30">
                 <div className="flex items-center gap-3"><Zap className="w-6 h-6 text-mint" /><span className="text-white font-bold uppercase tracking-widest text-[10px]">Instant Access</span></div>
                 <div className="flex items-center gap-3"><GraduationCap className="w-6 h-6 text-mint" /><span className="text-white font-bold uppercase tracking-widest text-[10px]">Stuyvesant Track</span></div>
              </div>
            </div>

            <div className="w-full lg:w-auto self-stretch flex items-center justify-center lg:items-end">
              <motion.a 
                href="/signup" 
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative block w-full md:w-[380px] bg-white rounded-[32px] p-10 text-deep-forest shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="w-16 h-16 rounded-full bg-deep-forest flex items-center justify-center text-mint transition-transform group-hover:rotate-45 group-hover:scale-110">
                    <ArrowUpRight className="w-8 h-8" strokeWidth={3} />
                  </div>
                </div>
                
                <div className="flex flex-col justify-between h-full min-h-[140px]">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 block">Premium Prep</span>
                    <span className="text-4xl font-black font-display leading-none tracking-tighter block">
                      Start Your <br />Free Test
                    </span>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-2">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-off-white overflow-hidden shadow-sm">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="Student" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-deep-forest/40">+5k Students</span>
                  </div>
                </div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABottom;