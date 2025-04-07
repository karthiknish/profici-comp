// src/app/api/analysis/prompts/seoSections/keywordRankings.js
export const getKeywordRankingsStructure = (
  getApolloKeywords, // Keep one instance
  // Removed duplicate getApolloKeywords
  getInsitesKeywords,
  competitorsString
) => ({
  // Simplified placeholder structure, emphasizing array of objects
  topKeywords: [
    {
      keywordUKFocus: "[Top Keyword Estimate 1]",
      rankingUK: "[# Estimate]",
      searchVolumeUK: "[# Estimate]",
      difficultyUK: "[1-100 Estimate]",
      opportunityUK: "[1-10 Estimate]",
      estimatedTrafficUK: "[# Estimate]",
      estimatedCPC_GBP: "[£#.## Estimate]", // Added CPC field
    },
    {
      keywordUKFocus: "[Top Keyword Estimate 2]",
      rankingUK: "[# Estimate]",
      searchVolumeUK: "[# Estimate]",
      difficultyUK: "[1-100 Estimate]",
      opportunityUK: "[1-10 Estimate]",
      estimatedTrafficUK: "[# Estimate]",
      estimatedCPC_GBP: "[£#.## Estimate]", // Added CPC field
    },
    // Add more placeholders if needed, but keep structure clear
  ],
  distributionSummaryUK: {
    positions1to3: {
      percentage: "[% Estimate]",
      momChange: "[+/- # Estimate]",
      notes: "[e.g., Cannibalisation Estimate]", // Keep example note
    },
    positions4to10: {
      percentage: "[% Estimate]",
      momChange: "[+/- # Estimate]",
      notes: "[Note Estimate or null]",
    },
    positions11to20: {
      percentage: "[% Estimate]",
      momChange: "[+/- # Estimate]",
      notes: "[Note Estimate or null]",
    },
    positions21to50: {
      percentage: "[% Estimate]",
      momChange: "[+/- # Estimate]",
      notes: "[Note Estimate or null]",
    },
    positions51to100: {
      percentage: "[% Estimate]",
      momChange: "[+/- # Estimate]",
      notes: "[Note Estimate or null]",
    },
  },
  intentBreakdownUK: {
    informationalPercent: "[% Estimate]", // Based on keyword analysis
    navigationalPercent: "[% Estimate]", // Based on keyword analysis
    transactionalPercent: "[% Estimate]", // Based on keyword analysis
    commercialPercent: "[% Estimate]", // Based on keyword analysis
  },
  keywordOverlapUK: {
    competitors: competitorsString || "[Competitor Estimate]",
    overlapPercent: "[% Estimate]",
  },
});
