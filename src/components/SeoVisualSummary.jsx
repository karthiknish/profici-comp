"use client";

import React from "react";
import { motion } from "framer-motion";
// Removed Progress, parsePercentage, KeyMetricHighlight imports
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
  LineChart, // Add LineChart
  Line, // Add Line
  PieChart as RechartsPieChart, // Alias original PieChart to avoid name clash
} from "recharts";
import {
  BarChart3, // Use a more generic chart icon or keep Key
  PieChart as PieChartIcon, // Keep this icon
  TrendingUp,
  Cpu, // Icon for Technology
  // Smartphone, // Icon for Mobile Optimization - Removed as title is in chart component
} from "lucide-react";
import SeoKeyMetrics from "./SeoKeyMetrics";
import TechnologyPieChart from "./charts/TechnologyPieChart";
import MobileOptimizationRadarChart from "./charts/MobileOptimizationRadarChart"; // Import Radar Chart

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#ffc658",
];

// Custom Tooltip for Keyword Chart
const CustomKeywordTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rankingData = payload.find((p) => p.dataKey === "ranking");
    const volumeData = payload.find((p) => p.dataKey === "volume");

    return (
      <div className="p-2 bg-background border rounded shadow-lg text-xs">
        <p className="font-bold mb-1">{label}</p>
        {rankingData && (
          <p style={{ color: rankingData.color }}>
            {`${rankingData.name}: ${rankingData.value}`}
          </p>
        )}
        {volumeData && (
          <p style={{ color: volumeData.color }}>
            {`${volumeData.name}: ${
              volumeData.value?.toLocaleString() ?? "N/A"
            }`}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const SeoVisualSummary = ({ seoVisualData, seoChartData }) => {
  // --- Log received props ---
  console.log("SeoVisualSummary Props Received:");
  console.log("seoVisualData:", seoVisualData);
  console.log("seoChartData:", seoChartData);
  // --- End Log ---

  // Extract data needed for charts and boolean checks
  const pageSpeedDesktop = seoVisualData?.pageSpeedDesktop;
  const pageSpeedMobile = seoVisualData?.pageSpeedMobile;
  const keywordDistribution = seoVisualData?.keywordDistribution || [];
  const keywordData = seoChartData?.keywordRankings || [];
  const trafficTrendData = seoChartData?.trafficTrend || [];
  const techCategories =
    seoVisualData?.technologyDetection?.technology_categories || [];

  // --- Process Technology Data for Pie Chart ---
  const processTechData = (categories, threshold = 1) => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return null;
    }

    const counts = categories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1; // Simple count, assuming 1 tech per category entry from Insites
      return acc;
    }, {});

    let labels = [];
    let dataPoints = [];
    let othersCount = 0;

    // Sort categories by count descending to group smallest ones
    const sortedEntries = Object.entries(counts).sort(([, a], [, b]) => b - a);

    sortedEntries.forEach(([label, count]) => {
      // Group categories with count <= threshold into "Others"
      // Or if we already have too many slices (e.g., > 10)
      if (count <= threshold || labels.length >= 10) {
        othersCount += count;
      } else {
        labels.push(label);
        dataPoints.push(count);
      }
    });

    if (othersCount > 0) {
      labels.push("Others");
      dataPoints.push(othersCount);
    }

    // Match the example data structure
    return {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: dataPoints,
            // Use predefined COLORS or generate dynamically if needed
            backgroundColor: COLORS.slice(0, labels.length),
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Technology Profile Breakdown",
        },
      },
    };
  };

  const technologyChartData = processTechData(techCategories);
  // --- End Technology Data Processing ---

  // --- Static Mobile Optimization Radar Chart Data ---
  const staticMobileRadarChartData = {
    type: "radar",
    data: {
      labels: [
        "Has Mobile Site",
        "Has Viewport Optimized",
        "Has Small Text",
        "Has Small Links",
        "Has Horizontal Scroll",
      ],
      datasets: [
        {
          label: "Mobile Optimization",
          data: [0, 1, 0, 0, 0], // Data provided by user
          backgroundColor: "rgba(34, 193, 195, 0.2)",
          borderColor: "rgba(34, 193, 195, 1)",
          pointBackgroundColor: "rgba(34, 193, 195, 1)",
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Mobile Optimization", // Title provided by user
      },
    },
  };
  // --- End Static Mobile Data ---

  // Check if there's any data to display (can be simplified or moved to child)
  // Check if there's *any* visual data (metrics OR charts)
  const hasAnyVisualData =
    seoVisualData && Object.keys(seoVisualData).length > 0;
  const hasAnyChartData =
    seoChartData &&
    Object.keys(seoChartData).length > 0 &&
    (seoChartData.keywordRankings?.length > 0 ||
      seoVisualData?.keywordDistribution?.length > 0 ||
      seoVisualData?.pageSpeedDesktop != null ||
      seoVisualData?.pageSpeedMobile != null);

  // Determine if specific chart data exists
  const hasKeywordRankingChartData = keywordData && keywordData.length > 0;
  const hasKeywordVolumeChartData =
    hasKeywordRankingChartData && keywordData.some((k) => k.volume != null);
  const hasDistributionChartData =
    keywordDistribution &&
    keywordDistribution.length > 0 &&
    keywordDistribution.some((d) => d.value > 0);
  const hasPageSpeedChartData =
    pageSpeedDesktop != null || pageSpeedMobile != null;
  const hasTrafficTrendChartData =
    trafficTrendData && trafficTrendData.length > 0; // Check for traffic trend data
  const hasChartData =
    hasKeywordRankingChartData ||
    hasDistributionChartData ||
    hasPageSpeedChartData ||
    hasTrafficTrendChartData ||
    !!technologyChartData ||
    !!staticMobileRadarChartData; // Use static data check

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  if (!hasAnyVisualData && !hasAnyChartData) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Visual summary & chart data not available.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Render Key Metrics using the new component, pass seoChartData */}
      <SeoKeyMetrics
        seoVisualData={seoVisualData}
        seoChartData={seoChartData}
      />

      {/* Charts Section - Render only if there's chart data */}
      {hasChartData && (
        <div className="mt-6 pt-6 border-t space-y-6">
          {/* Combined Keyword Ranking & Volume Chart */}
          {hasKeywordRankingChartData && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" /> Keyword
                Ranking & Volume
              </h3>
              {/* --- Remove console log --- */}
              {/* {console.log("Keyword Data for Chart:", keywordData)} */}
              {/* --- End remove console log --- */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={keywordData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" />
                    {/* Add YAxis for Ranking (left) */}
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="hsl(var(--primary))"
                    />
                    {/* Add YAxis for Volume (right) if volume data exists */}
                    {hasKeywordVolumeChartData && (
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#82ca9d"
                      />
                    )}
                    <Tooltip content={<CustomKeywordTooltip />} />
                    <Legend />
                    <Bar
                      yAxisId="left" // Assign to left Y-axis
                      name="Ranking"
                      dataKey="ranking"
                      fill="hsl(var(--primary))"
                    />
                    {/* Add Bar for Volume if volume data exists */}
                    {hasKeywordVolumeChartData && (
                      <Bar
                        yAxisId="right" // Assign to right Y-axis
                        name="Avg. Monthly Volume"
                        dataKey="volume"
                        fill="#82ca9d"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
          {/* Keyword Volume Bar Chart - REMOVED */}

          {/* Keyword Distribution Pie Chart */}
          {hasDistributionChartData && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={1} // Adjust custom index since one chart was removed
            >
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                <PieChartIcon className="mr-2 h-5 w-5 text-primary" /> Keyword
                Distribution
              </h3>
              <div className="h-80 flex justify-center items-center">
                <ResponsiveContainer width="80%" height="100%">
                  <PieChart>
                    <Pie
                      data={keywordDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {keywordDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
          {/* Page Speed Bar Chart */}
          {hasPageSpeedChartData && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={2} // Adjust custom index
            >
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                Page Speed Scores
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Desktop", score: pageSpeedDesktop ?? 0 },
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
          {/* Traffic Trend Line Chart */}
          {hasTrafficTrendChartData && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={3} // Adjust custom index
            >
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" /> Organic
                Traffic Trend (Monthly Visits Est.)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trafficTrendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="visits"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Est. Visits"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
          {/* Technology Pie Chart */}
          {technologyChartData && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={4} // Adjust custom index
            >
              {/* Title is handled within TechnologyPieChart component now */}
              {/* <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                <Cpu className="mr-2 h-5 w-5 text-primary" /> Technology Profile
              </h3> */}
              <TechnologyPieChart chartData={technologyChartData} />
            </motion.div>
          )}
          {/* Mobile Optimization Radar Chart (Using Static Data) */}
          {staticMobileRadarChartData && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              custom={5} // Adjust custom index
            >
              {/* Title is handled within MobileOptimizationRadarChart component */}
              <MobileOptimizationRadarChart
                chartData={staticMobileRadarChartData}
              />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeoVisualSummary;
