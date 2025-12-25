import { AnalysisResult } from "@/types/analysis";

interface AnalyzedProps {
  fileName: string;
  jobDescription: string;
  text: string;
  setAnalysis: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userid: string;
}

export async function handleAnalyze({
  fileName,
  jobDescription,
  text,
  setAnalysis,
  setLoading,
  userid,
}: AnalyzedProps) {
  if (!fileName || !jobDescription.trim()) {
    alert("Please upload a resume and enter a job description");
    return;
  }
  if (!userid) {
    return alert("Please login to continue");
  }
  console.log("user id ", userid);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        userId: userid,
        jobDescription: jobDescription,
      }),
    });

    const data = await response.json();
    console.log("Data is this : ", data);
    setAnalysis(data.data);
    //SetanalysedResult(data.data);
    setLoading(false);
    console.log("Response generated successfully", data);
  } catch (error) {
    console.log("fetch error", error);
  }
}
