import React from "react";
import { ThumbsUp, ThumbsDown, Target, AlertTriangle } from "lucide-react"; // Import icons needed by specific renderers

// --- Helper Components for Rendering JSON ---

// Basic component to render text, handling potential bold markers (**)
export const FormattedText = ({ text, className = "" }) => {
  if (text === null || text === undefined) {
    return <span className={className}>—</span>; // Em dash for missing
  }
  if (typeof text !== "string") {
    return <span className={className}>{String(text)}</span>;
  }

  // Strip leading markdown heading markers
  const normalized = text.replace(/^(#+\s*)/, "");

  // Split by markdown-style links and bold markers: **bold** and [label](url)
  const regex = /(\*\*(.*?)\*\*)|(\[(.*?)\]\((.*?)\))/g;
  const nodes = [];
  let last = 0;
  let match;
  while ((match = regex.exec(normalized)) !== null) {
    if (match.index > last) {
      nodes.push(normalized.slice(last, match.index));
    }
    if (match[1]) {
      // Bold
      nodes.push(
        <strong key={`b-${last}`} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      const href = match[5];
      const label = match[4] || href;
      if (/^https?:\/\//i.test(href)) {
        nodes.push(
          <a
            key={`a-${last}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 dark:text-blue-400"
          >
            {label}
          </a>
        );
      } else {
        nodes.push(match[0]);
      }
    }
    last = regex.lastIndex;
  }
  if (last < normalized.length) {
    nodes.push(normalized.slice(last));
  }

  // Convert line breaks to <br /> for readability
  const withBreaks = nodes.flatMap((node, i) => {
    if (typeof node === "string" && node.includes("\n")) {
      const parts = node.split("\n");
      return parts.flatMap((p, j) =>
        j < parts.length - 1 ? [p, <br key={`br-${i}-${j}`} />] : [p]
      );
    }
    return [node];
  });

  return <span className={className}>{withBreaks}</span>;
};

// Component to render a simple list from an array of strings
export const JsonList = ({
  items,
  className = "list-disc list-inside space-y-1 text-sm",
}) => {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index}>
          <FormattedText text={item} />
        </li>
      ))}
    </ul>
  );
};

// Component to render a table from JSON structure { headers: [], rows: [{}, {}] }
export const JsonTable = ({
  data,
  className = "w-full text-sm border-collapse",
}) => {
  if (!data || !Array.isArray(data.headers) || !Array.isArray(data.rows))
    return (
      <p className="text-muted-foreground text-sm">
        Table data is missing or invalid.
      </p>
    );
  const { headers, rows } = data;

  return (
    <div className="overflow-x-auto rounded-lg border my-4">
      <table
        className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
      >
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0
                  ? undefined
                  : "bg-gray-50 dark:bg-gray-700/50"
              }
            >
              {headers.map((_header, colIndex) => {
                // Try to access cell data using object keys (assuming consistent order) or array index
                const cellData =
                  typeof row === "object" && row !== null
                    ? Object.values(row)[colIndex]
                    : Array.isArray(row)
                    ? row[colIndex]
                    : "N/A";
                return (
                  <td
                    key={colIndex}
                                className="px-4 py-2 whitespace-normal align-top text-xs text-gray-700 dark:text-gray-300"
                  >
                    {/* Render arrays as bullet points within the cell */}
                    {Array.isArray(cellData) ? (
                      <JsonList
                        items={cellData}
                        className="list-disc list-inside space-y-0.5"
                      />
                    ) : (
                      <FormattedText text={String(cellData ?? "N/A")} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Specific Renderers for Complex Nested Structures ---
// These are used by RenderJsonSection below

const RenderSwot = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {data.strengths && (
      <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/30">
        <h4 className="font-semibold mb-2 flex items-center text-green-800 dark:text-green-300">
          <ThumbsUp className="mr-2 h-4 w-4" /> Strengths
        </h4>
        <JsonList
          items={data.strengths}
          className="list-disc pl-5 space-y-1 text-sm text-green-700 dark:text-green-400"
        />
      </div>
    )}
    {data.weaknesses && (
      <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/30">
        <h4 className="font-semibold mb-2 flex items-center text-red-800 dark:text-red-300">
          <ThumbsDown className="mr-2 h-4 w-4" /> Weaknesses
        </h4>
        <JsonList
          items={data.weaknesses}
          className="list-disc pl-5 space-y-1 text-sm text-red-700 dark:text-red-400"
        />
      </div>
    )}
    {data.opportunities && (
      <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/30">
        <h4 className="font-semibold mb-2 flex items-center text-blue-800 dark:text-blue-300">
          <Target className="mr-2 h-4 w-4" /> Opportunities
        </h4>
        <JsonList
          items={data.opportunities}
          className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-400"
        />
      </div>
    )}
    {data.threats && (
      <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
        <h4 className="font-semibold mb-2 flex items-center text-yellow-800 dark:text-yellow-300">
          <AlertTriangle className="mr-2 h-4 w-4" /> Threats
        </h4>
        <JsonList
          items={data.threats}
          className="list-disc pl-5 space-y-1 text-sm text-yellow-700 dark:text-yellow-400"
        />
      </div>
    )}
  </div>
);

const RenderApolloComparison = ({ data }) => (
  <div>
    {data.map((compData, idx) => (
      <div
        key={idx}
        className="mb-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700"
      >
        <h4 className="font-semibold text-sm mb-1">{compData.name}</h4>
        {compData.confirmations?.length > 0 && (
          <div className="mt-1">
            <strong className="text-xs uppercase text-muted-foreground">
              Confirmations:
            </strong>
            <JsonList items={compData.confirmations} />
          </div>
        )}
        {compData.discrepancies?.length > 0 && (
          <div className="mt-1">
            <strong className="text-xs uppercase text-muted-foreground">
              Discrepancies:
            </strong>
            <JsonList items={compData.discrepancies} />
          </div>
        )}
        {compData.insights?.length > 0 && (
          <div className="mt-1">
            <strong className="text-xs uppercase text-muted-foreground">
              New Insights:
            </strong>
            <JsonList items={compData.insights} />
          </div>
        )}
      </div>
    ))}
  </div>
);

const RenderCSuite = ({ data }) => (
  <div className="space-y-4">
    {data.map((roleData, idx) => (
      <div key={idx} className="p-3 border rounded-md bg-muted/50">
        <h4 className="font-semibold text-base mb-2">{roleData.role}</h4>
        {roleData.focus && (
          <p className="text-sm mb-2">
            <strong className="font-medium">Strategic Focus:</strong>{" "}
            <FormattedText text={roleData.focus} />
          </p>
        )}
        {Array.isArray(roleData.actions) && roleData.actions.length > 0 && (
          <div className="mb-2">
            <strong className="text-sm font-medium">Key Action(s):</strong>
            <JsonList
              items={roleData.actions}
              className="list-disc list-inside space-y-1 text-sm pl-4 mt-1"
            />
          </div>
        )}
        {Array.isArray(roleData.challenges) &&
          roleData.challenges.length > 0 && (
            <div>
              <strong className="text-sm font-medium">
                Potential Challenges:
              </strong>
              <JsonList
                items={roleData.challenges}
                className="list-disc list-inside space-y-1 text-sm pl-4 mt-1"
              />
            </div>
          )}
      </div>
    ))}
  </div>
);

const RenderRoadmapPhases = ({ data }) => (
  <div>
    {data.map((phaseData, idx) => (
      <div key={idx} className="mb-3">
        <h4 className="font-semibold text-sm mb-1">{phaseData.phase}:</h4>
        <JsonList
          items={phaseData.actions}
          className="list-disc list-inside space-y-1 text-sm pl-4"
        />
      </div>
    ))}
  </div>
);

const RenderPlatformActions = ({ data }) => (
  <div>
    {data.map((platformAction, idx) => (
      <div key={idx} className="ml-4 mb-2">
        <strong className="font-medium text-sm">
          {platformAction.platform}:
        </strong>
        <JsonList
          items={platformAction.actions}
          className="list-disc list-inside space-y-1 text-sm pl-4"
        />
      </div>
    ))}
  </div>
);

const RenderCompetitorSnippets = ({ data }) => (
  <ul className="list-disc list-inside space-y-1 text-sm">
    {data.map((snippet, idx) => (
      <li key={idx}>
        <strong className="font-medium">{snippet.competitor}:</strong>{" "}
        <FormattedText text={snippet.summary} />
      </li>
    ))}
  </ul>
);

const RenderTopPlatforms = ({ data }) => (
  <ul className="list-disc list-inside space-y-1 text-sm">
    {data.map((platform, idx) => (
      <li key={idx}>
        <strong className="font-medium">{platform.platform}:</strong>{" "}
        <FormattedText text={platform.rationale} />
      </li>
    ))}
  </ul>
);

const RenderDriversConstraints = ({ data }) => (
  <ul className="list-disc list-inside space-y-1 text-sm">
    {data.map((item, idx) => (
      <li key={idx}>
        <strong className="font-medium">{item.factor}:</strong>{" "}
        <FormattedText text={item.explanation} />
      </li>
    ))}
  </ul>
);

// --- Main Recursive Renderer ---

export const RenderJsonSection = ({ data }) => {
  if (!data || typeof data !== "object" || data.error) {
    return (
      <p className="text-red-600 dark:text-red-400 text-sm">
        Error: {data?.error || "Invalid data format."}
      </p>
    );
  }

  return Object.entries(data).map(([key, value]) => {
    if (key === "title") return null; // Title is handled by the parent section

    // Render Table
    if (
      (key === "table" || key === "rows") &&
      typeof value === "object" &&
      value !== null &&
      Array.isArray(value.headers) &&
      Array.isArray(value.rows)
    ) {
      return <JsonTable key={key} data={value} />;
    }
    if (key === "rows" && Array.isArray(value) && data.headers) {
      // Handle table if headers/rows are top-level
      return (
        <JsonTable key={key} data={{ headers: data.headers, rows: value }} />
      );
    }

    // Render Lists (using specific renderers where applicable)
    if (Array.isArray(value)) {
      let listComponent = null;
      if (key === "phases")
        listComponent = <RenderRoadmapPhases key={key} data={value} />;
      else if (key === "roles")
        listComponent = <RenderCSuite key={key} data={value} />;
      else if (
        key === "competitorData" &&
        data.title === "Apollo Data Comparison (UK Focus)" // Check parent title for context
      )
        listComponent = <RenderApolloComparison key={key} data={value} />;
      else if (key === "competitorSnippets")
        listComponent = <RenderCompetitorSnippets key={key} data={value} />;
      else if (key === "topPlatforms")
        listComponent = <RenderTopPlatforms key={key} data={value} />;
      else if (key === "keyActions")
        listComponent = <RenderPlatformActions key={key} data={value} />;
      else if (key === "drivers" || key === "constraints")
        listComponent = <RenderDriversConstraints key={key} data={value} />;
      else if (
        [
          "points",
          "items",
          "strengths",
          "weaknesses",
          "opportunities",
          "threats",
          "actions",
          "keyThemes",
          "topSpeedIssues",
          "keyInvestors",
          "techShifts",
          "customerBehaviour",
          "confirmations",
          "discrepancies",
          "insights",
          "priorities",
          "outcomes",
          "challenges",
        ].includes(key)
      ) {
        listComponent = <JsonList key={key} items={value} />; // Default list
      }

      if (listComponent) {
        // Determine if a title should be rendered for this list type
        const shouldRenderTitle = ![
          "phases",
          "roles",
          "competitorData",
          "competitorSnippets",
          "topPlatforms",
          "keyActions",
          "drivers",
          "constraints",
        ].includes(key);

        return (
          <div key={key} className="mt-2 mb-3">
            {shouldRenderTitle && (
              <h4 className="font-semibold text-xs uppercase text-muted-foreground mb-1">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </h4>
            )}
            {listComponent}
          </div>
        );
      }
    }

    // Render Paragraph/String
    if (typeof value === "string") {
      if (
        [
          "summary",
          "description",
          "notes",
          "analysis",
          "cagrForecast",
          "vcFundingTrend",
          "mergerAcquisitionActivity",
          "valuationTrends",
          "topPlayersShare",
          "competitiveIntensity",
          "intentBreakdown",
          "overlap",
          "deviceBreakdown",
          "geoDistribution",
          "trafficVsCompetitors",
          "anchorText",
          "competitorGap",
          "backlinkComparison",
          "mobileFriendlyScore",
          "speedVsCompetitors",
          "contentVsCompetitors",
          "totalMissing",
          "snippetOpportunities",
          "gapVsCompetitors",
          "crawlabilityScore",
          "indexationRate",
          "schemaCoverage",
          "technicalComparison",
          "localVsCompetitors",
          "ecommerceVsCompetitors",
          "primaryStrategy",
          "estimatedInvestment",
          "expectedSomIncrease",
          "timeline",
          "overall",
        ].includes(key)
      ) {
        return (
          <p
            key={key}
            className={`text-sm mb-3 ${
              key === "notes"
                ? "italic text-muted-foreground"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            <FormattedText text={value} />
          </p>
        );
      } else {
        // Simple key-value display
        return (
          <p key={key} className="text-sm mb-1">
            <strong className="font-medium text-gray-600 dark:text-gray-400">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              :{" "}
            </strong>
            <FormattedText text={value} />
          </p>
        );
      }
    }

    // Render Nested Object Recursively
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const subTitle =
        value.title ||
        key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
      // Handle specific nested structures if they don't fit the list/table pattern
      if (key === "swotAnalysis") {
        return (
          <div key={key} className="mt-4">
            <h3 className="text-base font-semibold mb-2">{subTitle}</h3>
            <RenderSwot data={value} />
          </div>
        );
      }
      // Add other specific nested object renderers if needed

      // Default nested object rendering
      return (
        <div
          key={key}
          className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-base font-semibold mb-2">{subTitle}</h3>
          <RenderJsonSection data={value} /> {/* Recursive call */}
        </div>
      );
    }

    return null; // Ignore unknown types for now
  });
};

// Helper to render simple key-value pairs from an object, skipping complex ones
export const RenderSimpleKVP = ({
  data,
  skipKeys = [
    "title",
    "headers",
    "rows",
    "table",
    "description",
    "analysis",
    "topLandingPages",
    "topExitPages",
    "topReferringDomains",
    "topContent",
    "isApplicable", // Common SEO section applicability flag
    "applicable", // Common SEO section applicability flag (alternative naming)
    // "summary", // Allow summary to be rendered by KVP as a fallback
    "points", // Handled by JsonList
    "strengths", // Handled by JsonList or specific components
    "weaknesses", // Handled by JsonList or specific components
    "opportunities", // Handled by JsonList or specific components
    "threats", // Handled by JsonList or specific components
    "priorityRecommendations", // Handled by JsonList
    "topKeywords", // Handled by JsonTable
    "distributionSummaryUK", // Handled separately
    "intentBreakdownUK", // Handled separately
    "keywordOverlapUK", // Handled separately
    "metricsSummary", // Handled by JsonTable
    "topLandingPagesUK", // Handled by JsonTable
    "topExitPagesUK", // Handled by JsonTable
    "deviceBreakdownUK", // Handled separately
    "geographicDistributionUK", // Handled separately
    "topReferringDomainsUK", // Handled by JsonTable
    "anchorTextDistributionUK", // Handled by JsonList
    "topSpeedIssuesUK", // Handled by JsonList
    "topContentPiecesUK", // Handled by JsonTable
    "topOpportunities", // Handled by JsonTable
    "topIssues", // Handled by JsonList
  ],
}) => {
  if (!data || typeof data !== "object") return null;
  const entries = Object.entries(data).filter(
    ([key, value]) =>
      !skipKeys.includes(key) &&
      value !== null && // Ensure value is not null
      typeof value !== "object" && // Skip objects
      !Array.isArray(value) // Skip arrays
  );

  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm mt-3">
      {entries.map(([key, value]) => {
        // Improved key formatting
        const formattedKey = key
          .replace(/UK$/, "") // Remove UK suffix if present
          .replace(/([A-Z])/g, " $1") // Add space before caps
          .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
          .trim(); // Trim potential leading/trailing spaces
        return (
          <p key={key} className="break-words">
            <strong className="font-medium text-gray-600 dark:text-gray-400">
              {formattedKey}:{" "}
            </strong>
            <FormattedText text={String(value ?? "N/A")} />
          </p>
        );
      })}
    </div>
  );
};
