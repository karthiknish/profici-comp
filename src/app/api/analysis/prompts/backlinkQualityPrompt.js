// src/app/api/analysis/prompts/backlinkQualityPrompt.js

export function getBacklinkQualityPrompt(referringDomains) {
  if (!Array.isArray(referringDomains) || referringDomains.length === 0) {
    // Return a default structure or null if no domains provided
    return JSON.stringify({
      backlinkQualitySummary: {
        highQualityCount: 0,
        mediumQualityCount: 0,
        lowQualityCount: 0,
        spammyCount: 0,
        notes: "No referring domain data provided for quality analysis.",
      },
    });
  }

  // Limit the number of domains sent to the prompt for performance/cost
  const MAX_DOMAINS_TO_ANALYZE = 100;
  const domainsToAnalyze = referringDomains.slice(0, MAX_DOMAINS_TO_ANALYZE);
  const domainsString = domainsToAnalyze.join(", ");

  // Define the desired JSON structure
  const jsonStructure = {
    backlinkQualitySummary: {
      highQualityCount: "[Number Estimate]",
      mediumQualityCount: "[Number Estimate]",
      lowQualityCount: "[Number Estimate]",
      spammyCount: "[Number Estimate]",
      notes:
        "[Brief summary of overall backlink quality profile based on the sample, e.g., Mostly medium quality with some low-quality links detected.]",
    },
  };

  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT. " +
    "Analyze the following sample list of referring domains and estimate the distribution of their quality. Categorize them into High, Medium, Low, or Spammy based on general domain reputation, relevance (assume general business context if specific industry isn't provided), and common patterns associated with link quality.\n\n" +
    `Referring Domains Sample (${domainsToAnalyze.length} domains):\n${domainsString}\n\n` +
    "Provide counts for each quality category based on your analysis of this sample.\n\n" +
    "Required JSON Structure (Respond with ONLY this structure, filled in):\n" +
    JSON.stringify(jsonStructure, null, 2) +
    "\n\n" +
    "REMEMBER: ONLY the valid JSON object is required.";

  return prompt;
}
