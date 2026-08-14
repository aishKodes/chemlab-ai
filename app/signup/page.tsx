import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a chemlearning student or teacher account.",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Join chemlearning"
      title="Start learning chemistry by doing."
      description="Students get a quest dashboard. Teachers get a resource space for classroom use."
    >
      <SignupForm />
    </AuthShell>
  );
}
