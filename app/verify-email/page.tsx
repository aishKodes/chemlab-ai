import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyEmailForm } from "@/components/auth/PasswordRecoveryForms";

export const metadata: Metadata = {
  title: "Verify email",
};

export default function VerifyEmailPage() {
  return (
    <AuthShell eyebrow="Verify email" title="Confirm your Chemlab email." description="A verified email keeps your account and learning progress safer.">
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>
    </AuthShell>
  );
}
