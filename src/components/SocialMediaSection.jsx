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
import {
  MessageCircle,
  Users,
  BarChart2,
  ThumbsUp,
  Lightbulb,
  Star,
  Share2,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  MessageSquare,
  ChevronUp,
  ArrowRight,
} from "lucide-react"; // Added more social icons
// Import the basic helpers
import {
  FormattedText,
  JsonList,
  JsonTable,
} from "@/components/ui/JsonRenderHelpers";

// --- Platform Icons ---
const PlatformIcon = ({ platform, className = "h-5 w-5" }) => {
  const iconMap = {
    LinkedIn: <Linkedin className={`text-blue-600 ${className}`} />,
    Facebook: <Facebook className={`text-blue-800 ${className}`} />,
    Instagram: <Instagram className={`text-pink-500 ${className}`} />,
    "Twitter/X": <Twitter className={`text-sky-400 ${className}`} />,
    Twitter: <Twitter className={`text-sky-400 ${className}`} />,
    YouTube: <Youtube className={`text-red-600 ${className}`} />,
    TikTok: (
      <div className={`relative ${className} flex items-center justify-center`}>
        <span className="text-black dark:text-white text-xs font-bold">TT</span>
      </div>
    ),
  };

  return (
    iconMap[platform] || <Share2 className={`text-gray-500 ${className}`} />
  );
};

// --- Specific Rendering Components ---

