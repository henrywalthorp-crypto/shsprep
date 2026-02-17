"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/provider";
import { RoleProvider } from "@/lib/context/role-context";
import type { UserRole } from "@/lib/types";
import {
  PenTool,
  BookOpen,
  Layout,
  BarChart2,
  Users,
  Settings,
  FileText,
  Info,
  LogOut,
} from "lucide-react";

const studentNavItems = [
  { icon: PenTool, label: "Practice", href: "/dashboard/practice" },
  { icon: BookOpen, label: "Mock Exams", href: "/dashboard/mock-exams" },
  { icon: Layout, label: "Study Plan", href: "/dashboard" },
  { icon: BarChart2, label: "Performance", href: "/dashboard/performance" },
];

const parentNavItems = [
  { icon: Users, label: "My Children", href: "/dashboard" },
];

const studentAdditionalItems = [
  { icon: Users, label: "Partner Directory", href: "/dashboard/partners" },
  { icon: Info, label: "Exam Info", href: "/dashboard/exam-info" },
  { icon: FileText, label: "Resources", href: "/dashboard/resources" },
];

const parentAdditionalItems = [
  { icon: Info, label: "Exam Info", href: "/dashboard/exam-info" },
  { icon: FileText, label: "Resources", href: "/dashboard/resources" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ first_name: string; last_name: string; avatar_url: string | null; role: UserRole } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/profile")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => {
          if (d?.profile) {
            setProfile(d.profile);
            setRole(d.profile.role || "student");
          }
        })
        .catch(() => {});
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4F46E5] border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.first_name || user.email?.split("@")[0] || "User";
  const initial = displayName[0]?.toUpperCase() || "U";

  const isParent = role === "parent";
  const navItems = isParent ? parentNavItems : studentNavItems;
  const additionalItems = isParent ? parentAdditionalItems : studentAdditionalItems;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const SidebarItem = ({ icon: Icon, label, href, active }: { icon: any; label: string; href: string; active: boolean }) => (
    <div
      onClick={() => router.push(href)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active ? "bg-[#1E293B] text-white" : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </div>
  );

  return (
    <RoleProvider role={role}>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <aside className="w-64 bg-[#0F172A] flex flex-col p-6 fixed inset-y-0 z-50">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-8 w-8 bg-mint rounded-lg flex items-center justify-center text-deep-forest font-bold text-lg shadow-lg shadow-mint/20">
              S
            </div>
            <span className="text-xl font-bold text-white tracking-tight font-display">
              SHS<span className="text-white/40">prep</span>
            </span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <SidebarItem key={item.href} icon={item.icon} label={item.label} href={item.href} active={isActive(item.href)} />
            ))}

            <div className="pt-8 pb-4">
              <span className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {isParent ? "Resources" : "Additional Tools"}
              </span>
            </div>

            {additionalItems.map((item) => (
              <SidebarItem key={item.href} icon={item.icon} label={item.label} href={item.href} active={isActive(item.href)} />
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-800 mt-auto space-y-2">
            <div
              onClick={() => router.push("/dashboard/profile")}
              className={`flex items-center justify-between cursor-pointer -mx-2 px-2 py-3 rounded-xl transition-all ${
                pathname === "/dashboard/profile" ? "bg-[#1E293B]" : "hover:bg-[#1E293B]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-mint rounded-lg flex items-center justify-center text-deep-forest font-bold text-sm">
                  {initial}
                </div>
                <span className="text-sm font-bold text-slate-300">{displayName}</span>
              </div>
              <Settings className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
            </div>
            <button
              onClick={async () => { await signOut(); router.replace("/sign-in"); }}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-xl text-slate-400 hover:text-[#EF4444] hover:bg-[#1E293B] transition-all text-sm font-bold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-12">{children}</main>
      </div>
    </RoleProvider>
  );
}
