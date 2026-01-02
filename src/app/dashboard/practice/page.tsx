"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  BookOpen,
  Calculator,
  FileText,
  Play,
  CheckCircle2,
  Sparkles,
  Target,
  Zap,
  PenTool,
  BarChart2,
  Layout,
  Users,
  Settings,
  Info
} from "lucide-react";

const practiceData = {
  sections: [
    {
      id: "revising-editing",
      name: "Revising / Editing",
      icon: FileText,
      color: "#A3E9FF",
      colorDark: "#0EA5E9",
      categories: [
        {
          id: "conventions",
          name: "Conventions of Standard English",
          subcategories: [
            { id: "sentence-structure", name: "Sentence Structure", completed: 12, total: 100 },
            { id: "grammar-usage", name: "Grammar & Usage", completed: 45, total: 100 },
            { id: "punctuation-mechanics", name: "Punctuation & Mechanics", completed: 0, total: 100 },
          ]
        },
        {
          id: "effective-language",
          name: "Effective Language Use",
          subcategories: [
            { id: "word-choice", name: "Word Choice & Clarity", completed: 78, total: 100 },
            { id: "transitions", name: "Transitions & Logical Flow", completed: 23, total: 100 },
            { id: "precision-concision", name: "Precision & Concision", completed: 0, total: 100 },
          ]
        },
        {
          id: "organization",
          name: "Organization & Development",
          subcategories: [
            { id: "topic-sentences", name: "Topic Sentences & Supporting Details", completed: 56, total: 100 },
            { id: "paragraph-unity", name: "Paragraph Unity", completed: 0, total: 100 },
            { id: "logical-sequencing", name: "Logical Sequencing", completed: 34, total: 100 },
          ]
        }
      ]
    },
    {
      id: "reading-comprehension",
      name: "Reading Comprehension",
      icon: BookOpen,
      color: "#FFB8E0",
      colorDark: "#EC4899",
      categories: [
        {
          id: "passage-types",
          name: "Passage Types",
          subcategories: [
            { id: "informational", name: "Informational / Expository", completed: 67, total: 100 },
            { id: "literary", name: "Literary", completed: 89, total: 100 },
            { id: "poetry", name: "Poetry", completed: 12, total: 100 },
          ]
        },
        {
          id: "comprehension-skills",
          name: "Comprehension Skills",
          subcategories: [
            { id: "main-idea", name: "Main Idea & Central Theme", completed: 100, total: 100 },
            { id: "inference", name: "Inference & Interpretation", completed: 45, total: 100 },
            { id: "supporting-evidence", name: "Supporting Evidence", completed: 23, total: 100 },
            { id: "vocabulary-context", name: "Vocabulary in Context", completed: 78, total: 100 },
            { id: "figurative-language", name: "Figurative Language", completed: 0, total: 100 },
            { id: "tone-style", name: "Tone & Style", completed: 34, total: 100 },
            { id: "organization-purpose", name: "Organization & Purpose", completed: 56, total: 100 },
            { id: "point-of-view", name: "Point of View & Perspective", completed: 12, total: 100 },
            { id: "argument-reasoning", name: "Argument & Reasoning", completed: 0, total: 100 },
          ]
        }
      ]
    },
    {
      id: "mathematics",
      name: "Mathematics",
      icon: Calculator,
      color: "#D6FF62",
      colorDark: "#84CC16",
      categories: [
        {
          id: "number-operations",
          name: "Number & Operations",
          subcategories: [
            { id: "integers", name: "Integers & Order of Operations", completed: 88, total: 100 },
            { id: "fractions-decimals", name: "Fractions, Decimals, Percents", completed: 56, total: 100 },
            { id: "exponents-roots", name: "Exponents & Roots", completed: 34, total: 100 },
            { id: "absolute-value", name: "Absolute Value", completed: 12, total: 100 },
          ]
        },
        {
          id: "algebra",
          name: "Algebra & Expressions",
          subcategories: [
            { id: "simplifying", name: "Simplifying Expressions", completed: 45, total: 100 },
            { id: "solving-equations", name: "Solving Equations", completed: 67, total: 100 },
            { id: "inequalities", name: "Inequalities", completed: 23, total: 100 },
            { id: "word-problems", name: "Word Problems", completed: 0, total: 100 },
          ]
        },
        {
          id: "geometry",
          name: "Geometry & Measurement",
          subcategories: [
            { id: "lines-angles", name: "Lines & Angles", completed: 78, total: 100 },
            { id: "triangles", name: "Triangles", completed: 56, total: 100 },
            { id: "quadrilaterals", name: "Quadrilaterals & Polygons", completed: 34, total: 100 },
            { id: "circles", name: "Circles", completed: 12, total: 100 },
            { id: "coordinate-geometry", name: "Coordinate Geometry", completed: 45, total: 100 },
            { id: "3d-figures", name: "3D Figures", completed: 0, total: 100 },
            { id: "transformations", name: "Transformations", completed: 23, total: 100 },
          ]
        },
        {
          id: "statistics",
          name: "Statistics & Probability",
          subcategories: [
            { id: "central-tendency", name: "Central Tendency", completed: 67, total: 100 },
            { id: "graphs-tables", name: "Graphs & Tables", completed: 89, total: 100 },
            { id: "probability-basics", name: "Probability Basics", completed: 34, total: 100 },
          ]
        },
        {
          id: "problem-solving",
          name: "Problem Solving & Grid-Ins",
          subcategories: [
            { id: "multi-step", name: "Multi-step Reasoning", completed: 23, total: 100 },
            { id: "estimation", name: "Estimation", completed: 45, total: 100 },
            { id: "numeric-entry", name: "Numeric Entry", completed: 12, total: 100 },
          ]
        }
      ]
    }
  ]
};

