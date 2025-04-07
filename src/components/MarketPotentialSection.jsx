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
import {
  TrendingUp,
  Users,
  Layers,
  LineChart,
  Gavel,
  Lock,
  Percent,
  Star,
  Plus,
  Minus,
  CircleDot,
  Scale,
  BarChart3,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import {
  FormattedText,
  JsonList,
  JsonTable,
  RenderSimpleKVP, // Keep RenderSimpleKVP
} from "@/components/ui/JsonRenderHelpers";
import { Badge } from "@/components/ui/badge"; // Import Badge

const MarketPotentialSection = ({ data }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const hasData = data && !data.error && typeof data === "object";

  // --- Reusable Sub-section Renderer ---
  const renderSubSection = (
    subData,
    defaultTitle = "Details",
    titleIcon = Lightbulb,
    customRender = null // Optional custom render function for specific data types
  ) => {
    if (
      !subData ||
      typeof subData !== "object" ||
      Object.keys(subData).length === 0
    ) {
      // Don't render anything if subData is empty or not an object
      // console.log(`Skipping subsection: ${defaultTitle} - No data`);
      return null;
    }

    // Extract common properties and the rest for potential KVP rendering
    const {
      title,
      description,
      headers,
      rows,
      points,
      // Keys from prompt structure (some might be handled by custom renderers)
      segments, // customerSegmentation.segments
      targetCustomerProfile, // customerSegmentation.targetCustomerProfile
      trends, // marketTrends.trends
      emergingTech, // marketTrends.emergingTech
      customerBehaviourShifts, // marketTrends.customerBehaviourShifts
      keyRegulations, // regulatoryEnvironment.keyRegulations
      upcomingChanges, // regulatoryEnvironment.upcomingChanges
      complianceConsiderations, // regulatoryEnvironment.complianceConsiderations
      keyBarriers, // barriersToEntry.keyBarriers
      overallDifficulty, // barriersToEntry.overallDifficulty
      primaryStrategy, // marketPenetration.primaryStrategy
      keyActions, // marketPenetration.keyActions
      estimatedInvestmentLevel, // marketPenetration.estimatedInvestmentLevel
      expectedOutcome, // marketPenetration.expectedOutcome
      summary, // Add summary here to capture it from keyTakeaways etc.
      ...otherSimpleData // Catch the rest
    } = subData;
    const IconComponent = titleIcon;

    // Filter out handled keys from otherSimpleData before passing to RenderSimpleKVP
    // Note: We rely on customRender functions to handle their specific keys
    const simpleKVPData = Object.keys(otherSimpleData).reduce((acc, key) => {
      if (
        typeof otherSimpleData[key] !== "object" ||
        otherSimpleData[key] === null
      ) {
        acc[key] = otherSimpleData[key];
      }
      return acc;
    }, {});

    // console.log(`Rendering subsection: ${title || defaultTitle}`, subData);

    return (
      <motion.div
        variants={itemVariants}
        className="pt-6 border-t first:pt-0 first:border-t-0"
      >
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center">
          <IconComponent className="mr-2 h-5 w-5 text-primary" />
          {title || defaultTitle}
        </h3>
        {/* Render description OR summary if available */}
        {(description || summary) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-700/90 dark:text-blue-300/90">
              <FormattedText text={description || summary} />
            </p>
          </div>
        )}

        {/* Use custom renderer if provided */}
        {customRender ? (
          customRender(subData)
        ) : (
          <>
            {/* Enhanced Table Display */}
            {Array.isArray(rows) &&
              Array.isArray(headers) &&
              rows.length > 0 &&
              headers.length > 0 && (
                <div className="overflow-x-auto rounded-lg shadow-sm border mb-3 bg-white dark:bg-gray-800/60">
                  <JsonTable data={{ headers, rows }} />
                </div>
              )}

            {/* Enhanced Points List */}
            {Array.isArray(points) && points.length > 0 && (
              <div className="p-4 border rounded-md bg-gray-50/80 dark:bg-gray-800/30 mb-4">
                <JsonList
                  items={points}
                  className="space-y-2 text-sm"
                  itemRenderer={(point, idx) => (
                    <div className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        <FormattedText text={point} />
                      </p>
                    </div>
                  )}
                />
              </div>
            )}

            {/* Render remaining simple KVP */}
            {Object.keys(simpleKVPData).length > 0 && (
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
                <RenderSimpleKVP data={simpleKVPData} />
              </div>
            )}
          </>
        )}
      </motion.div>
    );
  };
  // --- End Reusable Sub-section Renderer ---

  // --- Custom Renderers for Specific Sections (Aligned with Prompt) ---
  const renderCustomerSegmentation = (segmentData) => {
    if (
      !segmentData ||
      (!Array.isArray(segmentData.segments) &&
        !segmentData.targetCustomerProfile)
    )
      return null;

    return (
      <div className="grid grid-cols-1 gap-4">
        {/* Render Segments */}
        {Array.isArray(segmentData.segments) &&
          segmentData.segments.length > 0 && (
            <Card className="overflow-hidden shadow-sm border">
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-900/10 border-b border-indigo-200 dark:border-indigo-800/50">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-medium text-indigo-700 dark:text-indigo-300">
                    Market Segments (UK)
                  </h4>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {segmentData.segments.map((segment, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-md border border-indigo-100 dark:border-indigo-800/30 hover:shadow-md transition-shadow duration-200"
                    >
                      <h5 className="text-sm font-medium mb-1 text-indigo-700 dark:text-indigo-300 flex items-center">
                        <CircleDot className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                        {segment.segmentName || "Unnamed Segment"}
                      </h5>
                      {segment.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <FormattedText text={segment.description} />
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {segment.sizeGrowthPotential && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                          >
                            Size/Growth: {segment.sizeGrowthPotential}
                          </Badge>
                        )}
                        {segment.keyNeeds && (
                          <Badge
                            variant="outline"
                            className="text-xs border-indigo-300 text-indigo-600 dark:border-indigo-700 dark:text-indigo-400"
                          >
                            Key Needs: {segment.keyNeeds}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Render Target Customer Profile */}
        {segmentData.targetCustomerProfile && (
          <Card className="overflow-hidden shadow-sm border">
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/10 border-b border-emerald-200 dark:border-emerald-800/50">
              <div className="flex items-center gap-2">
                <CircleDot className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-medium text-emerald-700 dark:text-emerald-300">
                  Ideal Customer Profile (UK)
                </h4>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <FormattedText text={segmentData.targetCustomerProfile} />
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderMarketTrends = (trendData) => {
    if (
      !trendData ||
      (!Array.isArray(trendData.trends) &&
        !trendData.emergingTech &&
        !trendData.customerBehaviourShifts)
    )
      return null;

    return (
      <div className="space-y-4">
        {/* Render Trends Array */}
        {Array.isArray(trendData.trends) && trendData.trends.length > 0 && (
          <div className="space-y-3">
            {trendData.trends.map((trend, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-purple-100 dark:border-purple-800/30 hover:shadow-md transition-shadow duration-200"
                style={{
                  background:
                    "linear-gradient(to right, rgba(147, 51, 234, 0.05), rgba(147, 51, 234, 0.02))",
                }}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <div className="h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium mb-1 text-purple-700 dark:text-purple-300">
                      {trend.trendName || "Unnamed Trend"}
                    </h5>
                    {trend.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <FormattedText text={trend.description} />
                      </p>
                    )}
                    {trend.impactOpportunity && (
                      <div className="mt-1 p-2 bg-white/50 dark:bg-gray-800/30 rounded border-l-2 border-purple-400">
                        <p className="text-xs font-medium text-purple-600 dark:text-purple-300 mb-0.5">
                          Impact/Opportunity:
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <FormattedText text={trend.impactOpportunity} />
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Render Emerging Tech & Customer Shifts */}
        {(trendData.emergingTech || trendData.customerBehaviourShifts) && (
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 space-y-3">
            {trendData.emergingTech && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emerging Tech Shifts:
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <FormattedText text={trendData.emergingTech} />
                </p>
              </div>
            )}
            {trendData.customerBehaviourShifts && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer Behaviour Shifts:
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <FormattedText text={trendData.customerBehaviourShifts} />
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRegulations = (regData) => {
    if (
      !regData ||
      (!regData.keyRegulations &&
        !regData.upcomingChanges &&
        !regData.complianceConsiderations)
    )
      return null;

    return (
      <div className="p-4 rounded-lg border border-amber-100 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-900/10 space-y-3">
        {regData.keyRegulations && (
          <div>
            <h5 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1 flex items-center">
              <Gavel className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
              Key Regulations (UK):
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
              <FormattedText text={regData.keyRegulations} />
            </p>
          </div>
        )}
        {regData.upcomingChanges && (
          <div>
            <h5 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1 flex items-center">
              <Gavel className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
              Upcoming Changes:
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
              <FormattedText text={regData.upcomingChanges} />
            </p>
          </div>
        )}
        {regData.complianceConsiderations && (
          <div>
            <h5 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1 flex items-center">
              <Gavel className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
              Compliance Considerations:
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
              <FormattedText text={regData.complianceConsiderations} />
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderBarriers = (barrierData) => {
    if (
      !barrierData ||
      (!Array.isArray(barrierData.keyBarriers) &&
        !barrierData.overallDifficulty)
    )
      return null;

    return (
      <div className="space-y-4">
        {/* Render Barriers Array */}
        {Array.isArray(barrierData.keyBarriers) &&
          barrierData.keyBarriers.length > 0 && (
            <div className="space-y-3">
              {barrierData.keyBarriers.map((barrier, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-red-100 dark:border-red-800/30 hover:shadow-md transition-shadow duration-200"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.02))",
                  }}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div className="h-7 w-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium mb-1 text-red-700 dark:text-red-300">
                        {barrier.barrierName || "Unnamed Barrier"}
                      </h5>
                      {barrier.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <FormattedText text={barrier.notes} />
                        </p>
                      )}
                      {barrier.significance && (
                        <Badge
                          variant="destructive"
                          className="text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        >
                          Significance: {barrier.significance}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Render Overall Difficulty */}
        {barrierData.overallDifficulty && (
          <div className="p-3 rounded-lg border border-red-200 dark:border-red-700 bg-red-50/50 dark:bg-red-900/20 flex items-center justify-between">
            <h5 className="text-sm font-medium text-red-700 dark:text-red-300">
              Overall Entry Difficulty (UK):
            </h5>
            <Badge
              variant="destructive"
              className="text-sm bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
            >
              {barrierData.overallDifficulty}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  const renderPenetration = (penData) => {
    if (
      !penData ||
      (!penData.primaryStrategy &&
        !penData.keyActions &&
        !penData.estimatedInvestmentLevel &&
        !penData.expectedOutcome)
    )
      return null;

    // Prepare data for RenderSimpleKVP, mapping prompt keys to display labels
    const penetrationDetails = {
      ...(penData.primaryStrategy && {
        "Primary Strategy (UK)": penData.primaryStrategy,
      }),
      ...(penData.keyActions && {
        "Key Actions (Next 6-12 Months)": penData.keyActions,
      }), // Assuming keyActions is a string list, RenderSimpleKVP might handle it okay, or needs FormattedText
      ...(penData.estimatedInvestmentLevel && {
        "Estimated Investment Level": penData.estimatedInvestmentLevel,
      }),
      ...(penData.expectedOutcome && {
        "Expected Outcome": penData.expectedOutcome,
      }),
    };

    return (
      <div className="space-y-4">
        {Object.keys(penetrationDetails).length > 0 && (
          <div className="p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/10">
            {/* Use RenderSimpleKVP for a structured display */}
            <RenderSimpleKVP data={penetrationDetails} />
          </div>
        )}
        {/* Removed the old 'strategies' array rendering as it doesn't match the prompt */}
      </div>
    );
  };

  // --- End Custom Renderers ---

  return (
    <Card className="w-full shadow-sm border bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Market Potential & Analysis
        </CardTitle>
        <CardDescription>
          Comprehensive analysis of market potential, segmentation, trends, and
          regulatory landscape for business growth.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {hasData ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-8" // Increased spacing between sections
          >
            {/* Enhanced Insight Banner */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/60 dark:from-indigo-900/20 dark:to-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-lg p-5 mb-6">
              <div className="flex gap-4">
                <div className="mt-0.5">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-indigo-700 dark:text-indigo-300 text-lg">
                    Market Potential Insights
                  </h4>
                  <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80">
                    This section provides detailed analysis of your market
                    potential, customer segments, and growth opportunities.
                    These insights help identify untapped markets and develop
                    targeted strategies for UK business growth.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-start gap-2 p-2 bg-white/80 dark:bg-gray-800/40 rounded-md">
                      <TrendingUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                      <p className="text-indigo-700/80 dark:text-indigo-300/80">
                        Identify highest growth segments
                      </p>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-white/80 dark:bg-gray-800/40 rounded-md">
                      <Users className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                      <p className="text-indigo-700/80 dark:text-indigo-300/80">
                        Target ideal customer profiles
                      </p>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-white/80 dark:bg-gray-800/40 rounded-md">
                      <Layers className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                      <p className="text-indigo-700/80 dark:text-indigo-300/80">
                        Assess competitive landscape
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Render enhanced sections using our helper */}
            <div className="space-y-8">
              {renderSubSection(data.keyTakeaways, "Key Takeaways", Star)}
              {renderSubSection(
                data.marketSizeGrowth,
                "Market Size & Growth",
                TrendingUp
              )}
              {renderSubSection(
                data.customerSegmentation,
                "Customer Segmentation",
                Users,
                renderCustomerSegmentation
              )}
              {renderSubSection(
                data.marketTrends,
                "Market Trends Analysis",
                LineChart,
                renderMarketTrends
              )}
              {renderSubSection(
                data.regulatoryEnvironment,
                "Regulatory Environment",
                Gavel,
                renderRegulations
              )}
              {renderSubSection(
                data.barriersToEntry,
                "Barriers to Entry",
                Lock,
                renderBarriers
              )}
              {renderSubSection(
                data.marketPenetration,
                "Market Penetration",
                Percent,
                renderPenetration
              )}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-800/30">
            <BarChart3 className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600 mb-2" />
            <h4 className="font-medium text-gray-700 dark:text-gray-300">
              No Market Potential Data Available
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
              We couldn't generate market potential data. This might be because
              we need more information about your industry or business sector.
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

export default MarketPotentialSection;
