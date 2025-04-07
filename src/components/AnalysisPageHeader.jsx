"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // Removed Trash2
// Removed toast import

const AnalysisPageHeader = () => {
  // Removed onClearStorage prop
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Competitive Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Powered by Profici.</p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>
      {/* Removed conditional Clear Storage button */}
    </motion.header>
  );
};

export default AnalysisPageHeader;
