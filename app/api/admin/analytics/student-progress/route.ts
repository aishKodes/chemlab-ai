import { getLearningOverview } from "@/lib/analytics/learningAnalytics";

export async function GET() {
  return Response.json(await getLearningOverview());
}
