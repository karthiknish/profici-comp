import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { status: "Error", message: "GNews API Key is not configured." },
      { status: 500 }
    );
  }

  try {
    // Make a simple, low-cost request to GNews to validate the key
    const testQuery = "technology"; // A generic query
    const apiUrl = `https://gnews.io/api/v4/search?q=${testQuery}&lang=en&max=1&apikey=${apiKey}`;

    console.log(`GNews Status Check: Fetching ${apiUrl}`);
    const response = await fetch(apiUrl, { cache: "no-store" }); // Disable caching for status check

    if (!response.ok) {
      let errorBody = `GNews API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorBody = errorData.errors ? errorData.errors.join(", ") : errorBody;
      } catch (e) {
        // Ignore if response wasn't JSON
      }
      throw new Error(errorBody);
    }

    // If response is ok, the key is likely valid
    await response.json(); // Consume the body
    return NextResponse.json({
      status: "OK",
      message: "GNews API key is valid.",
    });
  } catch (error) {
    console.error("GNews Status Check Error:", error);
    return NextResponse.json(
      {
        status: "Error",
        message: `GNews API key validation failed. Details: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
