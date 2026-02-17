"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import QuestionEditor from "@/components/admin/QuestionEditor";
import QuestionPreview from "@/components/admin/QuestionPreview";
import type { Question, Passage, ReviewStatus } from "@/lib/types";

export default function QuestionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.questionId as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [passage, setPassage] = useState<Passage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/questions/${questionId}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setQuestion(data.question ?? data);
        if (data.passage) setPassage(data.passage);
      })
      .catch(() => toast.error("Failed to load question"))
      .finally(() => setLoading(false));
  }, [questionId]);

  const handleSave = async (data: Partial<Question>) => {
    const res = await fetch(`/api/admin/questions/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    const updated = await res.json();
    setQuestion(updated.question ?? { ...question, ...data });
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/admin/questions/${questionId}`, { method: "DELETE" });
    if (!res.ok) throw new Error();
    router.push("/dashboard/admin/questions");
  };

  const handleStatusChange = async (status: ReviewStatus) => {
    const res = await fetch(`/api/admin/questions/${questionId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error();
    setQuestion((q) => (q ? { ...q, review_status: status } : q));
    toast.success(`Status changed to ${status}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl">
        <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-2 gap-8">
          <div className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-6xl text-center py-20">
        <p className="text-slate-400 font-bold">Question not found.</p>
        <button onClick={() => router.push("/dashboard/admin/questions")} className="mt-4 text-sm font-bold text-[#4F46E5] hover:underline">
          Back to Questions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <button
        onClick={() => router.push("/dashboard/admin/questions")}
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-deep-forest transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Questions
      </button>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <QuestionEditor
            question={question}
            onSave={handleSave}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </div>
        <QuestionPreview question={question} passage={passage} />
      </div>
    </div>
  );
}
