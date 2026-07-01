import { chemShastriConfig } from "./chemShastriConfig";
import type { ChemShastriFeedbackPayload } from "./chemShastriTypes";

export async function submitChemShastriFeedback(payload: ChemShastriFeedbackPayload) {
  const baseUrl = chemShastriConfig.hostingerBaseUrl();
  if (baseUrl && payload.questionLogId) {
    try {
      const response = await fetch(`${baseUrl}/api/learning/chem-shastri/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          question_log_id: payload.questionLogId,
          helpful_rating: payload.rating === "wrong_answer" ? "wrong" : payload.rating,
        }),
      });
      if (response.ok) return { ok: true, source: "backend" };
    } catch {
      // Supabase/local fallback below.
    }
  }
  return { ok: true, source: "local" };
}
