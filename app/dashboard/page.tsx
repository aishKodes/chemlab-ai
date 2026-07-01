"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/components/auth/AuthProvider";
import { dashboardPathForRole } from "@/lib/auth/authTypes";

export default function DashboardRedirectPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?next=/dashboard");
      return;
    }
    router.replace(dashboardPathForRole(user?.role));
  }, [isAuthenticated, isLoading, router, user?.role]);

  return <LoadingState label="Opening your dashboard" />;
}
