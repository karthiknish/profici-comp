"use client";

import React from "react";
// Remove ReactMarkdown imports
// import ReactMarkdown from "react-markdown";
// import rehypeRaw from "rehype-raw";
// import remarkGfm from "remark-gfm";
// Remove SyntaxHighlighter imports if handled by MarkdownRenderer
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { parseMarkdownTable, parsePercentage } from "@/utils/parsing";
import KeyMetricHighlight from "./KeyMetricHighlight";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area, // Import Area for chart fill
} from "recharts";
import {
  Search,
  TrendingUp,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Percent,
  Link as LinkIcon,
  FileWarning,
  FileText,
  MapPin,
  ShoppingCart,
  Gauge,
  ShieldAlert,
  DatabaseZap,
  Code,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"; // Import new component

// Remove mock data constants
// const keywordRankingData = [ ... ];
// const organicTrafficData = [ ... ];
// const backlinksData = [ ... ];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF80F2"]; // Keep COLORS for charts using real data

// Component to display a metric with a progress bar (Consider moving to ui if not already done)
const PercentageMetric = ({ label, value, icon: Icon }) => {
  const percentage = parsePercentage(value);
  if (percentage === null) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center text-muted-foreground">
          {Icon && <Icon className="mr-2 h-4 w-4" />} {label}
        </span>
        <span className="font-medium">{value || "N/A"}</span>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="flex items-center text-muted-foreground">
          {Icon && <Icon className="mr-2 h-4 w-4" />} {label}
        </span>
        <span className="font-medium">{percentage.toFixed(0)}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

const SeoAnalysisSection = ({ seoAnalysis }) => {
  // --- Data Parsing ---
  const keywordDistData = parseMarkdownTable(seoAnalysis, "Position Range");
  const backlinkSummaryData = parseMarkdownTable(
    seoAnalysis,
    "Toxic Backlinks (%)"
  );
  const techSeoSummaryData = parseMarkdownTable(
    seoAnalysis,
    "Schema Markup Coverage (Est.)"
  );
  const contentSummaryData = parseMarkdownTable(
    seoAnalysis,
    "Content Freshness"
  );
  const localSeoSummaryData = parseMarkdownTable(
    seoAnalysis,
    "Citation Consistency"
  );
  const eCommerceSummaryData = parseMarkdownTable(
    seoAnalysis,
    "Product Schema"
  );

  const healthScoreMatch = seoAnalysis?.match(
    /SEO health score(?: \(UK\))?: (\d+)/i
  ); // Make UK optional and case-insensitive
  const healthScore = healthScoreMatch
    ? parsePercentage(healthScoreMatch[1])
    : null;
  const toxicBacklinks = backlinkSummaryData?.[0]?.["Toxic Backlinks (%)"];
  const indexationRate = techSeoSummaryData?.[0]?.["Indexation Rate (Est.)"];
  const schemaCoverage =
    techSeoSummaryData?.[0]?.["Schema Markup Coverage (Est.)"];

  // --- Chart Data Extraction ---
  const extractKeywordData = (markdownContent) => {
    const parsed = parseMarkdownTable(markdownContent, "Keyword Rankings"); // Use correct table title
    if (parsed) {
      return parsed.map((row) => ({
        // Adjust keys based on actual table headers from prompt
        keyword: row["Keyword (UK Focus)"] || row.Keyword,
        ranking: parseInt(row["Ranking (UK)"] || row.Ranking) || 0,
        volume: parseInt(row["Search Volume (UK)"] || row.Volume) || 0,
        difficulty: parseInt(row["Difficulty (UK)"] || row.Difficulty) || 0,
      }));
    }
    // Return empty array if parsing fails
    return [];
  };
  const extractBacklinkData = (markdownContent) => {
    // Try parsing from markdown if needed
    // const parsed = parseMarkdownTable(markdownContent, "Backlink Distribution");
    // if (parsed) { ... }
    // Return empty array
    return [];
  };
  const extractPageSpeedData = (markdownContent) => {
    const parsed = parseMarkdownTable(
      markdownContent,
      "Page Speed & Mobile Summary"
    ); // Use correct table title
    if (parsed && parsed.length > 0) {
      const findValue = (metric) => parsed.find((row) => row.Metric === metric);
      const lcpRow = findValue("LCP");
      const inpRow = findValue("FID/INP"); // Or FID depending on what Gemini returns
      const clsRow = findValue("CLS");
      const scoreRow = findValue("PageSpeed Score");
      return {
        desktop: scoreRow ? parsePercentage(scoreRow["Desktop Value"]) : null,
        mobile: scoreRow ? parsePercentage(scoreRow["Mobile Value"]) : null,
        // Could add LCP, INP, CLS values here too if needed for display
      };
    }
    return null;
  };
  const extractTrafficData = (markdownContent) => {
    // Try parsing from markdown if needed
    // const parsed = parseMarkdownTable(markdownContent, "Organic Traffic Trend");
    // if (parsed) { ... }
    // Return empty array
    return [];
  };
  const extractKeywordDistribution = (markdownContent) => {
    const parsed = parseMarkdownTable(
      markdownContent,
      "Keyword Distribution Summary"
    ); // Use correct table title
    if (parsed) {
      return parsed.map((row) => ({
        name: row["Position Range"],
        value: parsePercentage(row.Percentage) ?? 0,
      }));
    }
    return null;
  };

  const keywordData = extractKeywordData(seoAnalysis);
  const backlinkData = extractBacklinkData(seoAnalysis); // Will be empty now
  const pageSpeedData = extractPageSpeedData(seoAnalysis);
  const trafficData = extractTrafficData(seoAnalysis); // Will be empty now
  const keywordDistribution = extractKeywordDistribution(seoAnalysis);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SEO Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={seoAnalysis ? "report" : "visualization"}>
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="report">Detailed Report</TabsTrigger>
            <TabsTrigger value="visual-summary">Visual Summary</TabsTrigger>
            <TabsTrigger value="visualization">Charts</TabsTrigger>
          </TabsList>

          {/* Detailed Report Tab */}
          <TabsContent value="report" className="space-y-4">
            {/* Use MarkdownRenderer for the detailed report */}
            <div className="markdown-content">
              <MarkdownRenderer
                content={seoAnalysis || "No detailed analysis data available."}
              />
            </div>
          </TabsContent>

          {/* Visual Summary Tab */}
          <TabsContent value="visual-summary">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <KeyMetricHighlight
                label="SEO Health Score"
                value={healthScore}
                icon={Gauge}
                className="sm:col-span-1 lg:col-span-1"
              />
              <KeyMetricHighlight
                label="Toxic Backlinks"
                value={toxicBacklinks}
                unit="%"
                icon={ShieldAlert}
                className="sm:col-span-1 lg:col-span-1"
              />
              <KeyMetricHighlight
                label="Indexation Rate"
                value={indexationRate}
                unit="%"
                icon={DatabaseZap}
                className="sm:col-span-1 lg:col-span-1"
              />
              <KeyMetricHighlight
                label="Schema Coverage"
                value={schemaCoverage}
                unit="%"
                icon={Code}
                className="sm:col-span-1 lg:col-span-1"
              />
              {/* Check if pageSpeedData exists before accessing its properties */}
              {pageSpeedData && pageSpeedData.mobile !== null && (
                <KeyMetricHighlight
                  label="Mobile PageSpeed"
                  value={pageSpeedData.mobile}
                  unit="/100"
                  icon={Gauge}
                  className="sm:col-span-1 lg:col-span-1"
                />
              )}
              {/* Check if pageSpeedData exists before accessing its properties */}
              {pageSpeedData && pageSpeedData.desktop !== null && (
                <KeyMetricHighlight
                  label="Desktop PageSpeed"
                  value={pageSpeedData.desktop}
                  unit="/100"
                  icon={Gauge}
                  className="sm:col-span-1 lg:col-span-1"
                />
              )}

              {keywordDistribution && keywordDistribution.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="space-y-2 rounded-lg border bg-card text-card-foreground shadow-sm p-4 col-span-1 sm:col-span-2 lg:col-span-3"
                >
                  {/* Enhanced Heading Style */}
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <PieChartIcon className="mr-2 h-4 w-4 text-primary" />
                    Keyword Distribution
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {keywordDistribution.map((item) => (
                      <PercentageMetric
                        key={item.name}
                        label={item.name}
                        value={item.value}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              {contentSummaryData && contentSummaryData.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="space-y-2 rounded-lg border bg-card text-card-foreground shadow-sm p-4"
                >
                  {/* Enhanced Heading Style */}
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    Content Summary
                  </h3>
                  <PercentageMetric
                    label="Content Freshness (<6mo)"
                    value={contentSummaryData[0]["Content Freshness"]}
                  />
                </motion.div>
              )}
              {localSeoSummaryData && localSeoSummaryData.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="space-y-2 rounded-lg border bg-card text-card-foreground shadow-sm p-4"
                >
                  {/* Enhanced Heading Style */}
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    Local SEO
                  </h3>
                  <PercentageMetric
                    label="Citation Consistency"
                    value={localSeoSummaryData[0]["Citation Consistency"]}
                  />
                </motion.div>
              )}
              {eCommerceSummaryData && eCommerceSummaryData.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="space-y-2 rounded-lg border bg-card text-card-foreground shadow-sm p-4"
                >
                  {/* Enhanced Heading Style */}
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4 text-primary" />
                    E-commerce SEO
                  </h3>
                  <PercentageMetric
                    label="Product Schema Coverage"
                    value={eCommerceSummaryData[0]["Product Schema"]}
                  />
                </motion.div>
              )}
              {!healthScore &&
                !keywordDistribution &&
                !backlinkSummaryData &&
                !techSeoSummaryData &&
                !contentSummaryData &&
                !localSeoSummaryData &&
                !eCommerceSummaryData && (
                  <motion.p
                    variants={itemVariants}
                    className="text-sm text-muted-foreground col-span-full text-center py-4"
                  >
                    Could not parse specific metrics for summary view. View the
                    "Detailed Report" tab.
                  </motion.p>
                )}
            </motion.div>
          </TabsContent>

          {/* Data Visualization Tab (Charts) */}
          <TabsContent value="visualization">
            <div className="space-y-6">
              {keywordData.length > 0 ? (
                <>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
                    {/* Enhanced Heading Style */}
                    <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                      Keyword Rankings
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={keywordData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="keyword" /> <YAxis /> <Tooltip />
                          <Legend />
                          <Bar
                            name="Current Ranking"
                            dataKey="ranking"
                            fill="hsl(var(--primary))"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                  >
                    {/* Enhanced Heading Style */}
                    <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                      Search Volume vs Difficulty
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={keywordData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="keyword" />
                          <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#82ca9d"
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#ffc658"
                            domain={[0, 100]}
                          />
                          <Tooltip /> <Legend />
                          <Bar
                            yAxisId="left"
                            name="Search Volume"
                            dataKey="volume"
                            fill="#82ca9d"
                          />
                          <Bar
                            yAxisId="right"
                            name="Difficulty"
                            dataKey="difficulty"
                            fill="#ffc658"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                  className="py-8 text-center text-muted-foreground"
                >
                  No keyword data available for visualization.
                </motion.div>
              )}
              {keywordDistribution && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  {/* Enhanced Heading Style */}
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    Keyword Distribution
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={keywordDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="hsl(var(--primary))"
                          dataKey="value"
                        >
                          {keywordDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip /> <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
              {/* Remove Backlink Distribution Mock Chart */}
              {/* ... */}
              {/* Remove Organic Traffic Mock Chart */}
              {/* ... */}
              {pageSpeedData && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                >
                  {/* Enhanced Heading Style */}
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    Page Speed Scores
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Desktop",
                            score: pageSpeedData.desktop ?? 0,
                          },
                          { name: "Mobile", score: pageSpeedData.mobile ?? 0 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" /> <YAxis domain={[0, 100]} />
                        <Tooltip /> <Legend />
                        <Bar
                          name="PageSpeed Score"
                          dataKey="score"
                          fill="hsl(var(--primary))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SeoAnalysisSection;
