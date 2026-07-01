"use client";

import { KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/authApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { BackendStatusBanner } from "@/components/ui/BackendStatusBanner";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

const inputClass =
  "mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword({ email });
      setMessage("If this email has a Chemlab account, a reset code will arrive shortly.");
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
        <h2 className="text-2xl font-black text-slate-950">Reset your password</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Enter your email and we will send the next safe step.
        </p>
      </div>
      {error ? <ErrorState description={error} /> : null}
      {message ? <SuccessMessage icon={<MailCheck className="h-4 w-4" aria-hidden="true" />} message={message} /> : null}
      <label className="block">
        <span className="text-sm font-black text-slate-700">Email</span>
        <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <Button type="submit" icon={<KeyRound className="h-4 w-4" aria-hidden="true" />} disabled={loading}>
        {loading ? "Sending..." : "Send reset code"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState(searchParams.get("code") ?? searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match yet.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ email, code, token: code, password });
      setMessage("Password updated. You can login with the new password now.");
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
        <h2 className="text-2xl font-black text-slate-950">Choose a new password</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Use the code from your email, then return to Chemlab.
        </p>
      </div>
      {error ? <ErrorState description={error} /> : null}
      {message ? <SuccessMessage icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />} message={message} /> : null}
      <label className="block">
        <span className="text-sm font-black text-slate-700">Email</span>
        <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="block">
        <span className="text-sm font-black text-slate-700">Reset code or token</span>
        <input className={inputClass} value={code} onChange={(event) => setCode(event.target.value)} required />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-black text-slate-700">New password</span>
          <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <label className="block">
          <span className="text-sm font-black text-slate-700">Confirm password</span>
          <input className={inputClass} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
        </label>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.verifyEmail({ email, code });
      setMessage("Email verified. Your Chemlab account is ready.");
    } catch (caught) {
      setError(getReadableApiError(caught));
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setLoading(true);
    setError(null);
    try {
      await authApi.resendVerification({ email });
      setMessage("A fresh verification code has been sent if this email is registered.");
    } catch (caught) {
      setError(getReadableApiError(caught));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={verify}>
      <BackendStatusBanner />
      <div>
        <h2 className="text-2xl font-black text-slate-950">Verify your email</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Enter the 6-digit code sent by Chemlab.
        </p>
      </div>
      {error ? <ErrorState description={error} /> : null}
      {message ? <SuccessMessage icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />} message={message} /> : null}
      <label className="block">
        <span className="text-sm font-black text-slate-700">Email</span>
        <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="block">
        <span className="text-sm font-black text-slate-700">6-digit code</span>
        <input className={inputClass} value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" required />
      </label>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Verify email"}
        </Button>
        <Button type="button" variant="secondary" onClick={resend} disabled={loading || !email}>
          Resend code
        </Button>
      </div>
    </form>
  );
}

function SuccessMessage({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-900">
      <span className="mr-2 inline-flex align-middle">{icon}</span>
      {message}
    </div>
  );
}
