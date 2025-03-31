import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define base URL for absolute paths in metadata (replace with actual production URL)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const siteName = "Profici Competitive Analysis";
const siteDescription =
  "Gain a competitive edge with AI-powered analysis of SEO, competitors, market trends, and strategic recommendations. Powered by Profici.co.uk.";
const keywords = [
  "competitive analysis",
  "business intelligence",
  "AI analysis",
  "SEO audit",
  "competitor research",
  "market analysis",
  "strategic recommendations",
  "Profici",
  "AI business tool",
];
const author = "Profici Ltd.";
// Placeholder image - ensure you create this file in the public directory
const ogImageUrl = `${baseUrl}/og-image.png`;

export const metadata = {
  // Basic SEO
  title: {
    default: siteName,
    template: `%s | ${siteName}`, // Allows pages to set their own title part
  },
  description: siteDescription,
  keywords: keywords.join(", "),
  authors: [{ name: author, url: "https://profici.co.uk" }], // Link to main site
  creator: author,
  publisher: author,

  // Viewport - Removed from here

  // Robots / Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons (assuming favicon.ico exists in /app)
  icons: {
    icon: "/favicon.ico",
    // shortcut: '/shortcut-icon.png', // Example
    // apple: '/apple-touch-icon.png', // Example
  },

  // Open Graph (for Facebook, LinkedIn, etc.)
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: baseUrl, // Use the base URL
    siteName: siteName,
    images: [
      {
        url: ogImageUrl,
        width: 1200, // Standard OG image width
        height: 630, // Standard OG image height
        alt: `${siteName} - AI-Powered Competitive Analysis`,
      },
    ],
    locale: "en_GB", // Adjust locale if needed
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    // siteId: 'YourTwitterSiteID', // Optional: Twitter Site ID
    // creator: '@YourTwitterHandle', // Optional: Twitter handle of content creator
    // creatorId: 'YourTwitterCreatorID', // Optional: Twitter ID of content creator
    images: [ogImageUrl], // Must be an absolute URL
  },

  // Verification (Add verification codes if needed)
  // verification: {
  //   google: 'YourGoogleVerificationCode',
  //   yandex: 'YourYandexVerificationCode',
  //   yahoo: 'YourYahooVerificationCode',
  //   other: {
  //     me: ['my-email@example.com', 'my-link@example.com'],
  //   },
  // },

  // Other useful tags
  metadataBase: new URL(baseUrl), // Sets the base for resolving relative URLs like og:image
  alternates: {
    canonical: "/", // Sets the canonical URL for the homepage
    // languages: { // Example if you add multiple languages
    //   'en-US': '/en-US',
    //   'de-DE': '/de-DE',
    // },
  },
  // manifest: "/manifest.json", // Removed as file doesn't exist
  appleWebApp: {
    title: siteName,
    statusBarStyle: "default", // or 'black-translucent'
    // startupImage: [ // Example startup images
    //   '/assets/startup/apple-touch-startup-image-768x1004.png',
    //   {
    //     url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
    //     media: '(device-width: 768px) and (device-height: 1024px)',
    //   },
    // ],
  },
};

// Viewport export for themeColor and other viewport settings
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }, // Adjust dark theme color if needed
  ],
  width: "device-width", // Add viewport properties here
  initialScale: 1,
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
