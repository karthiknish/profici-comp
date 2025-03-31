export const getCompetitorPrompt = (
  businessName,
  website,
  industry,
  competitors,
  competitorsString,
  insitesReport // Pass the report object directly
) => {
  // Safely access nested properties from insitesReport
  const avgMonthlyTraffic =
    insitesReport?.organic_search?.average_monthly_traffic || "# Estimate";
  const facebookFollows =
    insitesReport?.facebook_page?.page_follows || "# Estimate";
  const avgReview = insitesReport?.reviews_normalised?.average_review || "N/A";
  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2); // Stringify the passed object

  return `IMPORTANT: Respond *only* with the requested Markdown content below. Do not include any introductory sentences, explanations, or conversational text. Replace ALL bracketed placeholders (like [#], [%], £[amount], [keyword], [description], etc.) with realistic, estimated numerical values or specific textual information based on the context provided. DO NOT return the bracket placeholders themselves. Focus analysis on the **United Kingdom (UK)** market. Use UK English spelling (e.g., analyse, optimisation, behaviour, centre). Use concise bullet points for descriptions where possible.

Create an extensive, data-focused competitor analysis for ${businessName} (${website}) vs its key competitors (${competitorsString}) in the ${industry} industry, focusing on the **UK market**. Use the following Insites report data for context where relevant:
\`\`\`json
${insitesReportJson}
\`\`\`

    Format in Markdown with H2/H3 headings and tables/lists as specified.

## Competitor Overview (UK Focus)
Use a Markdown table. Include ${businessName} and each competitor from ${competitorsString}.
| Competitor      | Website Authority (DA Est.) | Market Share (UK Est.) | Key Strengths (UK) | Key Weaknesses (UK) | Primary USP (UK) | Target Audience Segment (UK) |
|-----------------|-----------------------------|------------------------|--------------------|-------------------|------------------|------------------------------|
| ${businessName} | [Estimate 1-100]            | [% Estimate]           | [Bullet points]    | [Bullet points]   | [USP]            | [Description]                |
${competitors
  .map(
    (comp) =>
      `| ${comp} | [Estimate 1-100]            | [% Estimate]           | [Bullet points]    | [Bullet points]   | [USP]            | [Description]                |`
  )
  .join("\n")}

## Digital Presence Comparison (UK Focus)
Use a Markdown table. Include ${businessName} and each competitor from ${competitorsString}.
| Competitor      | Est. Monthly Traffic (UK) | Top Social Platform (UK Est.) | Social Following (UK Est.) | Review Rating (UK Avg Est.) | Content Strategy Focus (Est.) |
|-----------------|---------------------------|-------------------------------|----------------------------|-----------------------------|-------------------------------|
| ${businessName} | [${avgMonthlyTraffic}] | [Platform Name]               | [${facebookFollows}] | [${avgReview}] | [e.g., Blog, Case Studies]    |
${competitors
  .map(
    (comp) =>
      `| ${comp} | [# Estimate]              | [Platform Name]               | [# Estimate]               | [1-5 Est.]                  | [e.g., Blog, Webinars]        |`
  )
  .join("\n")}
*(Metrics are estimations, some sourced from Insites.)*

## Pricing Strategy Analysis (UK Market)
Use a Markdown table. Include ${businessName} and each competitor from ${competitorsString}.
| Competitor      | Pricing Model (Est.) | Key Price Point (£ Est.) | Positioning (Est.) | Discounts Offered (Est.) | Value Proposition (UK Focus) |
|-----------------|----------------------|--------------------------|--------------------|--------------------------|------------------------------|
| ${businessName} | [e.g., Subscription] | [£X/mo or £Y/project]    | [e.g., Mid-Market] | [Yes/No/Seasonal]        | [Key value points]           |
${competitors
  .map(
    (comp) =>
      `| ${comp} | [e.g., Tiered]       | [£X/mo or £Y/project]    | [e.g., Premium]    | [Yes/No/Seasonal]        | [Key value points]           |`
  )
  .join("\n")}
- Price point comparison summary (UK): [Your business is X% higher/lower on average in £ (Est.)]

## Marketing Channel Effectiveness (UK Estimated)
Use a Markdown table. Include ${businessName} and each competitor from ${competitorsString}.
| Competitor      | Top Channel 1 (UK Est.) | Top Channel 2 (UK Est.) | Top Channel 3 (UK Est.) | Weakest Channel (UK Est.) | Key Message Angle (UK Est.) |
|-----------------|-------------------------|-------------------------|-------------------------|---------------------------|-----------------------------|
| ${businessName} | [Channel: % Est.]       | [Channel: % Est.]       | [Channel: % Est.]       | [Channel]                 | [Angle]                     |
${competitors
  .map(
    (comp) =>
      `| ${comp} | [Channel: % Est.]       | [Channel: % Est.]       | [Channel: % Est.]       | [Channel]                 | [Angle]                     |`
  )
  .join("\n")}

### Channel Gap Opportunities (UK)
- **Channel 1:** [Identify a channel where competitors are weak/absent but relevant to your audience. Rationale/action.]
- **Channel 2:** [Identify another channel. Rationale/action.]

## Business vs. Competitors: Key Differences (UK Focus)
**This section is mandatory.** Directly compare ${businessName} against the listed competitors (${competitorsString}) based on the data presented in the tables above (Digital Presence, Pricing, Marketing Channels). Use concise bullet points highlighting key differences where ${businessName} leads or lags behind.
- **Digital Presence:** [e.g., ${businessName} has higher estimated traffic but lower social following compared to [Competitor Name].]
- **Pricing:** [e.g., ${businessName}'s pricing is positioned as [Mid-Market/Premium/etc.] while [Competitor Name] is [Positioning].]
- **Marketing Channels:** [e.g., ${businessName} relies more on [Channel] while competitors focus on [Channel].]
- **Overall:** [Provide a 1-2 sentence summary of the main competitive differences.]

## SWOT Analysis for ${businessName} (UK Context)
### Strengths
- [Bullet point relevant to UK, consider Insites data & competitor comparison]
- [e.g., Stronger presence on LinkedIn]
- [e.g., More competitive pricing on core service]
- [Bullet point relevant to UK]
### Weaknesses
- [Bullet point relevant to UK, consider Insites data & competitor comparison]
- [Bullet point relevant to UK]
### Opportunities
- [Bullet point relevant to UK market trends & competitor weaknesses]
- [Bullet point relevant to UK]
### Threats
- [Bullet point relevant to UK market trends & competitor strengths]
- [Bullet point relevant to UK]

## Competitive Advantage Opportunities (UK Market)
- **Opportunity 1:** [Specific action for UK market + expected outcome]
- **Opportunity 2:** [Specific action for UK market + expected outcome]
- **Opportunity 3:** [Specific action for UK market + expected outcome]

Include specific estimated numbers where possible, focusing on the UK. Focus on actionable insights for ${businessName}. State clearly if data is estimated.`;
};
