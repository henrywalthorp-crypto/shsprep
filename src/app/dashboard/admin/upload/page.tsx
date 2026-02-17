"use client";

import { useState, useEffect } from "react";
import { Upload, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import BulkUploadZone from "@/components/admin/BulkUploadZone";

interface UploadHistoryItem {
  file: string;
  inserted: number;
  errors: { index: number; message: string }[];
  timestamp: string;
}

export default function UploadPage() {
  const [history, setHistory] = useState<UploadHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("upload_history") || "[]");
      setHistory(stored);
    } catch {}
  }, []);

  return (
    <div className="max-w-3xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">Bulk Upload</h1>
        </div>
        <p className="text-slate-400 font-medium">Import questions from a JSON file.</p>
      </header>

      <BulkUploadZone />

      {/* Instructions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-8">
        <h3 className="font-bold text-deep-forest mb-3">Expected JSON Format</h3>
        <pre className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 overflow-x-auto">{`[
  {
    "section": "math" | "ela",
    "category": "Algebra",
    "difficulty": "1" | "2" | "3",
    "type": "multiple_choice",
    "stem": "What is 2 + 2?",
    "options": [
      { "label": "A", "text": "3", "isCorrect": false },
      { "label": "B", "text": "4", "isCorrect": true }
    ],
    "correct_answer": "B",
    "explanation": "2 + 2 equals 4.",
    "common_mistakes": [
      { "label": "A", "explanation": "Simple arithmetic error." }
    ]
  }
]`}</pre>
        <div className="mt-4 space-y-1 text-sm text-slate-500">
          <p><strong>section:</strong> &quot;math&quot; or &quot;ela&quot;</p>
          <p><strong>difficulty:</strong> &quot;1&quot; (Easy), &quot;2&quot; (Medium), &quot;3&quot; (Hard)</p>
          <p><strong>type:</strong> multiple_choice, grid_in, multi_select</p>
          <p><strong>passage_id:</strong> Optional UUID to link to a passage</p>
        </div>
      </div>

      {/* Upload History */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
          <h3 className="font-bold text-deep-forest mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> Recent Uploads
          </h3>
          <div className="space-y-3">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-deep-forest">{h.file}</p>
                  <p className="text-xs text-slate-400">{new Date(h.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {h.inserted}
                  </span>
                  {h.errors.length > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" /> {h.errors.length}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
