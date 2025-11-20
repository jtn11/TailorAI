"use client";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    text +=
      content.items.map((item) => (item as TextItem).str).join(" ") + "\n";
  }

  return text.trim();
}
