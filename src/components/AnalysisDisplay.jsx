"use client";

import React from "react";
import { motion } from "framer-motion";
import AnalysisHeader from "@/components/AnalysisHeader";
import BusinessAnalysisReport from "@/components/BusinessAnalysisReport";
import { Button } from "@/components/ui/button";
import { Loader2, Download, RotateCcw } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const AnalysisDisplay = ({
  analysisResults,
  submittedFormData,
  onStartNew,
  onExportPdf,
  isExportingPdf,
  isLoading, // Pass general loading state for button disabling
}) => {
  if (!analysisResults || !submittedFormData) {
    // Should ideally not be reached if parent component logic is correct, but good safeguard
    return null;
  }

  return (
    <motion.div
      key="report" // Keep key for AnimatePresence
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <AnalysisHeader
        apolloData={analysisResults?.apolloData}
        businessName={submittedFormData?.businessName}
        website={submittedFormData?.website}
      />
      <BusinessAnalysisReport
        results={analysisResults}
        industry={submittedFormData.industry}
        submittedData={submittedFormData}
        // Note: onStartNew is handled by the button below now
      />
      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={() => onExportPdf(analysisResults, submittedFormData)}
          disabled={isExportingPdf || isLoading} // Disable if main loading or PDF exporting
        >
          {isExportingPdf ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export as PDF
        </Button>
        <Button
          variant="outline" // Changed variant for visual distinction
          onClick={onStartNew}
          disabled={isExportingPdf || isLoading} // Disable if main loading or PDF exporting
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Analysis
        </Button>
      </div>
    </motion.div>
  );
};

export default AnalysisDisplay;
