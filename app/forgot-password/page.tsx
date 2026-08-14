import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/PasswordRecoveryForms";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account help"
      title="Get back into chemlearning."
      description="Password recovery is calm and private. We do not reveal whether an email exists."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
