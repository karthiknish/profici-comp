import { NextResponse } from "next/server";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

export async function GET(request) {
  if (!GNEWS_API_KEY) {
    return NextResponse.json(
      { error: "GNews API key not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query"); // e.g., "Digital Marketing" or "Competitor Name"
  const max = searchParams.get("max") || 5; // Max articles to return (default 5)

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  // Construct the GNews API URL, adding country=gb for UK focus
  // Note: Free tier might have limitations on query complexity and parameters
  const apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
    query
  )}&lang=en&country=gb&max=${max}&apikey=${GNEWS_API_KEY}`; // Added country=gb

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      let errorBody = `GNews API error: ${response.status}`;
      const responseText = await response.text(); // Read response as text first
      try {
        // Try parsing as JSON only if it looks like JSON
        if (
          responseText.trim().startsWith("{") ||
          responseText.trim().startsWith("[")
        ) {
          const errorData = JSON.parse(responseText);
          errorBody = errorData.errors
            ? errorData.errors.join(", ")
            : errorBody;
        } else {
          // If not JSON, log the HTML/text directly
          console.error("GNews API returned non-JSON response:", responseText);
          errorBody += ` - Response: ${responseText.substring(0, 200)}...`; // Log snippet
        }
      } catch (e) {
        console.error(
          "Error parsing GNews error response (or it wasn't JSON):",
          responseText
        );
        errorBody += ` - Failed to parse error response.`;
      }
      throw new Error(errorBody);
    }

    // If response.ok, we expect JSON
    const data = await response.json();

    // Return only essential article data
    const articles =
      data.articles?.map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name,
          url: article.source.url,
        },
      })) || [];

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error fetching news" },
      { status: 500 }
    );
  }
}
