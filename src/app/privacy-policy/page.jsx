import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-10">
        <Button variant="outline" size="sm" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Privacy Policy
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: [Date]</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">Introduction</h2>
          <p>
            Welcome to Profici AI Analysis ("we", "our", "us"). We are committed
            to protecting your personal information and your right to privacy.
            If you have any questions or concerns about this privacy notice, or
            our practices with regards to your personal information, please
            contact us at [Your Contact Email/Info].
          </p>
          <p>
            This privacy notice describes how we might use your information if
            you use our website or services.
          </p>
          <p className="font-semibold text-destructive dark:text-red-400">
            [IMPORTANT: Replace this placeholder text with your actual Privacy
            Policy content. Consult with a legal professional to ensure
            compliance.]
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            Information We Collect
          </h2>
          <p>
            We collect personal information that you voluntarily provide to us
            when you express an interest in obtaining information about us or
            our products and Services, when you participate in activities on the
            Services or otherwise when you contact us.
          </p>
          <p>
            The personal information that we collect depends on the context of
            your interactions with us and the Services, the choices you make and
            the products and features you use. The personal information we
            collect may include the following: Business Email Address.
          </p>
          {/* Add more sections as required by your policy: How We Use Information, Sharing Information, Cookies, Data Security, Your Rights, Contact Us, etc. */}

          <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may contact
            us at [Your Contact Email/Info].
          </p>
        </div>
      </div>
    </div>
  );
}
