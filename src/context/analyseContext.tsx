"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface AnalyseContextType {
  analysedResult: AnalysedResult | null;
  SetanalysedResult: (result: AnalysedResult | null) => void;
}

interface AnalysedResult {
  matchScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
  coverLetter?: string;
}

const AnalyseContext = createContext<AnalyseContextType | undefined>(undefined);

export const AnalyseContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [analysedResult, SetanalysedResult] = useState<AnalysedResult | null>(
    null,
  );

  const [analyseList, setAnalyseList] = useState<AnalysedResult[]>([]);

  // fetch the number of analysed threads
  //  useEffect(()=>{

  //   const analyseListDoc = async ()=>{

  //   }
  //  })

  return (
    <AnalyseContext.Provider value={{ analysedResult, SetanalysedResult }}>
      {children}
    </AnalyseContext.Provider>
  );
};

export const useAnalyse = () => {
  const context = useContext(AnalyseContext);
  if (!context) {
    throw new Error("useAnalyse must be used within a AnalyseContextProvider");
  }
  return context;
};
