export const getMarketPotentialPrompt = (
  businessName,
  website,
  industry,
  insitesReport, // Pass the report object directly
  apolloData // Add apolloData parameter
) => {
  // Safely access nested properties from insitesReport
  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2);
  const apolloDataJson = JSON.stringify(apolloData || {}, null, 2);

  // Define the SIMPLIFIED desired JSON structure
  const jsonStructure = {
    keyTakeaways: {
      title: "Key Takeaways (UK Focus)",
      summary:
        "Concise paragraph (2-4 sentences) summarizing critical findings.",
    },
    marketSizeGrowth: {
      title: "Market Size and Growth (UK)",
      tamUK: "£[Amount] (TAM, [Year, Est.])",
      samUK: "£[Amount] (SAM, [Year, Est.])",
      somUKPotential: "£[Amount] (SOM Potential, [Year, Est.])",
      yoyGrowthUK: "[%] (YoY Growth, [Year, Est.])",
      cagr5YearUK: "[%] (5-Year CAGR, [Projection Est.])",
      notes: "Optional brief notes on sources or estimations.",
    },
    customerSegmentation: {
      title: "Customer Segmentation (UK - Top 1-2 Segments)",
      segments: [
        // Array for 1-2 segments
        {
          segmentName: "[Segment Name]",
          description:
            "Brief description of the segment and key characteristics.",
          sizeGrowthPotential: "[e.g., Large, Growing / Medium, Stable]",
          keyNeeds: "Primary needs or pain points relevant to this business.",
        },
        // Add a second segment object if applicable and distinct
      ],
      targetCustomerProfile: "Brief description of the ideal customer profile.",
    },
    marketTrends: {
      title: "Market Trends Analysis (UK Focus - Top 2-3 Trends)",
      trends: [
        // Array for 2-3 trends
        {
          trendName: "[Trend Name]",
          description: "Brief description of the trend in the UK context.",
          impactOpportunity:
            "How it impacts the industry and potential opportunity/threat for the business.",
        },
        // Add more trend objects if applicable
      ],
      emergingTech: "Brief mention of relevant emerging tech shifts (if any).",
      customerBehaviourShifts:
        "Brief mention of key customer behaviour changes (if any).",
    },
    regulatoryEnvironment: {
      title: "Regulatory Environment Summary (UK)",
      keyRegulations:
        "Brief summary of major UK regulations impacting the industry.",
      upcomingChanges:
        "Mention of any significant upcoming regulatory changes.",
      complianceConsiderations: "Key compliance points for the business.",
    },
    barriersToEntry: {
      title: "Barriers to Entry Assessment (UK Market)",
      keyBarriers: [
        // Array for 2-3 key barriers
        {
          barrierName: "[e.g., High Capital Cost, Strong Incumbents]",
          significance: "[High/Medium/Low]",
          notes: "Brief explanation in UK context.",
        },
        // Add more barrier objects if applicable
      ],
      overallDifficulty: "[High/Medium/Low]",
    },
    marketPenetration: {
      title: "Market Penetration Strategy Outline (UK Focus)",
      primaryStrategy: "Brief description of the recommended primary strategy.",
      keyActions: "List 2-3 key actions for the next 6-12 months.",
      estimatedInvestmentLevel: "[High/Medium/Low]",
      expectedOutcome:
        "Briefly describe the expected outcome (e.g., SOM increase, brand awareness).",
    },
  };

  return `**Formatting Instructions:**
- Respond *only* with a valid JSON object adhering strictly to the structure defined below.
- **Do not** include any introductory sentences, explanations, apologies, code block markers (\`\`\`), or conversational text outside the JSON structure.
- **Replace ALL bracketed placeholders** (e.g., \`[#]\`, \`[%]\`, \`[keyword]\`, \`[description]\`, \`£[amount]\`) within the JSON values with realistic, estimated numerical values or specific textual information derived from the provided context (Insites/Apollo data) or reasonable industry estimations if context is missing.
- **Crucially, always include ALL keys defined in the structure below (\`keyTakeaways\`, \`marketSizeGrowth\`, \`customerSegmentation\`, \`marketTrends\`, \`regulatoryEnvironment\`, \`barriersToEntry\`, \`marketPenetration\`).**
- **Do not** return the bracket placeholders themselves in the final JSON output. If specific data for a placeholder or an entire subsection (like \`marketTrends\`) is unavailable or cannot be reliably estimated, use \`null\` or a descriptive string like "Data unavailable" for the corresponding values or nested properties. **Do not omit the keys.**
- Ensure all analysis, data, and estimations focus specifically on the **United Kingdom (UK)** market.
- Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

**Analysis Request:**

Evaluate market potential JSON object for ${businessName} (${website}) in ${industry}, focusing on the **UK market**. Use the following Insites report data and Apollo.io company data for context where relevant:

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
