"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, ExternalLink, Loader2, Crown } from "lucide-react";
import { PricingCards } from "./PricingCards";
import { toast } from "sonner";

interface StripeStatus {
  subscription_status: "inactive" | "active" | "canceled" | "past_due" | null;
  subscription_plan: "monthly" | "annual" | null;
  subscription_ends_at: string | null;
  payments: { id: string; amount: number; currency: string; status: string; created_at: string }[];
}

export function BillingSection() {
  const [data, setData] = useState<StripeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<"monthly" | "annual" | null>(null);

  useEffect(() => {
    fetch("/api/stripe/status")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else toast.error("Could not open billing portal");
    } catch {
      toast.error("Network error");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async (plan: "monthly" | "annual") => {
    setCheckoutLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else toast.error(d.error || "Could not start checkout");
    } catch {
      toast.error("Network error");
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[24px] border border-slate-100 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isPremium = data.subscription_status === "active";
  const planLabel = data.subscription_plan === "annual" ? "Annual" : data.subscription_plan === "monthly" ? "Monthly" : "None";

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-5 h-5 text-[#4F46E5]" />
        <h2 className="font-black text-deep-forest text-lg">Billing & Subscription</h2>
      </div>

      {/* Current Plan */}
      <div className="bg-slate-50 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
            <div className="flex items-center gap-2">
              {isPremium && <Crown className="w-4 h-4 text-[#22C55E]" />}
              <span className="text-lg font-black text-deep-forest">
                {isPremium ? `Premium (${planLabel})` : "No Active Plan"}
              </span>
            </div>
            {isPremium && data.subscription_ends_at && (
              <p className="text-xs text-slate-400 mt-1">
                Next billing: {new Date(data.subscription_ends_at).toLocaleDateString()}
              </p>
            )}
            {data.subscription_status === "past_due" && (
              <p className="text-xs text-[#EF4444] font-bold mt-1">Payment past due — please update your billing info</p>
            )}
          </div>
          {isPremium && (
            <button
              onClick={openPortal}
              disabled={portalLoading}
              className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-300 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
              Manage Billing
            </button>
          )}
        </div>
      </div>

      {/* Upgrade or Payment History */}
      {!isPremium ? (
        <div>
          <p className="text-sm text-slate-400 font-medium mb-4">Upgrade to unlock unlimited practice and all features.</p>
          <PricingCards onSelect={handleUpgrade} loading={checkoutLoading} />
        </div>
      ) : (
        data.payments && data.payments.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment History</p>
            <div className="space-y-2">
              {data.payments.slice(0, 10).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-deep-forest">
                      ${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
                    </p>
                    <p className="text-[10px] text-slate-400">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    p.status === "succeeded" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-slate-100 text-slate-400"
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
