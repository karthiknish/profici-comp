import { GoogleGenerativeAI } from "@google/generative-ai";
import { getJsonSafe } from "./analysisUtils.js"; // Import helper

// Import all prompt generation functions
import { getExecutiveSummaryPrompt } from "./prompts/executiveSummaryPrompt.js";
import { getKeywordRankingsPrompt } from "./prompts/keywordRankingsPrompt.js";
import { getOrganicTrafficPrompt } from "./prompts/organicTrafficPrompt.js";
import { getBacklinkProfilePrompt } from "./prompts/backlinkProfilePrompt.js";
import { getPageSpeedMobilePrompt } from "./prompts/pageSpeedMobilePrompt.js";
import { getContentAnalysisPrompt } from "./prompts/contentAnalysisPrompt.js";
import { getKeywordGapAnalysisPrompt } from "./prompts/keywordGapAnalysisPrompt.js";
import { getTechnicalSeoPrompt } from "./prompts/technicalSeoPrompt.js";
import { getBacklinkQualityPrompt } from "./prompts/backlinkQualityPrompt.js"; // Import new prompt
import { getLocalSeoPrompt } from "./prompts/localSeoPrompt.js";
import { getEcommerceSeoPrompt } from "./prompts/ecommerceSeoPrompt.js";
import { getCompetitorPrompt } from "./prompts/competitorPrompt.js";
import { getMarketPotentialPrompt } from "./prompts/marketPotentialPrompt.js";
import { getMarketCapPrompt } from "./prompts/marketCapPrompt.js";
import { getRecommendationsPrompt } from "./prompts/recommendationsPrompt.js";
import { getTrendsPrompt } from "./prompts/trendsPrompt.js";
import { getSocialMediaPrompt } from "./prompts/socialMediaPrompt.js";

