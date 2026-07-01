export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    data: {
      questions: [],
      note: "Question-log review is ready for Hostinger data. Use /api/learning/chem-shastri/question-log for writes.",
    },
  });
}
