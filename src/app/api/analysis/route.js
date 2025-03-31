import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSeoPrompt } from "./prompts/seoPrompt.js";
import { getCompetitorPrompt } from "./prompts/competitorPrompt.js";
import { getMarketPotentialPrompt } from "./prompts/marketPotentialPrompt.js";
import { getMarketCapPrompt } from "./prompts/marketCapPrompt.js";
import { getRecommendationsPrompt } from "./prompts/recommendationsPrompt.js";
import { getTrendsPrompt } from "./prompts/trendsPrompt.js";
import { getSocialMediaPrompt } from "./prompts/socialMediaPrompt.js";

// Helper to safely get text from Gemini response
const getTextSafe = (result, promptName) => {
  try {
    // Check more thoroughly for expected structure
    if (
      result &&
      result.response &&
      typeof result.response.text === "function"
    ) {
      const text = result.response.text();
      if (typeof text === "string") {
        return text;
      } else {
        console.error(
          `Gemini response.text() did not return a string for ${promptName}:`,
          text
        );
        return `Error: Invalid text format received from AI for ${promptName}.`;
      }
    }
    // Log different invalid structures
    if (!result) {
      console.error(
        `Gemini result itself is null/undefined for ${promptName}.`
      );
      return `Error: No result received from AI for ${promptName}.`;
    }
    if (!result.response) {
      console.error(
        `Gemini result missing 'response' property for ${promptName}:`,
        result
      );
      return `Error: AI response structure missing 'response' for ${promptName}.`;
    }
    if (typeof result.response.text !== "function") {
      console.error(
        `Gemini result.response missing 'text' function for ${promptName}:`,
        result.response
      );
      return `Error: AI response structure missing 'text' function for ${promptName}.`;
    }
    // Fallback for unknown invalid structure
    console.error(
      `Unknown invalid Gemini result structure for ${promptName}:`,
      result
    );
    return `Error: Unknown invalid AI response structure received for ${promptName}.`;
  } catch (e) {
    console.error(
      `Error calling .text() on Gemini response for ${promptName}:`,
      e,
      result
    );
    return `Error: Could not extract text from AI response for ${promptName} (${e.message}).`;
  }
};

