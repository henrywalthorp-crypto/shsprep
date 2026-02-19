"use client";

import React, { useState, useMemo } from "react";
import { Calculator, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";

// ============================================================================
// SHSAT Score Conversion
// Based on DOE methodology: 57 questions per section, 10 are field (experimental)
// Only 47 scored. Polynomial interpolation from known data points.
// Middle range: +1 raw ≈ +3-4 scaled. Top/bottom: +1 raw ≈ +10-20 scaled.
// Max scaled per section: ~350. Min: ~200.
// ============================================================================

function rawToScaled(raw: number): number {
  // Clamp to valid range
  const r = Math.max(0, Math.min(57, raw));
  
  // Piecewise linear approximation based on DOE published methodology
  // Adjusted from Kenny Tan's reverse-engineered conversion table
  // 0 correct → ~200, 10 → ~240, 20 → ~265, 30 → ~290, 40 → ~315, 47 → ~350
  // With steeper curves at extremes
  
  if (r === 0) return 200;
  if (r <= 5) return 200 + r * 6;     // 200-230, steep at bottom
  if (r <= 10) return 230 + (r - 5) * 3; // 230-245
  if (r <= 15) return 245 + (r - 10) * 3; // 245-260
  if (r <= 20) return 260 + (r - 15) * 3; // 260-275
  if (r <= 25) return 275 + (r - 20) * 3; // 275-290
  if (r <= 30) return 290 + (r - 25) * 3; // 290-305
  if (r <= 35) return 305 + (r - 30) * 3; // 305-320
  if (r <= 40) return 320 + (r - 35) * 2; // 320-330
  if (r <= 45) return 330 + (r - 40) * 2; // 330-340
  if (r <= 50) return 340 + (r - 45) * 1; // 340-345
  if (r <= 55) return 345 + (r - 50) * 1; // 345-350
  return 350; // 56-57
}

// 2025 cutoff scores (most recent available)
const SCHOOLS = [
  { name: "Stuyvesant High School", cutoff: 556, seats: 850, abbr: "Stuy" },
  { name: "Staten Island Technical HS", cutoff: 527, seats: 328, abbr: "SI Tech" },
  { name: "HSMSE at City College", cutoff: 526, seats: 140, abbr: "HSMSE" },
  { name: "Bronx High School of Science", cutoff: 518, seats: 748, abbr: "Bronx Sci" },
  { name: "Queens Science at York College", cutoff: 518, seats: 116, abbr: "QHSS" },
  { name: "Brooklyn Technical HS", cutoff: 505, seats: 1490, abbr: "Brooklyn Tech" },
  { name: "American Studies at Lehman", cutoff: 504, seats: 104, abbr: "HSAS" },
  { name: "The Brooklyn Latin School", cutoff: 496, seats: 215, abbr: "Brooklyn Latin" },
];

export default function ScoreCalculator() {
  const [elaRaw, setElaRaw] = useState<number | "">("");
  const [mathRaw, setMathRaw] = useState<number | "">("");
  const [showDetails, setShowDetails] = useState(false);

  const results = useMemo(() => {
    if (elaRaw === "" || mathRaw === "") return null;
    const elaScaled = rawToScaled(elaRaw);
    const mathScaled = rawToScaled(mathRaw);
    const composite = elaScaled + mathScaled;
    
    const qualifiedSchools = SCHOOLS.filter(s => composite >= s.cutoff);
    const nearMissSchools = SCHOOLS.filter(s => composite < s.cutoff && composite >= s.cutoff - 20);
    
    return { elaScaled, mathScaled, composite, qualifiedSchools, nearMissSchools };
  }, [elaRaw, mathRaw]);

  const handleInput = (setter: React.Dispatch<React.SetStateAction<number | "">>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") { setter(""); return; }
    const num = parseInt(val);
    if (!isNaN(num) && num >= 0 && num <= 57) setter(num);
  };

  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white font-display">SHSAT Score Calculator</h2>
        </div>
        <p className="text-white/70 text-sm font-medium">
          Enter your raw scores to estimate your scaled SHSAT score and see which schools you could qualify for.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* ELA Input */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              ELA Correct Answers (out of 57)
            </label>
            <input
              type="number"
              min={0}
              max={57}
              value={elaRaw}
              onChange={handleInput(setElaRaw)}
              placeholder="0-57"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none text-2xl font-black text-deep-forest text-center transition-all"
            />
            <p className="text-xs text-slate-400 mt-1 text-center">English Language Arts section</p>
          </div>

          {/* Math Input */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Math Correct Answers (out of 57)
            </label>
            <input
              type="number"
              min={0}
              max={57}
              value={mathRaw}
              onChange={handleInput(setMathRaw)}
              placeholder="0-57"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 outline-none text-2xl font-black text-deep-forest text-center transition-all"
            />
            <p className="text-xs text-slate-400 mt-1 text-center">Mathematics section</p>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#A3E9FF]/10 rounded-2xl p-5 text-center">
                <div className="text-[10px] font-black text-[#0EA5E9] uppercase tracking-widest mb-1">ELA Scaled</div>
                <div className="text-3xl font-black text-deep-forest">{results.elaScaled}</div>
              </div>
              <div className="bg-[#D6FF62]/20 rounded-2xl p-5 text-center">
                <div className="text-[10px] font-black text-[#84CC16] uppercase tracking-widest mb-1">Math Scaled</div>
                <div className="text-3xl font-black text-deep-forest">{results.mathScaled}</div>
              </div>
              <div className="bg-[#4F46E5]/10 rounded-2xl p-5 text-center">
                <div className="text-[10px] font-black text-[#4F46E5] uppercase tracking-widest mb-1">Composite</div>
                <div className="text-3xl font-black text-deep-forest">{results.composite}</div>
              </div>
            </div>

            {/* School Qualification */}
            <div className="bg-slate-50 rounded-2xl p-5">
              <h3 className="font-black text-deep-forest text-sm mb-4">School Eligibility (Based on 2025 Cutoffs)</h3>
              <div className="space-y-2">
                {SCHOOLS.map(school => {
                  const qualified = results.composite >= school.cutoff;
                  const nearMiss = !qualified && results.composite >= school.cutoff - 20;
                  return (
                    <div key={school.name} className={`flex items-center justify-between p-3 rounded-xl ${
                      qualified ? "bg-[#22C55E]/10" : nearMiss ? "bg-[#F59E0B]/10" : "bg-white"
                    }`}>
                      <div className="flex items-center gap-3">
                        {qualified ? (
                          <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
                        ) : nearMiss ? (
                          <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-300 shrink-0" />
                        )}
                        <div>
                          <span className="text-sm font-bold text-deep-forest">{school.name}</span>
                          <span className="text-xs text-slate-400 ml-2">({school.seats} seats)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-black ${
                          qualified ? "text-[#22C55E]" : nearMiss ? "text-[#F59E0B]" : "text-slate-400"
                        }`}>
                          {school.cutoff}
                        </span>
                        {qualified && (
                          <span className="text-xs text-[#22C55E] ml-1">+{results.composite - school.cutoff}</span>
                        )}
                        {nearMiss && (
                          <span className="text-xs text-[#F59E0B] ml-1">-{school.cutoff - results.composite}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-[#F59E0B]/10 rounded-2xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600">
                <strong className="text-deep-forest">Important:</strong> This calculator provides an <strong>estimate</strong> based on historical score conversion data. 
                Actual scaled scores vary each year based on test difficulty. The DOE does not publish exact conversion tables. 
                Cutoff scores change annually based on the applicant pool. Use this as a guide, not a guarantee.
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1 text-[#4F46E5] font-bold mt-2 hover:underline"
                >
                  {showDetails ? "Hide" : "Show"} scoring details
                  {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Scoring Details */}
            {showDetails && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 text-xs text-slate-500 space-y-2">
                <h4 className="font-black text-deep-forest text-sm">How SHSAT Scoring Works</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Each section (ELA & Math) has <strong>57 questions</strong>, but only <strong>47 are scored</strong>. The other 10 are experimental field questions — you won't know which ones.</li>
                  <li>Raw scores (number correct out of 47 scored questions) are converted to <strong>scaled scores</strong> ranging from ~200 to ~350 per section.</li>
                  <li>In the middle range, each additional correct answer adds about <strong>3-4 scaled points</strong>.</li>
                  <li>At the extremes (very high or very low scores), each correct answer can add <strong>10-20 scaled points</strong>.</li>
                  <li>Your <strong>composite score</strong> is the sum of both scaled scores (max ~700).</li>
                  <li>There is <strong>no penalty for wrong answers</strong> — always guess if unsure!</li>
                  <li>Cutoff scores shown are from the <strong>2025 admissions cycle</strong> and change each year.</li>
                </ul>
                <h4 className="font-black text-deep-forest text-sm pt-2">Score Range Guide</h4>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 rounded-lg p-2"><strong>600+</strong> — Excellent (likely qualifies for all schools)</div>
                  <div className="bg-slate-50 rounded-lg p-2"><strong>550-599</strong> — Strong (most schools except Stuy)</div>
                  <div className="bg-slate-50 rounded-lg p-2"><strong>500-549</strong> — Good (competitive for several schools)</div>
                  <div className="bg-slate-50 rounded-lg p-2"><strong>Below 500</strong> — May not qualify (keep practicing!)</div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-2xl p-6 text-center">
              <h3 className="text-white font-black text-lg mb-2">Want to improve your score?</h3>
              <p className="text-white/70 text-sm mb-4">Practice with 1,900+ SHSAT questions across every topic.</p>
              <a
                href="/signup"
                className="inline-block bg-white text-[#4F46E5] px-8 py-3 rounded-xl font-black text-sm hover:bg-slate-100 transition-colors"
              >
                Start Practicing Free →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
