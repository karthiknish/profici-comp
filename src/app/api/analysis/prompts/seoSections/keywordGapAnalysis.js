// src/app/api/analysis/prompts/seoSections/keywordGapAnalysis.js
export const getKeywordGapAnalysisStructure = (
  getInsitesOpportunities,
  getApolloKeywords,
  competitorsString,
  businessName
) => ({
  focus: "UK",
  topOpportunities: [
    {
      keyword:
        getInsitesOpportunities(1)[0] || "[Opportunity Keyword 1 Estimate]",
      volumeUK: "[# from data or Est.]", // Generic source
      difficultyEst: "[1-100 Estimate]",
      relevance: "[High/Med/Low Estimate]",
      potential: "[High/Med/Low Estimate]",
    },
    {
      keyword: "[" + getApolloKeywords(1)[0] + " (Not Ranking Estimate)]", // Keep helper for example
      volumeUK: "[# Estimate]",
      difficultyEst: "[1-100 Estimate]",
      relevance: "[High/Med/Low Estimate]",
      potential: "[High/Med/Low Estimate]",
    },
    {
      keyword:
        getInsitesOpportunities(2)[1] || "[Opportunity Keyword 2 Estimate]",
      volumeUK: "[# from data or Est.]", // Generic source
      difficultyEst: "[1-100 Estimate]",
      relevance: "[High/Med/Low Estimate]",
      potential: "[High/Med/Low Estimate]",
    },
    {
      keyword: "[" + getApolloKeywords(2)[1] + " (Low Ranking Estimate)]", // Keep helper for example
      volumeUK: "[# Estimate]",
      difficultyEst: "[1-100 Estimate]",
      relevance: "[High/Med/Low Estimate]",
      potential: "[High/Med/Low Estimate]",
    },
    {
      keyword: "[Competitor keyword Estimate]",
      volumeUK: "[# Estimate]",
      difficultyEst: "[1-100 Estimate]",
      relevance: "[High/Med/Low Estimate]",
      potential: "[High/Med/Low Estimate]",
    },
  ],
  totalMissingKeywordsVsCompetitorsUK: "[# Estimate]",
  featuredSnippetOpportunitiesUK: "[# Estimate]",
  gapAnalysisVsCompetitorsUK:
    "[Key themes where " +
    (competitorsString || "[Competitor Estimate]") +
    " ranks but " +
    businessName +
    " doesn't Estimate]",
});
