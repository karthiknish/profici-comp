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
const getTextSafe = (result) => {
  try {
    // Check if response and text function exist
    if (result && result.response && typeof result.response.text === 'function') {
      return result.response.text();
    }
    console.error("Invalid Gemini result structure:", result);
    return "Error: Invalid AI response structure.";
  } catch (e) {
    console.error("Error getting text from Gemini response:", e, result);
    return `Error: Could not retrieve text from AI response (${e.message}).`;
  }
};


export async function POST(request) {
  try {
    // Outer try for request processing
    const payload = await request.json();
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

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

    let analysisResults = {}; // Initialize results object

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
      console.log("Sending prompts to Gemini..."); // Log before sending
      const [
        seoResult,
        competitorResult,
        marketPotentialResult,
        marketCapResult,
        recommendationsResult,
        trendsResult,
        socialMediaResult,
      ] = await Promise.all([
        model.generateContent(seoPrompt),
        model.generateContent(competitorPrompt),
        model.generateContent(marketPotentialPrompt),
        model.generateContent(marketCapPrompt),
        model.generateContent(recommendationsPrompt),
        model.generateContent(trendsPrompt),
        model.generateContent(socialMediaPrompt),
      ]);
      console.log("Received responses from Gemini."); // Log after receiving

      // --- Format Response ---
      analysisResults = {
        seoAnalysis: getTextSafe(seoResult),
        competitorAnalysis: getTextSafe(competitorResult),
        marketPotential: getTextSafe(marketPotentialResult),
        marketCap: getTextSafe(marketCapResult),
        recommendations: getTextSafe(recommendationsResult),
        searchTrends: getTextSafe(trendsResult),
        socialMedia: getTextSafe(socialMediaResult),
        detectedName: businessName,
        businessName: businessName,
      };
    } catch (geminiError) {
      // Catch errors specifically from Gemini calls or response formatting
      console.error("Error during Gemini processing:", geminiError);
      // Return a JSON error response immediately
      return NextResponse.json(
        {
          error: `Failed during AI analysis generation: ${
            geminiError.message || "Unknown Gemini Error"
          }`,
        },
        { status: 500 }
      );
    }

    // If the inner try succeeded, return the results
    console.log("Successfully generated analysis results."); // Log success
    return NextResponse.json(analysisResults);
  } catch (error) {
    // Outer catch for general request processing errors (e.g., payload parsing)
    console.error("Error in analysis API (outer catch):", error);
    // Ensure this also returns JSON
    return NextResponse.json(
      { error: error.message || "Failed to process analysis request" },
      { status: 500 }
    );
  }
}
