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
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"; // Restore import

const MarketPotentialSection = ({ data }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Simple check if data exists
  const hasData = !!data;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Potential</CardTitle>
        <CardDescription>
          Analysis of market potential and opportunities in the UK market.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants} // Apply animation to the whole content area
          className="prose dark:prose-invert max-w-none text-sm" // Add prose styling for default markdown
        >
          {hasData ? (
            // Revert to using MarkdownRenderer
            <MarkdownRenderer content={data} />
          ) : (
            <p className="text-muted-foreground">
              Market potential data is not available.
            </p>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default MarketPotentialSection;
