"use client";
import { AnalysisResult, KeywordAnalysis, MissingSkill } from "@/types/analysis";
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
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Info,
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

  // States for Areas to Improve filtering and interaction
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [skillImpactFilter, setSkillImpactFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<string>("ALL");
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);

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

  // Normalize missingSkills to support both legacy string[] and new MissingSkill[]
  const missingSkills: MissingSkill[] = (analysis?.missingSkills || []).map((skill: any) => {
    if (typeof skill === "string") {
      return {
        skill: skill,
        category: "General",
        gapDescription: `The skill "${skill}" is required or preferred for the role but was not explicitly found in your resume.`,
        recommendation: `Integrate "${skill}" into your skills list or mention it within your professional experience/projects descriptions to address this gap.`,
        impact: "MEDIUM" as const,
      };
    }
    return {
      skill: skill.skill || "",
      category: skill.category || "General",
      gapDescription: skill.gapDescription || "Required skill not explicitly listed in resume.",
      recommendation: skill.recommendation || "Integrate this skill into your experience or project sections.",
      impact: (skill.impact || "MEDIUM") as "HIGH" | "MEDIUM" | "LOW",
    };
  });

  const skillCategories = Array.from(
    new Set(missingSkills.map((s) => s.category))
  ).filter(Boolean);

  const filteredSkills = missingSkills.filter((s) => {
    const matchesSearch =
      s.skill.toLowerCase().includes(skillSearchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(skillSearchQuery.toLowerCase()) ||
      s.gapDescription.toLowerCase().includes(skillSearchQuery.toLowerCase());
    
    const matchesImpact = skillImpactFilter === "ALL" || s.impact === skillImpactFilter;
    const matchesCategory = skillCategoryFilter === "ALL" || s.category === skillCategoryFilter;
    
    return matchesSearch && matchesImpact && matchesCategory;
  });

  const impactPriority: Record<"HIGH" | "MEDIUM" | "LOW", number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  const sortedFilteredSkills = [...filteredSkills].sort(
    (a, b) => impactPriority[b.impact] - impactPriority[a.impact]
  );

  // Set default selected skill on load/filter change
  useEffect(() => {
    if (sortedFilteredSkills.length > 0) {
      const exists = sortedFilteredSkills.some(s => s.skill === selectedSkillName);
      if (!exists) {
        setSelectedSkillName(sortedFilteredSkills[0].skill);
      }
    } else {
      setSelectedSkillName(null);
    }
  }, [sortedFilteredSkills, selectedSkillName]);

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

          {/* ── Areas to Improve (Enhanced Master-Detail View) ───────────────────── */}
          {missingSkills.length > 0 && (
            <div
              className="rounded-xl border p-6 lg:col-span-2 flex flex-col"
              style={{
                background: MIDNIGHT.surface,
                borderColor: MIDNIGHT.border,
              }}
            >
              {/* Header with filters */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-[#1a2d4a]/50 pb-5">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-[#b4c5ff]" />
                    Areas to Improve
                  </h2>
                  <p className="text-xs text-[#8d90a0] mt-1">
                    Gaps identified in your profile compared to the job description. Prioritized by impact.
                  </p>
                </div>
                
                {/* Search and Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#8d90a0]" />
                    <input
                      type="text"
                      placeholder="Search gaps..."
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[#0b1221] border border-[#1a2d4a] text-white placeholder-[#4a6080] focus:outline-none focus:border-[#2563eb] w-[180px] transition-all"
                    />
                  </div>
                  
                  {/* Impact Filter */}
                  <select
                    value={skillImpactFilter}
                    onChange={(e) => setSkillImpactFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-[#0b1221] border border-[#1a2d4a] text-white focus:outline-none focus:border-[#2563eb] transition-all cursor-pointer"
                  >
                    <option value="ALL">All Impacts</option>
                    <option value="HIGH">High Impact</option>
                    <option value="MEDIUM">Medium Impact</option>
                    <option value="LOW">Low Impact</option>
                  </select>
                  
                  {/* Category Filter */}
                  {skillCategories.length > 0 && (
                    <select
                      value={skillCategoryFilter}
                      onChange={(e) => setSkillCategoryFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg text-xs bg-[#0b1221] border border-[#1a2d4a] text-white focus:outline-none focus:border-[#2563eb] transition-all cursor-pointer"
                    >
                      <option value="ALL">All Categories</option>
                      {skillCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              
              {sortedFilteredSkills.length > 0 ? (
                <div className="flex flex-col md:flex-row gap-5 items-stretch min-h-[400px]">
                  {/* Left Column: List of Skills */}
                  <div className="w-full md:w-5/12 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {sortedFilteredSkills.map((item, idx) => {
                      const isSelected = selectedSkillName === item.skill;
                      
                      // Style tokens depending on impact
                      let impactBg = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                      if (item.impact === "MEDIUM") {
                        impactBg = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                      } else if (item.impact === "LOW") {
                        impactBg = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                      }
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedSkillName(item.skill)}
                          className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 select-none cursor-pointer ${
                            isSelected 
                              ? "bg-[#142040]/70 border-[#2563eb] shadow-md shadow-[#2563eb10]" 
                              : "bg-[#111c32]/40 hover:bg-[#111c32]/95 border-[#1a2d4a]/60 hover:border-[#1a2d4a]/90"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-semibold text-white block truncate">
                                {item.skill}
                              </span>
                              <span className="text-[10px] text-[#8d90a0] block mt-0.5">
                                {item.category}
                              </span>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ${impactBg}`}>
                              {item.impact}
                            </span>
                          </div>
                          <p className="text-xs text-[#94a3b8] line-clamp-1 mt-2">
                            {item.gapDescription}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Right Column: Detail View of Selected Skill */}
                  <div className="w-full md:w-7/12 flex">
                    {(() => {
                      const selectedSkill = sortedFilteredSkills.find(s => s.skill === selectedSkillName);
                      if (!selectedSkill) return null;
                      
                      let impactText = "High Priority Gap";
                      let impactColor = "text-rose-400";
                      let impactBg = "bg-rose-500/10 border-rose-500/25";
                      if (selectedSkill.impact === "MEDIUM") {
                        impactText = "Medium Priority Gap";
                        impactColor = "text-amber-400";
                        impactBg = "bg-amber-500/10 border-amber-500/25";
                      } else if (selectedSkill.impact === "LOW") {
                        impactText = "Low Priority Gap";
                        impactColor = "text-blue-400";
                        impactBg = "bg-blue-500/10 border-blue-500/25";
                      }
                      
                      return (
                        <div 
                          className="w-full rounded-xl border p-5 flex flex-col bg-[#142040]/30 border-[#1a2d4a] animate-in fade-in duration-300"
                        >
                          {/* Title and Badges */}
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#1a2d4a]/50">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#b4c5ff] tracking-wider block mb-1">
                                {selectedSkill.category}
                              </span>
                              <h3 className="text-lg font-bold text-white tracking-tight">
                                {selectedSkill.skill}
                              </h3>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${impactBg} ${impactColor}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                              {impactText}
                            </div>
                          </div>
                          
                          {/* Gap Analysis */}
                          <div className="mb-4 flex-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-[#f87171] font-semibold uppercase tracking-wider mb-2">
                              <AlertTriangle size={13} />
                              Gap Analysis
                            </div>
                            <p className="text-sm text-[#c3c6d7] leading-relaxed bg-[#0b1221]/50 p-4 rounded-xl border border-[#1a2d4a]/40">
                              {selectedSkill.gapDescription}
                            </p>
                          </div>
                          
                          {/* Action Plan */}
                          <div>
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                              <Lightbulb size={13} className="text-emerald-400 animate-pulse" />
                              Action Plan to Improve
                            </div>
                            <div className="text-sm text-[#e1e2ed] leading-relaxed bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                                <Sparkles size={40} className="text-emerald-400" />
                              </div>
                              <p className="relative z-10 font-medium">
                                {selectedSkill.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-[#0b1221]/30 rounded-xl border border-dashed border-[#1a2d4a] p-6">
                  <Info size={28} className="mx-auto text-[#4a6080] mb-3" />
                  <p className="text-sm text-[#8d90a0]">
                    No gaps found matching your filters.
                  </p>
                </div>
              )}
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
