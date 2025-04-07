"use client";

import React, { useState, useEffect } from "react"; // Add useEffect
import ReactDOMServer from "react-dom/server"; // Import ReactDOMServer
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Download, // Add Download icon
  Loader2, // Add Loader2 icon
  BadgeCheck,
  ExternalLink,
  LineChart,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Newspaper,
  MessageCircle,
  Layers,
} from "lucide-react";

// Import section components
import SeoAnalysisSection from "./SeoAnalysisSection";
import ReportTemplate from "./pdf/ReportTemplate"; // Import ReportTemplate
import StrategicRecommendationsSection from "./StrategicRecommendationsSection";
import SearchTrendsSection from "./SearchTrendsSection";
import NewsSection from "./NewsSection";
import SocialMediaSection from "./SocialMediaSection";
import CompetitorAnalysisSection from "./CompetitorAnalysisSection";
import MarketPotentialSection from "./MarketPotentialSection";
import MarketCapSection from "./MarketCapSection";
import ContentSuggestionsSection from "./ContentSuggestionsSection";
import TopicClustersSection from "./TopicClustersSection"; // Import the new section
import { Separator } from "@/components/ui/separator";
import { exportMultipleDataToCsv } from "@/lib/csvExport";

// Removed helper components definitions

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// reportSections remains the same as it defines the structure
const reportSections = [
  {
    value: "seo",
    label: "SEO Analysis",
    Icon: LineChart,
    dataKey: "seoAnalysis",
    component: SeoAnalysisSection,
    isSeo: true,
  },
  {
    value: "competitor",
    label: "Competitor Analysis",
    Icon: Users,
    dataKey: "competitorAnalysis",
    component: CompetitorAnalysisSection,
  },
  {
    value: "trends",
    label: "Search Trends",
    Icon: TrendingUp,
    dataKey: "searchTrends",
    component: SearchTrendsSection,
  },
  {
    value: "marketPotential",
    label: "Market Potential",
    Icon: Target,
    dataKey: "marketPotential",
    component: MarketPotentialSection,
  },
  {
    value: "marketCap",
    label: "Market Cap",
    Icon: DollarSign,
    dataKey: "marketCap",
    component: MarketCapSection,
  },
  {
    value: "social",
    label: "Social Media",
    Icon: MessageCircle,
    dataKey: "socialMedia",
    component: SocialMediaSection,
  },
  {
    value: "news",
    label: "Recent News",
    Icon: Newspaper,
    dataKey: "businessName", // This key is used to find the section config, but the query uses `industry`
    component: NewsSection,
    isQuerySource: true, // Indicates it uses a query prop, not data prop
  },
  {
    value: "recommendations",
    label: "Recommendations",
    Icon: Lightbulb,
    dataKey: "recommendations",
    component: StrategicRecommendationsSection,
  },
  // Add Content Suggestions Section - Note: It doesn't directly use a dataKey from results
  {
    value: "contentSuggestions",
    label: "Content Ideas",
    Icon: Lightbulb, // Re-using Lightbulb, consider a different one if available/needed
    component: ContentSuggestionsSection,
    // No dataKey needed here as it fetches its own data based on others
    // Add a flag to identify sections needing specific data checks for rendering the tab
    // Check if seoAnalysis exists and has the necessary sub-properties
    dependsOn: [
      "seoAnalysis.contentAnalysis",
      "seoAnalysis.keywordGapAnalysis",
    ],
  },
  // Add Topic Clusters Section
  {
    value: "topicClusters",
    label: "Topic Clusters",
    Icon: Layers, // Use Layers icon or another suitable one
    component: TopicClustersSection,
    // Depends on keywords being available from various sources
    dependsOn: [
      "apolloData.keywords",
      "seoAnalysis.keywordRankingsUK.topKeywords",
      "seoAnalysis.keywordGapAnalysisUK.topOpportunities",
    ],
  },
];

