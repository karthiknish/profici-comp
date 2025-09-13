import React from "react";
import { renderToBuffer, Font } from "@react-pdf/renderer"; // Import Font
import PdfDocument from "@/components/pdf/PdfDocument"; // Import the new document component

// --- Emoji support ---
// PDF does not support color emoji fonts. Use emoji images via a CDN instead.
// See: https://react-pdf.org/fonts#registeremojisource
try {
  Font.registerEmojiSource({
    format: "png",
    url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
  });
  console.log("Registered emoji source (Twemoji CDN) for PDF rendering.");
} catch (error) {
  console.error("Error registering emoji source:", error);
}
// --- End Emoji support ---

// Function to generate PDF buffer using @react-pdf/renderer
export async function generatePdfBuffer(analysisResults, submittedData) {
  try {
    console.log("Generating PDF buffer using @react-pdf/renderer...");

    // No need to parse Markdown anymore, pass raw JSON results
    console.log("Passing raw analysis results to PdfDocument.");

    // Create the React element for the PDF document, passing raw analysis results
    const docElement = React.createElement(PdfDocument, {
      analysisResults: analysisResults, // Pass the original JSON object
      submittedData,
    });

    // Render the document to a buffer
    const pdfBuffer = await renderToBuffer(docElement);

    console.log("PDF buffer generated successfully with @react-pdf/renderer.");
    return pdfBuffer;
  } catch (error) {
    console.error(
      "Error generating PDF buffer with @react-pdf/renderer:",
      error
    );
    throw new Error(`Failed to generate PDF buffer: ${error.message}`);
  }
  // No browser instance to close
}
