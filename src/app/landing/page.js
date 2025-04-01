"use client"; // Keep as client component for potential future interactions

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CheckCircle,
  Target,
  Users,
  BarChart,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    // Simulate storing email and redirecting
    // In a real app, you might call an API route here
    console.log("Storing email:", email);
    localStorage.setItem("businessAnalysisEmail", email); // Store email for access on analysis page
    toast.success("Email captured!", {
      description: "Redirecting to analysis tool...",
    });
    setTimeout(() => {
      router.push("/analysis");
      // No need to setIsLoading(false) as we are navigating away
    }, 1000); // Short delay for toast visibility
  };

  const features = [
    {
      title: "AI-Powered SEO Audit",
      description:
        "Uncover technical issues, keyword gaps, and backlink opportunities specific to the UK market.",
      icon: BarChart,
    },
    {
      title: "In-Depth Competitor Analysis",
      description:
        "Understand competitor strategies, digital presence, and market positioning within the UK.",
      icon: Users,
    },
    {
      title: "Market Potential & Trends",
      description:
        "Evaluate UK market size, identify growth segments, and stay ahead of industry trends.",
      icon: Target,
    },
    {
      title: "Actionable Strategic Recommendations",
      description:
        "Receive tailored advice for digital marketing and C-suite level strategy focused on UK SME growth.",
      icon: Briefcase,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            Profici AI Analysis
          </h1>
          {/* Optional: Add Sign In/Admin link if needed later */}
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">
              Admin Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
          Unlock Your SME's Growth Potential in the UK Market
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Get instant, AI-powered competitive analysis tailored for UK SMEs.
          Understand your SEO, competitors, market trends, and receive strategic
          recommendations – powered by Profici.
        </p>

        <Card className="max-w-lg mx-auto shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Start Your Free Analysis</CardTitle>
            <CardDescription>
              Enter your business email to begin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-2"
            >
              <Input
                type="email"
                placeholder="your.business@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="shrink-0">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Get Started
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground mt-4">
          By submitting your email, you agree to receive insights from Profici.
        </p>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            What You'll Get
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <feature.icon className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Profici Ltd. All rights reserved. |{" "}
        <a
          href="https://profici.co.uk/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Contact Us
        </a>
      </footer>
      {/* Ensure Toaster is rendered somewhere, e.g., in layout or here if needed */}
      {/* <Toaster /> */}
    </div>
  );
}

// Need to import Loader2 if not already imported globally
import { Loader2 } from "lucide-react";
