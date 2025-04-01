import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";

// IMPORTANT: This route only validates credentials.
// It DOES NOT handle session creation, cookies, or JWTs.
// A proper auth library (like NextAuth.js) is needed for secure session management.

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user by email (case-insensitive)
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      ); // Unauthorized
    }

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      ); // Unauthorized
    }

    // --- !!! Session Management Missing !!! ---
    // At this point, credentials are valid.
    // A real implementation would create a session (e.g., using JWT or database sessions)
    // and return a session token/cookie to the client.
    // For now, just return success.
    // --- !!! ----------------------------- ---

    // Return success but no user data or session token yet
    return NextResponse.json({
      message:
        "Sign-in successful (Credentials Validated - No Session Created)",
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { error: "Failed to sign in.", details: error.message },
      { status: 500 }
    );
  }
}
