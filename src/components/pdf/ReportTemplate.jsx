import React from "react";
import { format } from "date-fns";
import { marked } from "marked"; // Import marked

// Configure marked (optional: add extensions like GFM tables if needed)
marked.setOptions({
  gfm: true, // Enable GitHub Flavored Markdown (includes tables)
  breaks: false, // Don't convert single line breaks to <br>
  pedantic: false,
  smartLists: true,
  smartypants: false,
});

// Helper to render sections safely using marked
const Section = ({ title, content }) => {
  if (!content || content.startsWith("Error:")) {
    return null; // Don't render section if no content or error
  }
  return (
    // Add page-break-inside avoid to try and keep sections together
    <div style={{ pageBreakInside: "avoid", marginBottom: "20px" }}>
      <h2 className="text-xl font-semibold mt-6 mb-3 pb-2 border-b border-gray-300">
        {title}
      </h2>
      {/* Use dangerouslySetInnerHTML with marked */}
      <div
        className="markdown-content" /* Add a class for specific styling */
        dangerouslySetInnerHTML={{ __html: marked.parse(content || "") }}
      />
    </div>
  );
};

// Main PDF Template Component
export default function ReportTemplate({ analysisResults, submittedData }) {
  const reportDate = format(new Date(), "PPP");
  const companyName =
    submittedData?.businessName || submittedData?.website || "N/A";
  const website = submittedData?.website || "N/A";

  // Destructure results safely
  const {
    seoAnalysis,
    competitorAnalysis,
    marketPotential,
    marketCap,
    recommendations,
    searchTrends,
    socialMedia,
    apolloData, // Assuming apolloData for the main company is here
  } = analysisResults || {};

  // Basic CSS Reset and Tailwind directives + Variables from globals.css
  // Enhanced CSS for PDF with Branding
  const embeddedCSS = `
    /* --- Profici Branding & Base Styles --- */
    :root {
      --profici-primary: #1a202c; /* Dark Gray/Blue */
      --profici-secondary: #4a5568; /* Medium Gray */
      --profici-accent: #3182ce; /* Blue */
      --profici-background: #ffffff;
      --profici-text: #2d3748; /* Darker text */
      --profici-border: #e2e8f0;
      --profici-muted: #718096;
      --profici-code-bg: #edf2f7;
    }

    @page {
      /* Landscape orientation is set in pdfGenerator.js */
      margin: 0.75in; /* Adjust margins for landscape */
    }

    html {
      font-size: 10pt; /* Base font size */
      -webkit-print-color-adjust: exact; /* Ensure background colors print */
      print-color-adjust: exact;
    }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: var(--profici-text);
      background-color: var(--profici-background);
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    /* --- Layout & Structure --- */
    .report-container {
      padding: 0; /* Padding handled by @page margin */
    }

    header.report-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid var(--profici-primary);
      page-break-after: avoid;
    }

    /* Optional: Placeholder for logo */
    /* .report-header img.logo { height: 40px; margin-bottom: 10px; } */

    header.report-header h1 {
      font-size: 24pt;
      color: var(--profici-primary);
      font-weight: 600;
      margin: 0 0 5px 0;
    }
    header.report-header p {
      font-size: 11pt;
      color: var(--profici-secondary);
      margin: 2px 0;
    }
    header.report-header strong {
      color: var(--profici-primary);
      font-weight: 600;
    }

    .branding-title {
      text-align: center;
      margin: 25px 0 35px 0;
      page-break-after: avoid;
    }
    .branding-title h1 {
      font-size: 20pt;
      font-weight: 600;
      color: var(--profici-primary);
    }

    main {
      /* Main content area */
    }

    footer.report-footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid var(--profici-border);
      text-align: center;
      font-size: 8pt;
      color: var(--profici-muted);
      page-break-before: auto; /* Allow break before footer if needed */
    }
    footer.report-footer p {
      margin: 3px 0;
    }

    /* --- Section Styling --- */
    .section-container {
      page-break-inside: avoid; /* Try to keep sections together */
      margin-bottom: 30px;
    }
    .section-container h2.section-title {
      font-size: 16pt;
      font-weight: 600;
      color: var(--profici-primary);
      margin: 0 0 15px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--profici-border);
      page-break-after: avoid; /* Keep title with content */
    }

    /* --- Markdown Content Styling (.markdown-content) --- */
    .markdown-content {
      /* General text */
    }
    .markdown-content p {
      margin-bottom: 1em;
    }
    .markdown-content strong {
      font-weight: 600;
      color: var(--profici-primary);
    }
    .markdown-content em {
      font-style: italic;
      color: var(--profici-secondary);
    }
    .markdown-content a {
      color: var(--profici-accent);
      text-decoration: none;
    }
    .markdown-content a:hover {
      text-decoration: underline;
    }

    /* Headings within Markdown */
    .markdown-content h1, /* Usually not used in sections, but just in case */
    .markdown-content h2,
    .markdown-content h3,
    .markdown-content h4,
    .markdown-content h5,
    .markdown-content h6 {
      color: var(--profici-primary);
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.8em;
      line-height: 1.3;
      page-break-after: avoid;
    }
    .markdown-content h1 { font-size: 18pt; } /* Adjust sizes as needed */
    .markdown-content h2 { font-size: 15pt; }
    .markdown-content h3 { font-size: 13pt; }
    .markdown-content h4 { font-size: 11pt; }
    .markdown-content h5 { font-size: 10pt; }
    .markdown-content h6 { font-size: 9pt; color: var(--profici-secondary); }

    /* Lists */
    .markdown-content ul,
    .markdown-content ol {
      margin-left: 25px;
      margin-bottom: 1em;
      padding-left: 0;
    }
    .markdown-content li {
      margin-bottom: 0.5em;
    }
    .markdown-content ul { list-style: disc; }
    .markdown-content ol { list-style: decimal; }
    .markdown-content li > p { margin-bottom: 0.3em; } /* Reduce paragraph margin inside lists */

    /* Tables */
    .markdown-content table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5em;
      font-size: 9pt;
      page-break-inside: avoid;
      border: 1px solid var(--profici-border);
    }
    .markdown-content th,
    .markdown-content td {
      border: 1px solid var(--profici-border);
      padding: 8px 10px;
      text-align: left;
    }
    .markdown-content th {
      background-color: var(--profici-primary);
      color: var(--profici-background);
      font-weight: 600;
      border-bottom: 2px solid var(--profici-primary);
    }
    .markdown-content tr:nth-child(even) td {
      background-color: #f7fafc; /* Light gray for zebra striping */
    }
    .markdown-content table caption {
      caption-side: bottom;
      font-size: 8pt;
      color: var(--profici-muted);
      margin-top: 5px;
    }

    /* Blockquotes */
    .markdown-content blockquote {
      margin: 1.5em 0;
      padding: 10px 20px;
      border-left: 4px solid var(--profici-accent);
      background-color: var(--profici-code-bg);
      color: var(--profici-secondary);
      page-break-inside: avoid;
    }
    .markdown-content blockquote p {
      margin-bottom: 0.5em;
    }
    .markdown-content blockquote p:last-child {
      margin-bottom: 0;
    }

    /* Code Blocks */
    .markdown-content pre {
      background-color: var(--profici-code-bg);
      border: 1px solid var(--profici-border);
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 1.5em;
      overflow-x: auto; /* Allow horizontal scroll for long lines */
      font-family: 'Courier New', Courier, monospace;
      font-size: 9pt;
      line-height: 1.5;
      page-break-inside: avoid;
      white-space: pre-wrap; /* Wrap long lines */
      word-wrap: break-word;
    }
    .markdown-content code {
      font-family: 'Courier New', Courier, monospace;
      background-color: var(--profici-code-bg);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 90%;
    }
    .markdown-content pre code {
      background-color: transparent; /* No background for code inside pre */
      padding: 0;
      border-radius: 0;
      font-size: inherit;
    }

    /* Horizontal Rules */
    .markdown-content hr {
      border: none;
      border-top: 1px solid var(--profici-border);
      margin: 2em 0;
    }

    /* Avoid breaking images */
    .markdown-content img {
      page-break-inside: avoid;
      max-width: 100%;
      height: auto;
    }
  `;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Profici AI Analysis Report - {companyName}</title>
        <style dangerouslySetInnerHTML={{ __html: embeddedCSS }} />
      </head>
      <body>
        {/* Use classes defined in CSS */}
        <div className="report-container">
          {/* Header */}
          <header className="report-header">
            {/* <img src="URL_TO_YOUR_LOGO" alt="Profici Logo" className="logo"/> */}
            <h1>Profici AI Analysis Report</h1>
            <p>
              For: <strong>{companyName}</strong> ({website})
            </p>
            <p>Generated on: {reportDate}</p>
          </header>

          {/* Branding Title */}
          <div className="branding-title">
            <h1>Competitive Analysis by Profici</h1>
          </div>

          <main>
            {/* Render sections - pass classes via props if needed, or rely on CSS */}
            <Section title="SEO Analysis" content={seoAnalysis} />
            <Section title="Competitor Analysis" content={competitorAnalysis} />
            <Section title="Search Trends" content={searchTrends} />
            {/* Add other sections similarly */}
            <Section title="Market Potential" content={marketPotential} />
            <Section title="Market Cap & Valuation" content={marketCap} />
            <Section title="Social Media Insights" content={socialMedia} />
            <Section
              title="Strategic Recommendations"
              content={recommendations}
            />
          </main>

          {/* Footer */}
          <footer className="report-footer">
            <p>
              Powered by Profici.co.uk | © {new Date().getFullYear()} Profici
              Ltd.
            </p>
            <p>
              This report provides AI-generated insights and estimations.
              Consult with Profici experts for detailed strategic guidance.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
