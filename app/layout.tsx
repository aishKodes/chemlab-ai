import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.chemlearning.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "chemlearning | Chemistry, but Alive",
    template: "%s | chemlearning",
  },
  description:
    "A colourful interactive chemistry learning universe where students build atoms, run virtual labs, and learn with Chem-Shastri.",
  applicationName: "chemlearning",
  openGraph: {
    title: "chemlearning",
    description:
      "Chemistry, but alive: quests, simulations, boss quizzes, mistake clues, and Chem-Shastri.",
    url: siteUrl,
    siteName: "chemlearning",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "chemlearning",
    description:
      "Build atoms, battle misconceptions, run virtual labs, and master reactions through play.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AppProviders>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
