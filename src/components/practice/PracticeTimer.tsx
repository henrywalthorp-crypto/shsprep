"use client";

import React from "react";
import { Clock } from "lucide-react";

interface PracticeTimerProps {
  timeElapsed: number;
  timeLimit: number | null;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function PracticeTimer({ timeElapsed, timeLimit }: PracticeTimerProps) {
  return (
    <div className="flex items-center gap-4">
      {timeLimit && (
        <span className={`text-sm font-bold flex items-center gap-1 ${
          timeElapsed > timeLimit * 0.8 ? "text-[#EF4444]" : "text-slate-400"
        }`}>
          <Clock className="w-4 h-4" />
          {formatTime(Math.max(0, timeLimit - timeElapsed))}
        </span>
      )}
      <span className="text-sm font-bold text-slate-400 flex items-center gap-1">
        <Clock className="w-4 h-4" />{formatTime(timeElapsed)}
      </span>
    </div>
  );
}
