// src/app/api/analysis/prompts/seoSections/technicalSeo.js
export const getTechnicalSeoStructure = (
  // getInsitesTechnicalIssues, // No longer needed here
  competitorsString
) => ({
  // Provide a placeholder structure for Gemini to fill
  topIssues: [
    {
      issueType: "[e.g., Broken Internal Links]",
      severity: "[High/Medium/Low Estimate]",
      recommendation: "[Brief, actionable recommendation]",
      countEst: "[Number Estimate, e.g., 15]",
    },
    {
      issueType: "[e.g., Missing Alt Text]",
      severity: "[Medium Estimate]",
      recommendation: "[Brief, actionable recommendation]",
      countEst: "[Number Estimate, e.g., 45]",
    },
    // Add more placeholders if desired, but 2-3 is usually enough
  ],
  crawlabilityScoreEst: "[1-100 Estimate]",
  indexationRateEst: "[% Estimate]",
  schemaMarkupCoverageEst: "[% Estimate]",
  schemaTypesFound: ["[e.g., LocalBusiness]", "[e.g., Product]", "[etc.]"], // Added field
  technicalComparisonVsCompetitors:
    "[e.g., Fewer errors, better schema than " +
    (competitorsString || "[Competitor Estimate]") +
    " Estimate]",
});
