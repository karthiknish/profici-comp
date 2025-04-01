import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // Cost factor for hashing

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
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }
    if (typeof password !== "string" || password.length < 6) {
      // Example: require min 6 chars
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users"); // Use 'users' collection

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 } // Conflict
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert the new user
    const result = await usersCollection.insertOne({
      email: email.toLowerCase(), // Store email in lowercase for case-insensitive lookup
      password: hashedPassword,
      createdAt: new Date(),
      // Add role:'admin' here if needed, or manage roles separately
    });

    if (result.acknowledged) {
      // IMPORTANT: Do NOT return the password hash
      return NextResponse.json(
        { message: "User created successfully." },
        { status: 201 }
      );
    } else {
      throw new Error("Failed to insert user into database.");
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
    return NextResponse.json(
      { error: "Failed to create user.", details: error.message },
      { status: 500 }
    );
  }
}
