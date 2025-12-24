import { FileText, Upload } from "lucide-react";
import { extractTextFromPdf } from "./extractpdf";
import { handleAnalyze } from "./handle-analyze";
import { useAuth } from "@/context/authcontext";

interface AnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
  coverLetter?: string;
}

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
}

export const CreateNewThread = ({
  setFileName,
  setResumeText,
  setJobDescription,
  fileName,
  jobDescription,
  text,
  generateCoverLetter,
  setAnalysis,
  setLoading,
  setGenerateCoverLetter,
  loading,
}: ChatThreadProps) => {
  const { userid } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // <-- get the uploaded file

    if (!file) return;

    setFileName(file.name);

    const extractedText = await extractTextFromPdf(file);
    setResumeText(String(extractedText));
    console.log("extracted text", extractedText);
  };

  const onAnalyzeClick = () => {
    if (!fileName || !jobDescription || !text || !userid) return;

    setLoading(true);
    handleAnalyze({
      fileName,
      jobDescription,
      text,
      setAnalysis,
      setLoading,
      userid,
    });
  };

  return (
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
                  <p className="text-green-400 font-semibold">{fileName}</p>
                  <p className="text-gray-400 text-sm mt-1">✓ File selected</p>
                </>
              ) : (
                <>
                  <p className="text-gray-400 font-medium">
                    Click to upload PDF
                  </p>
                  <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
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
        onClick={onAnalyzeClick}
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
  );
};
