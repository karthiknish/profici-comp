// src/app/api/analysis/prompts/organicTrafficPrompt.js
import { getOrganicTrafficStructure } from "./seoSections/organicTraffic.js";

export function getOrganicTrafficPrompt(
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport,
  apolloData,
  avgMonthlyTraffic, // Pass pre-calculated value
  getInsitesPages // Pass helper function
) {
  const structure = getOrganicTrafficStructure(
    avgMonthlyTraffic,
    getInsitesPages,
    apolloData,
    competitorsString
  );
  const structureString = JSON.stringify(
    { organicTrafficUK: structure },
    null,
    2
  ); // Wrap in top-level key

  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT. " +
    "Generate ONLY the 'organicTrafficUK' section of a UK-focused SEO analysis JSON for " +
    businessName +
    " (" +
    website +
    ") in the " +
    industry +
    " industry. Use the provided context data. " +
    "The JSON object MUST strictly follow the structure outlined below. Replace ALL bracketed placeholders with realistic, specific, estimated values or text relevant to the UK market. Ensure all strings are properly escaped for JSON.\n\n" +
    "Context Data:\n" +
    "Insites Report Snippet (Traffic & Pages):\n" +
    JSON.stringify(
      {
        organic_search: insitesReport?.organic_search,
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
    "REMEMBER: ONLY the valid JSON object for 'organicTrafficUK' is required.";

  return prompt;
}
