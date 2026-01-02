"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Target, Brain, ArrowUpRight, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart as ReBarChart, Cell } from 'recharts';
import { cn } from "@/lib/utils";

const data = [
  { name: 'Week 1', score: 420 },
  { name: 'Week 2', score: 480 },
  { name: 'Week 3', score: 460 },
  { name: 'Week 4', score: 540 },
  { name: 'Week 5', score: 520 },
  { name: 'Week 6', score: 610 },
  { name: 'Week 7', score: 590 },
];

const topicData = [
  { name: 'Algebra', val: 92, color: '#C8F27B' },
  { name: 'Geom', val: 45, color: '#D9D9E9' },
  { name: 'ELA', val: 88, color: '#C8F27B' },
  { name: 'Logic', val: 70, color: '#D9D9E9' },
];

interface FeatureItemProps {
  title: string;
  description: string;
  icon: any;
  variantColor: string;
  delay: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description, icon: Icon, variantColor, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col py-8 border-b border-black/5 last:border-b-0 group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xl font-bold text-deep-forest font-display tracking-tight">{title}</h4>
        <motion.div 
          whileHover={{ rotate: 45 }}
          className={`p-2 rounded-xl ${variantColor} shadow-sm border border-black/5`}
        >
          <Icon size={20} className="text-deep-forest" strokeWidth={2.5} />
        </motion.div>
      </div>
      <p className="text-base text-text-gray leading-relaxed max-w-[90%] font-medium">
        {description}
      </p>
    </motion.div>
  );
};

const TailoredOptimization = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const tabs = [
    { name: 'Score Analysis', icon: BarChart, color: 'bg-mint' },
    { name: 'Adaptive Quiz', icon: Sparkles, color: 'bg-pastel-orange' },
    { name: 'Mistake Tracker', icon: Brain, color: 'bg-pastel-purple' },
  ];

  return (
    <section className="w-full bg-white py-24 md:py-40 px-5 md:px-20 relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-[0.02]" />
      
      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-black/5 text-deep-forest text-xs font-black uppercase tracking-[0.2em] mb-8"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Performance Engine
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-[56px] md:text-[80px] font-bold text-deep-forest leading-[0.95] mb-8 tracking-tighter font-display text-balance"
          >
            Personalized Learning, <br />
            <span className="text-text-gray/40">Proven Results</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-text-gray text-xl md:text-2xl max-w-[640px] mx-auto leading-relaxed"
          >
            Our adaptive algorithm identifies your weaknesses and builds a custom study path to maximize your score.
          </motion.p>
        </div>

        {/* Tab Switcher */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16"
        >
          {tabs.map((tab, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveTab(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight border",
                activeTab === idx 
                  ? `${tab.color} border-black/5 text-deep-forest shadow-xl shadow-black/5 scale-105` 
                  : "bg-off-white border-transparent text-text-gray hover:bg-muted"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === idx ? "text-deep-forest" : "text-text-gray")} />
              {tab.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-off-white rounded-[40px] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-black/5"
        >
          {/* Left Column */}
          <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-12">
                  <h3 className="text-4xl md:text-5xl font-bold text-deep-forest mb-6 font-display tracking-tight">
                    {activeTab === 0 ? "Intelligent Mastery" : activeTab === 1 ? "Adaptive Drills" : "Zero-Waste Study"}
                  </h3>
                  <p className="text-lg md:text-xl text-text-gray leading-relaxed max-w-[500px] font-medium opacity-80">
                    Don't waste time on what you already know. Our engine focuses your energy on the areas that will actually raise your score.
                  </p>
                </div>

                <div className="flex flex-col">
                  <FeatureItem 
                    title="Performance Analytics"
                    description="Deep dive into your results with detailed breakdowns by topic and difficulty level."
                    icon={BarChart}
                    variantColor="bg-mint"
                    delay={0.1}
                  />
                  <FeatureItem 
                    title="Goal Tracking"
                    description="Set target scores for specific schools like Stuyvesant and track your progress daily."
                    icon={Target}
                    variantColor="bg-pastel-orange"
                    delay={0.2}
                  />
                  <FeatureItem 
                    title="AI Concept Reinforcement"
                    description="Get instant explanations and recommended drills for every question you get wrong."
                    icon={Brain}
                    variantColor="bg-mint"
                    delay={0.3}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column - Visual Analytics Preview */}
          <div className="flex-1 bg-white flex items-center justify-center p-8 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mint/5 to-pastel-purple/5" />
            
            <motion.div 
              initial={{ rotateY: 20, rotateX: 10 }}
              whileInView={{ rotateY: 0, rotateX: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-full h-full bg-deep-forest rounded-[32px] p-8 md:p-12 flex flex-col gap-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] relative z-10 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                   <div className="text-white font-bold text-2xl font-display">Score Trajectory</div>
                   <div className="text-white/40 text-[10px] font-bold tracking-widest uppercase mt-1">Stuyvesant Track: Active</div>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />)}
                </div>
              </div>

              {/* Real Chart using Recharts */}
              <div className="flex-1 h-64 -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C8F27B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#C8F27B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      hide 
                    />
                    <YAxis 
                      hide 
                      domain={[350, 650]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#152822', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#C8F27B', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#C8F27B" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
                >
                  <div className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-2">Current Score</div>
                  <div className="text-white text-4xl font-black font-display tracking-tighter">590</div>
                  <div className="flex items-center gap-1.5 text-mint text-xs font-bold mt-2">
                    <TrendingUp className="w-3 h-3" />
                    +20 pts this week
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl"
                >
                  <div className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-2">Accuracy</div>
                  <div className="text-white text-4xl font-black font-display tracking-tighter">88%</div>
                  <div className="text-pastel-purple text-xs font-bold mt-2">Top 5% Student</div>
                </motion.div>
              </div>

                {/* Floating feature tags */}
                <div 
                  className="absolute top-8 right-8 bg-mint text-deep-forest text-[10px] font-black px-3 py-1.5 rounded-xl shadow-xl shadow-mint/20 animate-float-small"
                >
                  LIVE ANALYSIS
                </div>

              </motion.div>
            </div>
          </motion.div>

        {/* Schools Checklist */}
        <div className="mt-20 flex flex-wrap justify-center gap-10 md:gap-20 opacity-40">
           {['Stuyvesant', 'Bronx Science', 'Brooklyn Tech', 'Staten Island Tech'].map((school, i) => (
             <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center">
                   <CheckCircle2 className="w-3 h-3 text-deep-forest" strokeWidth={3} />
                </div>
                <span className="text-deep-forest font-bold tracking-tight text-lg">{school}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default TailoredOptimization;