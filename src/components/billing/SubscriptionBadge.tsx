"use client";

import React from "react";
import { Crown } from "lucide-react";

type SubscriptionStatus = "inactive" | "active" | "past_due" | "canceled";

interface SubscriptionBadgeProps {
  status: SubscriptionStatus;
}

const CONFIG: Record<SubscriptionStatus, { label: string; bg: string; text: string; icon: boolean }> = {
  inactive: { label: "Inactive", bg: "bg-slate-100", text: "text-slate-500", icon: false },
  active: { label: "Premium", bg: "bg-[#22C55E]/10", text: "text-[#22C55E]", icon: true },
  past_due: { label: "Past Due", bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", icon: false },
  canceled: { label: "Canceled", bg: "bg-slate-100", text: "text-slate-500", icon: false },
};

export function SubscriptionBadge({ status }: SubscriptionBadgeProps) {
  const c = CONFIG[status] || CONFIG.inactive;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${c.bg} ${c.text}`}>
      {c.icon && <Crown className="w-3 h-3" />}
      {c.label}
    </span>
  );
}
