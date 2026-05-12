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
  missingKeywords: { keyword: string; impact: "HIGH" | "MEDIUM" | "LOW" }[];
  missingSkills: string[];
  suggestions: string[];
  coverLetter?: string;
  jobDescription?: string;
  date?: string;
  username?: string;
}
