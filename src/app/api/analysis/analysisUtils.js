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
    } else {
      console.error(
        `Gemini result missing response or text function for ${promptName}:`,
        result
      );
      return { error: `AI response structure invalid for ${promptName}.` };
    }

    // 2. Try to parse the text as JSON
    if (typeof rawText === "string") {
      try {
        const cleanedText = rawText.replace(/^```json\s*|```\s*$/g, "").trim();
        const parsedJson = JSON.parse(cleanedText);
        return parsedJson;
      } catch (parseError) {
        console.warn(
          `Initial JSON parse failed for ${promptName}:`,
          parseError.message
        );
        if (parseError instanceof SyntaxError) {
          console.log(`Attempting JSON recovery for ${promptName}...`);
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
                `Successfully recovered JSON for ${promptName} by extracting content between first '{' and last '}'.`
              );
              return recoveredJson;
            } else {
              throw new Error(
                "Could not find valid start/end braces for JSON recovery."
              );
            }
          } catch (recoveryError) {
            console.warn(
              `Initial JSON recovery failed for ${promptName}: ${recoveryError.message}. Trying newline replacement...`
            );
            try {
              const firstBraceIndex = cleanedText.indexOf("{");
              const lastBraceIndex = cleanedText.lastIndexOf("}");
              if (firstBraceIndex > -1 && lastBraceIndex > firstBraceIndex) {
                let potentialJson = cleanedText.substring(
                  firstBraceIndex,
                  lastBraceIndex + 1
                );
                const newlineCleanedJson = potentialJson
                  .replace(/\\n/g, " ")
                  .replace(/\n/g, " ");
                const finalRecoveredJson = JSON.parse(newlineCleanedJson);
                console.warn(
                  `Successfully recovered JSON for ${promptName} after newline replacement.`
                );
                return finalRecoveredJson;
              } else {
                throw new Error(
                  "Could not find valid braces for newline replacement recovery."
                );
              }
            } catch (finalRecoveryError) {
              console.error(
                `Final JSON recovery attempt failed for ${promptName}:`,
                finalRecoveryError.message
              );
              console.error(
                `Raw text received for ${promptName} (final recovery failed):`,
                rawText
              );
              return {
                error: `AI response for ${promptName} was not valid JSON and all recovery attempts failed.`,
              };
            }
          }
        } else {
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
          };
        }
      }
    } else {
      console.error(
        `Gemini response.text() did not return a string for ${promptName}:`,
        rawText
      );
      return {
        error: `Invalid text format received from AI for ${promptName}.`,
      };
    }
  } catch (e) {
    console.error(
      `Error processing Gemini response for ${promptName}:`,
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

  // --- Development Mode: Use Local Files ---
  if (process.env.NODE_ENV === "development") {
    console.log(
      `>>> [DEV MODE] Attempting to load local Apollo data for: ${domain}`
    );
    try {
      // Sanitize domain for filename (replace non-alphanumeric with underscore)
      const safeFilenamePart = domain
        .replace(/[^a-z0-9.-]/gi, "_")
        .toLowerCase();
      const filename = `apollo-${safeFilenamePart}.json`;
      // Construct the full path relative to the project root
      // NOTE: This assumes the CWD is the project root where `apollo_responses` lives.
      // Adjust if the execution context is different.
      const filePath = path.join(process.cwd(), "apollo_responses", filename);

      console.log(`>>> [DEV MODE] Reading file: ${filePath}`);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const localData = JSON.parse(fileContent);
      console.log(
        `>>> [DEV MODE] Successfully loaded local Apollo data for ${domain}`
      );
      return localData; // Return the parsed local data
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(
          `>>> [DEV MODE] Local Apollo file not found for ${domain}. File expected at: ${path.join(
            "apollo_responses",
            `apollo-${domain.replace(/[^a-z0-9.-]/gi, "_").toLowerCase()}.json`
          )}`
        );
      } else {
        console.error(
          `>>> [DEV MODE] Error reading/parsing local Apollo file for ${domain}:`,
          error
        );
      }
      // Fallback to null if local file fails in dev mode (or could choose to call API)
      return null;
    }
  }
  // --- Production Mode: Call Live API ---
  else {
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
  } // <<< Add missing closing brace for the 'else' block
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
