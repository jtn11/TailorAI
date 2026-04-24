"use client";
import { Clock, LogOut, Plus, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/authcontext";
import { AnalysisResult } from "@/types/analysis";

interface DashboardSidebarProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setAnalysis: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
  handleReset: () => void;
  historyThreads: AnalysisResult[];
  setCurrentThreads: React.Dispatch<React.SetStateAction<AnalysisResult[]>>;
}

export const DashboardSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  setAnalysis,
  handleReset,
  historyThreads,
  setCurrentThreads,
}: DashboardSidebarProps) => {
  const { currentUser, logout, username } = useAuth();

  const handleDeleteThread = async (id: string) => {
    const token = await currentUser.getIdToken();

    setCurrentThreads((prev) => prev.filter((t) => t.id !== id));

    const deletedThread = await fetch(`/api/analyze/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(deletedThread);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // fallback for older plain text dates
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <aside
      className={`fixed md:sticky left-0 top-0 h-screen bg-[#060e20] border-r border-slate-800 transition-all duration-300 z-40 overflow-hidden shadow-2xl md:shadow-none ${sidebarOpen ? "w-72" : "w-0"}`}
    >
      <div className="h-full flex flex-col w-72">
        {/* Sidebar Header */}
        <div className="h-[88px] border-b border-slate-800/80 flex items-center justify-between px-6 bg-slate-900/20">
          <button
            className="flex items-center space-x-3 text-slate-200 transition group w-full"
            onClick={logout}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all transform group-hover:-translate-y-0.5 border border-blue-400/50">
              {username?.trim()?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-sm group-hover:text-white transition-colors">{username}</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">My Account</span>
            </div>
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Analysis Button */}
        <div className="px-5 py-6">
          <button
            onClick={handleReset}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 border border-blue-500/50"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>New Analysis</span>
          </button>
        </div>

        {/* History Threads */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-500 px-2 tracking-widest uppercase mb-1">
            Recent Analyses
          </p>
          {historyThreads?.map((thread) => (
            <div
              key={thread.id}
              onClick={() => {
                console.log(`Clicked here : ${thread.id}`);
                setAnalysis(thread);
              }}
              className="p-4 rounded-xl cursor-pointer transition-all duration-200 group bg-slate-800/30 hover:bg-slate-800/80 border border-transparent hover:border-slate-700/80 hover:shadow-lg hover:shadow-black/20"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2 pr-2 leading-snug">
                  {thread.jobDescription}
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteThread(thread.id);
                  }}
                  className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                  <Clock size={12} />
                  <span>{formatDate(thread.date)}</span>
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    Math.round(thread.matchScore * 100) >= 75
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : thread.matchScore >= 50
                        ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                        : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                  }`}
                >
                  {Math.round(thread.matchScore * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800/80 p-4 bg-slate-900/50">
          <button
            className="w-full flex items-center justify-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-800 py-3 rounded-lg transition-all font-semibold"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
