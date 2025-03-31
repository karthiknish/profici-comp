export const getRecommendationsPrompt = (
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport // Pass the report object directly
) => {
  // Safely access nested properties from insitesReport
  const detectedTech =
    insitesReport?.technology_detection?.detected_technologies || "N/A";
  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2); // Stringify the passed object

  // Reverted to original complex structure, enhanced C-Suite
  return `IMPORTANT: Respond *only* with the requested Markdown content below. Do not include any introductory sentences, explanations, or conversational text. Replace ALL bracketed placeholders (like [#], [%], £[amount], [keyword], [description], etc.) with realistic, estimated numerical values or specific textual information based on the context provided. DO NOT return the bracket placeholders themselves. Focus recommendations on the **United Kingdom (UK)** market. Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

Provide strategic recommendations for ${businessName} (${website}) vs ${competitorsString} in the ${industry} **UK market**. Use the following Insites report data for context where relevant:
\`\`\`json
${insitesReportJson}
\`\`\`

    Format in Markdown with H2/H3 headings and tables/lists as specified below. Structure the response to match the Tabs/Accordion layout used in the frontend component. Focus on SMART recommendations relevant to the UK.

## Executive Summary (UK Focus)
- **Top 3 Strategic Priorities (UK):** 1. [Priority 1 Est.] 2. [Priority 2 Est.] 3. [Priority 3 Est.]
- **Expected Key Outcomes (12 months, UK):** [List 2-3 measurable outcomes Est., e.g., Increase UK market share by X%, Improve UK LTV:CAC to Y:1]
- **Overall Implementation Timeline:** [e.g., 6-12 months Est.]

## Digital Marketing Strategy Roadmap (UK Focus)
### Organic Search (SEO) - Next 6 Months (UK)
Use a Markdown table based on Insites SEO/Keyword data: | Action                     | Priority | Target UK Keywords/Areas | KPI Target        | Timeline | |----------------------------|----------|--------------------------|-------------------|----------| | [e.g., Fix technical issues]| High     | [e.g., Crawlability]     | [e.g., Index Rate >95% Est.] | 0-3 mo   | | [e.g., Create UK landing page] | Medium   | [Topic from Insites gaps]| [e.g., Rank Top 5 UK Est.] | 3-6 mo   | | [e.g., Build 5 .uk backlinks]  | Medium   | [Target pages]           | [e.g., DA Increase Est.] | 3-6 mo   |
### Social Media - Next 6 Months (UK Focus)
Use a Markdown table based on Insites social data: | Platform   | Content Focus (UK Angle) | Frequency | Key Metric | Target | |------------|--------------------------|-----------|------------|--------| | [e.g., LinkedIn] | [e.g., UK Case Studies Est.] | [e.g., 2/week Est.] | [e.g., Engagement Rate Est.] | [e.g., >3% Est.] | | [e.g., Instagram]| [e.g., UK Lifestyle Est.]  | [e.g., 3/week Est.] | [e.g., Follower Growth Est.] | [e.g., +10% Est.] |
### Paid Media - Next 6 Months (UK Focus)
Use a Markdown table based on Insites paid_search data: | Channel     | Budget Allocation (£ Est.) | Key UK Campaign Focus | Target ROAS/CPA (£ Est.) | |-------------|--------------------------|-----------------------|--------------------------| | [e.g., Google Ads UK] | [% Est.] | [e.g., UK High-Intent Keywords Est.] | [e.g., 4:1 ROAS Est.] | | [e.g., LinkedIn Ads UK]| [% Est.] | [e.g., UK Lead Gen Form Est.] | [e.g., <£50 CPA Est.] |

## C-Suite Strategic Initiatives (UK Focus)
Provide **in-depth**, actionable recommendations for each C-Suite role, going beyond single sentences. Include potential challenges or considerations. Use the exact format below including bullet points for actions and challenges.
### CEO
- **Strategic Focus:** [e.g., Expand UK market share Est.]
- **Key Action(s):**
    - [Detailed Action 1, e.g., Identify and negotiate with 2 potential UK distribution partners by end of Q2.]
    - [Detailed Action 2, e.g., Evaluate feasibility of a small UK-based acquisition target by end of Q3.]
- **Potential Challenges:** [e.g., Market saturation, finding suitable partners.]
### CMO
- **Strategic Focus:** [e.g., Enhance brand positioning as a leader in UK [Niche] Est.]
- **Key Action(s):**
    - [Detailed Action 1, e.g., Develop and launch a UK-centric content marketing campaign focusing on [Key Theme] by Q4, measuring reach and engagement.]
    - [Detailed Action 2, e.g., Secure speaking opportunities at 2 major UK industry events in the next 12 months.]
- **Potential Challenges:** [e.g., Cutting through competitor noise, measuring brand perception shift.]
### CTO/CIO
- **Strategic Focus:** [e.g., Leverage detected tech: ${detectedTech} for competitive advantage]
- **Key Action(s):**
    - [Detailed Action 1, e.g., Pilot integration of [Detected Tech Feature] into the UK customer onboarding flow by Q3, aiming for X% efficiency gain.]
    - [Detailed Action 2, e.g., Research UK-specific compliance requirements for using [Detected Tech].]
- **Potential Challenges:** [e.g., Integration complexity, data privacy regulations (GDPR).]
### CFO
- **Strategic Focus:** [e.g., Optimise UK pricing model for profitability Est.]
- **Key Action(s):**
    - [Detailed Action 1, e.g., Conduct A/B testing of tiered £ pricing vs. project-based pricing for UK clients in Q4.]
    - [Detailed Action 2, e.g., Analyse competitor pricing and value proposition quarterly.]
- **Potential Challenges:** [e.g., Customer reaction to price changes, accurately modelling LTV.]
### COO
- **Strategic Focus:** [e.g., Streamline UK customer onboarding process Est.]
- **Key Action(s):**
    - [Detailed Action 1, e.g., Map current UK onboarding journey and identify bottlenecks by end of Q2.]
    - [Detailed Action 2, e.g., Implement CRM automation to reduce manual touchpoints by 30% by Q3.]
- **Potential Challenges:** [e.g., Change management, ensuring positive customer experience during transition.]


## Implementation Roadmap Summary (UK Focus)
Use Markdown lists under H3 headings for each phase:
### Phase 1 (0-3 months)
- [UK Action 1 Est.]
- [UK Action 2 Est.]
- [UK Action 3 Est.]
### Phase 2 (3-6 months)
- [UK Action 1 Est.]
- [UK Action 2 Est.]
- [UK Action 3 Est.]
### Phase 3 (6-12 months)
- [UK Action 1 Est.]
- [UK Action 2 Est.]
- [UK Action 3 Est.]

## ROI Projections (Estimated - UK Market)
Use a Markdown table:
| Initiative                 | Estimated Cost (£) | Estimated Return (12 mo, £) | Estimated ROI | Confidence |
|----------------------------|--------------------|-----------------------------|---------------|------------|
| [e.g., UK SEO Overhaul]    | [£X Est.]          | [£Y Est.]                   | [% Est.]      | [High/Med/Low] |
| [e.g., UK Paid Social]   | [£A Est.]          | [£B Est.]                   | [% Est.]      | [High/Med/Low] |

All recommendations should be SMART (specific, measurable, achievable, relevant, time-bound) and tailored for the UK market. Use estimated but realistic numbers for targets and projections. Leverage insights from the provided Insites JSON data where possible.`;
};