const PracticePage = () => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>(["revising-editing"]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["conventions"]);
  const [userName, setUserName] = useState("Fardin");

  React.useEffect(() => {
    const savedName = localStorage.getItem("shs_student_name");
    if (savedName) setUserName(savedName);
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getProgressColor = (completed: number, total: number) => {
    const pct = (completed / total) * 100;
    if (pct === 100) return "bg-[#22C55E]";
    if (pct >= 50) return "bg-[#D6FF62]";
    if (pct > 0) return "bg-[#A3E9FF]";
    return "bg-slate-200";
  };

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
          <SidebarItem icon={PenTool} label="Practice" active />
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
        <div className="max-w-5xl">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-deep-forest font-display">Practice Questions</h1>
            </div>
            <p className="text-slate-400 font-medium">Master each topic by practicing targeted questions. Track your progress and identify areas for improvement.</p>
          </header>

          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-[#4F46E5]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions Completed</span>
              </div>
              <div className="text-3xl font-black text-deep-forest">1,247</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy Rate</span>
              </div>
              <div className="text-3xl font-black text-deep-forest">78%</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Streak</span>
              </div>
              <div className="text-3xl font-black text-deep-forest">12 days</div>
            </div>
          </div>

          <div className="space-y-6">
            {practiceData.sections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);
              
              const totalCompleted = section.categories.reduce((acc, cat) => 
                acc + cat.subcategories.reduce((a, sub) => a + sub.completed, 0), 0
              );
              const totalQuestions = section.categories.reduce((acc, cat) => 
                acc + cat.subcategories.reduce((a, sub) => a + sub.total, 0), 0
              );
              const sectionProgress = Math.round((totalCompleted / totalQuestions) * 100);

              return (
                <div key={section.id} className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
                  <div 
                    onClick={() => toggleSection(section.id)}
                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="h-14 w-14 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: section.color }}
                        >
                          <Icon className="w-7 h-7" style={{ color: section.colorDark }} />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-deep-forest">{section.name}</h2>
                          <p className="text-sm text-slate-400 font-medium">{section.categories.length} categories</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-black text-deep-forest">{sectionProgress}%</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{totalCompleted}/{totalQuestions}</div>
                        </div>
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${sectionProgress}%`, backgroundColor: section.colorDark }}
                          />
                        </div>
                        <ChevronRight 
                          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-slate-100"
                      >
                        <div className="p-6 space-y-4">
                          {section.categories.map((category) => {
                            const isCatExpanded = expandedCategories.includes(category.id);
                            const catCompleted = category.subcategories.reduce((a, s) => a + s.completed, 0);
                            const catTotal = category.subcategories.reduce((a, s) => a + s.total, 0);

                            return (
                              <div key={category.id} className="bg-slate-50 rounded-2xl overflow-hidden">
                                <div 
                                  onClick={() => toggleCategory(category.id)}
                                  className="p-5 cursor-pointer hover:bg-slate-100 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <ChevronRight 
                                        className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isCatExpanded ? 'rotate-90' : ''}`}
                                      />
                                      <span className="font-bold text-deep-forest">{category.name}</span>
                                      <span className="text-xs text-slate-400 font-medium">({category.subcategories.length} topics)</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-sm font-bold text-slate-500">{catCompleted}/{catTotal}</span>
                                      <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full rounded-full"
                                          style={{ 
                                            width: `${(catCompleted / catTotal) * 100}%`, 
                                            backgroundColor: section.colorDark 
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {isCatExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="border-t border-slate-200"
                                    >
                                      <div className="p-4 grid gap-3">
                                        {category.subcategories.map((sub) => {
                                          const pct = Math.round((sub.completed / sub.total) * 100);
                                          const isComplete = pct === 100;

                                          return (
                                            <div 
                                              key={sub.id}
                                              className="bg-white rounded-xl p-4 border border-slate-100 flex items-center justify-between group hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer"
                                            >
                                              <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                  isComplete ? 'bg-[#22C55E]/10' : 'bg-slate-100'
                                                }`}>
                                                  {isComplete ? (
                                                    <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                                                  ) : (
                                                    <Target className="w-5 h-5 text-slate-400" />
                                                  )}
                                                </div>
                                                <div>
                                                  <div className="font-bold text-deep-forest text-sm">{sub.name}</div>
                                                  <div className="text-xs text-slate-400 font-medium">{sub.completed} of {sub.total} completed</div>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-4">
                                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                  <div 
                                                    className={`h-full rounded-full transition-all ${getProgressColor(sub.completed, sub.total)}`}
                                                    style={{ width: `${pct}%` }}
                                                  />
                                                </div>
                                                <span className="text-sm font-black text-slate-500 w-12 text-right">{pct}%</span>
                                                <button 
                                                  className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg font-bold text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA]"
                                                >
                                                  <Play className="w-3 h-3" />
                                                  Practice
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PracticePage;
