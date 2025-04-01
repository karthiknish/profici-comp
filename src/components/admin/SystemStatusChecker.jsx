"use client";

import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  BrainCircuit,
  Zap,
  Newspaper, // Added Newspaper icon
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Import cn

// Interface for API status
const initialApiStatus = {
  mongodb: { status: "idle", message: "", isLoading: false },
  gemini: { status: "idle", message: "", isLoading: false },
  apollo: { status: "idle", message: "", isLoading: false },
  gnews: { status: "idle", message: "", isLoading: false }, // Added gnews
};

export default function SystemStatusChecker() {
  const [envStatus, setEnvStatus] = useState(null);
  const [apiStatus, setApiStatus] = useState(initialApiStatus);
  const [isEnvLoading, setIsEnvLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkEnvStatus = async () => {
    setIsEnvLoading(true);
    setError(null);
    setEnvStatus(null); // Clear previous env status
    try {
      const response = await fetch("/api/admin/env-check");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to fetch env status: ${response.statusText}`
        );
      }
      const data = await response.json();
      setEnvStatus(data);
      if (data.status !== "OK") {
        toast.warning("Some environment variables are missing!", {
          description: "Check the status table for details.",
        });
      } else {
        // Only toast success if specifically requested by refresh, not on initial load
        // toast.success("Environment variables check successful.");
      }
    } catch (err) {
      console.error("Error checking env status:", err);
      setError(err.message);
      toast.error("Failed to check environment status.", {
        description: err.message,
      });
    } finally {
      setIsEnvLoading(false);
    }
  };

  // Function to check a specific API status
  const checkApiStatus = async (apiKey) => {
    setApiStatus((prev) => ({
      ...prev,
      [apiKey]: {
        ...prev[apiKey],
        isLoading: true,
        status: "idle",
        message: "",
      },
    }));
    setError(null);
    try {
      const response = await fetch(`/api/admin/status/${apiKey}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `API check failed with status ${response.status}`
        );
      }
      setApiStatus((prev) => ({
        ...prev,
        [apiKey]: {
          isLoading: false,
          status: data.status,
          message: data.message,
        },
      }));
      if (data.status === "OK") {
        toast.success(
          `${
            apiKey.charAt(0).toUpperCase() + apiKey.slice(1)
          } API check successful.`
        );
      } else {
        toast.error(
          `${
            apiKey.charAt(0).toUpperCase() + apiKey.slice(1)
          } API check failed.`,
          { description: data.message }
        );
      }
    } catch (err) {
      console.error(`Error checking ${apiKey} status:`, err);
      const message = err instanceof Error ? err.message : "Unknown error";
      setApiStatus((prev) => ({
        ...prev,
        [apiKey]: { isLoading: false, status: "Error", message: message },
      }));
      toast.error(`Failed to check ${apiKey} status.`, {
        description: message,
      });
      setError((prev) => (prev ? `${prev}; ${message}` : message));
    }
  };

  // Run env check on component mount
  useEffect(() => {
    checkEnvStatus();
  }, []);

  const renderStatusIcon = (status) => {
    switch (status) {
      case "OK":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "NOT SET":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Environment Variables Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>
                Status of essential configuration keys.
              </CardDescription>
            </div>
            <Button
              onClick={checkEnvStatus}
              disabled={isEnvLoading}
              size="sm"
              variant="outline"
            >
              {isEnvLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Env Vars
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEnvLoading &&
            !envStatus && ( // Show loader only if no previous status exists
              <div className="flex justify-center items-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          {error && !envStatus && (
            <p className="text-red-600">Error loading status: {error}</p>
          )}
          {envStatus && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(envStatus.variables).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "flex items-center",
                            value === "Set" ? "text-green-600" : "text-red-600"
                          )}
                        >
                          {renderStatusIcon(value)}{" "}
                          <span className="ml-2">{value}</span>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {envStatus?.status !== "OK" && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    One or more critical environment variables are missing. The
                    application may not function correctly.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* API Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>API Status Checks</CardTitle>
          <CardDescription>
            Verify connectivity and authentication for external APIs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(apiStatus).map(([key, api]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 border rounded-md bg-muted/20"
            >
              <div className="flex items-center gap-3">
                {key === "mongodb" && (
                  <Database className="h-5 w-5 text-muted-foreground" />
                )}
                {key === "gemini" && (
                  <BrainCircuit className="h-5 w-5 text-muted-foreground" />
                )}
                {key === "apollo" && (
                  <Zap className="h-5 w-5 text-muted-foreground" />
                )}
                {key === "gnews" && ( // Added GNews icon
                  <Newspaper className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="font-medium capitalize">{key}</span>
              </div>
              <div className="flex items-center gap-3">
                {api.status !== "idle" && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      api.status === "OK"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {api.status}
                  </span>
                )}
                {api.message && api.status !== "OK" && (
                  <span
                    className="text-xs text-muted-foreground truncate max-w-xs"
                    title={api.message}
                  >
                    {api.message}
                  </span>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => checkApiStatus(key)}
                  disabled={api.isLoading}
                >
                  {api.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Test"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