// Accept submittedData prop
const BusinessAnalysisReport = ({ results, industry, submittedData }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [contentSuggestions, setContentSuggestions] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [topicClusters, setTopicClusters] = useState(null);
  const [clustersLoading, setClustersLoading] = useState(false);
  const [clustersError, setClustersError] = useState(null);

  // Fetch content suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      const contentAnalysisSummary =
        results?.seoAnalysis?.contentAnalysisUK?.summary;
      const keywordOpportunities =
        results?.seoAnalysis?.keywordGapAnalysisUK?.topOpportunities;
      const domain = submittedData?.website;

      if (
        contentAnalysisSummary &&
        Array.isArray(keywordOpportunities) &&
        keywordOpportunities.length > 0 &&
        domain
      ) {
        setSuggestionsLoading(true);
        setSuggestionsError(null);
        try {
          const response = await fetch("/api/content-suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contentAnalysisSummary,
              keywordOpportunities,
              domain,
            }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `API Error: ${response.status}`
            );
          }
          const data = await response.json();
          setContentSuggestions(data.suggestions);
        } catch (error) {
          console.error("Failed to fetch content suggestions:", error);
          setSuggestionsError(error.message);
          setContentSuggestions(null);
        } finally {
          setSuggestionsLoading(false);
        }
      } else {
        setContentSuggestions(null);
        setSuggestionsLoading(false);
        setSuggestionsError(null);
      }
    };

    if (results?.seoAnalysis) {
      fetchSuggestions();
    }
  }, [results, submittedData]);

  // Fetch topic clusters
  useEffect(() => {
    const fetchTopicClusters = async () => {
      const apolloKeywords = results?.apolloData?.keywords || [];
      const rankedKeywords =
        results?.seoAnalysis?.keywordRankingsUK?.topKeywords?.map(
          (k) => k.keywordUKFocus
        ) || [];
      const opportunityKeywords =
        results?.seoAnalysis?.keywordGapAnalysisUK?.topOpportunities?.map(
          (o) => o.keyword
        ) || [];

      const allKeywords = [
        ...new Set([
          ...apolloKeywords,
          ...rankedKeywords,
          ...opportunityKeywords,
        ]),
      ].filter(Boolean);

      if (allKeywords.length > 0) {
        setClustersLoading(true);
        setClustersError(null);
        try {
          const response = await fetch("/api/topic-clusters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords: allKeywords }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `API Error: ${response.status}`
            );
          }
          const data = await response.json();
          setTopicClusters(data.clusters);
        } catch (error) {
          console.error("Failed to fetch topic clusters:", error);
          setClustersError(error.message);
          setTopicClusters(null);
        } finally {
          setClustersLoading(false);
        }
      } else {
        setTopicClusters(null);
        setClustersLoading(false);
        setClustersError(null);
      }
    };

    if (results?.apolloData || results?.seoAnalysis) {
      fetchTopicClusters();
    }
  }, [results]);

  // Export handlers... (omitted for brevity, assume they are correct)
  const handleExportAllTables = () => {
    /* ... */
  };
  const handleDownloadPdf = async () => {
    /* ... */
  };

  if (!results) {
    // Render loading or placeholder state
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analysis Report</CardTitle>
          <CardDescription>
            Submit the form to generate your business analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-muted-foreground">
            <p>No analysis data available yet. Fill out the form to begin.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Destructure results
  const {
    seoAnalysis,
    competitorAnalysis,
    marketPotential,
    marketCap,
    recommendations,
    searchTrends,
    socialMedia,
  } = results;
  // Use industry for News query
  const newsQuery = industry;

  // Determine the first available tab
  const firstAvailableTab =
    reportSections.find((s) => {
      if (s.value === "contentSuggestions") return !!results?.seoAnalysis;
      if (s.value === "topicClusters")
        return !!results?.apolloData || !!results?.seoAnalysis;
      if (s.isQuerySource) return !!industry; // News uses industry
      return !!results[s.dataKey];
    })?.value || reportSections[0].value;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              AI Business Analysis
            </h2>
            <p className="text-muted-foreground text-sm">
              Generated by Profici for{" "}
              {submittedData?.businessName ||
                submittedData?.website ||
                "your business"}
            </p>
          </div>
          {/* Action Buttons - Conditionally Rendered */}
          {process.env.NODE_ENV !== "production" && (
            <div className="flex gap-2">
              <Button
                onClick={handleExportAllTables}
                disabled={isDownloading}
                size="sm"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Tables (CSV)
              </Button>
              <Button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                size="sm"
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export PDF
              </Button>
            </div>
          )}
        </div>

        <Tabs
          defaultValue={firstAvailableTab}
          orientation="vertical"
          className="flex flex-col md:flex-row gap-4 md:gap-6"
        >
          <TabsList className="flex md:flex-col h-auto md:h-full w-full md:w-48 shrink-0 justify-start p-1 bg-muted rounded-lg md:border-r md:pr-4">
            {reportSections.map((section) => {
              let showSection = false;
              if (section.value === "contentSuggestions")
                showSection = !!results?.seoAnalysis;
              else if (section.value === "topicClusters")
                showSection = !!results?.apolloData || !!results?.seoAnalysis;
              else if (section.isQuerySource) showSection = !!industry;
              else showSection = !!results[section.dataKey];

              return (
                showSection && (
                  <TabsTrigger
                    key={section.value}
                    value={section.value}
                    className="w-full justify-start px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <section.Icon className="mr-2 h-4 w-4" /> {section.label}
                  </TabsTrigger>
                )
              );
            })}
          </TabsList>

          {/* This is the container for tab content - Apply overflow visible here */}
          <div className="flex-grow min-w-0" style={{ overflow: "visible" }}>
            {reportSections.map((section) => {
              let showSection = false;
              if (section.value === "contentSuggestions")
                showSection = !!results?.seoAnalysis;
              else if (section.value === "topicClusters")
                showSection = !!results?.apolloData || !!results?.seoAnalysis;
              else if (section.isQuerySource) showSection = !!industry;
              else showSection = !!results[section.dataKey];

              return (
                showSection && (
                  <TabsContent
                    key={section.value}
                    value={section.value}
                    className="mt-0 md:mt-0" // No top margin
                    // Removed style from here
                  >
                    <div key={section.value} className="p-1">
                      {section.isSeo ? (
                        <section.component
                          seoAnalysis={results[section.dataKey]}
                          seoVisualData={results.seoVisualData}
                          seoChartData={results.seoChartData}
                        />
                      ) : section.isQuerySource ? (
                        <section.component query={newsQuery} /> // Pass industry query
                      ) : section.value === "contentSuggestions" ? (
                        <section.component
                          suggestions={contentSuggestions}
                          isLoading={suggestionsLoading}
                          error={suggestionsError}
                        />
                      ) : section.value === "topicClusters" ? (
                        <section.component
                          clusters={topicClusters}
                          isLoading={clustersLoading}
                          error={clustersError}
                        />
                      ) : (
                        <section.component data={results[section.dataKey]} />
                      )}
                    </div>
                  </TabsContent>
                )
              );
            })}
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <motion.div
        id="report-footer-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-t bg-background">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <BadgeCheck className="mr-2 h-4 w-4 text-green-600" /> Profici
                AI Business Analysis Report
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground mt-2">
              This report provides comprehensive business intelligence and
              strategic insights powered by advanced AI analysis.
            </CardDescription>
          </CardHeader>
          <CardFooter className="py-4 px-6 flex flex-col items-center gap-3 bg-gradient-to-b from-background to-muted/20">
            <p className="text-base font-semibold text-primary tracking-tight">
              Empowering Business Growth
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <Target className="w-5 h-5 text-primary" /> Strategic Planning
              </span>
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <LineChart className="w-5 h-5 text-primary" /> Data Analytics
              </span>
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <Users className="w-5 h-5 text-primary" /> Team Growth
              </span>
              <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <TrendingUp className="w-5 h-5 text-primary" /> Market Expansion
              </span>
            </div>
            <a
              href="https://profici.co.uk/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              Contact us to learn more
            </a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BusinessAnalysisReport;
