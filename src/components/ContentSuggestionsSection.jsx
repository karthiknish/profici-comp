import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  FileText,
  PenTool,
  Target,
  CheckCircle2,
  Info,
  Search,
  Users,
  ArrowRight,
  Clock,
  Eye,
  ShoppingCart,
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

// Get appropriate icon for user intent
const getIntentIcon = (intent) => {
  if (!intent) return <Info className="h-4 w-4 text-gray-500" />;

  const intentLower = intent.toLowerCase();
  if (intentLower.includes("informational"))
    return <Info className="h-4 w-4 text-blue-500" />;
  if (intentLower.includes("commercial"))
    return <ShoppingCart className="h-4 w-4 text-green-500" />;
  if (intentLower.includes("transactional"))
    return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
  if (intentLower.includes("navigational"))
    return <Search className="h-4 w-4 text-amber-500" />;

  return <Info className="h-4 w-4 text-gray-500" />;
};

// Get color class based on intent
const getIntentColorClass = (intent) => {
  if (!intent)
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  const intentLower = intent.toLowerCase();
  if (intentLower.includes("informational"))
    return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200";
  if (intentLower.includes("commercial"))
    return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200";
  if (intentLower.includes("transactional"))
    return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200";
  if (intentLower.includes("navigational"))
    return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200";

  return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
};

// Content type suggestion examples
const contentTypes = [
  {
    type: "Blog Post",
    icon: <PenTool className="h-5 w-5 text-indigo-500" />,
    description: "In-depth articles targeting informational keywords",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800/50",
    textColor: "text-indigo-700 dark:text-indigo-300",
  },
  {
    type: "Product Page",
    icon: <ShoppingCart className="h-5 w-5 text-green-500" />,
    description: "Detailed pages targeting commercial keywords",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800/50",
    textColor: "text-green-700 dark:text-green-300",
  },
  {
    type: "Landing Page",
    icon: <Target className="h-5 w-5 text-rose-500" />,
    description: "Conversion-focused pages for specific campaigns",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    borderColor: "border-rose-200 dark:border-rose-800/50",
    textColor: "text-rose-700 dark:text-rose-300",
  },
  {
    type: "Guide/Tutorial",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
    description: "Comprehensive resources showing expertise",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800/50",
    textColor: "text-blue-700 dark:text-blue-300",
  },
];

// Component to render a single content suggestion
const ContentSuggestionCard = ({ suggestion, index }) => {
  const intentIcon = getIntentIcon(suggestion.userIntent);
  const intentColorClass = getIntentColorClass(suggestion.userIntent);

  // Determine a content type based on title and intent
  let contentTypeGuess = contentTypes[0]; // Default to blog post
  const title = suggestion.title.toLowerCase();
  const intent = (suggestion.userIntent || "").toLowerCase();

  if (
    intent.includes("transactional") ||
    title.includes("buy") ||
    title.includes("purchase")
  ) {
    contentTypeGuess = contentTypes[1]; // Product page
  } else if (
    title.includes("guide") ||
    title.includes("how to") ||
    title.includes("tutorial")
  ) {
    contentTypeGuess = contentTypes[3]; // Guide
  } else if (
    title.includes("ultimate") ||
    title.includes("complete") ||
    intent.includes("commercial")
  ) {
    contentTypeGuess = contentTypes[2]; // Landing page
  }

  return (
    <Card className="overflow-hidden shadow-sm border">
      <div
        className={`px-4 py-3 ${contentTypeGuess.bgColor} border-b ${contentTypeGuess.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {contentTypeGuess.icon}
            <h4 className={`font-medium ${contentTypeGuess.textColor}`}>
              {suggestion.title}
            </h4>
          </div>
          {suggestion.userIntent && (
            <Badge
              variant="outline"
              className={`text-xs rounded-full px-2 py-0.5 ${intentColorClass}`}
            >
              <div className="flex items-center gap-1">
                {intentIcon}
                <span>{suggestion.userIntent}</span>
              </div>
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        {suggestion.rationale && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {suggestion.rationale}
          </p>
        )}

        {Array.isArray(suggestion.targetKeywords) &&
          suggestion.targetKeywords.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-gray-500" />
                Target Keywords:
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {suggestion.targetKeywords.map((kw, kwIndex) => (
                  <Badge
                    key={kwIndex}
                    variant="outline"
                    className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        <div className="mt-4 pt-3 border-t flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 italic">
            Content Suggestion #{index + 1}
          </span>
          <Badge className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
            {contentTypeGuess.type}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const ContentSuggestionsSection = ({
  suggestions,
  isLoading,
  error,
  customIndex,
}) => {
  const title = "Content Strategy Suggestions";
  const description =
    "Actionable content ideas based on keyword gaps and content analysis.";

  return (
    <motion.div variants={itemVariants} custom={customIndex}>
      <Card className="w-full shadow-sm border bg-white dark:bg-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <div className="mt-0.5">
                <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-amber-700 dark:text-amber-300">
                  Content Strategy Guide
                </h4>
                <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
                  These content ideas are generated based on your Content
                  Analysis and Keyword Gap Analysis to address identified
                  opportunities. Each suggestion targets specific user intent
                  and keywords to maximize your content's impact.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-700/80 dark:text-amber-300/80">
                      Create a content calendar with these suggestions
                    </p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-700/80 dark:text-amber-300/80">
                      Address different user intents in your content mix
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden border shadow-sm">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="pt-3 border-t flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
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
                    Error Loading Content Suggestions
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
            Array.isArray(suggestions) &&
            suggestions.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {suggestions.map((suggestion, index) => (
                    <ContentSuggestionCard
                      key={index}
                      suggestion={suggestion}
                      index={index}
                    />
                  ))}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-6 border">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Content Strategy Best Practices
                  </h4>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>
                        Focus on quality over quantity - prioritize the
                        suggestions most relevant to your audience
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>
                        Use primary keywords in title, headings, and naturally
                        throughout the content
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>
                        Consider the user intent when structuring your content
                        format and calls-to-action
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span>
                        Link to related content pieces within your site to build
                        topical authority
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

          {!isLoading &&
            !error &&
            (!Array.isArray(suggestions) || suggestions.length === 0) && (
              <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-800/30">
                <PenTool className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600 mb-2" />
                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                  No Content Suggestions Generated
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
                  We couldn't generate content suggestions based on your data.
                  This might be because we need more information about your
                  content gaps or keyword opportunities.
                </p>
              </div>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentSuggestionsSection;
