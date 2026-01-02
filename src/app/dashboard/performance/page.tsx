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
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  XCircle,
  Zap,
  Brain,
  Calculator,
  Info
} from "lucide-react";

const recentActivityData = [
  { id: 1, type: "practice", topic: "Algebra - Solving Equations", score: 85, questions: 20, date: "Today", time: "2:30 PM" },
  { id: 2, type: "mock_exam", title: "Practice Exam 3", score: 589, maxScore: 800, date: "Yesterday", time: "10:00 AM" },
  { id: 3, type: "practice", topic: "Reading Comprehension - Inference", score: 72, questions: 15, date: "Yesterday", time: "4:15 PM" },
  { id: 4, type: "practice", topic: "Geometry - Triangles", score: 90, questions: 25, date: "2 days ago", time: "3:00 PM" },
  { id: 5, type: "mock_exam", title: "Practice Exam 2", score: 567, maxScore: 800, date: "Last week", time: "9:00 AM" },
  { id: 6, type: "practice", topic: "Grammar & Usage", score: 68, questions: 30, date: "Last week", time: "5:30 PM" },
];

const weeklyProgressData = [
  { day: "Mon", questions: 45, correct: 38 },
  { day: "Tue", questions: 62, correct: 51 },
  { day: "Wed", questions: 38, correct: 32 },
  { day: "Thu", questions: 71, correct: 58 },
  { day: "Fri", questions: 55, correct: 47 },
  { day: "Sat", questions: 89, correct: 76 },
  { day: "Sun", questions: 42, correct: 35 },
];

const strengthsData = [
  { topic: "Algebra", accuracy: 87, trend: "up", questions: 245 },
  { topic: "Geometry", accuracy: 82, trend: "up", questions: 189 },
  { topic: "Reading Comprehension", accuracy: 78, trend: "stable", questions: 312 },
  { topic: "Statistics", accuracy: 91, trend: "up", questions: 98 },
];

const weaknessesData = [
  { topic: "Grammar & Usage", accuracy: 62, trend: "down", questions: 156 },
  { topic: "Word Problems", accuracy: 58, trend: "stable", questions: 87 },
  { topic: "Figurative Language", accuracy: 65, trend: "up", questions: 45 },
  { topic: "Punctuation", accuracy: 68, trend: "down", questions: 78 },
];

const mockExamScoresData = [
  { exam: 1, score: 534, date: "Oct 15" },
  { exam: 2, score: 567, date: "Oct 22" },
  { exam: 3, score: 589, date: "Oct 29" },
];

