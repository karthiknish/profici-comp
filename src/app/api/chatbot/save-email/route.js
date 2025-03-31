import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Import the MongoDB client promise

export async function POST(request) {
  try {
    const { email } = await request.json();

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

    const client = await clientPromise;
    const db = client.db(); // Use the default database configured in MONGODB_URI

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

// Optional: Add a GET handler or other methods if needed, otherwise remove.
// export async function GET(request) {
//   // Example: return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
// }
