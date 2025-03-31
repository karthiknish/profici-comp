// src/utils/parsing.js

/**
 * Attempts to parse a percentage string (e.g., "75%", "+10%", "Approx 80 %") into a number 0-100.
 * Returns null if parsing fails.
 */
export const parsePercentage = (value) => {
  if (typeof value !== "string") {
    // If it's already a number, assume it's 0-100 if valid, else null
    if (typeof value === "number" && value >= 0 && value <= 100) {
      return value;
    }
    return null;
  }
  try {
    // Remove common prefixes/suffixes and whitespace, then parse
    const cleanedValue = value.replace(/%|approx\.|\+/gi, "").trim();
    const num = parseFloat(cleanedValue);
    if (!isNaN(num) && num >= 0) {
      // Clamp value between 0 and 100
      return Math.min(Math.max(num, 0), 100);
    }
    return null;
  } catch {
    return null;
  }
};

// Helper to extract bullet points from a specific section identified by H2
export const extractListItems = (markdown, sectionTitle) => {
  if (!markdown) return null;
  // Escape title for regex
  const escapedTitle = sectionTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const sectionRegex = new RegExp(
    `##\\s*${escapedTitle}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`,
    "i"
  );
  const sectionMatch = markdown.match(sectionRegex);
  if (!sectionMatch || !sectionMatch[1]) return null;

  const itemRegex = /-\s*(.*)/g;
  const items = [];
  let match;
  // Process only the content under the H2, before any H3
  const contentBeforeSubheadings = sectionMatch[1].split(/\n###\s/)[0];
  while ((match = itemRegex.exec(contentBeforeSubheadings)) !== null) {
    items.push(match[1].trim());
  }
  return items.length > 0 ? items : null;
};

/**
 * Parses a Markdown table into an array of objects.
 * WARNING: Fragile, depends on consistent AI Markdown table format.
 * @param {string} markdown - The Markdown text containing the table.
 * @param {string} headerRowIdentifier - A unique string expected in the header row.
 * @returns {Array|null} Array of objects representing rows, or null if parsing fails.
 */
export const parseMarkdownTable = (markdown, headerRowIdentifier) => {
  if (!markdown || typeof markdown !== "string") return null;

  try {
    const lines = markdown.split("\n");
    // Find header row index case-insensitively
    const headerIndex = lines.findIndex((line) =>
      line.toLowerCase().includes(headerRowIdentifier.toLowerCase())
    );

    // Check if header and separator line exist
    if (
      headerIndex === -1 ||
      headerIndex + 1 >= lines.length ||
      !lines[headerIndex + 1].includes("---")
    ) {
      // console.log(`Table header/separator not found for: ${headerRowIdentifier}`);
      return null;
    }

    const headers = lines[headerIndex]
      .split("|")
      .map((h) => h.trim())
      .filter(Boolean); // Remove empty strings from start/end pipes

    // Ensure headers were found
    if (headers.length === 0) {
      // console.log(`No headers found for: ${headerRowIdentifier}`);
      return null;
    }

    // Find the end of the table (first empty line or end of markdown)
    let tableEndIndex = lines.findIndex(
      (line, index) => index > headerIndex + 1 && line.trim() === ""
    );
    if (tableEndIndex === -1) {
      tableEndIndex = lines.length;
    }

    const dataLines = lines.slice(headerIndex + 2, tableEndIndex);

    const data = dataLines
      .map((line) => {
        // Ensure the line looks like a table row (contains '|')
        if (!line.includes("|")) return null;

        const values = line
          .split("|")
          .map((v) => v.trim())
          .filter((v, i, arr) => i > 0 && i < arr.length - 1); // Remove empty strings from start/end pipes more reliably

        // Allow for slight mismatch if AI adds extra empty columns, but ensure minimum length
        if (values.length < headers.length) {
          // console.log(`Row length mismatch for: ${headerRowIdentifier}. Headers: ${headers.length}, Values: ${values.length}. Line: ${line}`);
          // Pad with empty strings if necessary, or return null based on strictness needed
          // For now, let's be lenient and pad:
          while (values.length < headers.length) {
            values.push("");
          }
          // return null; // Stricter approach
        }

        const row = {};
        headers.forEach((header, index) => {
          // Use original value if parsing fails
          row[header] = values[index] !== undefined ? values[index] : "";
        });
        return row;
      })
      .filter(Boolean); // Remove null entries from malformed rows

    // console.log(`Parsed table for ${headerRowIdentifier}:`, data);
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error(
      `Error parsing Markdown table with identifier "${headerRowIdentifier}":`,
      error
    );
    return null;
  }
};

// Helper to extract content under a specific H2 (##) or H3 (###) heading
export const extractSectionContent = (markdown, sectionTitle) => {
  if (!markdown || !sectionTitle) return null;
  // Regex to find content under a specific H2 or H3 heading until the next H2/H3 or end of string
  // Handles both ## Title and ### Title
  // Escape special regex characters in the section title
  const escapedTitle = sectionTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // Match ## or ### followed by optional whitespace, the title, optional whitespace, newline,
  // then capture everything until the next ##, ###, or end of string.
  // Use 'i' flag for case-insensitive title matching. Allow flexible whitespace and optional newline.
  const sectionRegex = new RegExp(
    `^[ \\t]*(?:##|###)[ \\t]*${escapedTitle}[ \\t]*\\n?([\\s\\S]*?)(?=\\n^[ \\t]*(?:##|###)|$)`, // Allow leading whitespace, optional newline
    "gim" // Added global flag 'g' just in case, keep 'i' and 'm'
  );
  const match = markdown.match(sectionRegex);
  // Return the captured content (group 1), ensuring it exists and is a string before trimming
  return match && typeof match[1] === "string" ? match[1].trim() : null;
};

// Helper to extract bullet points under a specific subheading (e.g., ### Title) within the entire markdown
export const extractSubheadingListItems = (markdown, subheading) => {
  if (!markdown || !subheading) return null;
  // Escape title for regex
  const escapedSubheading = subheading.replace(
    /[-\/\\^$*+?.()|[\]{}]/g,
    "\\$&"
  );
  // Regex to find the subheading (e.g., ### Title) and capture the list items following it
  // Looks for the subheading, then captures lines starting with '-' until the next heading (## or ###) or end of string
  const regex = new RegExp(
    `###\\s*${escapedSubheading}\\s*\\n([\\s\\S]*?)(?=\\n(?:##|###)|$)`,
    "i"
  );
  const sectionMatch = markdown.match(regex);

  if (!sectionMatch || !sectionMatch[1]) return null;

  const itemRegex = /-\s*(.*)/g;
  const items = [];
  let match;
  while ((match = itemRegex.exec(sectionMatch[1])) !== null) {
    items.push(match[1].trim());
  }
  return items.length > 0 ? items : null;
};
