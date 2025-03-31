"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const KeyMetricHighlight = ({
  label,
  value,
  icon: Icon,
  unit = "",
  className = "",
}) => {
  if (value === null || value === undefined || value === "") {
    return null; // Don't render if no value
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      <Card className="text-center h-full">
        {" "}
        {/* Removed temporary background */}
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl md:text-3xl font-bold text-primary">
            {value}
            {unit && (
              <span className="text-lg font-medium text-muted-foreground ml-1">
                {unit}
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KeyMetricHighlight;
