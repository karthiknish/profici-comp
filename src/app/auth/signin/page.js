"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { signIn } from "next-auth/react"; // Import signIn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"; // Get callbackUrl or default to /admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    try {
      // Use NextAuth signIn function with credentials provider
      const result = await signIn("credentials", {
        redirect: false, // Prevent NextAuth default redirect, handle manually
        email: email,
        password: password,
        // callbackUrl: callbackUrl // Let NextAuth handle redirect on success if preferred later
      });

      setIsLoading(false); // Stop loading after signIn attempt

      if (result?.error) {
        // Handle errors returned by the authorize function or NextAuth
        const errorMessage =
          result.error === "CredentialsSignin"
            ? "Invalid email or password." // Provide user-friendly message
            : result.error; // Use the error message from NextAuth/authorize
        setError(errorMessage);
        toast.error("Sign in failed", { description: errorMessage });
      } else if (result?.ok && !result?.error) {
        // Sign-in was successful (credentials validated by authorize)
        toast.success("Sign in successful!", { description: "Redirecting..." });
        // Redirect to the intended page or default admin page
        router.push(callbackUrl);
        router.refresh(); // Optional: Refresh page to ensure session state is updated visually
      } else {
        // Handle unexpected cases
        setError("An unexpected error occurred during sign in.");
        toast.error("Sign in failed", {
          description: "An unexpected error occurred.",
        });
      }
    } catch (err) {
      // Catch any unexpected errors during the process
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(message);
      toast.error("Sign in failed", { description: message });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Admin Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign In
            </Button>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p className="text-xs text-center text-muted-foreground">
              Don't have an account?
              <Link
                href="/auth/signup"
                className="underline hover:text-primary"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
