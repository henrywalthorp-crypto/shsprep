"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function LinkChildModal({ open, onOpenChange, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkedName, setLinkedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/parent/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_code: code.toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid invite code");
        return;
      }
      setLinkedName(data.student_name);
      toast.success(`Linked to ${data.student_name}!`);
      onSuccess();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setLinkedName(null);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-black text-deep-forest">Link a Child</DialogTitle>
          <DialogDescription>
            Enter the 6-character invite code from your child&apos;s SHS Prep profile.
          </DialogDescription>
        </DialogHeader>

        {linkedName ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
            </div>
            <p className="font-black text-deep-forest text-lg">Successfully linked!</p>
            <p className="text-slate-400 text-sm">You can now track <span className="font-bold text-deep-forest">{linkedName}</span>&apos;s progress.</p>
          </div>
        ) : (
          <div className="py-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
              Invite Code
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
              placeholder="ABC123"
              className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-black text-2xl tracking-[0.3em] text-center uppercase"
              maxLength={6}
            />
            {error && (
              <div className="flex items-center gap-2 mt-3 text-sm text-[#EF4444]">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {linkedName ? (
            <button onClick={handleClose} className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-black text-sm w-full">
              Done
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={code.length !== 6 || loading}
              className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-black text-sm w-full shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Link Child
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
