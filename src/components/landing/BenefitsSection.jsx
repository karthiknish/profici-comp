"use client";

import { motion } from "framer-motion";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 2) => ({
    // Default i to 2
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 }, // Slide in from left
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function BenefitsSection({ benefits }) {
  return (
    <motion.section
      custom={2} // Animation delay index
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      id="benefits" // Section ID
      className="container mx-auto px-6 py-16 lg:py-24"
    >
      <div className="max-w-xl mx-auto text-center mb-12 lg:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Why Partner with Profici?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Unlock advantages that drive real business growth for your SME.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            variants={itemVariants}
            custom={index} // Stagger item animation
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
  );
}
