"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Zap, BarChart3, Brain, BookX, ChevronRight, Sparkles } from 'lucide-react';

const DigitalTransition = () => {
  const features = [
    {
      icon: Monitor,
      title: "Mirror the Real Test",
      description: "Practice on an interface designed to match the actual digital SHSAT environment"
    },
    {
      icon: Zap,
      title: "Real-Time Feedback",
      description: "Instant explanations and guidance after every question—no waiting for answers"
    },
    {
      icon: Brain,
      title: "Adaptive Learning",
      description: "Our AI adjusts to your performance, focusing on areas where you need the most help"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Track progress, identify patterns, and watch your score trajectory climb"
    }
  ];

  return (
    <section className="w-full bg-[#0F172A] py-24 md:py-32 px-5 md:px-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#4F46E5]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#D6FF62]/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D6FF62]/10 border border-[#D6FF62]/20 text-[#D6FF62] text-xs font-black uppercase tracking-[0.2em] mb-6"
            >
              <Monitor className="w-3.5 h-3.5" />
              2025 Update
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-[56px] font-black text-white leading-[1.05] mb-6 tracking-tight font-display"
            >
              The SHSAT Went Digital in 2025.{' '}
              <span className="text-[#D6FF62]">So Should You.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-white/60 text-lg md:text-xl leading-relaxed mb-8"
            >
              The exam has evolved, and your preparation should too. Traditional textbooks can't replicate the digital testing experience. Our platform mirrors the actual test environment, helping you build familiarity and confidence with the format you'll face on test day.
            </motion.p>

            {/* Old vs New comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                <BookX className="w-5 h-5 text-white/40" />
                <span className="text-white/40 font-bold text-sm line-through">Traditional textbooks</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#D6FF62]/10 border border-[#D6FF62]/30">
                <Sparkles className="w-5 h-5 text-[#D6FF62]" />
                <span className="text-[#D6FF62] font-bold text-sm">Digital-first platform</span>
              </div>
            </motion.div>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D6FF62] text-[#0F172A] rounded-xl font-black text-sm hover:bg-[#C8F27B] transition-all shadow-xl shadow-[#D6FF62]/20 group"
            >
              Start Practicing Now
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          {/* Right - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "100%", label: "Digital Test Match" },
            { value: "2026", label: "CAT Format Ready" },
            { value: "10+", label: "Embedded Languages" },
            { value: "Real-time", label: "Performance Insights" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-3xl md:text-4xl font-black text-[#D6FF62] mb-1">{stat.value}</div>
              <div className="text-white/40 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalTransition;
