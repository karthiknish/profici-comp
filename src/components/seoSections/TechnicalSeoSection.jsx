"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Lock,
  FileCode,
  FileText,
  Network,
  Binary,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Import Badge
import {
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

// Helper to render status items
const StatusItem = ({ label, status, icon: Icon }) => {
  const isPositive =
    status?.toLowerCase() === "ok" ||
    status?.toLowerCase() === "found" ||
    status?.toLowerCase() === "valid" ||
    status?.toLowerCase() === "yes";
  const isNegative =
    status?.toLowerCase() === "missing" ||
    status?.toLowerCase() === "errors" ||
    status?.toLowerCase() === "no" ||
    status?.toLowerCase() === "invalid";
  const StatusIcon = isPositive
    ? CheckCircle2
    : isNegative
    ? XCircle
    : AlertTriangle;
  const iconColor = isPositive
    ? "text-green-600"
    : isNegative
    ? "text-red-600"
    : "text-yellow-600";

  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
      <span className="flex items-center text-sm font-medium">
        <Icon className="mr-2 h-4 w-4 text-primary" /> {label}
      </span>
      <span className={`flex items-center text-xs font-semibold ${iconColor}`}>
        <StatusIcon className={`mr-1 h-3.5 w-3.5 ${iconColor}`} />
        {status || "N/A"}
      </span>
    </div>
  );
};

// Helper to render top issues list
const RenderIssuesList = ({ issues }) => {
  if (!Array.isArray(issues) || issues.length === 0) return null;

  const getSeverityBadgeVariant = (severity) => {
    const lowerSeverity = severity?.toLowerCase();
    if (lowerSeverity === "high") return "destructive";
    if (lowerSeverity === "medium") return "secondary"; // Or 'warning' if you add that variant
    if (lowerSeverity === "low") return "outline";
    return "outline";
  };

  return (
    <div className="space-y-3">
      {issues.map((issue, index) => (
        <div key={index} className="p-3 border rounded-md bg-muted/50 text-sm">
          <div className="flex justify-between items-start mb-1">
            <strong className="font-medium flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
              {issue.issueType || "Issue"}
              {issue.countEst && ` (${issue.countEst})`}
            </strong>
            {issue.severity && (
              <Badge
                variant={getSeverityBadgeVariant(issue.severity)}
                className="text-xs"
              >
                {issue.severity}
              </Badge>
            )}
          </div>
          {issue.recommendation && (
            <p className="text-muted-foreground text-xs pl-6">
              <FormattedText text={issue.recommendation} />
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

const TechnicalSeoSection = ({ sectionData, customIndex }) => {
  if (!sectionData) return null;
  const title = sectionData.title || "Technical SEO"; // Removed (UK)

  // Extract specific fields
  const {
    httpsStatus,
    xmlSitemapStatus,
    robotsTxtStatus,
    structuredDataSummary,
    schemaTypesFound, // Extract the new field
    crawlabilityStatus,
    topIssues,
    description, // Keep description
    ...otherData // Collect remaining fields
  } = sectionData;

  // Filter out keys we've explicitly handled from otherData
  const remainingKeys = Object.keys(otherData).filter(
    (key) =>
      ![
        "title",
        "description",
        "httpsStatus",
        "xmlSitemapStatus",
        "robotsTxtStatus",
        "structuredDataSummary",
        "schemaTypesFound", // Add to skip list
        "crawlabilityStatus",
        "topIssues",
      ].includes(key)
  );
  const remainingSimpleData = remainingKeys.reduce((acc, key) => {
    // Only include simple types (string, number, boolean) for RenderSimpleKVP
    if (typeof otherData[key] !== "object" || otherData[key] === null) {
      acc[key] = otherData[key];
    }
    return acc;
  }, {});

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Code className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* Grid for Status Checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {httpsStatus && (
              <StatusItem
                label="HTTPS Status"
                status={httpsStatus}
                icon={Lock}
              />
            )}
            {xmlSitemapStatus && (
              <StatusItem
                label="XML Sitemap"
                status={xmlSitemapStatus}
                icon={FileCode}
              />
            )}
            {robotsTxtStatus && (
              <StatusItem
                label="Robots.txt"
                status={robotsTxtStatus}
                icon={FileText}
              />
            )}
          </div>

          {/* Other Key Points */}
          {crawlabilityStatus && (
            <div className="pt-3 border-t">
              <h4 className="font-medium mb-1 flex items-center">
                <Network className="mr-2 h-4 w-4 text-primary" /> Crawlability
              </h4>
              <FormattedText text={crawlabilityStatus} />
            </div>
          )}
          {structuredDataSummary && (
            <div className="pt-3 border-t">
              <h4 className="font-medium mb-1 flex items-center">
                <Binary className="mr-2 h-4 w-4 text-primary" /> Structured Data
                Summary
              </h4>
              <FormattedText text={structuredDataSummary} />
              {/* Display Schema Types Found */}
              {Array.isArray(schemaTypesFound) &&
                schemaTypesFound.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Types Found:{" "}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {schemaTypesFound.map((type, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Render Top Issues List */}
          {topIssues && topIssues.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2 text-base">Top Issues Found</h4>
              <RenderIssuesList issues={topIssues} />
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

export default TechnicalSeoSection;
