export const getTrendsPrompt = (
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport // Pass the report object directly
) => {
  // Safely access nested properties from insitesReport
  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2); // Stringify the passed object

  return `IMPORTANT: Respond *only* with the requested Markdown content below. Do not include any introductory sentences, explanations, or conversational text. Replace ALL bracketed placeholders (like [#], [%], £[amount], [keyword], [description], etc.) with realistic, estimated numerical values or specific textual information based on the context provided. DO NOT return the bracket placeholders themselves. Focus analysis on the **United Kingdom (UK)** market. Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

Generate estimated **UK-specific** search trend data for keywords relevant to ${businessName} (${website}) in the ${industry} industry, considering competitors like ${competitorsString}. Use the following Insites report data for context where relevant, especially the organic_search section:
\`\`\`json
${insitesReportJson}
\`\`\`

    Format in Markdown with H2 headings and tables. Include:

## Estimated Search Volume Trends (UK - Last 12 Months)
Use a Markdown table for 3-5 core keywords based on Insites organic_search.top_keywords_ranked_for_detail: | Keyword        | Avg. Monthly Volume (UK) | Trend (12 Mo Est.) | Peak Month Est. | Notes | |----------------|--------------------------|--------------------|-----------------|-------| | [Keyword from Insites] | [Vol from Insites]       | [Up/Down/Stable %] | [Month]         | [e.g., Seasonality] |

## Related Rising Queries (UK - Breakout/Top)
Use a Markdown table for 5-10 related queries based on Insites organic_search.best_keyword_opportunities: | Query                 | Type     | Growth (UK Est.) | Relevance | |-----------------------|----------|------------------|-----------| | [Keyword from Insites Opps] | [Top/Breakout Est.] | [+X% / High Est.]| [High/Med/Low] |

## Geographic Interest (Top 3 UK Regions/Cities)
Use a Markdown table: | UK Location     | Relative Interest (0-100 Est.) | Trend Est. | |-----------------|--------------------------------|------------| | [UK Region/City 1] | [#]                            | [Up/Down/Stable] | | [UK Region/City 2] | [#]                            | [Up/Down/Stable] |

Provide estimated data based on general knowledge of UK search patterns, the industry, and the provided Insites data. Clearly state these are estimations.`;
};
