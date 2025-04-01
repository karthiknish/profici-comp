import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-10">
        <Button variant="outline" size="sm" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Terms and Conditions
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: [Date]</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            Agreement to Terms
          </h2>
          <p>
            By accessing or using the Profici AI Analysis tool ("Service"), you
            agree to be bound by these Terms and Conditions ("Terms"). If you
            disagree with any part of the terms, then you may not access the
            Service.
          </p>
          <p className="font-semibold text-destructive dark:text-red-400">
            [IMPORTANT: Replace this placeholder text with your actual Terms and
            Conditions content. Consult with a legal professional.]
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Use License</h2>
          <p>
            Permission is granted to temporarily use the materials (information
            or software) on Profici AI Analysis&apos;s website for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title...
          </p>
          {/* Add more sections as required: Disclaimer, Limitations, Accuracy of Materials, Links, Modifications, Governing Law, etc. */}

          <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            [Your Contact Email/Info].
          </p>
        </div>
      </div>
    </div>
  );
}
