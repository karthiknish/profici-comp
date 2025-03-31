export const getMarketPotentialPrompt = (
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

Evaluate market potential for ${businessName} (${website}) in ${industry}, focusing on the **UK market**. Use the following Insites report data and Apollo.io company data for context where relevant:

Insites Report Data:
\`\`\`json
${insitesReportJson}
\`\`\`

Apollo.io Company Data:
\`\`\`json
${apolloDataJson}
\`\`\`

    Format in Markdown with H2 headings and tables/bullet points as specified. Use tables for Regulatory Environment and Barriers to Entry. Use bullet points for Market Penetration Strategy actions.

## Key Takeaways (UK Focus)
Provide a concise paragraph (2-4 sentences) summarizing the most critical market potential findings for the business in the UK, based on the analysis below.

## Market Size and Growth (UK)
Use a Markdown table with UK-specific data:
| Metric         | Value      | Source/Notes |
|----------------|------------|--------------|
| TAM (UK)       | £[Estimate amount] | [Year, Est.] |
| SAM (UK)       | £[Estimate amount] | [Year, Est.] |
| SOM (UK Potential)| £[Estimate amount] | [Year, Est.] |
| YoY Growth (UK)| [% Estimate] | [Year, Est.] |
| 5-Year CAGR (UK)| [% Estimate] | [Projection Est.] |

## Customer Segmentation (UK - Top 3 Segments)
Use a Markdown table: | Segment | Size (UK Est.) | Growth Rate (UK Est.) | Key Pain Points | Price Sensitivity | Acquisition Cost (UK Est.) | LTV (UK Est.) | |---------|----------------|-----------------------|-----------------|-------------------|----------------------------|---------------| | [name]  | [#/% Estimate] | [% Estimate]          | [points Estimate] | [High/Med/Low Est.] | [£ Estimate]               | [£ Estimate]  |

## Market Trends Analysis (UK Focus - Top 3 Trends)
Use a Markdown table: | Trend       | Description (UK Context) | Impact on UK Industry | Opportunity/Threat for You (UK) | |-------------|--------------------------|-----------------------|---------------------------------| | [Trend Name]| [details Estimate]       | [% / Desc. Est.]    | [Opportunity/Threat + Why Est.] |
- Key technology shifts (UK Impact): [Use concise bullet points based on Insites technology_profile/detection and Apollo keywords: ${apolloData?.keywords?.join(
    ", "
  )}]
- Key customer behaviour changes (UK): [Use concise bullet points Estimate]

## Regulatory Environment Summary (UK)
Use a Markdown table: | Aspect        | Details (Concise Bullet Points) | Impact/Consideration (UK) | |---------------|---------------------------------|---------------------------| | Key Regulations (UK) | - [UK Regulation 1 Est.] <br/> - [UK Regulation 2 Est.] | [Brief Impact Est.] | | Upcoming Changes (UK)| - [UK Change 1 Est.]            | [Brief Impact Est.] | | Compliance (UK)    | - [UK Point 1 Est.] <br/> - [UK Point 2 Est.]   | [Brief Note Est.] |

## Barriers to Entry Assessment (UK Market)
Use a Markdown table: | Barrier Type          | Significance   | Notes (Concise Bullet Points - UK Context) | |-----------------------|----------------|--------------------------------------------| | [e.g., Capital Cost]  | [High/Med/Low Est.] | - [Point 1 Est.] <br/> - [Point 2 Est.]    | | [e.g., Brand Loyalty] | [High/Med/Low Est.] | - [Point 1 Est.]                           | | [e.g., Technology]    | [High/Med/Low Est.] | - [Point 1 Est. based on Insites tech & Apollo keywords]     |

## Market Penetration Strategy Outline (UK Focus)
Use the following structure with H4 (####) subheadings:
#### Recommended Primary Strategy (UK)
- [Brief description Estimate]
#### Key Actions (Next 6 Months - UK)
- [Action 1 Est.]
- [Action 2 Est.]
- [Action 3 Est.]
#### Estimated Investment Required (UK)
- £[Range Estimate]
#### Expected SOM Increase (UK - Year 1)
- [% Estimate]

Include specific estimated UK numbers, growth projections, and actionable insights throughout. Use bullet points for descriptions where possible. State clearly if data is estimated.`;
};
