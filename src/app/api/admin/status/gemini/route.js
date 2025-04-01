import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { status: "Error", message: "Gemini API Key is not configured." },
      { status: 500 } // Or 400 Bad Request if preferred
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // A simple, low-cost operation to verify the key
    await genAI.listModels();

    return NextResponse.json({
      status: "OK",
      message: "Gemini API key is valid.",
    });
  } catch (error) {
    console.error("Gemini Status Check Error:", error);
    let message = "Gemini API key validation failed.";
    // Try to get a more specific error message if available
    if (error instanceof Error && error.message) {
      message += ` Details: ${error.message}`;
    } else if (typeof error === "string") {
      message += ` Details: ${error}`;
    }
    return NextResponse.json(
      { status: "Error", message: message },
      { status: 500 } // Internal Server Error likely indicates an API issue
    );
  }
}
