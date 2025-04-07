// IMPORTANT: Respond *only* with the requested JSON object below. Do not include any introductory sentences, explanations, code block markers (```json ... ```), or conversational text. Replace ALL placeholders indicating estimates (like "Estimate...", "[Estimate #]", "[% Estimate]", "[+/- # Estimate]", "[High/Med/Low]", "[Good/Fair/Poor]", "[Above/Below/Avg]", "[Strong/Moderate/Weak]", "[Actionable Insight]", "[Brief action]", etc.) with realistic, specific, estimated numerical values or textual information based on the provided context. Use UK English spelling (e.g., analyse, optimisation, behaviour, centre). Focus all data, analysis, and estimations specifically on the **United Kingdom (UK)** market for the given business. Use the provided report data and company data snippets for context where relevant.

import { getExecutiveSummaryStructure } from "./seoSections/executiveSummary.js";
import { getKeywordRankingsStructure } from "./seoSections/keywordRankings.js";
import { getOrganicTrafficStructure } from "./seoSections/organicTraffic.js";
import { getBacklinkProfileStructure } from "./seoSections/backlinkProfile.js";
import { getPageSpeedMobileStructure } from "./seoSections/pageSpeedMobile.js";
import { getContentAnalysisStructure } from "./seoSections/contentAnalysis.js";
import { getKeywordGapAnalysisStructure } from "./seoSections/keywordGapAnalysis.js";
import { getTechnicalSeoStructure } from "./seoSections/technicalSeo.js";
import { getLocalSeoStructure } from "./seoSections/localSeo.js";
import { getEcommerceSeoStructure } from "./seoSections/ecommerceSeo.js";

