"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 3) => ({
    // Default i to 3
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

export default function HowItWorksSection({ steps }) {
  return (
    <motion.section
      custom={3} // Animation delay index
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      id="how-it-works" // Section ID
      className="container mx-auto px-6 py-16 lg:py-24 bg-muted/50 rounded-lg border"
    >
      <div className="max-w-xl mx-auto text-center mb-12 lg:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          How the AI Analysis Works
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 text-center relative">
        {steps.map((step, index) => (
          <motion.div
            key={step.step}
            variants={itemVariants}
            custom={index} // Stagger item animation
            className="relative z-10 flex flex-col items-center"
          >
            <Card className="h-full text-center bg-background">
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
  );
}
