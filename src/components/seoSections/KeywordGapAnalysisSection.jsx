import React from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react"; // Removed Download icon and Button import
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  JsonTable,
  FormattedText,
  RenderSimpleKVP,
} from "@/components/ui/JsonRenderHelpers";
// Removed CSV export utility import

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const KeywordGapAnalysisSection = ({ sectionData, customIndex }) => {
  if (!sectionData) return null;
  const title = "Keyword Gap Analysis"; // Removed (UK)
  const domain = sectionData.domain || "domain"; // Get domain for filename

  // Prepare data for nested table
  const opportunitiesTable = sectionData.topOpportunities
    ? {
        headers: [
          "Keyword", // Removed (UK)
          "Volume", // Removed (UK)
          "Difficulty Est.",
          "Relevance",
          "Potential",
        ],
        rows: sectionData.topOpportunities.map((o) => [
          o.keyword,
          o.volumeUK, // Keep data key as is, just change header text
          o.difficultyEst,
          o.relevance,
          o.potential,
        ]),
      }
    : null;

  // Define headers for CSV export
  const opportunityHeaders = [
    "Keyword", // Removed (UK)
    "Volume", // Removed (UK)
    "Difficulty Est.",
    "Relevance",
    "Potential",
  ];
  // Removed dangling null; from opportunitiesTable definition

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {sectionData.description && (
            <CardDescription>{sectionData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* Render Top Opportunities Table */}
          {opportunitiesTable && (
            <JsonTable data={opportunitiesTable} title="Top Opportunities" />
          )}

          {/* Render other simple KVP */}
          <RenderSimpleKVP
            data={sectionData}
            skipKeys={[
              "title",
              "description",
              "focus", // Already implied
              "topOpportunities",
            ]}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KeywordGapAnalysisSection;
