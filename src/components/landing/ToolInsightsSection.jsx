"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Users,
  Target,
  TrendingUp,
  MessageCircle,
  Lightbulb,
  Newspaper,
  DollarSign,
} from "lucide-react";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    // Default i to 1 for the first section after hero
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const insights = [
  {
    icon: BarChart,
    title: "SEO Performance",
    description:
      "Analyze keyword rankings, backlinks, technical health, and content effectiveness.",
  },
  {
    icon: Users,
    title: "Competitor Landscape",
    description:
      "Compare digital presence, marketing channels, and potential SWOT analysis.",
  },
  {
    icon: Target,
    title: "Market Opportunities",
    description:
      "Evaluate market size (TAM/SAM/SOM), growth trends, and customer segments.",
  },
  {
    icon: DollarSign,
    title: "Valuation Context",
    description:
      "Understand industry valuation metrics, M&A activity, and investment trends.",
  },
  {
    icon: TrendingUp,
    title: "Search Trends",
    description:
      "Identify rising search queries and geographic interest patterns.",
  },
  {
    icon: MessageCircle,
    title: "Social Media Presence",
    description:
      "Estimate platform engagement, audience sentiment, and key discussion themes.",
  },
  {
    icon: Newspaper,
    title: "Relevant News",
    description:
      "Stay updated with recent news related to the business or industry.",
  },
  {
    icon: Lightbulb,
    title: "Strategic Recommendations",
    description:
      "Receive actionable, AI-driven advice tailored to your business goals.",
  },
];

export default function ToolInsightsSection() {
  return (
    <motion.section
      custom={1} // Animation delay index
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} // Trigger animation earlier
      id="tool-insights" // Optional ID if needed for navigation
      className="bg-white dark:bg-gray-900 py-16 lg:py-24" // Contrasting background
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Unlock Actionable Business Intelligence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI analyzes multiple facets of your business and competitive
            landscape to provide a holistic view.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              variants={itemVariants}
              custom={index} // Stagger item animation
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0 mt-1">
                <insight.icon
                  className="h-6 w-6 text-primary"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="text-md font-semibold mb-1 text-foreground">
                  {insight.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {insight.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
