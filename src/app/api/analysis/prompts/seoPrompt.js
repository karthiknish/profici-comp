export const getSeoPrompt = (
  businessName,
  website,
  industry,
  competitorsString,
  insitesReport, // Pass the report object directly
  apolloData // Add apolloData parameter
) => {
  // Safely access nested properties from insitesReport
  const avgMonthlyTraffic =
    insitesReport?.organic_search?.average_monthly_traffic || "#";
  const totalBacklinks = insitesReport?.backlinks?.total_backlinks || "#";
  const referringDomains =
    insitesReport?.backlinks?.total_websites_linking || "#";
  const hasSpammyBacklinks = insitesReport?.backlinks?.has_spammy_backlinks
    ? "High Est."
    : "Low Est.";
  const isMobileFriendly = insitesReport?.mobile?.is_mobile
    ? "Good Est."
    : "Poor Est.";
  const contentFreshness = insitesReport?.last_updated?.days_since_update
    ? "Good Est."
    : "Needs Update Est.";
  const directoriesFound =
    insitesReport?.local_presence?.directories_found?.join(", ") || "N/A";
  const avgReview = insitesReport?.reviews_normalised?.average_review || "N/A";
  const reviewCount =
    insitesReport?.reviews_normalised?.reviews_found_count || "N/A";
  const isEcommerce = insitesReport?.ecommerce?.has_ecommerce;
  const insitesReportJson = JSON.stringify(insitesReport || {}, null, 2); // Stringify the passed object
  const apolloDataJson = JSON.stringify(apolloData || {}, null, 2); // Stringify apolloData

  return `IMPORTANT: Respond *only* with the requested Markdown content below. Do not include any introductory sentences, explanations, or conversational text. Replace ALL bracketed placeholders (like [#], [%], £[amount], [keyword], [description], etc.) with realistic, estimated numerical values or specific textual information based on the context provided. DO NOT return the bracket placeholders themselves. Focus all data and analysis specifically on the **United Kingdom (UK)** market. Use UK English spelling (e.g., analyse, optimisation, behaviour, centre).

Create a data-focused SEO analysis for ${businessName} (${website}) in the ${industry} industry, focusing on the **UK market**. Use the following Insites report data and Apollo.io company data for context where relevant:

Insites Report Data:
\`\`\`json
${insitesReportJson}
\`\`\`

Apollo.io Company Data:
\`\`\`json
${apolloDataJson}
\`\`\`

    Format in Markdown with these sections:

    ## Executive Summary (UK Focus)
    - SEO health score (UK): [0-100] (Estimate based on Insites data like overall_score, backlink profile, technical issues, and Apollo data like alexa_ranking: ${
      apolloData?.alexa_ranking
    })
    - Top 3 strengths (UK): [bullet points based on Insites data like keywords, domain age, analytics presence, and Apollo data like founded_year: ${
      apolloData?.founded_year
    }, estimated_num_employees: ${apolloData?.estimated_num_employees}]
    - Top 3 weaknesses (UK): [bullet points based on Insites data like thin content, mobile issues, backlink toxicity, and Apollo data if relevant]
    - Priority recommendations (UK): [action + impact %]
    - Competitive position (UK): [rank in industry, consider Apollo revenue: ${
      apolloData?.annual_revenue_printed
    }]
    - Competitor comparison (UK): [vs ${competitorsString}]

    ## Keyword Rankings (UK - Top 10-20)
    Use a Markdown table based on Insites organic_search data and Apollo keywords: | Keyword (UK Focus) | Ranking (UK) | Search Volume (UK) | Difficulty (UK) | Opportunity (UK) | Est. Traffic (UK) | |--------------------|--------------|--------------------|-----------------|------------------|-------------------| | [keyword from insites or apollo keywords: ${apolloData?.keywords
      ?.slice(0, 5)
      .join(
        ", "
      )}] | [# from insites] | [# from insites] | [Estimate 1-100] | [Estimate 1-10] | [Estimate #] |

    ### Keyword Distribution Summary (UK)
    Use a Markdown table based on Insites organic_search data: | Position Range | Percentage | MoM Change | Notes | |----------------|------------|------------|-------| | 1-3            | [% Estimate] | [+/- # Estimate] | [e.g., Cannibalisation] | | 4-10           | [% Estimate] | [+/- # Estimate] |       | | 11-20          | [% Estimate] | [+/- # Estimate] |       | | 21-50          | [% Estimate] | [+/- # Estimate] |       | | 51-100         | [% Estimate] | [+/- # Estimate] |       |
    - Intent breakdown (UK): [% informational, % navigational, % transactional, % commercial] (Estimate based on keywords from Insites/Apollo)
    - Keyword overlap with ${competitorsString} (UK): [% Estimate]

    ## Organic Traffic Metrics Summary (UK Focus)
    Use a Markdown table based on Insites organic_search data and Apollo alexa_ranking: | Metric         | Value                 | UK Industry Benchmark | Comparison | |----------------|-----------------------|-----------------------|------------| | Monthly Sessions (UK Est.) | [${avgMonthlyTraffic}] | [# Estimate] | [Above/Below/Avg, consider Alexa: ${
    apolloData?.alexa_ranking
  }] | | YoY Growth (UK Est.)     | [% Estimate]          | [% Estimate] | [Above/Below/Avg] | | Bounce Rate (UK Est.)    | [% Estimate]          | [% Estimate] | [Above/Below/Avg] | | Avg Session (UK Est.)    | [minutes:seconds Est.]| [minutes:seconds Est.]| [Above/Below/Avg] | | Pages/Session (UK Est.)  | [# Estimate]          | [# Estimate] | [Above/Below/Avg] |
    ### Top 5 Landing Pages (UK Traffic)
    Use a Markdown table based on Insites page_count data (estimate traffic %): | URL | Traffic % (UK Est.) | Bounce % Est. | Conversion % Est. | |-----|---------------------|---------------|-------------------| | [page from insites] | [% Estimate] | [% Estimate] | [% Estimate] |
    ### Top 5 Exit Pages (UK Traffic)
    Use a Markdown table (estimate exit %): | URL | Exit % (UK Est.) | |-----|----------------| | [page from insites] | [% Estimate] |
    - Device breakdown (UK): [desktop % + mobile % + tablet %] (Estimate based on Insites mobile data)
    - Geographic distribution (Top 3 UK Regions/Cities): [Region/City: % Estimate, consider Apollo location: ${
      apolloData?.city
    }, ${apolloData?.country}]
    - Traffic vs ${competitorsString} (UK Est.): [e.g., +X% more/less Estimate]

    ## Backlink Profile Summary (UK Relevance)
    Use a Markdown table based on Insites backlinks data: | Metric             | Value   | UK Industry Avg | Comparison | |--------------------|---------|-----------------|------------| | Total Backlinks    | [${totalBacklinks}] | [# Estimate] | [Above/Below/Avg] | | Referring Domains (.uk pref.) | [${referringDomains}] | [# Estimate] | [Above/Below/Avg] | | Domain Authority   | [Estimate 1-100] | [Estimate 1-100] | [Above/Below/Avg] | | Toxic Backlinks (%)| [${hasSpammyBacklinks}] | [% Estimate] | [Above/Below/Avg] | | Link Velocity      | [+/- #/mo Estimate] | [+/- #/mo Estimate] | [Above/Below/Avg] |
    ### Top 5 Referring Domains (UK Relevance)
    Use a Markdown table (estimate DA/Value): | Domain | DA Est. | Link Value (Est.) | |--------|---------|-------------------| | [domain.co.uk] | [1-100] | [High/Med/Low] |
    - Anchor text distribution (Top 3): [Type: % Estimate]
    - Competitor backlink gap (UK): [# Estimate] opportunities
    - Backlink comparison vs ${competitorsString} (UK Focus): [e.g., More .uk domains Estimate]

    ## Page Speed & Mobile Summary (Core Web Vitals - UK Context)
    Use a Markdown table based on Insites mobile data: | Metric         | Desktop Value | Mobile Value | Rating (Mobile) | |----------------|---------------|--------------|-----------------| | PageSpeed Score| [Estimate 0-100] | [Estimate 0-100] | [Good/Needs Improvement/Poor] | | LCP            | [s Estimate]  | [s Estimate] | [Good/Needs Improvement/Poor] | | FID/INP        | [ms Estimate] | [ms Estimate]| [Good/Needs Improvement/Poor] | | CLS            | [score Estimate]| [score Estimate]| [Good/Needs Improvement/Poor] |
    - Mobile-friendly score: [${isMobileFriendly}] (Consider viewport optimisation)
    - Top 3 speed issues: [Issue description Estimate based on Insites mobile flags]
    - Speed vs ${competitorsString} (UK Context): [e.g., Faster/Slower Estimate]

    ## Content Analysis Summary (UK Relevance)
    Use a Markdown table based on Insites amount_of_content data and Apollo description/keywords: | Metric                  | Score/Value | Notes | |-------------------------|-------------|-------| | Overall Quality (Est.)  | [Estimate 1-100] | [Brief assessment, consider Apollo desc: ${
      apolloData?.description
    }] | | Content Gaps Identified (UK) | [# Estimate] | [Key UK topics, consider Apollo keywords: ${apolloData?.keywords?.join(
    ", "
  )}] | | E-E-A-T Signals         | [Strong/Moderate/Weak Estimate] | [Evidence Estimate] | | Content Freshness       | [${contentFreshness}] |       | | Internal Linking        | [Good/Fair/Poor Estimate] | [Opportunities Estimate] |
    ### Top 3 Content Pieces (by UK Traffic/Engagement)
    Use a Markdown table (estimate metric/value): | URL | Key Metric | Value | |-----|------------|-------| | [page from insites] | [e.g., UK Sessions Est.] | [# Estimate] |
    - Content vs ${competitorsString} (UK Focus): [e.g., More UK-specific content Estimate]

    ## Keyword Gap Analysis Summary (UK Focus)
    Use a Markdown table for Top 5 Opportunities based on Insites organic_search.best_keyword_opportunities and Apollo keywords: | Keyword (UK) | Volume (UK) | Difficulty Est. | Relevance | Potential | |--------------|-------------|-----------------|-----------|-----------| | [keyword from insites/apollo] | [vol from insites] | [1-100] | [High/Med/Low] | [High/Med/Low] |
    - Total missing keywords vs competitors (UK): [# Estimate]
    - Featured snippet opportunities (UK): [# Estimate]
    - Gap analysis vs ${competitorsString} (UK): [Key themes Estimate]

    ## Technical SEO Issues Summary
    Use a Markdown table for Top 5 Issues (estimate based on Insites spider/mobile/etc.): | Issue Type                | Count Est. | Severity | Recommendation | |---------------------------|------------|----------|----------------| | [e.g., 404 Errors]        | [#]        | [High/Med/Low] | [Brief action] | | [e.g., Missing Alt Text]  | [#]        | [Med]    | [Brief action] |
    - Crawlability Score (Est.): [Estimate 1-100]
    - Indexation Rate (Est.): [% Estimate]
    - Schema Markup Coverage (Est.): [% Estimate]
    - Technical comparison vs ${competitorsString}: [e.g., Fewer errors, better schema Estimate]

    ## Local SEO Analysis Summary (UK Focus, If Applicable)
    Use a Markdown table based on Insites local_presence_normalised data and Apollo location: | Metric                | Score/Value | Notes | |-----------------------|-------------|-------| | Google Business Profile (UK) | [Estimate 1-100] | [UK optimisation points, consider Apollo location: ${
      apolloData?.city
    }] | | Citation Consistency (UK)  | [Estimate %] | [Top UK directories: ${directoriesFound}] | | Local Rankings (UK Avg)  | [# Estimate] | [Key UK cities/regions] | | Reviews (UK Avg Rating)  | [${avgReview}] | [# UK Reviews: ${reviewCount}] |
    - Local SEO vs ${competitorsString} (UK): [Key differences Estimate]

    ## E-commerce SEO Analysis Summary (If Applicable)
    ${
      isEcommerce
        ? `Use a Markdown table:`
        : "N/A - Not detected as an e-commerce site."
    } ${
    isEcommerce
      ? "| Metric             | Score/Status | Notes | |--------------------|--------------|-------| | Product Page Score | [Estimate 1-100] | [Key issues/strengths] | | Category Page Score| [Estimate 1-100] | [Key issues/strengths] | | Product Schema     | [% Coverage Est.] | [Errors?] | | Faceted Navigation | [Good/Fair/Poor Est.] | [Impact] |"
      : ""
  }
    ${
      isEcommerce
        ? `- E-commerce vs ${competitorsString} (UK): [Key differences Estimate]`
        : ""
    }

    Include specific estimated numbers and metrics throughout, focusing on the UK. Use H2/H3 headings for organisation. Provide measurable targets with expected outcomes. Give actionable recommendations with timeframes (30/60/90 days). Specify implementation tools and methods. State clearly if data is estimated.`;
};
