import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Helper component for consistent section headings
const SectionHeading = ({ children }) => (
  <h2 className="text-xl font-semibold mt-8 mb-3">{children}</h2>
);

export default function PrivacyPolicyPage() {
  const contactEmail = "info@profici.co.uk";
  const siteName = "Profici AI Analysis";
  const companyName = "Profici Ltd.";
  const lastUpdated = "April 1, 2025"; // Update this date

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-10">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="mb-6 print:hidden"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Privacy Policy
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

          <SectionHeading>1. Introduction</SectionHeading>
          <p>
            Welcome to {siteName} ("we", "our", "us"), operated by {companyName}
            . We are committed to protecting your personal information and your
            right to privacy. This Privacy Policy applies to all information
            collected through our website and related services (collectively,
            the "Services").
          </p>
          <p>
            If you have any questions or concerns about this privacy notice, or
            our practices with regards to your personal information, please
            contact us at {contactEmail}.
          </p>

          <SectionHeading>2. Information We Collect</SectionHeading>
          <p>
            We collect personal information that you voluntarily provide to us
            when you use the Service, primarily your business email address when
            you initiate an analysis request. We may also collect information
            automatically when you visit our website, such as your IP address,
            browser type, operating system, referring URLs, and pages visited,
            through the use of cookies and similar technologies.
          </p>
          <p>
            The analysis tool processes information you provide about your
            business, website, industry, and competitors to generate reports.
            This input data is used solely for the purpose of generating the
            requested analysis and is processed by our AI partner (e.g., Google
            Gemini) according to their terms and privacy policies.
          </p>

          <SectionHeading>3. How We Use Your Information</SectionHeading>
          <p>We use the information we collect or receive:</p>
          <ul>
            <li>
              To provide, operate, and maintain our Services (e.g., generating
              analysis reports).
            </li>
            <li>
              To communicate with you, potentially including sending information
              about related services or updates if you opt-in.
            </li>
            <li>To improve, personalize, and expand our Services.</li>
            <li>To understand and analyze how you use our Services.</li>
            <li>To detect and prevent fraud or security issues.</li>
            <li>
              For compliance purposes, including enforcing our Terms and
              Conditions or other legal rights.
            </li>
          </ul>

          <SectionHeading>4. Sharing Your Information</SectionHeading>
          <p>
            We do not sell your personal information. We may share information
            in the following situations:
          </p>
          <ul>
            <li>
              <strong>With Service Providers:</strong> We may share your
              information with third-party vendors, service providers,
              contractors, or agents who perform services for us or on our
              behalf and require access to such information to do that work
              (e.g., AI model providers like Google, hosting providers).
            </li>
            <li>
              <strong>For Legal Reasons:</strong> We may disclose your
              information where we are legally required to do so in order to
              comply with applicable law, governmental requests, a judicial
              proceeding, court order, or legal process.
            </li>
            <li>
              <strong>To Protect Rights:</strong> We may disclose your
              information where we believe it is necessary to investigate,
              prevent, or take action regarding potential violations of our
              policies, suspected fraud, situations involving potential threats
              to the safety of any person and illegal activities, or as evidence
              in litigation in which we are involved.
            </li>
            <li>
              <strong>Business Transfers:</strong> We may share or transfer your
              information in connection with, or during negotiations of, any
              merger, sale of company assets, financing, or acquisition of all
              or a portion of our business to another company.
            </li>
          </ul>

          <SectionHeading>5. Cookies and Tracking Technologies</SectionHeading>
          <p>
            We may use cookies and similar tracking technologies (like web
            beacons and pixels) to access or store information. Specific
            information about how we use such technologies and how you can
            refuse certain cookies is set out in our Cookie Policy [Link to
            Cookie Policy if you have one, otherwise remove or adapt this
            sentence].
          </p>

          <SectionHeading>6. Data Security</SectionHeading>
          <p>
            We have implemented appropriate technical and organizational
            security measures designed to protect the security of any personal
            information we process. However, despite our safeguards and efforts
            to secure your information, no electronic transmission over the
            Internet or information storage technology can be guaranteed to be
            100% secure.
          </p>

          <SectionHeading>7. Data Retention</SectionHeading>
          <p>
            We will only keep your personal information for as long as it is
            necessary for the purposes set out in this privacy notice, unless a
            longer retention period is required or permitted by law (such as
            tax, accounting or other legal requirements).
          </p>

          <SectionHeading>8. Your Privacy Rights</SectionHeading>
          <p>
            Depending on your location (e.g., UK, EU), you may have certain
            rights regarding your personal information under applicable data
            protection laws. These may include the right to (i) request access
            and obtain a copy of your personal information, (ii) request
            rectification or erasure; (iii) restrict the processing of your
            personal information; and (iv) if applicable, to data portability.
            In certain circumstances, you may also have the right to object to
            the processing of your personal information. To make such a request,
            please use the contact details provided below.
          </p>

          <SectionHeading>9. Changes to This Privacy Notice</SectionHeading>
          <p>
            We may update this privacy notice from time to time. The updated
            version will be indicated by an updated "Last updated" date and the
            updated version will be effective as soon as it is accessible. We
            encourage you to review this privacy notice frequently to be
            informed of how we are protecting your information.
          </p>

          <SectionHeading>10. Contact Us</SectionHeading>
          <p>
            If you have questions or comments about this notice, you may contact
            us at: {contactEmail}.
          </p>
        </div>
      </div>
    </div>
  );
}
