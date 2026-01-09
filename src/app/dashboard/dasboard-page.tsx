"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { AnalysedResult } from "./analysed-result";
import { CreateNewThread } from "./create-new-thread";
import { AnalysisResult } from "@/types/analysis";
import { FetchChatThread } from "./thread-functions";
import { useAuth } from "@/context/authcontext";

const AnalysisDashboard: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [generateCoverLetter, setGenerateCoverLetter] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [text, setResumeText] = useState<string>("");
  const [historyThreads, setCurrentThreads] = useState<AnalysisResult[]>([]);

  const { userid } = useAuth();

  const handleReset = () => {
    setAnalysis(null);
    setFileName("");
    setJobDescription("");
    setGenerateCoverLetter(false);
    setResumeText("");
  };

  const fetchHistory = async () => {
    if (!userid) return;
    const formattedData = await FetchChatThread(userid);
    console.log("Formatted Data inside historythreads", formattedData);
    setCurrentThreads(formattedData);
  };

  useEffect(() => {
    fetchHistory();
    console.log("Analysis in dashbaord", analysis);
  }, [userid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl"></div>

      {sidebarOpen && (
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setAnalysis={setAnalysis}
          handleReset={handleReset}
          historyThreads={historyThreads}
          setCurrentThreads={setCurrentThreads}
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
              fetchHistory={fetchHistory}
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
