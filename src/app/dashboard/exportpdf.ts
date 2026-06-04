import jsPDF from "jspdf";

/**
 * Helper to dynamically load the /logo.png image from the client origin
 * and convert it to a Base64 PNG. Returns an empty string on error/timeout.
 */
const getLogoBase64 = (): Promise<string> => {
  return new Promise((resolve) => {
    // If we're not in the browser, resolve immediately
    if (typeof window === "undefined") {
      resolve("");
      return;
    }

    const img = new Image();
    img.src = "/logo.png";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve("");
        }
      } catch (e) {
        resolve(""); // Fallback in case of CORS or canvas security error
      }
    };
    img.onerror = () => {
      resolve("");
    };

    // Timeout after 1.5s to not block user interaction
    setTimeout(() => resolve(""), 1500);
  });
};

/**
 * Draws a clean, modern geometric logo as a fallback if the PNG is not available.
 */
const drawFallbackLogo = (doc: jsPDF, x: number, y: number) => {
  // Primary brand blue rounded rectangle (8mm x 8mm, radius 1.5mm)
  doc.setFillColor(37, 99, 235); // #2563eb
  doc.roundedRect(x, y, 8, 8, 1.5, 1.5, "F");

  // Secondary brand cyan circle (radius 2mm) at bottom-right of the logo box
  doc.setFillColor(6, 182, 212); // #06b6d4
  doc.circle(x + 5.5, y + 5.5, 2, "F");

  // A sleek white star/spark center in the blue box
  doc.setFillColor(255, 255, 255);
  doc.circle(x + 2.5, y + 2.5, 0.8, "F");
};

/**
 * Draws the top branded header and bottom footer with page numbering on all pages.
 */
const drawBrandingAndDecorations = (
  doc: jsPDF,
  logoBase64: string,
  totalPages: number
) => {
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // ── HEADER ──
    const headerY = 11;
    
    // Logo (Image or Vector Fallback)
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", 20, headerY, 8, 8);
      } catch (e) {
        drawFallbackLogo(doc, 20, headerY);
      }
    } else {
      drawFallbackLogo(doc, 20, headerY);
    }

    // Brand Name: "TailorAI" (Bold Slate)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42); // #0f172a (Slate-900)
    doc.text("TailorAI", 30, headerY + 6);

    // Trademark/Sub-branding: "CO-PILOT"
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // #64748b (Slate-500)
    doc.text("CO-PILOT", 48, headerY + 5.5);

    // Document Type: "AI-GENERATED COVER LETTER"
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text("AI-GENERATED COVER LETTER", 190, headerY + 5.5, { align: "right" });

    // Subtle header divider line
    doc.setDrawColor(226, 232, 240); // #e2e8f0 (Slate-200)
    doc.setLineWidth(0.25);
    doc.line(20, headerY + 10, 190, headerY + 10);

    // ── FOOTER ──
    const footerY = 276;
    
    // Subtle footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(20, footerY, 190, footerY);

    // Left Footer: Branding
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // #94a3b8 (Slate-400)
    doc.text("Downloaded from TailorAI  |  tailorai.com", 20, footerY + 5.5);

    // Right Footer: Page X of Y
    doc.text(`Page ${i} of ${totalPages}`, 190, footerY + 5.5, { align: "right" });
  }
};

/**
 * Formats and downloads a cover letter PDF with premium styling.
 */
export async function exportCoverLetterPdf(text: string) {
  if (!text) return;

  // Initialize A4 PDF: 210mm x 297mm
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Get logo Base64 image
  const logoBase64 = await getLogoBase64();

  // Layout Constants
  const bodyStartX = 20;
  const bodyWidth = 170;
  const startY = 32; // Body text starts 11mm below the header line (at 21mm)
  const bottomLimit = 265; // Body text stops 11mm above the footer line (at 276mm)
  const fontSize = 10.5; // Professional letter font size
  const lineHeight = 6.2; // ~1.4x font line height
  const paragraphGap = 4.0; // Extra spacing between paragraphs

  // Configure text styles
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(51, 65, 85); // #334155 (Slate-700 - Charcoal)

  // Normalize newlines
  const normalizedText = text.replace(/\r\n/g, "\n");
  const paragraphs = normalizedText.split("\n");

  let y = startY;

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];

    // Paragraph gap for blank lines
    if (paragraph.trim() === "") {
      if (y > startY) {
        y += paragraphGap;
      }
      continue;
    }

    // Split paragraph to fit the printable body width
    const wrappedLines = doc.splitTextToSize(paragraph, bodyWidth);

    for (const wrappedLine of wrappedLines) {
      // Check page overflow
      if (y + lineHeight > bottomLimit) {
        doc.addPage();
        y = startY; // Reset to page start
      }

      // Draw line of text
      doc.text(wrappedLine, bodyStartX, y);
      y += lineHeight;
    }
  }

  // Draw headers, footers, logos, page numbers in a second pass
  const totalPages = doc.getNumberOfPages();
  drawBrandingAndDecorations(doc, logoBase64, totalPages);

  // Trigger file download
  doc.save("cover-letter.pdf");
}
