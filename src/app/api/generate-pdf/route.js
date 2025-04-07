export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { generatePdfBuffer } from "@/lib/pdfGenerator"; // Import the helper
// Removed React/render imports

// Helper function to sanitize filenames
function sanitizeFilename(name) {
  if (!name) return "Report";
  // Replace spaces with underscores and remove unsafe characters
  return name.replace(/\s+/g, "_").replace(/[\\/:*?"<>|]/g, "");
}

export async function POST(request) {
  let requestBody; // Variable to hold the parsed body for logging
  try {
    // Expect analysisResults and submittedData in the body
    console.log("API Route: Attempting to parse request body...");
    requestBody = await request.json();
    console.log("API Route: Parsed request body:", requestBody); // Log the entire parsed body

    // Now destructure AFTER logging
    const { analysisResults, submittedData } = requestBody || {}; // Use default empty object if parsing failed or body is null

    if (!analysisResults || !submittedData) {
      console.error(
        "API Route: Validation failed. Missing analysisResults or submittedData.",
        {
          analysisResultsExists: !!analysisResults,
          submittedDataExists: !!submittedData,
        }
      );
      return NextResponse.json(
        { error: "Missing analysisResults or submittedData in request body" },
        { status: 400 }
      );
    }

    console.log(
      "API Route: Received data for PDF generation for:", // Updated log message
      submittedData.website || submittedData.businessName
    );

    // Call the helper function with the analysis data
    const pdfBuffer = await generatePdfBuffer(analysisResults, submittedData);

    // Sanitize the filename using submittedData
    const baseName = submittedData.businessName || submittedData.website;
    const sanitizedName = sanitizeFilename(baseName);
    const filename = `Profici_AI_Analysis_${sanitizedName}.pdf`;

    // Return PDF
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    // Ensure filename in header is also clean, though client-side download attribute usually takes precedence
    headers.set("Content-Disposition", `attachment; filename=${filename}`); // Removed quotes around filename

    return new NextResponse(pdfBuffer, { status: 200, headers });
  } catch (error) {
    console.error("Error in generate-pdf API route:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 }
    );
  }
}
