export interface AnalysisResult {
  id: string;
  matchScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
  coverLetter?: string;
  jobDescription?: string;
  date?: string;
}
