export const getSocialMediaPrompt = (
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
    keyTakeaways: {
      title: "Key Takeaways (Social Media)",
      points: [
        "Finding 1 (e.g., Strong presence on LinkedIn, weak on Instagram)",
        "Finding 2 (e.g., Competitor X has high engagement)",
        "Finding 3 (e.g., Opportunity on Platform Y)",
      ],
    },
    platformPresence: {
      title: "Platform Presence & Estimated Engagement (UK Focus)",
      headers: [
        "Platform",
        "Your Presence (Est.)",
        "Competitor Avg (Est.)",
        "Your Engagement Rate (Est. %)",
        "Competitor Avg Rate (Est. %)",
        "Key Content Types",
        "Notes / Recommendations",
      ],
      rows: [
        {
          platform: "LinkedIn",
          presence: "[Followers/Activity]",
          compAvg: "[Followers/Activity]",
          engRate: "[%]",
          compEngRate: "[%]",
          contentTypes: ["Articles", "Updates"],
          notes: "[e.g., Focus on B2B]",
        },
        {
          platform: "Instagram",
          presence: "[Followers/Activity]",
          compAvg: "[Followers/Activity]",
          engRate: "[%]",
          compEngRate: "[%]",
          contentTypes: ["Reels", "Stories"],
          notes: "[e.g., Visual content needed]",
        },
        {
          platform: "Facebook",
          presence: "[Followers/Activity]",
          compAvg: "[Followers/Activity]",
          engRate: "[%]",
          compEngRate: "[%]",
          contentTypes: ["Events", "Groups"],
          notes: "[e.g., Low priority?]",
        },
        {
          platform: "Twitter/X",
          presence: "[Followers/Activity]",
          compAvg: "[Followers/Activity]",
          engRate: "[%]",
          compEngRate: "[%]",
          contentTypes: ["Updates", "Q&A"],
          notes: "[e.g., Monitor mentions]",
        },
        {
          platform: "TikTok",
          presence: "[Followers/Activity]",
          compAvg: "[Followers/Activity]",
          engRate: "[%]",
          compEngRate: "[%]",
          contentTypes: ["Short videos"],
          notes: "[e.g., Emerging opportunity?]",
        },
        {
          platform: "YouTube",
          presence: "[Subscribers/Activity]",
          compAvg: "[Subscribers/Activity]",
          engRate: "[%]",
          compEngRate: "[%]",
          contentTypes: ["Tutorials", "Vlogs"],
          notes: "[e.g., High effort]",
        },
      ],
      notes:
        'Use "N/A" or "Low" if presence is negligible. Engagement Rate = (Likes+Comments+Shares)/Followers per post avg. estimations.',
    },
    sentimentAnalysis: {
      title: "Audience Sentiment Analysis (UK Focus)",
      overallBrandSentiment: {
        sentiment: "[Positive/Negative/Neutral/Mixed]",
        justification: "[Brief justification/evidence]",
      },
      keyThemes: ["Theme 1", "Theme 2", "Theme 3"],
      competitorSnippets: [
        { competitor: "[Competitor A]", summary: "[Brief sentiment summary]" },
        { competitor: "[Competitor B]", summary: "[Brief sentiment summary]" },
      ],
    },
    platformRecommendations: {
      title: "Platform Recommendations (UK Focus)",
      topPlatforms: [
        { platform: "[Name, e.g., LinkedIn]", rationale: "[Rationale]" },
        { platform: "[Name, e.g., YouTube]", rationale: "[Rationale]" },
      ],
      keyActions: [
        // Group actions by platform
        { platform: "[Platform 1 Name]", actions: ["Action 1", "Action 2"] },
        { platform: "[Platform 2 Name]", actions: ["Action 1", "Action 2"] },
        { platform: "General/Other", actions: ["Action if applicable"] },
      ],
      notes:
        "Follower counts, engagement rates, and sentiment are estimations based on public perception and industry knowledge.",
    },
  };

  return `**Formatting Instructions:**
- Respond *only* with a valid JSON object adhering strictly to the structure defined below.
- **Do not** include any introductory sentences, explanations, apologies, code block markers (\`\`\`), or conversational text outside the JSON structure.
- **Replace ALL bracketed placeholders** (e.g., \`[#]\`, \`[%]\`, \`[keyword]\`, \`[description]\`, \`£[amount]\`) within the JSON values with realistic, estimated numerical values or specific textual information derived from the provided context (Insites/Apollo data) or reasonable industry estimations if context is missing.
- **Do not** return the bracket placeholders themselves in the final JSON output. If specific data for a placeholder is unavailable, use \`null\` or a descriptive string like "Data unavailable". Use arrays for bullet points/list items/table rows as shown.
- Ensure all analysis, data, and estimations focus specifically on the **United Kingdom (UK)** market.
- Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

**Analysis Request:**

Provide an estimated social media presence analysis JSON object for ${businessName} (${website}) compared to competitors (${competitorsString}) in the ${industry} UK market. Use the following Insites report data and Apollo.io company data for context where relevant:

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
