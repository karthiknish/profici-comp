import React from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react"; // Removed Download icon and Button import
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
  RenderSimpleKVP,
} from "@/components/ui/JsonRenderHelpers";
import { Badge } from "@/components/ui/badge"; // Import Badge
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp as QualityIcon,
} from "lucide-react"; // Icons for quality

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const BacklinkProfileSection = ({ sectionData, customIndex }) => {
  if (!sectionData) return null;
  const title = "Backlink Profile"; // Removed (UK)
  const domain = sectionData.domain || "domain"; // Get domain for filename

  // Prepare data for nested tables/lists
  const metricsTable = sectionData.metricsSummary
    ? {
        headers: ["Metric", "Value", "Industry Avg", "Comparison"], // Removed UK
        rows: sectionData.metricsSummary.map((m) => [
          m.metric,
          m.value,
          m.ukIndustryAvg, // Keep data key as is
          m.comparison,
        ]),
      }
    : null;
  const referringDomainsTable = sectionData.topReferringDomainsUK
    ? {
        headers: ["Domain", "DA Est.", "Link Value (Est.)"],
        rows: sectionData.topReferringDomainsUK.map((d) => [
          d.domain,
          d.daEstimate,
          d.linkValueEstimate,
        ]),
      }
    : null;
  const anchorTextList = sectionData.anchorTextDistributionUK;
  const qualitySummary = sectionData.qualitySummary; // Extract quality summary

  // Removed duplicate declaration of anchorTextList

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <LinkIcon className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {sectionData.description && (
            <CardDescription>{sectionData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* Render Metrics Summary Table */}
          {metricsTable && (
            <JsonTable data={metricsTable} title="Metrics Summary" />
          )}

          {/* Render Top Referring Domains Table */}
          {referringDomainsTable && (
            <div className="mt-4 pt-4 border-t border-dashed">
              {" "}
              {/* Added dashed border */}
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                {" "}
                {/* Adjusted heading style */}
                Top Referring Domains
              </h4>
              <JsonTable data={referringDomainsTable} />
            </div>
          )}

          {/* Render Anchor Text Distribution */}
          {anchorTextList && anchorTextList.length > 0 && (
            <div className="mt-4 pt-4 border-t border-dashed">
              {" "}
              {/* Added dashed border */}
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                {" "}
                {/* Adjusted heading style */}
                Anchor Text Distribution (Top Types)
              </h4>
              <div className="p-3 rounded-md bg-muted/50">
                {" "}
                {/* Added background */}
                {/* Custom rendering or JsonList if structure matches */}
                <JsonList
                  items={anchorTextList.map(
                    (a) => `${a.type}: ${a.percentEstimate}`
                  )}
                />
              </div>
            </div>
          )}

          {/* Render Backlink Quality Summary */}
          {qualitySummary && (
            <div className="mt-4 pt-4 border-t border-dashed">
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                <QualityIcon className="mr-2 h-4 w-4 text-primary" /> Backlink
                Quality Profile (Estimated)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs p-3 rounded-md bg-muted/50">
                <div>
                  <p className="font-semibold text-green-600">
                    {qualitySummary.highQualityCount ?? 0}
                  </p>
                  <p className="text-muted-foreground">High</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-600">
                    {qualitySummary.mediumQualityCount ?? 0}
                  </p>
                  <p className="text-muted-foreground">Medium</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-600">
                    {qualitySummary.lowQualityCount ?? 0}
                  </p>
                  <p className="text-muted-foreground">Low</p>
                </div>
                <div>
                  <p className="font-semibold text-red-600">
                    {qualitySummary.spammyCount ?? 0}
                  </p>
                  <p className="text-muted-foreground">Spammy</p>
                </div>
              </div>
              {qualitySummary.notes && (
                <p className="text-xs italic text-muted-foreground mt-2">
                  {qualitySummary.notes}
                </p>
              )}
            </div>
          )}

          {/* Render other simple KVP */}
          <RenderSimpleKVP
            data={sectionData}
            skipKeys={[
              "title",
              "description",
              "relevanceFocus", // Already implied by title
              "metricsSummary",
              "topReferringDomainsUK",
              "anchorTextDistributionUK",
              "qualitySummary", // Skip the quality object itself
            ]}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BacklinkProfileSection;
