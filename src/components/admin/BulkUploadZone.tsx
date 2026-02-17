"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileJson, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface UploadResult {
  inserted: number;
  errors: { index: number; message: string }[];
  timestamp: string;
}

export default function BulkUploadZone() {
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".json")) {
      toast.error("Only .json files are accepted");
      return;
    }
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const questions = Array.isArray(data) ? data : data.questions;
        if (!Array.isArray(questions)) throw new Error("Expected array of questions");
        setParsed(questions);
      } catch (err: any) {
        toast.error(`Invalid JSON: ${err.message}`);
        setParsed(null);
      }
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const upload = async () => {
    if (!parsed) return;
    setUploading(true);
    setProgress(0);
    try {
      // Simulate progress
      const interval = setInterval(() => setProgress((p) => Math.min(p + 10, 90)), 200);
      const res = await fetch("/api/admin/questions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: parsed }),
      });
      clearInterval(interval);
      setProgress(100);
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const uploadResult: UploadResult = {
        inserted: data.inserted ?? parsed.length,
        errors: data.errors ?? [],
        timestamp: new Date().toISOString(),
      };
      setResult(uploadResult);

      // Save to localStorage history
      const history = JSON.parse(localStorage.getItem("upload_history") || "[]");
      history.unshift({ file: fileName, ...uploadResult });
      localStorage.setItem("upload_history", JSON.stringify(history.slice(0, 5)));

      toast.success(`Uploaded ${uploadResult.inserted} questions`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          dragging ? "border-[#4F46E5] bg-[#4F46E5]/5" : "border-slate-200 hover:border-slate-300 bg-white"
        }`}
      >
        <input ref={inputRef} type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-deep-forest font-bold mb-1">Drop a .json file here, or click to browse</p>
        <p className="text-sm text-slate-400">Accepts JSON array of question objects</p>
      </div>

      {parsed && !result && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <FileJson className="w-5 h-5 text-[#4F46E5]" />
            <div>
              <p className="font-bold text-deep-forest text-sm">{fileName}</p>
              <p className="text-xs text-slate-400">{parsed.length} questions found</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview (first 3)</p>
            {parsed.slice(0, 3).map((q, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 truncate">
                <span className="font-bold text-deep-forest">{q.section?.toUpperCase()}</span> — {q.stem || q.question || "No stem"}
              </div>
            ))}
          </div>

          {uploading && (
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-[#4F46E5] h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}

          <button
            onClick={upload}
            disabled={uploading}
            className="w-full px-5 py-3 rounded-xl bg-[#4F46E5] text-white font-bold text-sm hover:bg-[#4338CA] transition-colors disabled:opacity-50"
          >
            {uploading ? `Uploading... ${progress}%` : `Upload ${parsed.length} Questions`}
          </button>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <p className="font-bold text-deep-forest">
              Inserted {result.inserted} questions
              {result.errors.length > 0 && `, ${result.errors.length} errors`}
            </p>
          </div>

          {result.errors.length > 0 && (
            <div>
              <button
                onClick={() => setShowErrors(!showErrors)}
                className="flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:underline"
              >
                <AlertCircle className="w-4 h-4" />
                {result.errors.length} errors
                {showErrors ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showErrors && (
                <div className="mt-2 space-y-1">
                  {result.errors.map((err, i) => (
                    <div key={i} className="text-xs text-red-600 bg-red-50 rounded-lg p-2">
                      Row {err.index}: {err.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => { setParsed(null); setResult(null); setFileName(""); }}
            className="text-sm font-bold text-[#4F46E5] hover:underline"
          >
            Upload another file
          </button>
        </div>
      )}
    </div>
  );
}
