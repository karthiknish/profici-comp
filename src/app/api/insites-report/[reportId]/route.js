import { NextResponse } from "next/server";
import fs from "fs/promises"; // Import Node.js file system module
import path from "path"; // Import Node.js path module

const INSITES_API_BASE = "https://api.insites.com/api/v1/report";
const REPORTS_DIR = path.join(process.cwd(), "insites-reports"); // Define reports directory relative to project root

// Ensure the reports directory exists
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Directory ensured: ${dirPath}`);
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    // Decide if this should be a fatal error for the request
    throw new Error(`Could not create directory for saving reports.`);
  }
}

// Modify function signature to only take request
export async function GET(request) {
  // Get API key first
  const insitesApiKey = process.env.INSITES_API_KEY;

  // Check API key availability early
  if (!insitesApiKey) {
    console.error("INSITES_API_KEY not found in environment variables.");
    return NextResponse.json(
      { error: "Insites API key not configured on server" },
      { status: 500 }
    );
  }

  try {
    // Extract reportId from the request URL
    const url = new URL(request.url);
    // Example URL: /api/insites-report/d9418da7...
    // Split pathname by '/' -> ['', 'api', 'insites-report', 'd9418da7...']
    const pathSegments = url.pathname.split("/");
    const reportId = pathSegments[pathSegments.length - 1]; // Get the last segment

    if (!reportId) {
      console.error("Could not extract reportId from URL:", request.url);
      return NextResponse.json(
        { error: "Report ID is missing in the URL path" },
        { status: 400 }
      );
    }

    // --- MOCK DATA FOR DEVELOPMENT ---
    if (process.env.NODE_ENV === "development") {
      console.log(
        `--- DEVELOPMENT MODE: Checking Mock Insites Data for ID: ${reportId} ---`
      );
      const mockReportId = "d9418da75697a39f37e233ffc0c3304313f114b4";
      if (reportId === mockReportId) {
        console.log(
          "--- DEVELOPMENT MODE: Returning Full Mock Insites JSON ---"
        );
        // Paste the full JSON provided by the user here
        const mockData = {
          request_status: "success",
          report_status: "testing", // Keep as testing initially? Or set to success? Let's use success for testing completion
          report: {
            report_id: "d9418da75697a39f37e233ffc0c3304313f114b4",
            account_id: "profici",
            meta: {
              requested_by: "api-user",
              report_completed_at: "2025-03-31T05:38:41+00:00",
              detected_name: "profici",
              detected_phone: "2434546453",
              detected_address: "suite 105, 20 Chapel St, Liverpool L3 9AG, UK",
              curtailed: false,
              analysis_country: "GB",
              proxy_used: "none",
              primary_industry: "consultancy",
              live_report_id: "",
              is_lead_gen: false,
            },
            domain: "profici.co.uk",
            overall_score: 80,
            video: { has_video: true, vendor: "MediaElement.js" },
            analysed_page_count: 5,
            contact_details: {
              emails: ["info@profici.co.uk"],
              phones: ["0151%20319 8550", "0151 319 8550"],
            },
            version_id:
              "d9418da75697a39f37e233ffc0c3304313f114b4_2025-03-31T05:38:41",
            technology_detection: {
              has_cms: true,
              cms_solution: ["WordPress"],
              detected_technologies:
                "WordPress, MySQL, PHP, Animate.css, MediaElement.js, ZURB Foundation, Yoast SEO, Nginx, Cloudflare, Google Font API, Font Awesome, cdnjs, Facebook Ads Pixel, Twitter Emoji (Twemoji), core-js, jQuery Migrate, jQuery, HubSpot Analytics, HubSpot, Google Hosted Libraries, Google Analytics, Facebook Pixel, RSS, Open Graph, Google Maps, Priority Hints",
              technology_categories: [
                "CMS",
                "Blogs",
                "Databases",
                "Programming languages",
                "UI frameworks",
                "Video players",
                "SEO",
                "WordPress plugins",
                "Web servers",
                "Reverse proxies",
                "CDN",
                "Font scripts",
                "Advertising",
                "JavaScript libraries",
                "Analytics",
                "Marketing automation",
                "Miscellaneous",
                "Maps",
                "Performance",
              ],
            },
            technology_profile: {
              has_cms: true,
              cms_solution: ["WordPress"],
              has_impressum: false,
              detected_cms_solution: ["WordPress"],
            },
            facebook_page: {
              phone: "447949053243",
              address: "Exchange Station, Liverpool,  United Kingdom, L2 2QP",
              page_id: 164259424073408,
              page_link: "https://www.facebook.com/profici.co.uk",
              page_name: "Profici Ltd",
              error: false,
              found: true,
              page_likes: 2393,
              image:
                "https://graph.facebook.com/164259424073408/picture?type=large",
              fb_link_missing: false,
              page_follows: 2400,
              verified: true,
              fb_info_unavailable: false,
              days_since_last_post: "0000000000000-1",
              fb_links_to_placeholder_profile: false,
            },
            paid_search: {
              has_adwords_spend: true,
              adwords_keywords: [],
              has_adplorer: false,
              google_ad_previews: [
                "https://production-insites-resources.s3.eu-west-1.amazonaws.com/d9418da75697a39f37e233ffc0c3304313f114b4/2025-03-31/05-38-40/9223372036854775807",
                "https://production-insites-resources.s3.eu-west-1.amazonaws.com/d9418da75697a39f37e233ffc0c3304313f114b4/2025-03-31/05-38-40/7314998377894641167",
              ],
            },
            reviews: {
              average_review: 4.8,
              reviews_found_count: 20,
              google_average_rating: "4.8",
              facebook_average_rating: "0",
            },
            mobile: {
              is_mobile: true,
              is_tablet: true,
              has_mobile_site: false,
              has_small_text: false,
              mobile_site_url: "",
              has_small_links: false,
              has_pages_with_flash: false,
              has_horizontal_scroll: false,
              mobile_screenshot_url:
                "https://screenshot.static.insites.com/d9418da75697a39f37e233ffc0c3304313f114b4/Mobile/2025-03-31/05-38-24.png",
              tablet_screenshot_url:
                "https://screenshot.static.insites.com/d9418da75697a39f37e233ffc0c3304313f114b4/Desktop1280x960/2025-03-31/05-38-24.png",
              has_viewport_optimised_for_mobile: true,
            },
            parked_domain_detection: { is_parked: false },
            domain_age: {
              registrar: "123-Reg Limited t/a 123-reg [Tag = 123-REG]",
              domain_age_days: 2421,
              expiry_date: "2025-08-14T00:00:00+00:00",
              registered_date: "2018-08-14T00:00:00+00:00",
            },
            organic_search: {
              average_monthly_traffic: 147,
              num_keywords_ranked_for: 142,
              top_keywords_ranked_for: [
                "profici",
                "consultancy liverpool",
                "wordpress seo plugins free",
                "cost leadership strategy",
                "john may liverpool",
              ],
              best_keyword_opportunities: [
                {
                  term: "why is leadership needed",
                  position: 99,
                  previous_position: 99,
                  num_results_for_term: 3180000000,
                  monthly_queries_for_term: 170,
                  position_change: 0,
                },
                {
                  term: "website design liverpool",
                  position: 97,
                  previous_position: 97,
                  num_results_for_term: 202000000,
                  monthly_queries_for_term: 590,
                  position_change: 0,
                },
                {
                  term: "ppc pay per click",
                  position: 96,
                  previous_position: 96,
                  num_results_for_term: 26200000,
                  monthly_queries_for_term: 70,
                  position_change: 0,
                },
                {
                  term: "what is direct traffic",
                  position: 96,
                  previous_position: 96,
                  num_results_for_term: 670000000,
                  monthly_queries_for_term: 110,
                  position_change: 0,
                },
                {
                  term: "per click pay",
                  position: 95,
                  previous_position: 95,
                  num_results_for_term: 1780000000,
                  monthly_queries_for_term: 70,
                  position_change: 0,
                },
              ],
              top_keywords_ranked_for_detail: [
                {
                  term: "profici",
                  position: 1,
                  previous_position: 1,
                  num_results_for_term: 47,
                  monthly_queries_for_term: 170,
                  position_change: 0,
                },
                {
                  term: "consultancy liverpool",
                  position: 5,
                  previous_position: 5,
                  num_results_for_term: 7510000,
                  monthly_queries_for_term: 140,
                  position_change: 0,
                },
                {
                  term: "wordpress seo plugins free",
                  position: 9,
                  previous_position: 9,
                  num_results_for_term: 15900000,
                  monthly_queries_for_term: 90,
                  position_change: 0,
                },
                {
                  term: "cost leadership strategy",
                  position: 11,
                  previous_position: 11,
                  num_results_for_term: 496000000,
                  monthly_queries_for_term: 320,
                  position_change: 0,
                },
                {
                  term: "john may liverpool",
                  position: 9,
                  previous_position: 9,
                  num_results_for_term: 174000000,
                  monthly_queries_for_term: 90,
                  position_change: 0,
                },
              ],
            },
            last_updated: {
              days_since_update: 20,
              last_updated_date: "2025-03-11T00:00:00+00:00",
            },
            amount_of_content: {
              pages_tested: 5,
              total_word_count: 3253,
              pages_found: 27,
              average_words_per_page: 651,
              num_pages_thin_content: 2,
              total_visible_word_count: 2925,
              average_visible_words_per_page: 585,
            },
            local_presence: {
              business_zip: "",
              business_city: "",
              business_name: "profici",
              business_phone: "3435433423",
              business_state: "",
              business_street: "",
              directories_found: ["Facebook", "GoogleMaps"],
              directories_tested: ["Facebook", "Bing", "GoogleMaps", "Yelp"],
              directories_found_count: 2,
              directories_with_errors: ["Yelp"],
              directories_tested_count: 3,
              business_details_provided: false,
              directories_with_inconsistencies: ["Facebook", "GoogleMaps"],
              directories_with_inconsistencies_count: 2,
            },
            analytics: {
              has_analytics: true,
              analytics_tool: "Multiple found",
              uses_universal_ga: false,
              all_analytics_tools: [
                "HubSpot Analytics",
                "Google Analytics",
                "Facebook Pixel",
              ],
              uses_ga_consent_mode: true,
              uses_ga_consent_mode_advanced: true,
            },
            no_business_website_found: false,
            user_team_id: 2761,
            backlinks: {
              total_backlinks: 14261,
              total_websites_linking: 70,
              has_spammy_backlinks: true,
              backlinks_check_success: true,
            },
            listing_search_initialisation: { detected_city: "Liverpool" },
            ecommerce: { has_ecommerce: false },
            is_staging_site: false,
            page_count: {
              pages_discovered_count: 27,
              pages_discovered: [
                "profici.co.uk/",
                "profici.co.uk/about/",
                "profici.co.uk/team/",
                "profici.co.uk/profici-podcast/",
                "profici.co.uk/contact/",
                "profici.co.uk/business-strategy/",
                "profici.co.uk/business-consultancy/",
                "profici.co.uk/fractional-c-suite-services/",
                "profici.co.uk/digital-marketing-services/",
                "profici.co.uk/blogs/",
                "profici.co.uk/ebooks/",
                "profici.co.uk/support/",
                "profici.co.uk/privacy-policy/",
                "profici.co.uk/terms-conditions/",
                "profici.co.uk/cookie-policy/",
                "profici.co.uk/blogs/business-growth/the-future-of-business-how-ai-and-automation-are-reshaping-growth/",
                "profici.co.uk/blogs/business-growth/crafting-an-effective-business-growth-plan-step-by-step-guide/",
                "profici.co.uk/blogs/overcoming-common-growth-challenges-faced-by-small-and-medium-businesses/",
                "profici.co.uk/blogs/business-growth/the-importance-of-digital-transformation-for-business-growth/",
                "profici.co.uk/blogs/business-strategy/why-every-business-needs-a-revenue-first-strategy-in-2025/",
                "profici.co.uk/blogs/fractional-c-suite/top-8-reasons-startups-should-consider-a-fractional-c-suite/",
                "profici.co.uk/blogs/cfo/cfo-perspectives-on-the-future-of-finance-for-business/",
                "profici.co.uk/blogs/fractional-c-suite/what-is-a-fractional-c-suite-and-how-can-it-help-your-business/",
                "profici.co.uk/blogs/business-strategy/getting-your-business-strategy-wrong-and-how-to-do-it-right-instead/",
                "profici.co.uk/blogs/page/2/",
                "profici.co.uk/blogs/page/24/",
                "profici.co.uk/blogs/page/25/",
              ],
            },
            request_information: {
              user_parameters: {
                name: "profici",
                phone: "3435433423",
                target_keywords: "",
                locations: "",
                starred_target_keywords: "",
                starred_locations: "",
              },
            },
            logo: { has_detected_logo: false },
            "x_(formerly_twitter)": {
              account_link: "https://twitter.com/profici_",
              found: true,
              twitter_links_to_placeholder_profile: false,
            },
            website_screenshot: {
              mobile_screenshot_url:
                "https://screenshot.static.insites.com/d9418da75697a39f37e233ffc0c3304313f114b4/Mobile/2025-03-31/05-38-24.png",
              desktop_screenshot_url:
                "https://screenshot.static.insites.com/d9418da75697a39f37e233ffc0c3304313f114b4/Desktop1280x960/2025-03-31/05-38-24.png",
            },
            stale_analysis: false,
            percent_complete: 100,
            spider: { error_downloading_pages: false, error_message: null },
            local_presence_normalised: {
              business_name: "profici",
              business_street: "",
              business_city: "",
              business_zip: "",
              business_phone: "3435433423",
              check_success: true,
              directories_tested_count: 3,
              directories_found_count: 2,
              has_listings_product: false,
              product_name: false,
              directories_with_inconsistencies_count: 2,
            },
            reviews_normalised: {
              average_review: 4.8,
              reviews_found_count: 20,
            },
          },
          status: "success", // Set status to success for testing completion
        };
        return NextResponse.json(mockData, { status: 200 });
      } else {
        console.log(
          `--- DEVELOPMENT MODE: Mock ID ${mockReportId} does not match requested ID ${reportId}. Returning 404. ---`
        );
        return NextResponse.json(
          { error: "Mock report not found" },
          { status: 404 }
        );
      }
    }
    // --- END MOCK DATA ---

    // Production logic
    console.log(`Checking Insites report status/data for ID: ${reportId}`);
    const response = await fetch(`${INSITES_API_BASE}/${reportId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "api-key": insitesApiKey, // Corrected header name to match POST route
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(
        `Insites API error fetching report ${reportId} (${response.status}):`,
        responseData
      );
      return NextResponse.json(
        { error: responseData.message || `HTTP error ${response.status}` },
        { status: response.status }
      );
    }

    console.log(
      `Successfully fetched status/data for Insites report ${reportId}. Status: ${responseData.status}`
    );

    // --- Save Completed Report ---
    if (responseData.status === "complete") {
      try {
        await ensureDirectoryExists(REPORTS_DIR); // Make sure directory exists
        const filePath = path.join(REPORTS_DIR, `${reportId}.json`);
        await fs.writeFile(filePath, JSON.stringify(responseData, null, 2)); // Pretty print JSON
        console.log(
          `Successfully saved completed Insites report to ${filePath}`
        );
      } catch (writeError) {
        console.error(
          `Error saving Insites report ${reportId} to file:`,
          writeError
        );
        // Log error but don't fail the API response, as the data was fetched successfully
      }
    }
    // --- End Save ---

    // Return the full response from Insites
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    // Attempt to extract reportId for logging, similar logic as above
    let reportIdForErrorLog = "unknown";
    try {
      const url = new URL(request.url);
      const pathSegments = url.pathname.split("/");
      reportIdForErrorLog = pathSegments[pathSegments.length - 1] || "unknown";
    } catch (urlError) {
      console.error("Could not parse URL for error logging:", urlError);
    }
    console.error(
      `Failed to fetch Insites report ${reportIdForErrorLog}:`,
      error
    );
    return NextResponse.json(
      {
        error: "Internal server error while fetching Insites report",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
