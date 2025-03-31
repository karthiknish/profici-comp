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
// Remove Table imports if RenderMarkdownTable is removed or moved
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import { parseMarkdownTable, parsePercentage } from "@/utils/parsing";
import PercentageMetric from "@/components/ui/PercentageMetric"; // Import the new component
import {
  Percent,
  ThumbsUp,
  ThumbsDown,
  Target,
  AlertTriangle,
  TrendingUp, // Added for comparison
  TrendingDown as TrendingDownIcon, // Added for comparison
} from "lucide-react"; // Add SWOT icons
// Remove ReactMarkdown imports
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
import {
  extractListItems,
  extractSectionContent,
  extractSubheadingListItems,
} from "@/utils/parsing"; // Add extractSubheadingListItems
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"; // Import new component
import MarkdownTableRenderer from "@/components/ui/MarkdownTableRenderer"; // Import new component

// Remove RenderMarkdownTable definition
/*
const RenderMarkdownTable = ({ tableData }) => { ... };
*/

const CompetitorAnalysisSection = ({ data }) => {
  // Attempt to parse the specific table first
  const overviewData = parseMarkdownTable(data, "Competitor Overview");
  const digitalPresenceData = parseMarkdownTable(
    data,
    "Digital Presence Comparison"
  );
  const pricingData = parseMarkdownTable(data, "Pricing Strategy Analysis");
  const marketingChannelData = parseMarkdownTable(
    data,
    "Marketing Channel Effectiveness"
  );
  // Extract SWOT and Opportunities using a generic markdown approach if tables fail or aren't used
  const swotRegex =
    /##\s*SWOT Analysis[\s\S]*?(?=##\s*Business vs\. Competitors: Key Differences|##\s*Competitive Advantage Opportunities|$)/; // Updated regex boundary
  const swotMatch = data?.match(swotRegex);
  // Instead of just getting the whole block, parse individual lists
  const strengths = swotMatch
    ? extractListItems(swotMatch[0], "Strengths")
    : null;
  const weaknesses = swotMatch
    ? extractListItems(swotMatch[0], "Weaknesses")
    : null;
  const opportunities = swotMatch
    ? extractListItems(swotMatch[0], "Opportunities")
    : null;
  const threats = swotMatch ? extractListItems(swotMatch[0], "Threats") : null;

  // Extract the new comparison section content
  const vsCompetitorsContent = extractSectionContent(
    data,
    "Business vs. Competitors: Key Differences"
  );

  // Extract Competitive Advantage Opportunities section
  const opportunitiesRegex =
    /##\s*Competitive Advantage Opportunities[\s\S]*?$/;
  const opportunitiesMatch = data?.match(opportunitiesRegex);
  const opportunitiesContent = opportunitiesMatch
    ? opportunitiesMatch[0] // Keep the full markdown block including the title
    : null;

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  // Determine if we should show the raw markdown fallback
  const showFallback =
    !overviewData &&
    !digitalPresenceData &&
    !pricingData &&
    !marketingChannelData &&
    !(strengths || weaknesses || opportunities || threats) && // Check parsed SWOT lists
    !vsCompetitorsContent && // Check for the new comparison section
    !opportunitiesContent;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Competitor Analysis</CardTitle>
        <CardDescription>
          Analysis of key competitors in the UK market.
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
            {overviewData && (
              <motion.div variants={itemVariants} custom={0}>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Competitor Overview (UK Est.)
                </h3>
                {/* Use MarkdownTableRenderer */}
                <MarkdownTableRenderer tableData={overviewData} />
              </motion.div>
            )}
            {digitalPresenceData && (
              <motion.div
                variants={itemVariants}
                custom={1}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Digital Presence Comparison (UK Est.)
                </h3>
                {/* Use MarkdownTableRenderer */}
                <MarkdownTableRenderer tableData={digitalPresenceData} />
              </motion.div>
            )}
            {pricingData && (
              <motion.div
                variants={itemVariants}
                custom={2}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Pricing Strategy Analysis (UK Est.)
                </h3>
                {/* Use MarkdownTableRenderer */}
                <MarkdownTableRenderer tableData={pricingData} />
              </motion.div>
            )}
            {marketingChannelData && (
              <motion.div
                variants={itemVariants}
                custom={3}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Marketing Channel Effectiveness (UK Est.)
                </h3>
                {/* Use MarkdownTableRenderer */}
                <MarkdownTableRenderer tableData={marketingChannelData} />
              </motion.div>
            )}

            {/* SWOT Analysis 2x2 Grid */}
            {(strengths || weaknesses || opportunities || threats) && (
              <motion.div
                variants={itemVariants}
                custom={4}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  SWOT Analysis (UK Context)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/30">
                    <h4 className="font-semibold mb-2 flex items-center text-green-800 dark:text-green-300">
                      <ThumbsUp className="mr-2 h-4 w-4" /> Strengths
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-green-700 dark:text-green-400">
                      {strengths?.map((item, index) => (
                        <li key={`s-${index}`}>{item}</li>
                      )) ?? <li>N/A</li>}
                    </ul>
                  </div>
                  {/* Weaknesses */}
                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/30">
                    <h4 className="font-semibold mb-2 flex items-center text-red-800 dark:text-red-300">
                      <ThumbsDown className="mr-2 h-4 w-4" /> Weaknesses
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-red-700 dark:text-red-400">
                      {weaknesses?.map((item, index) => (
                        <li key={`w-${index}`}>{item}</li>
                      )) ?? <li>N/A</li>}
                    </ul>
                  </div>
                  {/* Opportunities */}
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <h4 className="font-semibold mb-2 flex items-center text-blue-800 dark:text-blue-300">
                      <Target className="mr-2 h-4 w-4" /> Opportunities
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-400">
                      {opportunities?.map((item, index) => (
                        <li key={`o-${index}`}>{item}</li>
                      )) ?? <li>N/A</li>}
                    </ul>
                  </div>
                  {/* Threats */}
                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
                    <h4 className="font-semibold mb-2 flex items-center text-yellow-800 dark:text-yellow-300">
                      <AlertTriangle className="mr-2 h-4 w-4" /> Threats
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                      {threats?.map((item, index) => (
                        <li key={`t-${index}`}>{item}</li>
                      )) ?? <li>N/A</li>}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Business vs. Competitors: Key Differences */}
            {vsCompetitorsContent && (
              <motion.div
                variants={itemVariants}
                custom={5} // Adjust custom index if needed
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Business vs. Competitors: Key Differences
                </h3>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <MarkdownRenderer content={vsCompetitorsContent} />
                </div>
              </motion.div>
            )}

            {/* Competitive Advantage Opportunities */}
            {opportunitiesContent && (
              <motion.div
                variants={itemVariants}
                custom={6} // Adjust custom index
                className="mt-6 pt-6 border-t"
              >
                {/* Heading is part of the markdown content, rendered by MarkdownRenderer */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  {/* Use MarkdownRenderer */}
                  <MarkdownRenderer content={opportunitiesContent} />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitorAnalysisSection;
