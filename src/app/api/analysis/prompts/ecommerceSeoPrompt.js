// src/app/api/analysis/prompts/ecommerceSeoPrompt.js
import { getEcommerceSeoStructure } from "./seoSections/ecommerceSeo.js";

export function getEcommerceSeoPrompt(
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport,
  apolloData,
  isEcommerce // Pass pre-calculated value
) {
  const structure = getEcommerceSeoStructure(isEcommerce, competitorsString);
  const structureString = JSON.stringify(
    { ecommerceSeoUK: structure },
    null,
    2
  ); // Wrap in top-level key

  // Only generate prompt if e-commerce is applicable
  if (!isEcommerce) {
    // Return a structure indicating not applicable, matching the expected top-level key
    return {
      ecommerceSeoUK: {
        applicable: false,
        summary: "N/A - Not detected as an e-commerce site.",
        ecommerceVsCompetitorsUK: null,
      },
    };
  }

  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT. " +
    "Generate ONLY the 'ecommerceSeoUK' section of a UK-focused SEO analysis JSON for " +
    businessName +
    " (" +
    website +
    ") in the " +
    industry +
    " industry. Use the provided context data. " +
    "The JSON object MUST strictly follow the structure outlined below. Replace ALL bracketed placeholders with realistic, specific, estimated values or text relevant to the UK market. Ensure all strings are properly escaped for JSON.\n\n" +
    "Context Data:\n" +
    "Insites Report Snippet (E-commerce):\n" +
    JSON.stringify(insitesReport?.ecommerce || {}, null, 2).substring(0, 1000) + // Context specific
    "...\n\n" +
    "Apollo.io Data Snippet:\n" +
    JSON.stringify(apolloData || {}, null, 2).substring(0, 1000) +
    "...\n\n" +
    "Required JSON Structure (Respond with ONLY this structure, filled in):\n" +
    structureString +
    "\n\n" +
    "REMEMBER: ONLY the valid JSON object for 'ecommerceSeoUK' is required.";

  return prompt;
}
