"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Pause, Loader2 } from "lucide-react";

// Animation variants (can be passed as props or defined locally)
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    // Default i to 0 if not provided
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

export default function HeroSection({
  email,
  setEmail,
  handleGetStarted,
  isLoading,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.section
      custom={0}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-blue-50 dark:to-blue-950/30"
    >
      <div className="container mx-auto px-6 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center text-center lg:text-left pt-20 md:pt-24 lg:pt-32">
        <motion.div
          variants={itemVariants}
          className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10 z-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-foreground">
            Unlock Growth for Your UK SME with{" "}
            <span className="text-primary">AI-Powered Insights</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Get your free, instant competitive analysis from Profici. Understand
            your SEO, competitors, market trends, and receive actionable
            strategic recommendations tailored for the UK market.
          </p>
          <motion.form
            variants={itemVariants}
            className="flex flex-col sm:flex-row max-w-md mx-auto lg:mx-0"
            onSubmit={handleGetStarted}
          >
            <Input
              type="email"
              placeholder="Enter your business email"
              className="flex-grow text-base px-4 py-3 mb-2 sm:mb-0 sm:mr-[-1px] rounded-md sm:rounded-r-none focus:z-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Business email for free analysis"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="lg"
              className="rounded-md sm:rounded-l-none"
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
          <p className="text-xs text-muted-foreground mt-3">
            Powered by Profici.co.uk | No credit card required.
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="lg:w-1/2 w-full flex justify-center mt-10 lg:mt-0 relative"
        >
          <div className="relative w-full max-w-md aspect-square z-10">
            {" "}
            {/* Kept aspect-square */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.6,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="relative w-full h-full bg-muted rounded-lg flex items-center justify-center shadow-xl overflow-hidden"
            >
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
              >
                <source
                  src="https://profici.co.uk/wp-content/uploads/2024/12/Unlock-Business-Potential-Cash-Flow.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 hover:bg-black/50 transition-opacity duration-300 opacity-0 hover:opacity-100 focus:opacity-100"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="w-16 h-16 text-white opacity-80" />
                ) : (
                  <Play className="w-16 h-16 text-white opacity-80" />
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
