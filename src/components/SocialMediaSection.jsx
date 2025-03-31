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
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ListChecks,
  Share2,
  Lightbulb, // Added for recommendations
  Users, // Added for competitor sentiment
  Smile, // Added for positive sentiment
  Frown, // Added for negative sentiment
  Meh, // Added for neutral sentiment
} from "lucide-react";
// Remove ReactMarkdown imports
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"; // Import new component
import MarkdownTableRenderer from "@/components/ui/MarkdownTableRenderer"; // Import new component
// PercentageMetric is not used here anymore
// import { PercentageMetric } from "./BusinessAnalysisReport";

// Helper to extract content under a specific H3 (###) subheading
const extractContentUnderSubheading = (markdown, subheading) => {
  if (!markdown || !subheading) return null;
  // Regex to find content under a specific H3 heading until the next H3 or end of string
  // Make subheading matching more flexible (case-insensitive, optional chars)
  const subheadingPattern = subheading.replace(
    /[-\/\\^$*+?.()|[\]{}]/g,
    "\\$&"
  ); // Escape regex chars
  const regex = new RegExp(
    `###\\s*${subheadingPattern}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n###|$)`,
    "i"
  );
  const match = markdown.match(regex);
  return match ? match[1].trim() : null;
};

// Remove RenderMarkdownTable definition as it's now imported
/*
const RenderMarkdownTable = ({ tableData }) => { ... };
*/

// Helper to render list items with appropriate icons based on content
const SentimentListItem = ({ item, index }) => {
  let Icon = MessageSquare; // Default
  let color = "text-muted-foreground";

  const lowerItem = item.toLowerCase();
  if (lowerItem.includes("positive")) {
    Icon = Smile;
    color = "text-green-600 dark:text-green-400";
  } else if (lowerItem.includes("negative")) {
    Icon = Frown;
    color = "text-red-600 dark:text-red-400";
  } else if (lowerItem.includes("neutral") || lowerItem.includes("mixed")) {
    Icon = Meh;
    color = "text-yellow-600 dark:text-yellow-400";
  } else if (lowerItem.includes("competitor")) {
    Icon = Users;
    color = "text-blue-600 dark:text-blue-400";
  }

  // Remove the prefix for display if needed (e.g., "- Competitor A: ")
  const displayItem = item.replace(/^-\s*.*?:\s*/, "");

  return (
    <li key={index} className={`flex items-start ${color}`}>
      <Icon className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0`} />
      <span>{displayItem}</span>
    </li>
  );
};

const SocialMediaSection = ({ data }) => {
  // --- Parsing ---
  const keyTakeaways = extractListItems(data, "Key Takeaways");
  const platformData = parseMarkdownTable(data, "Platform Presence");

  // Extract structured sentiment and recommendations using the new helper
  const sentimentAnalysisContent = extractContentUnderSubheading(
    data,
    "Audience Sentiment Analysis"
  );
  const overallSentiment = sentimentAnalysisContent
    ? extractListItems(sentimentAnalysisContent, "Overall Brand Sentiment")
    : null;
  const discussionThemes = sentimentAnalysisContent
    ? extractListItems(sentimentAnalysisContent, "Key Discussion Themes")
    : null;
  const competitorSentiment = sentimentAnalysisContent
    ? extractListItems(
        sentimentAnalysisContent,
        "Competitor Sentiment Snippets"
      )
    : null;

  const recommendationsContent = extractContentUnderSubheading(
    data,
    "Platform Recommendations"
  );
  const topPlatforms = recommendationsContent
    ? extractListItems(recommendationsContent, "Top Recommended Platforms")
    : null;
  const rationale = recommendationsContent
    ? extractListItems(recommendationsContent, "Rationale")
    : null;
  const keyActions = recommendationsContent
    ? extractListItems(recommendationsContent, "Key Actions")
    : null; // Might need more specific parsing based on Gemini output

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  // Determine if significant parsing failed
  const showFallback =
    !keyTakeaways &&
    !platformData &&
    !sentimentAnalysisContent && // Check parent block
    !recommendationsContent; // Check parent block

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="mr-2 h-5 w-5" /> Social Media Insights
        </CardTitle>
        <CardDescription>
          Estimated social media presence, engagement, and recommendations.
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
            {/* Key Takeaways */}
            {keyTakeaways && (
              <motion.div variants={itemVariants} custom={0}>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-primary" />
                  Key Takeaways
                </h3>
                {/* Use MarkdownRenderer for list content */}
                <div className="p-4 border rounded-lg bg-muted/50 mt-2">
                  <MarkdownRenderer content={keyTakeaways.join("\n")} />
                </div>
              </motion.div>
            )}

            {/* Platform Presence Table */}
            {platformData && (
              <motion.div
                variants={itemVariants}
                custom={1}
                className="mt-6 pt-6 border-t"
              >
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                  Platform Presence & Engagement (Est.)
                </h3>
                {/* Use MarkdownTableRenderer */}
                <MarkdownTableRenderer tableData={platformData} />
              </motion.div>
            )}

            {/* New Layout for Sentiment and Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
              {/* Audience Sentiment Section */}
              {sentimentAnalysisContent && (
                <motion.div variants={itemVariants} custom={2}>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    Audience Sentiment (Est.)
                  </h3>
                  <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                    {overallSentiment && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">
                          Overall Brand Sentiment:
                        </h4>
                        {/* Render using SentimentListItem helper */}
                        <ul className="space-y-1 text-sm">
                          {overallSentiment.map((item, index) => (
                            <SentimentListItem
                              key={`os-${index}`}
                              item={item}
                              index={index}
                            />
                          ))}
                        </ul>
                      </div>
                    )}
                    {discussionThemes && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">
                          Key Discussion Themes:
                        </h4>
                        {/* Render using MarkdownRenderer */}
                        <MarkdownRenderer
                          content={discussionThemes.join("\n")}
                        />
                      </div>
                    )}
                    {competitorSentiment && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">
                          Competitor Sentiment Snippets:
                        </h4>
                        {/* Render using SentimentListItem helper */}
                        <ul className="space-y-1 text-sm">
                          {competitorSentiment.map((item, index) => (
                            <SentimentListItem
                              key={`cs-${index}`}
                              item={item}
                              index={index}
                            />
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Platform Recommendations Section */}
              {recommendationsContent && (
                <motion.div variants={itemVariants} custom={3}>
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                    Platform Recommendations
                  </h3>
                  <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                    {topPlatforms && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">
                          Top Recommended Platforms:
                        </h4>
                        {/* Render using MarkdownRenderer */}
                        <MarkdownRenderer content={topPlatforms.join("\n")} />
                      </div>
                    )}
                    {rationale && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Rationale:</h4>
                        {/* Render using MarkdownRenderer */}
                        <MarkdownRenderer content={rationale.join("\n")} />
                      </div>
                    )}
                    {keyActions && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">
                          Key Actions (Next 3 Months):
                        </h4>
                        {/* Render using MarkdownRenderer */}
                        <MarkdownRenderer content={keyActions.join("\n")} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border">
              *Social media data (followers, engagement, sentiment) is estimated
              by AI and may not reflect exact real-time figures.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;
