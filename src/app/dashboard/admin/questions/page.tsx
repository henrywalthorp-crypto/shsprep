"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { FileQuestion } from "lucide-react";
import QuestionFilters, { type FilterValues } from "@/components/admin/QuestionFilters";
import QuestionTable from "@/components/admin/QuestionTable";
import { toast } from "sonner";
import type { Question } from "@/lib/types";

const PAGE_SIZE = 20;

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    section: searchParams.get("section") ?? "",
    category: searchParams.get("category") ?? "",
    difficulty: searchParams.get("difficulty") ?? "",
    status: searchParams.get("status") ?? "",
    search: searchParams.get("search") ?? "",
  });

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    if (filters.section) params.set("section", filters.section);
    if (filters.category) params.set("category", filters.category);
    if (filters.difficulty) params.set("difficulty", filters.difficulty);
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);

    try {
      const res = await fetch(`/api/admin/questions?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuestions(data.questions ?? []);
      setTotal(data.total ?? 0);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleFilters = useCallback((f: FilterValues) => {
    setFilters(f);
    setPage(1);
  }, []);

  const handleBulkPublish = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/admin/questions/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "published" }),
          })
        )
      );
      toast.success(`Published ${ids.length} questions`);
      fetchQuestions();
    } catch {
      toast.error("Failed to publish");
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!confirm(`Delete ${ids.length} questions? This cannot be undone.`)) return;
    try {
      await Promise.all(
        ids.map((id) => fetch(`/api/admin/questions/${id}`, { method: "DELETE" }))
      );
      toast.success(`Deleted ${ids.length} questions`);
      fetchQuestions();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <FileQuestion className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">Questions</h1>
        </div>
        <p className="text-slate-400 font-medium">Browse, filter, and manage all questions.</p>
      </header>

      <div className="space-y-6">
        <QuestionFilters onChange={handleFilters} />
        <QuestionTable
          questions={questions}
          loading={loading}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          onBulkPublish={handleBulkPublish}
          onBulkDelete={handleBulkDelete}
        />
      </div>
    </div>
  );
}
