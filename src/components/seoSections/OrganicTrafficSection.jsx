"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
} from "lucide-react"; // Added more icons
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import KeyMetricHighlight from "@/components/KeyMetricHighlight";
import { Badge } from "@/components/ui/badge"; // Import Badge
import {
  FormattedText,
  JsonList,
  JsonTable, // Keep JsonTable for landing/exit pages
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

// Helper to render metrics summary
const RenderMetricsSummary = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((item, index) => (
        <KeyMetricHighlight
          key={index}
          label={item.metric || `Metric ${index + 1}`}
          value={item.value || "N/A"}
          // Optionally add comparison/benchmark if needed and style accordingly
          // description={`Benchmark: ${item.ukIndustryBenchmark || 'N/A'} | Comparison: ${item.comparison || 'N/A'}`}
          isTextValue={true} // Treat most values as text initially
          className="sm:col-span-1"
        />
      ))}
    </div>
  );
};

// Helper to render device breakdown
const RenderDeviceBreakdown = ({ data }) => {
  if (!data) return null;
  const devices = [
    { key: "desktopPercent", label: "Desktop", icon: Monitor },
    { key: "mobilePercent", label: "Mobile", icon: Smartphone },
    { key: "tabletPercent", label: "Tablet", icon: Tablet },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {devices.map((device) => {
        const value = parseFloat(data[device.key]);
        return (
          <div
            key={device.key}
            className="p-3 border rounded-md bg-muted/30 text-center"
          >
            <device.icon className="mx-auto h-5 w-5 mb-1 text-primary" />
            <div className="text-xs uppercase text-muted-foreground mb-1">
              {device.label}
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

const OrganicTrafficSection = ({ sectionData, customIndex }) => {
  if (!sectionData) return null;
  const title = sectionData.title || "Organic Traffic"; // Removed (UK)

  // Extract data based on the *actual* structure from the prompt
  const {
    metricsSummary,
    topLandingPagesUK,
    topExitPagesUK,
    deviceBreakdownUK,
    geographicDistributionUK,
    trafficVsCompetitorsUK,
    description,
    ...otherData // Capture remaining data
  } = sectionData;

  // Filter out handled keys from otherData
  const remainingKeys = Object.keys(otherData).filter(
    (key) =>
      ![
        "title",
        "description",
        "metricsSummary",
        "topLandingPagesUK",
        "topExitPagesUK",
        "deviceBreakdownUK",
        "geographicDistributionUK",
        "trafficVsCompetitorsUK",
      ].includes(key)
  );
  const remainingSimpleData = remainingKeys.reduce((acc, key) => {
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
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          {/* Metrics Summary */}
          {metricsSummary && (
            <div className="pt-3">
              <h4 className="font-medium mb-2">Key Metrics Summary</h4>
              <RenderMetricsSummary data={metricsSummary} />
            </div>
          )}

          {/* Device Breakdown */}
          {deviceBreakdownUK && (
            <div className="pt-3 border-t mt-4">
              <h4 className="font-medium mb-2">Device Breakdown</h4>
              <RenderDeviceBreakdown data={deviceBreakdownUK} />
            </div>
          )}

          {/* Top Landing Pages */}
          {topLandingPagesUK && topLandingPagesUK.length > 0 && (
            <div className="pt-3 border-t mt-4">
              <h4 className="font-medium mb-2">Top Landing Pages (Est.)</h4>
              <JsonTable
                data={{
                  headers: [
                    "URL",
                    "Traffic %",
                    "Bounce Rate Est.",
                    "Conversion Est.",
                  ],
                  rows: topLandingPagesUK,
                }}
              />
            </div>
          )}

          {/* Top Exit Pages */}
          {topExitPagesUK && topExitPagesUK.length > 0 && (
            <div className="pt-3 border-t mt-4">
              <h4 className="font-medium mb-2">Top Exit Pages (Est.)</h4>
              <JsonTable
                data={{ headers: ["URL", "Exit %"], rows: topExitPagesUK }}
              />
            </div>
          )}

          {/* Geographic Distribution */}
          {Array.isArray(geographicDistributionUK) &&
            geographicDistributionUK.length > 0 && (
              <div className="pt-3 border-t mt-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-primary" /> Geographic
                  Distribution (Est.)
                </h4>
                <JsonList
                  items={geographicDistributionUK.map(
                    (geo) => `${geo.regionOrCity}: ${geo.percent}%`
                  )}
                  className="list-none pl-0 space-y-1"
                />
              </div>
            )}

          {/* Traffic vs Competitors */}
          {trafficVsCompetitorsUK && (
            <div className="pt-3 border-t mt-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4 text-primary" /> Traffic vs
                Competitors
              </h4>
              <FormattedText text={trafficVsCompetitorsUK} />
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

export default OrganicTrafficSection;
