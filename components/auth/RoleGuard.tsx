"use client";

import { LockKeyhole } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { UserRole } from "@/lib/api/backendTypes";
import { dashboardPathForRole } from "@/lib/auth/authTypes";

export function RoleGuard({ allowed, children }: { allowed: UserRole[]; children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGate allowed={allowed}>{children}</RoleGate>
    </AuthGuard>
  );
}

function RoleGate({ allowed, children }: { allowed: UserRole[]; children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingState label="Checking your role" />;
  if (!user || !allowed.includes(user.role)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="This area needs a different role"
          description="Your Chemlab account is safe, but this page is reserved for another workspace."
          icon={<LockKeyhole className="h-6 w-6" aria-hidden="true" />}
          action={<Button href={dashboardPathForRole(user?.role)}>Go to my dashboard</Button>}
        />
      </div>
    );
  }
  return <>{children}</>;
}
