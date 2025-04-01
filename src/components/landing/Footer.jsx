"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 6) => ({
    // Default i to 6
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    },
  }),
};

export default function Footer() {
  return (
    <motion.footer
      custom={6} // Adjusted delay index
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="bg-gray-100 dark:bg-gray-950 py-8"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Profici AI Analysis
            </div>
            <p className="text-muted-foreground text-sm">
              Powered by Profici.co.uk
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 items-center text-sm text-muted-foreground">
            {/* Updated Links */}
            <Link
              href="/terms-conditions"
              className="hover:text-foreground transition"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-foreground transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="https://profici.co.uk/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="border-t border-border mt-6 pt-6 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Profici Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
