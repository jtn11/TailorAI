"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { AnalysedResult } from "./analysed-result";
import { CreateNewThread } from "./create-new-thread";
import { JobSearchResults } from "./job-search-results";
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
  const [showJobs, setShowJobs] = useState<boolean>(false);
  const [text, setResumeText] = useState<string>("");
  const [historyThreads, setCurrentThreads] = useState<AnalysisResult[]>([]);

  const { userid } = useAuth();

  const handleReset = () => {
    setAnalysis(null);
    setFileName("");
    setJobDescription("");
    setGenerateCoverLetter(false);
    setResumeText("");
    setShowJobs(false);
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
    <div className="h-screen bg-[#060e20] text-slate-100 flex relative overflow-hidden font-sans">
      {/* Ambient Animated Glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-10000"></div>
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-10000"
        style={{ animationDelay: "2s" }}
      ></div>
      <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 rounded-full blur-[120px] mix-blend-screen"></div>

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setAnalysis={setAnalysis}
        handleReset={handleReset}
        historyThreads={historyThreads}
        setCurrentThreads={setCurrentThreads}
        setShowJobs={setShowJobs}
      />

      {/* Main Content */}
      <main className="flex-1 transition-all duration-500 ease-in-out relative z-10 flex flex-col h-screen min-w-0">
        <div className="z-50 bg-[#060e20]/80 backdrop-blur-md border-b border-slate-800/50 flex-none">
          <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        </div>

        <div className="flex-1 overflow-y-auto w-full pb-10">
          <div className="max-w-7xl mx-auto px-6 py-10 w-full flex flex-col">
            {!showJobs && (
              <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-sky-300">
                  Resume Analyzer
                </h2>
                <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                  Upload your resume and job description to get instant, AI-driven
                  analysis of your profile match.
                </p>
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both flex-1 flex flex-col">
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
              ) : showJobs ? (
                <div className="animate-in zoom-in-95 duration-500">
                  <JobSearchResults 
                    onBack={() => setShowJobs(false)} 
                    initialQuery={analysis?.jobDescription ? `${analysis.jobDescription.substring(0, 40)}...` : ""}
                  />
                </div>
              ) : (
                <div className="animate-in zoom-in-95 duration-500">
                  <AnalysedResult analysis={analysis} onReset={handleReset} onSearchJobs={() => setShowJobs(true)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisDashboard;
