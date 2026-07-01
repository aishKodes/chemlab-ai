"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { liveQuizApi } from "@/lib/api/liveQuizApi";

export function CreateTeacherQuizForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    source_drill_id: "",
    visibility: "private",
    status: "draft",
    time_limit_minutes: "6",
    show_correct_after_each: true,
    show_leaderboard: true,
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = await liveQuizApi.createTeacherQuiz({
        title: form.title,
        description: form.description,
        source_drill_id: form.source_drill_id ? Number(form.source_drill_id) : null,
        visibility: form.visibility as "private" | "public",
        status: form.status as "draft" | "published",
        time_limit_minutes: Number(form.time_limit_minutes || 0) || null,
        show_correct_after_each: form.show_correct_after_each,
        show_leaderboard: form.show_leaderboard,
      });
      router.push(`/teacher/quizzes/${payload.quiz_id}`);
    } catch (caught) {
      setError(getReadableApiError(caught));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mx-auto max-w-3xl bg-gradient-to-br from-white via-cyan-50 to-lime-50">
      <Badge tone="blue">Teacher live quiz</Badge>
      <h2 className="mt-3 text-2xl font-black text-slate-950">Create a classroom quiz room</h2>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
        Start simple. You can copy questions from a quick drill by entering its backend ID, or create the shell now and add questions from admin later.
      </p>
      {error ? (
        <div className="mt-5">
          <ErrorState title="Could not create quiz" description={error} />
        </div>
      ) : null}
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="text-sm font-black text-slate-700">Title</span>
          <input className={inputClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        </label>
        <label className="block">
          <span className="text-sm font-black text-slate-700">Description</span>
          <textarea className={`${inputClass} min-h-24`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-black text-slate-700">Source quick drill ID</span>
            <input className={inputClass} type="number" value={form.source_drill_id} onChange={(event) => setForm({ ...form, source_drill_id: event.target.value })} placeholder="Optional" />
          </label>
          <label className="block">
            <span className="text-sm font-black text-slate-700">Time limit minutes</span>
            <input className={inputClass} type="number" min="1" value={form.time_limit_minutes} onChange={(event) => setForm({ ...form, time_limit_minutes: event.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm font-black text-slate-700">Visibility</span>
            <select className={inputClass} value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value })}>
              <option value="private">Private classroom</option>
              <option value="public">Public practice quiz</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-black text-slate-700">Status</span>
            <select className={inputClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl bg-white/75 p-4 text-sm font-black text-slate-700">
            <input type="checkbox" checked={form.show_correct_after_each} onChange={(event) => setForm({ ...form, show_correct_after_each: event.target.checked })} />
            Show explanations after each answer
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-white/75 p-4 text-sm font-black text-slate-700">
            <input type="checkbox" checked={form.show_leaderboard} onChange={(event) => setForm({ ...form, show_leaderboard: event.target.checked })} />
            Show leaderboard
          </label>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create quiz"}</Button>
        </div>
      </form>
    </Card>
  );
}

const inputClass =
  "mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
