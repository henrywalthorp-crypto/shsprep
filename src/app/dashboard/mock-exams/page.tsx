"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Lock,
  Play,
  BarChart2,
  Layout,
  Users,
  Settings,
  PenTool,
  Trophy,
  Target,
  TrendingUp,
  FileText,
  Zap,
  Info
} from "lucide-react";

const mockExamsData = [
  { id: 1, title: "Practice Exam 1", status: "completed", score: 534, maxScore: 800, date: "Oct 15, 2024", duration: "2h 45m" },
  { id: 2, title: "Practice Exam 2", status: "completed", score: 567, maxScore: 800, date: "Oct 22, 2024", duration: "2h 38m" },
  { id: 3, title: "Practice Exam 3", status: "completed", score: 589, maxScore: 800, date: "Oct 29, 2024", duration: "2h 52m" },
  { id: 4, title: "Practice Exam 4", status: "in_progress", score: null, maxScore: 800, date: null, duration: null, progress: 45 },
  { id: 5, title: "Practice Exam 5", status: "available", score: null, maxScore: 800, date: null, duration: null },
  { id: 6, title: "Practice Exam 6", status: "available", score: null, maxScore: 800, date: null, duration: null },
  { id: 7, title: "Practice Exam 7", status: "locked", score: null, maxScore: 800, date: null, duration: null },
  { id: 8, title: "Practice Exam 8", status: "locked", score: null, maxScore: 800, date: null, duration: null },
  { id: 9, title: "Practice Exam 9", status: "locked", score: null, maxScore: 800, date: null, duration: null },
  { id: 10, title: "Practice Exam 10", status: "locked", score: null, maxScore: 800, date: null, duration: null },
  { id: 11, title: "Practice Exam 11", status: "locked", score: null, maxScore: 800, date: null, duration: null },
  { id: 12, title: "Practice Exam 12", status: "locked", score: null, maxScore: 800, date: null, duration: null },
];

