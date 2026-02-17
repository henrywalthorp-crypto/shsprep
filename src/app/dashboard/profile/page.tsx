"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/provider";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Settings,
  Calendar,
  Edit3,
  Key,
  Trash2,
  Check,
  Crown,
  Loader2,
} from "lucide-react";
import type { Profile } from "@/lib/types";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  grade: z.enum(["6", "7", "8", "9"]).optional(),
  target_school: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"profile" | "security">("profile");
  const [saving, setSaving] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setProfile(d.profile);
          profileForm.reset({
            first_name: d.profile.first_name || "",
            last_name: d.profile.last_name || "",
            grade: d.profile.grade || undefined,
            target_school: d.profile.target_school || "",
          });
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const onSaveProfile = async (data: ProfileForm) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to update");
        return;
      }
      const d = await res.json();
      setProfile(d.profile);
      toast.success("Profile updated!");
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to update password");
        return;
      }
      toast.success("Password updated!");
      passwordForm.reset();
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const SettingsNavItem = ({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) => (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
        active ? "bg-[#4F46E5] text-white" : "bg-white border border-slate-100 text-slate-600 hover:border-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400"}`} />
        <span className="font-bold text-sm">{label}</span>
      </div>
      <ChevronRight className={`w-4 h-4 ${active ? "text-white/60" : "text-slate-300"}`} />
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded w-48" />
          <div className="h-64 bg-slate-200 rounded-[24px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">Account Settings</h1>
        </div>
        <p className="text-slate-400 font-medium">Manage your profile and preferences.</p>
      </header>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 space-y-3">
          <SettingsNavItem icon={User} label="Profile" active={activeSection === "profile"} onClick={() => setActiveSection("profile")} />
          <SettingsNavItem icon={Shield} label="Security" active={activeSection === "security"} onClick={() => setActiveSection("security")} />
          <div className="pt-6">
            <button
              onClick={async () => { await signOut(); router.replace("/sign-in"); }}
              className="flex items-center gap-3 p-4 w-full rounded-xl text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm">Sign Out</span>
            </button>
          </div>
        </div>

        <div className="col-span-3">
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="bg-white rounded-[24px] border border-slate-100 p-6">
                <h2 className="font-black text-deep-forest text-lg mb-6">Personal Information</h2>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-[#D6FF62] rounded-2xl flex items-center justify-center text-deep-forest font-black text-3xl">
                    {profile?.first_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-600">{profile?.email}</p>
                    <p className="text-xs text-slate-400">Member since {profile ? new Date(profile.created_at).toLocaleDateString() : ""}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">First Name</label>
                    <input
                      {...profileForm.register("first_name")}
                      className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                    />
                    {profileForm.formState.errors.first_name && (
                      <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.first_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Last Name</label>
                    <input
                      {...profileForm.register("last_name")}
                      className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                    />
                    {profileForm.formState.errors.last_name && (
                      <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.last_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Grade Level</label>
                    <select
                      {...profileForm.register("grade")}
                      className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                    >
                      <option value="">Select grade</option>
                      <option value="6">6th Grade</option>
                      <option value="7">7th Grade</option>
                      <option value="8">8th Grade</option>
                      <option value="9">9th Grade</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target School</label>
                    <input
                      {...profileForm.register("target_school")}
                      placeholder="e.g., Stuyvesant"
                      className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeSection === "security" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="bg-white rounded-[24px] border border-slate-100 p-6">
                <h2 className="font-black text-deep-forest text-lg mb-6">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Password</label>
                    <input
                      type="password"
                      {...passwordForm.register("currentPassword")}
                      placeholder="Enter current password"
                      className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New Password</label>
                    <input
                      type="password"
                      {...passwordForm.register("newPassword")}
                      placeholder="Enter new password"
                      className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Confirm New Password</label>
                    <input
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                      placeholder="Confirm new password"
                      className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
