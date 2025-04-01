import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next"; // Import getServerSession
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions

export async function GET(request) {
  const session = await getServerSession(authOptions); // Get session server-side

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional: Add role check here if implemented
  // if (session.user.role !== 'admin') {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  try {
    const { db } = await connectToDatabase();
    const reportsCollection = db.collection("analysis_reports");

    // Fetch all reports, sort by creation date descending
    // Optionally add projection to exclude large 'reportData' if needed for list view
    const reports = await reportsCollection
      .find({})
      // .project({ reportData: 0 }) // Example: Exclude reportData
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports.", details: error.message },
      { status: 500 }
    );
  }
}
