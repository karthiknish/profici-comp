import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSeoPrompt } from "./prompts/seoPrompt.js";
import { getCompetitorPrompt } from "./prompts/competitorPrompt.js";
import { getMarketPotentialPrompt } from "./prompts/marketPotentialPrompt.js";
import { getMarketCapPrompt } from "./prompts/marketCapPrompt.js";
import { getRecommendationsPrompt } from "./prompts/recommendationsPrompt.js";
import { getTrendsPrompt } from "./prompts/trendsPrompt.js";
import { getSocialMediaPrompt } from "./prompts/socialMediaPrompt.js";

export async function POST(request) {
  try {
    // Expect the new payload structure
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
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash", // Default to flash if not set
    });

    // Extract relevant data from the payload, using Insites data primarily
    const website = payload.website || "the provided website";
    const businessName = payload.detectedName || website; // Use detected name or website
    const industry = payload.detectedIndustry || "the provided industry";
    // Use competitors from payload, provide a default if empty/missing
    const competitors =
      payload.competitors && payload.competitors.length > 0
        ? payload.competitors
        : ["key industry player 1", "key industry player 2"]; // Default to 2 placeholders if none provided
    const competitorsString = competitors.join(", "); // Use the actual competitors list or default
    const insitesReportJson = JSON.stringify(
      payload.insitesReport || {},
      null,
      2
    ); // Stringify Insites data for context

    // --- Define Gemini Prompts using imported functions ---
    const seoPrompt = getSeoPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReportJson
    );
    const competitorPrompt = getCompetitorPrompt(
      businessName,
      website,
      industry,
      competitors,
      competitorsString,
      insitesReportJson
    );
    const marketPotentialPrompt = getMarketPotentialPrompt(
      businessName,
      website,
      industry,
      insitesReportJson
    );
    const marketCapPrompt = getMarketCapPrompt(
      businessName,
      website,
      industry,
      insitesReportJson
    );
    const recommendationsPrompt = getRecommendationsPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReportJson
    );
    const trendsPrompt = getTrendsPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReportJson
    );
    const socialMediaPrompt = getSocialMediaPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReportJson
    );

    // --- Run Gemini Prompts ---
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

    // --- Format Response ---
    const analysisResults = {
      seoAnalysis: seoResult.response.text(),
      competitorAnalysis: competitorResult.response.text(),
      marketPotential: marketPotentialResult.response.text(),
      marketCap: marketCapResult.response.text(),
      recommendations: recommendationsResult.response.text(),
      searchTrends: trendsResult.response.text(),
      socialMedia: socialMediaResult.response.text(),
      // Include detectedName in the response so the report can use it
      detectedName: businessName,
      businessName: businessName, // Also include as businessName for consistency if needed
    };

    return NextResponse.json(analysisResults);
  } catch (error) {
    console.error("Error in analysis API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
