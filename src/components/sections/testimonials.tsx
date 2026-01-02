"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Quote, Star, ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    logo: "/schools/stuy.png",
    school: "Stuyvesant",
    quote: "SHSprep was the reason I got into Stuyvesant. The adaptive practice helped me focus on my Math weaknesses, and the full-length mock exams made the actual test day feel like just another practice session.",
    author: "Kevin J.",
    role: "Class of '27",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
    color: "bg-mint"
  },
  {
    logo: "/schools/bronx.png",
    school: "Bronx Science",
    quote: "As a parent, I loved the progress reports. Being able to see exactly where my daughter was struggling allowed us to find the right support for her. She's now attending Bronx Science, her first choice school!",
    author: "Sarah M.",
    role: "Parent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    color: "bg-pastel-purple"
  },
  {
    logo: "/schools/brooklyn.png",
    school: "Brooklyn Tech",
    quote: "The ELA section was always my biggest challenge. The explanations on SHSprep were so much clearer than any prep book I've used. I saw my score jump by 80 points in just two months.",
    author: "Aaliyah W.",
    role: "Class of '27",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aaliyah",
    color: "bg-pastel-orange"
  }
];

export default function Testimonials() {
  const [index, setIndex] = React.useState(0);

  return (
    <section className="w-full py-24 md:py-40 bg-off-white relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-[0.02]" />
      
      <div className="container px-6 md:px-20 mx-auto max-w-[1280px] relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-20 md:mb-32 gap-12">
          <div className="max-w-[700px] text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/20 text-deep-forest text-xs font-black uppercase tracking-[0.2em] mb-8"
            >
              <Star className="w-3.5 h-3.5 fill-deep-forest" />
              Success Stories
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[56px] md:text-[80px] font-bold text-deep-forest leading-[0.95] mb-8 tracking-tighter font-display"
            >
              Join the <span className="text-text-gray/40">Top 1%.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl text-text-gray leading-relaxed font-medium"
            >
              Join thousands of NYC students who have achieved their dream of attending a specialized high school.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <a 
              href="/results" 
              className="group flex flex-col items-center justify-center w-48 h-48 bg-deep-forest rounded-full text-mint relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 noise opacity-20" />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest">See All</span>
                <span className="text-3xl font-black font-display tracking-tight">Results</span>
                <div className="w-10 h-10 bg-mint rounded-full flex items-center justify-center text-deep-forest mt-2 group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
                whileHover={{ y: -12 }}
                className="bg-white rounded-[40px] p-10 flex flex-col h-full min-h-[500px] border border-black/[0.03] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-[transform,border-color,box-shadow] relative group"
              >

              <div className="absolute top-8 right-8 text-deep-forest opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <Quote className="w-24 h-24" />
              </div>

              <div className="mb-12">
                 <div className={cn("inline-block px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-deep-forest shadow-sm", t.color)}>
                    {t.school}
                 </div>
              </div>

              <blockquote className="flex-grow">
                <p className="text-2xl font-bold leading-tight text-deep-forest font-display tracking-tight">
                  "{t.quote}"
                </p>
              </blockquote>

              <div className="mt-12 pt-8 border-t border-black/[0.03] flex items-center gap-5">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-off-white shadow-md border border-black/5"
                >
                  <img 
                    src={t.avatar} 
                    alt={t.author} 
                    className="object-cover"
                  />
                </motion.div>
                <div>
                  <h4 className="text-lg font-black text-deep-forest leading-tight font-display">
                    {t.author}
                  </h4>
                  <p className="text-sm text-text-gray font-bold uppercase tracking-widest mt-1">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 md:hidden flex justify-center">
            <motion.a 
              href="/results" 
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-deep-forest rounded-full text-sm font-black text-mint uppercase tracking-widest shadow-2xl"
            >
              See our results
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
        </div>
      </div>
    </section>
  );
}