const RenderSentiment = ({ data }) => {
  if (!data) return null;

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return "text-gray-600";
    sentiment = sentiment.toLowerCase();
    if (sentiment.includes("positive"))
      return "text-green-600 dark:text-green-400";
    if (sentiment.includes("negative")) return "text-red-600 dark:text-red-400";
    if (sentiment.includes("neutral"))
      return "text-blue-600 dark:text-blue-400";
    if (sentiment.includes("mixed"))
      return "text-amber-600 dark:text-amber-400";
    return "text-gray-600";
  };

  return (
    <div className="space-y-4">
      {data.overallBrandSentiment && (
        <Card className="bg-white dark:bg-gray-800 border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Overall Sentiment</h4>
              <span
                className={`font-semibold rounded-full px-3 py-1 text-xs ${getSentimentColor(
                  data.overallBrandSentiment.sentiment
                )} bg-opacity-10 border`}
              >
                {data.overallBrandSentiment.sentiment}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {data.overallBrandSentiment.justification}
            </p>
          </CardContent>
        </Card>
      )}

      {data.keyThemes && data.keyThemes.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border shadow-sm">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3">Key Themes</h4>
            <div className="flex flex-wrap gap-2">
              {data.keyThemes.map((theme, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  {theme}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.competitorSnippets && data.competitorSnippets.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border shadow-sm">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3">Competitor Sentiment</h4>
            <div className="space-y-3">
              {data.competitorSnippets.map((snippet, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <h5 className="font-medium text-sm">
                      {snippet.competitor}
                    </h5>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <FormattedText text={snippet.summary} />
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const RenderRecommendations = ({ data }) => {
  if (!data) return null;
  return (
    <div className="space-y-4">
      {data.topPlatforms && data.topPlatforms.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border shadow-sm">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3">
              Top Platforms & Rationale
            </h4>
            <div className="space-y-3">
              {data.topPlatforms.map((platform, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border"
                >
                  <div className="mt-0.5">
                    <PlatformIcon platform={platform.platform} />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">{platform.platform}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <FormattedText text={platform.rationale} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.keyActions && data.keyActions.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border shadow-sm">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3">
              Key Actions (Next 3 Months)
            </h4>
            <div className="space-y-4">
              {data.keyActions.map((platformAction, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <PlatformIcon
                      platform={platformAction.platform}
                      className="h-4 w-4"
                    />
                    <h5 className="font-medium text-xs uppercase text-gray-700 dark:text-gray-300">
                      {platformAction.platform}
                    </h5>
                  </div>
                  <div className="ml-6 space-y-1">
                    {platformAction.actions.map((action, actionIdx) => (
                      <div key={actionIdx} className="flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <FormattedText text={action} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.notes && (
        <p className="text-xs italic text-muted-foreground px-1">
          {data.notes}
        </p>
      )}
    </div>
  );
};

// Custom enhanced table component for platform presence
const EnhancedPlatformTable = ({ data }) => {
  if (!data || !Array.isArray(data.headers) || !Array.isArray(data.rows))
    return (
      <p className="text-muted-foreground text-sm">
        Table data is missing or invalid.
      </p>
    );

  const { headers, rows } = data;

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/60">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, rowIndex) => {
            const platformName = Object.values(row)[0]; // First column is platform name
            return (
              <tr
                key={rowIndex}
                className={
                  rowIndex % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-800/40"
                }
              >
                {headers.map((header, colIndex) => {
                  const cellData = Object.values(row)[colIndex];
                  const isFirstColumn = colIndex === 0;

                  return (
                    <td
                      key={colIndex}
                      className="px-4 py-3 whitespace-nowrap text-xs text-gray-700 dark:text-gray-300"
                    >
                      {isFirstColumn ? (
                        <div className="flex items-center gap-2">
                          <PlatformIcon
                            platform={cellData}
                            className="h-4 w-4"
                          />
                          <span className="font-medium">{cellData}</span>
                        </div>
                      ) : Array.isArray(cellData) ? (
                        <div className="flex flex-wrap gap-1">
                          {cellData.map((item, i) => (
                            <span
                              key={i}
                              className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-[10px] text-blue-700 dark:text-blue-300"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <FormattedText text={String(cellData ?? "N/A")} />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// --- Main Component ---

const SocialMediaSection = ({ data }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const hasData = data && !data.error && typeof data === "object";

  return (
    <Card className="w-full shadow-sm border bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          Social Media Insights
        </CardTitle>
        <CardDescription>
          Estimated social media presence, engagement, and sentiment analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {hasData ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-8"
          >
            {/* Key Takeaways */}
            {data.keyTakeaways && (
              <motion.div
                variants={itemVariants}
                custom={0}
                className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border"
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.keyTakeaways.title || "Key Takeaways"}
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {data.keyTakeaways.points &&
                    data.keyTakeaways.points.map((point, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-gray-800 rounded-md border shadow-sm flex"
                      >
                        <div className="mr-3 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-primary">
                            {idx + 1}
                          </span>
                        </div>
                        <p className="text-sm">
                          <FormattedText text={point} />
                        </p>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Platform Presence */}
            {data.platformPresence && (
              <motion.div
                variants={itemVariants}
                custom={1}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.platformPresence.title ||
                    "Platform Presence & Engagement"}
                </h3>
                <EnhancedPlatformTable data={data.platformPresence} />
                {data.platformPresence.notes && (
                  <p className="text-xs italic text-muted-foreground mt-2 px-1">
                    {data.platformPresence.notes}
                  </p>
                )}
              </motion.div>
            )}

            {/* Sentiment Analysis */}
            {data.sentimentAnalysis && (
              <motion.div
                variants={itemVariants}
                custom={2}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <ThumbsUp className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.sentimentAnalysis.title || "Audience Sentiment"}
                </h3>
                <RenderSentiment data={data.sentimentAnalysis} />
              </motion.div>
            )}

            {/* Platform Recommendations */}
            {data.platformRecommendations && (
              <motion.div
                variants={itemVariants}
                custom={3}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.platformRecommendations.title ||
                    "Platform Recommendations"}
                </h3>
                <RenderRecommendations data={data.platformRecommendations} />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="prose dark:prose-invert max-w-none text-sm text-center py-4">
            <p className="text-muted-foreground">
              No social media data available or an error occurred.
            </p>
            {data?.error && (
              <p className="text-red-600 dark:text-red-400 mt-2">
                Error: {data.error}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;
