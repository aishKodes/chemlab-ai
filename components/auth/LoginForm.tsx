"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { dashboardPathForRole } from "@/lib/auth/authTypes";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { BackendStatusBanner } from "@/components/ui/BackendStatusBanner";
import { ErrorState } from "@/components/ui/ErrorState";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const session = await login(email, password);
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : dashboardPathForRole(session.user.role));
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
        <h2 className="text-2xl font-black text-slate-950">Welcome back</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Log in once and Chemlab will send you to the right learning space.
        </p>
      </div>
      {error ? <ErrorState description={error} /> : null}
      <label className="block">
        <span className="text-sm font-black text-slate-700">Email</span>
        <input
          className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-black text-slate-700">Password</span>
        <input
          className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/forgot-password" className="text-sm font-black text-blue-700 hover:text-blue-900">
          Forgot password?
        </Link>
        <Button type="submit" icon={<LogIn className="h-4 w-4" aria-hidden="true" />} disabled={loading}>
          {loading ? "Opening..." : "Login"}
        </Button>
      </div>
      <p className="text-center text-sm font-semibold text-slate-600">
        New here?{" "}
        <Link href="/signup" className="font-black text-blue-700">
          Create a Chemlab account
        </Link>
      </p>
    </form>
  );
}
