/**
 * Converts an array of objects into a CSV string.
 * Handles nested objects/arrays by JSON stringifying them.
 * @param {Array<Object>} data Array of objects to convert.
 * @param {Array<string>} [headers] Optional specific headers to include and order. If not provided, uses all keys from the first object.
 * @returns {string} The CSV formatted string.
 */
function convertToCsv(data, headers) {
  if (!data || data.length === 0) {
    return "";
  }

  const columnHeaders = headers || Object.keys(data[0]);

  // Escape commas and quotes within a cell
  const escapeCell = (cell) => {
    let cellString = cell === null || cell === undefined ? "" : String(cell);
    // If the cell contains a comma, double quote, or newline, enclose it in double quotes
    if (
      cellString.includes(",") ||
      cellString.includes('"') ||
      cellString.includes("\n")
    ) {
      // Escape existing double quotes by doubling them
      cellString = cellString.replace(/"/g, '""');
      return `"${cellString}"`;
    }
    return cellString;
  };

  // Create header row
  const headerRow = columnHeaders.map(escapeCell).join(",");

  // Create data rows
  const dataRows = data.map((row) => {
    return columnHeaders
      .map((header) => {
        const cellData = row[header];
        // Handle potential objects/arrays by stringifying them
        if (typeof cellData === "object" && cellData !== null) {
          try {
            return escapeCell(JSON.stringify(cellData));
          } catch (e) {
            console.error("Error stringifying object for CSV:", e);
            return escapeCell("[Object]"); // Fallback
          }
        }
        return escapeCell(cellData);
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Triggers a browser download for the given CSV content.
 * @param {string} csvContent The CSV string content.
 * @param {string} filename The desired filename for the download (e.g., "data.csv").
 */
export function downloadCsv(csvContent, filename = "export.csv") {
  if (!csvContent) return;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    // Feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  } else {
    // Fallback for older browsers (less common now)
    console.warn("Browser does not support automatic download attribute.");
    // You might inform the user to manually copy/paste or use a different browser.
  }
}

/**
 * Convenience function to convert data and trigger download.
 * @param {Array<Object>} data Array of objects.
 * @param {string} filename Desired filename.
 * @param {Array<string>} [headers] Optional specific headers.
 */
export function exportDataToCsv(data, filename, headers) {
  const csv = convertToCsv(data, headers);
  downloadCsv(csv, filename);
}

/**
 * Converts multiple datasets into a single CSV string, separated by titles.
 * @param {Array<{title: string, data: Array<Object>, headers?: Array<string>}>} datasets Array of dataset objects.
 * @returns {string} The combined CSV formatted string.
 */
function convertMultipleToCsv(datasets) {
  let combinedCsv = "";

  datasets.forEach((dataset, index) => {
    if (dataset.data && dataset.data.length > 0) {
      if (combinedCsv.length > 0) {
        combinedCsv += "\n\n"; // Add blank lines between datasets
      }
      // Add a title row for the dataset
      combinedCsv += `"${dataset.title}"\n`; // Enclose title in quotes in case it has commas
      combinedCsv += convertToCsv(dataset.data, dataset.headers);
    }
  });

  return combinedCsv;
}

/**
 * Convenience function to convert multiple datasets and trigger download.
 * @param {Array<{title: string, data: Array<Object>, headers?: Array<string>}>} datasets Array of dataset objects.
 * @param {string} filename Desired filename.
 */
export function exportMultipleDataToCsv(datasets, filename) {
  const csv = convertMultipleToCsv(datasets);
  downloadCsv(csv, filename);
}
