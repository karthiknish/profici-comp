"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Remove Table imports if MarkdownTableRenderer handles it
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import { parseMarkdownTable, extractListItems } from "@/utils/parsing";
import StatCard from "@/components/ui/StatCard"; // Import the new component
import {
  ListChecks,
  Scale,
  Target,
  ArrowUpRight,
  TrendingUp,
  DollarSign, // For Investment
  Activity, // For SOM Increase
  Rocket, // For Strategy
  ClipboardList, // For Actions
} from "lucide-react";
// Remove ReactMarkdown imports
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"; // Import new component
import MarkdownTableRenderer from "@/components/ui/MarkdownTableRenderer"; // Import new component

// Remove RenderMarkdownTable definition
/*
const RenderMarkdownTable = ({ tableData }) => { ... };
*/

// Helper to extract content under a specific H2 (##) heading
const extractSectionContent = (markdown, sectionTitle) => {
  if (!markdown || !sectionTitle) return null;
  // Regex to find content under a specific H2 heading until the next H2 or end of string
  const sectionRegex = new RegExp(
    `##\\s*${sectionTitle}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n##|$)`,
    "i"
  );
  const match = markdown.match(sectionRegex);
  // Return the content excluding the title itself, or null if not found
  return match ? match[1].trim() : null;
};

// Helper to extract content under a specific H4 (####) subheading within a larger block
const extractH4Content = (markdownBlock, subheading) => {
  if (!markdownBlock || !subheading) return null;
  // Regex to find content under a specific H4 heading until the next H4 or end of block
  const subheadingPattern = subheading.replace(
    /[-\/\\^$*+?.()|[\]{}]/g,
    "\\$&"
  ); // Escape regex chars
  const regex = new RegExp(
    `####\\s*${subheadingPattern}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n####|$)`,
    "i"
  );
  const match = markdownBlock.match(regex);
  // Return the content (likely bullet points or single line)
  return match ? match[1].trim() : null;
};

