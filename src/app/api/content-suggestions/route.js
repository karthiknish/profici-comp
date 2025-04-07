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
    "Failed to initialize Gemini API in content-suggestions route using GEMINI_API_KEY2 or GEMINI_API_KEY:",
    error
  );
  // Error handled within POST handler
}

export async function POST(request) {
  // Check if initialization failed earlier
  if (!geminiApi) {
    return NextResponse.json(
      { message: "Gemini API not initialized correctly." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { contentAnalysisSummary, keywordOpportunities, domain } = body;

    // Basic validation
    if (
      !contentAnalysisSummary ||
      !Array.isArray(keywordOpportunities) || // Ensure it's an array
      keywordOpportunities.length === 0 || // Ensure it's not empty
      !domain
    ) {
      console.warn("Missing required data for content suggestions:", {
        hasSummary: !!contentAnalysisSummary,
        hasOpportunities:
          Array.isArray(keywordOpportunities) &&
          keywordOpportunities.length > 0,
        hasDomain: !!domain,
      });
      return NextResponse.json(
        {
          message:
            "Missing required data: contentAnalysisSummary (object/string), keywordOpportunities (non-empty array), and domain (string).",
        },
        { status: 400 }
      );
    }

    // Adhere to .clinerules
    // Note: The geminiApi instance might have been re-initialized with a new key here
    const model = geminiApi.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
    });

    // --- Prompt Engineering ---
    // Convert array data to string representations suitable for the prompt
    const opportunitiesString = keywordOpportunities
      .map(
        (o) =>
          `- ${o.keyword || o.keywordUKFocus || "N/A"} (Volume: ${
            o.volumeUK || "N/A"
          }, Difficulty: ${o.difficultyEst || "N/A"}, Potential: ${
            o.potential || "N/A"
          })`
      )
      .join("\n");

    // Assuming contentAnalysisSummary is already a string or simple object stringifiable
    const contentSummaryString =
      typeof contentAnalysisSummary === "string"
        ? contentAnalysisSummary
        : JSON.stringify(contentAnalysisSummary);

    const prompt = `
      Analyze the following SEO data for the website ${domain} and generate content strategy suggestions.

      **Content Analysis Summary:**
      ${contentSummaryString}

      **Top Keyword Opportunities (Gap Analysis):**
      ${opportunitiesString}

      **Task:**
      Based *only* on the provided Content Analysis Summary and Keyword Opportunities, suggest 5-7 specific and actionable content ideas (e.g., blog posts, landing pages, guides) that address the identified keyword gaps and align with the content analysis findings. For each suggestion:
      1. Provide a compelling title.
      2. Briefly explain the rationale (which keyword opportunity or content gap it addresses).
      3. Suggest the primary target keyword(s).
      4. Indicate the likely user intent (Informational, Commercial, Transactional, Navigational).

      Format the output as a valid JSON array where each element is an object representing a single content suggestion. Each object should have the following keys: "title" (string), "rationale" (string), "targetKeywords" (array of strings), and "userIntent" (string - one of Informational, Commercial, Transactional, Navigational).

      Example JSON object structure within the array:
      {
        "title": "Example Title",
        "rationale": "Addresses keyword gap X and content finding Y.",
        "targetKeywords": ["keyword1", "keyword2"],
        "userIntent": "Informational"
      }

      RESPONSE MUST BE A SINGLE VALID JSON ARRAY ONLY. START WITH '[' AND END WITH ']'. DO NOT INCLUDE \`\`\`json MARKERS OR ANY OTHER TEXT.
    `;

    // console.log("--- Sending Prompt to Gemini ---");
    // console.log(prompt);
    // console.log("-------------------------------");

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawSuggestionsText = response.text();

    // console.log("--- Received Response from Gemini ---");
    // console.log(rawSuggestionsText);
    // console.log("-----------------------------------");

    if (!rawSuggestionsText) {
      throw new Error(
        "Gemini returned an empty response for content suggestions."
      );
    }

    // Attempt to parse the response as JSON
    let suggestionsJson;
    try {
      // Clean potential markdown fences if Gemini still includes them
      const cleanedText = rawSuggestionsText
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      suggestionsJson = JSON.parse(cleanedText);
      // Basic validation of the parsed structure
      if (!Array.isArray(suggestionsJson)) {
        throw new Error("Parsed response is not an array.");
      }
      // Optional: Add more validation for object structure within the array if needed
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      console.error("Raw response was:", rawSuggestionsText);
      throw new Error(
        `Failed to parse content suggestions from AI. Raw response: ${rawSuggestionsText.substring(
          0,
          100
        )}...`
      );
    }

    return NextResponse.json({ suggestions: suggestionsJson }); // Return the parsed JSON array
  } catch (error) {
    console.error("Error generating content suggestions:", error);
    // Check for specific Gemini errors if possible, otherwise return generic error
    const errorMessage = error.message || "An unknown error occurred";
    // Avoid exposing internal details like API keys in error messages
    return NextResponse.json(
      {
        message: "Failed to generate content suggestions.",
        error: errorMessage.substring(0, 500), // Limit error message length
      },
      { status: 500 }
    );
  }
}