// Function to prepare all prompts
const preparePrompts = (
  payload,
  apolloData,
  competitorsApolloData,
  combinedAnalysisForRecs
) => {
  const {
    website,
    detectedName,
    detectedIndustry,
    competitors,
    insitesReport,
  } = payload;
  const businessName = detectedName || website;
  const industry = detectedIndustry || "the provided industry";
  const competitorsString = competitors?.join(", ") || "[Competitors N/A]";

  // Prepare data points needed by some prompts
  const avgMonthlyTrafficEst =
    insitesReport?.traffic?.monthly_visits_estimate || "[Not Available]";
  const totalBacklinksEst = insitesReport?.backlinks?.total || 0;
  const referringDomainsEst =
    insitesReport?.backlinks?.referring_domains_count || 0;
  const hasSpammyBacklinksEst = insitesReport?.backlinks?.has_spammy_backlinks
    ? "High Est."
    : "Low Est.";
  const isMobileFriendlyEst = insitesReport?.mobile?.is_mobile ? "Yes" : "No";
  const contentFreshnessEst = "Moderate Est."; // Placeholder
  const directoriesFoundEst = "[Not Available]"; // Placeholder
  const avgReviewEst = insitesReport?.reviews?.average_rating || null;
  const reviewCountEst = insitesReport?.reviews?.count || 0;
  const isEcommerceEst = insitesReport?.ecommerce?.is_ecommerce || false;

  // Helper functions using available data
  const getApolloKeywords = (count = 5) =>
    apolloData?.keywords?.slice(0, count) || ["relevant keyword estimate"];
  const getInsitesKeywords = (count = 5) =>
    insitesReport?.organic_search?.keywords
      ?.slice(0, count)
      .map((k) => k.keyword) || ["relevant keyword estimate"];
  const getInsitesPages = (count = 5) => {
    const pages =
      insitesReport?.pages?.filter((p) => p.url)?.map((p) => p.url) || [];
    while (pages.length < count)
      pages.push(`/example-page-${pages.length + 1}`);
    return pages.slice(0, count);
  };
  const getInsitesReferringDomains = (count = 5) => {
    const domains =
      insitesReport?.backlinks?.referring_domains
        ?.filter((d) => d.domain)
        ?.map((d) => d.domain) || [];
    while (domains.length < count)
      domains.push(`example-referrer-${domains.length + 1}.co.uk`);
    return domains.slice(0, count);
  };
  const getInsitesOpportunities = (count = 5) =>
    insitesReport?.organic_search?.best_keyword_opportunities
      ?.slice(0, count)
      .map((k) => k.keyword) || ["opportunity keyword estimate"];
  const getInsitesReferringDomainsList = () =>
    // Helper to get full list for quality check
    insitesReport?.backlinks?.referring_domains
      ?.map((d) => d.domain)
      .filter(Boolean) || [];
  const getInsitesTechnicalIssues = (count = 5) => {
    /* Placeholder logic from route.js */ return [];
  };

  // Generate all prompts
  const prompts = {
    executiveSummary: getExecutiveSummaryPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData
    ),
    keywordRankings: getKeywordRankingsPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData,
      getApolloKeywords,
      getInsitesKeywords
    ),
    backlinkQuality: getBacklinkQualityPrompt(getInsitesReferringDomainsList()), // Add new prompt call
    organicTraffic: getOrganicTrafficPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData,
      avgMonthlyTrafficEst,
      getInsitesPages
    ),
    backlinkProfile: getBacklinkProfilePrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData,
      totalBacklinksEst,
      referringDomainsEst,
      hasSpammyBacklinksEst,
      getInsitesReferringDomains
    ),
    pageSpeedMobile: getPageSpeedMobilePrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData,
      isMobileFriendlyEst
    ),
    contentAnalysis: getContentAnalysisPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData,
      contentFreshnessEst,
      getInsitesPages,
      getApolloKeywords
    ),
    keywordGapAnalysis: getKeywordGapAnalysisPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData,
      getInsitesOpportunities,
      getApolloKeywords
    ),
    technicalSeo: getTechnicalSeoPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData,
      getInsitesTechnicalIssues
    ),
    localSeo: getLocalSeoPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData,
      directoriesFoundEst,
      avgReviewEst,
      reviewCountEst
    ),
    ecommerceSeo: getEcommerceSeoPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData,
      isEcommerceEst
    ), // This might return an object
    competitor: getCompetitorPrompt(
      businessName,
      website,
      industry,
      competitors,
      competitorsString,
      insitesReport,
      apolloData,
      competitorsApolloData
    ),
    marketPotential: getMarketPotentialPrompt(
      businessName,
      website,
      industry,
      insitesReport,
      apolloData
    ),
    marketCap: getMarketCapPrompt(
      businessName,
      website,
      industry,
      insitesReport,
      apolloData
    ),
    recommendations: getRecommendationsPrompt(
      businessName,
      website,
      industry,
      combinedAnalysisForRecs
    ),
    trends: getTrendsPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData
    ),
    socialMedia: getSocialMediaPrompt(
      businessName,
      website,
      industry,
      competitorsString,
      insitesReport,
      apolloData
    ),
  };

  return prompts;
};

// Function to call Gemini API for all prompts
const callGeminiApi = async (prompts) => {
  // Revert to using single API key from environment
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error(
      "Configuration error: GEMINI_API_KEY environment variable is missing."
    );
  }
  const geminiApi = new GoogleGenerativeAI(geminiApiKey);
  const model = geminiApi.getGenerativeModel({ model: "gemini-2.0-flash" });

  const seoPromptKeys = [
    "executiveSummary",
    "keywordRankings",
    "organicTraffic",
    "backlinkProfile",
    "backlinkQuality", // Add new key
    "pageSpeedMobile",
    "contentAnalysis",
    "keywordGapAnalysis",
    "technicalSeo",
    "localSeo",
  ];
  const otherPromptKeys = [
    "competitor",
    "marketPotential",
    "marketCap",
    "recommendations",
    "trends",
    "socialMedia",
  ];

  const seoPromises = seoPromptKeys.map((key) =>
    model.generateContent(prompts[key])
  );
  // Handle ecommerceSeo separately as it might be an object
  if (typeof prompts.ecommerceSeo === "string") {
    seoPromises.push(model.generateContent(prompts.ecommerceSeo));
  } else {
    seoPromises.push(
      Promise.resolve({
        status: "fulfilled",
        value: {
          response: { text: () => JSON.stringify(prompts.ecommerceSeo) },
        },
      })
    );
  }

  const otherPromises = otherPromptKeys.map((key) =>
    model.generateContent(prompts[key])
  );

  console.log("Sending SEO prompts to Gemini...");
  const seoResults = await Promise.allSettled(seoPromises);
  console.log("Received SEO responses from Gemini.");

  console.log("Sending other prompts to Gemini...");
  const otherResults = await Promise.allSettled(otherPromises);
  console.log("Received other responses from Gemini.");

  // Map results back to keys
  const allResults = {};
  seoPromptKeys.forEach((key, index) => (allResults[key] = seoResults[index]));
  allResults.ecommerceSeo = seoResults[seoPromptKeys.length]; // Add ecommerce result
  otherPromptKeys.forEach(
    (key, index) => (allResults[key] = otherResults[index])
  );

  return allResults;
};

