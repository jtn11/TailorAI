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
    <div className="h-screen bg-[#0b1221] text-slate-100 flex relative overflow-hidden font-sans">
      {/* Ambient Animated Glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-700/8 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-800/8 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"
        style={{ animationDelay: "2s" }}
      ></div>
      <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[150px] mix-blend-screen"></div>

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
        <div className="z-50 bg-[#0b1221]/95 backdrop-blur-md border-b border-[#1a2d4a] flex-none">
          <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        </div>

        <div className="flex-1 overflow-y-auto w-full pb-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both flex-1 flex flex-col">
            {!analysis ? (
              <div className="max-w-7xl mx-auto px-6 py-10 w-full flex flex-col">
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
              </div>
            ) : showJobs ? (
              <div className="max-w-7xl mx-auto px-6 py-10 w-full animate-in zoom-in-95 duration-500">
                <JobSearchResults
                  onBack={() => setShowJobs(false)}
                  initialQuery={analysis?.jobDescription ? `${analysis.jobDescription.substring(0, 40)}...` : ""}
                />
              </div>
            ) : (
              <div className="w-full px-6 py-8 animate-in zoom-in-95 duration-500">
                <AnalysedResult analysis={analysis} onReset={handleReset} onSearchJobs={() => setShowJobs(true)} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisDashboard;
