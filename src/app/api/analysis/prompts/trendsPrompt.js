export const getTrendsPrompt = (
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport, // Pass the report object directly
  apolloData // Add apolloData parameter
) => {
  // Safely access nested properties from insitesReport
  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2); // Stringify the passed object
  const apolloDataJson = JSON.stringify(apolloData || {}, null, 2); // Stringify apolloData

  // Define the desired JSON structure
  const jsonStructure = {
    volumeTrends: {
      title: "Estimated Search Volume Trends (UK - Last 12 Months)",
      headers: [
        "Keyword",
        "Avg. Monthly Volume (UK)",
        "Trend (12 Mo Est.)",
        "Peak Month Est.",
        "Notes",
      ],
      rows: [
        // 3-5 rows based on Insites/Apollo keywords
        {
          keyword: "[Keyword]",
          volume: "[#]",
          trend: "[Up/Down/Stable %]",
          peakMonth: "[Month]",
          notes: "[e.g., Seasonality]",
        },
      ],
    },
    risingQueries: {
      title: "Related Rising Queries (UK - Breakout/Top)",
      headers: ["Query", "Type", "Growth (UK Est.)", "Relevance"],
      rows: [
        // 5-10 rows based on Insites/Apollo keywords
        {
          query: "[Keyword]",
          type: "[Top/Breakout Est.]",
          growth: "[+X% / High Est.]",
          relevance: "[High/Med/Low]",
        },
      ],
    },
    geoInterest: {
      title: "Geographic Interest (Top 3 UK Regions/Cities)",
      headers: ["UK Location", "Relative Interest (0-100 Est.)", "Trend Est."],
      rows: [
        // Top 3 rows
        {
          location: "[UK Region/City]",
          interest: "[#]",
          trend: "[Up/Down/Stable]",
        },
      ],
    },
    notes:
      "Data provided are estimations based on general knowledge of UK search patterns, the industry, and provided context data.",
  };

  return `**Formatting Instructions:**
- Respond *only* with a valid JSON object adhering strictly to the structure defined below.
- **Do not** include any introductory sentences, explanations, apologies, code block markers (\`\`\`), or conversational text outside the JSON structure.
- **Replace ALL bracketed placeholders** (e.g., \`[#]\`, \`[%]\`, \`[keyword]\`, \`[description]\`, \`£[amount]\`) within the JSON values with realistic, estimated numerical values or specific textual information derived from the provided context (Insites/Apollo data) or reasonable industry estimations if context is missing.
- **Do not** return the bracket placeholders themselves in the final JSON output. If specific data for a placeholder is unavailable, use \`null\` or a descriptive string like "Data unavailable". Use arrays for table rows as shown.
- Ensure all analysis, data, and estimations focus specifically on the **United Kingdom (UK)** market.
- Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

**Analysis Request:**

Generate estimated **UK-specific** search trend data JSON object for keywords relevant to ${businessName} (${website}) in the ${industry} industry, considering competitors like ${competitorsString}. Use the following Insites report data and Apollo.io company data for context where relevant:

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