// Function to process API results
const processApiResults = (apiResults) => {
  const processed = {};
  const processResult = (result, name) => {
    if (result.status === "fulfilled") {
      if (!result.value) {
        console.error(
          `Fulfilled promise for ${name} has null/undefined value.`
        );
        return {
          error: `AI analysis for ${name} completed but returned no value.`,
        };
      }
      return getJsonSafe(result.value, name);
    } else {
      console.error(`Promise rejected for ${name}:`, result.reason);
      const errorMessage =
        result.reason?.message ||
        String(result.reason) ||
        "Unknown rejection reason";
      return { error: `Failed to generate ${name}. Reason: ${errorMessage}` };
    }
  };

  processed.executiveSummaryJson = processResult(
    apiResults.executiveSummary,
    "Executive Summary"
  );
  processed.keywordRankingsJson = processResult(
    apiResults.keywordRankings,
    "Keyword Rankings"
  );
  processed.organicTrafficJson = processResult(
    apiResults.organicTraffic,
    "Organic Traffic"
  );
  processed.backlinkProfileJson = processResult(
    apiResults.backlinkProfile,
    "Backlink Profile"
  );
  processed.backlinkQualityJson = processResult(
    // Process new result
    apiResults.backlinkQuality,
    "Backlink Quality"
  );
  processed.pageSpeedMobileJson = processResult(
    apiResults.pageSpeedMobile,
    "Page Speed & Mobile"
  );
  processed.contentAnalysisJson = processResult(
    apiResults.contentAnalysis,
    "Content Analysis"
  );
  // console.log("Processed contentAnalysisJson:", processed.contentAnalysisJson); // Remove DEBUG LOG
  processed.keywordGapAnalysisJson = processResult(
    apiResults.keywordGapAnalysis,
    "Keyword Gap Analysis"
  );
  // console.log(
  //   "Processed keywordGapAnalysisJson:",
  //   processed.keywordGapAnalysisJson
  // ); // Remove DEBUG LOG
  processed.technicalSeoJson = processResult(
    apiResults.technicalSeo,
    "Technical SEO"
  );
  processed.localSeoJson = processResult(apiResults.localSeo, "Local SEO");
  processed.ecommerceSeoJson = processResult(
    apiResults.ecommerceSeo,
    "E-commerce SEO"
  );
  processed.competitorJson = processResult(
    apiResults.competitor,
    "Competitor Analysis"
  );
  processed.marketPotentialJson = processResult(
    apiResults.marketPotential,
    "Market Potential"
  );
  processed.marketCapJson = processResult(apiResults.marketCap, "Market Cap");
  processed.recommendationsJson = processResult(
    apiResults.recommendations,
    "Recommendations"
  );
  processed.trendsJson = processResult(apiResults.trends, "Search Trends");
  processed.socialMediaJson = processResult(
    apiResults.socialMedia,
    "Social Media"
  );
  console.log("Processed socialMediaJson:", processed.socialMediaJson); // DEBUG LOG

  return processed;
};

