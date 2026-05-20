import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MasterAlchemProvider } from "@/components/master-alchem/MasterAlchemProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chemlab.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chemlab | Chemistry, but Alive",
    template: "%s | Chemlab",
  },
  description:
    "A colourful interactive chemistry learning universe where students build atoms, run virtual labs, and learn with Master Alchem.",
  applicationName: "Chemlab",
  openGraph: {
    title: "Chemlab",
    description:
      "Chemistry, but alive: quests, simulations, boss quizzes, mistake monsters, and Master Alchem.",
    url: siteUrl,
    siteName: "Chemlab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chemlab",
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
        <MasterAlchemProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </MasterAlchemProvider>
      </body>
    </html>
  );
}
