"use client";
import React, { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Plus,
  FileText,
  BarChart3,
  Settings,
  Home,
  Zap,
  Upload,
  Trash2,
  Eye,
  ChevronRight,
} from "lucide-react";

interface Resume {
  id: number;
  jobTitle: string;
  matchScore: number;
  date: string;
  status: "good" | "average" | "poor";
}

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "resumes" | "analyze"
  >("overview");
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: 1,
      jobTitle: "Senior React Developer",
      matchScore: 85,
      date: "2024-10-15",
      status: "good",
    },
    {
      id: 2,
      jobTitle: "Full Stack Engineer",
      matchScore: 72,
      date: "2024-10-14",
      status: "average",
    },
    {
      id: 3,
      jobTitle: "Frontend Engineer",
      matchScore: 58,
      date: "2024-10-13",
      status: "poor",
    },
  ]);

  const deleteResume = (id: number) => {
    setResumes(resumes.filter((r) => r.id !== id));
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-green-900 bg-opacity-30";
    if (score >= 50) return "bg-yellow-900 bg-opacity-30";
    return "bg-red-900 bg-opacity-30";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-900 bg-opacity-40 text-green-300 border-green-700";
      case "average":
        return "bg-yellow-900 bg-opacity-40 text-yellow-300 border-yellow-700";
      case "poor":
        return "bg-red-900 bg-opacity-40 text-red-300 border-red-700";
      default:
        return "bg-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-700 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} z-40`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-slate-700">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                TailorAI
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === "overview" ? "bg-blue-600 bg-opacity-30 border border-blue-500" : "text-gray-400 hover:text-white"}`}
          >
            <Home size={20} />
            {sidebarOpen && <span>Overview</span>}
          </button>
          <button
            onClick={() => setActiveTab("analyze")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === "analyze" ? "bg-blue-600 bg-opacity-30 border border-blue-500" : "text-gray-400 hover:text-white"}`}
          >
            <Upload size={20} />
            {sidebarOpen && <span>New Analysis</span>}
          </button>
          <button
            onClick={() => setActiveTab("resumes")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === "resumes" ? "bg-blue-600 bg-opacity-30 border border-blue-500" : "text-gray-400 hover:text-white"}`}
          >
            <FileText size={20} />
            {sidebarOpen && <span>My Analyses</span>}
          </button>
        </nav>

        {/* Settings & Logout */}
        <div className="border-t border-slate-700 px-4 py-4 space-y-3">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg transition">
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 rounded-lg transition">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Top Bar */}
        <div className="h-20 bg-slate-800 bg-opacity-50 backdrop-blur border-b border-slate-700 flex items-center justify-between px-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">JD</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">
                      Total Analyses
                    </h3>
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-4xl font-bold">12</p>
                  <p className="text-gray-500 text-sm mt-2">This month</p>
                </div>

                <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">
                      Average Match Score
                    </h3>
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <p className="text-4xl font-bold">
                    71<span className="text-2xl">%</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Up from last month
                  </p>
                </div>

                <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-medium">
                      Best Score
                    </h3>
                    <FileText className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-4xl font-bold">
                    85<span className="text-2xl">%</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Senior React Developer
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Recent Analyses</h2>
                  <button className="text-blue-400 hover:text-blue-300 transition flex items-center space-x-1">
                    <span>View All</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  {resumes.slice(0, 3).map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-4 bg-slate-900 bg-opacity-50 rounded-lg border border-slate-700 hover:border-slate-600 transition"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{resume.jobTitle}</p>
                        <p className="text-sm text-gray-500">{resume.date}</p>
                      </div>
                      <div
                        className={`text-2xl font-bold ${getScoreColor(resume.matchScore)}`}
                      >
                        {resume.matchScore}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action */}
              <button
                onClick={() => setActiveTab("analyze")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition flex items-center justify-center space-x-2"
              >
                <Plus size={20} />
                <span>Start New Analysis</span>
              </button>
            </div>
          )}

          {/* Analyze Tab */}
          {activeTab === "analyze" && (
            <div className="max-w-4xl">
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Analyze Your Resume</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Upload Resume (PDF)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center justify-center h-64 bg-slate-900 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition"
                      >
                        <FileText className="w-12 h-12 text-gray-500 mb-2" />
                        <p className="text-gray-400 font-medium">
                          Click to upload PDF
                        </p>
                        <p className="text-gray-500 text-sm">
                          or drag and drop
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Job Posting Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Job Posting
                    </label>
                    <textarea
                      placeholder="Paste the job posting here..."
                      className="w-full h-64 bg-slate-900 text-white placeholder-gray-500 p-4 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span>Generate cover letter</span>
                  </label>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition">
                  Analyze Resume
                </button>
              </div>
            </div>
          )}

          {/* My Analyses Tab */}
          {activeTab === "resumes" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Analyses</h2>
                <button
                  onClick={() => setActiveTab("analyze")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                >
                  <Plus size={18} />
                  <span>New Analysis</span>
                </button>
              </div>

              {resumes.length > 0 ? (
                <div className="grid gap-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold">
                              {resume.jobTitle}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(resume.status)}`}
                            >
                              {resume.status === "good"
                                ? "✓ Good Match"
                                : resume.status === "average"
                                  ? "○ Average"
                                  : "✗ Needs Work"}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm">{resume.date}</p>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className={`text-center`}>
                            <p
                              className={`text-3xl font-bold ${getScoreColor(resume.matchScore)}`}
                            >
                              {resume.matchScore}%
                            </p>
                            <p className="text-gray-500 text-xs">Match Score</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="p-2 bg-slate-900 hover:bg-slate-700 rounded-lg transition text-blue-400 hover:text-blue-300">
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => deleteResume(resume.id)}
                              className="p-2 bg-slate-900 hover:bg-slate-700 rounded-lg transition text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-lg">
                  <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No analyses yet</p>
                  <button
                    onClick={() => setActiveTab("analyze")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Start Your First Analysis
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
