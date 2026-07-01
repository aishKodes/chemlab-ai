"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { RouteAnalytics } from "@/components/analytics/RouteAnalytics";
import { MasterAlchemProvider } from "@/components/master-alchem/MasterAlchemProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MasterAlchemProvider>
        <RouteAnalytics />
        {children}
      </MasterAlchemProvider>
    </AuthProvider>
  );
}
