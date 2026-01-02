"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  BarChart2,
  Layout,
  Users,
  Settings,
  PenTool,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  Check,
  Crown,
  Calendar,
  Edit3,
  Key,
  Trash2,
  Info
} from "lucide-react";

const ProfilePage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("Fardin");
  const [activeSection, setActiveSection] = useState<"profile" | "billing" | "notifications" | "security">("profile");

  useEffect(() => {
    const savedName = localStorage.getItem("shs_student_name");
    if (savedName) setUserName(savedName);
  }, []);

  const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active ? "bg-[#1E293B] text-white" : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </div>
  );

  const SettingsNavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
        active 
          ? "bg-[#4F46E5] text-white" 
          : "bg-white border border-slate-100 text-slate-600 hover:border-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400"}`} />
        <span className="font-bold text-sm">{label}</span>
      </div>
      <ChevronRight className={`w-4 h-4 ${active ? "text-white/60" : "text-slate-300"}`} />
    </div>
  );

  return (
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
          <SidebarItem icon={PenTool} label="Practice" onClick={() => router.push("/dashboard/practice")} />
          <SidebarItem icon={BookOpen} label="Mock Exams" onClick={() => router.push("/dashboard/mock-exams")} />
          <SidebarItem icon={Layout} label="Study Plan" onClick={() => router.push("/dashboard")} />
          <SidebarItem icon={BarChart2} label="Performance" onClick={() => router.push("/dashboard/performance")} />
          
          <div className="pt-8 pb-4">
            <span className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Additional Tools</span>
          </div>
          
          <SidebarItem icon={Users} label="Partner Directory" onClick={() => router.push("/dashboard/partners")} />
          <SidebarItem icon={Info} label="Exam Info" onClick={() => router.push("/dashboard/exam-info")} />
          <SidebarItem icon={FileText} label="Resources" onClick={() => router.push("/dashboard/resources")} />
        </nav>

        <div 
          className="pt-6 border-t border-slate-800 flex items-center justify-between mt-auto cursor-pointer bg-[#1E293B] -mx-2 px-2 py-3 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-mint rounded-lg flex items-center justify-center text-deep-forest font-bold text-sm">
              {userName[0]}
            </div>
            <span className="text-sm font-bold text-white">{userName}</span>
          </div>
          <Settings className="w-4 h-4 text-white" />
        </div>
      </aside>

      <main className="flex-1 ml-64 p-12">
        <div className="max-w-4xl">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-deep-forest font-display">Account Settings</h1>
            </div>
            <p className="text-slate-400 font-medium">Manage your profile, billing, and preferences.</p>
          </header>

          <div className="grid grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="col-span-1 space-y-3">
              <SettingsNavItem 
                icon={User} 
                label="Profile" 
                active={activeSection === "profile"}
                onClick={() => setActiveSection("profile")}
              />
              <SettingsNavItem 
                icon={CreditCard} 
                label="Billing" 
                active={activeSection === "billing"}
                onClick={() => setActiveSection("billing")}
              />
              <SettingsNavItem 
                icon={Bell} 
                label="Notifications" 
                active={activeSection === "notifications"}
                onClick={() => setActiveSection("notifications")}
              />
              <SettingsNavItem 
                icon={Shield} 
                label="Security" 
                active={activeSection === "security"}
                onClick={() => setActiveSection("security")}
              />
              
              <div className="pt-6">
                <button className="flex items-center gap-3 p-4 w-full rounded-xl text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Settings Content */}
            <div className="col-span-3">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[24px] border border-slate-100 p-6">
                    <h2 className="font-black text-deep-forest text-lg mb-6">Personal Information</h2>
                    
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-24 h-24 bg-[#D6FF62] rounded-2xl flex items-center justify-center text-deep-forest font-black text-3xl">
                        {userName[0]}
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg font-bold text-sm mb-2">
                          Change Photo
                        </button>
                        <p className="text-xs text-slate-400">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">First Name</label>
                        <input 
                          type="text" 
                          defaultValue={userName}
                          className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Last Name</label>
                        <input 
                          type="text" 
                          defaultValue="Ahmed"
                          className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                        <input 
                          type="email" 
                          defaultValue="fardin.ahmed@email.com"
                          className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone</label>
                        <input 
                          type="tel" 
                          defaultValue="(718) 555-0123"
                          className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Grade Level</label>
                        <select className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold">
                          <option>7th Grade</option>
                          <option>8th Grade</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                      <button className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[24px] border border-slate-100 p-6">
                    <h2 className="font-black text-deep-forest text-lg mb-6">Parent/Guardian Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Parent Name</label>
                        <input 
                          type="text" 
                          defaultValue="Sarah Ahmed"
                          className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Parent Email</label>
                        <input 
                          type="email" 
                          defaultValue="sarah.ahmed@email.com"
                          className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Billing Section */}
              {activeSection === "billing" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Current Plan */}
                  <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-[24px] p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-[#D6FF62]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Current Plan</span>
                      </div>
                      <h2 className="text-2xl font-black mb-1">Premium Plan</h2>
                      <p className="text-white/60 text-sm mb-4">Full access to all features, mock exams, and video lessons.</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-4xl font-black">$29</span>
                          <span className="text-white/60">/month</span>
                        </div>
                        <button className="px-4 py-2 bg-white/10 rounded-lg font-bold text-sm hover:bg-white/20 transition-colors">
                          Change Plan
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-[24px] border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-black text-deep-forest text-lg">Payment Method</h2>
                      <button className="text-[#4F46E5] font-bold text-sm flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-12 h-8 bg-[#1A1F71] rounded flex items-center justify-center">
                        <span className="text-white text-[10px] font-black">VISA</span>
                      </div>
                      <div>
                        <div className="font-bold text-deep-forest">Visa ending in 4242</div>
                        <div className="text-xs text-slate-400">Expires 12/2026</div>
                      </div>
                      <div className="ml-auto flex items-center gap-2 text-[#22C55E]">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-bold">Default</span>
                      </div>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div className="bg-white rounded-[24px] border border-slate-100 p-6">
                    <h2 className="font-black text-deep-forest text-lg mb-6">Billing History</h2>
                    <div className="space-y-3">
                      {[
                        { date: "Nov 1, 2024", amount: "$29.00", status: "Paid" },
                        { date: "Oct 1, 2024", amount: "$29.00", status: "Paid" },
                        { date: "Sep 1, 2024", amount: "$29.00", status: "Paid" },
                      ].map((invoice, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <div className="font-bold text-deep-forest">{invoice.date}</div>
                              <div className="text-xs text-slate-400">Premium Plan - Monthly</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-black text-deep-forest">{invoice.amount}</span>
                            <span className="text-[10px] font-black bg-[#22C55E]/10 text-[#22C55E] px-2 py-1 rounded">
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[24px] border border-slate-100 p-6"
                >
                  <h2 className="font-black text-deep-forest text-lg mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Study Reminders", description: "Get reminded to practice daily", enabled: true },
                      { label: "Progress Reports", description: "Weekly email with your performance stats", enabled: true },
                      { label: "New Content Alerts", description: "When new practice questions are added", enabled: false },
                      { label: "Mock Exam Reminders", description: "Reminder before scheduled mock exams", enabled: true },
                      { label: "Marketing Emails", description: "Tips, offers, and news from SHSprep", enabled: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                          <div className="font-bold text-deep-forest">{item.label}</div>
                          <div className="text-xs text-slate-400">{item.description}</div>
                        </div>
                        <button 
                          className={`w-12 h-7 rounded-full transition-colors relative ${
                            item.enabled ? "bg-[#4F46E5]" : "bg-slate-200"
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow ${
                            item.enabled ? "translate-x-6" : "translate-x-1"
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Security Section */}
              {activeSection === "security" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[24px] border border-slate-100 p-6">
                    <h2 className="font-black text-deep-forest text-lg mb-6">Change Password</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter current password"
                          className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter new password"
                          className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Confirm New Password</label>
                        <input 
                          type="password" 
                          placeholder="Confirm new password"
                          className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-[#4F46E5] text-deep-forest font-bold"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                      <button className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[24px] border border-[#EF4444]/20 p-6">
                    <h2 className="font-black text-[#EF4444] text-lg mb-2">Danger Zone</h2>
                    <p className="text-sm text-slate-500 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="flex items-center gap-2 px-4 py-3 border border-[#EF4444] text-[#EF4444] rounded-xl font-bold text-sm hover:bg-[#EF4444]/5 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
