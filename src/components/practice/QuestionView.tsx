"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { MathText } from "@/components/ui/MathText";

interface QuestionOption {
  label: string;
  text: string;
}

interface QuestionData {
  id: string;
  stem: string;
  stimulus: string | null;
  options: QuestionOption[] | null;
  type?: string;
}

interface QuestionViewProps {
  question: QuestionData;
  selectedAnswer: string | null;
  onSelectAnswer: (label: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function QuestionView({ question, selectedAnswer, onSelectAnswer, onSubmit, submitting }: QuestionViewProps) {
  return (
    <>
      {/* Stimulus / passage */}
      {question.stimulus && (
        <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200">
          <div className="prose prose-sm text-slate-700 max-w-none whitespace-pre-wrap">{question.stimulus}</div>
        </div>
      )}

      {/* Question stem */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 mb-6">
        <MathText className="text-lg font-bold text-deep-forest leading-relaxed block">{question.stem}</MathText>
      </div>

      {/* Options — multiple choice */}
      {question.options && question.options.length > 0 ? (
        <div className="space-y-3 mb-8">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => onSelectAnswer(opt.label)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                  isSelected
                    ? "border-[#4F46E5] bg-[#4F46E5]/5"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                  isSelected ? "bg-[#4F46E5] text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {opt.label}
                </div>
                <MathText className="font-bold text-deep-forest text-sm">{opt.text}</MathText>
              </button>
            );
          })}
        </div>
      ) : (
        /* Grid-in / free response input */
        <div className="mb-8">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Answer</label>
          <input
            type="text"
            value={selectedAnswer || ""}
            onChange={(e) => onSelectAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none text-lg font-bold text-deep-forest transition-all"
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter" && selectedAnswer) onSubmit(); }}
          />
        </div>
      )}

      {/* Submit button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onSubmit}
          disabled={!selectedAnswer || submitting}
          className="px-8 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all disabled:opacity-40 flex items-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Submit Answer
        </button>
      </div>
    </>
  );
}
