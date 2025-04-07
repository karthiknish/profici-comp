import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Star,
  ThumbsUp,
  ThumbsDown,
  Target,
  Info,
  Medal,
} from "lucide-react"; // Added icons
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  JsonList,
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

const ExecutiveSummarySection = ({ sectionData, customIndex }) => {
  if (!sectionData) return null;
  const title = sectionData.title || "Executive Summary"; // Removed (UK)

  // Extract specific fields for custom rendering
  const {
    seoHealthScoreUK,
    competitivePosition,
    competitorComparison,
    topStrengthsUK,
    topWeaknessesUK,
    priorityRecommendationsUK,
    description,
    ...otherData
  } = sectionData;

  // Filter out handled keys from otherData
  const remainingKeys = Object.keys(otherData).filter(
    (key) =>
      ![
        "title",
        "description",
        "seoHealthScoreUK",
        "competitivePosition",
        "competitorComparison",
        "topStrengthsUK",
        "topWeaknessesUK",
        "priorityRecommendationsUK",
      ].includes(key)
  );
  const remainingSimpleData = remainingKeys.reduce((acc, key) => {
    if (typeof otherData[key] !== "object" || otherData[key] === null) {
      acc[key] = otherData[key];
    }
    return acc;
  }, {});

  return (
    // Make this card span full width in the parent grid
    <motion.div
      variants={itemVariants}
      custom={customIndex}
      className="lg:col-span-2"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Star className="mr-2 h-5 w-5 text-primary" /> {/* Changed Icon */}
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* SEO Health Score */}
          {seoHealthScoreUK && (
            <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <h4 className="font-medium mb-1 text-blue-800 dark:text-blue-300">
                SEO Health Score
              </h4>
              <p className="text-lg font-bold text-blue-900 dark:text-blue-200">
                <FormattedText
                  text={seoHealthScoreUK.match(/\d+/)?.[0] || seoHealthScoreUK}
                />{" "}
                / 100
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <FormattedText
                  text={seoHealthScoreUK
                    .replace(/\d+/, "")
                    .replace("()", "")
                    .trim()}
                />
              </p>
            </div>
          )}

          {/* Competitive Position */}
          {competitivePosition && (
            <div className="pt-3 border-t">
              <h4 className="font-medium mb-1 flex items-center">
                <Medal className="mr-2 h-4 w-4 text-primary" /> Competitive
                Position
              </h4>
              <FormattedText text={competitivePosition} />
            </div>
          )}

          {/* Competitor Comparison */}
          {competitorComparison && (
            <div className="pt-3 border-t">
              <h4 className="font-medium mb-1 flex items-center">
                <Info className="mr-2 h-4 w-4 text-primary" /> Competitor
                Comparison
              </h4>
              <blockquote className="mt-1 border-l-2 pl-4 italic text-muted-foreground">
                <FormattedText text={competitorComparison} />
              </blockquote>
            </div>
          )}

          {/* Strengths */}
          {Array.isArray(topStrengthsUK) && topStrengthsUK.length > 0 && (
            <div className="pt-3 border-t">
              <strong className="font-semibold text-green-800 dark:text-green-300 flex items-center mb-1">
                <ThumbsUp className="mr-2 h-4 w-4" /> Strengths:
              </strong>
              <JsonList
                items={topStrengthsUK}
                bullet="✅" // Use icon bullet
                className="list-none pl-5 space-y-1 text-sm text-green-700 dark:text-green-400"
              />
            </div>
          )}

          {/* Weaknesses */}
          {Array.isArray(topWeaknessesUK) && topWeaknessesUK.length > 0 && (
            <div className="pt-3 border-t">
              <strong className="font-semibold text-red-800 dark:text-red-300 flex items-center mb-1">
                <ThumbsDown className="mr-2 h-4 w-4" /> Weaknesses:
              </strong>
              <JsonList
                items={topWeaknessesUK}
                bullet="❌" // Use icon bullet
                className="list-none pl-5 space-y-1 text-sm text-red-700 dark:text-red-400"
              />
            </div>
          )}

          {/* Recommendations */}
          {Array.isArray(priorityRecommendationsUK) &&
            priorityRecommendationsUK.length > 0 && (
              <div className="pt-3 border-t">
                <strong className="font-medium flex items-center mb-1">
                  <Target className="mr-2 h-4 w-4 text-primary" /> Priority
                  Recommendations:
                </strong>
                {/* Log the raw data for debugging */}
                {console.log(
                  "priorityRecommendationsUK data:",
                  priorityRecommendationsUK
                )}
                {/* Map recommendation objects safely */}
                <JsonList
                  items={priorityRecommendationsUK
                    // Filter out invalid items and map safely
                    .filter(
                      (rec) => rec && typeof rec === "object" && rec.action
                    )
                    .map(
                      (rec) =>
                        `${rec.action}${
                          // Access action safely
                          rec.impactPercent
                            ? ` (Impact: ${rec.impactPercent}%)`
                            : "" // Access impactPercent safely
                        }`
                    )}
                  bullet="🎯"
                  className="list-none pl-5 space-y-1 text-sm"
                />
              </div>
            )}

          {/* Render other simple Key-Value pairs */}
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

export default ExecutiveSummarySection;
