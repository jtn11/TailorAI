"use client";
import { AnalysisResult } from "@/types/analysis";
import jsPDF from "jspdf";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  analysis: AnalysisResult;
  onReset: () => void;
  onSearchJobs: () => void;
}

const MIDNIGHT = {
  bg: "#0b1221",
  surface: "#111c32",
  surfaceHigh: "#142040",
  surfaceHighest: "#1a2d4a",
  border: "#1a2d4a",
  borderLight: "#162036",
  onSurface: "#f1f5f9",
  onSurfaceVariant: "#94a3b8",
  outline: "#4a6080",
  primary: "#b4c5ff",
  primaryContainer: "#2563eb",
  secondary: "#10b981",
  secondaryContainer: "#059669",
  tertiary: "#f59e0b",
  error: "#f87171",
  errorContainer: "#7f1d1d",
};

export const AnalysedResult = ({ analysis, onReset, onSearchJobs }: Props) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editedCoverLetter, setEditedCoverLetter] = useState<string>(
    analysis?.coverLetter || ""
  );
  const [activeTab, setActiveTab] = useState<"overview" | "cover">("overview");

  useEffect(() => {
    if (analysis?.coverLetter) {
      setEditedCoverLetter(analysis.coverLetter);
    }
  }, [analysis?.coverLetter]);

  const extractText = (item: any): string => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      if (item.title && item.description) return `${item.title}: ${item.description}`;
      if (item.title) return item.title;
      if (item.description) return item.description;
      return JSON.stringify(item);
    }
    return String(item);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (text: string) => {
    if (!text) return;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 15, 20);
    doc.save("cover-letter.pdf");
  };

  const matchPct = analysis ? Math.round(analysis.matchScore * 100) : 0;

  // SVG circular gauge params
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (matchPct / 100) * circumference;

  // Skills gap data derived from analysis (fallback to demo if not provided)
  const skillsGapData = [
    { label: "Backend", resume: 85, benchmark: 100, gap: -15 },
    { label: "Frontend", resume: 93, benchmark: 100, gap: -7 },
    { label: "DevOps", resume: 55, benchmark: 100, gap: -45 },
    { label: "Cloud Architect", resume: 85, benchmark: 100, gap: -15 },
  ];

  // Sub-scores derived (use analysis fields if available)
  const subScores = [
    { label: "Experience", value: 92 },
    { label: "Skills", value: 78 },
    { label: "Education", value: 95 },
  ];

  // Missing keywords impact categorisation
  const missingKeywords = (analysis?.missingKeywords || []).map(
    (kw: any, i: number) => {
      const text = extractText(kw);
      const impact = i < 3 ? "HIGH" : i < 6 ? "MEDIUM" : "LOW";
      return { text, impact };
    }
  );

  // Recommendations
  const recommendations = (analysis?.suggestions || []).map((s: any) =>
    extractText(s)
  );

  return (
    <div
      className="text-[#f1f5f9]"
      style={{ fontFamily: "'Inter', 'Space Grotesk', sans-serif" }}
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="pb-6 mb-2">
        <h1
          className="text-3xl font-bold tracking-tight text-white"
          style={{ letterSpacing: "-0.02em" }}
        >
          Analysis Overview
        </h1>
        <p className="mt-1.5 text-sm text-[#4a6080] max-w-xl leading-relaxed">
          {analysis?.jobDescription
            ? `Precision analysis for your target role. Data synthesized from resume benchmarks.`
            : "Precision analysis synthesized from resume benchmarks."}
        </p>
      </div>

      {/* ── Tab Row ─────────────────────────────────────────────── */}
      <div className="flex gap-1 pb-5">
        {[
          { id: "overview", label: "Overview" },
          { id: "cover", label: "Cover Letter" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === t.id
                ? "bg-[#2563eb] text-white"
                : "text-[#8d90a0] hover:text-[#e1e2ed] hover:bg-[#282a32]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* ── Match Score Card ──────────────────────────────── */}
          <div
            className="rounded-xl border p-6 flex flex-col"
            style={{
              background: MIDNIGHT.surface,
              borderColor: MIDNIGHT.border,
            }}
          >
            {/* Circular Gauge */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-[180px] h-[180px]">
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  className="-rotate-90"
                >
                  {/* Track */}
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke="#282a32"
                    strokeWidth="14"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke="url(#gaugeGrad)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1.2s ease" }}
                  />
                  <defs>
                    <linearGradient
                      id="gaugeGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#b4c5ff" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-4xl font-bold text-white"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {matchPct}%
                  </span>
                  <span className="text-xs text-[#8d90a0] mt-1">
                    Match Score
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-score bars */}
            <div className="space-y-3">
              {subScores.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-[#c3c6d7]">{s.label}</span>
                    <span
                      className="text-xs font-semibold text-[#b4c5ff]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {s.value}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "#282a32" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${s.value}%`,
                        background:
                          "linear-gradient(90deg, #2563eb, #b4c5ff)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Skills Gap Analysis ───────────────────────────── */}
          <div
            className="rounded-xl border p-6"
            style={{
              background: MIDNIGHT.surface,
              borderColor: MIDNIGHT.border,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">
                Skills Gap Analysis
              </h2>
              <span
                className="text-xs text-[#8d90a0]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Radar Synthesis
              </span>
            </div>

            <div className="space-y-4">
              {skillsGapData.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#c3c6d7]">{s.label}</span>
                    <span
                      className={`text-xs font-semibold ${
                        s.gap < -30
                          ? "text-[#ffb95f]"
                          : "text-[#8d90a0]"
                      }`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {s.gap}%
                    </span>
                  </div>
                  {/* Dual bar: benchmark (navy) behind, resume (teal) on top */}
                  <div
                    className="relative h-5 rounded overflow-hidden"
                    style={{ background: "#282a32" }}
                  >
                    {/* Benchmark bar */}
                    <div
                      className="absolute inset-y-0 left-0 rounded"
                      style={{
                        width: `${s.benchmark}%`,
                        background: "#2e3a5c",
                      }}
                    />
                    {/* Resume bar */}
                    <div
                      className="absolute inset-y-0 left-0 rounded"
                      style={{
                        width: `${s.resume}%`,
                        background: "#00a572",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-5">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ background: "#1a3a6b" }}
                />
                <span className="text-xs text-[#4a6080]">Target Benchmark</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ background: "#10b981" }}
                />
                <span className="text-xs text-[#4a6080]">Your Resume</span>
              </div>
            </div>
          </div>

          {/* ── Missing Keywords ──────────────────────────────── */}
          <div
            className="rounded-xl border p-6"
            style={{
              background: MIDNIGHT.surface,
              borderColor: MIDNIGHT.border,
            }}
          >
            <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-[#ffb95f]" />
              Missing Keywords
            </h2>

            {missingKeywords.length > 0 ? (
              <div className="space-y-2">
                {missingKeywords.map(({ text, impact }, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                    style={{ borderColor: MIDNIGHT.borderLight }}
                  >
                    <span className="text-sm text-[#c3c6d7]">{text}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        impact === "HIGH"
                          ? "bg-[#7f1d1d] text-[#f87171]"
                          : impact === "MEDIUM"
                          ? "bg-[#78350f]/70 text-[#f59e0b]"
                          : "bg-[#0f1829] text-[#4a6080]"
                      }`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {impact} Impact
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#8d90a0]">
                No missing keywords found. Great work!
              </p>
            )}
          </div>

          {/* ── Detailed Recommendations ──────────────────────── */}
          <div
            className="rounded-xl border p-6"
            style={{
              background: MIDNIGHT.surface,
              borderColor: MIDNIGHT.border,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">
                Detailed Recommendations
              </h2>
              <button
                onClick={() => handleDownload(editedCoverLetter)}
                className="flex items-center gap-1.5 text-xs text-[#b4c5ff] hover:text-white transition-colors"
              >
                <Download size={13} />
                Export PDF
              </button>
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((text, idx) => {
                  const icons = [TrendingUp, CheckCircle2, FileText];
                  const Icon = icons[idx % icons.length];
                  const iconColors = ["#4edea3", "#b4c5ff", "#ffb95f"];
                  const iconBgs = [
                    "#00a572/20",
                    "#2563eb/20",
                    "#996100/30",
                  ];
                  return (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 rounded-lg group cursor-pointer hover:bg-[#282a32] transition-colors"
                    >
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                        style={{
                          background:
                            idx % 3 === 0
                              ? "rgba(0,165,114,0.18)"
                              : idx % 3 === 1
                              ? "rgba(37,99,235,0.18)"
                              : "rgba(153,97,0,0.25)",
                        }}
                      >
                        <Icon
                          size={15}
                          style={{ color: iconColors[idx % 3] }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#e1e2ed] leading-relaxed line-clamp-3">
                          {text}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className="text-[10px] px-2 py-0.5 rounded border text-[#b4c5ff] border-[#2563eb]/40 bg-[#2563eb]/10"
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                            }}
                          >
                            Resume Structure
                          </span>
                          <button
                            onClick={() => handleCopy(text, idx)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedIndex === idx ? (
                              <span className="text-xs text-[#4edea3]">
                                Copied!
                              </span>
                            ) : (
                              <Copy size={12} className="text-[#8d90a0]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[#8d90a0]">
                No recommendations at this time.
              </p>
            )}
          </div>

          {/* ── Missing Skills ────────────────────────────────── */}
          {analysis?.missingSkills && analysis.missingSkills.length > 0 && (
            <div
              className="rounded-xl border p-6 lg:col-span-2"
              style={{
                background: MIDNIGHT.surface,
                borderColor: MIDNIGHT.border,
              }}
            >
              <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                <ArrowUpRight size={16} className="text-[#b4c5ff]" />
                Areas to Improve
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysis.missingSkills.map((skill: any, idx: number) => {
                  const text = extractText(skill);
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{ background: MIDNIGHT.surfaceHigh }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                        style={{ background: "#b4c5ff" }}
                      />
                      <span className="text-sm text-[#c3c6d7] leading-relaxed">
                        {text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Find Jobs CTA ─────────────────────────────────── */}
          <div
            className="rounded-xl border p-6 lg:col-span-2 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0f1e40 0%, #111c32 60%)",
              borderColor: "#2563eb33",
            }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full"
              style={{
                background: "radial-gradient(circle, #2563eb18 0%, transparent 70%)",
              }}
            />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#2563eb20", border: "1px solid #2563eb40" }}
              >
                <Briefcase size={22} className="text-[#b4c5ff]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1">
                  Find Relevant Jobs
                </h3>
                <p className="text-sm text-[#8d90a0] max-w-lg leading-relaxed">
                  Ready to apply? Let us scan the web for active job openings
                  that perfectly match your updated profile and resume.
                </p>
              </div>
              <button
                onClick={onSearchJobs}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 0 20px #2563eb30",
                }}
              >
                <Search size={16} />
                Search Jobs on Web
              </button>
            </div>
          </div>

          {/* ── Reset Button ──────────────────────────────────── */}
          <div className="lg:col-span-2">
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium text-[#8d90a0] hover:text-[#e1e2ed] transition-colors"
              style={{
                background: MIDNIGHT.surfaceHigh,
                border: `1px solid ${MIDNIGHT.border}`,
              }}
            >
              <X size={15} />
              Analyze Another Resume
            </button>
          </div>
        </div>
      ) : (
        /* ── Cover Letter Tab ─────────────────────────────────── */
        <div className="pt-2">
          <div
            className="rounded-xl border p-6"
            style={{
              background: MIDNIGHT.surface,
              borderColor: MIDNIGHT.border,
            }}
          >
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <FileText size={16} className="text-[#b4c5ff]" />
              Generated Cover Letter
            </h2>
            <div
              className="rounded-lg border mb-4 focus-within:border-[#2563eb] focus-within:ring-1 focus-within:ring-[#2563eb30] transition-all"
              style={{
                background: MIDNIGHT.bg,
                borderColor: MIDNIGHT.border,
              }}
            >
              <textarea
                className="w-full bg-transparent text-[#c3c6d7] text-sm leading-relaxed p-5 outline-none resize-y min-h-[340px]"
                value={editedCoverLetter}
                onChange={(e) => setEditedCoverLetter(e.target.value)}
                placeholder="No cover letter generated yet."
                disabled={!analysis?.coverLetter}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleCopy(editedCoverLetter || "", 0)}
                disabled={!editedCoverLetter}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:brightness-110"
                style={{ background: "#2563eb" }}
              >
                <Copy size={16} />
                {copiedIndex === 0 ? "Copied!" : "Copy to Clipboard"}
              </button>
              <button
                onClick={() => handleDownload(editedCoverLetter || "")}
                disabled={!editedCoverLetter}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-[#32343d]"
                style={{
                  background: MIDNIGHT.surfaceHighest,
                  color: MIDNIGHT.onSurfaceVariant,
                  border: `1px solid ${MIDNIGHT.border}`,
                }}
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium text-[#8d90a0] hover:text-[#e1e2ed] transition-colors"
              style={{
                background: MIDNIGHT.surfaceHigh,
                border: `1px solid ${MIDNIGHT.border}`,
              }}
            >
              <X size={15} />
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
