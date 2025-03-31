import { NextResponse } from "next/server";

const INSITES_API_ENDPOINT = "https://api.insites.com/api/v1/report";

// Helper function to START an Insites report - updated to accept more data
async function startInsitesReport(reportData, apiKey) {
  // Use 'website' field for the URL check, as that's what the frontend sends
  if (!reportData?.website || !apiKey) {
    console.warn("Skipping Insites report: Website URL or API Key missing.");
    return { success: false, error: "Website URL or API Key missing" };
  }
  try {
    // Map frontend field names to Insites API field names
    const insitesPayload = {
      url: reportData.website,
      name: reportData.businessName, // Map businessName to name
      phone: reportData.phone,
      // Add other fields here if collected in the future
    };

    console.log(`Starting Insites report for: ${insitesPayload.url}`);
    console.log("Sending data to Insites API:", insitesPayload); // Log the data being sent

    const response = await fetch(INSITES_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      // Send the mapped payload
      body: JSON.stringify(insitesPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Use insitesPayload.url for logging the error context
      console.error(
        `Insites API error for ${insitesPayload.url} (${response.status}):`,
        responseData
      );
      return {
        success: false,
        error: responseData.message || `HTTP error ${response.status}`,
      };
    }

    // Use insitesPayload.url for logging success context
    console.log(
      `Insites report started successfully for ${insitesPayload.url}:`,
      responseData
    );
    return { success: true, data: responseData }; // Contains report ID, e.g., { "id": 12345 }
  } catch (error) {
    // Use reportData.website for logging the error context in catch block
    console.error(
      `Failed to start Insites report for ${
        reportData?.website || "unknown URL"
      }:`,
      error
    );
    return { success: false, error: error.message };
  }
}

export async function POST(request) {
  try {
    // Destructure expected fields from the request body
    const { website, businessName, phone } = await request.json();
    const insitesApiKey = process.env.INSITES_API_KEY;

    // Validate required field 'website'
    if (!website) {
      return NextResponse.json(
        { error: "Website URL is required" },
        { status: 400 }
      );
    }

    if (!insitesApiKey) {
      console.error("INSITES_API_KEY not found in environment variables.");
      // Don't expose key details in the response
      return NextResponse.json(
        { error: "Insites API key not configured on server" },
        { status: 500 }
      );
    }

    // --- MOCK DATA FOR DEVELOPMENT ---
    if (process.env.NODE_ENV === "development") {
      console.log(
        "--- DEVELOPMENT MODE: Using Mock Insites Start Response ---"
      );
      const mockReportId = "d9418da75697a39f37e233ffc0c3304313f114b4"; // From user feedback
      // Return just enough info to start polling, mimicking the normalized structure
      return NextResponse.json(
        {
          id: mockReportId,
          status: "running", // Simulate that it started
          request_status: "success",
        },
        { status: 200 }
      );
    }
    // --- END MOCK DATA ---

    // Prepare data object for the helper function (Production logic)
    const reportDataToSend = {
      website,
      businessName,
      phone,
    };

    const result = await startInsitesReport(reportDataToSend, insitesApiKey);

    if (!result.success) {
      // Return a generic server error, details logged on server
      return NextResponse.json(
        { error: "Failed to start Insites report", details: result.error },
        { status: 500 }
      );
    }

    // Check for report_id or reportId from the Insites API response
    const reportIdFromApi = result.data?.report_id || result.data?.reportId;

    if (!reportIdFromApi) {
      console.error(
        "Insites API response successful but missing 'report_id' or 'reportId':",
        result.data
      );
      return NextResponse.json(
        {
          error: "Insites API response missing expected report ID field",
          details: result.data,
        },
        { status: 500 }
      );
    }

    // Normalize the response to always use 'id' for the frontend
    const responsePayload = {
      ...result.data, // Include other potential fields from Insites
      id: reportIdFromApi, // Ensure 'id' field is present for the frontend
    };

    // Remove the original fields if they exist to avoid confusion
    delete responsePayload.report_id;
    delete responsePayload.reportId;

    console.log(
      "Returning normalized Insites report ID as 'id':",
      reportIdFromApi
    );
    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("Error in /api/insites-report POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
