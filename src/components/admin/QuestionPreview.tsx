"use client";

import type { Question, Passage } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function QuestionPreview({
  question,
  passage,
}: {
  question: Question;
  passage?: Passage | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Preview
        </h3>
        <StatusBadge status={question.review_status} />
      </div>

      {passage && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <h4 className="font-bold text-deep-forest text-sm mb-2">{passage.title}</h4>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {passage.text}
          </p>
        </div>
      )}

      <div>
        <p className="text-deep-forest font-bold leading-relaxed">{question.stem}</p>
      </div>

      {question.options && question.options.length > 0 && (
        <div className="space-y-3">
          {question.options.map((opt) => (
            <div
              key={opt.label}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors ${
                opt.isCorrect
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-100 bg-white"
              }`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                  opt.isCorrect
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {opt.label}
              </span>
              <span className="text-sm text-deep-forest font-medium pt-1">
                {opt.text}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">
          Explanation
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed">
          {question.explanation}
        </p>
      </div>

      {question.common_mistakes && question.common_mistakes.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
          <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3">
            Common Mistakes
          </h4>
          <div className="space-y-2">
            {question.common_mistakes.map((m) => (
              <div key={m.label} className="flex gap-2 text-sm">
                <span className="font-bold text-amber-700 flex-shrink-0">
                  {m.label}:
                </span>
                <span className="text-slate-600">{m.explanation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
