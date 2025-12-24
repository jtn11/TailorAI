"use client";
import React, { useState } from "react";
import { DashboardSidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { AnalysedResult } from "./analysed-result";
import { useAnalyse } from "../../context/analyseContext";
import { CreateNewThread } from "./create-new-thread";

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
  const [text, setResumeText] = useState<string>("");

  const handleReset = () => {
    setAnalysis(null);
    setFileName("");
    setJobDescription("");
    setGenerateCoverLetter(false);
    setResumeText("");
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
            <CreateNewThread
              setFileName={setFileName}
              setResumeText={setResumeText}
              setJobDescription={setJobDescription}
              fileName={fileName}
              jobDescription={jobDescription}
              generateCoverLetter={generateCoverLetter}
              setGenerateCoverLetter={setGenerateCoverLetter}
              text={text}
              setAnalysis={setAnalysis}
              setLoading={setLoading}
              loading={loading}
            />
          ) : (
            <AnalysedResult
              analysis={analysis}
              generateCoverLetter={generateCoverLetter}
              onReset={handleReset}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalysisDashboard;
