// src/app/api/analysis/prompts/seoSections/backlinkProfile.js
export const getBacklinkProfileStructure = (
  totalBacklinks,
  referringDomains,
  hasSpammyBacklinks,
  getInsitesReferringDomains,
  competitorsString
) => ({
  relevanceFocus: "UK",
  metricsSummary: [
    {
      metric: "Total Backlinks",
      value: totalBacklinks,
      ukIndustryAvg: "[# Estimate]",
      comparison: "[Above/Below/Avg Estimate]",
    },
    {
      metric: "Referring Domains (.uk preferred)",
      value: referringDomains,
      ukIndustryAvg: "[# Estimate]",
      comparison: "[Above/Below/Avg Estimate]",
    },
    {
      metric: "Domain Authority (Est.)",
      value: "[1-100 Estimate]",
      ukIndustryAvg: "[1-100 Estimate]",
      comparison: "[Above/Below/Avg Estimate]",
    },
    {
      metric: "Toxic Backlinks (%)",
      value: hasSpammyBacklinks,
      ukIndustryAvg: "[% Estimate]",
      comparison: "[Above/Below/Avg Estimate]",
    },
    {
      metric: "Link Velocity (Est.)",
      value: "[+/- #/mo Estimate]",
      ukIndustryAvg: "[+/- #/mo Estimate]",
      comparison: "[Above/Below/Avg Estimate]",
    },
  ],
  topReferringDomainsUK: getInsitesReferringDomains(5).map((domain) => ({
    domain: domain,
    daEstimate: "[1-100 Estimate]",
    linkValueEstimate: "[High/Med/Low Estimate]",
  })),
  anchorTextDistributionUK: [
    { type: "[Branded Estimate]", percentEstimate: "[% Estimate]" },
    { type: "[Exact Match Estimate]", percentEstimate: "[% Estimate]" },
    { type: "[Generic Estimate]", percentEstimate: "[% Estimate]" },
    { type: "[Other Estimate]", percentEstimate: "[% Estimate]" },
  ],
  competitorBacklinkGapUK: "[# Estimate] opportunities",
  backlinkComparisonVsCompetitorsUK:
    "[e.g., More .uk domains than " +
    (competitorsString || "[Competitor Estimate]") +
    " Estimate]",
});