const MockExamsPage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("Fardin");
  const [filter, setFilter] = useState<"all" | "completed" | "available">("all");

  useEffect(() => {
    const savedName = localStorage.getItem("shs_student_name");
    if (savedName) setUserName(savedName);
  }, []);

  const completedExams = mockExamsData.filter(e => e.status === "completed");
  const avgScore = completedExams.length > 0 
    ? Math.round(completedExams.reduce((a, e) => a + (e.score || 0), 0) / completedExams.length)
    : 0;
  const highestScore = completedExams.length > 0 
    ? Math.max(...completedExams.map(e => e.score || 0))
    : 0;

  const filteredExams = filter === "all" 
    ? mockExamsData 
    : filter === "completed"
    ? mockExamsData.filter(e => e.status === "completed")
    : mockExamsData.filter(e => e.status === "available" || e.status === "in_progress");

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="flex items-center gap-1.5 text-[#22C55E] bg-[#22C55E]/10 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Completed</span>
          </div>
        );
      case "in_progress":
        return (
          <div className="flex items-center gap-1.5 text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">In Progress</span>
          </div>
        );
      case "available":
        return (
          <div className="flex items-center gap-1.5 text-[#4F46E5] bg-[#4F46E5]/10 px-3 py-1.5 rounded-full">
            <Play className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Ready</span>
          </div>
        );
      case "locked":
        return (
          <div className="flex items-center gap-1.5 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">Locked</span>
          </div>
        );
      default:
        return null;
    }
  };

  const ExamCard = ({ exam }: { exam: typeof mockExamsData[0] }) => {
    const isLocked = exam.status === "locked";
    const isCompleted = exam.status === "completed";
    const isInProgress = exam.status === "in_progress";
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-[24px] border overflow-hidden transition-all ${
          isLocked 
            ? "border-slate-100 opacity-60" 
            : "border-slate-100 hover:border-slate-200 hover:shadow-lg cursor-pointer"
        }`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isCompleted ? "bg-[#D6FF62]" : 
                isInProgress ? "bg-[#FEF3C7]" : 
                isLocked ? "bg-slate-100" : "bg-[#EEF2FF]"
              }`}>
                {isLocked ? (
                  <Lock className="w-6 h-6 text-slate-400" />
                ) : (
                  <FileText className={`w-6 h-6 ${
                    isCompleted ? "text-deep-forest" : 
                    isInProgress ? "text-[#F59E0B]" : "text-[#4F46E5]"
                  }`} />
                )}
              </div>
              <div>
                <h3 className="font-black text-deep-forest text-lg">{exam.title}</h3>
                <p className="text-xs text-slate-400 font-medium">
                  {isCompleted ? `Taken on ${exam.date}` : 
                   isInProgress ? "Resume your exam" :
                   isLocked ? "Complete previous exams to unlock" : "Full-length SHSAT simulation"}
                </p>
              </div>
            </div>
            {getStatusBadge(exam.status)}
          </div>

          {isCompleted && exam.score && (
            <div className="bg-slate-50 rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Score</div>
                  <div className="text-3xl font-black text-deep-forest">{exam.score}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</div>
                  <div className="text-lg font-bold text-slate-600">{exam.duration}</div>
                </div>
                <div className="w-24 h-24 relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                    <circle 
                      cx="18" cy="18" r="15" fill="none" 
                      stroke="#D6FF62" strokeWidth="3" 
                      strokeDasharray={`${(exam.score / exam.maxScore) * 94.2} 94.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-deep-forest">{Math.round((exam.score / exam.maxScore) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isInProgress && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                <span className="text-sm font-bold text-[#F59E0B]">{exam.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#F59E0B] rounded-full transition-all"
                  style={{ width: `${exam.progress}%` }}
                />
              </div>
            </div>
          )}

          {!isLocked && (
            <button className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
              isCompleted 
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                : isInProgress
                ? "bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-lg shadow-[#F59E0B]/20"
                : "bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-lg shadow-[#4F46E5]/20"
            }`}>
              {isCompleted ? (
                <>
                  <BarChart2 className="w-4 h-4" />
                  Review Results
                </>
              ) : isInProgress ? (
                <>
                  <Play className="w-4 h-4" />
                  Continue Exam
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Exam
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    );
  };

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
          <SidebarItem icon={BookOpen} label="Mock Exams" active />
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
          onClick={() => router.push("/dashboard/profile")}
          className="pt-6 border-t border-slate-800 flex items-center justify-between mt-auto cursor-pointer hover:bg-[#1E293B] -mx-2 px-2 py-3 rounded-xl transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-mint rounded-lg flex items-center justify-center text-deep-forest font-bold text-sm">
              {userName[0]}
            </div>
            <span className="text-sm font-bold text-slate-300">{userName}</span>
          </div>
          <Settings className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
        </div>
      </aside>

      <main className="flex-1 ml-64 p-12">
        <div className="max-w-6xl">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-deep-forest font-display">Mock Exams</h1>
            </div>
            <p className="text-slate-400 font-medium">Take full-length practice exams to simulate the real SHSAT experience. Each exam includes timed sections for ELA and Math.</p>
          </header>

          <div className="grid grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Best Score</span>
              </div>
              <div className="text-3xl font-black text-deep-forest">{highestScore}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-[#4F46E5]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Score</span>
              </div>
              <div className="text-3xl font-black text-deep-forest">{avgScore}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</span>
              </div>
              <div className="text-3xl font-black text-deep-forest">{completedExams.length}/12</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-[#D6FF62]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Improvement</span>
              </div>
              <div className="text-3xl font-black text-deep-forest">
                {completedExams.length >= 2 
                  ? `+${(completedExams[completedExams.length - 1]?.score || 0) - (completedExams[0]?.score || 0)}`
                  : "—"
                }
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {[
              { id: "all", label: "All Exams" },
              { id: "completed", label: "Completed" },
              { id: "available", label: "Available" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  filter === tab.id 
                    ? "bg-[#0F172A] text-white" 
                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ExamCard exam={exam} />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-[24px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-[#D6FF62]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Pro Tip</span>
                </div>
                <h3 className="text-2xl font-black mb-2">Simulate Real Test Conditions</h3>
                <p className="text-white/70 font-medium max-w-lg">
                  Take your mock exams in a quiet environment with no distractions. Time yourself strictly and don't peek at answers until you're done!
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Clock className="w-10 h-10 text-[#D6FF62]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MockExamsPage;
