// src/app/api/analysis/prompts/seoSections/executiveSummary.js
export const getExecutiveSummaryStructure = (
  apolloData,
  industry,
  competitorsString
) => ({
  seoHealthScoreUK:
    "[0-100] (Estimate based on overall score, backlinks, tech issues, and Alexa rank: " +
    (apolloData?.alexa_ranking || "N/A") +
    ")", // Removed Insites/Apollo names
  topStrengthsUK: [
    "[Strength 1 Estimate based on keywords, domain age, analytics presence, and company info like founded year: " + // Removed Insites/Apollo names
      (apolloData?.founded_year || "N/A") +
      ", employees: " +
      (apolloData?.estimated_num_employees || "N/A") +
      "]",
    "[Strength 2 Estimate]",
    "[Strength 3 Estimate]",
  ],
  topWeaknessesUK: [
    "[Weakness 1 Estimate based on thin content, mobile issues, backlink toxicity]", // Removed Insites name
    "[Weakness 2 Estimate]",
    "[Weakness 3 Estimate]",
  ],
  priorityRecommendationsUK: [
    { action: "[Recommendation 1 Estimate]", impactPercent: "[% Estimate]" },
    { action: "[Recommendation 2 Estimate]", impactPercent: "[% Estimate]" },
    { action: "[Recommendation 3 Estimate]", impactPercent: "[% Estimate]" },
  ],
  competitivePositionUK:
    "[Rank/position in UK " +
    industry +
    " Estimate, consider company revenue: " + // Removed Apollo name
    (apolloData?.annual_revenue_printed || "N/A") +
    "]",
  competitorComparisonUK:
    "[Brief comparison vs " +
    (competitorsString || "[Competitor Estimate]") +
    " Estimate]",
});
