"use client";
import { FileText, Upload } from "lucide-react";
import { extractTextFromPdf } from "./extractpdf";
import { handleAnalyze } from "./handle-analyze";
import { useAuth } from "@/context/authcontext";
import { AnalysisResult } from "@/types/analysis";

interface ChatThreadProps {
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setResumeText: React.Dispatch<React.SetStateAction<string>>;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
  fileName: string;
  jobDescription: string;
  generateCoverLetter: boolean;
  setGenerateCoverLetter: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  setAnalysis: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  fetchHistory: () => Promise<void>;
}

export const CreateNewThread = ({
  setFileName,
  setResumeText,
  setJobDescription,
  fileName,
  jobDescription,
  text,
  setAnalysis,
  setLoading,
  setGenerateCoverLetter,
  loading,
  fetchHistory,
}: ChatThreadProps) => {
  const { userid } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    const extractedText = await extractTextFromPdf(file);
    setResumeText(String(extractedText));
    console.log("extracted text", extractedText);
  };

  const onAnalyzeClick = async () => {
    if (!fileName || !jobDescription || !text || !userid) return;

    setLoading(true);
    await handleAnalyze({
      fileName,
      jobDescription,
      text,
      setAnalysis,
      setLoading,
      userid,
    });
    fetchHistory();
  };

  return (
    <div className="bg-[#0f1930]/60 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
      {/* Subtle Container Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col">
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Upload Resume (PDF)</span>
          </label>
          <div className="relative flex-1 flex flex-col group/upload">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="resume-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="resume-upload"
              className={`flex flex-col items-center justify-center flex-1 min-h-[260px] rounded-2xl cursor-pointer transition-all duration-500 relative overflow-hidden ${
                fileName
                  ? "bg-gradient-to-b from-[#141f38] to-[#0f1930] border border-cyan-500/40 shadow-[0_4px_30px_-5px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30"
                  : "bg-[#091328]/40 border-2 border-dashed border-slate-700/60 hover:bg-[#0f1930]/60 hover:border-cyan-500/40 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.1)] group/upload"
              }`}
            >
              {fileName ? (
                <div className="flex flex-col items-center z-10 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <FileText className="w-8 h-8 text-cyan-400 drop-shadow-md" />
                  </div>
                  <p className="text-cyan-50 font-semibold text-lg text-center px-4 break-all">
                    {fileName}
                  </p>
                  <div className="flex items-center space-x-2 mt-3 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span className="text-cyan-300 text-sm font-medium">
                      Ready for analysis
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center z-10 text-slate-400 group-hover/upload:text-cyan-100 transition-colors duration-500">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-5 group-hover/upload:bg-cyan-500/10 group-hover/upload:scale-110 transition-all duration-500 border border-transparent group-hover/upload:border-cyan-500/30 group-hover/upload:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <Upload className="w-8 h-8 text-slate-500 group-hover/upload:text-cyan-400 transition-colors duration-500" />
                  </div>
                  <h3 className="font-semibold text-lg tracking-wide text-slate-300 group-hover/upload:text-white transition-colors">
                    Select or drop resume
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 font-medium">
                    PDF formats up to 5MB
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Job Description */}
        <div className="flex flex-col">
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Target Job Description</span>
          </label>
          <div className="relative flex-1 group/textarea">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 rounded-2xl blur-sm transition-all duration-500 group-focus-within/textarea:from-blue-500/20 group-focus-within/textarea:via-cyan-500/20 group-focus-within/textarea:to-blue-500/20"></div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description or requirements here..."
              className="relative w-full h-full min-h-[260px] bg-[#0f1930]/40 text-slate-100 placeholder-slate-600 p-6 rounded-2xl border border-slate-700/60 focus:border-cyan-500/50 focus:bg-[#141f38]/80 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 resize-none outline-none shadow-inner leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="relative mt-8">
        {/* Glow effect sitting behind the button */}
        {!loading && fileName && jobDescription && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-md opacity-20"></div>
        )}
        <button
          onClick={onAnalyzeClick}
          disabled={loading || !fileName || !jobDescription}
          className={`relative w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden ${
            loading
              ? "bg-[#0f1930] text-slate-400 cursor-wait border border-slate-800"
              : !fileName || !jobDescription
                ? "bg-[#0f1930]/40 text-slate-600 cursor-not-allowed border border-slate-800/50"
                : "bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-600 hover:to-cyan-600 text-slate-100 hover:text-white shadow-md hover:shadow-cyan-500/20 transform hover:-translate-y-0.5 border border-cyan-500/30"
          }`}
        >
          {/* Shimmer effect inside button */}
          {!loading && fileName && jobDescription && (
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1.5s_infinite]"></div>
          )}

          <div className="relative z-10 flex items-center justify-center space-x-3">
            {loading ? (
              <>
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 border-t-2 border-r-2 border-cyan-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-1 border-b-2 border-l-2 border-blue-400 rounded-full animate-spin direction-reverse"></div>
                </div>
                <span className="tracking-wide">
                  Analyzing Profile Match...
                </span>
              </>
            ) : (
              <>
                <Upload
                  className={`w-5 h-5 ${!fileName || !jobDescription ? "opacity-80" : ""}`}
                />
                <span className="tracking-wide">Launch Analysis</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