// Function to assemble the final report structure
const assembleFinalReport = (
  processedResults,
  payload,
  apolloData,
  insitesReport
) => {
  const {
    executiveSummaryJson,
    keywordRankingsJson,
    organicTrafficJson,
    backlinkProfileJson,
    pageSpeedMobileJson,
    contentAnalysisJson,
    keywordGapAnalysisJson,
    backlinkQualityJson, // Add new processed result
    technicalSeoJson,
    localSeoJson,
    ecommerceSeoJson,
    competitorJson,
    marketPotentialJson,
    marketCapJson,
    recommendationsJson,
    trendsJson,
    socialMediaJson,
  } = processedResults;
  const businessName = payload.detectedName || payload.website;

  const assembledSeoAnalysis = {
    executiveSummaryUK:
      executiveSummaryJson?.executiveSummaryUK ?? executiveSummaryJson,
    keywordRankingsUK: {
      // Prioritize Gemini data for topKeywords, fallback to Insites
      topKeywords:
        Array.isArray(keywordRankingsJson?.topKeywords) &&
        keywordRankingsJson.topKeywords.length > 0
          ? keywordRankingsJson.topKeywords
          : (
              insitesReport?.organic_search?.top_keywords_ranked_for_detail ??
              []
            )
              .filter((k) => k?.position != null)
              .map((k) => ({
                keywordUKFocus: k.term ?? "N/A", // Map from 'term'
                rankingUK: k.position, // Map from 'position'
                searchVolumeUK: k.monthly_queries_for_term ?? null, // Map from 'monthly_queries_for_term'
                difficultyUK: null, // Insites doesn't provide this directly
                opportunityUK: null, // Insites doesn't provide this directly
                estimatedTrafficUK: null, // Insites doesn't provide this directly
              })),
      // Use Gemini data primarily for distribution
      distributionSummaryUK: keywordRankingsJson?.distributionSummaryUK ?? null,
      // Keep sourcing these from Gemini response
      intentBreakdownUK: keywordRankingsJson?.intentBreakdownUK ?? null,
      keywordOverlapUK: keywordRankingsJson?.keywordOverlapUK ?? null,
      apolloKeywords: apolloData?.keywords ?? [], // Keep raw Apollo list
      // Keep error handling from Gemini response
      ...(keywordRankingsJson?.error && { error: keywordRankingsJson.error }),
    },
    organicTrafficUK:
      organicTrafficJson?.organicTrafficUK ?? organicTrafficJson,
    backlinkProfileUK: {
      // Structure as object to hold multiple parts
      ...(backlinkProfileJson?.backlinkProfileUK || backlinkProfileJson), // Spread existing data
      qualitySummary: backlinkQualityJson?.backlinkQualitySummary ?? null, // Add quality summary
    },
    pageSpeedMobileUK:
      pageSpeedMobileJson?.pageSpeedMobileUK || pageSpeedMobileJson,
    // Assign the INNER object from the parsed JSON
    contentAnalysisUK:
      contentAnalysisJson?.contentAnalysisUK ?? contentAnalysisJson, // Use inner object, fallback to full if needed
    keywordGapAnalysisUK:
      keywordGapAnalysisJson?.keywordGapAnalysisUK ?? keywordGapAnalysisJson, // Use inner object, fallback to full if needed
    technicalSeoUK: technicalSeoJson?.technicalSeoUK || technicalSeoJson,
    localSeoUK: localSeoJson?.localSeoUK || localSeoJson,
    ecommerceSeoUK: ecommerceSeoJson?.ecommerceSeoUK || ecommerceSeoJson,
  };

  const finalResults = {
    seoAnalysis: assembledSeoAnalysis,
    competitorAnalysis: competitorJson,
    marketPotential: marketPotentialJson,
    marketCap: marketCapJson,
    recommendations: recommendationsJson,
    searchTrends: trendsJson,
    socialMedia: socialMediaJson,
    detectedName: businessName,
    businessName: businessName,
    apolloData: apolloData,
    seoVisualData: {
      healthScore: insitesReport?.overall_score ?? null,
      toxicBacklinks: insitesReport?.backlinks?.has_spammy_backlinks
        ? "High Est."
        : "Low Est.",
      indexationRate: insitesReport?.spider?.indexation_rate ?? null,
      schemaCoverage: insitesReport?.spider?.schema_coverage ?? null,
      mobileFriendly: insitesReport?.mobile?.is_mobile ? "Yes" : "No",
      pageSpeedDesktop: insitesReport?.pagespeed?.desktop?.score ?? null,
      pageSpeedMobile: insitesReport?.pagespeed?.mobile?.score ?? null,
      technologyDetection: insitesReport?.technology_detection ?? null,
      // --- Calculate Estimated Traffic Value ---
      estimatedTrafficValueGBP: (() => {
        const keywords = assembledSeoAnalysis.keywordRankingsUK?.topKeywords;
        if (!Array.isArray(keywords) || keywords.length === 0) return null;

        // Simplified CTR estimation based on position (adjust as needed)
        const getCtr = (position) => {
          if (position === 1) return 0.28; // ~28%
          if (position <= 3) return 0.15; // ~15%
          if (position <= 5) return 0.06; // ~6%
          if (position <= 10) return 0.025; // ~2.5%
          return 0.005; // Assume low CTR for others
        };

        let totalValue = 0;
        keywords.forEach((kw) => {
          const volume = parseFloat(kw.searchVolumeUK);
          const position = parseInt(kw.rankingUK, 10);
          // Extract numeric CPC value (handle '£', ',', etc.)
          const cpcString = kw.estimatedCPC_GBP || "0";
          const cpc = parseFloat(cpcString.replace(/[^0-9.]/g, ""));

          if (
            !isNaN(volume) &&
            !isNaN(position) &&
            !isNaN(cpc) &&
            volume > 0 &&
            cpc > 0
          ) {
            const ctr = getCtr(position);
            const estimatedClicks = volume * ctr;
            totalValue += estimatedClicks * cpc;
          }
        });
        return totalValue > 0 ? Math.round(totalValue) : null; // Return rounded monthly value or null
      })(),
      // --- End Estimated Traffic Value ---
      // Revert visual data source for keywordDistribution to use Gemini data primarily
      keywordDistribution: keywordRankingsJson?.distributionSummaryUK
        ? [
            {
              name: "Top 3",
              value:
                parseFloat(
                  keywordRankingsJson.distributionSummaryUK.positions1to3
                    ?.percentage
                ) || 0,
            },
            {
              name: "4-10",
              value:
                parseFloat(
                  keywordRankingsJson.distributionSummaryUK.positions4to10
                    ?.percentage
                ) || 0,
            },
            {
              name: "11-20",
              value:
                parseFloat(
                  keywordRankingsJson.distributionSummaryUK.positions11to20
                    ?.percentage
                ) || 0,
            },
            {
              name: "21-50",
              value:
                parseFloat(
                  keywordRankingsJson.distributionSummaryUK.positions21to50
                    ?.percentage
                ) || 0,
            },
            {
              name: "51-100",
              value:
                parseFloat(
                  keywordRankingsJson.distributionSummaryUK.positions51to100
                    ?.percentage
                ) || 0,
            },
          ].filter((item) => item.value > 0)
        : [], // Default to empty array if Gemini data is missing
    },
    seoChartData: {
      // Revert chart data source back to Insites report for keyword names
      keywordRankings: (
        insitesReport?.organic_search?.top_keywords_ranked_for_detail ?? []
      )
        .filter((k) => k?.position != null) // Filter out items without a position
        .map((k) => ({
          keyword: k.term ?? "N/A", // Use 'term' from Insites structure
          ranking: k.position, // Use position from Insites
          volume: k?.monthly_queries_for_term ?? null, // Use 'monthly_queries_for_term' from Insites
        })),
      // Add traffic trend data from Insites report if available
      trafficTrend: (insitesReport?.traffic?.traffic_trend ?? [])
        .map((t) => ({
          month: t.month, // Assuming 'month' field exists
          visits: t.visits, // Assuming 'visits' field exists
        }))
        .filter((t) => t.month && t.visits != null), // Ensure valid data
    },
  };

  return finalResults;
};

export {
  preparePrompts,
  callGeminiApi,
  processApiResults,
  assembleFinalReport,
};
