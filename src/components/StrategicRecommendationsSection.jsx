"use client";

import React from "react"; // Removed useState
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Remove unused imports: Accordion, Tabs, Badge, specific icons if not used in MarkdownRenderer
import { Lightbulb } from "lucide-react";
// Remove parsing utils as we render the whole block
// import { ... } from "@/utils/parsing";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"; // Restore MarkdownRenderer

const StrategicRecommendationsSection = ({ data }) => {
  // No parsing needed here anymore, just pass the raw data prop

  // Determine if we should show a message or empty state
  const showContent =
    data && typeof data === "string" && data.trim().length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          {" "}
          {/* Added flex items-center */}
          <Lightbulb className="mr-2 h-5 w-5 text-primary" /> {/* Added Icon */}
          Strategic Recommendations
        </CardTitle>
        <CardDescription>
          Actionable recommendations tailored for your business (UK Focus).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showContent ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>Recommendation data not available.</p> {/* Simplified message */}
          </div>
        ) : (
          // Revert to rendering the entire recommendations markdown content directly
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="prose dark:prose-invert max-w-none" // Apply prose for basic markdown styling
          >
            <MarkdownRenderer content={data} />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default StrategicRecommendationsSection;
