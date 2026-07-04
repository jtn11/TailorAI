export interface KeywordAnalysis {
  keyword: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  status: "Strongly Demonstrated" | "Mentioned only" | "Not mentioned";
  evidence: string[];
  projectUsage?: string[] | null;
  confidence: number;
  recommendation: string;
}

export interface AnalysisResult {
  id: string;
  matchScore: number;
  experienceScore?: number;
  skillsScore?: number;
  educationScore?: number;
  skillsAnalysis?: {
    label: string;
    score: number;
  }[];
  missingKeywords: KeywordAnalysis[];
  missingSkills: string[];
  suggestions: string[];
  coverLetter?: string;
  jobDescription?: string;
  date?: string;
  username?: string;
}
