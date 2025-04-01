import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Helper component for consistent section headings
const SectionHeading = ({ children }) => (
  <h2 className="text-xl font-semibold mt-8 mb-3">{children}</h2>
);

export default function TermsConditionsPage() {
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
          Terms and Conditions
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

          <SectionHeading>1. Agreement to Terms</SectionHeading>
          <p>
            These Terms and Conditions constitute a legally binding agreement
            made between you, whether personally or on behalf of an entity
            (“you”) and {companyName} (“we,” “us” or “our”), concerning your
            access to and use of the {siteName} website as well as any other
            media form, media channel, mobile website or mobile application
            related, linked, or otherwise connected thereto (collectively, the
            “Service”). You agree that by accessing the Service, you have read,
            understood, and agree to be bound by all of these Terms and
            Conditions. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS AND
            CONDITIONS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICE
            AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </p>

          <SectionHeading>2. Intellectual Property Rights</SectionHeading>
          <p>
            Unless otherwise indicated, the Service is our proprietary property
            and all source code, databases, functionality, software, website
            designs, audio, video, text, photographs, and graphics on the Site
            (collectively, the “Content”) and the trademarks, service marks, and
            logos contained therein (the “Marks”) are owned or controlled by us
            or licensed to us, and are protected by copyright and trademark
            laws. Except as expressly provided in these Terms and Conditions, no
            part of the Service and no Content or Marks may be copied,
            reproduced, aggregated, republished, uploaded, posted, publicly
            displayed, encoded, translated, transmitted, distributed, sold,
            licensed, or otherwise exploited for any commercial purpose
            whatsoever, without our express prior written permission.
          </p>

          <SectionHeading>3. User Representations</SectionHeading>
          <p>
            By using the Service, you represent and warrant that: (1) all
            registration information you submit will be true, accurate, current,
            and complete; (2) you will maintain the accuracy of such information
            and promptly update such registration information as necessary; (3)
            you have the legal capacity and you agree to comply with these Terms
            and Conditions; (4) you are not a minor in the jurisdiction in which
            you reside; (5) you will not access the Service through automated or
            non-human means, whether through a bot, script or otherwise; (6) you
            will not use the Service for any illegal or unauthorized purpose;
            and (7) your use of the Service will not violate any applicable law
            or regulation.
          </p>

          <SectionHeading>4. Prohibited Activities</SectionHeading>
          <p>
            You may not access or use the Service for any purpose other than
            that for which we make the Service available. The Service may not be
            used in connection with any commercial endeavors except those that
            are specifically endorsed or approved by us. As a user of the
            Service, you agree not to: [List prohibited activities - e.g.,
            systematically retrieve data, trick or defraud, interfere with
            security features, disparage us, use for competing purposes,
            decipher code, harass employees, use automated systems, upload
            viruses, etc.]
          </p>
          <p className="font-semibold text-destructive dark:text-red-400">
            [IMPORTANT: This section requires significant customization and
            legal review.]
          </p>

          <SectionHeading>5. Service Management</SectionHeading>
          <p>
            We reserve the right, but not the obligation, to: (1) monitor the
            Service for violations of these Terms and Conditions; (2) take
            appropriate legal action against anyone who, in our sole discretion,
            violates the law or these Terms and Conditions; (3) in our sole
            discretion and without limitation, refuse, restrict access to, limit
            the availability of, or disable any of your Contributions or any
            portion thereof; (4) otherwise manage the Service in a manner
            designed to protect our rights and property and to facilitate the
            proper functioning of the Service.
          </p>

          <SectionHeading>6. Term and Termination</SectionHeading>
          <p>
            These Terms and Conditions shall remain in full force and effect
            while you use the Service. WITHOUT LIMITING ANY OTHER PROVISION OF
            THESE TERMS AND CONDITIONS, WE RESERVE THE RIGHT TO, IN OUR SOLE
            DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE
            OF THE SERVICE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY
            PERSON FOR ANY REASON OR FOR NO REASON...
          </p>

          <SectionHeading>7. Modifications and Interruptions</SectionHeading>
          <p>
            We reserve the right to change, modify, or remove the contents of
            the Service at any time or for any reason at our sole discretion
            without notice. We also reserve the right to modify or discontinue
            all or part of the Service without notice at any time. We will not
            be liable to you or any third party for any modification, price
            change, suspension, or discontinuance of the Service. We cannot
            guarantee the Service will be available at all times.
          </p>

          <SectionHeading>8. Governing Law</SectionHeading>
          <p>
            These Terms shall be governed by and defined following the laws of
            England and Wales. {companyName} and yourself irrevocably consent
            that the courts of England and Wales shall have exclusive
            jurisdiction to resolve any dispute which may arise in connection
            with these terms.
          </p>
          <p className="font-semibold text-destructive dark:text-red-400">
            [IMPORTANT: Verify governing law and jurisdiction with a legal
            professional.]
          </p>

          <SectionHeading>9. Disclaimer</SectionHeading>
          <p>
            THE SERVICE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU
            AGREE THAT YOUR USE OF THE SERVICE WILL BE AT YOUR SOLE RISK. TO THE
            FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS
            OR IMPLIED, IN CONNECTION WITH THE SERVICE AND YOUR USE THEREOF,
            INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE
            ACCURACY OR COMPLETENESS OF THE SERVICE'S CONTENT OR THE CONTENT OF
            ANY WEBSITES LINKED TO THE SERVICE AND WE WILL ASSUME NO LIABILITY
            OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF
            CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF
            ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE
            SERVICE... [Add full disclaimer text]
          </p>
          <p className="font-semibold text-destructive dark:text-red-400">
            [IMPORTANT: This disclaimer needs careful legal review.]
          </p>

          <SectionHeading>10. Limitations of Liability</SectionHeading>
          <p>
            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE
            TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL,
            EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES... [Add full
            limitation of liability text]
          </p>

          <SectionHeading>11. Contact Us</SectionHeading>
          <p>
            In order to resolve a complaint regarding the Service or to receive
            further information regarding use of the Service, please contact us
            at: {contactEmail}.
          </p>
        </div>
      </div>
    </div>
  );
}
