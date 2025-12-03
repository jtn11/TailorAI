"use client";
import { Clock, LogOut, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAnalyse } from "../../context/analyseContext";
import { useAuth } from "@/context/authcontext";

interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
  coverLetter?: string;
  jobDescription: string;
  date: string;
}

interface DashboardSidebar {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export const DashboardSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: DashboardSidebar) => {
  const [historyThreads, setCurrentThreads] = useState<AnalysisResult[] | null>(
    null,
  );

  const { analysedResult, SetanalysedResult } = useAnalyse();
  const { userid } = useAuth();

  console.log("AnalysedResult using context", analysedResult);

  const handleReset = () => {};

  const fetchHistory = async () => {
    const res = await fetch(`/api/history/${userid}`, {
      method: "GET",
    });

    const data = await res.json();
    const formatted = data.history.map((item: any) => ({
      id: item.id,
      jobDescription: item.data.jobDescription,
      matchScore: item.data.matchScore,
      date: item.data.date,
    }));

    setCurrentThreads(formatted);
    console.log("Fetched history:", data);
  };

  useEffect(() => {
    const res = fetchHistory();
    console.log(" History here is this one ", res);
  }, []);

  // const handleLoadThread = (thread: HistoryThread) => {
  //   setCurrentThreadId(thread.id);
  // };

  // const handleDeleteThread = (id: number) => {
  //   setHistoryThreads(historyThreads.filter((t) => t.id !== id));
  // };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-700 transition-all duration-300 z-40 overflow-hidden ${sidebarOpen ? "w-72" : "w-0"}`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="h-20 border-b border-slate-700 flex items-center justify-between px-6">
          <h3 className="text-lg font-bold">History</h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Analysis Button */}
        <div className="px-4 py-4 border-b border-slate-700">
          <button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition flex items-center justify-center space-x-2"
          >
            <Plus size={18} />
            <span>New Analysis</span>
          </button>
        </div>

        {/* History Threads */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 px-2 mb-3">
            RECENT ANALYSES
          </p>
          {historyThreads?.map((thread) => (
            <div
              onClick={() => console.log("clicked")}
              className={`p-3 rounded-lg cursor-pointer transition group ${
                thread === thread
                  ? "bg-blue-600 bg-opacity-30 border border-blue-500"
                  : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-white truncate flex-1 pr-2">
                  {thread.jobDescription}
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleDeleteThread(thread.id);
                  }}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{thread.date}</span>
                </span>
                <span
                  className={`text-xs font-bold ${
                    thread.matchScore >= 75
                      ? "text-green-400"
                      : thread.matchScore >= 50
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {thread.matchScore}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-700 p-4">
          <button className="w-full flex items-center space-x-2 text-red-400 hover:text-red-300 transition font-medium">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
