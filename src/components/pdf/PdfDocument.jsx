import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  // StyleSheet, // Removed - Imported from PdfStyles.js
  // Font, // Keep if font registration is needed later
  // Link, // Link is used in PdfRenderHelpers now
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { styles } from "./PdfStyles"; // Import styles
import { PdfSection } from "./PdfRenderHelpers"; // Import PdfSection helper
import PdfCompetitorAnalysis from "./PdfCompetitorAnalysis";

// The main PDF document component
const PdfDocument = ({ analysisResults, submittedData }) => {
  const reportDate = format(new Date(), "PPP");
  const companyName =
    submittedData?.businessName || submittedData?.website || "N/A";
  const website = submittedData?.website || "N/A";

  const {
    seoAnalysis,
    competitorAnalysis,
    marketPotential,
    marketCap,
    recommendations,
    searchTrends,
    socialMedia,
  } = analysisResults || {};

  // Extract Executive Summary from recommendations if available, otherwise use seoAnalysis version
  const executiveSummaryData = recommendations?.executiveSummary ||
    seoAnalysis?.executiveSummaryUK || {
      error: "Executive Summary data missing or invalid.",
    };

  // Helper to render page number
  const renderPageNumber = ({ pageNumber, totalPages }) =>
    `${pageNumber} / ${totalPages}`;

  return (
    <Document title={`Profici AI Analysis - ${companyName}`}>
      {/* Page 1: Title Page */}
      <Page size="A4" orientation="landscape" style={styles.landscapePage}>
        <View style={styles.header}>
          <Text style={styles.reportTitle}>Profici AI Analysis Report</Text>
          <Text style={styles.subHeader}>
            For: {companyName} ({website})
          </Text>
          <Text style={styles.dateText}>Generated on: {reportDate}</Text>
        </View>
        <View style={styles.brandingTitleContainer}>
          <Text style={styles.brandingTitle}>
            Competitive Analysis by Profici
          </Text>
        </View>
        <View style={{ flexGrow: 1 }} />
        <Text style={styles.footer}>
          Powered by Profici.co.uk | © {new Date().getFullYear()} Profici Ltd. |
          This report provides AI-generated insights. Consult experts for
          detailed guidance.
        </Text>
      </Page>

      {/* Content Pages */}
      <Page size="A4" orientation="landscape" style={styles.landscapePage}>
        {/* Fixed header for content pages */}
        <View style={styles.contentHeader} fixed>
          <Text style={styles.contentHeaderTitle}>Executive Summary & SEO</Text>
          <Text style={styles.contentHeaderSub}>
            {companyName} • {website} • {reportDate}
          </Text>
        </View>
        <View style={styles.slideContentArea}>
          <PdfSection title="Executive Summary" data={executiveSummaryData} />
          {/* Render SEO sections individually */}
          {seoAnalysis &&
            !seoAnalysis.error &&
            Object.entries(seoAnalysis).map(([key, value]) => {
              // Skip summary if it was already rendered from recommendations
              if (
                key === "executiveSummaryUK" &&
                recommendations?.executiveSummary
              )
                return null;
              // Skip non-applicable sections
              if (value?.applicable === false) return null;

              const sectionTitle = key
                .replace(/([A-Z])/g, " $1")
                .replace(/UK$/, "")
                .replace(/^./, (str) => str.toUpperCase())
                .trim();
              return <PdfSection key={key} title={sectionTitle} data={value} />;
            })}
          {seoAnalysis?.error && (
            <PdfSection title="SEO Analysis" data={seoAnalysis} />
          )}
        </View>
        <Text style={styles.pageNumber} render={renderPageNumber} fixed />
      </Page>
      <Page size="A4" orientation="landscape" style={styles.landscapePage}>
        <View style={styles.contentHeader} fixed>
          <Text style={styles.contentHeaderTitle}>Competitor Analysis</Text>
          <Text style={styles.contentHeaderSub}>
            {companyName} • {website} • {reportDate}
          </Text>
        </View>
        <View style={styles.slideContentArea}>
          <PdfCompetitorAnalysis data={competitorAnalysis} />
        </View>
        <Text style={styles.pageNumber} render={renderPageNumber} fixed />
      </Page>
      <Page size="A4" orientation="landscape" style={styles.landscapePage}>
        <View style={styles.contentHeader} fixed>
          <Text style={styles.contentHeaderTitle}>
            Search Trends & Market Potential
          </Text>
          <Text style={styles.contentHeaderSub}>
            {companyName} • {website} • {reportDate}
          </Text>
        </View>
        <View style={styles.slideContentArea}>
          <PdfSection title="Search Trends" data={searchTrends} />
          <PdfSection title="Market Potential" data={marketPotential} />
        </View>
        <Text style={styles.pageNumber} render={renderPageNumber} fixed />
      </Page>
      <Page size="A4" orientation="landscape" style={styles.landscapePage}>
        <View style={styles.contentHeader} fixed>
          <Text style={styles.contentHeaderTitle}>
            Valuation & Social Media
          </Text>
          <Text style={styles.contentHeaderSub}>
            {companyName} • {website} • {reportDate}
          </Text>
        </View>
        <View style={styles.slideContentArea}>
          <PdfSection title="Market Cap & Valuation" data={marketCap} />
          <PdfSection title="Social Media Insights" data={socialMedia} />
        </View>
        <Text style={styles.pageNumber} render={renderPageNumber} fixed />
      </Page>
      <Page size="A4" orientation="landscape" style={styles.landscapePage}>
        <View style={styles.contentHeader} fixed>
          <Text style={styles.contentHeaderTitle}>
            Strategic Recommendations
          </Text>
          <Text style={styles.contentHeaderSub}>
            {companyName} • {website} • {reportDate}
          </Text>
        </View>
        <View style={styles.slideContentArea}>
          {/* Render remaining recommendation sections */}
          {recommendations &&
            !recommendations.error &&
            Object.entries(recommendations).map(([key, value]) => {
              if (key === "executiveSummary" || key === "title") return null; // Skip summary again
              const sectionTitle =
                value?.title ||
                key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());
              return <PdfSection key={key} title={sectionTitle} data={value} />;
            })}
          {recommendations?.error && (
            <PdfSection
              title="Strategic Recommendations"
              data={recommendations}
            />
          )}
        </View>
        <Text style={styles.pageNumber} render={renderPageNumber} fixed />
      </Page>
    </Document>
  );
};

export default PdfDocument;
