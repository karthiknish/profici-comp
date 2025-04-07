import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
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
  JsonList,
  RenderSimpleKVP, // Import RenderSimpleKVP from helpers
} from "@/components/ui/JsonRenderHelpers";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const ContentAnalysisSection = ({ sectionData, customIndex }) => {
  if (!sectionData) return null;
  const title = "Content Analysis"; // Removed (UK)

  // Prepare data for nested table/list
  const summaryTable = sectionData.summary
    ? {
        // Headers remain the same as readability is just another metric row
        headers: ["Metric", "Score/Value", "Notes"],
        rows: sectionData.summary.map((s) => [
          s.metric,
          s.scoreOrValue, // This will now include the readability score/value
          s.notes,
        ]),
      }
    : null;
  const topContentTable = sectionData.topContentPiecesUK
    ? {
        headers: ["URL", "Key Metric", "Value"],
        rows: sectionData.topContentPiecesUK.map((p) => [
          p.url,
          p.keyMetric,
          p.value,
        ]),
      }
    : null;

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {sectionData.description && (
            <CardDescription>{sectionData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* Render Summary Table */}
          {summaryTable && <JsonTable data={summaryTable} title="Summary" />}

          {/* Render Top Content Table */}
          {topContentTable && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">
                Top Content Pieces (Traffic/Engagement)
              </h4>
              <JsonTable data={topContentTable} />
            </div>
          )}

          {/* Render other simple KVP */}
          <RenderSimpleKVP
            data={sectionData}
            skipKeys={[
              "title",
              "description",
              "relevanceFocus", // Already implied
              "summary",
              "topContentPiecesUK",
            ]}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentAnalysisSection;
