import fs from "fs/promises"; // Import fs promises
import path from "path"; // Import path

// Helper function to get the base URL for internal API calls
export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Fallback for local development
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

// Helper to safely get and parse JSON from Gemini response
export const getJsonSafe = (result, promptName) => {
  let rawText = null;
  try {
    // 1. Try to get the raw text response
    if (result?.response?.text && typeof result.response.text === "function") {
      rawText = result.response.text();
    } else if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      // Fallback for slightly different structures if text() function is missing but content exists
      rawText = result.response.candidates[0].content.parts[0].text;
      console.warn(`Used fallback text extraction for ${promptName}`);
    } else {
      console.error(
        `Gemini result missing response text for ${promptName}:`,
        JSON.stringify(result, null, 2) // Log the structure for debugging
      );
      return { error: `AI response structure invalid for ${promptName}.` };
    }

    // 2. Process the raw text
    if (typeof rawText === "string") {
      const cleanedText = rawText.replace(/^```json\s*|```\s*$/g, "").trim();

      // 2a. Check if it looks like JSON before attempting to parse
      if (!cleanedText.startsWith("{") && !cleanedText.startsWith("[")) {
        console.warn(
          `Response for ${promptName} does not appear to be JSON. Returning as info/error text:`,
          cleanedText
        );
        // Return it structured, indicating it's not the expected JSON data
        return { info: `AI provided text instead of JSON: ${cleanedText}` };
      }

      // 2b. Try to parse the cleaned text as JSON
      try {
        const parsedJson = JSON.parse(cleanedText);
        return parsedJson;
      } catch (parseError) {
        console.warn(
          `Initial JSON parse failed for ${promptName}:`,
          parseError.message
        );
        // Only attempt recovery if it was a SyntaxError (malformed JSON)
        if (parseError instanceof SyntaxError) {
          console.log(`Attempting JSON recovery for ${promptName}...`);
          // Recovery Attempt 1: Extract between first '{' and last '}'
          try {
            const firstBraceIndex = cleanedText.indexOf("{");
            const lastBraceIndex = cleanedText.lastIndexOf("}");
            if (firstBraceIndex > -1 && lastBraceIndex > firstBraceIndex) {
              const potentialJson = cleanedText.substring(
                firstBraceIndex,
                lastBraceIndex + 1
              );
              const recoveredJson = JSON.parse(potentialJson);
              console.warn(
                `Successfully recovered JSON for ${promptName} (brace extraction).`
              );
              return recoveredJson;
            } else {
              throw new Error("Could not find valid start/end braces.");
            }
          } catch (recoveryError) {
            console.warn(
              `Recovery 1 failed for ${promptName}: ${recoveryError.message}. Trying newline replacement...`
            );
            // Recovery Attempt 2: Newline replacement within extracted braces
            try {
              const firstBraceIndex = cleanedText.indexOf("{");
              const lastBraceIndex = cleanedText.lastIndexOf("}");
              if (firstBraceIndex > -1 && lastBraceIndex > firstBraceIndex) {
                let potentialJson = cleanedText.substring(
                  firstBraceIndex,
                  lastBraceIndex + 1
                );
                // Be more aggressive with cleaning potentially problematic characters within strings
                const newlineCleanedJson = potentialJson
                  .replace(/\\n/g, " ") // Replace escaped newlines
                  .replace(/\n/g, " ") // Replace literal newlines
                  .replace(/\\"/g, '"'); // Simplify escaped quotes if they cause issues (use cautiously)

                const finalRecoveredJson = JSON.parse(newlineCleanedJson);
                console.warn(
                  `Successfully recovered JSON for ${promptName} (newline replacement).`
                );
                return finalRecoveredJson;
              } else {
                throw new Error("Could not find valid braces for recovery 2.");
              }
            } catch (finalRecoveryError) {
              console.error(
                `Final JSON recovery attempt failed for ${promptName}:`,
                finalRecoveryError.message
              );
              console.error(
                `Raw text received for ${promptName} (final recovery failed):`,
                rawText // Log the original raw text
              );
              return {
                error: `AI response for ${promptName} was not valid JSON and recovery failed.`,
                rawResponse: rawText, // Include raw response for inspection
              };
            }
          }
        } else {
          // Handle non-SyntaxErrors during parsing
          console.error(
            `Non-syntax error parsing JSON for ${promptName}:`,
            parseError
          );
          console.error(
            `Raw text received for ${promptName} (non-syntax error):`,
            rawText
          );
          return {
            error: `AI response for ${promptName} caused a non-JSON parsing error: ${parseError.message}`,
            rawResponse: rawText,
          };
        }
      }
    } else {
      // Handle cases where rawText is not a string after extraction attempts
      console.error(
        `Extracted AI response was not a string for ${promptName}:`,
        rawText
      );
      return {
        error: `Invalid text format received from AI for ${promptName}.`,
      };
    }
  } catch (e) {
    // Catch any other unexpected errors during the process
    console.error(
      `Unexpected error processing Gemini response for ${promptName}:`,
      e,
      result
    );
    return {
      error: `Could not process AI response for ${promptName} (${e.message}).`,
    };
  }
};

// Helper function to fetch Apollo data for a single domain
export const fetchApolloDataForDomain = async (domain) => {
  if (!domain) {
    console.log(">>> Skipping Apollo fetch: No domain provided.");
    return null;
  }

  // Always call the live API endpoint, regardless of NODE_ENV
  try {
    console.log(`>>> Calling /api/apollo-info for domain: ${domain}`);
    const apolloResponse = await fetch(`${getBaseUrl()}/api/apollo-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain: domain }),
    });

    if (!apolloResponse.ok) {
      console.warn(
        `Apollo info fetch failed for ${domain} with status: ${apolloResponse.status}`
      );
      return null;
    } else {
      const apolloResult = await apolloResponse.json();
      const apolloData = apolloResult.apolloData;
      console.log(
        `>>> Apollo data fetched successfully for ${domain} (or null if not found).`
      );
      return apolloData;
    }
  } catch (apolloError) {
    console.error(
      `Error calling Apollo info API route for ${domain}:`,
      apolloError
    );
    return null;
  }
  // Removed the 'else' block and the preceding 'if (NODE_ENV === "development")' block
};

// Helper function to save report to MongoDB
export const saveReportToDb = async (reportDocument) => {
  try {
    const { connectToDatabase } = await import("@/lib/mongodb"); // Dynamic import inside async function
    const { db } = await connectToDatabase();
    const reportsCollection = db.collection("analysis_reports");
    await reportsCollection.insertOne(reportDocument);
    console.log(">>> Analysis report saved to MongoDB");
  } catch (dbError) {
    console.error("MongoDB Error saving analysis report:", dbError);
    // Decide if this should throw or just log
  }
};
