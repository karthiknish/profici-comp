"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import BusinessAnalysisForm from "@/components/BusinessAnalysisForm";
import AnalysisDisplay from "@/components/AnalysisDisplay";
import { Loader2 } from "lucide-react";

// Animation variants (can be defined here or passed as props)
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const AnalysisViewManager = ({
  analysisResults,
  submittedFormData,
  isLoading, // Initial load check state
  isGenerating, // API/Polling state
  isExportingPdf,
  error,
  handleSubmit,
  handleStartNewAnalysis,
  handleExportPdf,
}) => {
  // Note: isLoading from the hook now primarily indicates the initial localStorage check.
  // isGenerating indicates the actual analysis process (API calls, polling).

  // Show initial loader only if isLoading (checking storage) is true
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {/* Show Form if no results AND not currently generating AND no error */}
      {!analysisResults && !isGenerating && !error && (
        <motion.div
          key="form"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <BusinessAnalysisForm
            onSubmit={handleSubmit}
            isLoading={isGenerating} // Disable form while generating
          />
        </motion.div>
      )}

      {/* Show Loading State only when generating */}
      {isGenerating && (
        <motion.div
          key="generating"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Processing report... This may take a few minutes.
          </p>
          <p className="text-sm text-muted-foreground">
            Please wait, fetching and analyzing data.
          </p>
        </motion.div>
      )}

      {/* Show Error State only when not generating */}
      {error && !isGenerating && (
        <motion.div
          key="error"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-2xl mx-auto p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg my-6"
        >
          <p className="font-medium">Error: {error}</p>
          <button
            onClick={handleStartNewAnalysis} // Use the handler from the hook
            className="mt-2 text-sm underline hover:text-red-500"
          >
            Start New Analysis
          </button>
        </motion.div>
      )}

      {/* Show Report */}
      {analysisResults && submittedFormData && !error && !isGenerating && (
        <AnalysisDisplay
          analysisResults={analysisResults}
          submittedFormData={submittedFormData}
          onStartNew={handleStartNewAnalysis}
          onExportPdf={handleExportPdf}
          isExportingPdf={isExportingPdf}
          isLoading={isGenerating} // Pass isGenerating for button states
        />
      )}
    </AnimatePresence>
  );
};

export default AnalysisViewManager;
