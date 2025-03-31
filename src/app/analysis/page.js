"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BusinessAnalysisForm from "@/components/BusinessAnalysisForm";
import BusinessAnalysisReport from "@/components/BusinessAnalysisReport";
import AnalysisHeader from "@/components/AnalysisHeader"; // Import the new header component
import { Toaster, toast } from "sonner";
import { Loader2 } from "lucide-react";

// Helper function for polling delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AnalysisPage() {
  const router = useRouter();
  const [analysisResults, setAnalysisResults] = useState(null);
  const [submittedFormData, setSubmittedFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [insitesReportId, setInsitesReportId] = useState(null);
  const pollingTimeoutRef = useRef(null);
  const isMountedRef = useRef(true); // Ref to track mount status

  // Check for email in localStorage on mount & set mount status
  useEffect(() => {
    isMountedRef.current = true; // Set mounted on mount
    const storedEmail = localStorage.getItem("businessAnalysisEmail");
    if (!storedEmail) {
      router.replace("/");
    } else {
      setHasAccess(true);
    }
    // Cleanup function to set false on unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [router]);

  // --- Function to fetch Gemini Analysis ---
  const fetchGeminiAnalysis = useCallback(
    async (originalFormData, insitesData) => {
      console.log(">>> fetchGeminiAnalysis started.");
      // setIsLoading(true); // Loading is already true when this is called

      try {
        const payloadForGemini = {
          email: originalFormData.email,
          website: insitesData?.report?.domain,
          detectedName: insitesData?.report?.meta?.detected_name,
          detectedPhone: insitesData?.report?.contact_details?.phones?.[0],
          detectedEmail: insitesData?.report?.contact_details?.emails?.[0],
          detectedIndustry: insitesData?.report?.meta?.primary_industry,
          insitesReport: insitesData?.report,
          competitors: originalFormData.competitors,
        };

        console.log(
          ">>> Calling /api/analysis with derived payload:",
          payloadForGemini
        );
        const analysisResponse = await fetch("/api/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadForGemini),
        });
        console.log(">>> /api/analysis fetch call returned.");

        // Check mount status *before* setting state
        if (!isMountedRef.current) return;

        if (!analysisResponse.ok) {
          console.error(
            ">>> /api/analysis response not OK:",
            analysisResponse.status
          );
          const errorData = await analysisResponse.json();
          setError(errorData.error || "Failed to generate Gemini analysis");
        } else {
          console.log(">>> /api/analysis response OK. Parsing JSON...");
          const analysisData = await analysisResponse.json();
          console.log(">>> /api/analysis JSON parsed successfully.");
          setAnalysisResults(analysisData);
        }
      } catch (err) {
        console.error("Error during Gemini analysis fetch:", err);
        if (isMountedRef.current) {
          setError(
            err.message || "An error occurred while generating the analysis"
          );
        }
      } finally {
        // Ensure loading stops ONLY if the component is still mounted
        if (isMountedRef.current) {
          console.log(
            ">>> fetchGeminiAnalysis finally block: Setting isLoading=false."
          );
          setIsLoading(false);
        }
      }
    },
    [setError, setAnalysisResults, setIsLoading] // Include setters
  );

  // --- Polling Function defined outside useEffect but wrapped in useCallback ---
  const poll = useCallback(async () => {
    // Use isMountedRef.current instead of isMounted closure variable
    if (!isMountedRef.current || !isLoading || !insitesReportId) {
      console.log(
        ">>> Polling stopped: Component unmounted, loading finished, or no report ID."
      );
      return; // Stop polling
    }

    console.log(`Polling report ID: ${insitesReportId}`);
    try {
      const response = await fetch(`/api/insites-report/${insitesReportId}`);

      if (!isMountedRef.current) return; // Check mount status after await

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }
      const data = await response.json();

      console.log(`Poll status for ${insitesReportId}: ${data.status}`);

      if (data.status === "success") {
        console.log(">>> Status is 'success'. Attempting fetchGeminiAnalysis.");
        // fetchGeminiAnalysis will handle setting isLoading to false in its finally block
        await fetchGeminiAnalysis(submittedFormData, data);
        console.log(
          ">>> fetchGeminiAnalysis call finished successfully within poll."
        );
        // Stop polling by not scheduling next timeout
      } else if (["running", "pending", "testing"].includes(data.status)) {
        console.log(`>>> Status is '${data.status}'. Scheduling next poll.`);
        // Clear previous timeout just in case before setting a new one
        if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = setTimeout(poll, 10000); // Schedule next poll
      } else {
        // Failed or error status
        throw new Error(`Insites report failed with status: ${data.status}`);
      }
    } catch (err) {
      console.error("Polling error:", err);
      if (isMountedRef.current) {
        setError(`Error checking Insites report status: ${err.message}`);
        setIsLoading(false); // Stop loading on poll error
      }
    }
  }, [
    isLoading,
    insitesReportId,
    submittedFormData,
    fetchGeminiAnalysis,
    setError,
    setIsLoading,
  ]); // Dependencies for poll

  // --- useEffect for Polling ---
  useEffect(() => {
    // Start polling only when insitesReportId is set and we are loading
    if (insitesReportId && isLoading) {
      console.log(">>> Polling useEffect: Starting initial poll.");
      poll(); // Start the first poll using the memoized function
    }

    // Cleanup function for timeout
    return () => {
      console.log(">>> Polling useEffect cleanup: Clearing timeout.");
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [insitesReportId, isLoading, poll]); // Depend on the memoized poll function

  // --- Original handleSubmit ---
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);
    setSubmittedFormData(null);
    setInsitesReportId(null);

    try {
      const storedEmail = localStorage.getItem("businessAnalysisEmail") || "";
      const fullFormData = { ...formData, email: storedEmail };
      setSubmittedFormData(fullFormData); // Store data needed for Gemini call later

      // --- Step 1: Submit to Gravity Forms (Optional) ---
      try {
        const submissionResponse = await fetch("/api/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullFormData),
        });
        if (!submissionResponse.ok) {
          const errorData = await submissionResponse.json();
          console.error(
            "Failed to save submission to Gravity Forms:",
            errorData.error
          );
          toast.error("Failed to save form submission details.");
        } else {
          console.log("Submission saved to Gravity Forms successfully.");
        }
      } catch (gfError) {
        console.error("Error submitting to Gravity Forms:", gfError);
        toast.error("Error saving form submission details.");
      }

      // --- Step 2: Start Insites Report ---
      console.log(
        "Attempting to start Insites report via /api/insites-report..."
      );
      const startResponse = await fetch("/api/insites-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: fullFormData.website,
          businessName: fullFormData.businessName,
          phone: fullFormData.phone,
        }),
      });

      const startData = await startResponse.json();
      console.log("Received response from /api/insites-report:", startData);

      if (!startResponse.ok || !startData.id) {
        throw new Error(
          startData.error ||
            `Failed to start Insites report (HTTP ${startResponse.status}) - No ID received.`
        );
      }

      setInsitesReportId(startData.id); // This triggers the polling useEffect
    } catch (err) {
      console.error("Error starting analysis process:", err);
      setError(err.message || "An error occurred while starting the analysis");
      setIsLoading(false);
      setSubmittedFormData(null);
      setInsitesReportId(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  // Render redirecting message or the actual content
  if (!hasAccess) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center relative"
        >
          <div className="absolute top-0 right-0 p-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Competitive Analysis Tool
          </h1>
          <p className="text-gray-600">
            Get comprehensive insights for your business strategy
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {!analysisResults && !isLoading && !insitesReportId && !error && (
            <motion.div
              key="form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <BusinessAnalysisForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-100 text-red-700 rounded-lg my-6">
            <p className="font-medium">Error: {error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(false);
                setInsitesReportId(null);
                setSubmittedFormData(null);
              }}
              className="mt-2 text-sm underline text-red-600"
            >
              Try again
            </button>
          </div>
        )}

        {isLoading && (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center my-6">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600 font-medium">
                {insitesReportId && !analysisResults
                  ? `Processing report... This may take a few minutes.`
                  : "Generating final analysis..."}
              </p>
              <p className="text-sm text-gray-500">
                Please wait, fetching and analyzing data.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Simplified condition: Removed !isLoading check */}
          {analysisResults && submittedFormData && !error && (
            <motion.div
              key="report"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit" // Restore exit animation
            >
              {/* Render AnalysisHeader if analysisResults exist; header handles null apolloData */}
              <AnalysisHeader
                apolloData={analysisResults?.apolloData}
                businessName={submittedFormData?.businessName}
                website={submittedFormData?.website}
              />
              <BusinessAnalysisReport
                results={analysisResults}
                industry={submittedFormData.industry}
                submittedData={submittedFormData}
              />
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setAnalysisResults(null);
                    setSubmittedFormData(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Create Another Analysis
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </div>
  );
}
