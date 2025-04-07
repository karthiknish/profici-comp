import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Linkedin,
  Twitter,
  Facebook,
  Globe,
  Building,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  TrendingUp,
  Tags,
  Share2,
  Info,
  Award,
  BarChart,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn for conditional classes

const DataItem = ({ icon: Icon, label, value, color = "blue" }) => {
  if (!value) return null;

  const colorVariants = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30 text-blue-700 dark:text-blue-300",
    indigo:
      "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30 text-purple-700 dark:text-purple-300",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30 text-green-700 dark:text-green-300",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30 text-amber-700 dark:text-amber-300",
  };

  const iconColorVariants = {
    blue: "text-blue-600 dark:text-blue-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
    purple: "text-purple-600 dark:text-purple-400",
    green: "text-green-600 dark:text-green-400",
    amber: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div
      className={`p-3 rounded-lg border ${colorVariants[color]} flex items-start gap-3`}
    >
      <Icon
        size={18}
        className={`mt-0.5 flex-shrink-0 ${iconColorVariants[color]}`}
      />
      <div>
        <p className="text-xs font-medium opacity-80 mb-1">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

// Social media button component
const SocialButton = ({ href, icon: Icon, label, color }) => {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${color} hover:opacity-90`}
    >
      <Icon size={16} />
      {label}
    </a>
  );
};

const AnalysisHeader = ({ apolloData, businessName, website }) => {
  const displayName =
    apolloData?.name || businessName || website || "Business Analysis";
  const displayWebsite = website || apolloData?.primary_domain;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Fallback if Apollo data is completely missing
  if (!apolloData) {
    return (
      <Card className="mb-6 shadow-sm border bg-white dark:bg-gray-900">
        <CardHeader className="p-5 md:p-6 border-b">
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            {displayName}
          </CardTitle>
          {displayWebsite && (
            <a
              href={
                displayWebsite.startsWith("http")
                  ? displayWebsite
                  : `https://${displayWebsite}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
            >
              <Globe size={14} /> {displayWebsite} <ExternalLink size={14} />
            </a>
          )}
          <CardDescription className="pt-3">
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md border border-amber-100 dark:border-amber-800/30">
              <Info
                size={16}
                className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400"
              />
              Detailed company information from Apollo.io was not available.
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Destructure available data from Apollo
  const {
    description,
    industry,
    keywords,
    estimated_num_employees,
    annual_revenue_printed,
    total_funding_printed,
    latest_funding_stage,
    founded_year,
    city,
    country,
    linkedin_url,
    twitter_url,
    facebook_url,
  } = apolloData;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="mb-6 shadow-md border bg-white dark:bg-gray-900 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/5 to-primary/20 dark:from-primary/20 dark:to-primary/40 p-5 md:p-6 border-b">
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between gap-4"
          >
            <div>
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                {displayName}
              </CardTitle>
              {displayWebsite && (
                <a
                  href={
                    displayWebsite.startsWith("http")
                      ? displayWebsite
                      : `https://${displayWebsite}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1.5"
                >
                  <Globe size={14} /> {displayWebsite}{" "}
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {linkedin_url && (
                <SocialButton
                  href={linkedin_url}
                  icon={Linkedin}
                  label="LinkedIn"
                  color="bg-[#0A66C2] text-white"
                />
              )}
              {twitter_url && (
                <SocialButton
                  href={twitter_url}
                  icon={Twitter}
                  label="Twitter"
                  color="bg-[#1DA1F2] text-white"
                />
              )}
              {facebook_url && (
                <SocialButton
                  href={facebook_url}
                  icon={Facebook}
                  label="Facebook"
                  color="bg-[#1877F2] text-white"
                />
              )}
            </div>
          </motion.div>

          {description && (
            <motion.div variants={itemVariants} className="mt-4">
              <div className="p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {description}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <CardContent className="p-5 md:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              Company Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <motion.div variants={itemVariants}>
                <DataItem
                  icon={Building}
                  label="Industry"
                  value={industry}
                  color="indigo"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DataItem
                  icon={Users}
                  label="Employees"
                  value={
                    estimated_num_employees
                      ? `${estimated_num_employees} (est.)`
                      : null
                  }
                  color="blue"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DataItem
                  icon={Calendar}
                  label="Founded"
                  value={founded_year}
                  color="amber"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DataItem
                  icon={MapPin}
                  label="Location"
                  value={
                    city && country ? `${city}, ${country}` : city || country
                  }
                  color="green"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DataItem
                  icon={DollarSign}
                  label="Annual Revenue"
                  value={
                    annual_revenue_printed
                      ? `${annual_revenue_printed} (est.)`
                      : null
                  }
                  color="purple"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DataItem
                  icon={DollarSign}
                  label="Total Funding"
                  value={total_funding_printed}
                  color="green"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DataItem
                  icon={TrendingUp}
                  label="Latest Funding Stage"
                  value={latest_funding_stage}
                  color="blue"
                />
              </motion.div>
            </div>
          </div>

          {/* Keywords Section */}
          {keywords && keywords.length > 0 && (
            <motion.div variants={itemVariants} className="mt-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Tags className="mr-2 h-5 w-5 text-primary" />
                Business Keywords
              </h3>

              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50 py-1.5"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 dark:bg-gray-800/30 p-4 flex justify-between items-center border-t">
          <div className="mt-2 text-sm text-muted-foreground">
            {/* Removed Apollo attribution */}
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            <BarChart size={14} className="mr-1" />
            View Full Analysis
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AnalysisHeader;
