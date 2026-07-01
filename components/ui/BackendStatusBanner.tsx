"use client";

import { WifiOff } from "lucide-react";
import { isBackendConfigured } from "@/lib/api/backendClient";

export function BackendStatusBanner({ message }: { message?: string }) {
  if (isBackendConfigured() && !message) return null;

  return (
    <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950">
      <div className="flex items-start gap-3">
        <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
        <p>
          {message ??
            "Chemlab account services are not connected yet. Public labs still work, and login will connect after setup is completed."}
        </p>
      </div>
    </div>
  );
}
