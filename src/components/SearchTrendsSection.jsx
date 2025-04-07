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
import { TrendingUp, MapPin, Activity } from "lucide-react"; // Added icons
// Import the basic helpers
import {
  FormattedText,
  JsonList,
  JsonTable,
} from "@/components/ui/JsonRenderHelpers";

// --- Main Component ---

const SearchTrendsSection = ({ data }) => {
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
      {/* <CardHeader>
        <CardTitle>Search Trends</CardTitle>
        <CardDescription>Estimated UK search volume trends and related queries.</CardDescription>
      </CardHeader> */}
      <CardContent className="p-0">
        {hasData ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            {/* Render Volume Trends */}
            {data.volumeTrends && (
              <motion.div variants={itemVariants} custom={0}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.volumeTrends.title || "Search Volume Trends"}
                </h3>
                <JsonTable data={data.volumeTrends} />
              </motion.div>
            )}

            {/* Render Rising Queries */}
            {data.risingQueries && (
              <motion.div variants={itemVariants} custom={1}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.risingQueries.title || "Related Rising Queries"}
                </h3>
                <JsonTable data={data.risingQueries} />
              </motion.div>
            )}

            {/* Render Geographic Interest */}
            {data.geoInterest && (
              <motion.div variants={itemVariants} custom={2}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />{" "}
                  {data.geoInterest.title || "Geographic Interest"}
                </h3>
                <JsonTable data={data.geoInterest} />
              </motion.div>
            )}

            {/* Render Notes */}
            {data.notes && (
              <motion.p
                variants={itemVariants}
                custom={3}
                className="text-xs italic text-muted-foreground mt-4"
              >
                {data.notes}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <div className="prose dark:prose-invert max-w-none text-sm text-center py-4">
            <p className="text-muted-foreground">
              No search trends data available or an error occurred.
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

export default SearchTrendsSection;
