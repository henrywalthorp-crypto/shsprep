"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";

interface QuestionOption {
  label: string;
  text: string;
}

interface FeedbackData {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  commonMistakes: { label: string; explanation: string }[];
  nextQuestion: unknown | null;
}

interface QuestionData {
  stem: string;
  stimulus: string | null;
  options: QuestionOption[] | null;
}

interface FeedbackViewProps {
  question: QuestionData;
  feedback: FeedbackData;
  selectedAnswer: string | null;
  onNext: () => void;
}

export function FeedbackView({ question, feedback, selectedAnswer, onNext }: FeedbackViewProps) {
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
        <p className="text-lg font-bold text-deep-forest leading-relaxed">{question.stem}</p>
      </div>

      {/* Options with feedback highlighting */}
      {question.options && question.options.length > 0 ? (
        <div className="space-y-3 mb-8">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt.label;
            const isCorrectOption = opt.label === feedback.correctAnswer;
            const isWrong = isSelected && !feedback.isCorrect;

            let borderClass = "border-slate-200";
            let bgClass = "bg-white";
            if (isCorrectOption) {
              borderClass = "border-[#22C55E]";
              bgClass = "bg-[#22C55E]/5";
            } else if (isWrong) {
              borderClass = "border-[#EF4444]";
              bgClass = "bg-[#EF4444]/5";
            }

            return (
              <button
                key={opt.label}
                disabled
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${borderClass} ${bgClass}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                  isCorrectOption
                    ? "bg-[#22C55E] text-white"
                    : isWrong
                    ? "bg-[#EF4444] text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {isCorrectOption ? <CheckCircle2 className="w-5 h-5" /> :
                   isWrong ? <XCircle className="w-5 h-5" /> :
                   opt.label}
                </div>
                <span className="font-bold text-deep-forest text-sm">{opt.text}</span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Grid-in answer feedback */
        <div className="mb-8 space-y-3">
          <div className={`p-5 rounded-2xl border-2 flex items-center gap-4 ${
            feedback.isCorrect ? "border-[#22C55E] bg-[#22C55E]/5" : "border-[#EF4444] bg-[#EF4444]/5"
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              feedback.isCorrect ? "bg-[#22C55E] text-white" : "bg-[#EF4444] text-white"
            }`}>
              {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-400">Your answer: </span>
              <span className="text-sm font-bold text-deep-forest">{selectedAnswer}</span>
            </div>
          </div>
          {!feedback.isCorrect && (
            <div className="p-5 rounded-2xl border-2 border-[#22C55E] bg-[#22C55E]/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#22C55E] text-white shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-400">Correct answer: </span>
                <span className="text-sm font-bold text-deep-forest">{feedback.correctAnswer}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feedback panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 mb-6 border ${
          feedback.isCorrect ? "bg-[#22C55E]/5 border-[#22C55E]/20" : "bg-[#EF4444]/5 border-[#EF4444]/20"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          {feedback.isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
          ) : (
            <XCircle className="w-6 h-6 text-[#EF4444]" />
          )}
          <span className={`font-black text-lg ${feedback.isCorrect ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
            {feedback.isCorrect ? "Correct!" : "Incorrect"}
          </span>
        </div>
        <p className="text-slate-600 text-sm font-medium leading-relaxed mb-3">{feedback.explanation}</p>
        {feedback.commonMistakes && feedback.commonMistakes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Common Mistakes</span>
            {feedback.commonMistakes.map((m, i) => (
              <p key={i} className="text-xs text-slate-500 mt-1"><strong>{m.label}:</strong> {m.explanation}</p>
            ))}
          </div>
        )}
      </motion.div>

      {/* Next button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onNext}
          className="px-8 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all flex items-center gap-2"
        >
          {feedback.nextQuestion ? "Next Question" : "See Results"} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
