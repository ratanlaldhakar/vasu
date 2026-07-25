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
    default: "Vasu — Web Developer & UI/UX Designer Portfolio",
    template: "%s | Vasu Portfolio"
  },
  description: "Explore Vasu's (Vasudev Dhakar) creative design and development portfolio. Specializing in high-performance Next.js websites, React apps, and premium hand-drawn UI/UX styles in Bhilwara, Rajasthan, India.",
  keywords: ["portfolio", "design", "UI kits", "templates", "graphics", "Vasu", "Bhilwara", "Rajasthan", "Web Developer"],
  authors: [{ name: "Vasudev Dhakar", url: "https://vasuu.bond" }],
  creator: "Vasudev Dhakar",
  publisher: "Vasudev Dhakar",
  applicationName: "Vasu Portfolio",
  generator: "Next.js",
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
    title: "Vasu — Web Developer & UI/UX Designer Portfolio",
    description: "Explore Vasu's creative design and portfolio. Specializing in high-performance Next.js websites and premium UI/UX styles.",
    url: "https://vasuu.bond",
    siteName: "Vasu Portfolio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasu — Web Developer & UI/UX Designer Portfolio",
    description: "Explore Vasu's creative design and portfolio.",
    creator: "@VASUGAMER09",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  category: "technology",
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
