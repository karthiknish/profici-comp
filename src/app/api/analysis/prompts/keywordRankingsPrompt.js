// src/app/api/analysis/prompts/keywordRankingsPrompt.js
import { getKeywordRankingsStructure } from "./seoSections/keywordRankings.js";

export function getKeywordRankingsPrompt(
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport,
  apolloData,
  getApolloKeywords, // Pass helper functions if needed by structure generator
  getInsitesKeywords
) {
  const structure = getKeywordRankingsStructure(
    getApolloKeywords,
    getInsitesKeywords,
    competitorsString
  );
  const structureString = JSON.stringify(
    { keywordRankingsUK: structure },
    null,
    2
  ); // Wrap in top-level key

  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT. " +
    "Generate ONLY the 'keywordRankingsUK' section of a UK-focused SEO analysis JSON for " +
    businessName +
    " (" +
    website +
    ") in the " +
    industry +
    " industry. Use the provided context data. " +
    "The JSON object MUST strictly follow the structure outlined below. Replace ALL bracketed placeholders with realistic, specific, estimated values or text relevant to the UK market. **Include an estimated Cost Per Click (CPC) in GBP (£) for each keyword in the 'topKeywords' array.** Ensure all strings are properly escaped for JSON.\n\n" +
    "Context Data:\n" +
    "Insites Report Snippet:\n" +
    JSON.stringify(insitesReport?.organic_search || {}, null, 2).substring(
      0,
      1000
    ) + // Context specific to keywords
    "...\n\n" +
    "Apollo.io Data Snippet:\n" +
    JSON.stringify(apolloData || {}, null, 2).substring(0, 1000) +
    "...\n\n" +
    "Required JSON Structure (Respond with ONLY this structure, filled in, ensuring the 'topKeywords' array and 'keywordOverlapUK' object are included and correctly formatted):\n" + // Added emphasis
    structureString +
    "\n\n" +
    "REMEMBER: ONLY the valid JSON object for 'keywordRankingsUK' is required, including the 'topKeywords' array and 'keywordOverlapUK' object."; // Added emphasis

  return prompt;
}