const PerformancePage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("Fardin");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");

  useEffect(() => {
    const savedName = localStorage.getItem("shs_student_name");
    if (savedName) setUserName(savedName);
  }, []);

  const totalQuestions = weeklyProgressData.reduce((a, d) => a + d.questions, 0);
  const totalCorrect = weeklyProgressData.reduce((a, d) => a + d.correct, 0);
  const weeklyAccuracy = Math.round((totalCorrect / totalQuestions) * 100);
  const maxQuestions = Math.max(...weeklyProgressData.map(d => d.questions));

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

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-[#22C55E]" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-[#EF4444]" />;
    return <div className="w-4 h-4 rounded-full bg-slate-300" />;
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
          <SidebarItem icon={BookOpen} label="Mock Exams" onClick={() => router.push("/dashboard/mock-exams")} />
          <SidebarItem icon={Layout} label="Study Plan" onClick={() => router.push("/dashboard")} />
          <SidebarItem icon={BarChart2} label="Performance" active />
          
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
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-black text-deep-forest font-display">Performance</h1>
                </div>
                <p className="text-slate-400 font-medium">Track your progress, identify strengths and weaknesses, and see how you're improving over time.</p>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { id: "week", label: "Week" },
                  { id: "month", label: "Month" },
                  { id: "all", label: "All Time" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTimeRange(tab.id as any)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                      timeRange === tab.id 
                        ? "bg-[#0F172A] text-white" 
                        : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Top Stats */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#4F46E5]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Questions</span>
              </div>
              <div className="text-2xl font-black text-deep-forest">{totalQuestions}</div>
              <div className="text-xs text-[#22C55E] font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +12% from last week
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Accuracy</span>
              </div>
              <div className="text-2xl font-black text-deep-forest">{weeklyAccuracy}%</div>
              <div className="text-xs text-[#22C55E] font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +3% from last week
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Streak</span>
              </div>
              <div className="text-2xl font-black text-deep-forest">12 days</div>
              <div className="text-xs text-slate-400 font-bold mt-1">Personal best: 18 days</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#EC4899]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Study Time</span>
              </div>
              <div className="text-2xl font-black text-deep-forest">14.5h</div>
              <div className="text-xs text-slate-400 font-bold mt-1">~2h per day avg</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-[#D6FF62]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Best Score</span>
              </div>
              <div className="text-2xl font-black text-deep-forest">589</div>
              <div className="text-xs text-[#22C55E] font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +55 from first exam
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Weekly Activity Chart */}
            <div className="col-span-2 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-deep-forest text-lg">Weekly Activity</h2>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#4F46E5] rounded-sm" />
                    <span className="font-bold text-slate-400">Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#D6FF62] rounded-sm" />
                    <span className="font-bold text-slate-400">Correct</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between h-48 gap-4">
                {weeklyProgressData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center gap-1 relative" style={{ height: '160px' }}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.questions / maxQuestions) * 100}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-full bg-[#4F46E5]/20 rounded-t-lg absolute bottom-0"
                      />
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.correct / maxQuestions) * 100}%` }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                        className="w-full bg-[#D6FF62] rounded-t-lg absolute bottom-0"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Exam Progress */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <h2 className="font-black text-deep-forest text-lg mb-6">Mock Exam Scores</h2>
              <div className="space-y-4">
                {mockExamScoresData.map((exam, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
                      <span className="text-sm font-black text-[#4F46E5]">{exam.exam}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-deep-forest">{exam.score}</span>
                        <span className="text-xs text-slate-400">{exam.date}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(exam.score / 800) * 100}%` }}
                          transition={{ delay: i * 0.2, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Score Improvement</span>
                  <span className="text-lg font-black text-[#22C55E]">+55 pts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#22C55E]" />
                </div>
                <h2 className="font-black text-deep-forest text-lg">Strengths</h2>
              </div>
              <div className="space-y-4">
                {strengthsData.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-deep-forest">{item.topic}</span>
                        <div className="flex items-center gap-2">
                          <TrendIcon trend={item.trend} />
                          <span className="text-sm font-black text-[#22C55E]">{item.accuracy}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.accuracy}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="h-full bg-[#22C55E] rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{item.questions} questions practiced</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#EF4444]/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[#EF4444]" />
                </div>
                <h2 className="font-black text-deep-forest text-lg">Areas to Improve</h2>
              </div>
              <div className="space-y-4">
                {weaknessesData.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-deep-forest">{item.topic}</span>
                        <div className="flex items-center gap-2">
                          <TrendIcon trend={item.trend} />
                          <span className="text-sm font-black text-[#F59E0B]">{item.accuracy}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.accuracy}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="h-full bg-[#F59E0B] rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{item.questions} questions practiced</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
            <h2 className="font-black text-deep-forest text-lg mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivityData.map((activity, i) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    activity.type === "mock_exam" ? "bg-[#EEF2FF]" : "bg-[#D6FF62]/20"
                  }`}>
                    {activity.type === "mock_exam" ? (
                      <FileText className="w-5 h-5 text-[#4F46E5]" />
                    ) : (
                      <Calculator className="w-5 h-5 text-[#84CC16]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-deep-forest">
                        {activity.type === "mock_exam" ? activity.title : activity.topic}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        activity.type === "mock_exam" 
                          ? "bg-[#4F46E5]/10 text-[#4F46E5]" 
                          : "bg-[#D6FF62]/30 text-[#84CC16]"
                      }`}>
                        {activity.type === "mock_exam" ? "MOCK EXAM" : "PRACTICE"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                      <span>{activity.date} at {activity.time}</span>
                      {activity.type === "practice" && (
                        <span>{activity.questions} questions</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black ${
                      activity.type === "mock_exam" 
                        ? "text-[#4F46E5]" 
                        : activity.score >= 80 ? "text-[#22C55E]" : activity.score >= 70 ? "text-[#F59E0B]" : "text-[#EF4444]"
                    }`}>
                      {activity.type === "mock_exam" ? activity.score : `${activity.score}%`}
                    </div>
                    {activity.type === "mock_exam" && (
                      <span className="text-xs text-slate-400">/ {activity.maxScore}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerformancePage;
