export const getMarketCapPrompt = (
  businessName,
  website,
  industry,
  insitesReport, // Pass the report object directly
  apolloData // Add apolloData parameter
) => {
  // Safely access nested properties from insitesReport
  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2); // Stringify the passed object
  const apolloDataJson = JSON.stringify(apolloData || {}, null, 2); // Stringify apolloData

  // Define the desired JSON structure
  const jsonStructure = {
    keyTakeaways: {
      title: "Key Takeaways (UK Focus)",
      points: [
        "Finding 1 (e.g., UK industry valuation multiple is X)",
        "Finding 2 (e.g., Recent UK M&A activity suggests Y)",
        "Finding 3 (e.g., Key UK growth driver is Z)",
      ],
    },
    industryMarketSize: {
      title: "Industry Market Size (UK)",
      headers: [
        "Region",
        "Market Size (£ Est.)",
        "% of UK Est.",
        "YoY Growth (% Est.)",
        "Key Driver Est.",
      ],
      rows: [
        {
          region: "UK Total",
          size: "£[Amount]",
          percentUK: "100%",
          yoyGrowth: "[%]",
          driver: "[Factor]",
        },
        {
          region: "[UK Region 1]",
          size: "£[Amount]",
          percentUK: "[%]",
          yoyGrowth: "[%]",
          driver: "[Factor]",
        },
        {
          region: "[UK Region 2]",
          size: "£[Amount]",
          percentUK: "[%]",
          yoyGrowth: "[%]",
          driver: "[Factor]",
        },
      ],
      cagrForecast: "5-year UK CAGR forecast: [% Estimate]",
    },
    marketSegmentation: {
      title: "Market Segmentation (UK - Top 3 Segments)",
      headers: [
        "Segment",
        "Market Share (UK % Est.)",
        "Value (£ Est.)",
        "Growth Rate (% Est.)",
        "Key UK Players (Examples Est.)",
      ],
      rows: [
        {
          segment: "[Name]",
          share: "[%]",
          value: "£[Amount]",
          growthRate: "[%]",
          players: ["Company A", "Company B"],
        },
        // ... more rows (up to 3)
      ],
    },
    valuationMetrics: {
      title: "Valuation Metrics (UK Industry Averages Est.)",
      headers: ["Metric", "Average Value Est.", "Notes (UK Context)"],
      rows: [
        { metric: "P/E Ratio", value: "[X.X]x", notes: "[Trailing/Forward]" },
        { metric: "EV/EBITDA", value: "[X.X]x", notes: "" },
        {
          metric: "Revenue Multiple",
          value: "[X.X]x",
          notes: "[Based on UK deals]",
        },
        { metric: "LTV:CAC Ratio", value: "[X:1]", notes: "[Target UK range]" },
      ],
    },
    investmentLandscape: {
      title: "Investment Landscape Summary (UK Est.)",
      vcFundingTrend:
        "Recent UK VC funding trend (12 mo): [Increasing/Decreasing/Stable] - £[Amount] total",
      mergerAcquisitionActivity:
        "Recent UK M&A activity: [High/Medium/Low] - [#] deals",
      keyInvestors: ["Investor 1", "Investor 2", "Investor 3"],
      valuationTrends: "UK Valuation trends: [Upward/Downward/Stable]",
    },
    marketConcentration: {
      title: "Market Concentration (UK Est.)",
      topPlayersShare: "Top 5 players market share (UK Est.): [%]",
      competitiveIntensity:
        "Competitive intensity (UK): [High/Medium/Low] based on HHI or qualitative assessment.",
    },
    growthDriversConstraints: {
      title: "Growth Drivers and Constraints (UK Focus - Top 2 Each Est.)",
      drivers: [
        { factor: "[UK Factor]", explanation: "[Brief explanation]" },
        { factor: "[UK Factor]", explanation: "[Brief explanation]" },
      ],
      constraints: [
        { factor: "[UK Factor]", explanation: "[Brief explanation]" },
        { factor: "[UK Factor]", explanation: "[Brief explanation]" },
      ],
    },
  };

  return `**Formatting Instructions:**
- Respond *only* with a valid JSON object adhering strictly to the structure defined below.
- **Do not** include any introductory sentences, explanations, apologies, code block markers (\`\`\`), or conversational text outside the JSON structure.
- **Replace ALL bracketed placeholders** (e.g., \`[#]\`, \`[%]\`, \`[keyword]\`, \`[description]\`, \`£[amount]\`) within the JSON values with realistic, estimated numerical values or specific textual information derived from the provided context (Insites/Apollo data) or reasonable industry estimations if context is missing.
- **Do not** return the bracket placeholders themselves in the final JSON output. If specific data for a placeholder is unavailable, use \`null\` or a descriptive string like "Data unavailable". Use arrays for bullet points/list items as shown in the structure.
- Ensure all analysis, data, and estimations focus specifically on the **United Kingdom (UK)** market.
- Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

**Analysis Request:**

Provide market size and valuation analysis JSON object for the ${industry} industry in the **UK**, focusing on businesses like ${businessName} (${website}). Use the following Insites report data and Apollo.io company data for context where relevant:

Insites Report Data:
\`\`\`json
${insitesReportJson}
\`\`\`

Apollo.io Company Data:
\`\`\`json
${apolloDataJson}
\`\`\`

**Required JSON Output Structure:**
\`\`\`json
${JSON.stringify(jsonStructure, null, 2)}
\`\`\`

Fill in the values in the structure above with your analysis and estimations based on the provided data and UK market context. Ensure the final output is a single, valid JSON object.`;
};
