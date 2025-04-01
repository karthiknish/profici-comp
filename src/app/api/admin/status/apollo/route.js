import { NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { status: "Error", message: "Apollo API Key is not configured." },
      { status: 500 }
    );
  }

  try {
    // Use a known, likely stable domain for the check
    const testDomain = "apollo.io";
    console.log(`Apollo Status Check: Enriching ${testDomain}`);
    const response = await axios.post(
      "https://api.apollo.io/v1/organizations/enrich",
      { domain: testDomain },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "X-Api-Key": apiKey,
        },
        // Add a short timeout to prevent hanging
        timeout: 5000, // 5 seconds
      }
    );

    // Check for successful response (even if organization is null, key is valid)
    if (response.status >= 200 && response.status < 300) {
      return NextResponse.json({
        status: "OK",
        message: "Apollo API key is valid.",
      });
    } else {
      // This case might not be reached if axios throws for non-2xx status
      throw new Error(`Apollo API returned status ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Apollo Status Check Error:",
      error.response?.data || error.message
    );
    let message = "Apollo API key validation failed.";
    if (error.response?.status) {
      message += ` Status: ${error.response.status}.`;
    }
    if (error.response?.data?.error?.message) {
      message += ` Details: ${error.response.data.error.message}`;
    } else if (error.message) {
      message += ` Details: ${error.message}`;
    }
    return NextResponse.json(
      { status: "Error", message: message },
      { status: 500 }
    );
  }
}
