// src/app/api/analysis/prompts/backlinkProfilePrompt.js
import { getBacklinkProfileStructure } from "./seoSections/backlinkProfile.js";

export function getBacklinkProfilePrompt(
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport,
  apolloData,
  totalBacklinks, // Pass pre-calculated value
  referringDomains, // Pass pre-calculated value
  hasSpammyBacklinks, // Pass pre-calculated value
  getInsitesReferringDomains // Pass helper function
) {
  const structure = getBacklinkProfileStructure(
    totalBacklinks,
    referringDomains,
    hasSpammyBacklinks,
    getInsitesReferringDomains,
    competitorsString
  );
  const structureString = JSON.stringify(
    { backlinkProfileUK: structure },
    null,
    2
  ); // Wrap in top-level key

  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT. " +
    "Generate ONLY the 'backlinkProfileUK' section of a UK-focused SEO analysis JSON for " +
    businessName +
    " (" +
    website +
    ") in the " +
    industry +
    " industry. Use the provided context data. " +
    "The JSON object MUST strictly follow the structure outlined below. Replace ALL bracketed placeholders with realistic, specific, estimated values or text relevant to the UK market. Ensure all strings are properly escaped for JSON.\n\n" +
    "Context Data:\n" +
    "Insites Report Snippet (Backlinks):\n" +
    JSON.stringify(insitesReport?.backlinks || {}, null, 2).substring(0, 1000) + // Context specific
    "...\n\n" +
    "Apollo.io Data Snippet:\n" +
    JSON.stringify(apolloData || {}, null, 2).substring(0, 1000) +
    "...\n\n" +
    "Required JSON Structure (Respond with ONLY this structure, filled in):\n" +
    structureString +
    "\n\n" +
    "REMEMBER: ONLY the valid JSON object for 'backlinkProfileUK' is required.";

  return prompt;
}
