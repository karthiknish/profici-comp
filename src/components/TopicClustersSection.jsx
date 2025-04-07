"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Info,
  FileText,
  Link2,
  Target,
  Lightbulb,
  Compass,
  Tag,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

// Colors for different cluster categories
const clusterColors = [
  "blue",
  "green",
  "purple",
  "amber",
  "indigo",
  "rose",
  "emerald",
  "fuchsia",
  "orange",
];

// Tooltips for different types of clusters
const clusterTooltips = {
  Product: "Keywords related to your core products or services",
  Service: "Keywords about specific services you offer",
  Industry: "Keywords describing your broader industry",
  Problem: "Keywords describing problems your customers face",
  Solution: "Keywords about solutions you provide",
  Comparison: "Keywords comparing different options or alternatives",
  Location: "Keywords related to geographic areas you serve",
  Feature: "Keywords describing specific features of your offerings",
  Benefit: "Keywords highlighting the benefits of your offerings",
};

// Function to get appropriate icon for cluster name
const getClusterIcon = (clusterName) => {
  const name = clusterName.toLowerCase();

  if (name.includes("product") || name.includes("core"))
    return <Tag className="h-4 w-4" />;
  if (name.includes("service")) return <FileText className="h-4 w-4" />;
  if (name.includes("industry") || name.includes("market"))
    return <Compass className="h-4 w-4" />;
  if (name.includes("problem") || name.includes("challenge"))
    return <Info className="h-4 w-4" />;
  if (name.includes("solution") || name.includes("resolve"))
    return <Lightbulb className="h-4 w-4" />;
  if (name.includes("comparison") || name.includes("competitor"))
    return <Link2 className="h-4 w-4" />;
  if (name.includes("location") || name.includes("region"))
    return <Target className="h-4 w-4" />;
  if (name.includes("feature")) return <Zap className="h-4 w-4" />;
  if (name.includes("benefit") || name.includes("advantage"))
    return <ArrowUpRight className="h-4 w-4" />;

  return <Layers className="h-4 w-4" />; // Default icon
};

// Function to get color class based on cluster index
const getColorClass = (index) => {
  const colorName = clusterColors[index % clusterColors.length];
  return {
    card: `border-${colorName}-200 dark:border-${colorName}-900`,
    bg: `bg-${colorName}-50 dark:bg-${colorName}-900/20`,
    text: `text-${colorName}-700 dark:text-${colorName}-300`,
    badge: `bg-${colorName}-100 text-${colorName}-800 dark:bg-${colorName}-900/30 dark:text-${colorName}-300 border-${colorName}-200 dark:border-${colorName}-800/60`,
    hover: `hover:bg-${colorName}-100 dark:hover:bg-${colorName}-900/40`,
  };
};

// Component to render each cluster
const ClusterCard = ({ cluster, index }) => {
  const clusterTypeGuess = cluster.clusterName.split(" ")[0];
  const tooltip =
    clusterTooltips[clusterTypeGuess] ||
    "Keywords grouped by semantic relationship";
  const colorClass = getColorClass(index);
  const icon = getClusterIcon(cluster.clusterName);

  return (
    <Card className={`overflow-hidden shadow-sm border ${colorClass.card}`}>
      <div className={`px-4 py-3 ${colorClass.bg} border-b ${colorClass.card}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="font-medium">{cluster.clusterName}</h4>
          </div>
          <Badge variant="outline" className="text-xs">
            {cluster.keywords?.length || 0} keywords
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{tooltip}</p>
      </div>
      <CardContent className="p-4">
        {Array.isArray(cluster.keywords) && cluster.keywords.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {cluster.keywords.map((kw, kwIndex) => (
              <Badge
                key={kwIndex}
                className={`px-2 py-1 font-normal ${colorClass.badge} ${colorClass.hover}`}
                variant="outline"
              >
                {kw}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No keywords in this cluster.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const TopicClustersSection = ({ clusters, isLoading, error, customIndex }) => {
  const title = "Keyword Topic Clusters";
  const description = "Keywords grouped into logical themes based on analysis.";

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card className="w-full shadow-sm border bg-white dark:bg-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <div className="mt-0.5">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">
                  Why Topic Clusters Matter
                </h4>
                <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                  Topic clusters group related keywords together, helping you
                  organize content strategy and demonstrate topical authority to
                  search engines. Each cluster represents a content pillar you
                  can build comprehensive content around.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-start gap-1.5">
                    <Target className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-700/80 dark:text-blue-300/80">
                      Build content pillars around each topic
                    </p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-700/80 dark:text-blue-300/80">
                      Internal linking between related content
                    </p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-700/80 dark:text-blue-300/80">
                      Boost SEO through semantic relevance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden border shadow-sm">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-2/3 mt-1" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-28" />
                      <Skeleton className="h-6 w-22" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Info className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-300">
                    Error Loading Topic Clusters
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {!isLoading &&
            !error &&
            Array.isArray(clusters) &&
            clusters.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clusters.map((cluster, index) => (
                    <ClusterCard key={index} cluster={cluster} index={index} />
                  ))}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-6 border">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    How to Use These Clusters
                  </h4>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="inline-block h-4 w-4 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] flex items-center justify-center font-semibold mt-0.5">
                        1
                      </span>
                      <span>
                        Create a dedicated pillar page for each major cluster
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block h-4 w-4 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] flex items-center justify-center font-semibold mt-0.5">
                        2
                      </span>
                      <span>
                        Develop supporting content using the specific keywords
                        within each cluster
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block h-4 w-4 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] flex items-center justify-center font-semibold mt-0.5">
                        3
                      </span>
                      <span>
                        Link between related content pieces to build topic
                        authority
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

          {!isLoading &&
            !error &&
            (!Array.isArray(clusters) || clusters.length === 0) && (
              <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-800/30">
                <Layers className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600 mb-2" />
                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                  No Topic Clusters Generated
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
                  We couldn't generate topic clusters for your keywords. This
                  might be due to having too few keywords or keywords that are
                  too diverse to form meaningful clusters.
                </p>
              </div>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopicClustersSection;
