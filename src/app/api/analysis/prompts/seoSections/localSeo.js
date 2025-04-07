// src/app/api/analysis/prompts/seoSections/localSeo.js
export const getLocalSeoStructure = (
  apolloData,
  directoriesFound,
  avgReview,
  reviewCount,
  competitorsString
) => ({
  applicable: "[true/false Estimate based on business type/location]",
  summary: [
    {
      metric: "Google Business Profile (UK)",
      scoreOrValue: "[1-100 Estimate]",
      notes:
        "[UK optimisation points Estimate, consider company location: " + // Removed Apollo name
        (apolloData?.city || "N/A") +
        "]",
    },
    {
      metric: "Citation Consistency (UK)",
      scoreOrValue: "[% Estimate]",
      notes: "Top UK directories checked: " + directoriesFound,
    },
    {
      metric: "Local Rankings (UK Avg)",
      scoreOrValue: "[# Estimate]",
      notes: "[Key UK cities/regions Estimate]",
    },
    {
      metric: "Reviews (UK Avg Rating)",
      scoreOrValue: avgReview,
      notes: "# UK Reviews: " + reviewCount,
    },
  ],
  localSeoVsCompetitorsUK:
    "[Key differences vs " +
    (competitorsString || "[Competitor Estimate]") +
    " in UK local signals Estimate]",
});
