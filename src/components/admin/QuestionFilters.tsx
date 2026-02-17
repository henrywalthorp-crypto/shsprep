"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

export interface FilterValues {
  section: string;
  category: string;
  difficulty: string;
  status: string;
  search: string;
}

const defaultFilters: FilterValues = {
  section: "",
  category: "",
  difficulty: "",
  status: "",
  search: "",
};

export default function QuestionFilters({
  onChange,
}: {
  onChange: (filters: FilterValues) => void;
}) {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  const update = useCallback(
    (key: keyof FilterValues, value: string) => {
      const next = { ...filters, [key]: value };
      setFilters(next);
      onChange(next);
    },
    [filters, onChange]
  );

  const clear = useCallback(() => {
    setFilters(defaultFilters);
    onChange(defaultFilters);
  }, [onChange]);

  const sel =
    "px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-deep-forest focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30";

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
      <select
        className={sel}
        value={filters.section}
        onChange={(e) => update("section", e.target.value)}
      >
        <option value="">All Sections</option>
        <option value="math">Math</option>
        <option value="ela">ELA</option>
      </select>

      <input
        className={`${sel} w-40`}
        placeholder="Category..."
        value={filters.category}
        onChange={(e) => update("category", e.target.value)}
      />

      <select
        className={sel}
        value={filters.difficulty}
        onChange={(e) => update("difficulty", e.target.value)}
      >
        <option value="">All Difficulty</option>
        <option value="1">Easy</option>
        <option value="2">Medium</option>
        <option value="3">Hard</option>
      </select>

      <select
        className={sel}
        value={filters.status}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="reviewed">Reviewed</option>
        <option value="approved">Approved</option>
        <option value="published">Published</option>
      </select>

      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className={`${sel} w-full pl-9`}
          placeholder="Search question stem..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>

      {hasFilters && (
        <button
          onClick={clear}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      )}
    </div>
  );
}
