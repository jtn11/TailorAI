import { Response } from "express";
import * as pdfjsLib from "pdfjs-dist";
import fs from "fs";
import path from "path";
import { MulterRequest } from "../types/MulterRequest";

export const extractFromPdf = async (req: MulterRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfPath = path.join(__dirname, "../../uploads", file.filename);
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + " ";
    }
    res.status(200).json({ text: text.trim() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
