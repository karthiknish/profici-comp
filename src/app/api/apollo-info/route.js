import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  const { domain } = await request.json();
  const apiKey = process.env.APOLLO_API_KEY;

  if (!apiKey) {
    console.error("Apollo API Key is missing.");
    return NextResponse.json(
      { error: "Server configuration error: Apollo API Key is missing." },
      { status: 500 }
    );
  }

  if (!domain) {
    return NextResponse.json(
      { error: "Domain parameter is required." },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching Apollo data for domain: ${domain}`);
    const response = await axios.get(
      "https://api.apollo.io/api/v1/organizations/enrich", // Fixed API endpoint URL
      {
        params: {
          domain: domain,
          api_key: apiKey,
        },
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    console.log("Apollo API response received.");

    // Extract relevant data - expanded based on example response
    const orgData = response.data?.organization;
    if (!orgData) {
      console.warn(
        `No organization data found in Apollo response for ${domain}`
      );
      return NextResponse.json({ apolloData: null }); // Return null if no org found
    }

    const apolloInfo = {
      name: orgData.name || null,
      description: orgData.short_description || orgData.seo_description || null,
      industry: orgData.industry || null,
      industries: orgData.industries || [], // Added plural industries
      keywords: orgData.keywords || [],
      estimated_num_employees: orgData.estimated_num_employees || null,
      alexa_ranking: orgData.alexa_ranking || null,
      linkedin_url: orgData.linkedin_url || null,
      twitter_url: orgData.twitter_url || null,
      facebook_url: orgData.facebook_url || null,
      primary_domain: orgData.primary_domain || null,
      city: orgData.city || null,
      state: orgData.state || null,
      country: orgData.country || null,
      founded_year: orgData.founded_year || null,
      annual_revenue: orgData.annual_revenue || null,
      annual_revenue_printed: orgData.annual_revenue_printed || null,
      total_funding: orgData.total_funding || null,
      total_funding_printed: orgData.total_funding_printed || null,
      latest_funding_stage: orgData.latest_funding_stage || null,
      technology_names: orgData.technology_names || [],
      departmental_head_count: orgData.departmental_head_count || {},
    };

    console.log(`Successfully fetched Apollo data for ${domain}`);
    return NextResponse.json({ apolloData: apolloInfo });
  } catch (error) {
    console.error(
      "Error fetching data from Apollo API:",
      error.response?.data || error.message
    );
    // Check if it's a 401 specifically, which indicates authentication issues
    if (error.response?.status === 401) {
      console.error(`Apollo API authentication failed for domain: ${domain}`);
      return NextResponse.json(
        {
          error: "Apollo API authentication failed. Please check your API key.",
        },
        { status: 401 }
      );
    }
    // Check if it's a 404 specifically, might mean domain not found by Apollo
    if (error.response?.status === 404) {
      console.warn(`Apollo API returned 404 for domain: ${domain}`);
      return NextResponse.json({ apolloData: null }); // Return null for 404
    }
    return NextResponse.json(
      { error: `Failed to fetch data from Apollo: ${error.message}` },
      { status: error.response?.status || 500 }
    );
  }
}
