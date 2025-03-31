"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import Table components
import {
  TrendingUp,
  MapPin,
  Zap,
  LineChart as LineChartIcon,
  Sparkles,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { parseMarkdownTable } from "@/utils/parsing"; // Only need table parser

// Helper function to parse potentially stringified numbers
const parseNumericValue = (value) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;
  const cleanedValue = value.replace(/,/g, "").toLowerCase();
  if (cleanedValue.endsWith("k")) {
    const num = parseFloat(cleanedValue);
    return isNaN(num) ? null : num * 1000;
  }
  if (cleanedValue.endsWith("m")) {
    const num = parseFloat(cleanedValue);
    return isNaN(num) ? null : num * 1000000;
  }
  const num = parseFloat(cleanedValue);
  return isNaN(num) ? null : num;
};

// Helper function to find the actual key name for volume
const findVolumeKey = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return null;
  const firstRow = dataArray[0];
  const keys = Object.keys(firstRow);
  const possibleKeys = ["volume", "searches", "queries"];
  return (
    keys.find((key) =>
      possibleKeys.some((pKey) => key.toLowerCase().includes(pKey))
    ) || null
  );
};

// Helper function to find the actual key name for keyword/query
const findKeywordKey = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return null;
  const firstRow = dataArray[0];
  const keys = Object.keys(firstRow);
  const possibleKeys = ["keyword", "query", "term"];
  return (
    keys.find((key) =>
      possibleKeys.some((pKey) => key.toLowerCase().includes(pKey))
    ) || null
  );
};

// Helper to render Markdown tables using Shadcn UI Table
const RenderMarkdownTable = ({ tableData }) => {
  if (!tableData || tableData.length === 0) return null;
  const headers = Object.keys(tableData[0]);
  return (
    <div className="overflow-x-auto rounded-lg border">
      {" "}
      {/* Added border and rounded */}
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              {headers.map((header, cellIndex) => (
                <TableCell key={cellIndex} className="break-words">
                  {" "}
                  {/* Keep break-words */}
                  <ReactMarkdown
                    className="prose-sm dark:prose-invert max-w-none"
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {row[header]}
                  </ReactMarkdown>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const SearchTrendsSection = ({ data }) => {
  if (!data) {
    return null;
  }

  // Attempt to parse tables based on example output headers
  const volumeTableData = parseMarkdownTable(data, "Volume Trends");
  const risingTableData = parseMarkdownTable(data, "Rising Queries");
  const geoTableData = parseMarkdownTable(data, "Geographic Interest");

  // Find keys for the chart (still useful for potential chart rendering)
  const volumeKey = findVolumeKey(volumeTableData);
  const keywordKey = findKeywordKey(volumeTableData);

  // Process data for chart
  const chartData =
    volumeTableData
      ?.map((item) => ({
        ...item,
        [volumeKey]: parseNumericValue(item[volumeKey]),
      }))
      .filter((item) => item[volumeKey] !== null) || [];

  const isChartDataValid = chartData.length > 0 && volumeKey && keywordKey;

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  // Determine if we should show the raw markdown fallback
  const showFallback = !volumeTableData && !risingTableData && !geoTableData;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" /> Estimated Search Trends
        </CardTitle>
        <CardDescription>
          AI-generated estimates of search volume, rising queries, and
          geographic interest (UK Focus).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showFallback ? (
          <div className="prose dark:prose-invert max-w-none text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {data}
            </ReactMarkdown>
          </div>
        ) : (
          <>
            {/* Volume Trends - Show Table Primarily */}
            {volumeTableData && (
              <motion.div variants={itemVariants} custom={0}>
                {/* Enhanced Heading Style */}
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <LineChartIcon className="mr-2 h-5 w-5 text-primary" />
                  Estimated Search Volume Trends (UK - Last 12 Months)
                </h3>
                <RenderMarkdownTable tableData={volumeTableData} />
                {/* Optional: Keep chart as secondary visualization if valid */}
                {isChartDataValid && (
                  <div className="h-[200px] w-full text-xs mt-4 bg-muted/30 dark:bg-muted/10 p-2 rounded-lg border">
                    <ResponsiveContainer>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
                      >
                        <defs>
                          <linearGradient
                            id="chartGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          vertical={false}
                        />
                        <XAxis
                          dataKey={keywordKey}
                          tick={{ fill: "hsl(var(--muted-foreground))" }}
                          stroke="hsl(var(--border))"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "hsl(var(--muted-foreground))" }}
                          stroke="hsl(var(--border))"
                          axisLine={false}
                          tickLine={false}
                          width={30}
                        />
                        <Tooltip
                          cursor={{ fill: "hsl(var(--accent))", opacity: 0.2 }}
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--popover-foreground))",
                            borderRadius: "var(--radius)",
                            boxShadow:
                              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                            padding: "8px 12px",
                          }}
                          labelStyle={{
                            marginBottom: "4px",
                            fontWeight: "600",
                          }}
                          itemStyle={{
                            paddingTop: "2px",
                            paddingBottom: "2px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey={volumeKey}
                          stroke={false}
                          fillOpacity={1}
                          fill="url(#chartGradient)"
                        />
                        <Line
                          type="monotone"
                          dataKey={volumeKey}
                          stroke="hsl(var(--primary))"
                          strokeWidth={2.5}
                          name="Avg. Volume"
                          dot={false}
                          activeDot={{
                            r: 5,
                            strokeWidth: 1,
                            fill: "hsl(var(--background))",
                            stroke: "hsl(var(--primary))",
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>
            )}

            {/* Rising Queries - Show Table */}
            {risingTableData && (
              <motion.div
                variants={itemVariants}
                custom={1}
                className="mt-6 pt-6 border-t"
              >
                {/* Enhanced Heading Style */}
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                  Related Rising Queries (UK - Breakout/Top)
                </h3>
                <RenderMarkdownTable tableData={risingTableData} />
              </motion.div>
            )}

            {/* Geographic Interest - Show Table */}
            {geoTableData && (
              <motion.div
                variants={itemVariants}
                custom={2}
                className="mt-6 pt-6 border-t"
              >
                {/* Enhanced Heading Style */}
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-blue-500" />
                  Geographic Interest (Top 3 UK Regions/Cities)
                </h3>
                <RenderMarkdownTable tableData={geoTableData} />
              </motion.div>
            )}

            <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border">
              *Trend data is estimated by AI based on general knowledge and may
              not reflect real-time Google Trends data.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchTrendsSection;
