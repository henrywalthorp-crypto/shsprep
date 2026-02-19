"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Check,
  ChevronRight,
  Clock,
  Sparkles,
  BookOpen,
  Calculator,
  Car,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  lesson_number: number;
  title: string;
  subtitle: string;
  estimated_minutes: number;
  status: "locked" | "available" | "in_progress" | "completed";
  score?: number;
}

interface Unit {
  id: string;
  track: string;
  unit_number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons_count: number;
  lessons: Lesson[];
  status: string;
}

export default function LessonsPage() {
  const router = useRouter();
  const [track, setTrack] = useState<"math" | "ela">("math");
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/lessons?track=${track}`)
      .then((r) => r.json())
      .then((d) => {
        setUnits(d.units || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [track]);

  // Find current position (first non-completed lesson)
  const currentLessonIndex = (() => {
    let idx = 0;
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        if (lesson.status !== "completed") return idx;
        idx++;
      }
      // If unit has no lessons, still count as a stop
      if (unit.lessons.length === 0) idx++;
    }
    return idx;
  })();

  // Flatten all lessons for the road
  const allStops: { lesson?: Lesson; unit: Unit; isUnitStart: boolean }[] = [];
  for (const unit of units) {
    if (unit.lessons.length > 0) {
      unit.lessons.forEach((l, i) => {
        allStops.push({ lesson: l, unit, isUnitStart: i === 0 });
      });
    } else {
      allStops.push({ unit, isUnitStart: true });
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-deep-forest font-display tracking-tight">
              Lessons
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-pastel-orange/30 text-orange-700 rounded-full">
              Beta
            </span>
          </div>
          <p className="text-text-gray text-sm">
            Master each topic step by step. Complete lessons to unlock the next.
          </p>
        </div>
      </div>

      {/* Track Tabs */}
      <div className="flex gap-2 mb-10">
        <button
          onClick={() => setTrack("math")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all",
            track === "math"
              ? "bg-deep-forest text-white shadow-lg shadow-deep-forest/20"
              : "bg-white text-text-gray border border-gray-200 hover:border-deep-forest/20"
          )}
        >
          <Calculator className="w-4 h-4" />
          Math Track
        </button>
        <button
          onClick={() => setTrack("ela")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all",
            track === "ela"
              ? "bg-deep-forest text-white shadow-lg shadow-deep-forest/20"
              : "bg-white text-text-gray border border-gray-200 hover:border-deep-forest/20"
          )}
        >
          <BookOpen className="w-4 h-4" />
          ELA Track
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-deep-forest border-t-transparent" />
        </div>
      ) : (
        <div className="relative pb-20">
          {/* The Road */}
          <Road stops={allStops} currentIndex={currentLessonIndex} onSelect={(lessonId) => {
            if (lessonId) router.push(`/dashboard/lessons/${lessonId}`);
          }} />
        </div>
      )}
    </div>
  );
}

// ── Road Component ──────────────────────────────────────────────────────────

function Road({
  stops,
  currentIndex,
  onSelect,
}: {
  stops: { lesson?: Lesson; unit: Unit; isUnitStart: boolean }[];
  currentIndex: number;
  onSelect: (lessonId: string | null) => void;
}) {
  return (
    <div className="relative">
      {stops.map((stop, i) => {
        const isLeft = Math.floor(i / 2) % 2 === 0 ? i % 2 === 0 : i % 2 !== 0;
        const isCurrent = i === currentIndex;
        const isCompleted = stop.lesson?.status === "completed";
        const isAvailable = stop.lesson?.status === "available" || stop.lesson?.status === "in_progress";
        const isLocked = !isCompleted && !isAvailable && !isCurrent;

        return (
          <div key={i}>
            {/* Unit header */}
            {stop.isUnitStart && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 mb-4 mt-8 first:mt-0"
              >
                <span className="text-2xl">{stop.unit.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-deep-forest font-display">
                    {stop.unit.title}
                  </h3>
                  <p className="text-xs text-text-gray">{stop.unit.description}</p>
                </div>
                {stop.unit.lessons.length === 0 && (
                  <span className="ml-auto px-3 py-1 text-xs font-bold text-text-gray bg-gray-100 rounded-full">
                    Coming Soon
                  </span>
                )}
              </motion.div>
            )}

            {/* Stop node */}
            {stop.lesson && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative flex items-center gap-4 mb-3"
              >
                {/* Road line */}
                {i < stops.length - 1 && stops[i + 1]?.lesson && (
                  <div
                    className={cn(
                      "absolute left-[22px] top-[44px] w-[3px] h-[calc(100%+0px)]",
                      isCompleted ? "bg-mint" : "bg-gray-200"
                    )}
                  />
                )}

                {/* Node circle */}
                <button
                  disabled={isLocked}
                  onClick={() => onSelect(stop.lesson!.id)}
                  className={cn(
                    "relative z-10 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all border-[3px]",
                    isCompleted && "bg-mint border-mint text-deep-forest shadow-md shadow-mint/30",
                    isCurrent && "bg-white border-deep-forest text-deep-forest shadow-lg shadow-deep-forest/20 scale-110",
                    isAvailable && !isCurrent && "bg-white border-deep-forest/40 text-deep-forest",
                    isLocked && "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{stop.lesson.lesson_number}</span>
                  )}

                  {/* Car indicator for current */}
                  {isCurrent && (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2"
                    >
                      <div className="bg-deep-forest text-white rounded-lg px-2 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Car className="w-3.5 h-3.5" />
                        <span>You</span>
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-deep-forest mx-auto" />
                    </motion.div>
                  )}
                </button>

                {/* Lesson info card */}
                <button
                  disabled={isLocked}
                  onClick={() => onSelect(stop.lesson!.id)}
                  className={cn(
                    "flex-1 text-left px-4 py-3 rounded-2xl transition-all",
                    isCompleted && "bg-mint/10 hover:bg-mint/20",
                    (isAvailable || isCurrent) && "bg-white border border-gray-200 hover:border-deep-forest/30 hover:shadow-md cursor-pointer",
                    isLocked && "bg-gray-50 cursor-not-allowed opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={cn(
                        "text-sm font-bold",
                        isLocked ? "text-gray-400" : "text-deep-forest"
                      )}>
                        {stop.lesson.title}
                      </h4>
                      {stop.lesson.subtitle && (
                        <p className="text-xs text-text-gray mt-0.5">{stop.lesson.subtitle}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[11px] text-text-gray">
                          <Clock className="w-3 h-3" />
                          {stop.lesson.estimated_minutes} min
                        </span>
                        {isCompleted && stop.lesson.score != null && (
                          <span className="flex items-center gap-1 text-[11px] text-mint font-bold">
                            <Sparkles className="w-3 h-3" />
                            {stop.lesson.score}%
                          </span>
                        )}
                      </div>
                    </div>
                    {!isLocked && (
                      <ChevronRight className={cn(
                        "w-5 h-5",
                        isCompleted ? "text-mint" : "text-gray-300"
                      )} />
                    )}
                  </div>
                </button>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
