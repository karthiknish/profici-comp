import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use specific key for this route, fallback to primary
let geminiApi;
try {
  const apiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY; // Prioritize KEY2
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY2 or GEMINI_API_KEY environment variable is not set."
    );
  }
  geminiApi = new GoogleGenerativeAI(apiKey);
} catch (error) {
  console.error(
    "Failed to initialize Gemini API in topic-clusters route using GEMINI_API_KEY2 or GEMINI_API_KEY:",
    error
  );
  // Error handled within POST handler
}

export async function POST(request) {
  if (!geminiApi) {
    return NextResponse.json(
      { message: "Gemini API not initialized correctly." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { keywords } = body;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { message: "Missing or empty 'keywords' array in request body." },
        { status: 400 }
      );
    }

    const model = geminiApi.getGenerativeModel({ model: "gemini-2.0-flash" }); // Use appropriate model

    const keywordsString = keywords.join(", ");

    const prompt = `
      Given the following list of keywords related to a business:
      ${keywordsString}

      Group these keywords into logical topic clusters (typically 3-7 clusters). For each cluster, provide:
      1. A concise cluster name (2-4 words).
      2. The list of keywords belonging to that cluster.

      Format the output as a valid JSON array where each element is an object representing a cluster. Each object should have the keys "clusterName" (string) and "keywords" (array of strings).

      Example JSON object structure within the array:
      {
        "clusterName": "Core Service Offering",
        "keywords": ["keyword1", "keyword2", "keyword3"]
      }

      RESPONSE MUST BE A SINGLE VALID JSON ARRAY ONLY. START WITH '[' AND END WITH ']'. DO NOT INCLUDE \`\`\`json MARKERS OR ANY OTHER TEXT.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawResponseText = response.text();

    if (!rawResponseText) {
      throw new Error(
        "Gemini returned an empty response for topic clustering."
      );
    }

    // Attempt to parse the response as JSON
    let clustersJson;
    try {
      const cleanedText = rawResponseText
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      clustersJson = JSON.parse(cleanedText);
      if (!Array.isArray(clustersJson)) {
        throw new Error("Parsed response is not an array.");
      }
      // Add validation for cluster object structure if needed
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      console.error("Raw response was:", rawResponseText);
      throw new Error(
        `Failed to parse topic clusters from AI. Raw response: ${rawResponseText.substring(
          0,
          100
        )}...`
      );
    }

    return NextResponse.json({ clusters: clustersJson });
  } catch (error) {
    console.error("Error generating topic clusters:", error);
    const errorMessage = error.message || "An unknown error occurred";
    return NextResponse.json(
      {
        message: "Failed to generate topic clusters.",
        error: errorMessage.substring(0, 500), // Limit error message length
      },
      { status: 500 }
    );
  }
}
