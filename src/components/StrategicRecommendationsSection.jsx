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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Target,
  BarChart2,
  Users,
  Briefcase,
  DollarSign,
  Settings,
  Star,
  Calendar,
  TrendingUp,
  ArrowUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  BarChart,
  LineChart,
  MessageCircle,
} from "lucide-react";
// Import the basic helpers
import {
  FormattedText,
  JsonList,
  JsonTable,
} from "@/components/ui/JsonRenderHelpers";
import RoadmapPhaseCard from "./RoadmapPhaseCard";

// --- Specific Rendering Components ---

const RenderCSuite = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  // Role-specific color and icon mapping
  const roleConfig = {
    CEO: {
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800/50",
    },
    CMO: {
      icon: <Target className="h-5 w-5 text-green-600" />,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800/50",
    },
    "CTO/CIO": {
      icon: <Settings className="h-5 w-5 text-purple-600" />,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800/50",
    },
    CFO: {
      icon: <DollarSign className="h-5 w-5 text-amber-600" />,
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800/50",
    },
    COO: {
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800/50",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((roleData, idx) => {
        const config = roleConfig[roleData.role] || {
          icon: <Briefcase className="h-5 w-5 text-gray-600" />,
          bgColor: "bg-gray-50 dark:bg-gray-800/50",
          borderColor: "border-gray-200 dark:border-gray-700/50",
        };

        return (
          <Card key={idx} className="overflow-hidden shadow-sm border">
            <div
              className={`px-4 py-3 ${config.bgColor} border-b ${config.borderColor}`}
            >
              <div className="flex items-center gap-2">
                {config.icon}
                <h4 className="font-medium">{roleData.role}</h4>
              </div>
            </div>
            <CardContent className="p-4">
              {roleData.focus && (
                <div className="mb-3">
                  <h5 className="text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Strategic Focus
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <FormattedText text={roleData.focus} />
                  </p>
                </div>
              )}

              {Array.isArray(roleData.actions) &&
                roleData.actions.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      Key Actions
                    </h5>
                    <div className="space-y-1">
                      {roleData.actions.map((action, actionIdx) => (
                        <div key={actionIdx} className="flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            <FormattedText text={action} />
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {Array.isArray(roleData.challenges) &&
                roleData.challenges.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      Potential Challenges
                    </h5>
                    <div className="space-y-1">
                      {roleData.challenges.map((challenge, challengeIdx) => (
                        <div
                          key={challengeIdx}
                          className="flex items-start gap-2"
                        >
                          <ArrowRight className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            <FormattedText text={challenge} />
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Enhanced Roadmap Phase Card
const EnhancedRoadmapPhaseCard = ({ phase, index }) => {
  // Map phase names to color schemes and icons
  const phaseColors = {
    "Phase 1": {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      title: "Short-Term",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800/50",
      badgeBg: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    "Phase 2": {
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
      title: "Mid-Term",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800/50",
      badgeBg: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    "Phase 3": {
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      title: "Long-Term",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800/50",
      badgeBg: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-300",
    },
  };

  // Use phase-specific colors or fallback to defaults
  const colors = phaseColors[phase.phase] || {
    icon: <Calendar className="h-5 w-5 text-gray-600" />,
    title: phase.phase,
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    borderColor: "border-gray-200 dark:border-gray-700/50",
    badgeBg: "bg-gray-100 dark:bg-gray-800/70",
    textColor: "text-gray-700 dark:text-gray-300",
  };

  // Calculate effort and impact
  const getEffortImpactColor = (value) => {
    if (!value) return "bg-gray-100 text-gray-700";
    const valueLower = value.toLowerCase();
    if (valueLower.includes("high"))
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    if (valueLower.includes("medium"))
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    if (valueLower.includes("low"))
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <Card className="overflow-hidden shadow-sm border">
      <div
        className={`px-4 py-3 ${colors.bgColor} border-b ${colors.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {colors.icon}
            <h4 className={`font-medium ${colors.textColor}`}>{phase.phase}</h4>
          </div>
          {phase.timeline && (
            <Badge
              variant="outline"
              className={`text-xs ${colors.textColor} ${colors.badgeBg} border-0`}
            >
              {phase.timeline}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          {Array.isArray(phase.actions) &&
            phase.actions.map((action, idx) => {
              // Check if action is an object with properties or just a string
              const actionText =
                typeof action === "object" ? action.action : action;
              const effort = typeof action === "object" ? action.effort : null;
              const impact = typeof action === "object" ? action.impact : null;

              const effortClass = getEffortImpactColor(effort);
              const impactClass = getEffortImpactColor(impact);

              return (
                <div
                  key={idx}
                  className="border-b border-dashed pb-3 last:border-b-0 last:pb-0"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {actionText}
                  </p>

                  {(effort || impact) && (
                    <div className="flex items-center gap-2 mt-2">
                      {effort && (
                        <Badge
                          className={`text-xs px-2 py-0.5 ${effortClass} border-0`}
                        >
                          Effort: {effort}
                        </Badge>
                      )}
                      {impact && (
                        <Badge
                          className={`text-xs px-2 py-0.5 ${impactClass} border-0`}
                        >
                          Impact: {impact}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Accordion for Digital Marketing Roadmap
const EnhancedRoadmapAccordion = ({ data }) => {
  if (!data) return null;

  // Icons for different roadmap sections
  const sectionIcons = {
    seo: <LineChart className="h-5 w-5 text-blue-600" />,
    socialMedia: <MessageCircle className="h-5 w-5 text-purple-600" />,
    paidMedia: <DollarSign className="h-5 w-5 text-green-600" />,
  };

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="seo"
      >
        {Object.entries(data).map(([key, value]) => {
          // Skip the title field
          if (key === "title") return null;

          const icon = sectionIcons[key] || (
            <BarChart className="h-5 w-5 text-gray-600" />
          );
          const sectionTitle =
            value?.title ||
            key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1");

          return (
            <AccordionItem
              key={key}
              value={key}
              className="border rounded-lg mb-3 overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 text-base font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  {icon}
                  <span>{sectionTitle}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4 border-t">
                <JsonTable data={value} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

// ROI Projections Table Enhancement
const EnhancedROITable = ({ data }) => {
  if (!data) return null;

  return (
    <Card className="overflow-hidden shadow-sm border">
      <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800/50">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-medium text-emerald-700 dark:text-emerald-300">
            {data.title || "ROI Projections"}
          </h4>
        </div>
      </div>
      <CardContent className="p-0">
        <JsonTable data={data} />
      </CardContent>
    </Card>
  );
};

// --- Main Component ---

const StrategicRecommendationsSection = ({ data }) => {
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
          <Lightbulb className="h-5 w-5 text-primary" />
          Strategic Recommendations
        </CardTitle>
        <CardDescription>
          Actionable recommendations based on comprehensive analysis for the UK
          market.
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
            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">
                    Strategic Implementation Guide
                  </h4>
                  <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                    These recommendations are based on in-depth analysis of your
                    business, market, and competitors. Each section provides
                    actionable insights designed to maximize your business
                    growth in the UK market.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-start gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-700/80 dark:text-blue-300/80">
                        Follow the phased implementation timeline
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Target className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-700/80 dark:text-blue-300/80">
                        Focus on high-impact, low-effort actions first
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <ArrowUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-700/80 dark:text-blue-300/80">
                        Review and adjust strategy quarterly
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            {data.executiveSummary && (
              <motion.div variants={itemVariants} custom={0}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.executiveSummary.title || "Executive Summary"}
                </h3>
                <Card className="overflow-hidden shadow-sm border">
                  <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-b">
                    <h4 className="font-medium">Strategic Overview</h4>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {data.executiveSummary.priorities && (
                        <div>
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Top Priorities
                          </h5>
                          <div className="grid gap-2">
                            {data.executiveSummary.priorities.map(
                              (priority, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border"
                                >
                                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-primary">
                                      {idx + 1}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <FormattedText text={priority} />
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {data.executiveSummary.outcomes && (
                        <div>
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <BarChart className="h-4 w-4 text-green-600" />
                            Expected Outcomes (12 Months)
                          </h5>
                          <div className="space-y-2">
                            {data.executiveSummary.outcomes.map(
                              (outcome, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <FormattedText text={outcome} />
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {data.executiveSummary.timeline && (
                        <div>
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            Implementation Timeline
                          </h5>
                          <p className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800/30">
                            <FormattedText
                              text={data.executiveSummary.timeline}
                            />
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Digital Marketing Roadmap */}
            {data.digitalMarketingRoadmap && (
              <motion.div variants={itemVariants} custom={1}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.digitalMarketingRoadmap.title ||
                    "Digital Marketing Roadmap"}
                </h3>
                <EnhancedRoadmapAccordion data={data.digitalMarketingRoadmap} />
              </motion.div>
            )}

            {/* C-Suite Initiatives */}
            {data.cSuiteInitiatives?.roles && (
              <motion.div variants={itemVariants} custom={2}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.cSuiteInitiatives.title || "C-Suite Initiatives"}
                </h3>
                <RenderCSuite data={data.cSuiteInitiatives.roles} />
              </motion.div>
            )}

            {/* Implementation Roadmap */}
            {data.implementationRoadmap?.phases && (
              <motion.div variants={itemVariants} custom={3}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.implementationRoadmap.title || "Implementation Roadmap"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.implementationRoadmap.phases.map((phase, index) => (
                    <EnhancedRoadmapPhaseCard
                      key={index}
                      phase={phase}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ROI Projections */}
            {data.roiProjections && (
              <motion.div variants={itemVariants} custom={4}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.roiProjections.title || "ROI Projections"}
                </h3>
                <EnhancedROITable data={data.roiProjections} />
              </motion.div>
            )}

            {/* ADDED: Strategic Technology & Data Opportunities */}
            {data.advantageOpportunities?.opportunities && (
              <motion.div variants={itemVariants} custom={5}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.advantageOpportunities.title ||
                    "Strategic Technology & Data Opportunities"}
                </h3>
                <div className="space-y-4">
                  {data.advantageOpportunities.opportunities.map(
                    (item, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden shadow-sm border"
                      >
                        <div className="px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800/50">
                          <h4 className="font-medium text-purple-700 dark:text-purple-300">
                            Opportunity {index + 1}:{" "}
                            <FormattedText text={item.opportunity} />
                          </h4>
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <h5 className="text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                              <Target className="h-3.5 w-3.5 text-gray-500" />
                              Strategic Action (CTO/CIO)
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <FormattedText text={item.strategicAction} />
                            </p>
                          </div>
                          <div>
                            <h5 className="text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                              Competitive Edge
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <FormattedText text={item.competitiveEdge} />
                            </p>
                          </div>
                          {item.relevantTech &&
                            item.relevantTech.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                  <Settings className="h-3.5 w-3.5 text-purple-500" />
                                  Relevant Technologies
                                </h5>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.relevantTech.map((tech, techIdx) => (
                                    <Badge
                                      key={techIdx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </motion.div>
            )}

            {/* Best Practices */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-6 border">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Implementation Best Practices
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>
                    Establish clear ownership for each initiative with specific
                    KPIs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>
                    Hold regular progress reviews with key stakeholders
                    (bi-weekly recommended)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>
                    Be prepared to adjust strategy based on performance data and
                    market changes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>
                    Document learnings and outcomes to inform future strategic
                    planning
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-800/30">
            <Lightbulb className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600 mb-2" />
            <h4 className="font-medium text-gray-700 dark:text-gray-300">
              No Recommendations Available
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
              We couldn't generate strategic recommendations based on your data.
              This might be because we need more information about your business
              or market conditions.
            </p>
            {data?.error && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-4 max-w-md mx-auto">
                Error: {data.error}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StrategicRecommendationsSection;
