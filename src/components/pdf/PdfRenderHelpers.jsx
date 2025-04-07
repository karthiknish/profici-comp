import React from "react";
import { Text, View, Link } from "@react-pdf/renderer";
import { styles } from "./PdfStyles"; // Import styles from the new file

// --- Helper Components for Rendering JSON ---

// Helper to format keys into readable titles
const formatKey = (key) => {
  if (typeof key !== "string") return "Invalid Key";
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capitals
    .replace(/UK$/, "") // Remove trailing UK
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

// Enhanced FormattedText to handle numbers, potential leftover Markdown, basic links/bold, and null/undefined
// Returns null if the final text is empty or effectively "N/A"
export const FormattedText = ({ text, style = styles.paragraph }) => {
  let safeText;
  // Check if it's a number and handle potential large/infinite/NaN numbers
  if (typeof text === "number") {
    if (!Number.isFinite(text)) {
      safeText = "N/A"; // Treat non-finite numbers as N/A
    } else {
      safeText = String(text);
    }
  } else {
    safeText = String(text ?? ""); // Ensure text is a string, default to empty string if null/undefined
  }

  // Return null if text is effectively empty or "N/A"
  if (safeText.trim() === "" || safeText.toLowerCase() === "n/a") {
    return null; // Don't render anything for N/A or empty
  }

  // Remove potential heading markers if they slipped through
  const cleanText = safeText.replace(/^(#+\s*)/, "");

  // Basic bold handling: split by **, render parts with/without bold style
  // Also handle links like [text](url) - basic version
  const elements = [];
  let lastIndex = 0;

  // Regex to find **bold** or [link](url)
  const regex = /(\*\*(.*?)\*\*)|(\[(.*?)\]\((.*?)\))/g;
  let match;

  try {
    while ((match = regex.exec(cleanText)) !== null) {
      // Add text before the match - ensure it's not just whitespace
      const precedingText = cleanText.substring(lastIndex, match.index);
      if (precedingText) {
        elements.push(precedingText);
      }

      if (match[1]) {
        // Bold text: **text**
        elements.push(
          <Text key={lastIndex + "-bold"} style={styles.bold}>
            {match[2]}
          </Text>
        );
      } else if (match[3]) {
        // Link: [text](url)
        // Basic validation for URL (starts with http or https)
        const url = match[5];
        if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
          elements.push(
            <Link key={lastIndex + "-link"} src={url} style={styles.link}>
              {match[4]}
            </Link>
          );
        } else {
          // If not a valid URL, render as plain text including brackets/parentheses
          elements.push(match[0]); // Push the whole matched string
        }
      }
      lastIndex = regex.lastIndex;
    }
  } catch (e) {
    console.error("Regex error in FormattedText:", e);
    // Fallback to rendering the cleaned text as is if regex fails
    elements.push(cleanText);
    lastIndex = cleanText.length; // Ensure no remaining text is added
  }

  // Add any remaining text after the last match - ensure it's not just whitespace
  const remainingText = cleanText.substring(lastIndex);
  if (remainingText) {
    elements.push(remainingText);
  }

  // Handle cases where elements might be empty after processing (should be rare now)
  if (elements.length === 0) {
    return null; // Don't render if nothing resulted
  }

  // Wrap the processed elements in a single Text component
  return <Text style={style}>{elements}</Text>;
};

export const JsonParagraph = ({ text }) => {
  // Use FormattedText which now returns null for empty/NA
  const formatted = FormattedText({ text, style: styles.paragraph });
  return formatted; // Render the result (which might be null)
};

// Enhanced JsonList to handle specific object structures and apply styles
export const JsonList = ({ items, listStyle = styles.list, bullet = "•" }) => {
  // Added bullet prop
  if (!Array.isArray(items) || items.length === 0) return null;

  const renderedItems = items
    .map((item, index) => {
      let textContent;
      let itemStyle = styles.listItemText; // Default style
      let currentBullet = bullet; // Use default bullet unless overridden

      if (typeof item === "string") {
        textContent = item;
      } else if (typeof item === "object" && item !== null) {
        // Specific formatting for recommendation objects
        if (item.action && item.impactPercent) {
          const impact = Number.isFinite(Number(item.impactPercent))
            ? `${item.impactPercent}%`
            : "N/A";
          // Render recommendation only if action exists
          return item.action ? (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.listItemBullet}>🎯</Text>{" "}
              {/* Recommendation Icon */}
              <FormattedText
                style={styles.recommendationText}
                text={item.action}
              />
              {impact !== "N/A" && (
                <Text style={styles.recommendationImpact}>
                  (Impact: {impact})
                </Text>
              )}
            </View>
          ) : null;
        }
        // Handle items passed with specific styles and potentially icons
        if (item.text && item.style) {
          textContent = item.text;
          itemStyle = [styles.listItemText, item.style]; // Combine default and specific style
          currentBullet = item.bullet || bullet; // Use item's bullet if provided
        } else {
          // Generic object formatting: Convert simple objects to key: value strings
          textContent = Object.entries(item)
            .map(([k, v]) => `${formatKey(k)}: ${v}`)
            .join(", ");
        }
      } else {
        textContent = String(item ?? ""); // Handle null/undefined list items, default to empty string
      }

      // Use FormattedText to render the list item text, it will return null if empty/NA
      const renderedText = FormattedText({
        text: textContent,
        style: itemStyle,
      });

      return renderedText ? (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemBullet}>{currentBullet}</Text>
          {/* Render the result of FormattedText */}
          {renderedText}
        </View>
      ) : null; // Skip rendering this list item if FormattedText returned null
    })
    .filter(Boolean); // Filter out null items

  // Only render the list View if there are valid items to display
  return renderedItems.length > 0 ? (
    <View style={listStyle}>{renderedItems}</View> // Use listStyle prop
  ) : null;
};

