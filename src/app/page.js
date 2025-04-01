"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BarChart,
  Briefcase,
  Target,
  Users,
  CheckCircle,
  Check,
  Zap,
  Handshake,
  Scale,
} from "lucide-react";

// Import the extracted components
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CtaSection from "@/components/landing/CtaSection";
import ConsultancySection from "@/components/landing/ConsultancySection";
import Footer from "@/components/landing/Footer";
import ToolInsightsSection from "@/components/landing/ToolInsightsSection"; // Import the new section

// Data definitions (can be moved to a separate file if they grow)
const features = [
  {
    id: "digital-marketing",
    title: "Digital Marketing Strategy",
    description:
      "Results-oriented SEO, PPC, content, web design, and social media tailored for the UK market.",
    icon: BarChart,
  },
  {
    id: "fractional-csuite",
    title: "Fractional C-Suite Services",
    description:
      "Access expert CFO, CMO, or CEO leadership flexibly and cost-effectively.",
    icon: Briefcase,
  },
  {
    id: "sme-focus",
    title: "Targeted UK SME Growth",
    description:
      "Our focus is exclusively on helping ambitious UK Small & Medium Enterprises achieve sustainable success.",
    icon: Users,
  },
  {
    id: "outcomes",
    title: "Tangible Business Outcomes",
    description:
      "We aim for increased visibility, qualified leads, better conversion rates, and enhanced brand reputation.",
    icon: Target,
  },
];

const benefits = [
  {
    title: "Transparent & Results-Oriented",
    description:
      "We focus on clear, honest communication and delivering measurable results without the jargon.",
    icon: Check,
  },
  {
    title: "Integrated Growth Partner",
    description:
      "We embed our expert consultants within your SME to act as a true extension of your team.",
    icon: Handshake,
  },
  {
    title: "Cost-Effective Expertise",
    description:
      "Access high-calibre C-suite leadership and marketing skills flexibly, without full-time overheads.",
    icon: Scale,
  },
  {
    title: "AI-Powered Efficiency",
    description:
      "Leverage cutting-edge AI for rapid analysis and insights, saving you time and resources.",
    icon: Zap,
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Enter Your Email",
    description:
      "Provide your business email to access the free AI analysis tool.",
    icon: CheckCircle,
  },
  {
    step: 2,
    title: "Input Business Details",
    description:
      "Tell us about your website, industry, and main UK competitors.",
    icon: CheckCircle,
  },
  {
    step: 3,
    title: "Receive Your Report",
    description:
      "Get an instant AI-generated report covering SEO, competitors, market insights, and recommendations.",
    icon: CheckCircle,
  },
];


export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handler remains in the parent page to manage state and routing
  const handleGetStarted = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.warning("Please enter a valid business email address.");
      return;
    }
    setIsLoading(true);
    try {
      localStorage.setItem("businessAnalysisEmail", email);
      console.log("Email saved to localStorage.");
      toast.success("Email captured!", {
        description: "Redirecting to analysis tool...",
      });
      setTimeout(() => {
        router.push("/analysis");
      }, 1000);
    } catch (storageError) {
      console.error("Error saving email to localStorage:", storageError);
      toast.error("Could not save email. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection
          email={email}
          setEmail={setEmail}
          handleGetStarted={handleGetStarted}
          isLoading={isLoading}
        />
        <ToolInsightsSection /> {/* Add the new section here */}
        <FeaturesSection features={features} />
        <BenefitsSection benefits={benefits} />
        <HowItWorksSection steps={howItWorksSteps} />
        <CtaSection
          email={email}
          setEmail={setEmail}
          handleGetStarted={handleGetStarted}
          isLoading={isLoading}
        />
        <ConsultancySection />
      </main>
      <Footer />
      {/* Toaster should be in the root layout or a shared client component */}
    </div>
  );
}
