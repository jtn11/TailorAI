"use client";
import { AnalysisResult } from "@/types/analysis";
import jsPDF from "jspdf";
import { AlertCircle, CheckCircle, Copy, Download, Search, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  analysis: AnalysisResult;
  onReset: () => void;
  onSearchJobs: () => void;
}

export const AnalysedResult = ({ analysis, onReset, onSearchJobs }: Props) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editedCoverLetter, setEditedCoverLetter] = useState<string>(analysis?.coverLetter || "");

  useEffect(() => {
    if (analysis?.coverLetter) {
      setEditedCoverLetter(analysis.coverLetter);
    }
  }, [analysis?.coverLetter]);

  // Safely extract text in case the LLM returned an object (e.g. {title, description}) instead of a string
  const extractText = (item: any): string => {
    if (typeof item === "string") return item;
    if (typeof item === "object" && item !== null) {
      if (item.title && item.description) return `${item.title}: ${item.description}`;
      if (item.title) return item.title;
      if (item.description) return item.description;
      return JSON.stringify(item);
    }
    return String(item);
  };

  console.log("Data fetched ", analysis);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (text: string) => {
    if (!text) return;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 15, 20);
    doc.save("cover-letter.pdf");
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-gradient-to-r from-blue-900 to-cyan-900 border border-blue-700 rounded-2xl p-8 text-center">
        <p className="text-gray-300 text-lg mb-2">Overall Match Score</p>
        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
          {analysis && Math.round(analysis.matchScore * 100)}%
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full transition-all duration-1000"
            style={{ width: `${analysis && analysis.matchScore * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span>Missing Keywords</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {analysis?.missingKeywords?.map((keyword, idx) => {
            const text = extractText(keyword);
            return (
            <div
              key={idx}
              className="bg-red-900 bg-opacity-30 text-red-300 px-4 py-2 rounded-full text-sm border border-red-700 flex items-center justify-between group hover:bg-opacity-50 transition cursor-pointer"
              onClick={() => handleCopy(text, idx)}
            >
              <span>{text}</span>
              <Copy className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition" />
            </div>
          )})}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <span>Areas to Improve</span>
        </h3>
        <ul className="space-y-3">
          {analysis?.missingSkills?.map((skill, idx) => {
            const text = extractText(skill);
            return (
              <li
                key={idx}
                className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg hover:bg-opacity-50 transition"
              >
                <span className="text-yellow-400 mt-1 flex-shrink-0">•</span>
                <span className="text-gray-300">{text}</span>
              </li>
            )})}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span>Recommendations</span>
        </h3>
        <ul className="space-y-3">
          {analysis?.suggestions?.map((suggestion, idx) => {
            const text = extractText(suggestion);
            return (
              <li
                key={idx}
                className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg hover:bg-opacity-50 transition group cursor-pointer"
              >
                <span className="text-green-400 font-bold mt-1 flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-gray-300 flex-1">{text}</span>
                <Copy
                  size={16}
                  className="text-gray-500 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                  onClick={() => handleCopy(text, idx)}
                />
              </li>
            )})}
        </ul>
      </div>

      {/* Cover Letter */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur border border-slate-700 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-4">Generated Cover Letter</h3>
        <div className="bg-slate-900 p-1 rounded-lg border border-slate-600 mb-4 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <textarea
            className="w-full bg-transparent text-gray-300 text-sm leading-relaxed p-5 outline-none resize-y min-h-[300px]"
            value={editedCoverLetter}
            onChange={(e) => setEditedCoverLetter(e.target.value)}
            placeholder="No cover letter generated yet."
            disabled={!analysis?.coverLetter}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleCopy(editedCoverLetter || "", 0)}
            disabled={!editedCoverLetter}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy size={18} />
            <span>{copiedIndex === 0 ? "Copied!" : "Copy to Clipboard"}</span>
          </button>
          <button
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleDownload(editedCoverLetter || "")}
            disabled={!editedCoverLetter}
          >
            <Download size={18} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Job Search Section */}
      <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-700/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>

        <div className="flex items-start md:items-center space-x-4 relative z-10">
          <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-500/30 flex-shrink-0">
            <Briefcase className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-white mb-2">Find Relevant Jobs</h3>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Ready to apply? Let us scan the web for active job openings that perfectly match your updated profile and resume.
            </p>
          </div>
        </div>
        <button 
          onClick={onSearchJobs}
          className="w-full md:w-auto relative z-10 whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-3 shadow-lg shadow-blue-900/40 border border-blue-400/50 transform hover:-translate-y-0.5"
        >
          <Search size={20} />
          <span>Search Jobs on Web</span>
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition"
      >
        Analyze Another Resume
      </button>
    </div>
  );
};
