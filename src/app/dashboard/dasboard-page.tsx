"use client";
import React, { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { DashboardSidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { AnalysedResult } from "./analysed-result";

interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
  coverLetter?: string;
}

const AnalysisDashboard: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [generateCoverLetter, setGenerateCoverLetter] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleAnalyze = async () => {
    if (!fileName || !jobDescription.trim()) {
      alert("Please upload a resume and enter a job description");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult: AnalysisResult = {
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

    setAnalysis(mockResult);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl"></div>

      {sidebarOpen && (
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}
      {/* Main Content */}
      <main className="flex-1 transition-all duration-300">
        <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Resume Analyzer</h2>
            <p className="text-gray-400 text-lg">
              Upload your resume and job description to get instant analysis
            </p>
          </div>

          {!analysis ? (
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Upload Resume (PDF)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id="resume-upload"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="resume-upload"
                      className={`flex flex-col items-center justify-center h-56 border-2 border-dashed rounded-xl cursor-pointer transition ${
                        fileName
                          ? "border-green-500 bg-green-900 bg-opacity-10"
                          : "border-slate-600 bg-slate-900 hover:border-blue-500"
                      }`}
                    >
                      <FileText
                        className={`w-12 h-12 mb-3 ${fileName ? "text-green-400" : "text-gray-500"}`}
                      />
                      {fileName ? (
                        <>
                          <p className="text-green-400 font-semibold">
                            {fileName}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            ✓ File selected
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-400 font-medium">
                            Click to upload PDF
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            or drag and drop
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-56 bg-slate-900 text-white placeholder-gray-500 p-4 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none transition resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-8">
                <label className="flex items-center space-x-3 text-gray-300 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={generateCoverLetter}
                    onChange={(e) => setGenerateCoverLetter(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="group-hover:text-white transition">
                    Generate cover letter
                  </span>
                </label>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center space-x-2 ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <AnalysedResult />
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalysisDashboard;
