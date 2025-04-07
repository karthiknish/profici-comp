import { toast } from "sonner";

// localStorage keys (can be exported if needed elsewhere)
const RESULTS_STORAGE_KEY = "proficiAnalysisResults";
const FORMDATA_STORAGE_KEY = "proficiSubmittedFormData";

// Helper function for polling delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Function to fetch Gemini Analysis ---
// Needs setters and original form data
export const fetchGeminiAnalysis = async (
  originalFormData,
  insitesData,
  setAnalysisResults,
  setError,
  setIsGenerating,
  isMountedRef // Pass ref to check mount status
) => {
  console.log(">>> fetchGeminiAnalysis started (from lib).");

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
      // Removed localStorage saving logic
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
};

// --- Polling Function ---
// Needs state values and setters, plus fetchGeminiAnalysis
export const pollInsitesReport = async ({
  isMountedRef,
  isGenerating,
  insitesReportId,
  submittedFormData,
  fetchAnalysisFn, // Pass fetchGeminiAnalysis function
  setError,
  setIsGenerating,
  pollingTimeoutRef, // Pass ref to manage timeout
}) => {
  if (!isMountedRef.current || !isGenerating || !insitesReportId) {
    console.log(">>> Polling stopped (from lib): Conditions not met.");
    return;
  }
  console.log(`Polling report ID (from lib): ${insitesReportId}`);
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
      await fetchAnalysisFn(submittedFormData, data); // Call passed function
    } else if (["running", "pending", "testing"].includes(data.status)) {
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
      // Recursively call poll after delay
      pollingTimeoutRef.current = setTimeout(
        () =>
          pollInsitesReport({
            isMountedRef,
            isGenerating,
            insitesReportId,
            submittedFormData,
            fetchAnalysisFn,
            setError,
            setIsGenerating,
            pollingTimeoutRef,
          }),
        10000
      );
    } else {
      throw new Error(`Insites report failed with status: ${data.status}`);
    }
  } catch (err) {
    console.error("Polling error (from lib):", err);
    if (isMountedRef.current) {
      setError(`Error checking report status: ${err.message}`);
      setIsGenerating(false);
    }
  }
};

// --- handleSubmit ---
// Needs setters
export const handleSubmitAnalysis = async (
  formData,
  setIsGenerating,
  setError,
  setAnalysisResults,
  setSubmittedFormData,
  setInsitesReportId
) => {
  setIsGenerating(true);
  setError(null);
  setAnalysisResults(null);
  setSubmittedFormData(null);
  setInsitesReportId(null);
  // Removed localStorage clearing logic

  try {
    // Removed localStorage.getItem for email - assuming email is now part of formData directly
    // If email needs to persist differently, another state management solution is needed.
    const fullFormData = { ...formData }; // Use formData directly
    setSubmittedFormData(fullFormData); // Set state for polling

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
    setInsitesReportId(startData.id); // Trigger polling
  } catch (err) {
    console.error("Error starting analysis process:", err);
    setError(err.message || "An error occurred while starting the analysis");
    setIsGenerating(false);
    setSubmittedFormData(null);
    setInsitesReportId(null);
  }
};

// --- handleStartNewAnalysis ---
// Needs setters
export const handleStartNewAnalysis = (
  setAnalysisResults,
  setSubmittedFormData,
  setError,
  setInsitesReportId,
  setIsGenerating,
  setIsExportingPdf
) => {
  console.log("Clearing analysis state and localStorage...");
  setAnalysisResults(null);
  setSubmittedFormData(null);
  setError(null);
  setInsitesReportId(null);
  setIsGenerating(false);
  setIsExportingPdf(false);
  // Removed localStorage clearing logic
  toast.info("Previous analysis cleared.");
};

// --- handleExportPdf ---
// Needs setters
export const handleExportPdf = async (
  results,
  formData,
  setIsExportingPdf,
  setError
) => {
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
};
