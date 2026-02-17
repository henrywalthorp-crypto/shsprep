"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save, Trash2, FileText } from "lucide-react";
import type { Passage, PassageType, Question } from "@/lib/types";

interface FormValues {
  title: string;
  text: string;
  type: PassageType;
}

export default function PassageEditor({
  passage,
  linkedQuestions,
  onSave,
  onDelete,
}: {
  passage?: Passage;
  linkedQuestions?: Question[];
  onSave: (data: Partial<Passage>) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      title: passage?.title ?? "",
      text: passage?.text ?? "",
      type: passage?.type ?? "fiction",
    },
  });

  const textValue = watch("text");
  const wordCount = textValue.trim() ? textValue.trim().split(/\s+/).length : 0;

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      await onSave({ ...data, word_count: wordCount });
      toast.success("Passage saved");
    } catch {
      toast.error("Failed to save passage");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    try {
      await onDelete?.();
      toast.success("Passage deleted");
    } catch {
      toast.error("Failed to delete");
    }
    setConfirmDelete(false);
  };

  const input = "w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-deep-forest focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30";
  const label = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={label}>Title</label>
        <input {...register("title")} className={input} />
      </div>

      <div>
        <label className={label}>Text</label>
        <textarea {...register("text")} rows={8} className={input} />
        <p className="text-xs text-slate-400 mt-1">{wordCount} words</p>
      </div>

      <div>
        <label className={label}>Type</label>
        <select {...register("type")} className={input}>
          <option value="fiction">Fiction</option>
          <option value="nonfiction">Nonfiction</option>
          <option value="poetry">Poetry</option>
          <option value="historical">Historical</option>
        </select>
      </div>

      {linkedQuestions && linkedQuestions.length > 0 && (
        <div>
          <label className={label}>Linked Questions ({linkedQuestions.length})</label>
          <div className="space-y-1">
            {linkedQuestions.map((q) => (
              <div key={q.id} className="flex items-center gap-2 text-sm bg-slate-50 rounded-lg p-2">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600 truncate">{q.stem}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-sm font-bold hover:bg-[#4338CA] transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
              confirmDelete ? "bg-red-500 text-white" : "text-red-500 hover:bg-red-50"
            }`}
          >
            <Trash2 className="w-4 h-4" /> {confirmDelete ? "Confirm" : "Delete"}
          </button>
        )}
      </div>
    </form>
  );
}
