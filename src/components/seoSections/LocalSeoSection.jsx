"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ListChecks, Users } from "lucide-react"; // Adjusted icons
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KeyMetricHighlight from "@/components/KeyMetricHighlight"; // Keep for potential use
import {
  JsonTable, // Keep JsonTable
  FormattedText,
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

// Removed RenderSummaryItem helper

const LocalSeoSection = ({ sectionData, customIndex }) => {
  // Note: The parent component already checks for applicability
  if (!sectionData) return null;
  const title = sectionData.title || "Local SEO"; // Removed (UK)

  // Extract data based on the *actual* structure from the prompt
  const {
    summary, // This is the main array of metrics
    localSeoVsCompetitorsUK,
    description,
    ...otherData
  } = sectionData;

  // Filter out handled keys from otherData
  const remainingKeys = Object.keys(otherData).filter(
    (key) =>
      ![
        "title",
        "description",
        "applicable",
        "summary",
        "localSeoVsCompetitorsUK",
      ].includes(key)
  );
  const remainingSimpleData = remainingKeys.reduce((acc, key) => {
    if (typeof otherData[key] !== "object" || otherData[key] === null) {
      acc[key] = otherData[key];
    }
    return acc;
  }, {});

  const hasSummaryData = Array.isArray(summary) && summary.length > 0;

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* Render Summary Table */}
          {hasSummaryData ? (
            <div className="pt-3">
              <h4 className="font-medium mb-2">Summary</h4>
              {/* Convert summary array to the structure JsonTable expects */}
              <JsonTable
                data={{
                  headers: ["Metric", "Score/Value", "Notes"],
                  rows: summary.map((item) => ({
                    // Map array to objects with matching keys
                    Metric: item.metric,
                    "Score/Value": item.scoreOrValue,
                    Notes: item.notes,
                  })),
                }}
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No local SEO summary data available.
            </p>
          )}

          {/* Local SEO vs Competitors */}
          {localSeoVsCompetitorsUK && (
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4 text-primary" /> Local SEO vs
                Competitors
              </h4>
              <FormattedText text={localSeoVsCompetitorsUK} />
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

export default LocalSeoSection;
