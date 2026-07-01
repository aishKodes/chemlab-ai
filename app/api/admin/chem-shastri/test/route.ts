import { z } from "zod";
import { answerChemShastri } from "@/lib/chem-shastri/chemShastriService";

export const dynamic = "force-dynamic";

const schema = z.object({
  message: z.string().min(1).max(1200).default("What is oxidation?"),
  classLevel: z.enum(["8", "9", "10", "11", "12"]).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: "Invalid Chem-Shastri admin test.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const response = await answerChemShastri({
    message: parsed.data.message,
    classLevel: parsed.data.classLevel ?? "10",
    role: "admin",
    mode: "explain",
    currentPage: "/admin/chem-shastri",
    usePageContext: true,
  });
  return Response.json({ ok: true, data: response });
}
