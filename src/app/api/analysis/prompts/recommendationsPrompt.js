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

  return `**Formatting Instructions:**
- Respond *only* with a valid JSON object adhering strictly to the structure defined below.
- **Do not** include any introductory sentences, explanations, apologies, code block markers (\`\`\`), or conversational text outside the JSON structure.
- **Replace ALL bracketed placeholders** (e.g., \`[description]\`, \`£[Amount]\`, \`[%]\`) within the JSON values with specific, actionable recommendations, insights, and realistic estimations based on the provided analysis context. Focus on **UK market specifics**.
- **Do not** return the bracket placeholders themselves in the final JSON output. If specific data for a placeholder is unavailable or not applicable, use \`null\` or a descriptive string like "N/A" or "Data unavailable".
- Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).
- Base recommendations on the collective insights from all provided analysis sections (SEO, Competitor, Trends, Market, Social, News, Content Ideas, Topic Clusters). Ensure recommendations are **synergistic** and **prioritized**.
- **For 'cSuiteInitiatives' (CRITICAL INSTRUCTION):**
    - **Analyze Company Scale:** Evaluate the company's scale using metrics in the 'Analysis Context' (especially Apollo data: estimated_num_employees, annual_revenue_printed, total_funding_printed).
    - **Determine Applicability:**
        - **If the company is small** (e.g., fewer than ~15 employees, low revenue/funding, early stage), dedicated C-suite roles are likely **NOT applicable**. In this case, the 'cSuiteInitiatives.roles' array in the final JSON **MUST be empty (\`[]\`)**. Do NOT include placeholder roles.
        - **If the company is medium/large**, include relevant C-suite roles (CEO, CMO, CTO, CFO, COO, or combined roles like CEO/Founder) justified by its scale and the analysis.
    - **Adapt the Template:** The provided structure below is a template. You **MUST** adapt it. If C-suite roles are not applicable due to company size, ensure the \`roles\` array is empty (\`[]\`) in your final JSON output.
    - **Focus Actions:** For any roles *actually included*, ensure their 'focus' and 'actions' are strategic, UK-focused, and derived from the analysis.
- **For 'advantageOpportunities'**: Focus specifically on strategic opportunities from a **CTO/CIO perspective**, drawing from competitor tech stack differences, data gaps/opportunities, or potential new tech adoption relevant to the UK market. Actions should be strategic (e.g., system integration, tech adoption, data strategy). Mention relevant technologies where applicable.


**Analysis Context:**

Here is the comprehensive analysis data for ${businessName} (${website}) in the ${industry} industry (UK Market Focus):

${fullAnalysisContext}

**Required JSON Output Structure:**

{
  "executiveSummary": {
    "title": "Executive Summary (UK Focus)",
    "priorities": ["Priority 1", "Priority 2", "Priority 3"],
    "outcomes": [
      "Outcome 1 (e.g., Increase UK market share by X%)",
      "Outcome 2 (e.g., Improve UK LTV:CAC to Y:1)"
    ],
    "timeline": "[e.g., 6-12 months Est.]"
  },
  "digitalMarketingRoadmap": {
    "title": "Digital Marketing Strategy Roadmap (UK Focus)",
    "seo": {
      "title": "Organic Search (SEO) - Next 6 Months (UK)",
      "headers": [
        "Action",
        "Priority", 
        "Target UK Keywords/Areas",
        "KPI Target",
        "Timeline",
        "Effort",
        "Impact"
      ],
      "rows": [
        {
          "action": "[e.g., Fix technical issues]",
          "priority": "High",
          "target": "[e.g., Crawlability]", 
          "kpi": "[e.g., Index Rate >95% Est.]",
          "timeline": "0-3 mo",
          "effort": "[Low/Medium/High]",
          "impact": "[Low/Medium/High]"
        },
        {
          "action": "[e.g., Create UK landing page]",
          "priority": "Medium",
          "target": "[Topic]",
          "kpi": "[e.g., Rank Top 5 UK Est.]",
          "timeline": "3-6 mo",
          "effort": "[Low/Medium/High]",
          "impact": "[Low/Medium/High]"
        },
        {
          "action": "[e.g., Build 5 .uk backlinks]",
          "priority": "Medium",
          "target": "[Target pages]",
          "kpi": "[e.g., DA Increase Est.]",
          "timeline": "3-6 mo",
          "effort": "[Low/Medium/High]",
          "impact": "[Low/Medium/High]"
        }
      ]
    },
    "socialMedia": {
      "title": "Social Media - Next 6 Months (UK Focus)",
      "headers": [
        "Platform",
        "Content Focus (UK Angle)",
        "Frequency",
        "Key Metric",
        "Target",
        "Effort",
        "Impact"
      ],
      "rows": [
        {
          "platform": "[e.g., LinkedIn]",
          "contentFocus": "[e.g., UK Case Studies Est.]",
          "frequency": "[e.g., 2/week Est.]",
          "metric": "[e.g., Engagement Rate Est.]",
          "target": "[e.g., >3% Est.]",
          "effort": "[Low/Medium/High]",
          "impact": "[Low/Medium/High]"
        },
        {
          "platform": "[e.g., Instagram]",
          "contentFocus": "[e.g., UK Lifestyle Est.]",
          "frequency": "[e.g., 3/week Est.]",
          "metric": "[e.g., Follower Growth Est.]",
          "target": "[e.g., +10% Est.]",
          "effort": "[Low/Medium/High]",
          "impact": "[Low/Medium/High]"
        }
      ]
    },
    "paidMedia": {
      "title": "Paid Media - Next 6 Months (UK Focus)",
      "headers": [
        "Channel",
        "Budget Allocation (£ Est.)",
        "Key UK Campaign Focus",
        "Target ROAS/CPA (£ Est.)",
        "Effort",
        "Impact"
      ],
      "rows": [
        {
          "channel": "[e.g., Google Ads UK]",
          "budget": "[% Est.]",
          "focus": "[e.g., UK High-Intent Keywords Est.]",
          "target": "[e.g., 4:1 ROAS Est.]",
          "effort": "[Low/Medium/High]",
          "impact": "[Low/Medium/High]"
        },
        {
          "channel": "[e.g., LinkedIn Ads UK]",
          "budget": "[% Est.]",
          "focus": "[e.g., UK Lead Gen Form Est.]",
          "target": "[e.g., <£50 CPA Est.]",
          "effort": "[Low/Medium/High]",
          "impact": "[Low/Medium/High]"
        }
      ]
    }
  },
  "cSuiteInitiatives": {
    "title": "C-Suite Strategic Initiatives (UK Focus)",
    "roles": [
      {
        "role": "CEO",
        "focus": "[e.g., Expand UK market share Est.]",
        "actions": ["Detailed Action 1", "Detailed Action 2"],
        "challenges": ["Challenge 1", "Challenge 2"]
      },
      {
        "role": "CMO",
        "focus": "[e.g., Enhance brand positioning as a leader in UK [Niche] Est.]",
        "actions": ["Detailed Action 1", "Detailed Action 2"],
        "challenges": ["Challenge 1", "Challenge 2"]
      },
      {
        "role": "CTO/CIO",
        "focus": "[e.g., Leverage detected tech: ${detectedTech} for competitive advantage]",
        "actions": ["Detailed Action 1", "Detailed Action 2"],
        "challenges": ["Challenge 1", "Challenge 2"]
      },
      {
        "role": "CFO",
        "focus": "[e.g., Optimise UK pricing model for profitability Est.]",
        "actions": ["Detailed Action 1", "Detailed Action 2"],
        "challenges": ["Challenge 1", "Challenge 2"]
      },
      {
        "role": "COO",
        "focus": "[e.g., Streamline UK customer onboarding process Est.]",
        "actions": ["Detailed Action 1", "Detailed Action 2"],
        "challenges": ["Challenge 1", "Challenge 2"]
      }
    ]
  },
  "implementationRoadmap": {
    "title": "Implementation Roadmap Summary (UK Focus)",
    "phases": [
      {
        "phase": "Phase 1 (0-3 months)",
        "actions": [
          {
            "action": "UK Action 1",
            "effort": "[Low/Medium/High]",
            "impact": "[Low/Medium/High]"
          },
          {
            "action": "UK Action 2",
            "effort": "[Low/Medium/High]",
            "impact": "[Low/Medium/High]"
          }
        ]
      },
      {
        "phase": "Phase 2 (3-6 months)",
        "actions": [
          {
            "action": "UK Action 1",
            "effort": "[Low/Medium/High]",
            "impact": "[Low/Medium/High]"
          },
          {
            "action": "UK Action 2",
            "effort": "[Low/Medium/High]",
            "impact": "[Low/Medium/High]"
          }
        ]
      },
      {
        "phase": "Phase 3 (6-12 months)",
        "actions": [
          {
            "action": "UK Action 1",
            "effort": "[Low/Medium/High]",
            "impact": "[Low/Medium/High]"
          },
          {
            "action": "UK Action 2",
            "effort": "[Low/Medium/High]",
            "impact": "[Low/Medium/High]"
          }
        ]
      }
    ]
  },
  "roiProjections": {
    "title": "Estimated ROI & Business Impact (12-24 Months)",
    "projections": [
      {
        "metric": "Metric 1 (e.g., Revenue Increase)",
        "projection": "£[Amount] or [%]",
        "assumptions": "[Brief assumptions]"
      },
      {
        "metric": "Metric 2 (e.g., Cost Reduction)",
        "projection": "£[Amount] or [%]",
        "assumptions": "[Brief assumptions]"
      },
      {
        "metric": "Metric 3 (e.g., Market Share Growth)",
        "projection": "[%]",
        "assumptions": "[Brief assumptions]"
      }
    ]
  },
  "advantageOpportunities": {
    "title": "Strategic Technology & Data Opportunities (UK Market)",
    "opportunities": [
      {
        "opportunity": "Opportunity 1 Description (e.g., Leverage specific tech stack difference)",
        "strategicAction": "[CTO/CIO Level Action: e.g., Integrate X data with Y system, Adopt Z technology for efficiency]",
        "competitiveEdge": "[How this provides an edge over competitors]",
        "relevantTech": ["[Relevant Tech 1]", "[Relevant Tech 2]"]
      },
      {
        "opportunity": "Opportunity 2 Description (e.g., Exploit competitor's tech weakness)",
        "strategicAction": "[CTO/CIO Level Action]",
        "competitiveEdge": "[How this provides an edge]",
        "relevantTech": ["[Relevant Tech 3]"]
      },
      {
        "opportunity": "Opportunity 3 Description (e.g., Data integration potential)",
        "strategicAction": "[CTO/CIO Level Action]",
        "competitiveEdge": "[How this provides an edge]",
        "relevantTech": []
      }
    ]
  }
}`;
};
