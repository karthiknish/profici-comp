"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import useSession
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { format } from "date-fns"; // For formatting dates
import SystemStatusChecker from "@/components/admin/SystemStatusChecker"; // Import the new component

export default function AdminPage() {
  const { data: session, status } = useSession(); // Get session status
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated or still loading session
    if (status === "unauthenticated") {
      router.replace("/auth/signin?callbackUrl=/admin"); // Redirect to signin
    }

    // Fetch data only if authenticated
    if (status === "authenticated") {
      const fetchLeads = async () => {
        setIsLoadingLeads(true);
        setError(null); // Clear previous errors
        try {
          const response = await fetch("/api/admin/leads");
          if (!response.ok) {
            // Handle potential 401/403 from API route if needed later
            throw new Error(`Failed to fetch leads: ${response.statusText}`);
          }
          const data = await response.json();
          setLeads(data.leads || []);
        } catch (err) {
          console.error("Error fetching leads:", err);
          setError(err.message);
        } finally {
          setIsLoadingLeads(false);
        }
      };

      const fetchReports = async () => {
        setIsLoadingReports(true);
        try {
          const response = await fetch("/api/admin/reports");
          if (!response.ok) {
            // Handle potential 401/403 from API route if needed later
            throw new Error(`Failed to fetch reports: ${response.statusText}`);
          }
          const data = await response.json();
          setReports(data.reports || []);
        } catch (err) {
          console.error("Error fetching reports:", err);
          setError((prev) => (prev ? `${prev}; ${err.message}` : err.message)); // Append errors
        } finally {
          setIsLoadingReports(false);
        }
      };

      fetchLeads();
      fetchReports();
    }
  }, [status, router]); // Re-run effect when session status changes

  const isLoading = isLoadingLeads || isLoadingReports || status === "loading";

  // Show loading state while session is being verified
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Render null or redirect message if unauthenticated (handled by useEffect redirect)
  if (status === "unauthenticated") {
    return null; // Or a "Redirecting..." message
  }

  // Render dashboard only if authenticated
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {/* Optional: Display signed-in user email */}
      {/* <p className="text-sm text-muted-foreground mb-4">Signed in as: {session?.user?.email}</p> */}

      {error && (
        <Card className="mb-6 bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="reports">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          {" "}
          {/* Adjusted grid cols */}
          <TabsTrigger value="reports">
            Analysis Reports ({reports.length})
          </TabsTrigger>
          <TabsTrigger value="leads">
            Chatbot Leads ({leads.length})
          </TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>{" "}
          {/* Added Status Tab */}
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                List of all analysis reports generated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingReports ? (
                <div className="flex justify-center items-center p-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : reports.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No reports found.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>User Email</TableHead>
                      <TableHead>Competitors</TableHead>
                      {/* Add more columns if needed, e.g., view report link */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report._id}>
                        <TableCell>
                          {format(new Date(report.createdAt), "PPpp")}
                        </TableCell>
                        <TableCell>{report.businessName || "N/A"}</TableCell>
                        <TableCell>{report.website || "N/A"}</TableCell>
                        <TableCell>{report.userId || "N/A"}</TableCell>
                        <TableCell>
                          {report.competitors?.join(", ") || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Leads</CardTitle>
              <CardDescription>
                List of emails collected via the chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLeads ? (
                <div className="flex justify-center items-center p-10">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : leads.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No leads found.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead._id}>
                        <TableCell>
                          {format(new Date(lead.createdAt), "PPpp")}
                        </TableCell>
                        <TableCell>{lead.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Added Status Tab Content */}
        <TabsContent value="status">
          <SystemStatusChecker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
