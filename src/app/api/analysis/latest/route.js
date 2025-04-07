import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    // Return null or an empty object if user is not authenticated
    // The frontend will handle showing the form in this case.
    return NextResponse.json(null, { status: 200 });
    // Alternatively, return 401, but frontend needs to handle this gracefully
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    const { db } = await connectToDatabase();
    const reportsCollection = db.collection("analysis_reports");

    // Find the most recent report for the logged-in user
    const latestReport = await reportsCollection.findOne(
      { userId: userEmail },
      { sort: { createdAt: -1 } } // Sort by creation date descending, take the first one
    );

    if (!latestReport) {
      // No report found for this user
      return NextResponse.json(null, { status: 200 });
    }

    // Return the latest report data (specifically the 'reportData' field)
    // Also include submittedData if needed by the report component directly
    // Adjust based on what BusinessAnalysisReport expects in its 'results' prop
    return NextResponse.json({
      analysisResults: latestReport.reportData,
      submittedData: {
        // Reconstruct submittedData if needed, or adjust frontend
        businessName: latestReport.businessName,
        website: latestReport.website,
        industry: latestReport.industry,
        competitors: latestReport.competitors,
        email: latestReport.userId, // Assuming userId is the email
      },
    });
  } catch (error) {
    console.error("Error fetching latest report:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest report.", details: error.message },
      { status: 500 }
    );
  }
}
