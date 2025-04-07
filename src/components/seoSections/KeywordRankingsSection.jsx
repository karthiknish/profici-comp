"use client";

import React from "react";
import { motion } from "framer-motion";
import { Key, PieChart, Users, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  JsonTable,
  FormattedText,
  JsonList,
  RenderSimpleKVP,
} from "@/components/ui/JsonRenderHelpers";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

// Helper to render distribution summary
const RenderDistributionSummary = ({ data }) => {
  if (!data) return null;
  const positions = [
    { key: "positions1to3", label: "Top 3" },
    { key: "positions4to10", label: "4-10" },
    { key: "positions11to20", label: "11-20" },
    { key: "positions21to50", label: "21-50" },
    { key: "positions51to100", label: "51-100" },
  ];

  const hasValidData = positions.some(
    (pos) =>
      data[pos.key] &&
      (data[pos.key].percentage != null || data[pos.key].momChange != null)
  );
  if (!hasValidData)
    return (
      <p className="text-xs text-muted-foreground italic">
        No distribution summary data available.
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
      {positions.map((pos) => {
        const item = data[pos.key];
        if (!item || (item.percentage == null && item.momChange == null)) {
          return (
            <div
              key={pos.key}
              className="p-3 border rounded-md bg-muted/30 text-center opacity-60"
            >
              <div className="text-xs uppercase text-muted-foreground mb-1">
                Pos {pos.label}
              </div>
              <div className="text-lg font-semibold text-muted-foreground">
                -
              </div>
            </div>
          );
        }

        const percentage = parseFloat(item.percentage);
        const momChange = parseFloat(item.momChange);
        return (
          <div
            key={pos.key}
            className="p-3 border rounded-md bg-muted/30 text-center"
          >
            <div className="text-xs uppercase text-muted-foreground mb-1">
              Pos {pos.label}
            </div>
            <div className="text-lg font-semibold">
              {isNaN(percentage) ? "N/A" : `${percentage.toFixed(1)}%`}
            </div>
            {!isNaN(momChange) && (
              <div
                className={`text-xs font-medium mt-0.5 ${
                  momChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {momChange >= 0 ? "+" : ""}
                {momChange.toFixed(1)}% MoM
              </div>
            )}
            {item.notes && (
              <p className="text-xs italic text-muted-foreground mt-1">
                {item.notes}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper to render intent breakdown
const RenderIntentBreakdown = ({ data }) => {
  if (!data) return null;
  const intents = [
    { key: "informationalPercent", label: "Informational" },
    { key: "navigationalPercent", label: "Navigational" },
    { key: "transactionalPercent", label: "Transactional" },
    { key: "commercialPercent", label: "Commercial" },
  ];
  const hasValidData = intents.some(
    (intent) => data[intent.key] != null && !isNaN(parseFloat(data[intent.key]))
  );
  if (!hasValidData)
    return (
      <p className="text-xs text-muted-foreground italic">
        No intent breakdown data available.
      </p>
    );

  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {intents.map((intent) => {
        const value = parseFloat(data[intent.key]);
        return (
          <div
            key={intent.key}
            className="p-3 border rounded-md bg-muted/30 text-center"
          >
            <div className="text-xs uppercase text-muted-foreground mb-1">
              {intent.label}
            </div>
            <div className="text-lg font-semibold">
              {isNaN(value) ? "N/A" : `${value.toFixed(1)}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const KeywordRankingsSection = ({ sectionData, customIndex }) => {
  // sectionData here is actually results.seoAnalysis.keywordRankingsUK from the parent

  // Destructure the sectionData object safely
  const {
    topKeywords,
    distributionSummaryUK,
    intentBreakdownUK,
    keywordOverlapUK,
    apolloKeywords, // Destructure the new Apollo keywords list
    error, // Check for potential errors passed down
    // Extract title/description from the nested object if they exist there, otherwise use fallback
    title = "Keyword Rankings", // Removed (UK)
    description,
  } = sectionData || {}; // Destructure directly from sectionData

  // Filter out handled keys from the sectionData object for RenderSimpleKVP
  const otherData = { ...sectionData }; // Copy sectionData object
  delete otherData.topKeywords;
  // --- MOVE remainingSimpleData CALCULATION INSIDE ---
  delete otherData.distributionSummaryUK;
  delete otherData.intentBreakdownUK;
  delete otherData.keywordOverlapUK;
  delete otherData.apolloKeywords; // Also remove from remainingSimpleData
  delete otherData.error;
  delete otherData.title;
  delete otherData.description;

  // Correctly calculate remainingSimpleData from the modified otherData object
  const remainingSimpleData = Object.keys(otherData).reduce((acc, key) => {
    // Only include simple types (string, number, boolean) for RenderSimpleKVP
    if (typeof otherData[key] !== "object" || otherData[key] === null) {
      acc[key] = otherData[key];
    }
    return acc;
  }, {});
  // --- END MOVE ---

  // Handle potential error message passed down
  if (error) {
    return (
      <motion.div variants={itemVariants} custom={customIndex}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-destructive">
              <Key className="mr-2 h-5 w-5" />
              {title} - Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive-foreground bg-destructive p-3 rounded-md">
              Failed to generate Keyword Rankings analysis: {error}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Key className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* Keyword Distribution Summary */}
          <div className="pt-3">
            <h4 className="font-medium mb-2">Distribution Summary</h4>
            <RenderDistributionSummary data={distributionSummaryUK} />
          </div>

          {/* Intent Breakdown */}
          <div className="pt-3 border-t mt-4">
            <h4 className="font-medium mb-2 flex items-center">
              <Search className="mr-2 h-4 w-4 text-primary" /> Search Intent
              Breakdown
            </h4>
            <RenderIntentBreakdown data={intentBreakdownUK} />
          </div>

          {/* Top Keywords Table - Add check for Array type */}
          {Array.isArray(topKeywords) && topKeywords.length > 0 ? (
            <div className="pt-3 border-t mt-4">
              <h4 className="font-medium mb-2">Top Keywords</h4>
              <JsonTable
                data={{
                  headers: [
                    "keywordUKFocus",
                    "rankingUK",
                    "searchVolumeUK",
                    "difficultyUK",
                    "opportunityUK",
                    "estimatedTrafficUK",
                  ],
                  rows: topKeywords,
                }}
              />
            </div>
          ) : (
            <div className="pt-3 border-t mt-4">
              <h4 className="font-medium mb-2">Top Keywords</h4>
              <p className="text-xs text-muted-foreground italic">
                No top keyword data available.
              </p>
            </div>
          )}

          {/* Keyword Overlap - Add check for object type and necessary property */}
          {keywordOverlapUK &&
          typeof keywordOverlapUK === "object" &&
          keywordOverlapUK.overlapPercent !== undefined ? (
            <div className="pt-3 border-t mt-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4 text-primary" /> Keyword Overlap
              </h4>
              <p>
                vs. {keywordOverlapUK.competitors || "[Competitors]"}:{" "}
                <strong className="text-lg">
                  {keywordOverlapUK.overlapPercent ?? "N/A"}%
                </strong>{" "}
                overlap estimated.
              </p>
            </div>
          ) : (
            <div className="pt-3 border-t mt-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4 text-primary" /> Keyword Overlap
              </h4>
              <p className="text-xs text-muted-foreground italic">
                No keyword overlap data available.
              </p>
            </div>
          )}

          {/* Display Apollo Keywords List */}
          {Array.isArray(apolloKeywords) && apolloKeywords.length > 0 && (
            <div className="pt-3 border-t mt-4">
              <h4 className="font-medium mb-2">
                Detected Keywords (Source: Apollo)
              </h4>
              <div className="flex flex-wrap gap-1">
                {apolloKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Render other simple KVP as fallback */}
          {Object.keys(remainingSimpleData).length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2 text-base">Other Details</h4>
              <RenderSimpleKVP data={remainingSimpleData} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KeywordRankingsSection;
