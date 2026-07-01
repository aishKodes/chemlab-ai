"use client";

import { Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { userApi } from "@/lib/api/userApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendUser } from "@/lib/api/backendTypes";
import { normalizeProfileResponse } from "@/lib/auth/authClient";

const inputClass =
  "mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileEditor />
    </AuthGuard>
  );
}

function ProfileEditor() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState<Partial<BackendUser>>(() => profileFormFromUser(user));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    userApi
      .getProfile()
      .then((payload) => {
        if (mounted) setForm((current) => ({ ...current, ...normalizeProfileResponse(payload) }));
      })
      .catch(() => {
        if (mounted && user) setForm((current) => ({ ...profileFormFromUser(user), ...current }));
      });
    return () => {
      mounted = false;
    };
  }, [user]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await userApi.updateProfile(form);
      await refreshUser();
      setSuccess("Profile updated. Your recommendations can now get sharper.");
    } catch (caught) {
      setError(getReadableApiError(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Tune your Chemlab account."
        description="Keep the details simple. Chemlab uses them to recommend the right classes, resources, and hints."
      />
      <Container className="pb-16">
        <Card className="mx-auto max-w-3xl">
          <form className="space-y-5" onSubmit={save}>
            {error ? <ErrorState description={error} /> : null}
            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-900">
                {success}
              </div>
            ) : null}
            <label className="block">
              <span className="text-sm font-black text-slate-700">Name</span>
              <input
                className={inputClass}
                value={form.name ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Preferred language</span>
              <select
                className={inputClass}
                value={form.preferred_language ?? "en"}
                onChange={(event) => setForm((current) => ({ ...current, preferred_language: event.target.value }))}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
                <option value="or">Odia</option>
              </select>
            </label>

            {user?.role === "student" || user?.role === "admin" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-black text-slate-700">Class level</span>
                  <select
                    className={inputClass}
                    value={form.class_level ?? ""}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, class_level: event.target.value as BackendUser["class_level"] }))
                    }
                  >
                    <option value="">Choose later</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-black text-slate-700">Board</span>
                  <input
                    className={inputClass}
                    value={form.board ?? ""}
                    onChange={(event) => setForm((current) => ({ ...current, board: event.target.value }))}
                    placeholder="CBSE, ICSE, State board"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-black text-slate-700">School name</span>
                  <input
                    className={inputClass}
                    value={form.school_name ?? ""}
                    onChange={(event) => setForm((current) => ({ ...current, school_name: event.target.value }))}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-black text-slate-700">Learning goal</span>
                  <input
                    className={inputClass}
                    value={form.learning_goal ?? ""}
                    onChange={(event) => setForm((current) => ({ ...current, learning_goal: event.target.value }))}
                    placeholder="Build basics, prepare for exams, fix redox doubts..."
                  />
                </label>
              </div>
            ) : null}

            {user?.role === "teacher" || user?.role === "admin" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-black text-slate-700">School / Institute</span>
                  <input
                    className={inputClass}
                    value={form.school_or_institute ?? ""}
                    onChange={(event) => setForm((current) => ({ ...current, school_or_institute: event.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-black text-slate-700">Subject</span>
                  <input
                    className={inputClass}
                    value={form.subject ?? ""}
                    onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                    placeholder="Chemistry"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-black text-slate-700">Classes taught</span>
                  <input
                    className={inputClass}
                    value={Array.isArray(form.classes_taught) ? form.classes_taught.join(", ") : String(form.classes_taught ?? "")}
                    onChange={(event) => setForm((current) => ({ ...current, classes_taught: event.target.value }))}
                    placeholder="9, 10, 11, 12"
                  />
                </label>
              </div>
            ) : null}

            <Button type="submit" disabled={loading} icon={<Save className="h-4 w-4" aria-hidden="true" />}>
              {loading ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </Card>
      </Container>
    </>
  );
}

function profileFormFromUser(user: BackendUser | null): Partial<BackendUser> {
  if (!user) return {};
  return {
    name: user.name,
    preferred_language: user.preferred_language ?? "en",
    class_level: user.class_level ?? null,
    board: user.board ?? "",
    school_name: user.school_name ?? "",
    learning_goal: user.learning_goal ?? "",
    school_or_institute: user.school_or_institute ?? "",
    subject: user.subject ?? "",
    classes_taught: user.classes_taught ?? "",
  };
}
