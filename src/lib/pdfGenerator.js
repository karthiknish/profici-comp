import React from "react";
import { renderToBuffer, Font } from "@react-pdf/renderer"; // Import Font
import path from "path"; // Import path for resolving file path
// Removed marked import
import PdfDocument from "@/components/pdf/PdfDocument"; // Import the new document component

// Removed marked configuration

// --- Register Fonts ---
// Construct the absolute path to the font file
// process.cwd() gives the root directory where the Node.js process was started
const fontPath = path.join(
  process.cwd(),
  "public",
  "fonts",
  "NotoColorEmoji-Regular.ttf"
);

// Register the font
// It's important this happens *before* any rendering attempts.
// Use a specific family name we can reference in styles.
try {
  Font.register({
    family: "Noto Color Emoji",
    src: fontPath,
  });
  console.log("Registered Noto Color Emoji font from:", fontPath);
} catch (error) {
  console.error("Error registering Noto Color Emoji font:", error);
  // PDF generation might still work but icons won't render correctly.
}
// --- End Font Registration ---

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
