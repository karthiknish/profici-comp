"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseMarkdownTable, extractListItems } from "@/utils/parsing"; // Restore parsing utils
import StatCard from "@/components/ui/StatCard"; // Restore StatCard
import {
  ListChecks,
  Scale,
  Building2,
  Briefcase,
  Activity,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  Users as UsersIcon,
  DollarSign as DollarSignIcon,
} from "lucide-react"; // Restore icons
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"; // Restore MarkdownRenderer
import MarkdownTableRenderer from "@/components/ui/MarkdownTableRenderer"; // Restore MarkdownTableRenderer

const MarketCapSection = ({ data }) => {
  // Restore parsing logic
  const valuationData = parseMarkdownTable(data, "Valuation Metrics");
  const marketSizeData = parseMarkdownTable(data, "Industry Market Size");
  const segmentationData = parseMarkdownTable(data, "Market Segmentation");
  const investmentData = extractListItems(data, "Investment Landscape Summary");
  const concentrationData = extractListItems(data, "Market Concentration");
  const driversConstraintsData = extractListItems(
    data,
    "Growth Drivers and Constraints"
  );
  const keyTakeaways = extractListItems(data, "Key Takeaways");

  let peRatio,
    evEbitda,
    revMultiple,
    ltvCac = null;
  if (valuationData) {
    const findMetricValue = (metricName) =>
      valuationData.find((row) => row.Metric === metricName)?.[
        "Average Value Est."
      ];
    peRatio = findMetricValue("P/E Ratio");
    evEbitda = findMetricValue("EV/EBITDA");
    revMultiple = findMetricValue("Revenue Multiple");
    ltvCac = findMetricValue("LTV:CAC Ratio");
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  // Restore fallback logic based on parsing results
  const showFallback =
    !keyTakeaways &&
    !valuationData &&
    !marketSizeData &&
    !segmentationData &&
    !investmentData &&
    !concentrationData &&
    !driversConstraintsData;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Cap & Valuation</CardTitle>
        <CardDescription>
          Estimate of market size and valuation metrics for the UK industry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showFallback ? (
          <div className="prose dark:prose-invert max-w-none text-sm">
            {/* Use MarkdownRenderer for fallback */}
            <MarkdownRenderer content={data} />
          </div>
        ) : (
          // Restore original rendering logic using parsed data
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            {keyTakeaways && (
              <motion.div variants={itemVariants} custom={0}>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-primary" />
                  Key Takeaways
                </h3>
                <div className="p-4 border rounded-lg bg-muted/50 mt-2">
                  <MarkdownRenderer content={keyTakeaways.join("\n")} />
                </div>
              </motion.div>
            )}

            {marketSizeData && (
              <motion.div
                variants={itemVariants}
                custom={1}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Industry Market Size (UK Est.)
                </h3>
                <MarkdownTableRenderer tableData={marketSizeData} />
              </motion.div>
            )}

            {segmentationData && (
              <motion.div
                variants={itemVariants}
                custom={2}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Market Segmentation (UK Est.)
                </h3>
                <MarkdownTableRenderer tableData={segmentationData} />
              </motion.div>
            )}

            {(peRatio || evEbitda || revMultiple || ltvCac) && (
              <motion.div
                variants={itemVariants}
                custom={3}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Valuation Metrics (UK Industry Averages Est.)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {peRatio && (
                    <StatCard
                      label="Avg. P/E Ratio"
                      value={peRatio}
                      icon={Scale}
                    />
                  )}
                  {evEbitda && (
                    <StatCard
                      label="Avg. EV/EBITDA"
                      value={evEbitda}
                      icon={Building2}
                    />
                  )}
                  {revMultiple && (
                    <StatCard
                      label="Avg. Revenue Multiple"
                      value={revMultiple}
                      icon={Briefcase}
                    />
                  )}
                  {ltvCac && (
                    <StatCard
                      label="Avg. LTV:CAC Ratio"
                      value={ltvCac}
                      icon={Activity}
                    />
                  )}
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
              {investmentData && (
                <motion.div variants={itemVariants} custom={4}>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <DollarSignIcon className="mr-2 h-5 w-5 text-primary" />
                    Investment Landscape (UK Est.)
                  </h3>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <MarkdownRenderer content={investmentData.join("\n")} />
                  </div>
                </motion.div>
              )}

              {concentrationData && (
                <motion.div variants={itemVariants} custom={5}>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <UsersIcon className="mr-2 h-5 w-5 text-primary" />
                    Market Concentration (UK Est.)
                  </h3>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <MarkdownRenderer content={concentrationData.join("\n")} />
                  </div>
                </motion.div>
              )}
            </div>

            {driversConstraintsData && (
              <motion.div
                variants={itemVariants}
                custom={6}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <TrendingUpIcon className="mr-2 h-5 w-5 text-green-500" />
                  <TrendingDown className="mr-1 h-5 w-5 text-red-500" /> Growth
                  Drivers & Constraints (UK Est.)
                </h3>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <MarkdownRenderer
                    content={driversConstraintsData.join("\n")}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketCapSection;
