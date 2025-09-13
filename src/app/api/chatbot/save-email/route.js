import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // Import the connect function
import { z } from "zod";
import { rateLimitCheck, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const EmailSchema = z.object({
  email: z.string().email(),
});

export async function POST(request) {
  try {
    // Rate limit per IP
    const ip = getClientIp(request.headers);
    const rl = await rateLimitCheck({
      key: `chat-email:${ip}`,
      windowMs: 60_000,
      max: 10,
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(rl.reset / 1000)) },
        }
      );
    }

    // Size guard
    const raw = await request.text();
    if (raw.length > 10_000) {
      return NextResponse.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    let parsed;
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    const { email } = EmailSchema.parse(parsed || {});

    // Basic validation
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Invalid email provided." },
        { status: 400 }
      );
    }

    // Get the database object directly from the connect function
    const { db } = await connectToDatabase();

    // Choose a collection name (e.g., 'chatbot_emails')
    const collection = db.collection("chatbot_emails");

    // Insert the email along with a timestamp
    const result = await collection.insertOne({
      email: email,
      createdAt: new Date(),
    });

    // Check if the insertion was successful
    if (result.acknowledged) {
      return NextResponse.json(
        { message: "Email saved successfully." },
        { status: 201 }
      );
    } else {
      throw new Error("Failed to insert email into database.");
    }
  } catch (error) {
    console.error("Error saving chatbot email:", error);
    // Determine if it's a known error or a generic server error
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    const status =
      error.message === "Failed to insert email into database." ? 500 : 500; // Keep 500 for DB errors

    return NextResponse.json(
      { error: "Failed to save email.", details: errorMessage },
      { status: status }
    );
  }
}

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

// Optional: Add a GET handler or other methods if needed, otherwise remove.
// export async function GET(request) {
//   // Example: return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
// }
