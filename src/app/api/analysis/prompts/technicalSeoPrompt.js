// src/app/api/analysis/prompts/technicalSeoPrompt.js
import { getTechnicalSeoStructure } from "./seoSections/technicalSeo.js";

export function getTechnicalSeoPrompt(
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport,
  apolloData,
  getInsitesTechnicalIssues // Pass helper function
) {
  const structure = getTechnicalSeoStructure(
    getInsitesTechnicalIssues,
    competitorsString
  );
  const structureString = JSON.stringify(
    { technicalSeoUK: structure },
    null,
    2
  ); // Wrap in top-level key

  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT. " +
    "Generate ONLY the 'technicalSeoUK' section of a UK-focused SEO analysis JSON for " +
    businessName +
    " (" +
    website +
    ") in the " +
    industry +
    " industry. Use the provided context data, particularly the Insites spider report data if available, to identify specific schema types implemented. " +
    "The JSON object MUST strictly follow the structure outlined below. Replace ALL bracketed placeholders with realistic, specific, estimated values or text relevant to the UK market (especially for the 'schemaTypesFound' array). Ensure all strings are properly escaped for JSON.\n\n" +
    "Context Data:\n" +
    "Insites Report Snippet (Spider, Mobile):\n" +
    JSON.stringify(
      { spider: insitesReport?.spider, mobile: insitesReport?.mobile },
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
    "REMEMBER: ONLY the valid JSON object for 'technicalSeoUK' is required.";

  return prompt;
}
