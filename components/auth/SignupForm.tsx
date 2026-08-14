"use client";

import { CheckCircle2, GraduationCap, School, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { dashboardPathForRole } from "@/lib/auth/authTypes";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { BackendStatusBanner } from "@/components/ui/BackendStatusBanner";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

type SignupRole = "student" | "teacher";

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classLevel, setClassLevel] = useState<"" | "9" | "10" | "11" | "12">("");
  const [school, setSchool] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void trackEvent({ event_type: "auth", event_name: "signup_started", page_path: "/signup", metadata: { role } });
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const session = await signup({
        role,
        name,
        email,
        password,
        class_level: role === "student" ? classLevel : "",
        school_or_institute: role === "teacher" ? school : undefined,
        preferred_language: preferredLanguage,
      });
      setSuccess("Your Chemlab account is ready. Taking you to your dashboard...");
      void trackEvent({
        event_type: "auth",
        event_name: "signup_completed",
        page_path: "/signup",
        metadata: { role: session.user.role },
      });
      router.replace(dashboardPathForRole(session.user.role));
    } catch (caught) {
      setError(getReadableApiError(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <BackendStatusBanner />
      <div>
        <h2 className="text-2xl font-black text-slate-950">Create your chemlearning account</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Choose the path that matches how you will use chemlearning.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose account type">
        {[
          { id: "student" as const, label: "Student", icon: GraduationCap, help: "Learn through labs and quests." },
          { id: "teacher" as const, label: "Teacher", icon: School, help: "Use classroom resources." },
        ].map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              type="button"
              className={`rounded-2xl border p-4 text-left transition ${
                role === option.id
                  ? "border-blue-400 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-blue-200"
              }`}
              onClick={() => setRole(option.id)}
            >
              <Icon className="h-5 w-5 text-blue-700" aria-hidden="true" />
              <p className="mt-3 font-black text-slate-950">{option.label}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{option.help}</p>
            </button>
          );
        })}
      </div>

      {error ? <ErrorState description={error} /> : null}
      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-900">
          <CheckCircle2 className="mr-2 inline h-4 w-4" aria-hidden="true" />
          {success}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" value={name} onChange={setName} autoComplete="name" placeholder="Aishwaryam" required />
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
      </div>
      <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" required />

      {role === "student" ? (
        <label className="block">
          <span className="text-sm font-black text-slate-700">Class</span>
          <select
            className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            value={classLevel}
            onChange={(event) => setClassLevel(event.target.value as typeof classLevel)}
          >
            <option value="">Choose later</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </label>
      ) : (
        <Field label="School / Institute" value={school} onChange={setSchool} />
      )}

      <label className="block">
        <span className="text-sm font-black text-slate-700">Preferred language</span>
        <select
          className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          value={preferredLanguage}
          onChange={(event) => setPreferredLanguage(event.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
          <option value="or">Odia</option>
        </select>
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone="green">No payment needed</Badge>
        <Button type="submit" icon={<UserPlus className="h-4 w-4" aria-hidden="true" />} disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>
      </div>
      <p className="text-center text-sm font-semibold text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-black text-blue-700">
          Login
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
