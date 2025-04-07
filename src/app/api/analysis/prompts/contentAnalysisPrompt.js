// src/app/api/analysis/prompts/contentAnalysisPrompt.js
import { getContentAnalysisStructure } from "./seoSections/contentAnalysis.js";

export function getContentAnalysisPrompt(
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport,
  apolloData,
  contentFreshness, // Pass pre-calculated value
  getInsitesPages, // Pass helper function
  getApolloKeywords // Pass helper function
) {
  const structure = getContentAnalysisStructure(
    apolloData,
    contentFreshness,
    getInsitesPages,
    getApolloKeywords,
    competitorsString
  );
  const structureString = JSON.stringify(
    { contentAnalysisUK: structure },
    null,
    2
  ); // Wrap in top-level key

  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT. " +
    "Generate ONLY the 'contentAnalysisUK' section of a UK-focused SEO analysis JSON for " +
    businessName +
    " (" +
    website +
    ") in the " +
    industry +
    " industry. Use the provided context data. " +
    "The JSON object MUST strictly follow the structure outlined below. Replace ALL bracketed placeholders with realistic, specific, estimated values or text relevant to the UK market. **Include an estimated readability score (e.g., 'Standard', 'Grade 9') in the 'summary' array.** Ensure all strings are properly escaped for JSON.\n\n" +
    "Context Data:\n" +
    "Insites Report Snippet (Content):\n" +
    JSON.stringify(
      {
        amount_of_content: insitesReport?.amount_of_content,
        pages: insitesReport?.pages,
      },
      null,
      2
    ).substring(0, 1000) + // Context specific
    "...\n\n" +
    "Apollo.io Data Snippet:\n" +
    JSON.stringify(apolloData || {}, null, 2).substring(0, 1000) +
    "...\n\n" +
    "Required JSON Structure (Respond with ONLY this structure, filled in):\n" +
    structureString +
    "\n\n" +
    "REMEMBER: ONLY the valid JSON object for 'contentAnalysisUK' is required.";

  return prompt;
}
