import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
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
} from "@/components/ui/JsonRenderHelpers"; // Import RenderSimpleKVP from helpers

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const EcommerceSeoSection = ({ sectionData, customIndex }) => {
  // Note: The parent component already checks for applicability
  if (!sectionData || !sectionData.applicable) return null; // Also check applicability here just in case
  const title = "E-commerce SEO"; // Removed (UK)

  // Prepare data for nested table
  const summaryTable = Array.isArray(sectionData.summary)
    ? {
        headers: ["Metric", "Score/Status", "Notes"],
        rows: sectionData.summary.map((s) => [
          s.metric,
          s.scoreOrStatus,
          s.notes,
        ]),
      }
    : null;

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {sectionData.description && (
            <CardDescription>{sectionData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* Render Summary Table */}
          {summaryTable ? (
            <div className="p-3 rounded-md bg-muted/50 border">
              {" "}
              {/* Added border and background */}
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Summary
              </h4>
              <JsonTable data={summaryTable} /> {/* Removed title prop */}
            </div>
          ) : (
            // Handle case where summary might be the "N/A" string
            typeof sectionData.summary === "string" && (
              <p>{sectionData.summary}</p>
            )
          )}

          {/* Render other simple KVP */}
          <RenderSimpleKVP
            data={sectionData}
            skipKeys={[
              "title",
              "description",
              "applicable", // Already checked
              "summary",
            ]}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EcommerceSeoSection;
