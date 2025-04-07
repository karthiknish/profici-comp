// src/app/api/analysis/prompts/executiveSummaryPrompt.js
import { getExecutiveSummaryStructure } from "./seoSections/executiveSummary.js";

export function getExecutiveSummaryPrompt(
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport,
  apolloData
) {
  const structure = getExecutiveSummaryStructure(
    apolloData,
    industry,
    competitorsString
  );
  const structureString = JSON.stringify(
    { executiveSummaryUK: structure },
    null,
    2
  ); // Wrap in top-level key

  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT. " +
    "Generate ONLY the 'executiveSummaryUK' section of a UK-focused SEO analysis JSON for " +
    businessName +
    " (" +
    website +
    ") in the " +
    industry +
    " industry. Use the provided context data. " +
    "The JSON object MUST strictly follow the structure outlined below. Replace ALL bracketed placeholders with realistic, specific, estimated values or text relevant to the UK market. Ensure all strings are properly escaped for JSON.\n\n" +
    "Context Data:\n" +
    "Insites Report Snippet:\n" +
    JSON.stringify(insitesReport || {}, null, 2).substring(0, 1000) + // Keep context concise
    "...\n\n" +
    "Apollo.io Data Snippet:\n" +
    JSON.stringify(apolloData || {}, null, 2).substring(0, 1000) + // Keep context concise
    "...\n\n" +
    "Required JSON Structure (Respond with ONLY this structure, filled in):\n" +
    structureString +
    "\n\n" +
    "REMEMBER: ONLY the valid JSON object for 'executiveSummaryUK' is required.";

  return prompt;
}
