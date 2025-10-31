import { db } from "../firebase/firebase";
import { AuthRequest } from "../middleware/authmiddleware";
import { Response } from "express";

export const analyseDocument = async (req: AuthRequest, res: Response) => {
  const { userId, resume, jobDescription, score, feedback } = req.body;
  try {
    await db.collection("analyses").add({
      userId,
      resume,
      jobDescription,
      score,
      feedback,
      createdAt: new Date(),
    });
    res.status(200).json({ message: "Analysis saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Problem in saving" });
  }
};
