// src/app/api/analysis/prompts/seoSections/contentAnalysis.js
export const getContentAnalysisStructure = (
  apolloData,
  contentFreshness,
  getInsitesPages,
  getApolloKeywords,
  competitorsString
) => ({
  relevanceFocus: "UK",
  summary: [
    {
      metric: "Overall Quality (Est.)",
      scoreOrValue: "[1-100 Estimate]",
      notes:
        "[Brief assessment Estimate, consider company description: " + // Removed Apollo name
        (apolloData?.description?.substring(0, 100) || "N/A") +
        "...]",
    },
    {
      metric: "Content Gaps Identified (UK)",
      scoreOrValue: "[# Estimate]",
      notes:
        "[Key UK topics missing Estimate, consider company keywords: " + // Removed Apollo name
        getApolloKeywords(3).join(", ") +
        "]",
    },
    {
      metric: "E-E-A-T Signals (Est.)",
      scoreOrValue: "[Strong/Moderate/Weak Estimate]",
      notes: "[Evidence Estimate, e.g., author bios, expert quotes]",
    },
    {
      metric: "Content Freshness",
      scoreOrValue: contentFreshness,
      notes: "[Note Estimate or null]",
    },
    {
      metric: "Internal Linking (Est.)",
      scoreOrValue: "[Good/Fair/Poor Estimate]",
      notes: "[Opportunities Estimate]",
    },
    {
      // Added Readability Metric
      metric: "Readability (Est.)",
      scoreOrValue: "[e.g., Standard / Grade 9]",
      notes: "[Assessment based on complexity, sentence length etc.]",
    },
  ],
  topContentPiecesUK: getInsitesPages(3).map((url, i) => ({
    url: url,
    keyMetric:
      i === 0
        ? "UK Sessions Est."
        : i === 1
        ? "Avg. Time on Page Est."
        : "Conversion Rate Est.",
    value: "[# or mm:ss or % Estimate]",
  })),
  contentVsCompetitorsUK:
    "[e.g., More UK-specific content than " +
    (competitorsString || "[Competitor Estimate]") +
    " Estimate]",
});
