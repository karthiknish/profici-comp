"use client";

import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
// Removed parsing utils as data will come via props
// import { parseMarkdownTable, parsePercentage } from "@/utils/parsing";
import { parsePercentage } from "@/utils/parsing"; // Keep parsePercentage for display formatting
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
  // LineChart, // Not used currently
  // Line,
  // Area,
} from "recharts";
import {
  // Search, // Not used
  // TrendingUp, // Not used
  // ExternalLink, // Not used
  // AlertTriangle, // Not used
  // CheckCircle, // Not used
  // BarChart2, // Not used
  PieChart as PieChartIcon,
  // LineChart as LineChartIcon, // Not used
  // Percent, // Not used
  // Link as LinkIcon, // Not used
  // FileWarning, // Not used
  FileText,
  MapPin, // Keep if used for Local SEO section (currently removed)
  ShoppingCart, // Keep if used for E-commerce SEO section (currently removed)
  Gauge,
  ShieldAlert,
  DatabaseZap,
  Code,
  Smartphone, // Added Smartphone icon
} from "lucide-react";
// import { Badge } from "@/components/ui/badge"; // Not used currently
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Not used currently
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"; // Keep for Detailed Report tab

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF80F2"];

// Keep PercentageMetric component for display
const PercentageMetric = ({ label, value, icon: Icon }) => {
  // Ensure value is treated as potentially needing percentage parsing
  const percentage = parsePercentage(value);
  if (percentage === null || isNaN(percentage)) {
    // Handle non-percentage values or parsing errors gracefully
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


// Accept seoAnalysis (for detailed tab), seoVisualData, and seoChartData props
const SeoAnalysisSection = ({ seoAnalysis, seoVisualData, seoChartData }) => {
  // --- Use data directly from props ---
  const healthScore = seoVisualData?.healthScore;
  const toxicBacklinks = seoVisualData?.toxicBacklinks; // This might be text like 'High Est.'
  const indexationRate = seoVisualData?.indexationRate; // Expecting percentage string or number
  const schemaCoverage = seoVisualData?.schemaCoverage; // Expecting percentage string or number
  const mobileFriendly = seoVisualData?.mobileFriendly; // Expecting 'Yes'/'No'
  const pageSpeedDesktop = seoVisualData?.pageSpeedDesktop; // Expecting number 0-100
  const pageSpeedMobile = seoVisualData?.pageSpeedMobile; // Expecting number 0-100

  const keywordData = seoChartData?.keywordRankings || [];
  const keywordDistribution = seoChartData?.keywordDistribution || [];
  // Add other chart data extractions here if needed

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  // Determine if enough visual data exists to show the summary tab meaningfully
  const hasVisualData =
    healthScore ||
    toxicBacklinks ||
    indexationRate ||
    schemaCoverage ||
    mobileFriendly ||
    pageSpeedDesktop ||
    pageSpeedMobile ||
    (keywordDistribution && keywordDistribution.length > 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SEO Analysis</CardTitle>
        {/* Optional: Add description if needed */}
        {/* <CardDescription>Overview of SEO performance.</CardDescription> */}
      </CardHeader>
      <CardContent>
        {/* Default to detailed report if no visual data, otherwise default based on seoAnalysis existence */}
        <Tabs
          defaultValue={
            !hasVisualData
              ? "report"
              : seoAnalysis
              ? "report"
              : "visual-summary"
          }
        >
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="report">Detailed Report</TabsTrigger>
            <TabsTrigger value="visual-summary" disabled={!hasVisualData}>
              Visual Summary
            </TabsTrigger>
            <TabsTrigger
              value="visualization"
              disabled={
                keywordData.length === 0 &&
                keywordDistribution.length === 0 &&
                !pageSpeedDesktop &&
                !pageSpeedMobile
              }
            >
              Charts
            </TabsTrigger>
          </TabsList>

          {/* Detailed Report Tab - Renders raw seoAnalysis */}
          <TabsContent value="report" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none text-sm markdown-content">
              <MarkdownRenderer
                content={seoAnalysis || "No detailed analysis data available."}
              />
            </div>
          </TabsContent>

          {/* Visual Summary Tab - Uses seoVisualData */}
          <TabsContent value="visual-summary">
            {hasVisualData ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {/* Use data from seoVisualData prop */}
                {healthScore !== null && typeof healthScore !== "undefined" && (
                  <KeyMetricHighlight
                    label="SEO Health Score"
                    value={healthScore} // Already a number
                    icon={Gauge}
                    className="sm:col-span-1 lg:col-span-1"
                  />
                )}
                {toxicBacklinks && (
                  <KeyMetricHighlight
                    label="Toxic Backlinks"
                    value={toxicBacklinks} // Display text directly
                    icon={ShieldAlert}
                    className="sm:col-span-1 lg:col-span-1"
                    isTextValue={true} // Indicate it's text
                  />
                )}
                {indexationRate !== null &&
                  typeof indexationRate !== "undefined" && (
                    <KeyMetricHighlight
                      label="Indexation Rate"
                      value={parsePercentage(indexationRate)} // Parse for display
                      unit="%"
                      icon={DatabaseZap}
                      className="sm:col-span-1 lg:col-span-1"
                    />
                  )}
                {schemaCoverage !== null &&
                  typeof schemaCoverage !== "undefined" && (
                    <KeyMetricHighlight
                      label="Schema Coverage"
                      value={parsePercentage(schemaCoverage)} // Parse for display
                      unit="%"
                      icon={Code}
                      className="sm:col-span-1 lg:col-span-1"
                    />
                  )}
                {mobileFriendly && (
                  <KeyMetricHighlight
                    label="Mobile Friendly"
                    value={mobileFriendly} // Display Yes/No
                    icon={Smartphone}
                    className="sm:col-span-1 lg:col-span-1"
                    isTextValue={true}
                  />
                )}
                {pageSpeedMobile !== null &&
                  typeof pageSpeedMobile !== "undefined" && (
                    <KeyMetricHighlight
                      label="Mobile PageSpeed"
                      value={pageSpeedMobile} // Already a number
                      unit="/100"
                      icon={Gauge}
                      className="sm:col-span-1 lg:col-span-1"
                    />
                  )}
                {pageSpeedDesktop !== null &&
                  typeof pageSpeedDesktop !== "undefined" && (
                    <KeyMetricHighlight
                      label="Desktop PageSpeed"
                      value={pageSpeedDesktop} // Already a number
                      unit="/100"
                      icon={Gauge}
                      className="sm:col-span-1 lg:col-span-1"
                    />
                  )}

                {/* Keyword Distribution Summary (if data exists) */}
                {keywordDistribution && keywordDistribution.length > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="space-y-2 rounded-lg border bg-card text-card-foreground shadow-sm p-4 col-span-1 sm:col-span-2 lg:col-span-3"
                  >
                    <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                      <PieChartIcon className="mr-2 h-4 w-4 text-primary" />
                      Keyword Distribution
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {keywordDistribution.map((item) => (
                        <PercentageMetric
                          key={item.name}
                          label={item.name}
                          value={item.value} // Already a number/percentage
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                {/* Add other visual summary sections if needed, using seoVisualData */}
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Visual summary data not available. View the "Detailed Report"
                tab.
              </p>
            )}
          </TabsContent>

          {/* Data Visualization Tab (Charts) - Uses seoChartData */}
          <TabsContent value="visualization">
            <div className="space-y-6">
              {/* Keyword Rankings Chart */}
              {keywordData && keywordData.length > 0 ? (
                <>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
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
                          <XAxis dataKey="keyword" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            name="Ranking" // Updated name
                            dataKey="ranking"
                            fill="hsl(var(--primary))"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                  {/* Keyword Volume Chart (Optional - if volume data exists) */}
                  {keywordData.some((k) => k.volume) && (
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={1}
                    >
                      <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                        Keyword Search Volume (UK Est.)
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={keywordData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="keyword" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              name="Avg. Monthly Volume"
                              dataKey="volume"
                              fill="#82ca9d"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                  className="py-8 text-center text-muted-foreground"
                >
                  No keyword ranking data available for visualization.
                </motion.div>
              )}

              {/* Keyword Distribution Chart */}
              {keywordDistribution && keywordDistribution.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
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
                          label={(
                            { name, value } // Use value directly
                          ) => `${name}: ${value?.toFixed(0) ?? "N/A"}%`}
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
                        <Tooltip
                          formatter={(value) =>
                            `${value?.toFixed(1) ?? "N/A"}%`
                          }
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Page Speed Scores Chart */}
              {(pageSpeedDesktop !== null || pageSpeedMobile !== null) && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3} // Adjusted custom index
                >
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    Page Speed Scores
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Desktop",
                            score: pageSpeedDesktop ?? 0,
                          },
                          { name: "Mobile", score: pageSpeedMobile ?? 0 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
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

              {/* Message if no chart data is available */}
              {keywordData.length === 0 &&
                keywordDistribution.length === 0 &&
                !pageSpeedDesktop &&
                !pageSpeedMobile && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No data available for charts.
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
