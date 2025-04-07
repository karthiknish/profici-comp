import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Keep for initialization check
import {
  getBaseUrl,
  fetchApolloDataForDomain,
  saveReportToDb,
} from "./analysisUtils.js";
import {
  preparePrompts,
  callGeminiApi,
  processApiResults,
  assembleFinalReport,
} from "./analysisService.js";

export async function POST(request) {
  try {
    // --- Initial Setup & Validation ---
    const payload = await request.json();
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

    if (!geminiApiKey || !MONGODB_DB_NAME) {
      const missingVar = !geminiApiKey ? "GEMINI_API_KEY" : "MONGODB_DB_NAME";
      console.error(`Configuration error: ${missingVar} is missing.`);
      return NextResponse.json(
        { error: `Configuration error: ${missingVar} is missing.` },
        { status: 500 }
      );
    }
    // Basic check if Gemini API key is valid format (optional but good practice)
    try {
      new GoogleGenerativeAI(geminiApiKey);
    } catch (e) {
      console.error("Invalid GEMINI_API_KEY format:", e.message);
      return NextResponse.json(
        { error: "Invalid GEMINI_API_KEY format." },
        { status: 500 }
      );
    }

    const website = payload.website || null;
    const competitors =
      payload.competitors && payload.competitors.length > 0
        ? payload.competitors
        : ["key industry player 1", "key industry player 2"];

    // --- Fetch External Data ---
    const apolloData = await fetchApolloDataForDomain(website);
    let competitorsApolloData = [];
    if (
      competitors &&
      competitors.length > 0 &&
      competitors[0] !== "key industry player 1"
    ) {
      competitorsApolloData = await Promise.all(
        competitors.map((domain) => fetchApolloDataForDomain(domain))
      );
    }

    // --- Generate Prompts ---
    const prompts = preparePrompts(payload, apolloData, competitorsApolloData);

    // --- Call AI Service ---
    const apiResults = await callGeminiApi(prompts);

    // --- Process AI Results ---
    const processedResults = processApiResults(apiResults);

    // --- Assemble Final Report ---
    const finalReport = assembleFinalReport(
      processedResults,
      payload,
      apolloData,
      payload.insitesReport // Pass insitesReport directly
    );

    // --- Check for Errors in Final Report ---
    const hasErrors =
      Object.values(finalReport).some(
        (section) =>
          typeof section === "object" && section !== null && section.error
      ) ||
      Object.values(finalReport.seoAnalysis ?? {}).some(
        (section) =>
          typeof section === "object" && section !== null && section.error
      );

    if (hasErrors) {
      console.warn("One or more analysis sections failed:", finalReport);
      // Optionally, you could modify the response or add an error flag
    }

    // --- Save Report to DB (Optional Error Handling) ---
    const reportDocument = {
      userId: payload.email,
      website: website,
      businessName: finalReport.businessName,
      industry: payload.detectedIndustry || "the provided industry",
      competitors: competitors,
      reportData: finalReport,
      createdAt: new Date(),
      insitesReportId: payload.insitesReport?.id || null,
    };
    await saveReportToDb(reportDocument); // Fire-and-forget or await as needed

    // --- Return Response ---
    console.log("Analysis process completed. Returning results.");
    // Final check for serialization issues (though less likely now)
    try {
      JSON.stringify(finalReport);
    } catch (serializationError) {
      console.error(
        "Critical error: Failed to serialize finalReport.",
        serializationError,
        finalReport // Log the problematic object
      );
      return NextResponse.json(
        {
          error: `Internal server error: Failed to format final results. ${serializationError.message}`,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(finalReport);
  } catch (error) {
    // Catch errors from initial setup, data fetching, or unexpected issues in services
    console.error("Critical error in analysis API POST handler:", error);
    let errorMessage = "Failed to process analysis request.";
    if (error instanceof Error) {
      errorMessage += ` Reason: ${error.message}`;
    } else {
      errorMessage += ` Reason: ${String(error)}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
