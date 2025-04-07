export const getCompetitorPrompt = (
  businessName,
  website,
  industry,
  competitors,
  competitorsString,
  insitesReport, // Pass the report object directly
  apolloData, // Add apolloData parameter
  competitorsApolloData // Add competitorsApolloData parameter
) => {
  // Safely access nested properties from insitesReport
  const avgMonthlyTraffic =
    insitesReport?.organic_search?.average_monthly_traffic || "# Estimate";
  const facebookFollows =
    insitesReport?.facebook_page?.page_follows || "# Estimate";
  const avgReview = insitesReport?.reviews_normalised?.average_review || "N/A";
  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2); // Stringify the passed object
  const apolloDataJson = JSON.stringify(apolloData || {}, null, 2); // Stringify apolloData
  // Stringify the competitor Apollo data array
  const competitorsApolloDataJson = JSON.stringify(
    competitorsApolloData || [],
    null,
    2
  );

  // Define the desired JSON structure
  const jsonStructure = {
    competitorOverview: {
      title: "Competitor Overview (UK Focus)",
      headers: [
        "Competitor",
        "Website Authority (DA Est.)",
        "Market Share (UK Est.)",
        "Key Strengths (UK)",
        "Key Weaknesses (UK)",
        "Primary USP (UK)",
        "Target Audience Segment (UK)",
      ],
      rows: [
        // Row for the main business
        {
          competitor: businessName,
          authority: "[1-100]",
          marketShare: "[%]",
          strengths: ["Point 1", "Point 2"],
          weaknesses: ["Point 1", "Point 2"],
          usp: "[USP]",
          audience: "[Description]",
        },
        // Rows for competitors (map over competitors array)
        ...competitors.map((comp) => ({
          competitor: comp,
          authority: "[1-100]",
          marketShare: "[%]",
          strengths: ["Point 1", "Point 2"],
          weaknesses: ["Point 1", "Point 2"],
          usp: "[USP]",
          audience: "[Description]",
        })),
      ],
    },
    digitalPresence: {
      title: "Digital Presence Comparison (UK Focus)",
      headers: [
        "Competitor",
        "Est. Monthly Traffic (UK)",
        "Top Social Platform (UK Est.)",
        "Social Following (UK Est.)",
        "Review Rating (UK Avg Est.)",
        "Content Strategy Focus (Est.)",
      ],
      rows: [
        {
          competitor: businessName,
          traffic: `[${avgMonthlyTraffic}]`,
          topPlatform: "[Platform]",
          following: `[${facebookFollows}]`,
          rating: `[${avgReview}]`,
          contentFocus: "[Focus]",
        },
        ...competitors.map((comp) => ({
          competitor: comp,
          traffic: "[#]",
          topPlatform: "[Platform]",
          following: "[#]",
          rating: "[1-5]",
          contentFocus: "[Focus]",
        })),
      ],
      notes: "Metrics are estimations, some sourced from Insites.",
    },
    pricingStrategy: {
      title: "Pricing Strategy Analysis (UK Market)",
      headers: [
        "Competitor",
        "Pricing Model (Est.)",
        "Key Price Point (£ Est.)",
        "Positioning (Est.)",
        "Discounts Offered (Est.)",
        "Value Proposition (UK Focus)",
      ],
      rows: [
        {
          competitor: businessName,
          model: "[Model]",
          pricePoint: "[£X]",
          positioning: "[Position]",
          discounts: "[Y/N/S]",
          valueProp: ["Point 1", "Point 2"],
        },
        ...competitors.map((comp) => ({
          competitor: comp,
          model: "[Model]",
          pricePoint: "[£X]",
          positioning: "[Position]",
          discounts: "[Y/N/S]",
          valueProp: ["Point 1", "Point 2"],
        })),
      ],
      summary:
        "Price point comparison summary (UK): [Your business is X% higher/lower on average in £ (Est.)]",
    },
    marketingChannels: {
      title: "Marketing Channel Effectiveness (UK Estimated)",
      headers: [
        "Competitor",
        "Top Channel 1 (UK Est.)",
        "Top Channel 2 (UK Est.)",
        "Top Channel 3 (UK Est.)",
        "Weakest Channel (UK Est.)",
        "Key Message Angle (UK Est.)",
      ],
      rows: [
        {
          competitor: businessName,
          top1: "[Channel: %]",
          top2: "[Channel: %]",
          top3: "[Channel: %]",
          weakest: "[Channel]",
          angle: "[Angle]",
        },
        ...competitors.map((comp) => ({
          competitor: comp,
          top1: "[Channel: %]",
          top2: "[Channel: %]",
          top3: "[Channel: %]",
          weakest: "[Channel]",
          angle: "[Angle]",
        })),
      ],
      gapOpportunities: {
        title: "Channel Gap Opportunities (UK)",
        opportunities: [
          { channel: "Channel 1", rationale: "[Rationale/action]" },
          { channel: "Channel 2", rationale: "[Rationale/action]" },
        ],
      },
    },
    apolloComparison: {
      title: "Apollo Data Comparison (UK Focus)",
      competitorData: competitors.map((comp) => ({
        name: comp,
        confirmations: ["Point 1", "Point 2"],
        discrepancies: ["Point 1", "Point 2"],
        insights: ["Point 1", "Point 2"],
      })),
    },
    keyDifferences: {
      title: "Business vs. Competitors: Key Differences (UK Focus)",
      digitalPresence: "[Summary of differences]",
      pricing: "[Summary of differences]",
      marketingChannels: "[Summary of differences]",
      overall: "[Overall summary sentence]",
    },
    swotAnalysis: {
      title: `SWOT Analysis for ${businessName} (UK Context)`,
      strengths: ["Point 1", "Point 2", "Point 3"],
      weaknesses: ["Point 1", "Point 2"],
      opportunities: ["Point 1", "Point 2"],
      threats: ["Point 1", "Point 2"],
    },
  };

  return `**Formatting Instructions:**
- Respond *only* with a valid JSON object adhering strictly to the structure defined below.
- **Do not** include any introductory sentences, explanations, apologies, code block markers (\`\`\`), or conversational text outside the JSON structure.
- **Replace ALL bracketed placeholders** (e.g., \`[#]\`, \`[%]\`, \`[keyword]\`, \`[description]\`, \`£[amount]\`) within the JSON values with realistic, estimated numerical values or specific textual information derived from the provided context (Insites/Apollo data) or reasonable industry estimations if context is missing.
- **Do not** return the bracket placeholders themselves in the final JSON output. If specific data for a placeholder is unavailable, use \`null\` or a descriptive string like "Data unavailable".
- Ensure all analysis, data, and estimations focus specifically on the **United Kingdom (UK)** market.
- Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

**Analysis Request:**

Create an extensive, data-focused competitor analysis JSON object for ${businessName} (${website}) vs its key competitors (${competitorsString}) in the ${industry} industry, focusing on the **UK market**. Use the following Insites report data and Apollo.io company data (for both the primary business and competitors) for context where relevant:

Insites Report Data for ${businessName}:
\`\`\`json
${insitesReportJson}
\`\`\`

Apollo.io Company Data for ${businessName}:
\`\`\`json
${apolloDataJson}
\`\`\`

Apollo.io Company Data for Competitors (${competitorsString}):
\`\`\`json
${competitorsApolloDataJson}
\`\`\`

**Required JSON Output Structure:**
\`\`\`json
${JSON.stringify(jsonStructure, null, 2)}
\`\`\`

Fill in the values in the structure above with your analysis and estimations based on the provided data and UK market context. Ensure the final output is a single, valid JSON object.`;
};
