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
  ThumbsUp,
  ThumbsDown,
  Target,
  AlertTriangle,
  Users,
  BarChart2,
  CreditCard,
  MessageSquare,
  Info,
  GitCompareArrows,
  Star,
} from "lucide-react";
// Import the basic helpers
import {
  FormattedText,
  JsonList,
  JsonTable,
} from "@/components/ui/JsonRenderHelpers";
import KeyMetricHighlight from "@/components/KeyMetricHighlight";
import {
  BarChart2 as ChartIcon,
  Users as UsersIcon,
  Star as StarIcon,
} from "lucide-react";
import CompetitorComparisonBarChart from "@/components/charts/CompetitorComparisonBarChart"; // Import the new chart

// --- Specific Rendering Components for Competitor JSON Structure ---

const RenderSwot = ({ data }) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {data.strengths && (
        <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/30">
          <h4 className="font-semibold mb-2 flex items-center text-green-800 dark:text-green-300">
            <ThumbsUp className="mr-2 h-4 w-4" /> Strengths
          </h4>
          <JsonList
            items={data.strengths}
            className="list-disc pl-5 space-y-1 text-sm text-green-700 dark:text-green-400"
          />
        </div>
      )}
      {data.weaknesses && (
        <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/30">
          <h4 className="font-semibold mb-2 flex items-center text-red-800 dark:text-red-300">
            <ThumbsDown className="mr-2 h-4 w-4" /> Weaknesses
          </h4>
          <JsonList
            items={data.weaknesses}
            className="list-disc pl-5 space-y-1 text-sm text-red-700 dark:text-red-400"
          />
        </div>
      )}
      {data.opportunities && (
        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/30">
          <h4 className="font-semibold mb-2 flex items-center text-blue-800 dark:text-blue-300">
            <Target className="mr-2 h-4 w-4" /> Opportunities
          </h4>
          <JsonList
            items={data.opportunities}
            className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-400"
          />
        </div>
      )}
      {data.threats && (
        <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
          <h4 className="font-semibold mb-2 flex items-center text-yellow-800 dark:text-yellow-300">
            <AlertTriangle className="mr-2 h-4 w-4" /> Threats
          </h4>
          <JsonList
            items={data.threats}
            className="list-disc pl-5 space-y-1 text-sm text-yellow-700 dark:text-yellow-400"
          />
        </div>
      )}
    </div>
  );
};

