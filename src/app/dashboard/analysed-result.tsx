"use client";
import { AnalysisResult, KeywordAnalysis } from "@/types/analysis";
import { exportCoverLetterPdf } from "./exportpdf";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Search,
  TrendingUp,
  X,
  Star,
  Check,
  ChevronDown,
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
    analysis?.coverLetter || "",
  );
  const [activeTab, setActiveTab] = useState<"overview" | "cover">("overview");
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  useEffect(() => {
    if (analysis?.coverLetter) {
      setEditedCoverLetter(analysis.coverLetter);
    }
  }, [analysis?.coverLetter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedKeyword(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const extractText = (item: any): string => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      if (item.title && item.description)
        return `${item.title}: ${item.description}`;
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

  const handleDownload = async (text: string) => {
    if (!text) return;
    await exportCoverLetterPdf(text);
  };

  const matchPct = analysis ? Math.round(analysis.matchScore * 100) : 0;

  // SVG circular gauge params
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (matchPct / 100) * circumference;

  // Technical Domain Coverage data

  // Sub-scores derived from analysis
  const subScores = [
    {
      label: "Experience",
      value: Math.round((analysis?.experienceScore || 0) * 100) || 0,
    },
    {
      label: "Skills",
      value: Math.round((analysis?.skillsScore || 0) * 100) || 0,
    },
    {
      label: "Education",
      value: Math.round((analysis?.educationScore || 0) * 100) || 0,
    },
  ];

  // Missing keywords impact categorisation (supporting legacy data format)
  const missingKeywords: KeywordAnalysis[] = (
    analysis?.missingKeywords || []
  ).map((kw: any) => {
    if (typeof kw === "string") {
      return {
        keyword: kw,
        impact: "MEDIUM" as const,
        status: "Missing" as const,
        evidence: [],
        projectUsage: null,
        inSkillsSection: false,
        confidence: 50,
        recommendation: "Learn and mention in your resume.",
      };
    }

    const evidence = Array.isArray(kw.evidence) ? kw.evidence : [];
    const projectUsage = Array.isArray(kw.projectUsage)
      ? kw.projectUsage
      : null;

    // Check if listed in skills section
    const inSkillsSection =
      kw.inSkillsSection === true ||
      evidence.some((ev: string) => ev.toLowerCase().includes("skills"));

    // Check if used in projects (filtering out "none" or null values)
    const hasProjects =
      projectUsage !== null &&
      projectUsage.filter((p: string) => p && p.toLowerCase() !== "none")
        .length > 0;

    let determinedStatus: "Strong" | "Demonstrated" | "Mentioned" | "Missing" =
      "Missing";
    if (hasProjects && inSkillsSection) {
      determinedStatus = "Strong";
    } else if (hasProjects) {
      determinedStatus = "Demonstrated";
    } else if (inSkillsSection) {
      determinedStatus = "Mentioned";
    } else {
      determinedStatus = "Missing";
    }

    return {
      keyword: kw.keyword || kw.text || extractText(kw),
      impact: (kw.impact || "MEDIUM") as "HIGH" | "MEDIUM" | "LOW",
      status: determinedStatus,
      evidence: evidence,
      projectUsage: projectUsage,
      inSkillsSection: inSkillsSection,
      confidence: typeof kw.confidence === "number" ? kw.confidence : 75,
      recommendation:
        kw.recommendation ||
        "Integrate this keyword into your resume's skills or projects.",
    };
  });

  // Sort missingKeywords in descending order of status priority: Strong (4) -> Demonstrated (3) -> Mentioned (2) -> Missing (1)
  const statusPriority: Record<KeywordAnalysis["status"], number> = {
    Strong: 4,
    Demonstrated: 3,
    Mentioned: 2,
    Missing: 1,
  };
  missingKeywords.sort(
    (a, b) => (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0),
  );

  // Recommendations
  const recommendations = (analysis?.suggestions || []).map((s: any) =>
    extractText(s),
  );

  // Match breakdown evaluation with fallback support for legacy data
  const matchBreakdown = analysis?.matchBreakdown || {
    strengths: missingKeywords
      .filter((kw) => kw.status === "Strong" || kw.status === "Demonstrated")
      .slice(0, 3)
      .map((kw) =>
        kw.status === "Strong"
          ? `${kw.keyword} is strongly demonstrated`
          : `${kw.keyword} is used in projects`,
      )
      .concat([
        "Relevant educational alignment",
        "Demonstrated technical capacity",
      ])
      .slice(0, 4),
    weaknesses: missingKeywords
      .filter((kw) => kw.status === "Missing" || kw.status === "Mentioned")
      .slice(0, 3)
      .map((kw) =>
        kw.status === "Mentioned"
          ? `${kw.keyword} is only listed in skills`
          : `No demonstration of ${kw.keyword}`,
      ),
    improvements: (analysis?.suggestions || [])
      .slice(0, 3)
      .map((s: any, idx: number) => ({
        scoreBoost: 2 + idx,
        action: typeof s === "string" ? s : s.description || "Align skills",
      })),
    potentialScore: Math.min(1.0, (analysis?.matchScore || 0) + 0.1),
  };

  // Technical Domain Coverage data mapped with dynamic fallback derivations
  const rawSkillsAnalysis = analysis?.skillsAnalysis || [
    {
      label: "Backend",
      score: 0.72,
      strengths: ["Go", "Python", "SQL"],
      gaps: ["AWS", "Docker Compose"],
    },
    {
      label: "Frontend",
      score: 0.92,
      strengths: ["React", "Next.js", "TypeScript"],
      gaps: [],
    },
    {
      label: "Database",
      score: 0.58,
      strengths: ["SQL"],
      gaps: ["Redis", "PostgreSQL Project", "Query Optimization"],
    },
  ];

  const skillsAnalysis = rawSkillsAnalysis.map((s) => {
    // If strengths/gaps are already populated (new analysis), use them.
    // Otherwise, dynamically derive them from the existing missingKeywords or strengths.
    if ((s.strengths && s.strengths.length > 0) || (s.gaps && s.gaps.length > 0)) {
      return s;
    }

    const label = s.label.toLowerCase();
    const missingKeywordsList = missingKeywords || [];

    const isMatch = (kwName: string, domain: string) => {
      const kw = kwName.toLowerCase();
      if (domain.includes("backend")) {
        return ["go", "python", "node", "express", "backend", "api", "rest", "django", "flask", "springboot", "java", "c#", "microservices"].some(term => kw.includes(term));
      }
      if (domain.includes("frontend")) {
        return ["react", "next.js", "nextjs", "typescript", "javascript", "tailwind", "css", "html", "vue", "angular", "frontend", "redux", "ui", "ux"].some(term => kw.includes(term));
      }
      if (domain.includes("database") || domain.includes("data")) {
        return ["sql", "postgres", "mysql", "mongodb", "redis", "database", "query", "nosql", "cassandra", "prisma", "oracle", "mariadb"].some(term => kw.includes(term));
      }
      if (domain.includes("devops") || domain.includes("cloud") || domain.includes("architect")) {
        return ["aws", "docker", "kubernetes", "cicd", "ci/cd", "cloud", "terraform", "gcp", "azure", "deployment", "pipeline", "jenkins"].some(term => kw.includes(term));
      }
      return false;
    };

    const derivedStrengths = missingKeywordsList
      .filter(kw => (kw.status === "Strong" || kw.status === "Demonstrated") && isMatch(kw.keyword, label))
      .map(kw => kw.keyword)
      .slice(0, 3);

    const derivedGaps = missingKeywordsList
      .filter(kw => (kw.status === "Missing" || kw.status === "Mentioned") && isMatch(kw.keyword, label))
      .map(kw => kw.keyword)
      .slice(0, 3);

    // If strengths is empty, check matchBreakdown strengths
    if (derivedStrengths.length === 0 && matchBreakdown?.strengths) {
      const generalStrengths = matchBreakdown.strengths.filter(str => isMatch(str, label));
      derivedStrengths.push(...generalStrengths.slice(0, 3));
    }

    return {
      ...s,
      strengths: derivedStrengths,
      gaps: derivedGaps,
    };
  });
  const getRating = (score: number) => {
    if (score >= 0.9) return { text: "Excellent", color: "#10b981" }; // Emerald-500
    if (score >= 0.7) return { text: "Good", color: "#60a5fa" }; // Blue-400
    if (score >= 0.5) return { text: "Needs Improvement", color: "#f59e0b" }; // Amber-500
    return { text: "Critical Gap", color: "#f87171" }; // Red-400
  };

  const renderBlockProgressBar = (score: number, activeColor: string) => {
    const totalBlocks = 16;
    const activeBlocks = Math.min(totalBlocks, Math.max(0, Math.round(score * totalBlocks)));
    const inactiveBlocks = totalBlocks - activeBlocks;
    return (
      <div className="flex font-mono text-lg tracking-wide select-none leading-none my-2 font-bold">
        <span style={{ color: activeColor }}>{"█".repeat(activeBlocks)}</span>
        <span className="text-[#1a2d4a]">{"░".repeat(inactiveBlocks)}</span>
      </div>
    );
  };


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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === t.id
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
            className="rounded-xl border p-6 flex flex-col h-[600px]"
            style={{
              background: MIDNIGHT.surface,
              borderColor: MIDNIGHT.border,
            }}
          >
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
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
                          background: "linear-gradient(90deg, #2563eb, #b4c5ff)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Match Breakdown Accordion ───────────────────── */}
              {matchBreakdown && (
                <div className="mt-5 pt-4 border-t border-[#1a2d4a]/50">
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="w-full flex items-center justify-between text-xs text-[#b4c5ff] hover:text-white transition-colors py-2 px-2 hover:bg-[#16223b]/50 rounded-lg cursor-pointer"
                  >
                    <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={14} />
                      {showBreakdown
                        ? "Hide Detailed Breakdown"
                        : "View Match Breakdown & Potential"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${showBreakdown ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {showBreakdown && (
                    <div className="mt-3.5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      {/* Strengths */}
                      {matchBreakdown.strengths &&
                        matchBreakdown.strengths.length > 0 && (
                          <div>
                            <span className="text-[10px] text-[#8d90a0] font-semibold uppercase tracking-wider block mb-1.5">
                              Strengths
                            </span>
                            <div className="space-y-1.5">
                              {matchBreakdown.strengths.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-[#c3c6d7] leading-relaxed"
                                >
                                  <Check
                                    size={12}
                                    className="text-emerald-400 mt-0.5 flex-shrink-0"
                                  />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Weaknesses */}
                      {matchBreakdown.weaknesses &&
                        matchBreakdown.weaknesses.length > 0 && (
                          <div>
                            <span className="text-[10px] text-[#8d90a0] font-semibold uppercase tracking-wider block mb-1.5">
                              Weaknesses
                            </span>
                            <div className="space-y-1.5">
                              {matchBreakdown.weaknesses.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-[#c3c6d7] leading-relaxed"
                                >
                                  <X
                                    size={12}
                                    className="text-rose-400 mt-0.5 flex-shrink-0"
                                  />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Improvements */}
                      {matchBreakdown.improvements &&
                        matchBreakdown.improvements.length > 0 && (
                          <div>
                            <span className="text-[10px] text-[#8d90a0] font-semibold uppercase tracking-wider block mb-1.5">
                              Estimated Improvements
                            </span>
                            <div className="space-y-2">
                              {matchBreakdown.improvements.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-[#c3c6d7] leading-relaxed"
                                >
                                  <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    +{item.scoreBoost}%
                                  </span>
                                  <span>{item.action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Potential Score */}
                      <div className="flex items-center justify-between p-3 rounded-lg border border-blue-500/20 bg-blue-500/10">
                        <div>
                          <span className="text-xs text-[#b4c5ff] font-semibold uppercase tracking-wider block">
                            Potential Score
                          </span>
                          <span className="text-[10px] text-[#8d90a0]">
                            If all improvements are implemented
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">
                          {Math.round((matchBreakdown.potentialScore || 0) * 100)}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Technical Domain Coverage ───────────────────────────── */}
          <div
            className="rounded-xl border p-6 flex flex-col h-[600px]"
            style={{
              background: MIDNIGHT.surface,
              borderColor: MIDNIGHT.border,
            }}
          >
            <div className="flex items-center justify-between mb-5 flex-none">
              <h2 className="text-base font-semibold text-white">
                Technical Domain Coverage
              </h2>
              <span
                className="text-xs text-[#8d90a0]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Radar Synthesis
              </span>
            </div>

            <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {skillsAnalysis.map((s, idx) => {
                const percentage = Math.round(s.score * 100);
                const rating = getRating(s.score);
                const strengthsList = s.strengths || [];
                const gapsList = s.gaps || [];

                return (
                  <div key={s.label}>
                    {idx > 0 && (
                      <div className="my-5 border-t border-[#1a2d4a]/50" />
                    )}
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-[#f1f5f9]">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#b4c5ff] font-mono">{percentage}%</span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: `${rating.color}15`,
                            color: rating.color,
                            border: `1px solid ${rating.color}25`
                          }}
                        >
                          {rating.text}
                        </span>
                      </div>
                    </div>

                    {renderBlockProgressBar(s.score, rating.color)}

                    {/* Strengths */}
                    {strengthsList.length > 0 && (
                      <div className="mt-2.5">
                        <span className="text-[10px] text-[#8d90a0] font-semibold uppercase tracking-wider block mb-1">
                          Strengths
                        </span>
                        <ul className="space-y-1">
                          {strengthsList.map((str, i) => (
                            <li key={i} className="text-xs text-[#c3c6d7] flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Top Missing Gaps */}
                    {gapsList.length > 0 && (
                      <div className="mt-2.5">
                        <span className="text-[10px] text-[#f87171] font-semibold uppercase tracking-wider block mb-1">
                          Top Missing
                        </span>
                        <ul className="space-y-1">
                          {gapsList.map((gap, i) => (
                            <li key={i} className="text-xs text-[#c3c6d7] flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
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
              Required Skills Analysis
            </h2>

            {missingKeywords.length > 0 ? (
              <div className="space-y-2">
                {missingKeywords.map((kw, idx) => (
                  <div
                    className="border-b last:border-b-0 rounded-lg overflow-hidden bg-[#111c32]/20 border-[#1a2d4a]/50"
                    key={idx}
                  >
                    <button
                      onClick={() =>
                        setExpandedKeyword(
                          expandedKeyword === kw.keyword ? null : kw.keyword,
                        )
                      }
                      className="w-full flex items-center justify-between py-3 px-3 hover:bg-[#16223b] transition-all text-left cursor-pointer group"
                    >
                      <span className="text-sm font-medium text-[#c3c6d7] group-hover:text-white transition-colors">
                        {kw.keyword}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${kw.status === "Strong"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : kw.status === "Demonstrated"
                                ? "bg-blue-500/10 text-blue-400"
                                : kw.status === "Mentioned"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-rose-500/10 text-rose-400"
                            }`}
                        >
                          {kw.status === "Missing" ? "Missing" : kw.status}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${kw.impact === "HIGH"
                              ? "bg-[#7f1d1d] text-[#f87171]"
                              : kw.impact === "MEDIUM"
                                ? "bg-[#78350f]/70 text-[#f59e0b]"
                                : "bg-[#0f1829] text-[#4a6080]"
                            }`}
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {kw.impact} Impact
                        </span>
                        <ChevronDown
                          size={14}
                          className={`text-slate-400 transition-transform duration-200 ${expandedKeyword === kw.keyword ? "rotate-180" : ""
                            }`}
                        />
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {expandedKeyword === kw.keyword && (
                      <div className="px-4 pb-4 pt-2.5 bg-[#0b1221]/40 border-t border-[#1a2d4a]/50 space-y-3.5 animate-in slide-in-from-top-2 duration-200">
                        {/* Rating stars + Confidence */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#8d90a0]">Status:</span>
                            <div className="flex text-[#ffb95f]">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const rating =
                                  kw.status === "Strong"
                                    ? 5
                                    : kw.status === "Demonstrated"
                                      ? 4
                                      : kw.status === "Mentioned"
                                        ? 2
                                        : 0;
                                return (
                                  <Star
                                    key={i}
                                    size={12}
                                    fill={i < rating ? "#ffb95f" : "none"}
                                    className={
                                      i < rating
                                        ? "text-[#ffb95f]"
                                        : "text-slate-600"
                                    }
                                  />
                                );
                              })}
                            </div>
                            <span className="font-semibold text-white">
                              {kw.status === "Strong"
                                ? "Strongly Demonstrated"
                                : kw.status === "Demonstrated"
                                  ? "Demonstrated in Projects"
                                  : kw.status === "Mentioned"
                                    ? "Mentioned in Skills"
                                    : "Not mentioned"}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#b4c5ff] bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                            Confidence: {kw.confidence}%
                          </span>
                        </div>

                        {/* Evidence */}
                        <div>
                          <span className="text-[10px] text-[#8d90a0] font-semibold uppercase tracking-wider block mb-1">
                            Evidence
                          </span>
                          {kw.evidence.length > 0 ? (
                            <div className="space-y-1">
                              {kw.evidence.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-1.5 text-xs text-[#c3c6d7]"
                                >
                                  <Check
                                    size={12}
                                    className="text-[#10b981] flex-shrink-0"
                                  />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 italic">
                              No evidence in resume
                            </span>
                          )}
                        </div>

                        {/* Project Usage */}
                        <div>
                          <span className="text-[10px] text-[#8d90a0] font-semibold uppercase tracking-wider block mb-1">
                            Project Usage
                          </span>
                          {kw.projectUsage &&
                            kw.projectUsage.length > 0 &&
                            !kw.projectUsage.includes("None") ? (
                            <div className="space-y-1">
                              {kw.projectUsage.map((proj, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-1.5 text-xs text-[#c3c6d7]"
                                >
                                  <Check
                                    size={12}
                                    className="text-[#10b981] flex-shrink-0"
                                  />
                                  <span>{proj}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-rose-400">
                              <X
                                size={12}
                                className="text-rose-400 flex-shrink-0"
                              />
                              <span>None</span>
                            </div>
                          )}
                        </div>

                        {/* Recommendation */}
                        <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg text-xs">
                          <span className="text-[#b4c5ff] font-semibold block mb-1 uppercase tracking-wider">
                            Recommendation
                          </span>
                          <p className="text-[#c3c6d7] leading-relaxed">
                            {kw.recommendation}
                          </p>
                        </div>
                      </div>
                    )}
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
                  const iconBgs = ["#00a572/20", "#2563eb/20", "#996100/30"];
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
                background:
                  "radial-gradient(circle, #2563eb18 0%, transparent 70%)",
              }}
            />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "#2563eb20",
                  border: "1px solid #2563eb40",
                }}
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText size={16} className="text-[#b4c5ff]" />
                Generated Cover Letter
              </h2>
              <button
                onClick={() => handleDownload(editedCoverLetter || "")}
                disabled={!editedCoverLetter}
                className="flex items-center gap-1.5 text-xs text-[#b4c5ff] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Download size={13} />
                Export PDF
              </button>
            </div>
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
