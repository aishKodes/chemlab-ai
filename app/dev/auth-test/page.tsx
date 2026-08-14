import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthEndpointTestPanel } from "@/components/auth/AuthEndpointTestPanel";

export const metadata: Metadata = {
  title: "Auth test",
};

export default function DevAuthTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AuthEndpointTestPanel />;
}
