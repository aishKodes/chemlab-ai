import { getAiUsageOverview } from "@/lib/analytics/aiUsage";

export async function GET() {
  return Response.json(await getAiUsageOverview());
}
