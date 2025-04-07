"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 4) => ({
    // Default i to 4
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function CtaSection({
  email,
  setEmail,
  handleGetStarted,
  isLoading,
}) {
  return (
    <motion.section
      custom={4} // Adjusted delay index
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      id="cta" // Added ID
      className="bg-gradient-to-r from-primary via-blue-700 to-primary py-16 lg:py-24" // Restored gradient, removed margin
    >
      <div className="container mx-auto px-6 text-center">
        {/* Restored text color */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
          Ready to Outperform Your Competition?
        </h2>
        <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
          Enter your business email to get your free, comprehensive AI analysis
          instantly.
        </p>
        <motion.form
          variants={itemVariants}
          className="flex flex-col sm:flex-row max-w-xl mx-auto justify-center" // Increased max-width from md to xl
          onSubmit={handleGetStarted}
        >
          <Input
            type="email"
            placeholder="Enter your business email"
            className="flex-grow text-base px-6 py-4 mb-2 sm:mb-0 sm:mr-[-1px] rounded-md sm:rounded-r-none focus:z-10 bg-white text-gray-900 h-14" // Increased padding, height and text size
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Business email for free analysis"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="rounded-md sm:rounded-l-none h-14" // Increased height to match input
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Get Free Analysis
          </Button>
        </motion.form>
      </div>
    </motion.section>
  );
}
