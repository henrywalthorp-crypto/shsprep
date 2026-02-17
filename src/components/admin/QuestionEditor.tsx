"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import {
  Save,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react";
import type { Question, ReviewStatus, SectionType, DifficultyLevel, QuestionType } from "@/lib/types";
import QuestionPreview from "./QuestionPreview";

interface FormValues {
  stem: string;
  section: SectionType;
  category: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  correct_answer: string;
  explanation: string;
  options: { label: string; text: string; isCorrect: boolean }[];
  common_mistakes: { label: string; explanation: string }[];
}

const statusFlow: ReviewStatus[] = ["draft", "reviewed", "approved", "published"];

export default function QuestionEditor({
  question,
  onSave,
  onDelete,
  onStatusChange,
}: {
  question: Question;
  onSave: (data: Partial<Question>) => Promise<void>;
  onDelete: () => Promise<void>;
  onStatusChange: (status: ReviewStatus) => Promise<void>;
}) {
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      stem: question.stem,
      section: question.section,
      category: question.category,
      difficulty: question.difficulty,
      type: question.type,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      options: question.options ?? [],
      common_mistakes: question.common_mistakes ?? [],
    },
  });

  const { fields: optFields, append: addOpt, remove: removeOpt, move: moveOpt } = useFieldArray({ control, name: "options" });
  const { fields: cmFields, append: addCm, remove: removeCm } = useFieldArray({ control, name: "common_mistakes" });

  const currentValues = watch();
  const previewQuestion: Question = { ...question, ...currentValues, options: currentValues.options };

  const currentIdx = statusFlow.indexOf(question.review_status);
  const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      await onSave(data);
      toast.success("Question saved");
    } catch {
      toast.error("Failed to save question");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      await onDelete();
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const input = "w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-deep-forest focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30";
  const label = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";

  if (preview) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setPreview(false)} className="flex items-center gap-2 text-sm font-bold text-[#4F46E5] hover:underline">
            <EyeOff className="w-4 h-4" /> Back to Editor
          </button>
        </div>
        <QuestionPreview question={previewQuestion} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Editor</h3>
        <button type="button" onClick={() => setPreview(true)} className="flex items-center gap-2 text-sm font-bold text-[#4F46E5] hover:underline">
          <Eye className="w-4 h-4" /> Preview
        </button>
      </div>

      <div>
        <label className={label}>Question Stem</label>
        <textarea {...register("stem")} rows={3} className={input} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Section</label>
          <select {...register("section")} className={input}>
            <option value="math">Math</option>
            <option value="ela">ELA</option>
          </select>
        </div>
        <div>
          <label className={label}>Category</label>
          <input {...register("category")} className={input} />
        </div>
        <div>
          <label className={label}>Difficulty</label>
          <select {...register("difficulty")} className={input}>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
        </div>
        <div>
          <label className={label}>Type</label>
          <select {...register("type")} className={input}>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="grid_in">Grid In</option>
            <option value="multi_select">Multi Select</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Correct Answer</label>
        <input {...register("correct_answer")} className={input} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={label}>Options</label>
          <button type="button" onClick={() => addOpt({ label: String.fromCharCode(65 + optFields.length), text: "", isCorrect: false })} className="flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:underline">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {optFields.map((f, i) => (
            <div key={f.id} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-slate-300" />
              <input {...register(`options.${i}.label`)} className={`${input} w-14 text-center`} />
              <input {...register(`options.${i}.text`)} className={`${input} flex-1`} placeholder="Option text..." />
              <label className="flex items-center gap-1 text-xs font-bold text-slate-400">
                <input type="checkbox" {...register(`options.${i}.isCorrect`)} className="rounded border-slate-300" />
                ✓
              </label>
              {i > 0 && <button type="button" onClick={() => moveOpt(i, i - 1)} className="text-slate-400 hover:text-slate-600"><ArrowUp className="w-3.5 h-3.5" /></button>}
              {i < optFields.length - 1 && <button type="button" onClick={() => moveOpt(i, i + 1)} className="text-slate-400 hover:text-slate-600"><ArrowDown className="w-3.5 h-3.5" /></button>}
              <button type="button" onClick={() => removeOpt(i)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={label}>Explanation</label>
        <textarea {...register("explanation")} rows={3} className={input} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={label}>Common Mistakes</label>
          <button type="button" onClick={() => addCm({ label: "", explanation: "" })} className="flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:underline">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {cmFields.map((f, i) => (
            <div key={f.id} className="flex items-center gap-2">
              <input {...register(`common_mistakes.${i}.label`)} className={`${input} w-14 text-center`} placeholder="Opt" />
              <input {...register(`common_mistakes.${i}.explanation`)} className={`${input} flex-1`} placeholder="Why this is wrong..." />
              <button type="button" onClick={() => removeCm(i)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-sm font-bold hover:bg-[#4338CA] transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
          </button>
          {nextStatus && (
            <button
              type="button"
              onClick={() => onStatusChange(nextStatus)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors"
            >
              Move to {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            confirmDelete ? "bg-red-500 text-white hover:bg-red-600" : "text-red-500 hover:bg-red-50"
          }`}
        >
          <Trash2 className="w-4 h-4" /> {confirmDelete ? "Confirm Delete" : "Delete"}
        </button>
      </div>
    </form>
  );
}
