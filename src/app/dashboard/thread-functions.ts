import { it } from "node:test";

export const FetchChatThread = async (userid: string) => {
  try {
    const res = await fetch(`/api/history/${userid}`);
    const data = await res.json();

    const formatData = data.history.map((items: any) => ({
      id: items.id,
      jobDescription: items.data.jobDescription,
      matchScore: items.data.matchScore,
      date: items.data.date,
      coverLetter: items.coverLetter,
      missingSkills: items.data.missingSkills,
      missingKeywords: items.data.missingKeywords,
    }));
    return formatData;
  } catch (error) {
    return { Error: error };
  }
};
