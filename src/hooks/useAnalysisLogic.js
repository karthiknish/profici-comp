"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Helper function for polling delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function useAnalysisLogic() {
  const router = useRouter();
  const [analysisResults, setAnalysisResults] = useState(null);
  const [submittedFormData, setSubmittedFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Default to false, no initial storage check
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [error, setError] = useState(null);
  const [insitesReportId, setInsitesReportId] = useState(null);
  const pollingTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Cleanup ref on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []); // Run only once on mount

  // --- Function to fetch Gemini Analysis ---
  const fetchGeminiAnalysis = useCallback(
    async (originalFormData, insitesData) => {
      console.log(">>> fetchGeminiAnalysis started.");

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

        const analysisResponse = await fetch("/api/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadForGemini),
        });

        if (!isMountedRef.current) return;

        if (!analysisResponse.ok) {
          const errorData = await analysisResponse.json();
          setError(errorData.error || "Failed to generate Gemini analysis");
        } else {
          const analysisData = await analysisResponse.json();
          if (!isMountedRef.current) return;
          setAnalysisResults(analysisData);
        }
      } catch (err) {
        console.error("Error during Gemini analysis fetch:", err);
        if (isMountedRef.current) {
          setError(err.message || "An error occurred generating the analysis");
        }
      } finally {
        if (isMountedRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [setError, setAnalysisResults, setIsGenerating]
  );

  // --- Polling Function ---
  const poll = useCallback(async () => {
    if (!isMountedRef.current || !isGenerating || !insitesReportId) {
      return;
    }
    console.log(`Polling report ID: ${insitesReportId}`);
    try {
      const response = await fetch(`/api/insites-report/${insitesReportId}`);
      if (!isMountedRef.current) return;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }
      const data = await response.json();
      console.log(`Poll status for ${insitesReportId}: ${data.status}`);

      if (data.status === "success") {
        await fetchGeminiAnalysis(submittedFormData, data);
      } else if (["running", "pending", "testing"].includes(data.status)) {
        if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = setTimeout(poll, 10000);
      } else {
        throw new Error(`Insites report failed with status: ${data.status}`);
      }
    } catch (err) {
      console.error("Polling error:", err);
      if (isMountedRef.current) {
        setError(`Error checking report status: ${err.message}`);
        setIsGenerating(false);
      }
    }
  }, [
    isGenerating,
    insitesReportId,
    submittedFormData,
    fetchGeminiAnalysis,
    setError,
    setIsGenerating,
  ]);

  // --- useEffect for Polling ---
  useEffect(() => {
    if (insitesReportId && isGenerating) {
      poll();
    }
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [insitesReportId, isGenerating, poll]);

  // --- handleSubmit ---
  const handleSubmit = useCallback(
    async (formData) => {
      setIsGenerating(true);
      setError(null);
      setAnalysisResults(null);
      setSubmittedFormData(null);
      setInsitesReportId(null);

      try {
        // NOTE: Email must now be part of the main formData object if needed by APIs
        const fullFormData = { ...formData }; // Use formData directly
        setSubmittedFormData(fullFormData);

        // Submit to Gravity Forms (Optional)
        try {
          const submissionResponse = await fetch("/api/submit-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fullFormData),
          });
          if (!submissionResponse.ok) {
            /* handle error */
          } else {
            console.log("Submission saved to Gravity Forms successfully.");
          }
        } catch (gfError) {
          /* handle error */
        }

        // Start Insites Report
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
        if (!startResponse.ok || !startData.id) {
          throw new Error(
            startData.error ||
              `Failed to start Insites report (HTTP ${startResponse.status})`
          );
        }
        setInsitesReportId(startData.id);
      } catch (err) {
        console.error("Error starting analysis process:", err);
        setError(
          err.message || "An error occurred while starting the analysis"
        );
        setIsGenerating(false);
        setSubmittedFormData(null);
        setInsitesReportId(null);
      }
    },
    [
      setIsGenerating,
      setError,
      setAnalysisResults,
      setSubmittedFormData,
      setInsitesReportId,
    ]
  );

  // --- handleStartNewAnalysis ---
  const handleStartNewAnalysis = useCallback(() => {
    console.log("Clearing analysis state..."); // Removed localStorage mention
    setAnalysisResults(null);
    setSubmittedFormData(null);
    setError(null);
    setInsitesReportId(null);
    setIsGenerating(false);
    setIsExportingPdf(false);
    toast.info("Analysis state cleared.");
  }, [
    setAnalysisResults,
    setSubmittedFormData,
    setError,
    setInsitesReportId,
    setIsGenerating,
    setIsExportingPdf,
  ]);

  // --- handleExportPdf ---
  const handleExportPdf = useCallback(
    async (results, formData) => {
      if (!results || !formData) {
        toast.error("No analysis data available to export.");
        return;
      }
      setIsExportingPdf(true);
      setError(null);
      const pdfToast = toast.loading("Generating PDF...", {
        description: "This may take a moment.",
      });

      try {
        const response = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysisResults: results,
            submittedData: formData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `PDF generation failed: ${response.statusText}`
          );
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const contentDisposition = response.headers.get("content-disposition");
        let filename = `Profici_AI_Analysis_${
          formData.businessName || formData.website || "Report"
        }.pdf`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
          if (filenameMatch && filenameMatch.length === 2)
            filename = filenameMatch[1];
        }
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("PDF Download Started", {
          id: pdfToast,
          description: `${filename}`,
        });
      } catch (err) {
        console.error("Error exporting PDF:", err);
        setError(err.message);
        toast.error("Failed to export PDF.", {
          id: pdfToast,
          description: err.message,
        });
      } finally {
        setIsExportingPdf(false);
      }
    },
    [setError, setIsExportingPdf]
  );

  // Return state values and handlers
  return {
    analysisResults,
    submittedFormData,
    isLoading, // Keep isLoading, but it's now just for client-side check
    isGenerating,
    isExportingPdf,
    error,
    handleSubmit,
    handleStartNewAnalysis,
    handleExportPdf,
  };
}
