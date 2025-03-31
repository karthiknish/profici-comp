"use client";

// Remove unused imports: useRef, useState, jsPDF, html2canvas, Download, Loader2
import React from "react";
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
// Remove unused imports: Progress, Table components, parsing utils, KeyMetricHighlight
import { toast } from "sonner"; // Keep toast if used elsewhere, maybe remove later if not
import {
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
  // Remove unused icons like Percent, ArrowUpRight, Scale, Activity, Briefcase, Building2, ListChecks, AlertCircle
} from "lucide-react";
// Remove unused imports: ReactMarkdown, remarkGfm, rehypeRaw

// Import section components
import SeoAnalysisSection from "./SeoAnalysisSection";
import StrategicRecommendationsSection from "./StrategicRecommendationsSection";
import SearchTrendsSection from "./SearchTrendsSection";
import NewsSection from "./NewsSection";
import SocialMediaSection from "./SocialMediaSection";
import CompetitorAnalysisSection from "./CompetitorAnalysisSection";
import MarketPotentialSection from "./MarketPotentialSection";
import MarketCapSection from "./MarketCapSection";

// Remove helper components definitions (PercentageMetric, StatCard, RenderMarkdownTable, etc.)

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
    dataKey: "businessName", // Change dataKey to use businessName for the query
    component: NewsSection,
    isQuerySource: true, // Still indicates it uses a query prop, not data prop
  },
  {
    value: "recommendations",
    label: "Recommendations",
    Icon: Lightbulb,
    dataKey: "recommendations",
    component: StrategicRecommendationsSection,
  },
];

// Accept submittedData prop, remove insitesData
const BusinessAnalysisReport = ({ results, industry, submittedData }) => {
  // Remove reportRef and isDownloading state
  // const reportRef = useRef(null);
  // const [isDownloading, setIsDownloading] = useState(false);

  // Remove handleDownloadPdf function

  if (!results) {
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

  // Destructure results as before
  const {
    seoAnalysis,
    competitorAnalysis,
    marketPotential,
    marketCap,
    recommendations,
    searchTrends,
    socialMedia,
    // businessName is primarily needed for the News query, get it from submittedData
  } = results;
  // Determine the query for NewsSection using submittedData, fallback to industry
  const newsQuery = submittedData?.businessName || industry;

  const firstAvailableTab =
    reportSections.find((s) =>
      // Check if the component expects a query based on isQuerySource
      // Use newsQuery if dataKey is businessName, otherwise check results
      s.isQuerySource
        ? s.dataKey === "businessName"
          ? !!newsQuery
          : !!industry
        : !!results[s.dataKey]
    )?.value || reportSections[0].value;

  return (
    <div className="space-y-6">
      {/* Remove ref={reportRef} */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Analysis Report</h2>
          {/* Remove Export PDF Button */}
        </div>

        {/* Restore original vertical Tabs structure */}
        <Tabs
          defaultValue={firstAvailableTab}
          orientation="vertical"
          className="flex flex-col md:flex-row gap-6 md:gap-8"
        >
          <TabsList className="flex md:flex-col h-auto md:h-full w-full md:w-48 shrink-0 justify-start p-1 bg-muted rounded-lg">
            {reportSections.map((section) => {
              const hasData = section.isQuerySource
                ? !!industry
                : !!results[section.dataKey];
              return (
                hasData && (
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
          <div className="flex-grow min-w-0">
            {reportSections.map((section) => {
              const hasData = section.isQuerySource
                ? !!industry
                : !!results[section.dataKey];
              return (
                hasData && (
                  <TabsContent
                    key={section.value}
                    value={section.value}
                    className="mt-0"
                  >
                    <motion.div
                      key={section.value}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.5 }}
                    >
                      {/* Use the component defined in reportSections */}
                      {section.isSeo ? (
                        <section.component
                          seoAnalysis={results[section.dataKey]}
                        />
                      ) : section.isQuerySource ? (
                        // Pass the determined query value
                        <section.component
                          query={
                            section.dataKey === "businessName"
                              ? newsQuery
                              : industry
                          }
                        />
                      ) : (
                        <section.component data={results[section.dataKey]} />
                      )}
                    </motion.div>
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
        <Card>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center justify-between">
              {/* Updated Footer Title */}
              <CardTitle className="text-sm font-medium flex items-center">
                <BadgeCheck className="mr-2 h-4 w-4 text-primary" /> Business
                Analysis Report
              </CardTitle>
              {/* Removed View Sources button */}
              {/* <Button variant="ghost" size="sm" className="h-7 gap-1">
                <ExternalLink className="h-3.5 w-3.5" />{" "}
                <span className="text-xs">View Sources</span>{" "}
              </Button> */}
            </div>
          </CardHeader>
          <CardFooter className="py-2.5">
            {/* Updated Footer Text */}
            <p className="text-xs text-muted-foreground">
              This report provides a high-level analysis. For a more detailed
              assessment, please consult with professional business analysts.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BusinessAnalysisReport;