export function getSeoPromptJson( // Renamed back
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport, // Pass the report object directly
  apolloData // Add apolloData parameter
) {
  // Safely access nested properties from insitesReport & Apollo
  const avgMonthlyTraffic =
    insitesReport?.organic_search?.average_monthly_traffic || "[# Estimate]";
  const totalBacklinks =
    insitesReport?.backlinks?.total_backlinks || "[# Estimate]";
  const referringDomains =
    insitesReport?.backlinks?.total_websites_linking || "[# Estimate]";
  const hasSpammyBacklinks = insitesReport?.backlinks?.has_spammy_backlinks
    ? "High Est."
    : "Low Est.";
  const isMobileFriendly = insitesReport?.mobile?.is_mobile
    ? "Good Est."
    : "Poor Est.";
  const contentFreshness = insitesReport?.last_updated?.days_since_update
    ? "Good Est. (Updated " +
      insitesReport.last_updated.days_since_update +
      " days ago)"
    : "Needs Update Est.";
  const directoriesFound =
    insitesReport?.local_presence?.directories_found?.join(", ") || "N/A";
  const avgReview = insitesReport?.reviews_normalised?.average_review || "N/A";
  const reviewCount =
    insitesReport?.reviews_normalised?.reviews_found_count || "N/A";
  const isEcommerce = insitesReport?.ecommerce?.has_ecommerce || false;

  // Helper functions (can be adapted/used for context)
  const getApolloKeywords = (count = 5) =>
    apolloData?.keywords?.slice(0, count) || ["relevant keyword estimate"];
  const getInsitesKeywords = (count = 5) =>
    insitesReport?.organic_search?.keywords
      ?.slice(0, count)
      .map((k) => k.keyword) || ["relevant keyword estimate"];
  const getInsitesPages = (count = 5) => {
    const pagesWithData = insitesReport?.pages?.filter((p) => p.url) || [];
    const placeholders = Array.from(
      { length: count },
      (_, i) => "/example-page-" + (i + 1)
    );
    const result = pagesWithData.map((p) => p.url);
    while (result.length < count) {
      result.push(placeholders[result.length]);
    }
    return result.slice(0, count);
  };
  const getInsitesReferringDomains = (count = 5) => {
    const domainsWithData =
      insitesReport?.backlinks?.referring_domains?.filter((d) => d.domain) ||
      [];
    const placeholders = Array.from(
      { length: count },
      (_, i) => "example-referrer-" + (i + 1) + ".co.uk"
    );
    const result = domainsWithData.map((d) => d.domain);
    while (result.length < count) {
      result.push(placeholders[result.length]);
    }
    return result.slice(0, count);
  };
  const getInsitesOpportunities = (count = 5) =>
    insitesReport?.organic_search?.best_keyword_opportunities
      ?.slice(0, count)
      .map((k) => k.keyword) || ["opportunity keyword estimate"];
  const getInsitesTechnicalIssues = (count = 5) => {
    // Simplified for structure - real implementation might use Insites data
    const placeholders = [
      {
        issueType: "Estimate: [e.g., 404 Errors]",
        countEst: "[#]",
        severity: "[High/Med/Low]",
        recommendation: "[Brief action]",
      },
      {
        issueType: "Estimate: [e.g., Missing Alt Text]",
        countEst: "[#]",
        severity: "[Med]",
        recommendation: "[Brief action]",
      },
      {
        issueType: "Estimate: [e.g., Slow Mobile Page]",
        countEst: "[#]",
        severity: "[High]",
        recommendation: "[Brief action]",
      },
      {
        issueType: "Estimate: [e.g., Duplicate Title]",
        countEst: "[#]",
        severity: "[Low]",
        recommendation: "[Brief action]",
      },
      {
        issueType: "Estimate: [e.g., Broken Link]",
        countEst: "[#]",
        severity: "[Med]",
        recommendation: "[Brief action]",
      },
    ];
    // In a real scenario, you'd populate this based on insitesReport?.spider, insitesReport?.mobile etc.
    return placeholders.slice(0, count);
  };

  // Define the comprehensive JSON structure by combining section structures
  const seoAnalysisStructure = {
    executiveSummaryUK: getExecutiveSummaryStructure(
      apolloData,
      industry,
      competitorsString
    ),
    keywordRankingsUK: getKeywordRankingsStructure(
      getApolloKeywords,
      getInsitesKeywords,
      competitorsString
    ),
    organicTrafficUK: getOrganicTrafficStructure(
      avgMonthlyTraffic,
      getInsitesPages,
      apolloData,
      competitorsString
    ),
    backlinkProfileUK: getBacklinkProfileStructure(
      totalBacklinks,
      referringDomains,
      hasSpammyBacklinks,
      getInsitesReferringDomains,
      competitorsString
    ),
    pageSpeedMobileUK: getPageSpeedMobileStructure(
      isMobileFriendly,
      competitorsString
    ),
    contentAnalysisUK: getContentAnalysisStructure(
      apolloData,
      contentFreshness,
      getInsitesPages,
      getApolloKeywords,
      competitorsString
    ),
    keywordGapAnalysisUK: getKeywordGapAnalysisStructure(
      getInsitesOpportunities,
      getApolloKeywords,
      competitorsString,
      businessName
    ),
    technicalSeoUK: getTechnicalSeoStructure(
      getInsitesTechnicalIssues,
      competitorsString
    ),
    localSeoUK: getLocalSeoStructure(
      apolloData,
      directoriesFound,
      avgReview,
      reviewCount,
      competitorsString
    ),
    ecommerceSeoUK: getEcommerceSeoStructure(isEcommerce, competitorsString),
  };

  // Stringify the structure to include in the prompt
  const structureString = JSON.stringify(seoAnalysisStructure, null, 2);

  // Construct the final prompt using string concatenation - Stricter JSON output enforcement
  const prompt =
    "RESPONSE MUST BE A SINGLE VALID JSON OBJECT ONLY. START WITH '{' AND END WITH '}'. DO NOT INCLUDE ```json MARKERS OR ANY OTHER TEXT BEFORE OR AFTER THE JSON OBJECT. Generate a comprehensive UK-focused SEO analysis JSON for " +
    businessName +
    " (" +
    website +
    ") in the " +
    industry +
    " industry, based on the provided context data and general SEO knowledge. Use UK English spelling (e.g., analyse, optimisation). The JSON object MUST strictly follow the structure outlined below. Replace ALL bracketed placeholders (like '[Estimate #]', '[% Estimate]', '[High/Med/Low]', etc.) with realistic, specific, estimated numerical values or textual information relevant to the UK market. CRITICAL: Ensure all string values within the JSON are properly escaped (e.g., use \\\" for double quotes within strings, \\n for newlines).\n\n" +
    "Context Data:\n" +
    "Insites Report Snippet:\n" +
    JSON.stringify(insitesReport || {}, null, 2).substring(0, 1500) +
    "...\n\n" +
    "Apollo.io Data Snippet:\n" +
    JSON.stringify(apolloData || {}, null, 2).substring(0, 1500) +
    "...\n\n" +
    "Company Data Snippet:\n" + // Generic name
    JSON.stringify(apolloData || {}, null, 2).substring(0, 1500) +
    "...\n\n" +
    "REMEMBER: ONLY a valid JSON object strictly matching the provided structure, starting with '{' and ending with '}', is required. Ensure proper JSON string escaping.";

  return prompt;
}
