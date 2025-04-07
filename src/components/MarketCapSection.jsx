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
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Users,
  TrendingUp as TrendingUpIcon,
  Building,
  Filter,
  Zap,
  Ban,
  Star,
  Info,
  PieChart,
  ArrowRight,
} from "lucide-react";
// Import the basic helpers
import {
  FormattedText,
  JsonList,
  JsonTable,
} from "@/components/ui/JsonRenderHelpers";

// --- Main Component ---

const MarketCapSection = ({ data }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const hasData = data && !data.error && typeof data === "object";

  // Helper to render simple key-value pairs from an object
  const renderSimpleKVP = (
    obj,
    skipKeys = ["title", "headers", "rows", "table", "drivers", "constraints"]
  ) => {
    if (!obj || typeof obj !== "object") return null;
    const entries = Object.entries(obj).filter(
      ([key, value]) =>
        !skipKeys.includes(key) &&
        (typeof value === "string" || typeof value === "number")
    );

    if (entries.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm mt-3">
        {entries.map(([key, value]) => {
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          return (
            <div
              key={key}
              className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border"
            >
              <h5 className="text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                {formattedKey}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <FormattedText text={String(value ?? "N/A")} />
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full shadow-sm border bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Market Cap & Valuation
        </CardTitle>
        <CardDescription>
          Estimated market size, segmentation, and valuation metrics for the
          industry in the UK.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {hasData ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-8"
          >
            {/* Guide Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">
                    Market Valuation Guide
                  </h4>
                  <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                    This section provides detailed market valuation metrics,
                    segmentation analysis, and growth potential for your
                    industry in the UK market. These insights can help inform
                    investment decisions and strategic planning.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-start gap-1.5">
                      <TrendingUpIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-700/80 dark:text-blue-300/80">
                        Use CAGR data for growth projections
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <PieChart className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-700/80 dark:text-blue-300/80">
                        Focus on your target market segments
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-700/80 dark:text-blue-300/80">
                        Consider 3-5 year investment horizon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Takeaways */}
            {data.keyTakeaways && (
              <motion.div variants={itemVariants} custom={0}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.keyTakeaways.title || "Key Takeaways"}
                </h3>
                <Card className="overflow-hidden shadow-sm border">
                  <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-b">
                    <h4 className="font-medium">Strategic Overview</h4>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {data.keyTakeaways.points &&
                        data.keyTakeaways.points.map((point, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white dark:bg-gray-800 rounded-md border shadow-sm flex"
                          >
                            <div className="mr-3 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-primary">
                                {idx + 1}
                              </span>
                            </div>
                            <p className="text-sm">
                              <FormattedText text={point} />
                            </p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Industry Market Size */}
            {data.industryMarketSize && (
              <motion.div variants={itemVariants} custom={1}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.industryMarketSize.title || "Industry Market Size"}
                </h3>
                <div className="overflow-x-auto rounded-lg shadow-sm border">
                  <JsonTable data={data.industryMarketSize} />
                </div>
                {data.industryMarketSize.cagrForecast && (
                  <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-start gap-2">
                      <TrendingUpIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <FormattedText
                          text={data.industryMarketSize.cagrForecast}
                        />
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Market Segmentation */}
            {data.marketSegmentation && (
              <motion.div variants={itemVariants} custom={2}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.marketSegmentation.title || "Market Segmentation"}
                </h3>
                <div className="overflow-x-auto rounded-lg shadow-sm border">
                  <JsonTable data={data.marketSegmentation} />
                </div>
              </motion.div>
            )}

            {/* Valuation Metrics */}
            {data.valuationMetrics && (
              <motion.div variants={itemVariants} custom={3}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUpIcon className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.valuationMetrics.title || "Valuation Metrics"}
                </h3>
                <div className="overflow-x-auto rounded-lg shadow-sm border">
                  <JsonTable data={data.valuationMetrics} />
                </div>
              </motion.div>
            )}

            {/* Investment Landscape */}
            {data.investmentLandscape && (
              <motion.div variants={itemVariants} custom={4}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.investmentLandscape.title || "Investment Landscape"}
                </h3>
                <Card className="overflow-hidden shadow-sm border">
                  <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800/50">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="font-medium text-indigo-700 dark:text-indigo-300">
                        Investment Details
                      </h4>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    {renderSimpleKVP(data.investmentLandscape, [
                      "title",
                      "keyInvestors",
                    ])}
                    {data.investmentLandscape.keyInvestors && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-indigo-500" />
                          Key Investors
                        </h5>
                        <div className="space-y-1.5">
                          {data.investmentLandscape.keyInvestors.map(
                            (investor, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mt-1 flex-shrink-0" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <FormattedText text={investor} />
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Market Concentration */}
            {data.marketConcentration && (
              <motion.div variants={itemVariants} custom={5}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.marketConcentration.title || "Market Concentration"}
                </h3>
                <Card className="overflow-hidden shadow-sm border">
                  <div className="px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800/50">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h4 className="font-medium text-purple-700 dark:text-purple-300">
                        Concentration Analysis
                      </h4>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    {renderSimpleKVP(data.marketConcentration)}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Growth Drivers and Constraints */}
            {data.growthDriversConstraints && (
              <motion.div variants={itemVariants} custom={6}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUpIcon className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.growthDriversConstraints.title ||
                    "Growth Drivers & Constraints"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.growthDriversConstraints.drivers && (
                    <Card className="overflow-hidden shadow-sm border">
                      <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800/50">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <h4 className="font-medium text-green-700 dark:text-green-300">
                            Growth Drivers
                          </h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {data.growthDriversConstraints.drivers.map(
                            (item, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-green-50/30 dark:bg-green-900/10 rounded-md border border-green-100 dark:border-green-800/30"
                              >
                                <h5 className="text-sm font-medium mb-1 text-green-700 dark:text-green-300">
                                  {item.factor}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <FormattedText text={item.explanation} />
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {data.growthDriversConstraints.constraints && (
                    <Card className="overflow-hidden shadow-sm border">
                      <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800/50">
                        <div className="flex items-center gap-2">
                          <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
                          <h4 className="font-medium text-red-700 dark:text-red-300">
                            Growth Constraints
                          </h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {data.growthDriversConstraints.constraints.map(
                            (item, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-red-50/30 dark:bg-red-900/10 rounded-md border border-red-100 dark:border-red-800/30"
                              >
                                <h5 className="text-sm font-medium mb-1 text-red-700 dark:text-red-300">
                                  {item.factor}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <FormattedText text={item.explanation} />
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-800/30">
            <DollarSign className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600 mb-2" />
            <h4 className="font-medium text-gray-700 dark:text-gray-300">
              No Market Cap Data Available
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
              We couldn't generate market cap and valuation data. This might be
              because we need more information about your industry or business
              sector.
            </p>
            {data?.error && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-4 max-w-md mx-auto">
                Error: {data.error}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketCapSection;
