"use client";

import { CheckCircle2, MessageSquareText, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { analyticsApi } from "@/lib/api/analyticsApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { getLearningSessionId } from "@/lib/analytics/sessionTracker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const helpfulOptions = [
  ["simulation", "A lab or simulation"],
  ["explanation", "A clear explanation"],
  ["practice", "Practice questions"],
  ["chem_shastri", "Chem-Shastri"],
] as const;

const frictionOptions = [
  ["next_step", "I did not know the next step"],
  ["too_fast", "The explanation moved too fast"],
  ["difficult_words", "Some words felt difficult"],
  ["slow_or_broken", "Something felt slow or did not work"],
  ["none", "Nothing blocked me today"],
] as const;

const improvementOptions = [
  ["clearer_guidance", "Clearer step-by-step guidance"],
  ["worked_examples", "More worked examples"],
  ["better_labs", "More realistic labs"],
  ["practice_feedback", "Better feedback after answers"],
  ["mentor_answers", "Better Chem-Shastri answers"],
  ["language_support", "More language support"],
] as const;

export function StudentFeedbackSurvey() {
  const [helpedMost, setHelpedMost] = useState("");
  const [frictionPoint, setFrictionPoint] = useState("");
  const [improvementPriority, setImprovementPriority] = useState("");
  const [clarityRating, setClarityRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const ready = Boolean(helpedMost && frictionPoint && improvementPriority && clarityRating);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || status === "sending") return;

    setStatus("sending");
    setError(null);
    try {
      await analyticsApi.trackEvent({
        event_type: "learning",
        event_name: "student_feedback_submitted",
        page_path: "/student/dashboard",
        session_id: getLearningSessionId(),
        metadata: {
          helped_most: helpedMost,
          friction_point: frictionPoint,
          improvement_priority: improvementPriority,
          clarity_rating: clarityRating,
          comment: comment.trim().slice(0, 800),
          survey_version: 1,
        },
      });
      setStatus("sent");
    } catch (caught) {
      setStatus("idle");
      setError(getReadableApiError(caught));
    }
  }

  if (status === "sent") {
    return (
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <Badge tone="green">Feedback received</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Thank you for being honest.</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Your answers will help us decide what Chemlab should improve next.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-blue-100 bg-gradient-to-br from-white via-blue-50 to-violet-50">
      <form onSubmit={submit}>
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-700">
            <MessageSquareText className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <Badge tone="blue">Help shape Chemlab</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">How was learning today?</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Four quick answers tell us what is working and what needs attention.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <ChoiceGroup label="What helped you most?" value={helpedMost} onChange={setHelpedMost} options={helpfulOptions} />
          <ChoiceGroup label="Where did learning slow down?" value={frictionPoint} onChange={setFrictionPoint} options={frictionOptions} />
          <ChoiceGroup
            label="What should we improve first?"
            value={improvementPriority}
            onChange={setImprovementPriority}
            options={improvementOptions}
          />
          <fieldset>
            <legend className="text-sm font-black text-slate-800">How clear did Chemlab feel today?</legend>
            <div className="mt-3 grid grid-cols-5 gap-2" aria-label="Clarity rating from 1 to 5">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  aria-label={`${rating} out of 5`}
                  aria-pressed={clarityRating === rating}
                  onClick={() => setClarityRating(rating)}
                  className={`h-11 rounded-xl border text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                    clarityRating === rating
                      ? "border-blue-500 bg-blue-600 text-white"
                      : "border-blue-100 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs font-bold text-slate-500">
              <span>Confusing</span>
              <span>Very clear</span>
            </div>
          </fieldset>
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-black text-slate-800">Tell us one thing you would change (optional)</span>
          <textarea
            value={comment}
            maxLength={800}
            rows={3}
            onChange={(event) => setComment(event.target.value)}
            placeholder="For example: the instruction in the redox lab was hard to notice."
            className="mt-2 w-full resize-y rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        {error ? <p className="mt-3 text-sm font-bold text-rose-700">We could not save that yet: {error}</p> : null}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold text-slate-500">Please avoid sharing passwords or private contact details.</p>
          <Button type="submit" disabled={!ready || status === "sending"} icon={<Send className="h-4 w-4" aria-hidden="true" />}>
            {status === "sending" ? "Sending..." : "Send feedback"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ChoiceGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-black text-slate-800">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map(([key, text]) => (
          <button
            key={key}
            type="button"
            aria-pressed={value === key}
            onClick={() => onChange(key)}
            className={`rounded-xl border px-3 py-2 text-left text-xs font-extrabold transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
              value === key
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-blue-100 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-800"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
