"use client";

import { useState, useEffect, useRef, useCallback } from "react"; // Import useCallback
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BusinessAnalysisForm from "@/components/BusinessAnalysisForm";
import BusinessAnalysisReport from "@/components/BusinessAnalysisReport";
import { Toaster, toast } from "sonner"; // Import toast
import { Loader2 } from "lucide-react"; // Import Loader2 for polling

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
  // Remove finalInsitesData state
  // const [finalInsitesData, setFinalInsitesData] = useState(null);
  const pollingTimeoutRef = useRef(null); // Changed ref name for clarity

  // Check for email in localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("businessAnalysisEmail");
    if (!storedEmail) {
      router.replace("/");
    } else {
      setHasAccess(true);
    }
  }, [router]);

  // --- Function to fetch Gemini Analysis (now called directly from poll) ---
  // Wrap in useCallback
  const fetchGeminiAnalysis = useCallback(
    async (originalFormData, insitesData) => {
      // Renamed formData param for clarity
      console.log(">>> fetchGeminiAnalysis started.");
      // Ensure isLoading is true when this starts, although it should be
      // Note: Directly setting state based on another state (isLoading) inside useCallback
      // can sometimes lead to issues if the dependency isn't correctly captured.
      // It's often better to manage loading state transitions outside or pass setIsLoading.
      // However, given the flow, this might be acceptable, but keep an eye on it.
      // if (!isLoading) setIsLoading(true); // Let's remove this line for now, isLoading should be true when this is called.

      try {
        // Construct payload using Insites data primarily
        const payloadForGemini = {
          email: originalFormData.email, // Keep the user's email
          website: insitesData?.report?.domain,
          detectedName: insitesData?.report?.meta?.detected_name,
          detectedPhone: insitesData?.report?.contact_details?.phones?.[0],
          detectedEmail: insitesData?.report?.contact_details?.emails?.[0],
          detectedIndustry: insitesData?.report?.meta?.primary_industry,
          // Include the full Insites report for context within the API route
          insitesReport: insitesData?.report,
          // Add competitors from the original form data
          competitors: originalFormData.competitors,
        };

        console.log(
          ">>> Calling /api/analysis with derived payload:",
          payloadForGemini
        ); // Updated LOG
        const analysisResponse = await fetch("/api/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadForGemini), // Send the new payload
        });
        console.log(">>> /api/analysis fetch call returned."); // Kept LOG

        if (!analysisResponse.ok) {
          console.error(
            ">>> /api/analysis response not OK:",
            analysisResponse.status
          ); // ADDED LOG
          const errorData = await analysisResponse.json();
          // Use setError from the outer scope
          setError(errorData.error || "Failed to generate Gemini analysis");
          // throw new Error( // No need to throw if we set error state
          //   errorData.error || "Failed to generate Gemini analysis"
          // );
        } else {
          console.log(">>> /api/analysis response OK. Parsing JSON..."); // ADDED LOG
          const analysisData = await analysisResponse.json();
          console.log(">>> /api/analysis JSON parsed successfully."); // ADDED LOG
          // Use setAnalysisResults from the outer scope
          setAnalysisResults(analysisData);
          // submittedFormData is already set
        }
      } catch (err) {
        console.error("Error during Gemini analysis fetch:", err);
        // Use setError from the outer scope
        setError(
          err.message || "An error occurred while generating the analysis"
        );
      } finally {
        console.log(
          ">>> fetchGeminiAnalysis finally block: Setting isLoading=false."
        ); // ADDED LOG
        // Use setIsLoading from the outer scope
        setIsLoading(false); // Final loading state update
        // setPollingStatus(null); // Removed
        // setInsitesReportId(null); // Decide if report ID should be cleared after analysis
      }
    },
    [setIsLoading, setError, setAnalysisResults] // Include state setters as dependencies
  );

  // --- Polling Logic using setTimeout ---
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const poll = async () => {
      // Check if polling should continue (component mounted, loading, report ID exists)
      if (!isMounted || !isLoading || !insitesReportId) {
        console.log(
          ">>> Polling stopped: Component unmounted, loading finished, or no report ID."
        );
        return; // Stop polling
      }

      try {
        console.log(`Polling report ID: ${insitesReportId}`);
        const response = await fetch(`/api/insites-report/${insitesReportId}`);

        // Check if component is still mounted after await before proceeding
        if (!isMounted) return;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error ${response.status}`);
        }
        const data = await response.json();

        console.log(`Poll status for ${insitesReportId}: ${data.status}`);

        if (data.status === "success") {
          console.log(
            ">>> Status is 'success'. Attempting fetchGeminiAnalysis."
          ); // Updated log
          // No longer storing finalInsitesData state
          try {
            // Call fetchGeminiAnalysis directly with the successful data
            // fetchGeminiAnalysis will set isLoading to false in its finally block
            await fetchGeminiAnalysis(submittedFormData, data); // Pass insites data directly
            console.log(
              ">>> fetchGeminiAnalysis call finished successfully within poll."
            ); // Added log
          } catch (analysisError) {
            console.error(
              ">>> Error occurred *during* fetchGeminiAnalysis call within poll:",
              analysisError
            ); // Added specific catch
            // Set error state here as well
            if (isMounted) {
              // Check mount status before setting state
              setError(
                `Error during final analysis step: ${analysisError.message}`
              );
              setIsLoading(false);
            }
          }
          // Stop polling by NOT scheduling the next setTimeout
        } else if (
          data.status === "running" ||
          data.status === "pending" ||
          data.status === "testing"
        ) {
          // Schedule the next poll
          console.log(`>>> Status is '${data.status}'. Scheduling next poll.`);
          // Use the ref to store the timeout ID
          pollingTimeoutRef.current = setTimeout(poll, 10000); // Schedule next poll in 10s
        } else if (data.status === "failed" || data.status === "error") {
          throw new Error(`Insites report failed with status: ${data.status}`);
        }
        // If still pending or running, the interval will call poll() again
      } catch (err) {
        console.error("Polling error:", err);
        // console.error("Polling error:", err); // Duplicate log removed
        if (isMounted) {
          // Check mount status before setting state
          setError(`Error checking Insites report status: ${err.message}`); // Added setError here
          setIsLoading(false); // Stop loading indicator on poll error
        }
        // No need to clear timeout here, as it wasn't scheduled for the error case
      }
    };

    // Start polling only when insitesReportId is set and we are loading
    if (insitesReportId && isLoading) {
      poll(); // Start the first poll immediately
    }

    // Cleanup function
    return () => {
      isMounted = false; // Set flag on unmount
      console.log(">>> Polling useEffect cleanup: Clearing timeout.");
      // Clear the timeout if it's scheduled
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [insitesReportId, isLoading, submittedFormData, fetchGeminiAnalysis]); // fetchGeminiAnalysis is now stable due to useCallback

  // --- Original handleSubmit ---
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults(null); // Clear previous results
    setSubmittedFormData(null); // Clear previous form data
    // setPollingStatus(null); // Removed
    setInsitesReportId(null);
    // setFinalInsitesData(null); // Removed state

    try {
      const storedEmail = localStorage.getItem("businessAnalysisEmail") || "";
      const fullFormData = { ...formData, email: storedEmail };
      setSubmittedFormData(fullFormData); // Store data needed for Gemini call later

      // --- Step 1: Submit to Gravity Forms (Optional, can run in parallel or first) ---
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
          toast.error("Failed to save form submission details."); // Inform user, but don't stop analysis
        } else {
          console.log("Submission saved to Gravity Forms successfully.");
        }
      } catch (gfError) {
        console.error("Error submitting to Gravity Forms:", gfError);
        toast.error("Error saving form submission details."); // Inform user, but don't stop analysis
      }

      // --- Step 2: Start Insites Report ---
      console.log(
        "Attempting to start Insites report via /api/insites-report..."
      ); // Added log
      console.log("Sending website:", fullFormData.website); // Added log
      // Include businessName and phone in the request to our backend API
      const startResponse = await fetch("/api/insites-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: fullFormData.website,
          businessName: fullFormData.businessName, // Send businessName
          phone: fullFormData.phone, // Send phone
        }),
      });

      const startData = await startResponse.json();
      console.log("Received response from /api/insites-report:", startData); // Added log

      if (!startResponse.ok || !startData.id) {
        // Check response ok status as well
        throw new Error(
          startData.error ||
            `Failed to start Insites report (HTTP ${startResponse.status}) - No ID received.`
        );
      }

      setInsitesReportId(startData.id); // This will trigger the polling useEffect because isLoading is true
    } catch (err) {
      console.error("Error starting analysis process:", err);
      setError(err.message || "An error occurred while starting the analysis");
      setIsLoading(false); // Stop loading on initial error
      setSubmittedFormData(null); // Clear data if initial step failed
      setInsitesReportId(null); // Clear report ID on initial error
    }
    // No finally block here, isLoading is managed by polling/fetchGeminiAnalysis
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
          {/* Updated Header Text Again */}
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Competitive Analysis Tool
          </h1>
          <p className="text-gray-600">
            Get comprehensive insights for your business strategy
          </p>
        </motion.header>

        {/* Show Form if no results, not loading, and no polling */}
        <AnimatePresence mode="wait">
          {/* Show Form if no results, not loading, and no report ID (meaning not polling) */}
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

        {/* Show Error */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-100 text-red-700 rounded-lg my-6">
            <p className="font-medium">Error: {error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(false);
                // setPollingStatus(null); // Removed
                setInsitesReportId(null);
                setSubmittedFormData(null);
                // setFinalInsitesData(null); // Removed state
              }}
              className="mt-2 text-sm underline text-red-600"
            >
              Try again
            </button>
          </div>
        )}

        {/* Show Loading/Polling State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center my-6">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-600 font-medium">
                {insitesReportId && !analysisResults // Check if polling phase (no results yet)
                  ? `Processing report... This may take a few minutes.` // More generic message
                  : "Generating final analysis..."}
              </p>
              <p className="text-sm text-gray-500">
                Please wait, fetching and analyzing data.
              </p>
            </div>
          </div>
        )}

        {/* Show Report */}
        <AnimatePresence mode="wait">
          {/* Show Report if Gemini results exist, not loading, and no error */}
          {analysisResults && submittedFormData && !isLoading && !error && (
            <motion.div
              key="report"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <BusinessAnalysisReport
                results={analysisResults}
                industry={submittedFormData.industry}
                submittedData={submittedFormData} // Pass submittedFormData
              />
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setAnalysisResults(null);
                    setSubmittedFormData(null);
                    // No need to clear finalInsitesData state
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
