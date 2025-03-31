"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle2,
  BarChart3,
  Users,
  Target as TargetIcon,
  DollarSign,
  TrendingUp as TrendingUpIcon,
  Lightbulb,
  Search,
  LineChart as LineChartIcon,
  ArrowRight,
  BrainCircuit,
  Loader2, // Keep import in case used elsewhere, though button logic removed
} from "lucide-react";
import { toast } from "sonner";

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    },
  }),
};

// Animation variants for items within sections
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

// Renamed component to HomePage
export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  // Removed isSubmitting state

  const handleGetStarted = (e) => {
    // No longer async
    e.preventDefault();
    // Basic email format validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    // Only save to localStorage and navigate
    try {
      localStorage.setItem("businessAnalysisEmail", email);
      console.log("Email saved to localStorage.");
      // Only navigate if localStorage save was successful
      router.push("/analysis");
    } catch (storageError) {
      console.error("Error saving email to localStorage:", storageError);
      toast.error("Could not save email. Please try again.");
      // Do NOT navigate if saving failed
      // Optionally still navigate or show a more persistent error
      // router.push("/analysis");
    }
  };

  const features = [
    {
      title: "AI-Powered SEO Analysis",
      description:
        "In-depth audit covering keywords, backlinks, technical health, and content gaps.",
      icon: Search,
    },
    {
      title: "Competitor Intelligence",
      description:
        "Uncover competitor strategies, market positioning, strengths, and weaknesses.",
      icon: Users,
    },
    {
      title: "Market Opportunity Assessment",
      description:
        "Identify TAM, SAM, SOM, growth trends, and customer segments.",
      icon: TargetIcon,
    },
    {
      title: "Actionable AI Recommendations",
      description:
        "Get clear, prioritized strategies across marketing, sales, and operations.",
      icon: Lightbulb,
    },
    {
      title: "Search Trend Insights",
      description:
        "Understand keyword volume shifts, rising queries, and geographic interest.",
      icon: TrendingUpIcon,
    },
    {
      title: "Valuation & Market Context",
      description:
        "Gain perspective on industry size, valuation metrics, and investment trends.",
      icon: DollarSign,
    },
  ];

  const benefits = [
    {
      title: "Strategic Clarity",
      description:
        "Cut through the noise with AI-driven insights for confident decision-making.",
      icon: CheckCircle2,
    },
    {
      title: "Competitive Edge",
      description:
        "Understand your rivals and identify unique opportunities to outperform them.",
      icon: CheckCircle2,
    },
    {
      title: "Time & Cost Efficiency",
      description:
        "Get expert-level analysis in minutes, saving valuable resources.",
      icon: CheckCircle2,
    },
    {
      title: "Growth Acceleration",
      description:
        "Implement targeted recommendations designed to boost performance and ROI.",
      icon: CheckCircle2,
    },
  ];

  const howItWorksSteps = [
    {
      title: "Provide Your Details",
      description:
        "Enter your business name, website, industry, and key competitors.",
      step: 1,
    },
    {
      title: "AI Generates Insights",
      description: "Our advanced AI analyzes your input and vast market data.",
      step: 2,
    },
    {
      title: "Explore Your Dashboard",
      description:
        "Receive a comprehensive report with visualizations and actionable steps.",
      step: 3,
    },
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      title: "Founder, SaaS Startup",
      quote:
        "BusinessIQ gave us the clarity we needed to pivot our marketing strategy. The competitor insights were invaluable.",
      initials: "AC",
    },
    {
      name: "Maria Garcia",
      title: "E-commerce Manager",
      quote:
        "The SEO analysis pinpointed technical issues we&apos;d missed for months. Fixing them led to a noticeable traffic increase.",
      initials: "MG",
    },
    {
      name: "David Lee",
      title: "Small Business Owner",
      quote:
        "As someone without a huge budget, getting this level of market analysis was a game-changer for planning our expansion.",
      initials: "DL",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Sticky Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-14 max-w-screen-2xl items-center px-6">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary">
                Profici Competitive Analysis
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground flex-grow">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="transition-colors hover:text-foreground"
            >
              Benefits
            </Link>
            <Link
              href="#testimonials"
              className="transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button asChild>
              <Link href="/analysis">Launch Tool</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true }}
        className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/50"
      >
        <div className="container mx-auto px-6 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center text-center lg:text-left pt-20 md:pt-24 lg:pt-32">
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10 z-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-foreground">
              Supercharge Your Strategy with{" "}
              <span className="text-primary">Competitive Analysis</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Instant, data-driven insights from Profici.co.uk. Analyze your
              SEO, competitors, market, and get actionable recommendations.
            </p>
            <motion.form
              variants={itemVariants}
              className="flex flex-col sm:flex-row max-w-md mx-auto lg:mx-0"
              onSubmit={handleGetStarted}
            >
              <Input
                type="email"
                placeholder="Enter your email to get started"
                className="flex-grow text-base px-4 py-3 mb-2 sm:mb-0 sm:mr-[-1px] rounded-md sm:rounded-r-none focus:z-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for getting started"
              />
              <Button
                type="submit"
                size="lg"
                className="rounded-md sm:rounded-l-none"
              >
                Analyze My Business <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>
            <p className="text-sm text-muted-foreground mt-3">
              Powered by Profici.co.uk | Free analysis available.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2 flex justify-center mt-10 lg:mt-0 relative"
          >
            <div className="relative w-full max-w-lg aspect-square">
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
                className="relative w-full aspect-video bg-muted rounded-lg flex items-center justify-center shadow-xl border overflow-hidden"
              >
                <div className="flex space-x-2 p-4">
                  <div className="w-1/3 h-32 bg-primary/30 rounded animate-pulse delay-100"></div>
                  <div className="w-1/3 h-32 bg-primary/50 rounded animate-pulse delay-300"></div>
                  <div className="w-1/3 h-32 bg-primary/70 rounded animate-pulse delay-500"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        id="features"
        className="container mx-auto px-6 py-16 lg:py-24"
      >
        <div className="max-w-xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Comprehensive Competitive Intelligence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Gain a 360° view of your business landscape with our analysis tools.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              custom={index}
            >
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <feature.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        custom={2}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="container mx-auto px-6 py-16 lg:py-24 bg-muted rounded-lg border"
      >
        <div className="max-w-xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Get Insights in 3 Simple Steps
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center relative">
          {/* Removed dashed lines between steps */}
          {/* <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 -translate-y-4">
            <svg
              width="100%"
              height="2"
              preserveAspectRatio="none"
              className="text-border"
            >
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>
          </div> */}
          {/* <div className="hidden md:block absolute top-8 left-2/3 right-0 h-0.5 -translate-y-4">
            <svg
              width="100%"
              height="2"
              preserveAspectRatio="none"
              className="text-border"
            >
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>
          </div> */}

          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              custom={index}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-2xl shadow-lg">
                {step.step}
              </div>
              {/* Use Card component for steps */}
              <Card className="h-full text-center bg-background/70">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-xl shadow-lg">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        custom={3}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        id="benefits"
        className="container mx-auto px-6 py-16 lg:py-24"
      >
        <div className="max-w-xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Why Choose Profici Competitive Analysis?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Unlock advantages that drive real business growth.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              custom={index}
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <benefit.icon
                    className="h-5 w-5 text-primary-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        custom={4}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        id="testimonials"
        className="bg-secondary py-16 lg:py-24"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary-foreground">
              Trusted by Growing Businesses
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                custom={index}
              >
                <Card className="h-full shadow-lg bg-background">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center mt-4 pt-4 border-t border-border">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarFallback>{testimonial.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.title}
                        </p>
                      </div>
                      <div className="ml-auto flex text-yellow-500">★★★★★</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        custom={5}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="bg-gradient-to-r from-primary via-primary/90 to-primary py-16 lg:py-24"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Ready to Elevate Your Strategy?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            Get started with your free competitive analysis today. No credit
            card required.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/analysis">
                Get Your Free Analysis Now{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        custom={6}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="bg-muted py-12"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-primary mb-2">
                Profici Competitive Analysis
              </div>
              <p className="text-muted-foreground text-sm">
                Competitive analysis by Profici.co.uk
              </p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Profici Ltd. All rights
              reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
