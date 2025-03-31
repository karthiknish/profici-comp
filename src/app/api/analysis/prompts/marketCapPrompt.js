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

  return `IMPORTANT: Respond *only* with the requested Markdown content below. Do not include any introductory sentences, explanations, or conversational text. Replace ALL bracketed placeholders (like [#], [%], £[amount], [keyword], [description], etc.) with realistic, estimated numerical values or specific textual information based on the context provided. DO NOT return the bracket placeholders themselves. Use bullet points extensively instead of long paragraphs for descriptions. Keep explanations concise. Focus analysis on the **United Kingdom (UK)** market. Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

Provide market size and valuation analysis for the ${industry} industry in the **UK**, focusing on businesses like ${businessName} (${website}). Use the following Insites report data and Apollo.io company data for context where relevant:

Insites Report Data:
\`\`\`json
${insitesReportJson}
\`\`\`

Apollo.io Company Data:
\`\`\`json
${apolloDataJson}
\`\`\`

    Format in Markdown with H2 headings and tables/bullet points as specified.

## Key Takeaways (UK Focus)
- [Brief bullet point 1 summarizing a key finding, e.g., UK industry valuation multiple is X Estimate]
- [Brief bullet point 2 summarizing a key finding, e.g., Recent UK M&A activity suggests Y Estimate]
- [Brief bullet point 3 summarizing a key finding, e.g., Key UK growth driver is Z Estimate, consider Apollo industry: ${
    apolloData?.industry
  }]

## Industry Market Size (UK)
Use a Markdown table: | Region        | Market Size (£ Est.) | % of UK Est. | YoY Growth (% Est.) | Key Driver Est. | |---------------|----------------------|--------------|---------------------|-----------------| | UK Total      | £[amount]            | 100%         | [%]                 | [Factor]        | | [UK Region 1] | £[amount]            | [%]          | [%]                 | [Factor]        | | [UK Region 2] | £[amount]            | [%]          | [%]                 | [Factor]        |
- 5-year UK CAGR forecast: [% Estimate]

## Market Segmentation (UK - Top 3 Segments)
Use a Markdown table: | Segment | Market Share (UK % Est.) | Value (£ Est.) | Growth Rate (% Est.) | Key UK Players (Examples Est.) | |---------|--------------------------|----------------|----------------------|--------------------------------| | [name]  | [%]                      | £[amount]      | [%]                  | [Company A, Company B]         |

## Valuation Metrics (UK Industry Averages Est.)
Use a Markdown table: | Metric        | Average Value Est. | Notes (UK Context) | |---------------|--------------------|--------------------| | P/E Ratio     | [X.X]x             | [Trailing/Forward] | | EV/EBITDA     | [X.X]x             |                    | | Revenue Multiple| [X.X]x             | [Based on UK deals]| | LTV:CAC Ratio | [X:1]              | [Target UK range]  |

## Investment Landscape Summary (UK Est.)
- Recent UK VC funding trend (12 mo): [Increasing/Decreasing/Stable] - £[Amount] total
- Recent UK M&A activity: [High/Medium/Low] - [#] deals
- Key UK investors in the space: [List 2-3 firms]
- UK Valuation trends: [Upward/Downward/Stable]

## Market Concentration (UK Est.)
- Top 5 players market share (UK Est.): [%]
- Competitive intensity (UK): [High/Medium/Low] based on HHI or qualitative assessment.

## Growth Drivers and Constraints (UK Focus - Top 2 Each Est.)
Use concise bullet points for explanations: - Drivers: - [UK Factor, consider Apollo keywords: ${apolloData?.keywords?.join(
    ", "
  )}]: [Brief explanation] - [UK Factor]: [Brief explanation] - Constraints: - [UK Factor]: [Brief explanation] - [UK Factor]: [Brief explanation]

Include specific estimated UK numbers and focus on segments relevant to ${businessName}. Use bullet points for descriptions where possible. State clearly if data is estimated.`;
};
