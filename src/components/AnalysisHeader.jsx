import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn for conditional classes

const DataItem = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
      <div>
        <span className="text-muted-foreground">{label}:</span>{" "}
        <strong className="ml-1 font-medium text-foreground">{value}</strong>
      </div>
    </div>
  );
};

const AnalysisHeader = ({ apolloData, businessName, website }) => {
  const displayName =
    apolloData?.name || businessName || website || "Business Analysis";
  const displayWebsite = website || apolloData?.primary_domain;

  // Fallback if Apollo data is completely missing
  if (!apolloData) {
    return (
      <Card className="mb-6">
        <CardHeader className="p-4 md:p-6">
          <CardTitle>{displayName}</CardTitle>
          {displayWebsite && (
            <a
              href={
                displayWebsite.startsWith("http")
                  ? displayWebsite
                  : `https://${displayWebsite}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <Globe size={14} /> {displayWebsite} <ExternalLink size={14} />
            </a>
          )}
          <CardDescription className="pt-2">
            Detailed company information from Apollo.io was not available.
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
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="bg-muted/50 p-4 md:p-6">
        <CardTitle className="text-xl md:text-2xl">{displayName}</CardTitle>
        {displayWebsite && (
          <a
            href={
              displayWebsite.startsWith("http")
                ? displayWebsite
                : `https://${displayWebsite}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 pt-1"
          >
            <Globe size={14} /> {displayWebsite} <ExternalLink size={14} />
          </a>
        )}
        {description && (
          <CardDescription className="pt-2 text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
        {/* Column 1: Core Info */}
        <div className="space-y-3">
          <DataItem icon={Building} label="Industry" value={industry} />
          <DataItem
            icon={Users}
            label="Employees"
            value={
              estimated_num_employees
                ? `${estimated_num_employees} (est.)`
                : null
            }
          />
          <DataItem icon={Calendar} label="Founded" value={founded_year} />
          <DataItem
            icon={MapPin}
            label="Location"
            value={city && country ? `${city}, ${country}` : city || country}
          />
        </div>

        {/* Column 2: Financials & Social */}
        <div className="space-y-3">
          <DataItem
            icon={DollarSign}
            label="Revenue"
            value={
              annual_revenue_printed ? `${annual_revenue_printed} (est.)` : null
            }
          />
          <DataItem
            icon={DollarSign}
            label="Total Funding"
            value={total_funding_printed}
          />
          <DataItem
            icon={TrendingUp}
            label="Latest Stage"
            value={latest_funding_stage}
          />
          {/* Social Links */}
          {(linkedin_url || twitter_url || facebook_url) && (
            <div className="flex items-center gap-4 pt-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Share2 size={16} /> Socials:
              </span>
              {linkedin_url && (
                <a
                  href={linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                >
                  <Linkedin
                    size={18}
                    className="text-blue-700 hover:opacity-80"
                  />
                </a>
              )}
              {twitter_url && (
                <a
                  href={twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter/X"
                >
                  <Twitter
                    size={18}
                    className="text-sky-500 hover:opacity-80"
                  />
                </a>
              )}
              {facebook_url && (
                <a
                  href={facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                >
                  <Facebook
                    size={18}
                    className="text-blue-800 hover:opacity-80"
                  />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Column 3: Keywords */}
        {keywords && keywords.length > 0 && (
          <div
            className={cn(
              "space-y-2 rounded-md bg-muted/30 p-3", // Added subtle background and padding
              "md:col-span-2 lg:col-span-1" // Span 2 cols on medium, 1 on large
            )}
          >
            <h4 className="font-medium text-muted-foreground flex items-center gap-2 mb-2">
              <Tags size={16} /> Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {keywords.slice(0, 12).map(
                (
                  keyword // Limit slightly fewer keywords
                ) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="font-normal"
                  >
                    {keyword}
                  </Badge> // Made badge font normal
                )
              )}
              {keywords.length > 12 && <Badge variant="outline">...</Badge>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisHeader;
