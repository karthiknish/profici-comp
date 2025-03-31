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

  return `IMPORTANT: Respond *only* with the requested Markdown content below. Do not include any introductory sentences, explanations, or conversational text. Replace ALL bracketed placeholders (like [#], [%], £[amount], [keyword], [description], etc.) with realistic, estimated numerical values or specific textual information based on the context provided. DO NOT return the bracket placeholders themselves. Focus analysis on the **United Kingdom (UK)** market. Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

Generate estimated **UK-specific** search trend data for keywords relevant to ${businessName} (${website}) in the ${industry} industry, considering competitors like ${competitorsString}. Use the following Insites report data and Apollo.io company data for context where relevant:

Insites Report Data:
\`\`\`json
${insitesReportJson}
\`\`\`

Apollo.io Company Data:
\`\`\`json
${apolloDataJson}
\`\`\`

    Format in Markdown with H2 headings and tables. Include:

## Estimated Search Volume Trends (UK - Last 12 Months)
Use a Markdown table for 3-5 core keywords based on Insites organic_search.top_keywords_ranked_for_detail and Apollo keywords: | Keyword        | Avg. Monthly Volume (UK) | Trend (12 Mo Est.) | Peak Month Est. | Notes | |----------------|--------------------------|--------------------|-----------------|-------| | [Keyword from Insites/Apollo] | [Vol from Insites]       | [Up/Down/Stable %] | [Month]         | [e.g., Seasonality] |

## Related Rising Queries (UK - Breakout/Top)
Use a Markdown table for 5-10 related queries based on Insites organic_search.best_keyword_opportunities and Apollo keywords: | Query                 | Type     | Growth (UK Est.) | Relevance | |-----------------------|----------|------------------|-----------| | [Keyword from Insites Opps/Apollo] | [Top/Breakout Est.] | [+X% / High Est.]| [High/Med/Low] |

## Geographic Interest (Top 3 UK Regions/Cities)
Use a Markdown table (consider Apollo location: ${apolloData?.city}, ${apolloData?.country}): | UK Location     | Relative Interest (0-100 Est.) | Trend Est. | |-----------------|--------------------------------|------------| | [UK Region/City 1] | [#]                            | [Up/Down/Stable] | | [UK Region/City 2] | [#]                            | [Up/Down/Stable] |

Provide estimated data based on general knowledge of UK search patterns, the industry, and the provided Insites/Apollo data. Clearly state these are estimations.`;
};
