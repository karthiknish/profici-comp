"use client";

import React from "react";
import { motion } from "framer-motion";
// Removed Progress, parsePercentage, KeyMetricHighlight, recharts, and specific icons imports
// as they are now handled by SeoVisualSummary
import {
  FileText,
  MapPin,
  ShoppingCart,
  TrendingUp,
  ListChecks,
  Link as LinkIcon,
  Star,
  Users,
  BarChart2,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Target,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Import the basic helpers we need (still needed for detailed report)
import {
  FormattedText,
  JsonList,
  JsonTable,
  RenderSimpleKVP,
} from "@/components/ui/JsonRenderHelpers";
// Re-import the section components
import {
  ExecutiveSummarySection,
  KeywordRankingsSection,
  OrganicTrafficSection,
  BacklinkProfileSection,
  PageSpeedMobileSection,
  ContentAnalysisSection,
  KeywordGapAnalysisSection,
  TechnicalSeoSection,
  LocalSeoSection,
  EcommerceSeoSection,
} from "./seoSections"; // Use the index file
// Import the new visual summary component
import SeoVisualSummary from "./SeoVisualSummary";


// Removed COLORS constant
// Removed PercentageMetric component

// --- Main Component ---
const SeoAnalysisSection = ({ seoAnalysis, seoVisualData, seoChartData }) => {
  // --- Log received props ---
  console.log("SeoAnalysisSection Props Received:");
  console.log("seoAnalysis:", seoAnalysis);
  console.log("seoVisualData:", seoVisualData);
  console.log("seoChartData:", seoChartData);
  // --- End Log ---

  // Extract data needed for boolean checks (can be simplified if only used for checks)
  const healthScore = seoVisualData?.healthScore;
  const keywordDistribution = seoVisualData?.keywordDistribution || [];
  const keywordData = seoChartData?.keywordRankings || [];
  const pageSpeedDesktop = seoVisualData?.pageSpeedDesktop;
  const pageSpeedMobile = seoVisualData?.pageSpeedMobile;

  // Recalculate flags based on potentially available data
  const hasVisualData =
    healthScore != null ||
    seoVisualData?.toxicBacklinks != null ||
    seoVisualData?.indexationRate != null ||
    seoVisualData?.schemaCoverage != null ||
    seoVisualData?.mobileFriendly != null ||
    pageSpeedDesktop != null ||
    pageSpeedMobile != null ||
    (keywordDistribution &&
      keywordDistribution.length > 0 &&
      keywordDistribution.some((d) => d.value > 0));

  const hasDetailedReportData =
    seoAnalysis && !seoAnalysis.error && typeof seoAnalysis === "object";

  const hasChartData =
    (keywordData && keywordData.length > 0) ||
    (keywordDistribution &&
      keywordDistribution.length > 0 &&
      keywordDistribution.some((d) => d.value > 0)) ||
    pageSpeedDesktop != null ||
    pageSpeedMobile != null;

  console.log("Calculated Flags:");
  console.log("hasDetailedReportData:", hasDetailedReportData);
  console.log("hasVisualData:", hasVisualData);
  console.log("hasChartData:", hasChartData);

  let defaultTab = "report";
  if (!hasDetailedReportData) {
    if (hasVisualData || hasChartData) {
      defaultTab = "visual-summary";
    }
  }
  console.log("Default Tab:", defaultTab);

  return (
    <Card className="w-full border-none shadow-none">
      <CardContent className="p-0">
        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="report" disabled={!hasDetailedReportData}>
              Detailed Report
            </TabsTrigger>
            {/* Tab is always enabled now */}
            <TabsTrigger value="visual-summary">
              Visual Summary & Charts
            </TabsTrigger>
          </TabsList>

          {/* Detailed Report Tab */}
          <TabsContent value="report" className="mt-0">
            {hasDetailedReportData && !seoAnalysis.error ? (
              <div className="space-y-6">
                {" "}
                {/* Use a simple div container */}
                {/* Render Executive Summary first, full width */}
                <ExecutiveSummarySection
                  sectionData={seoAnalysis.executiveSummaryUK}
                  customIndex={0}
                />
                {/* Render the rest in a grid */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <KeywordRankingsSection
                    sectionData={seoAnalysis.keywordRankingsUK}
                    customIndex={1} // Adjust customIndex if needed for animation
                  />
                  <OrganicTrafficSection
                    sectionData={seoAnalysis.organicTrafficUK}
                    customIndex={3} // Adjust customIndex
                  />
                  <BacklinkProfileSection
                    sectionData={seoAnalysis.backlinkProfileUK}
                    customIndex={4} // Adjust customIndex
                  />
                  <PageSpeedMobileSection
                    sectionData={seoAnalysis.pageSpeedMobileUK}
                    customIndex={5} // Adjust customIndex
                  />
                  <ContentAnalysisSection
                    sectionData={seoAnalysis.contentAnalysisUK}
                    customIndex={6} // Adjust customIndex
                  />
                  <KeywordGapAnalysisSection
                    sectionData={seoAnalysis.keywordGapAnalysisUK}
                    customIndex={7} // Adjust customIndex
                  />
                  <TechnicalSeoSection
                    sectionData={seoAnalysis.technicalSeoUK}
                    customIndex={8} // Adjust customIndex
                  />
                  {seoAnalysis.localSeoUK?.applicable && (
                    <LocalSeoSection
                      sectionData={seoAnalysis.localSeoUK}
                      customIndex={9} // Adjust customIndex
                    />
                  )}
                  {seoAnalysis.ecommerceSeoUK?.applicable && (
                    <EcommerceSeoSection
                      sectionData={seoAnalysis.ecommerceSeoUK}
                      customIndex={10} // Adjust customIndex
                    />
                  )}
                </motion.div>
              </div> // Close the simple div container
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                No detailed analysis data available or an error occurred.
              </p>
            )}
          </TabsContent>

          {/* Visual Summary & Charts Tab - Use the new component */}
          <TabsContent value="visual-summary">
            <SeoVisualSummary
              seoVisualData={seoVisualData}
              seoChartData={seoChartData}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SeoAnalysisSection;
