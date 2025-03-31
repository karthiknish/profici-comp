import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import clientPromise from "@/lib/mongodb"; // Import MongoDB client promise
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
  let analysisResults = {};
  let mongoClient; // Define mongoClient in the outer scope

  try {
    const payload = await request.json();
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME; // Get DB name

    if (!geminiApiKey || !MONGODB_DB_NAME) {
      // Check both keys
      const missingVar = !geminiApiKey ? "GEMINI_API_KEY" : "MONGODB_DB_NAME";
      console.error(`Configuration error: ${missingVar} is missing.`);
      return NextResponse.json(
        { error: `Configuration error: ${missingVar} is missing.` },
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
    const userEmail = payload.email; // Get email from payload
    const competitors =
      payload.competitors && payload.competitors.length > 0
        ? payload.competitors
        : ["key industry player 1", "key industry player 2"];
    const competitorsString = competitors.join(", ");
    const insitesReport = payload.insitesReport || {};

    try {
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

      console.log("Sending prompts to Gemini...");
      const results = await Promise.allSettled([
        model.generateContent(seoPrompt),
        model.generateContent(competitorPrompt),
        model.generateContent(marketPotentialPrompt),
        model.generateContent(marketCapPrompt),
        model.generateContent(recommendationsPrompt),
        model.generateContent(trendsPrompt),
        model.generateContent(socialMediaPrompt),
      ]);
      console.log("Received responses (or errors) from Gemini.");

      const [
        seoResult,
        competitorResult,
        marketPotentialResult,
        marketCapResult,
        recommendationsResult,
        trendsResult,
        socialMediaResult,
      ] = results;

      const processResult = (result, name) => {
        if (result.status === "fulfilled") {
          if (!result.value) {
            console.error(
              `Fulfilled promise for ${name} has null/undefined value.`
            );
            return `Error: AI analysis for ${name} completed but returned no value.`;
          }
          return getTextSafe(result.value, name);
        } else {
          console.error(`Promise rejected for ${name}:`, result.reason);
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
        // Keep detectedName/businessName if needed by frontend
        detectedName: businessName,
        businessName: businessName,
      };

      const hasErrors = Object.values(analysisResults).some(
        (value) => typeof value === "string" && value.startsWith("Error:")
      );
      if (hasErrors) {
        console.warn("One or more analysis sections failed:", analysisResults);
      }

      // --- Save Report to MongoDB ---
      try {
        mongoClient = await clientPromise;
        const db = mongoClient.db(MONGODB_DB_NAME);
        const reportsCollection = db.collection("analysis_reports");

        const reportDocument = {
          userId: userEmail, // Use email as a user identifier
          website: website,
          businessName: businessName,
          industry: industry,
          competitors: competitors, // Save the array
          reportData: analysisResults, // Save the full results object
          createdAt: new Date(),
          insitesReportId: payload.insitesReport?.id || null, // Optionally save the Insites ID
        };

        await reportsCollection.insertOne(reportDocument);
        console.log(">>> Analysis report saved to MongoDB");
      } catch (dbError) {
        console.error("MongoDB Error saving analysis report:", dbError);
        // Log the error but proceed to return the results to the user
      }
      // --- End Save Report ---
    } catch (processingError) {
      console.error("Error during analysis processing:", processingError);
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

    console.log("Analysis process completed. Returning results.");
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
    console.error("Critical error in analysis API (outer catch):", error);
    let errorMessage = "Failed to process analysis request.";
    if (error instanceof Error) {
      errorMessage += ` Reason: ${error.message}`;
    } else {
      errorMessage += ` Reason: ${String(error)}`;
    }
    console.error("Critical error object in analysis API:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