const MarketPotentialSection = ({ data }) => {
  // Extract Key Takeaways as a block of text
  const keyTakeawaysContent = extractSectionContent(data, "Key Takeaways");
  // Parse tables
  const marketSizeData = parseMarkdownTable(data, "Market Size and Growth");
  const segmentationData = parseMarkdownTable(data, "Customer Segmentation");
  const trendsData = parseMarkdownTable(data, "Market Trends Analysis");
  const regulatoryData = parseMarkdownTable(
    data,
    "Regulatory Environment Summary"
  );
  const barriersData = parseMarkdownTable(data, "Barriers to Entry Assessment");

  // Extract the whole strategy outline block first
  const strategyOutlineContent = extractSectionContent(
    data,
    "Market Penetration Strategy Outline"
  );

  // Parse specific parts from the strategy outline block
  const primaryStrategy = strategyOutlineContent
    ? extractH4Content(strategyOutlineContent, "Recommended Primary Strategy")
    : null;
  const keyActions = strategyOutlineContent
    ? extractH4Content(strategyOutlineContent, "Key Actions")
    : null;
  const investmentRequired = strategyOutlineContent
    ? extractH4Content(strategyOutlineContent, "Estimated Investment Required")
    : null;
  const expectedSOM = strategyOutlineContent
    ? extractH4Content(strategyOutlineContent, "Expected SOM Increase")
    : null;

  // Parse lists from the extracted H4 content if they are bullet points
  const keyActionsList = keyActions?.startsWith("-")
    ? keyActions.split("\n").map((s) => s.replace(/^- /, "").trim())
    : null;

  let tam,
    sam,
    som,
    yoyGrowth,
    cagr = null;
  if (marketSizeData) {
    // Adjust metric names based on the actual table structure in the prompt
    const findMetricValue = (metricName) =>
      marketSizeData.find((row) => row.Metric === metricName)?.Value;
    tam = findMetricValue("TAM (UK)");
    sam = findMetricValue("SAM (UK)");
    som = findMetricValue("SOM (UK Potential)");
    yoyGrowth = findMetricValue("YoY Growth (UK)");
    cagr = findMetricValue("5-Year CAGR (UK)");
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const showFallback =
    !keyTakeawaysContent &&
    !marketSizeData &&
    !segmentationData &&
    !trendsData &&
    !barriersData &&
    !strategyOutlineContent && // Check if the whole strategy block is missing
    !regulatoryData;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Potential</CardTitle>
        <CardDescription>
          Analysis of market potential and opportunities in the UK market.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showFallback ? (
          <div className="prose dark:prose-invert max-w-none text-sm">
            {/* Use MarkdownRenderer for fallback */}
            <MarkdownRenderer content={data} />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            {/* Render Key Takeaways Content */}
            {keyTakeawaysContent && (
              <motion.div variants={itemVariants} custom={0}>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-primary" />
                  Key Takeaways
                </h3>
                {/* Use MarkdownRenderer */}
                <div className="p-4 border rounded-lg bg-muted/50 mt-2">
                  <MarkdownRenderer content={keyTakeawaysContent} />
                </div>
              </motion.div>
            )}

            {/* Render Market Size Stat Cards (if parsed) */}
            {(tam || sam || som || yoyGrowth || cagr) && (
              <motion.div
                variants={itemVariants}
                custom={1}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t" // Added spacing
              >
                {tam && (
                  <StatCard label="TAM (UK Est.)" value={tam} icon={Scale} />
                )}
                {sam && (
                  <StatCard label="SAM (UK Est.)" value={sam} icon={Target} />
                )}
                {som && (
                  <StatCard
                    label="SOM Potential (UK Est.)"
                    value={som}
                    icon={Target}
                  />
                )}
                {yoyGrowth && (
                  <StatCard
                    label="YoY Growth (UK Est.)"
                    value={yoyGrowth}
                    icon={ArrowUpRight}
                  />
                )}
                {cagr && (
                  <StatCard
                    label="5-Year CAGR (UK Est.)"
                    value={cagr}
                    icon={TrendingUp}
                  />
                )}
              </motion.div>
            )}
            {/* Add spacing for sections after the grid */}
            {segmentationData && (
              <motion.div
                variants={itemVariants}
                custom={2}
                className="mt-6 pt-6 border-t" // Added spacing
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Customer Segmentation (UK)
                </h3>
                {/* Use MarkdownTableRenderer */}
                <MarkdownTableRenderer tableData={segmentationData} />
              </motion.div>
            )}
            {trendsData && (
              <motion.div
                variants={itemVariants}
                custom={3}
                className="mt-6 pt-6 border-t" // Added spacing
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Market Trends (UK)
                </h3>
                {/* Use MarkdownTableRenderer */}
                <MarkdownTableRenderer tableData={trendsData} />
              </motion.div>
            )}
            {regulatoryData && (
              <motion.div
                variants={itemVariants}
                custom={4}
                className="mt-6 pt-6 border-t" // Added spacing
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Regulatory Environment (UK)
                </h3>
                {/* Use MarkdownTableRenderer */}
                <MarkdownTableRenderer tableData={regulatoryData} />
              </motion.div>
            )}
            {barriersData && (
              <motion.div
                variants={itemVariants}
                custom={5}
                className="mt-6 pt-6 border-t" // Added spacing
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Barriers to Entry (UK)
                </h3>
                {/* Use MarkdownTableRenderer */}
                <MarkdownTableRenderer tableData={barriersData} />
              </motion.div>
            )}
            {/* Render Market Penetration Strategy */}
            {strategyOutlineContent && (
              <motion.div
                variants={itemVariants}
                custom={6}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <Rocket className="mr-2 h-5 w-5 text-primary" />
                  Market Penetration Strategy (UK)
                </h3>
                <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                  {primaryStrategy && (
                    <div>
                      <h4 className="font-medium text-sm mb-1 flex items-center">
                        <Rocket className="mr-2 h-4 w-4 text-muted-foreground" />
                        Recommended Primary Strategy
                      </h4>
                      <p className="text-sm text-muted-foreground pl-6">
                        {primaryStrategy.replace(/^- /, "")}
                      </p>
                    </div>
                  )}
                  {keyActionsList && (
                    <div>
                      <h4 className="font-medium text-sm mb-1 flex items-center">
                        <ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />
                        Key Actions (Next 6 Months)
                      </h4>
                      <ul className="list-disc pl-11 space-y-1 text-sm text-muted-foreground">
                        {keyActionsList.map((item, index) => (
                          <li key={`act-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {investmentRequired && (
                    <div className="flex items-center text-sm">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium mr-1">
                        Estimated Investment:
                      </span>
                      <span className="text-muted-foreground">
                        {investmentRequired.replace(/^- /, "")}
                      </span>
                    </div>
                  )}
                  {expectedSOM && (
                    <div className="flex items-center text-sm">
                      <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium mr-1">
                        Expected SOM Increase (Year 1):
                      </span>
                      <span className="text-muted-foreground">
                        {expectedSOM.replace(/^- /, "")}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketPotentialSection;
