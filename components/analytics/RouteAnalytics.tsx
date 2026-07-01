"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/trackEvent";

const trackedSimulationSlugs: Record<string, string> = {
  "/labs/redox-transfer-kitchen": "redox-transfer-kitchen",
  "/labs/hydrocarbon-naming-quest": "hydrocarbon-naming-quest",
};

export function RouteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    void trackEvent({
      event_type: "page",
      event_name: "page_view",
      page_path: pathname,
    });

    const simulationSlug = trackedSimulationSlugs[pathname];
    if (simulationSlug) {
      void trackEvent({
        event_type: "simulation",
        event_name: "simulation_opened",
        page_path: pathname,
        metadata: { simulationSlug },
      });
    }
  }, [pathname]);

  return null;
}
