"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import AnalysisViewManager from "@/components/AnalysisViewManager";
import AnalysisPageHeader from "@/components/AnalysisPageHeader";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { useAnalysisLogic } from "@/hooks/useAnalysisLogic";

export default function AnalysisPage() {
  const router = useRouter(); // Keep router if needed for other purposes
  const [isClient, setIsClient] = useState(false);
  // Removed hasAccess state

  // Use the custom hook to manage all analysis-related state and logic
  const analysisLogic = useAnalysisLogic();

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
    // Removed localStorage check and hasAccess logic
  }, []); // Run only once on mount

  // Render placeholder or loading until client has mounted
  // Removed analysisLogic.isLoading check as it's no longer relevant for localStorage
  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Removed !hasAccess check

  // Main component render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Removed onClearStorage prop */}
        <AnalysisPageHeader />
        {/* Main Content Area - Rendered by AnalysisViewManager */}
        <div className="bg-background dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
          <AnalysisViewManager {...analysisLogic} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
