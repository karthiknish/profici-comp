"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 5) => ({
    // Default i to 5
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    },
  }),
};

export default function ConsultancySection() {
  return (
    <motion.section
      custom={5} // Adjusted delay index
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      id="profici-consultancy"
      className="container mx-auto px-6 py-16 lg:py-24"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
          Beyond the AI: Expert Consultancy
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          This AI tool provides valuable initial insights, but true growth often
          requires tailored strategic guidance. Profici&apos;s expert
          consultants partner with UK SMEs, offering Digital Marketing and
          Fractional C-Suite services to implement strategies and achieve
          sustainable success.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" asChild>
            <Link
              href="https://profici.co.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More About Profici <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
