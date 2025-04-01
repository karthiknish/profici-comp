import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// List of critical environment variables to check
const REQUIRED_ENV_VARS = [
  "MONGODB_URI",
  "MONGODB_DB_NAME",
  "GEMINI_API_KEY",
  "APOLLO_API_KEY",
  "GNEWS_API_KEY", // Added GNews key check
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  // Add other essential keys here if needed
];

export async function GET(request) {
  const session = await getServerSession(authOptions);

  // Protect the route
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Optional: Add admin role check if implemented
  // if (session.user.role !== 'admin') {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  try {
    const envStatus = {};
    let allSet = true;

    REQUIRED_ENV_VARS.forEach((varName) => {
      const isSet = !!process.env[varName]; // Check if the variable exists and is not empty
      envStatus[varName] = isSet ? "Set" : "NOT SET";
      if (!isSet) {
        allSet = false;
        console.warn(
          `Admin Env Check: Environment variable ${varName} is not set.`
        );
      }
    });

    return NextResponse.json({
      status: allSet ? "OK" : "Warning",
      variables: envStatus,
    });
  } catch (error) {
    console.error("Error checking environment variables:", error);
    return NextResponse.json(
      { error: "Failed to check environment status.", details: error.message },
      { status: 500 }
    );
  }
}
