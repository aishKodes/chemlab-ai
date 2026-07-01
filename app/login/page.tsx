import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to Chemlab and continue your chemistry quests.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Chemlab login"
      title="Return to your chemistry universe."
      description="Your labs, resources, and dashboard open from one safe account."
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
