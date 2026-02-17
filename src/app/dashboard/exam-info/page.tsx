"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Monitor,
  Calendar,
  Clock,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Globe,
  Accessibility,
  Calculator,
  FileQuestion,
  Eye,
  Info
} from "lucide-react";

const ExamInfoPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>("what-is-shsat");

  const faqData = [
    {
      id: "what-is-shsat",
      question: "What is the SHSAT and who is eligible?",
      answer: "The Specialized High Schools Admissions Test (SHSAT) is the entrance exam for NYC's eight specialized high schools (excluding LaGuardia, which uses auditions). Current 8th graders and first-time 9th graders in NYC public, charter, or private schools are eligible to take the exam."
    },
    {
      id: "why-digital",
      question: "Why is the SHSAT moving to a digital format?",
      answer: "The digital format enables immediate embedding of supports for English Language Learners (ELLs) and students with disabilities. It also allows for tech-enhanced item types that provide alternative ways to assess student understanding, and in 2026, will enable computer-adaptive testing that tailors questions based on performance."
    },
    {
      id: "paper-version",
      question: "Will there be a paper version of the exam?",
      answer: "Paper exams will only be available for the extremely limited number of students who have Individual Education Plans (IEPs) or 504 plans with approved testing accommodations that require paper versions. Otherwise, all exams will be administered on the computer."
    },
    {
      id: "practice-tests",
      question: "Can students take practice tests on the platform?",
      answer: "Yes! Two fully functional online practice tests are available through the NYC SHSAT Portal, along with the Student Readiness Tool (SRT) tutorial, the How to Prepare for the SHSAT guide, and explanations of correct answers. No special software is required."
    },
    {
      id: "where-test",
      question: "Where will students take the exam?",
      answer: "Students will take the exam on DOE-provided computers either at their home school during a School Day administration or at a testing site on one of the designated weekend administration dates. Students may not use their own computers."
    },
    {
      id: "test-review",
      question: "Can families review exams after scores are released?",
      answer: "Yes! Once scores are released in Spring 2026, families can sign up for a test view appointment by completing the SHSAT Family Survey. For questions, email SHSATtestviews@schools.nyc.gov"
    }
  ];

  const accommodationsData = [
    {
      title: "Extended Time",
      description: "ELLs and eligible former ELLs receive 360 minutes (2x standard time) with two 15-minute breaks built in after the first 180 minutes.",
      icon: Clock
    },
    {
      title: "Translated Directions & Footnotes",
      description: "Available in Arabic, Bengali, Chinese (Simplified & Traditional), French, Haitian-Creole, Korean, Russian, Spanish, and Urdu.",
      icon: Globe
    },
    {
      title: "Bilingual Glossaries",
      description: "Paper glossaries with ~20,000 word translations provided in 30+ languages including Albanian, Dari, Farsi, Hindi, Polish, Portuguese, Tagalog, and more.",
      icon: BookOpen
    },
    {
      title: "Embedded Glossaries",
      description: "Digital glossaries for ELA and Math sections available in 10 languages to help ELLs demonstrate their abilities.",
      icon: Monitor
    }
  ];

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">SHSAT Exam Info</h1>
        </div>
        <p className="text-slate-400 font-medium">Official information about the digital SHSAT for the 2026-27 school year admissions.</p>
      </header>

      {/* Digital Transition Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-[28px] p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D6FF62]/5 rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4F46E5]/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-[#D6FF62]" />
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Major Update</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-3">The SHSAT Is Now Digital</h2>
          <p className="text-white/70 mb-6 max-w-2xl">
            Starting with Fall 2025, the SHSAT moved to a computer-based format with embedded supports for ELLs and students with disabilities. 
            In <span className="text-[#D6FF62] font-bold">Fall 2026</span>, the exam will become a computer-adaptive test (CAT) that tailors questions based on your performance.
          </p>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
              <div className="text-[10px] font-black text-white/50 uppercase tracking-wider mb-1">Fall 2026 Exam</div>
              <div className="text-white font-bold">Computer-Adaptive Format</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
              <div className="text-[10px] font-black text-white/50 uppercase tracking-wider mb-1">Admits to</div>
              <div className="text-white font-bold">2027-28 School Year</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Changes Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[24px] border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#D6FF62] rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-deep-forest" />
            </div>
            <h3 className="font-black text-deep-forest text-lg">What&apos;s Changing in 2026</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-deep-forest text-sm">Computer-Adaptive Testing</div>
                <p className="text-xs text-slate-500">Questions adapt based on your ongoing performance. Do well on a question, get a harder one next.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-deep-forest text-sm">Same Grade-Level Standards</div>
                <p className="text-xs text-slate-500">You won&apos;t be tested on above-grade-level content. Only the complexity varies.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-deep-forest text-sm">No Going Back</div>
                <p className="text-xs text-slate-500">You cannot revisit questions after answering (except within ELA passage sets). Must respond to advance.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-deep-forest text-sm">Same Question Count</div>
                <p className="text-xs text-slate-500">All students answer the same number of questions per subject.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
              <FileQuestion className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <h3 className="font-black text-deep-forest text-lg">Test Structure</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-deep-forest">ELA Section</span>
                <span className="text-xs font-bold text-slate-500">57 items</span>
              </div>
              <div className="text-xs text-slate-500">Revising/Editing (20) + Reading Comprehension (37)</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-deep-forest">Math Section</span>
                <span className="text-xs font-bold text-slate-500">57 items</span>
              </div>
              <div className="text-xs text-slate-500">Multiple Choice (52) + Grid-In (5)</div>
            </div>
            <div className="bg-[#D6FF62]/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-deep-forest">Total Time</span>
                <span className="text-xs font-bold text-[#22C55E]">3 hours</span>
              </div>
              <div className="text-xs text-slate-500">You choose which section to start with</div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center">
            <Accessibility className="w-5 h-5 text-[#22C55E]" />
          </div>
          <div>
            <h3 className="font-black text-deep-forest text-lg">Accessibility & Accommodations</h3>
            <p className="text-xs text-slate-500">Built-in supports for all students, plus additional accommodations for ELLs and students with disabilities</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {accommodationsData.map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 flex gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <div>
                <div className="font-bold text-deep-forest text-sm mb-1">{item.title}</div>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#EEF2FF] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-deep-forest text-sm mb-1">Universal Features for Everyone</div>
              <p className="text-xs text-slate-600">All students can use zoom, highlighting, and note-taking features. Students with IEPs or 504 plans receive their documented accommodations (tests read, breaks, large print) via the testing platform.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Section */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FEF3C7] rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-[#D97706]" />
          </div>
          <h3 className="font-black text-deep-forest text-lg">How Scoring Works</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-5 bg-slate-50 rounded-xl">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Step 1</div>
            <div className="font-black text-deep-forest mb-1">Raw Score</div>
            <p className="text-xs text-slate-500">Number of correct answers. Every question counts the same—no penalty for wrong answers!</p>
          </div>
          <div className="text-center p-5 bg-slate-50 rounded-xl">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Step 2</div>
            <div className="font-black text-deep-forest mb-1">Scaled Score</div>
            <p className="text-xs text-slate-500">Raw scores converted via calibration and normalization to account for test form differences.</p>
          </div>
          <div className="text-center p-5 bg-[#D6FF62]/20 rounded-xl">
            <div className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider mb-2">Final</div>
            <div className="font-black text-deep-forest mb-1">Composite Score</div>
            <p className="text-xs text-slate-500">Sum of ELA + Math scaled scores. Used with your school preferences for admissions.</p>
          </div>
        </div>
        <div className="bg-[#FEF2F2] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-deep-forest text-sm mb-1">Important About Scoring</div>
              <p className="text-xs text-slate-600">
                Scores are recalculated every year specifically for that year&apos;s test, so scores cannot be compared between years. 
                The maximum composite score is usually around 700, but this varies annually. Don&apos;t spend too much time on hard questions—they&apos;re all worth the same!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F5F3FF] rounded-xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <h3 className="font-black text-deep-forest text-lg">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-3">
          {faqData.map((faq) => (
            <div key={faq.id} className="border border-slate-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-deep-forest text-sm pr-4">{faq.question}</span>
                {expandedFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resources Footer */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-[24px] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white mb-2">Need More Information?</h3>
            <p className="text-white/70 text-sm">Visit the official NYC DOE SHSAT Portal for practice tests, tutorials, and the latest updates.</p>
          </div>
          <div className="flex gap-3">
            <a 
              href="#" 
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              Practice Tests
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 bg-[#D6FF62] hover:bg-[#C8F27B] text-deep-forest px-5 py-3 rounded-xl font-bold text-sm transition-colors"
            >
              <Globe className="w-4 h-4" />
              NYC SHSAT Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInfoPage;
