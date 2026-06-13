import { answerMasterAlchem } from "@/lib/master-alchem/masterAlchemService";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return Response.json(
    await answerMasterAlchem(
      {
        message: body.message || "Quiz me with one NCERT chemistry question and wait for my answer.",
        anonymousId: body.anonymousId,
        userId: body.userId,
        classLevel: body.classLevel,
        subject: "chemistry",
        chapterSlug: body.chapterSlug,
        topicSlug: body.topicSlug,
        mode: "quiz_me",
      },
      request,
    ),
  );
}
