"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import PassageEditor from "@/components/admin/PassageEditor";
import StatusBadge from "@/components/admin/StatusBadge";
import type { Passage, Question } from "@/lib/types";

interface PassageRow extends Passage {
  question_count?: number;
  questions?: Question[];
}

export default function PassagesPage() {
  const [passages, setPassages] = useState<PassageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const fetchPassages = () => {
    setLoading(true);
    fetch("/api/admin/passages")
      .then((r) => r.ok ? r.json() : { passages: [] })
      .then((d) => setPassages(d.passages ?? []))
      .catch(() => toast.error("Failed to load passages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPassages(); }, []);

  const handleSave = async (id: string | null, data: Partial<Passage>) => {
    if (id) {
      const res = await fetch(`/api/admin/passages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
    } else {
      const res = await fetch("/api/admin/passages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setAdding(false);
    }
    fetchPassages();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/passages/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    fetchPassages();
  };

  const typeColor: Record<string, string> = {
    fiction: "bg-purple-100 text-purple-700",
    nonfiction: "bg-blue-100 text-blue-700",
    poetry: "bg-pink-100 text-pink-700",
    historical: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-deep-forest font-display">Passages</h1>
            </div>
            <p className="text-slate-400 font-medium">Manage reading passages and linked questions.</p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-sm font-bold hover:bg-[#4338CA] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Passage
          </button>
        </div>
      </header>

      {adding && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-deep-forest mb-4">New Passage</h3>
          <PassageEditor
            onSave={(data) => handleSave(null, data)}
          />
          <button onClick={() => setAdding(false)} className="mt-3 text-sm font-bold text-slate-400 hover:underline">Cancel</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : passages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-slate-400 font-bold">No passages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {passages.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-deep-forest">{p.title}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${typeColor[p.type] ?? "bg-slate-100 text-slate-600"}`}>
                    {p.type}
                  </span>
                  <span className="text-xs text-slate-400">{p.word_count} words</span>
                  {p.question_count != null && (
                    <span className="text-xs text-slate-400">{p.question_count} questions</span>
                  )}
                  <StatusBadge status={p.review_status} />
                </div>
                {expandedId === p.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>

              {expandedId === p.id && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                  <PassageEditor
                    passage={p}
                    linkedQuestions={p.questions}
                    onSave={(data) => handleSave(p.id, data)}
                    onDelete={() => handleDelete(p.id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
