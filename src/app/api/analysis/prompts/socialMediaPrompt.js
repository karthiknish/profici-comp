export const getSocialMediaPrompt = (
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport // Pass the report object directly
) => {
  // Safely access nested properties from insitesReport
  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2); // Stringify the passed object

  return `IMPORTANT: Respond *only* with the requested Markdown content below. Do not include any introductory sentences, explanations, or conversational text. Replace ALL bracketed placeholders (like [#], [%], £[amount], [keyword], [description], etc.) with realistic, estimated numerical values or specific textual information based on the context provided. DO NOT return the bracket placeholders themselves. Focus analysis on the **United Kingdom (UK)** market. Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

Provide an estimated social media presence analysis for ${businessName} (${website}) compared to competitors (${competitorsString}) in the ${industry} UK market. Use the following Insites report data for context where relevant, especially the facebook_page and x_(formerly_twitter) sections:
\`\`\`json
${insitesReportJson}
\`\`\`

Format in Markdown with H2 headings and tables/bullet points.

## Key Takeaways (Social Media)
- [Brief bullet point 1 summarizing a key finding, e.g., Strong presence on LinkedIn, weak on Instagram]
- [Brief bullet point 2 summarizing a key finding, e.g., Competitor X has high engagement]
- [Brief bullet point 3 summarizing a key finding, e.g., Opportunity on Platform Y]

## Platform Presence & Estimated Engagement (UK Focus)
Use a Markdown table:
| Platform    | Your Presence (Est.) | Competitor Avg (Est.) | Your Engagement Rate (Est. %) | Competitor Avg Rate (Est. %) | Key Content Types | Notes / Recommendations |
|-------------|----------------------|-------------------------|-------------------------------|------------------------------|-------------------|-------------------------|
| LinkedIn    | [Followers/Activity] | [Followers/Activity]    | [%]                           | [%]                          | [e.g., Articles, Updates] | [e.g., Focus on B2B] |
| Instagram   | [Followers/Activity] | [Followers/Activity]    | [%]                           | [%]                          | [e.g., Reels, Stories]  | [e.g., Visual content needed] |
| Facebook    | [Followers/Activity] | [Followers/Activity]    | [%]                           | [%]                          | [e.g., Events, Groups]  | [e.g., Low priority?] |
| Twitter/X   | [Followers/Activity] | [Followers/Activity]    | [%]                           | [%]                          | [e.g., Updates, Q&A]    | [e.g., Monitor mentions] |
| TikTok      | [Followers/Activity] | [Followers/Activity]    | [%]                           | [%]                          | [e.g., Short videos]    | [e.g., Emerging opportunity?] |
| YouTube     | [Subscribers/Activity] | [Subscribers/Activity]| [%]                           | [%]                          | [e.g., Tutorials, Vlogs]| [e.g., High effort] |
*(Use "N/A" or "Low" if presence is negligible. Engagement Rate = (Likes+Comments+Shares)/Followers per post avg.)*

## Audience Sentiment Analysis (UK Focus)
### Overall Brand Sentiment (Est.)
- [Positive/Negative/Neutral/Mixed] - [Brief justification/evidence]
### Key Discussion Themes (Est.)
- [Theme 1]
- [Theme 2]
- [Theme 3]
### Competitor Sentiment Snippets (Est.)
- [Competitor A: Brief sentiment summary]
- [Competitor B: Brief sentiment summary]

## Platform Recommendations (UK Focus)
### Top Recommended Platforms
- **Platform 1:** [Name, e.g., LinkedIn]
- **Platform 2:** [Name, e.g., YouTube]
### Rationale
- **[Platform 1 Name]:** [Concise bullet point rationale]
- **[Platform 2 Name]:** [Concise bullet point rationale]
### Key Actions (Next 3 Months)
- **[Platform 1 Name]:**
    - [Action 1]
    - [Action 2]
- **[Platform 2 Name]:**
    - [Action 1]
    - [Action 2]
- **General/Other Platforms:**
    - [Action for Facebook/Twitter/etc. if applicable]

State clearly that follower counts, engagement rates, and sentiment are estimations based on public perception and industry knowledge. Use the specified subheadings (###).`;
};
