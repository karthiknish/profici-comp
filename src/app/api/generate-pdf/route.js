export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { generatePdfBuffer } from "@/lib/pdfGenerator"; // Import the helper
import { z } from "zod";
import { rateLimitCheck, getClientIp } from "@/lib/rateLimit";
// Removed React/render imports

// Helper function to sanitize filenames
function sanitizeFilename(name) {
  if (!name) return "Report";
  // Replace spaces with underscores and remove unsafe characters
  return name.replace(/\s+/g, "_").replace(/[\\/:*?"<>|]/g, "");
}

export async function POST(request) {
  let requestBody; // Variable to hold the parsed body for logging
  try {
    // Basic rate limiting per IP
    const ip = getClientIp(request.headers);
    const rl = await rateLimitCheck({
      key: `pdf:${ip}`,
      windowMs: 60_000,
      max: 6,
    }); // 6 req/min/IP
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(rl.reset / 1000)) },
        }
      );
    }

    // Expect analysisResults and submittedData in the body
    // Guard: limit body size to ~2MB
    const raw = await request.text();
    if (raw.length > 2_000_000) {
      return NextResponse.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }
    try {
      requestBody = raw ? JSON.parse(raw) : {};
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    // Log minimal info to avoid leaking PII
    console.log("PDF API: Parsed body keys:", Object.keys(requestBody || {}));

    // Validate request body
    const BodySchema = z.object({
      analysisResults: z.record(z.any()),
      submittedData: z.object({
        businessName: z.string().optional(),
        website: z.string().optional(),
      }),
    });
    let analysisResults, submittedData;
    try {
      ({ analysisResults, submittedData } = BodySchema.parse(
        requestBody || {}
      ));
    } catch (e) {
      const msg = e?.errors?.[0]?.message || "Invalid payload";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // analysisResults and submittedData are guaranteed by schema

    console.log(
      "PDF API: Generating for:",
      submittedData.website || submittedData.businessName
    );

    // Call the helper function with the analysis data
    const pdfBuffer = await generatePdfBuffer(analysisResults, submittedData);

    // Sanitize the filename using submittedData
    const baseName =
      submittedData.businessName || submittedData.website || "Report";
    const sanitizedName = sanitizeFilename(baseName);
    const filename = `Profici_AI_Analysis_${sanitizedName}.pdf`;

    // Return PDF
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    // Ensure filename in header is also clean, though client-side download attribute usually takes precedence
    headers.set("Content-Disposition", `attachment; filename=${filename}`); // Removed quotes around filename
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Content-Length", String(pdfBuffer.length));

    return new NextResponse(pdfBuffer, { status: 200, headers });
  } catch (error) {
    console.error("Error in generate-pdf API route:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error?.message },
      { status: 500 }
    );
  }
}

// Optional: allow CORS preflight if needed later
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });
}
