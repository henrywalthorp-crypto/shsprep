"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TrendDirection } from "@/lib/types";

interface Skill {
  category: string;
  section: string;
  mastery_level: number;
  accuracy: number;
  trend: TrendDirection;
  total_attempted: number;
}

interface Props {
  skills: Skill[];
}

function barColor(mastery: number): string {
  if (mastery > 65) return "bg-[#22C55E]";
  if (mastery > 35) return "bg-[#F59E0B]";
  return "bg-[#EF4444]";
}

function TrendIcon({ trend }: { trend: TrendDirection }) {
  if (trend === "improving") return <TrendingUp className="w-4 h-4 text-[#22C55E]" />;
  if (trend === "declining") return <TrendingDown className="w-4 h-4 text-[#EF4444]" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

export default function SkillsOverview({ skills }: Props) {
  const mathSkills = skills.filter((s) => s.section === "math");
  const elaSkills = skills.filter((s) => s.section === "ela");

  const renderSection = (title: string, items: Skill[]) => (
    <div className="mb-8 last:mb-0">
      <h3 className="font-black text-deep-forest text-base mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">No data yet</p>
      ) : (
        <div className="space-y-4">
          {items.map((skill) => (
            <div key={skill.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-deep-forest">{skill.category}</span>
                <div className="flex items-center gap-2">
                  <TrendIcon trend={skill.trend} />
                  <span className="text-sm font-black text-slate-500">{Math.round(skill.mastery_level)}%</span>
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor(skill.mastery_level)}`}
                  style={{ width: `${Math.min(100, Math.max(2, skill.mastery_level))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
      {renderSection("Math Skills", mathSkills)}
      {renderSection("ELA Skills", elaSkills)}
    </div>
  );
}