export const PdfTable = ({ headers, rows }) => {
  if (
    !Array.isArray(headers) ||
    !Array.isArray(rows) ||
    headers.length === 0 ||
    rows.length === 0
  )
    return null;

  const numColumns = headers.length;

  // Calculate widths - attempt more even distribution
  const columnWidths = headers.map(() => `${100 / numColumns}%`);

  // Filter out rows where all cell data resolves to null via FormattedText
  const validRows = rows.filter((row) => {
    return headers.some((headerKey, colIndex) => {
      let cellData = "N/A";
      if (Array.isArray(row)) {
        cellData = row[colIndex];
      } else if (typeof row === "object" && row !== null) {
        // Try original header key first, then formatted key
        cellData = row[headerKey] ?? row[formatKey(headerKey)] ?? "N/A";
      }
      const renderedCell = FormattedText({
        text: cellData,
        style: styles.tableCell,
      });
      return renderedCell !== null; // Keep row if at least one cell has content
    });
  });

  if (validRows.length === 0) return null; // Don't render table if no valid rows

  return (
    <View style={styles.table}>
      {/* Header Row */}
      <View style={[styles.tableRow, styles.tableHeaderRow]} fixed>
        {headers.map((header, index) => (
          <View
            key={index}
            style={[styles.tableColHeader, { width: columnWidths[index] }]}
          >
            {/* Use Text directly for header */}
            <Text style={styles.tableCellHeader}>{String(header ?? "")}</Text>
          </View>
        ))}
      </View>
      {/* Data Rows */}
      {validRows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.tableRow,
            rowIndex % 2 !== 0 ? styles.tableEvenRow : {},
          ]}
        >
          {headers.map((headerKey, colIndex) => {
            let cellData = "N/A"; // Default value
            if (Array.isArray(row)) {
              cellData = row[colIndex]; // Access by index if row is an array
            } else if (typeof row === "object" && row !== null) {
              // Assume order of values matches order of headers
              const values = Object.values(row);
              cellData = values[colIndex] ?? "N/A";
            }

            // Use FormattedText for cell content - it will return null for N/A/empty
            return (
              <View
                key={colIndex}
                style={[
                  colIndex === 0 ? styles.tableColFirst : styles.tableCol, // Apply special style for first column
                  { width: columnWidths[colIndex] },
                ]}
              >
                {FormattedText({ text: cellData, style: styles.tableCell }) ?? (
                  <Text style={styles.tableCell}> </Text>
                )}{" "}
                {/* Render space if null */}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

// Map section titles to potential icons
const sectionIcons = {
  "Executive Summary": "📝",
  "SEO Analysis": "⚙️",
  "Keyword Rankings": "🔑",
  "Organic Traffic": "📈",
  "Backlink Profile": "🔗",
  "Page Speed & Mobile": "📱",
  "Content Analysis": "📄",
  "Keyword Gap Analysis": "🔍",
  "Technical SEO": "🛠️",
  "Local SEO": "📍",
  "E-commerce SEO": "🛒",
  "Competitor Analysis": "👥",
  "Search Trends": "📊",
  "Market Potential": "💡",
  "Market Cap & Valuation": "💰",
  "Social Media Insights": "💬",
  "Strategic Recommendations": "🎯",
  // Add more mappings as needed
};

// Enhanced Section Renderer
export const PdfSection = ({ title, data }) => {
  if (!data)
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {sectionIcons[title] || ""} {title}
        </Text>
        <Text style={styles.errorText}>No data provided.</Text>
      </View>
    );
  if (data.error) {
    return (
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>
          {sectionIcons[title] || ""} {title}
        </Text>
        <Text style={styles.errorText}>Error: {data.error}</Text>
      </View>
    );
  }

  // Recursive function to render various JSON structures
  const renderJsonContent = (content, level = 0, parentKey = "") => {
    // Base case: Render simple values (string, number, boolean)
    if (typeof content !== "object" || content === null) {
      if (parentKey === "title" || parentKey === "description") return null;
      // Use FormattedText which returns null for empty/NA
      return FormattedText({ text: content, style: styles.paragraph });
    }

    // Handle Arrays
    if (Array.isArray(content)) {
      if (content.length === 0) return null;
      // Specific array rendering logic
      if (parentKey === "priorityRecommendationsUK")
        return <JsonList items={content} bullet="🎯" />; // Use specific bullet
      if (parentKey === "topStrengthsUK")
        return (
          <JsonList
            items={content.map((item) => ({
              text: item,
              style: styles.strengthItem,
            }))}
            bullet="✅"
          />
        );
      if (parentKey === "topWeaknessesUK")
        return (
          <JsonList
            items={content.map((item) => ({
              text: item,
              style: styles.weaknessItem,
            }))}
            bullet="❌"
          />
        );

      // Render arrays of objects as tables if structure is consistent
      if (
        typeof content[0] === "object" &&
        content[0] !== null &&
        !Array.isArray(content[0])
      ) {
        const headers = Object.keys(content[0]);
        if (
          headers.length > 0 &&
          content.every(
            (item) =>
              typeof item === "object" &&
              item !== null &&
              JSON.stringify(Object.keys(item)) === JSON.stringify(headers)
          )
        ) {
          const formattedHeaders = headers.map(formatKey);
          // Filter rows within PdfTable now
          return <PdfTable headers={formattedHeaders} rows={content} />;
        }
      }
      // Default: Render array as a simple list
      return <JsonList items={content} />;
    }

    // Handle Objects
    if (typeof content === "object" && content !== null) {
      // Handle explicit table structure { headers: [], rows: [] }
      if (Array.isArray(content.headers) && Array.isArray(content.rows)) {
        // Filter rows within PdfTable now
        return <PdfTable headers={content.headers} rows={content.rows} />;
      }

      // Render key-value pairs and nested objects
      const entries = Object.entries(content)
        .map(([key, value]) => {
          // Skip structural/handled keys
          if (
            key === "title" ||
            key === "headers" ||
            key === "rows" ||
            key === "applicable" ||
            key === "relevanceFocus" ||
            key === "focus" ||
            key === "coreWebVitalsContext" ||
            key === "description" ||
            key === "priorityRecommendationsUK" ||
            key === "topStrengthsUK" ||
            key === "topWeaknessesUK"
          )
            return null;

          const subTitle = formatKey(key);
          const headingStyle = level === 0 ? styles.h3 : styles.h4;

          // Render 'notes' specifically
          if (key === "notes" && typeof value === "string") {
            const renderedNote = FormattedText({
              text: value,
              style: styles.notesText,
            });
            return renderedNote ? <View key={key}>{renderedNote}</View> : null; // Wrap in View if not null
          }

          // Render nested content (object or array) recursively
          if (typeof value === "object" && value !== null) {
            // Don't render empty objects/arrays within nested structures
            if (Array.isArray(value) && value.length === 0) return null;
            if (!Array.isArray(value) && Object.keys(value).length === 0)
              return null;

            // Render nested content only if it's not empty
            const nestedContent = renderJsonContent(value, level + 1, key);
            // IMPORTANT: Removed wrap={false} from this nested View to allow breaking
            return nestedContent ? (
              <View
                key={key}
                style={{
                  marginTop: 8,
                  marginBottom: 4,
                  paddingLeft: level * 10,
                }}
              >
                <FormattedText style={headingStyle} text={subTitle} />
                {nestedContent}
              </View>
            ) : null;
          }

          // Render simple key-value pairs (string, number, boolean)
          // Use FormattedText to handle value rendering (returns null if empty/NA)
          const renderedValue = FormattedText({
            text: value,
            style: styles.valueText, // Apply valueText style
          });
          return renderedValue ? (
            // Use keyValueContainer for better layout control
            <View key={key} style={styles.keyValueContainer}>
              <Text style={styles.keyText}>{subTitle}: </Text>
              {renderedValue}
            </View>
          ) : null; // Skip rendering if value is empty/NA
        })
        .filter(Boolean); // Filter out null entries

      // Return null if the object resulted in no renderable entries
      return entries.length > 0 ? entries : null;
    }

    // Fallback for unexpected types
    return <Text style={styles.paragraph}>Unsupported content format.</Text>;
  };

  const renderedContent = renderJsonContent(
    data,
    0,
    title.toLowerCase().replace(/\s+/g, "")
  );

  // Only render the section if there's actual content besides the title/description
  const hasRenderableContent = React.Children.count(renderedContent) > 0;

  return (
    // Use wrap={false} at the section level to try and keep sections together,
    // but allow internal components like Text and View to wrap by default.
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>
        {sectionIcons[title] || ""} {title}
      </Text>
      {/* Render description if it exists and is not empty */}
      {data?.description &&
        typeof data.description === "string" &&
        data.description.trim() !== "" && (
          <FormattedText style={styles.paragraph} text={data.description} />
        )}
      {/* Render content only if it's not null */}
      {hasRenderableContent ? (
        renderedContent
      ) : (
        <Text style={styles.muted}>
          No specific data available for this section.
        </Text>
      )}
    </View>
  );
};
