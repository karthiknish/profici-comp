"use client";

import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { parsePercentage } from "@/utils/parsing";
import KeyMetricHighlight from "./KeyMetricHighlight";
import {
  PieChart as PieChartIcon,
  Gauge,
  ShieldAlert,
  DatabaseZap,
  Code,
  Smartphone,
  ArrowRightLeft, // For difference
  Star, // For score
  Cpu,
  TrendingUp as TrendingUpIcon, // Alias for clarity
  DollarSign, // For traffic value
} from "lucide-react";

// Re-define or import PercentageMetric if needed elsewhere, otherwise keep it local
const PercentageMetric = ({ label, value, icon: Icon }) => {
  const percentage = parsePercentage(value);
  if (percentage === null || isNaN(percentage)) {
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

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const SeoKeyMetrics = ({ seoVisualData, seoChartData }) => {
  // Extract data from props
  const healthScore = seoVisualData?.healthScore;
  const toxicBacklinks = seoVisualData?.toxicBacklinks;
  const indexationRate = seoVisualData?.indexationRate;
  const schemaCoverage = seoVisualData?.schemaCoverage;
  const mobileFriendly = seoVisualData?.mobileFriendly;
  const pageSpeedDesktop = seoVisualData?.pageSpeedDesktop;
  const pageSpeedMobile = seoVisualData?.pageSpeedMobile;
  const keywordDistribution = seoVisualData?.keywordDistribution || [];
  const techCategories =
    seoVisualData?.technologyDetection?.technology_categories || [];
  const trafficTrendData = seoChartData?.trafficTrend || [];
  // Using the static data defined in SeoVisualSummary for mobile score calculation
  const mobileOptimizationData = [0, 1, 0, 0, 0];

  // --- Calculate Derived Insights ---

  // 1. Page Speed Difference
  const pageSpeedDifference =
    pageSpeedDesktop != null && pageSpeedMobile != null
      ? Math.abs(pageSpeedDesktop - pageSpeedMobile)
      : null;

  // 2. Mobile Optimization Score (based on static radar data [0,1,0,0,0])
  const mobileScore =
    mobileOptimizationData.reduce((sum, val) => sum + val, 0) * 20; // 1 point = 20%

  // 3. Technology Count
  const uniqueTechs = new Set(techCategories);
  const technologyCount = uniqueTechs.size; // Simple count of unique categories

  // 4. Traffic Trend Growth
  let trafficTrendGrowth = null;
  if (trafficTrendData && trafficTrendData.length >= 2) {
    const firstMonthVisits = trafficTrendData[0]?.visits;
    const lastMonthVisits =
      trafficTrendData[trafficTrendData.length - 1]?.visits;
    if (
      firstMonthVisits != null &&
      lastMonthVisits != null &&
      firstMonthVisits > 0
    ) {
      trafficTrendGrowth =
        ((lastMonthVisits - firstMonthVisits) / firstMonthVisits) * 100;
    } else if (firstMonthVisits === 0 && lastMonthVisits > 0) {
      trafficTrendGrowth = Infinity; // Indicate growth from zero
    }
  }

  // --- End Calculated Insights ---

  const hasVisualData =
    healthScore != null ||
    toxicBacklinks != null ||
    indexationRate != null ||
    schemaCoverage != null ||
    mobileFriendly != null ||
    pageSpeedDesktop != null ||
    pageSpeedMobile != null ||
    (keywordDistribution &&
      keywordDistribution.length > 0 &&
      keywordDistribution.some((d) => d.value > 0));

  if (!hasVisualData) {
    // Optionally return null or a placeholder if no visual data exists at all
    return null;
    // return <p className="text-sm text-muted-foreground text-center py-4">No key metrics available.</p>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {healthScore != null && (
        <KeyMetricHighlight
          label="SEO Health Score"
          value={healthScore}
          icon={Gauge}
          className="sm:col-span-1 lg:col-span-1"
        />
      )}
      {toxicBacklinks != null && (
        <KeyMetricHighlight
          label="Toxic Backlinks"
          value={toxicBacklinks}
          icon={ShieldAlert}
          className="sm:col-span-1 lg:col-span-1"
          isTextValue={true}
        />
      )}
      {indexationRate != null && (
        <KeyMetricHighlight
          label="Indexation Rate"
          value={parsePercentage(indexationRate)}
          unit="%"
          icon={DatabaseZap}
          className="sm:col-span-1 lg:col-span-1"
        />
      )}
      {schemaCoverage != null && (
        <KeyMetricHighlight
          label="Schema Coverage"
          value={parsePercentage(schemaCoverage)}
          unit="%"
          icon={Code}
          className="sm:col-span-1 lg:col-span-1"
        />
      )}
      {mobileFriendly != null && (
        <KeyMetricHighlight
          label="Mobile Friendly"
          value={mobileFriendly}
          icon={Smartphone}
          className="sm:col-span-1 lg:col-span-1"
          isTextValue={true}
        />
      )}
      {pageSpeedMobile != null && (
        <KeyMetricHighlight
          label="Mobile PageSpeed"
          value={pageSpeedMobile}
          unit="/100"
          icon={Gauge}
          className="sm:col-span-1 lg:col-span-1"
        />
      )}
      {pageSpeedDesktop != null && (
        <KeyMetricHighlight
          label="Desktop PageSpeed"
          value={pageSpeedDesktop}
          unit="/100"
          icon={Gauge}
          className="sm:col-span-1 lg:col-span-1"
        />
      )}
      {/* Display Derived Insights */}
      {pageSpeedDifference !== null && (
        <KeyMetricHighlight
          label="Page Speed Diff."
          value={pageSpeedDifference}
          unit="pts"
          icon={ArrowRightLeft}
          className="sm:col-span-1 lg:col-span-1"
          tooltip="Absolute difference between Desktop and Mobile PageSpeed scores."
        />
      )}
      {mobileScore !== null && (
        <KeyMetricHighlight
          label="Mobile Opt. Score"
          value={mobileScore}
          unit="/100"
          icon={Star} // Using Star for score
          className="sm:col-span-1 lg:col-span-1"
          tooltip="Calculated score based on mobile optimization checks (viewport, text size, etc.). Higher is better."
        />
      )}
      {technologyCount > 0 && (
        <KeyMetricHighlight
          label="Technologies Found"
          value={technologyCount}
          icon={Cpu}
          className="sm:col-span-1 lg:col-span-1"
          tooltip="Number of unique technology categories detected."
        />
      )}
      {trafficTrendGrowth !== null && (
        <KeyMetricHighlight
          label="Traffic Trend Growth"
          value={
            trafficTrendGrowth === Infinity
              ? "∞"
              : trafficTrendGrowth.toFixed(0)
          } // Handle Infinity case
          unit={trafficTrendGrowth === Infinity ? "" : "%"}
          icon={TrendingUpIcon}
          className="sm:col-span-1 lg:col-span-1"
          tooltip="Percentage growth in estimated monthly visits between the first and last recorded months."
        />
      )}
      {seoVisualData?.estimatedTrafficValueGBP !== null && (
        <KeyMetricHighlight
          label="Est. Traffic Value"
          value={seoVisualData.estimatedTrafficValueGBP.toLocaleString()}
          unit="GBP/mo"
          icon={DollarSign}
          className="sm:col-span-1 lg:col-span-1"
          tooltip="Estimated monthly value of organic traffic based on keyword volume, ranking CTR, and estimated CPC."
        />
      )}

      {/* Keyword Distribution as Percentage Metrics */}
      {keywordDistribution &&
        keywordDistribution.length > 0 &&
        keywordDistribution.some((d) => d.value > 0) && (
          <motion.div
            variants={itemVariants} // Use itemVariants for individual animation if needed
            className="space-y-2 rounded-lg border bg-card text-card-foreground shadow-sm p-4 col-span-1 sm:col-span-2 lg:col-span-3"
          >
            <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
              <PieChartIcon className="mr-2 h-4 w-4 text-primary" /> Keyword
              Distribution (Metrics)
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
    </motion.div>
  );
};

export default SeoKeyMetrics;
