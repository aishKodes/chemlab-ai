import { getAdminAnalyticsOverview } from "@/lib/analytics/adminMetrics";

export async function GET() {
  return Response.json(await getAdminAnalyticsOverview());
}
