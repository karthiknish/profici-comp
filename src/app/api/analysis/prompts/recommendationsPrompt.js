export const getRecommendationsPrompt = (
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport, // Pass the report object directly
  apolloData, // Add apolloData parameter
  competitorsApolloData, // Add competitorsApolloData parameter
  fullAnalysisContext
) => {
  // Safely access nested properties from insitesReport
  const detectedTech = // Combine Insites and Apollo tech data
    [
      ...(insitesReport?.technology_detection?.detected_technologies || []),
      ...(apolloData?.technology_names || []),
    ]
      .filter((v, i, a) => a.indexOf(v) === i) // Get unique values
      .join(", ") || "N/A"; // Join unique tech names

  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2); // Stringify the passed object
  const apolloDataJson = JSON.stringify(apolloData || {}, null, 2); // Stringify apolloData
  // Stringify the competitor Apollo data array
  const competitorsApolloDataJson = JSON.stringify(
    competitorsApolloData || [],
    null,
    2
  );

  // Define the desired JSON structure
  const jsonStructure = {
    executiveSummary: {
      title: "Executive Summary (UK Focus)",
      priorities: ["Priority 1", "Priority 2", "Priority 3"],
      outcomes: [
        "Outcome 1 (e.g., Increase UK market share by X%)",
        "Outcome 2 (e.g., Improve UK LTV:CAC to Y:1)",
      ],
      timeline: "[e.g., 6-12 months Est.]",
    },
    digitalMarketingRoadmap: {
      title: "Digital Marketing Strategy Roadmap (UK Focus)",
      seo: {
        title: "Organic Search (SEO) - Next 6 Months (UK)",
        headers: [
          "Action",
          "Priority",
          "Target UK Keywords/Areas",
          "KPI Target",
          "Timeline",
          "Effort", // Added
          "Impact", // Added
        ],
        rows: [
          {
            action: "[e.g., Fix technical issues]",
            priority: "High",
            target: "[e.g., Crawlability]",
            kpi: "[e.g., Index Rate >95% Est.]",
            timeline: "0-3 mo",
            effort: "[Low/Medium/High]", // Added
            impact: "[Low/Medium/High]", // Added
          },
          {
            action: "[e.g., Create UK landing page]",
            priority: "Medium",
            target: "[Topic]",
            kpi: "[e.g., Rank Top 5 UK Est.]",
            timeline: "3-6 mo",
            effort: "[Low/Medium/High]", // Added
            impact: "[Low/Medium/High]", // Added
          },
          {
            action: "[e.g., Build 5 .uk backlinks]",
            priority: "Medium",
            target: "[Target pages]",
            kpi: "[e.g., DA Increase Est.]",
            timeline: "3-6 mo",
            effort: "[Low/Medium/High]", // Added
            impact: "[Low/Medium/High]", // Added
          },
        ],
      },
      socialMedia: {
        title: "Social Media - Next 6 Months (UK Focus)",
        headers: [
          "Platform",
          "Content Focus (UK Angle)",
          "Frequency",
          "Key Metric",
          "Target",
          "Effort", // Added
          "Impact", // Added
        ],
        rows: [
          {
            platform: "[e.g., LinkedIn]",
            contentFocus: "[e.g., UK Case Studies Est.]",
            frequency: "[e.g., 2/week Est.]",
            metric: "[e.g., Engagement Rate Est.]",
            target: "[e.g., >3% Est.]",
            effort: "[Low/Medium/High]", // Added
            impact: "[Low/Medium/High]", // Added
          },
          {
            platform: "[e.g., Instagram]",
            contentFocus: "[e.g., UK Lifestyle Est.]",
            frequency: "[e.g., 3/week Est.]",
            metric: "[e.g., Follower Growth Est.]",
            target: "[e.g., +10% Est.]",
            effort: "[Low/Medium/High]", // Added
            impact: "[Low/Medium/High]", // Added
          },
        ],
      },
      paidMedia: {
        title: "Paid Media - Next 6 Months (UK Focus)",
        headers: [
          "Channel",
          "Budget Allocation (£ Est.)",
          "Key UK Campaign Focus",
          "Target ROAS/CPA (£ Est.)",
          "Effort", // Added
          "Impact", // Added
        ],
        rows: [
          {
            channel: "[e.g., Google Ads UK]",
            budget: "[% Est.]",
            focus: "[e.g., UK High-Intent Keywords Est.]",
            target: "[e.g., 4:1 ROAS Est.]",
            effort: "[Low/Medium/High]", // Added
            impact: "[Low/Medium/High]", // Added
          },
          {
            channel: "[e.g., LinkedIn Ads UK]",
            budget: "[% Est.]",
            focus: "[e.g., UK Lead Gen Form Est.]",
            target: "[e.g., <£50 CPA Est.]",
            effort: "[Low/Medium/High]", // Added
            impact: "[Low/Medium/High]", // Added
          },
        ],
      },
    },
    cSuiteInitiatives: {
      title: "C-Suite Strategic Initiatives (UK Focus)",
      roles: [
        {
          role: "CEO",
          focus: "[e.g., Expand UK market share Est.]",
          actions: ["Detailed Action 1", "Detailed Action 2"],
          challenges: ["Challenge 1", "Challenge 2"],
        },
        {
          role: "CMO",
          focus:
            "[e.g., Enhance brand positioning as a leader in UK [Niche] Est.]",
          actions: ["Detailed Action 1", "Detailed Action 2"],
          challenges: ["Challenge 1", "Challenge 2"],
        },
        {
          role: "CTO/CIO",
          focus: `[e.g., Leverage detected tech: ${detectedTech} for competitive advantage]`,
          actions: ["Detailed Action 1", "Detailed Action 2"],
          challenges: ["Challenge 1", "Challenge 2"],
        },
        {
          role: "CFO",
          focus: "[e.g., Optimise UK pricing model for profitability Est.]",
          actions: ["Detailed Action 1", "Detailed Action 2"],
          challenges: ["Challenge 1", "Challenge 2"],
        },
        {
          role: "COO",
          focus: "[e.g., Streamline UK customer onboarding process Est.]",
          actions: ["Detailed Action 1", "Detailed Action 2"],
          challenges: ["Challenge 1", "Challenge 2"],
        },
      ],
    },
    implementationRoadmap: {
      title: "Implementation Roadmap Summary (UK Focus)",
      phases: [
        {
          phase: "Phase 1 (0-3 months)",
          actions: [
            {
              action: "UK Action 1",
              effort: "[Low/Medium/High]",
              impact: "[Low/Medium/High]",
            },
            {
              action: "UK Action 2",
              effort: "[Low/Medium/High]",
              impact: "[Low/Medium/High]",
            },
          ],
        },
        {
          phase: "Phase 2 (3-6 months)",
          actions: [
            {
              action: "UK Action 1",
              effort: "[Low/Medium/High]",
              impact: "[Low/Medium/High]",
            },
            {
              action: "UK Action 2",
              effort: "[Low/Medium/High]",
              impact: "[Low/Medium/High]",
            },
          ],
        },
        {
          phase: "Phase 3 (6-12 months)",
          actions: [
            {
              action: "UK Action 1",
              effort: "[Low/Medium/High]",
              impact: "[Low/Medium/High]",
            },
            {
              action: "UK Action 2",
              effort: "[Low/Medium/High]",
              impact: "[Low/Medium/High]",
            },
          ],
        },
      ],
    },
    roiProjections: {
      title: "Estimated ROI & Business Impact (12-24 Months)",
      projections: [
        {
          metric: "Metric 1 (e.g., Revenue Increase)",
          projection: "£[Amount] or [%]",
          assumptions: "[Brief assumptions]",
        },
        {
          metric: "Metric 2 (e.g., Cost Reduction)",
          projection: "£[Amount] or [%]",
          assumptions: "[Brief assumptions]",
        },
        {
          metric: "Metric 3 (e.g., Market Share Growth)",
          projection: "[%]",
          assumptions: "[Brief assumptions]",
        },
      ],
    },
    advantageOpportunities: {
      title: "Strategic Technology & Data Opportunities (UK Market)",
      opportunities: [
        {
          opportunity:
            "Opportunity 1 Description (e.g., Leverage specific tech stack difference)",
          strategicAction:
            "[CTO/CIO Level Action: e.g., Integrate X data with Y system, Adopt Z technology for efficiency]",
          competitiveEdge: "[How this provides an edge over competitors]",
          relevantTech: ["[Relevant Tech 1]", "[Relevant Tech 2]"], // Optional: List relevant tech
        },
        {
          opportunity:
            "Opportunity 2 Description (e.g., Exploit competitor's tech weakness)",
          strategicAction: "[CTO/CIO Level Action]",
          competitiveEdge: "[How this provides an edge]",
          relevantTech: ["[Relevant Tech 3]"],
        },
        {
          opportunity:
            "Opportunity 3 Description (e.g., Data integration potential)",
          strategicAction: "[CTO/CIO Level Action]",
          competitiveEdge: "[How this provides an edge]",
          relevantTech: [],
        },
      ],
    },
  };

  return `**Formatting Instructions:**
- Respond *only* with a valid JSON object adhering strictly to the structure defined above.
- **Do not** include any introductory sentences, explanations, apologies, code block markers (\`\`\`), or conversational text outside the JSON structure.
- **Replace ALL bracketed placeholders** (e.g., \`[description]\`, \`£[Amount]\`, \`[%]\`) within the JSON values with specific, actionable recommendations, insights, and realistic estimations based on the provided analysis context. Focus on **UK market specifics**.
- **Do not** return the bracket placeholders themselves in the final JSON output. If specific data for a placeholder is unavailable or not applicable, use \`null\` or a descriptive string like "N/A" or "Data unavailable".
- Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).
- Base recommendations on the collective insights from all provided analysis sections (SEO, Competitor, Trends, Market, Social, News, Content Ideas, Topic Clusters). Ensure recommendations are **synergistic** and **prioritized**.
- **For 'cSuiteInitiatives'**:
    - **Analyze Company Scale:** Before defining roles, evaluate the company's scale using metrics available in the 'Analysis Context' (especially from Apollo data like employee count, estimated revenue, funding).
    - **Tailor Roles:** Based on the scale:
        - For large enterprises, the full C-suite (CEO, CMO, CTO, CFO, COO) is likely appropriate.
        - For SMEs or startups, determine if all roles are necessary. Consider suggesting combined roles (e.g., CEO/Founder covers strategy, Marketing Lead instead of CMO) or omitting roles that aren't justified by the company's current size and complexity.
        - Only include roles in the final 'cSuiteInitiatives.roles' array that are realistically needed *now* or in the near term (next 12 months) based on the company's profile.
    - **Focus Actions:** Ensure the 'focus' and 'actions' for each included role are strategic and relevant to the UK market and the overall analysis.
- **For 'advantageOpportunities'**: Focus specifically on strategic opportunities from a **CTO/CIO perspective**, drawing from competitor tech stack differences, data gaps/opportunities, or potential new tech adoption relevant to the UK market. Actions should be strategic (e.g., system integration, tech adoption, data strategy). Mention relevant technologies where applicable.


**Analysis Context:**

Here is the comprehensive analysis data for ${businessName} (${website}) in the ${industry} industry (UK Market Focus):

${fullAnalysisContext}

**Required JSON Output Structure:**
\`\`\`json
${JSON.stringify(jsonStructure, null, 2)}
\`\`\`

Generate the strategic recommendations JSON object based *only* on the provided analysis context.`;
};