export async function POST(request) {
  let analysisResults = {}; // Initialize results object outside try blocks

  try {
    // Outer try for request processing AND Gemini client initialization
    const payload = await request.json();
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.error("Configuration error: Gemini API key is missing.");
      return NextResponse.json(
        { error: "Configuration error: Gemini API key is missing." },
        { status: 500 }
      );
    }

    // Initialize Gemini client inside the try block
    const geminiApi = new GoogleGenerativeAI(geminiApiKey);
    const model = geminiApi.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });

    const website = payload.website || "the provided website";
    const businessName = payload.detectedName || website;
    const industry = payload.detectedIndustry || "the provided industry";
    const competitors =
      payload.competitors && payload.competitors.length > 0
        ? payload.competitors
        : ["key industry player 1", "key industry player 2"];
    const competitorsString = competitors.join(", ");
    const insitesReport = payload.insitesReport || {}; // Pass the object

    try {
      // Inner try specifically for Gemini calls and response formatting
      // --- Define Gemini Prompts using imported functions ---
      const seoPrompt = getSeoPrompt(
        businessName,
        website,
        industry,
        competitorsString,
        insitesReport
      );
      const competitorPrompt = getCompetitorPrompt(
        businessName,
        website,
        industry,
        competitors,
        competitorsString,
        insitesReport
      );
      const marketPotentialPrompt = getMarketPotentialPrompt(
        businessName,
        website,
        industry,
        insitesReport
      );
      const marketCapPrompt = getMarketCapPrompt(
        businessName,
        website,
        industry,
        insitesReport
      );
      const recommendationsPrompt = getRecommendationsPrompt(
        businessName,
        website,
        industry,
        competitorsString,
        insitesReport
      );
      const trendsPrompt = getTrendsPrompt(
        businessName,
        website,
        industry,
        competitorsString,
        insitesReport
      );
      const socialMediaPrompt = getSocialMediaPrompt(
        businessName,
        website,
        industry,
        competitorsString,
        insitesReport
      );

      // --- Run Gemini Prompts ---
      console.log("Sending prompts to Gemini...");
      const results = await Promise.allSettled([
        // Use Promise.allSettled
        model.generateContent(seoPrompt),
        model.generateContent(competitorPrompt),
        model.generateContent(marketPotentialPrompt),
        model.generateContent(marketCapPrompt),
        model.generateContent(recommendationsPrompt),
        model.generateContent(trendsPrompt),
        model.generateContent(socialMediaPrompt),
      ]);
      console.log("Received responses (or errors) from Gemini.");

      // --- Format Response ---
      // Process results from Promise.allSettled
      const [
        seoResult,
        competitorResult,
        marketPotentialResult,
        marketCapResult,
        recommendationsResult,
        trendsResult,
        socialMediaResult,
      ] = results;

      // Helper to check status and get text or error
      const processResult = (result, name) => {
        if (result.status === "fulfilled") {
          // Add extra check on the fulfilled value before calling getTextSafe
          if (!result.value) {
            console.error(
              `Fulfilled promise for ${name} has null/undefined value.`
            );
            return `Error: AI analysis for ${name} completed but returned no value.`;
          }
          return getTextSafe(result.value, name);
        } else {
          // status === 'rejected'
          console.error(`Promise rejected for ${name}:`, result.reason);
          // Try to get a more specific error message if available
          const errorMessage =
            result.reason?.message ||
            String(result.reason) ||
            "Unknown rejection reason";
          return `Error: Failed to generate ${name}. Reason: ${errorMessage}`;
        }
      };

      analysisResults = {
        seoAnalysis: processResult(seoResult, "SEO Analysis"),
        competitorAnalysis: processResult(
          competitorResult,
          "Competitor Analysis"
        ),
        marketPotential: processResult(
          marketPotentialResult,
          "Market Potential"
        ),
        marketCap: processResult(marketCapResult, "Market Cap"),
        recommendations: processResult(
          recommendationsResult,
          "Recommendations"
        ),
        searchTrends: processResult(trendsResult, "Search Trends"),
        socialMedia: processResult(socialMediaResult, "Social Media"),
        detectedName: businessName,
        businessName: businessName,
      };

      // Check if any individual result contains an error string
      const hasErrors = Object.values(analysisResults).some(
        (value) => typeof value === "string" && value.startsWith("Error:")
      );
      if (hasErrors) {
        console.warn("One or more analysis sections failed:", analysisResults);
        // Optionally, you could return a different status or structure if partial failure is critical
      }
    } catch (processingError) {
      // Catch errors during prompt definition or result processing (less likely now with allSettled)
      console.error("Error during analysis processing:", processingError);
      // Ensure the error message is always a string
      const errorMessage =
        processingError instanceof Error
          ? processingError.message
          : String(processingError);
      return NextResponse.json(
        {
          error: `Error processing analysis: ${
            errorMessage || "Unknown processing error"
          }`,
        },
        { status: 500 }
      );
    }

    // If the inner try succeeded (even with partial errors handled by processResult), return the results
    console.log("Analysis process completed. Returning results.");
    // Explicitly try to stringify before returning to catch serialization errors
    try {
      JSON.stringify(analysisResults); // Test serialization
    } catch (serializationError) {
      console.error(
        "Critical error: Failed to serialize analysisResults.",
        serializationError,
        analysisResults
      );
      return NextResponse.json(
        {
          error: `Internal server error: Failed to format analysis results. ${serializationError.message}`,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(analysisResults);
  } catch (error) {
    // Outer catch for general request processing errors (e.g., payload parsing, Gemini init)
    console.error("Critical error in analysis API (outer catch):", error);
    // Simplify the error message drastically to ensure JSON compatibility
    return NextResponse.json(
      {
        error:
          "An unexpected server error occurred during analysis request processing.",
      },
      { status: 500 }
    );
  }
}
