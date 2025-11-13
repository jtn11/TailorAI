import { AlertCircle, CheckCircle, Copy, Download } from "lucide-react";
import { useState } from "react";

interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
  coverLetter?: string;
}

export const AnalysedResult = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [generateCoverLetter, setGenerateCoverLetter] =
    useState<boolean>(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setFileName("");
    setJobDescription("");
    setAnalysis(null);
    setGenerateCoverLetter(false);
  };

  const mockResult = {
    matchScore: 78,
    missingKeywords: [
      "Machine Learning",
      "Cloud Architecture",
      "DevOps",
      "Docker",
      "Kubernetes",
      "CI/CD Pipeline",
      "Microservices",
      "API Design",
    ],
    missingSkills: [
      "Advanced System Design",
      "Leadership and Team Management",
      "Technical Writing and Documentation",
      "Performance Optimization",
      "Security Best Practices",
    ],
    suggestions: [
      "Add specific keywords from the job posting that match your experience",
      "Highlight quantifiable achievements and metrics in your work experience",
      "Include specific projects that demonstrate your technical expertise",
      "Use the exact terminology from the job posting in your resume",
      "Add a professional summary that aligns with the job requirements",
      "Demonstrate your experience with cloud technologies and modern development practices",
      "Include examples of collaborative projects and team leadership",
    ],
    coverLetter: generateCoverLetter
      ? `Dear Hiring Manager,

I am writing to express my strong interest in the Software Engineer position at your esteemed organization. With my comprehensive background in full-stack development, cloud architecture, and leading cross-functional teams, I am confident in my ability to make significant contributions to your team.

Throughout my career, I have demonstrated expertise in building scalable applications using modern technologies including React, Node.js, and AWS. My experience includes designing and implementing microservices architectures, establishing CI/CD pipelines, and mentoring junior developers.

I would welcome the opportunity to discuss how my skills and experience can contribute to your team's success.

Best regards,
[Your Name]`
      : undefined,
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-gradient-to-r from-blue-900 to-cyan-900 border border-blue-700 rounded-2xl p-8 text-center">
        <p className="text-gray-300 text-lg mb-2">Overall Match Score</p>
        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
          {mockResult.matchScore}%
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full transition-all duration-1000"
            style={{ width: `${analysis && analysis.matchScore}%` }}
          ></div>
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span>Missing Keywords ({mockResult.missingKeywords.length})</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {mockResult.missingKeywords.map((keyword, idx) => (
            <div
              key={idx}
              className="bg-red-900 bg-opacity-30 text-red-300 px-4 py-2 rounded-full text-sm border border-red-700 flex items-center justify-between group hover:bg-opacity-50 transition cursor-pointer"
              onClick={() => handleCopy(keyword, idx)}
            >
              <span>{keyword}</span>
              <Copy className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <span>Areas to Improve</span>
        </h3>
        <ul className="space-y-3">
          {mockResult.missingSkills.map((skill, idx) => (
            <li
              key={idx}
              className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg hover:bg-opacity-50 transition"
            >
              <span className="text-yellow-400 mt-1 flex-shrink-0">•</span>
              <span className="text-gray-300">{skill}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span>Recommendations</span>
        </h3>
        <ul className="space-y-3">
          {mockResult.suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg hover:bg-opacity-50 transition group cursor-pointer"
            >
              <span className="text-green-400 font-bold mt-1 flex-shrink-0">
                {idx + 1}
              </span>
              <span className="text-gray-300 flex-1">{suggestion}</span>
              <Copy
                size={16}
                className="text-gray-500 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                onClick={() => handleCopy(suggestion, idx)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Cover Letter */}
      {mockResult.coverLetter && (
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4">Generated Cover Letter</h3>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-600 mb-4">
            <p className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
              {mockResult.coverLetter}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleCopy(mockResult.coverLetter || "", 0)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium flex items-center justify-center space-x-2"
            >
              <Copy size={18} />
              <span>{copiedIndex === 0 ? "Copied!" : "Copy to Clipboard"}</span>
            </button>
            <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition font-medium flex items-center justify-center space-x-2">
              <Download size={18} />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition"
      >
        Analyze Another Resume
      </button>
    </div>
  );
};
