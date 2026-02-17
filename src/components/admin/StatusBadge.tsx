"use client";

import type { ReviewStatus } from "@/lib/types";

const statusConfig: Record<ReviewStatus, { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-slate-100", text: "text-slate-600", label: "Draft" },
  reviewed: { bg: "bg-amber-100", text: "text-amber-700", label: "Reviewed" },
  approved: { bg: "bg-blue-100", text: "text-blue-700", label: "Approved" },
  published: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Published" },
};

export default function StatusBadge({ status }: { status: ReviewStatus }) {
  const c = statusConfig[status] ?? statusConfig.draft;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
