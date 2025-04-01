"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

export default function Header() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 max-w-screen-2xl items-center px-6">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* Corrected Icon */}
            <span className="font-bold text-primary">Profici AI Analysis</span>
          </Link>
        </div>
        {/* Updated Nav Links for Scrolling */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground flex-grow">
          <Link
            href="#tool-insights" // Added link to Tool Insights section
            className="transition-colors hover:text-foreground"
          >
            Analysis Insights
          </Link>
          <Link
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Services & Features
          </Link>
          <Link
            href="#benefits"
            className="transition-colors hover:text-foreground"
          >
            Why Profici?
          </Link>
          <Link
            href="#how-it-works"
            className="transition-colors hover:text-foreground"
          >
            How It Works
          </Link>
        </nav>
        {/* Removed Admin Sign In Button */}
      </div>
    </motion.nav>
  );
}