const RenderApolloComparison = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="space-y-3">
      {data.map((compData, idx) => (
        <div key={idx} className="p-3 border rounded-md bg-muted/50">
          <h4 className="font-semibold text-sm mb-1">{compData.name}</h4>
          {compData.confirmations?.length > 0 && (
            <div className="mt-1">
              <strong className="text-xs uppercase text-muted-foreground">
                Confirmations:
              </strong>
              <JsonList items={compData.confirmations} />
            </div>
          )}
          {compData.discrepancies?.length > 0 && (
            <div className="mt-1">
              <strong className="text-xs uppercase text-muted-foreground">
                Discrepancies:
              </strong>
              <JsonList items={compData.discrepancies} />
            </div>
          )}
          {compData.insights?.length > 0 && (
            <div className="mt-1">
              <strong className="text-xs uppercase text-muted-foreground">
                New Insights:
              </strong>
              <JsonList items={compData.insights} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const RenderKeyDifferences = ({ data }) => {
  if (!data) return null;
  return (
    <div className="space-y-2 text-sm p-3 border rounded-md bg-muted/50">
      {data.digitalPresence && (
        <p>
          <strong className="font-medium">Digital Presence:</strong>{" "}
          <FormattedText text={data.digitalPresence} />
        </p>
      )}
      {data.pricing && (
        <p>
          <strong className="font-medium">Pricing:</strong>{" "}
          <FormattedText text={data.pricing} />
        </p>
      )}
      {data.marketingChannels && (
        <p>
          <strong className="font-medium">Marketing Channels:</strong>{" "}
          <FormattedText text={data.marketingChannels} />
        </p>
      )}
      {data.overall && (
        <p className="mt-2 italic">
          <strong className="font-medium not-italic">Overall:</strong>{" "}
          <FormattedText text={data.overall} />
        </p>
      )}
    </div>
  );
};

const RenderAdvantageOpportunities = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  return (
    // Added styled container
    <div className="space-y-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/30">
      {data.map((opp, index) => (
        <div
          key={index}
          className="text-sm border-b border-dashed pb-2 last:border-b-0 last:pb-0"
        >
          {" "}
          {/* Added border between items */}
          <strong className="font-semibold text-blue-800 dark:text-blue-300 block mb-1">
            {" "}
            {/* Styled description */}
            {opp.description || `Opportunity ${index + 1}`}
          </strong>
          {opp.action && (
            <div className="flex items-start mt-1">
              <strong className="text-xs uppercase text-muted-foreground w-16 shrink-0">
                {" "}
                {/* Fixed width label */}
                Action:
              </strong>
              <FormattedText text={opp.action} className="flex-1" />{" "}
              {/* Use FormattedText */}
            </div>
          )}
          {opp.outcome && (
            <div className="flex items-start mt-1">
              <strong className="text-xs uppercase text-muted-foreground w-16 shrink-0">
                {" "}
                {/* Fixed width label */}
                Outcome:
              </strong>
              <FormattedText text={opp.outcome} className="flex-1" />{" "}
              {/* Use FormattedText */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
// --- Main Component ---

const CompetitorAnalysisSection = ({ data }) => {
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
    <Card className="w-full border-none shadow-none">
      {" "}
      {/* Use main card from parent */}
      {/* <CardHeader>
        <CardTitle>Competitor Analysis</CardTitle>
        <CardDescription>Analysis of key competitors in the UK market.</CardDescription>
      </CardHeader> */}
      <CardContent className="p-0">
        {hasData ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            {/* Summary metrics if available */}
            {data.competitorOverview?.rows && (
              <motion.div variants={itemVariants} custom={-1}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-2">
                  <KeyMetricHighlight
                    label="Competitors"
                    value={
                      Array.isArray(data.competitorOverview.rows)
                        ? data.competitorOverview.rows.length
                        : undefined
                    }
                    icon={UsersIcon}
                  />
                  <KeyMetricHighlight
                    label="Top Authority"
                    value={(() => {
                      try {
                        const max = Math.max(
                          ...data.competitorOverview.rows
                            .map((r) => Number(r.authority))
                            .filter((n) => Number.isFinite(n))
                        );
                        return Number.isFinite(max) ? max : undefined;
                      } catch {
                        return undefined;
                      }
                    })()}
                    unit="/100"
                    icon={StarIcon}
                  />
                  <KeyMetricHighlight
                    label="Top Market Share"
                    value={(() => {
                      try {
                        const max = Math.max(
                          ...data.competitorOverview.rows
                            .map((r) => Number(r.marketShare))
                            .filter((n) => Number.isFinite(n))
                        );
                        return Number.isFinite(max) ? max : undefined;
                      } catch {
                        return undefined;
                      }
                    })()}
                    unit="%"
                    icon={ChartIcon}
                  />
                </div>
              </motion.div>
            )}
            {/* Render each section using specific layout and helpers */}
            {data.competitorOverview && (
              <motion.div variants={itemVariants} custom={0}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.competitorOverview.title || "Competitor Overview"}
                </h3>
                <JsonTable data={data.competitorOverview} />
              </motion.div>
            )}

            {data.digitalPresence && (
              <motion.div variants={itemVariants} custom={1}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.digitalPresence.title || "Digital Presence"}
                </h3>
                {/* Add Comparison Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <CompetitorComparisonBarChart
                    data={data.digitalPresence}
                    dataKey="traffic"
                    label="Est. Monthly Traffic"
                  />
                  <CompetitorComparisonBarChart
                    data={data.digitalPresence}
                    dataKey="following"
                    label="Social Following"
                  />
                  <CompetitorComparisonBarChart
                    data={data.digitalPresence}
                    dataKey="rating"
                    label="Review Rating"
                    unit="/5"
                  />
                  <CompetitorComparisonBarChart
                    data={data.competitorOverview} // Use overview data for DA
                    dataKey="authority"
                    label="Website Authority (DA)"
                    unit="/100"
                  />
                  <CompetitorComparisonBarChart
                    data={data.competitorOverview} // Use overview data for Market Share
                    dataKey="marketShare"
                    label="Market Share"
                    unit="%"
                  />
                </div>
                {/* Keep the original table as well */}
                <div className="mt-2">
                  <JsonTable data={data.digitalPresence} />
                </div>
                {data.digitalPresence.notes && (
                  <p className="text-xs italic text-muted-foreground mt-2">
                    {data.digitalPresence.notes}
                  </p>
                )}
              </motion.div>
            )}

            {data.pricingStrategy && (
              <motion.div variants={itemVariants} custom={2}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.pricingStrategy.title || "Pricing Strategy"}
                </h3>
                <div className="mt-2">
                  <JsonTable data={data.pricingStrategy} />
                </div>
                {data.pricingStrategy.summary && (
                  <p className="text-sm mt-2">
                    <FormattedText text={data.pricingStrategy.summary} />
                  </p>
                )}
              </motion.div>
            )}

            {data.marketingChannels && (
              <motion.div variants={itemVariants} custom={3}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.marketingChannels.title || "Marketing Channels"}
                </h3>
                <div className="mt-2">
                  <JsonTable data={data.marketingChannels} />
                </div>
                {data.marketingChannels.gapOpportunities?.opportunities && (
                  <div className="mt-3">
                    <h4 className="font-semibold text-sm mb-1">
                      {data.marketingChannels.gapOpportunities.title ||
                        "Channel Gap Opportunities"}
                    </h4>
                    <JsonList
                      items={data.marketingChannels.gapOpportunities.opportunities.map(
                        (o) => `${o.channel}: ${o.rationale}`
                      )}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {data.apolloComparison?.competitorData && (
              <motion.div variants={itemVariants} custom={4}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Info className="mr-2 h-5 w-5 text-primary" /> Data Comparison
                </h3>
                <RenderApolloComparison
                  data={data.apolloComparison.competitorData}
                />
              </motion.div>
            )}

            {data.keyDifferences && (
              <motion.div variants={itemVariants} custom={5}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <GitCompareArrows className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.keyDifferences.title || "Key Differences"}
                </h3>
                <RenderKeyDifferences data={data.keyDifferences} />
              </motion.div>
            )}

            {data.swotAnalysis && (
              <motion.div variants={itemVariants} custom={6}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  {data.swotAnalysis.title || "SWOT Analysis"}
                </h3>
                <RenderSwot data={data.swotAnalysis} />
              </motion.div>
            )}

            {data.advantageOpportunities?.opportunities && (
              <motion.div variants={itemVariants} custom={7}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.advantageOpportunities.title ||
                    "Competitive Advantage Opportunities"}
                </h3>
                <RenderAdvantageOpportunities
                  data={data.advantageOpportunities.opportunities}
                />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="prose dark:prose-invert max-w-none text-sm text-center py-4">
            <p className="text-muted-foreground">
              No competitor analysis data available or an error occurred.
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

export default CompetitorAnalysisSection;
