import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chemlab-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ChemLab AI | Interactive Chemistry Learning Lab",
    template: "%s | ChemLab AI",
  },
  description:
    "A chemistry-first academic platform with interactive simulations, mastery quizzes, visual tools, and an AI tutor for deep understanding.",
  applicationName: "ChemLab AI",
  openGraph: {
    title: "ChemLab AI",
    description:
      "See chemistry, simulate chemistry, and master chemistry through serious interactive learning.",
    url: siteUrl,
    siteName: "ChemLab AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChemLab AI",
    description:
      "Interactive simulations, AI tutoring, quizzes, and chemistry tools for rigorous learning.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
