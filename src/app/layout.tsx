import type { Metadata } from "next";
import { Kalam, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const kalam = Kalam({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-kalam-var",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick-var",
  display: "swap",
});

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vasuu.bond"),
  title: {
    default: "Vasudev Dhakar | Full Stack Web Developer & UI/UX Designer in Bhilwara",
    template: "%s | Vasudev Dhakar"
  },
  description: "Vasudev Dhakar (Vasu) is a premier Full Stack Web Developer & UI/UX Designer in Bhilwara, Rajasthan, India. Specializing in Next.js, React, high-performance business websites, and modern UI/UX design.",
  keywords: [
    "Vasudev Dhakar",
    "Vasu dev dhakar",
    "Vasu Developer",
    "Vasu Web Developer",
    "Vasu UI Designer",
    "Vasu Portfolio",
    "Website Developer Bhilwara",
    "Web Developer Bhilwara",
    "UI UX Designer Bhilwara",
    "Freelance Web Developer Rajasthan",
    "Portfolio Developer India",
    "React Developer Bhilwara",
    "Next.js Developer Rajasthan",
    "Frontend Developer Bhilwara",
    "Website Designer Bhilwara",
    "Web Designer Bhilwara",
    "Responsive Website Development"
  ],
  authors: [{ name: "Vasudev Dhakar", url: "https://vasuu.bond" }],
  creator: "Vasudev Dhakar",
  publisher: "Vasudev Dhakar",
  applicationName: "Vasudev Dhakar Portfolio",
  generator: "Next.js",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Vasudev Dhakar | Full Stack Web Developer & UI/UX Designer in Bhilwara",
    description: "Explore Vasudev Dhakar's (Vasu) creative web development and UI/UX design portfolio. Expert Next.js & React developer based in Bhilwara, Rajasthan, India.",
    url: "https://vasuu.bond",
    siteName: "Vasudev Dhakar Portfolio",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Vasudev Dhakar - Web Developer & UI/UX Designer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasudev Dhakar | Full Stack Web Developer & UI/UX Designer",
    description: "Vasudev Dhakar (Vasu) - Professional Web Developer and UI/UX Designer in Bhilwara, Rajasthan, India.",
    creator: "@VASUGAMER09",
    images: ["/icon.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png" },
    ],
    shortcut: ["/icon.png"],
  },
  manifest: "/manifest.json",
  category: "technology",
  verification: {
    google: "google-site-verification-placeholder",
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { NotificationPrompt } from "@/components/ui/NotificationPrompt";
import { NotificationListener } from "@/components/ui/NotificationListener";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${kalam.variable} ${patrickHand.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <NotificationPrompt />
          <NotificationListener />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
