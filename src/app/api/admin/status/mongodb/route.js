import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Attempt to connect and immediately close (or use ping)
    const { client } = await connectToDatabase();
    // Optional: Ping the database for a more robust check
    await client.db("admin").command({ ping: 1 });
    // Note: connectToDatabase likely keeps a cached client, so this might not fully test a new connection each time.
    // For a simple check, just attempting connectToDatabase is often sufficient.

    return NextResponse.json({
      status: "OK",
      message: "MongoDB connection successful.",
    });
  } catch (error) {
    console.error("MongoDB Status Check Error:", error);
    return NextResponse.json(
      {
        status: "Error",
        message: "MongoDB connection failed.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
