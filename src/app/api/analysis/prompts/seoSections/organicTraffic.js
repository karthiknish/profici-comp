// src/app/api/analysis/prompts/seoSections/organicTraffic.js
export const getOrganicTrafficStructure = (
  avgMonthlyTraffic,
  getInsitesPages,
  apolloData,
  competitorsString
) => ({
  metricsSummary: [
    {
      metric: "Monthly Sessions (UK Est.)",
      value: avgMonthlyTraffic,
      ukIndustryBenchmark: "[# Estimate]",
      comparison:
        "[Above/Below/Avg Estimate, consider Alexa rank: " + // Removed Apollo name
        (apolloData?.alexa_ranking || "N/A") +
        "]",
    },
    {
      metric: "YoY Growth (UK Est.)",
      value: "[% Estimate]",
      ukIndustryBenchmark: "[% Estimate]",
      comparison: "[Above/Below/Avg Estimate]",
    },
    {
      metric: "Bounce Rate (UK Est.)",
      value: "[% Estimate]",
      ukIndustryBenchmark: "[% Estimate]",
      comparison: "[Above/Below/Avg Estimate]",
    },
    {
      metric: "Avg Session Duration (UK Est.)",
      value: "[minutes:seconds Estimate]",
      ukIndustryBenchmark: "[minutes:seconds Estimate]",
      comparison: "[Above/Below/Avg Estimate]",
    },
    {
      metric: "Pages per Session (UK Est.)",
      value: "[# Estimate]",
      ukIndustryBenchmark: "[# Estimate]",
      comparison: "[Above/Below/Avg Estimate]",
    },
  ],
  topLandingPagesUK: getInsitesPages(5).map((url) => ({
    url: url,
    trafficPercentUK: "[% Estimate]",
    bouncePercentEst: "[% Estimate]",
    conversionPercentEst: "[% Estimate]",
  })),
  topExitPagesUK: getInsitesPages(5).map((url) => ({
    url: url,
    exitPercentUK: "[% Estimate]",
  })),
  deviceBreakdownUK: {
    desktopPercent: "[% Estimate based on Insites mobile]",
    mobilePercent: "[% Estimate based on Insites mobile]",
    tabletPercent: "[% Estimate based on Insites mobile]",
  },
  geographicDistributionUK: [
    {
      regionOrCity:
        "[Region/City 1 Estimate, consider company location: " + // Removed Apollo name
        (apolloData?.city || "N/A") +
        ", " +
        (apolloData?.country || "N/A") +
        "]",
      percent: "[% Estimate]",
    },
    { regionOrCity: "[Region/City 2 Estimate]", percent: "[% Estimate]" },
    { regionOrCity: "[Region/City 3 Estimate]", percent: "[% Estimate]" },
  ],
  trafficVsCompetitorsUK:
    "[e.g., +X% more/less vs " +
    (competitorsString || "[Competitor Estimate]") +
    " Estimate]",
});
