import React from "react";
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
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

const PageSpeedMobileSection = ({ sectionData, customIndex }) => {
  if (!sectionData) return null;
  const title = "Page Speed & Mobile"; // Removed (UK)

  // Prepare data for nested table/list
  const summaryTable = sectionData.summary
    ? {
        headers: ["Metric", "Desktop Value", "Mobile Value", "Rating (Mobile)"],
        rows: sectionData.summary.map((s) => [
          s.metric,
          s.desktopValue,
          s.mobileValue,
          s.mobileRating,
        ]),
      }
    : null;
  const issuesList = sectionData.topSpeedIssuesUK;

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Smartphone className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {sectionData.description && (
            <CardDescription>{sectionData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* Render Core Web Vitals Summary Grid */}
          {sectionData.summary && Array.isArray(sectionData.summary) && (
            <div>
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Core Web Vitals Summary
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {sectionData.summary.map((metric, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-muted/50 flex flex-col justify-between"
                  >
                    <p className="font-medium text-xs text-muted-foreground">
                      {metric.metric}
                    </p>
                    <div className="mt-1">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {metric.mobileValue}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          (Mobile)
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Desktop: {metric.desktopValue}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          metric.mobileRating === "Good"
                            ? "text-green-600"
                            : metric.mobileRating === "Needs Improvement"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {metric.mobileRating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render Top Issues List */}
          {issuesList && issuesList.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dashed">
              {" "}
              {/* Added dashed border */}
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                {" "}
                {/* Adjusted heading style */}
                Top Speed Issues
              </h4>
              <div className="p-3 rounded-md bg-muted/50">
                {" "}
                {/* Added background */}
                <JsonList items={issuesList} />
              </div>
            </div>
          )}

          {/* Render other simple KVP */}
          <RenderSimpleKVP
            data={sectionData}
            skipKeys={[
              "title",
              "description",
              "coreWebVitalsContext", // Already implied
              "summary",
              "topSpeedIssuesUK",
            ]}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PageSpeedMobileSection;
