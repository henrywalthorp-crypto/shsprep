"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText,
  ExternalLink,
  Download,
  Headphones,
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  Bookmark,
} from "lucide-react";

const resourcesData = {
  schoolInfo: [
    {
      id: 1,
      name: "Stuyvesant High School",
      location: "Manhattan",
      cutoffScore: "~560",
      description: "Known for its rigorous STEM program and competitive academics. Consistently ranked as one of the top public high schools in the nation.",
      specialties: ["STEM Focus", "Research Programs", "Competitive"],
      website: "stuy.enschool.org"
    },
    {
      id: 2,
      name: "Bronx High School of Science",
      location: "Bronx",
      cutoffScore: "~520",
      description: "Renowned for producing Nobel laureates and offering exceptional science programs. Strong emphasis on research opportunities.",
      specialties: ["Science Excellence", "Nobel Laureates", "Research"],
      website: "bxscience.edu"
    },
    {
      id: 3,
      name: "Brooklyn Technical High School",
      location: "Brooklyn",
      cutoffScore: "~500",
      description: "The largest specialized high school offering 18 engineering and science majors. Known for hands-on technical education.",
      specialties: ["Engineering", "18 Majors", "Technical"],
      website: "bths.edu"
    },
    {
      id: 4,
      name: "High School for Math, Science & Engineering",
      location: "Manhattan (CCNY Campus)",
      cutoffScore: "~525",
      description: "Small, intimate learning environment on the City College campus. Strong focus on math and engineering.",
      specialties: ["Small Class Sizes", "College Campus", "Engineering"],
      website: "hsmse.org"
    },
    {
      id: 5,
      name: "High School of American Studies",
      location: "Bronx (Lehman Campus)",
      cutoffScore: "~530",
      description: "Focuses on social studies and history with access to Lehman College resources. Great for humanities-focused students.",
      specialties: ["Humanities", "History Focus", "College Resources"],
      website: "hsas.org"
    },
    {
      id: 6,
      name: "Queens High School for Sciences",
      location: "Queens (York College)",
      cutoffScore: "~535",
      description: "Located on York College campus, emphasizing science research and biomedical studies.",
      specialties: ["Biomedical", "Science Research", "College Partnership"],
      website: "qhss.org"
    },
    {
      id: 7,
      name: "Staten Island Technical High School",
      location: "Staten Island",
      cutoffScore: "~515",
      description: "Strong technical and engineering programs with excellent facilities. Known for robotics and computer science.",
      specialties: ["Robotics", "Technical Programs", "Computer Science"],
      website: "siths.org"
    },
    {
      id: 8,
      name: "Brooklyn Latin School",
      location: "Brooklyn",
      cutoffScore: "~490",
      description: "Unique classical education model based on Boston Latin. All students take Latin and follow a classical curriculum.",
      specialties: ["Latin Required", "Classical Education", "Humanities"],
      website: "brooklynlatin.org"
    }
  ],
  studyGuides: [
    {
      id: 1,
      title: "Official SHSAT Handbook 2024-2025",
      type: "PDF",
      description: "The official NYC DOE handbook with test format, sample questions, and important dates.",
      downloadable: true,
      icon: FileText
    },
    {
      id: 2,
      title: "Math Formula Sheet",
      type: "PDF",
      description: "Essential formulas for geometry, algebra, and statistics needed for the SHSAT.",
      downloadable: true,
      icon: FileText
    },
    {
      id: 3,
      title: "Grammar Rules Quick Reference",
      type: "PDF",
      description: "Common grammar rules and punctuation guidelines tested on the ELA section.",
      downloadable: true,
      icon: FileText
    },
    {
      id: 4,
      title: "Reading Comprehension Strategies",
      type: "PDF",
      description: "Proven strategies for tackling different passage types and question formats.",
      downloadable: true,
      icon: FileText
    }
  ],
  importantDates: [
    { date: "September 2025", event: "SHSAT Registration Opens", type: "registration" },
    { date: "October 2025", event: "Registration Deadline", type: "deadline" },
    { date: "Late October - Early November", event: "Testing Window", type: "exam" },
    { date: "March 2026", event: "Results Released", type: "results" }
  ]
};

const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState<"schools" | "guides">("schools");

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">Resources</h1>
        </div>
        <p className="text-slate-400 font-medium">Everything you need to know about the SHSAT and specialized high schools.</p>
      </header>

      {/* Important Dates Banner */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-[24px] p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#D6FF62]" />
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Important Dates (2026 Exam)</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {resourcesData.importantDates.map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                  item.type === "deadline" ? "text-[#F87171]" : 
                  item.type === "exam" ? "text-[#D6FF62]" : "text-white/60"
                }`}>
                  {item.date}
                </div>
                <div className="text-white font-bold text-sm">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { id: "schools", label: "School Profiles", icon: GraduationCap },
          { id: "guides", label: "Study Guides", icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "schools" | "guides")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? "bg-[#0F172A] text-white" 
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Schools Tab */}
      {activeTab === "schools" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resourcesData.schoolInfo.map((school, index) => (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[24px] border border-slate-100 p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-black text-deep-forest text-lg mb-1">{school.name}</h3>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{school.location}</span>
                    </div>
                  </div>
                  <div className="bg-[#D6FF62] text-deep-forest px-3 py-1.5 rounded-lg">
                    <div className="text-[9px] font-black uppercase tracking-wider">Cutoff</div>
                    <div className="text-sm font-black">{school.cutoffScore}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-4">{school.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {school.specialties.map((spec, i) => (
                    <div key={i} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                      {spec}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-[#4F46E5] font-bold">{school.website}</span>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-[#4F46E5] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Guides Tab */}
      {activeTab === "guides" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resourcesData.studyGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[24px] border border-slate-100 p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <guide.icon className="w-6 h-6 text-[#4F46E5]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-black text-deep-forest">{guide.title}</h3>
                      <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded">{guide.type}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{guide.description}</p>
                    <button className="flex items-center gap-2 text-[#4F46E5] font-bold text-sm hover:gap-3 transition-all">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6">
            <h3 className="font-black text-deep-forest text-lg mb-6">External Resources</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#4F46E5]/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#4F46E5]" />
                  </div>
                  <div>
                    <div className="font-bold text-deep-forest">NYC DOE Specialized High Schools</div>
                    <div className="text-xs text-slate-400">Official NYC Department of Education page</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div>
                    <div className="font-bold text-deep-forest">Khan Academy - SHSAT Prep</div>
                    <div className="text-xs text-slate-400">Free practice problems and video tutorials</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <div className="font-bold text-deep-forest">SHSAT Prep Podcast</div>
                    <div className="text-xs text-slate-400">Weekly tips and strategies from test experts</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
