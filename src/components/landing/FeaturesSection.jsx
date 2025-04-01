"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Animation variants (can be passed as props or defined locally)
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    // Default i to 1 if not provided
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

export default function FeaturesSection({ features }) {
  return (
    <motion.section
      custom={1} // Animation delay index
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      id="features" // Section ID for scrolling
      className="container mx-auto px-6 py-16 lg:py-24"
    >
      <div className="max-w-xl mx-auto text-center mb-12 lg:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Profici: Your Strategic Growth Partner
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Leveraging AI and expert consultancy to drive tangible results for UK
          SMEs.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            custom={index} // Stagger item animation
          >
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 border text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
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
  );
}
