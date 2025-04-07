// src/app/api/analysis/prompts/localSeoPrompt.js
import { getLocalSeoStructure } from "./seoSections/localSeo.js";

export function getLocalSeoPrompt(
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport,
  apolloData,
  directoriesFound, // Pass pre-calculated value
  avgReview, // Pass pre-calculated value
  reviewCount // Pass pre-calculated value
) {
  const structure = getLocalSeoStructure(
    apolloData,
    directoriesFound,
    avgReview,
    reviewCount,
    competitorsString
  );
  const structureString = JSON.stringify({ localSeoUK: structure }, null, 2); // Wrap in top-level key

  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT. " +
    "Generate ONLY the 'localSeoUK' section of a UK-focused SEO analysis JSON for " +
    businessName +
    " (" +
    website +
    ") in the " +
    industry +
    " industry. Use the provided context data. " +
    "The JSON object MUST strictly follow the structure outlined below. Replace ALL bracketed placeholders with realistic, specific, estimated values or text relevant to the UK market. Ensure all strings are properly escaped for JSON.\n\n" +
    "Context Data:\n" +
    "Insites Report Snippet (Local Presence):\n" +
    JSON.stringify(
      insitesReport?.local_presence_normalised || {},
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
    "REMEMBER: ONLY the valid JSON object for 'localSeoUK' is required.";

  return prompt;
}
