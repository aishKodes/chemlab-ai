"use client";

import { CheckCircle2, Play, ShieldAlert, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getBackendBaseUrl } from "@/lib/api/backendClient";

type ProbeStatus = "idle" | "pass" | "fail" | "blocked";

type ProbeResult = {
  name: string;
  method: "GET" | "POST" | "PUT";
  path: string;
  expected: number[];
  status: ProbeStatus;
  httpStatus?: number;
  message?: string;
};

const safeProbes: Omit<ProbeResult, "status" | "httpStatus" | "message">[] = [
  { name: "Backend health", method: "GET", path: "/api/health", expected: [200] },
  { name: "Signup validation", method: "POST", path: "/api/auth/signup", expected: [422, 429] },
  { name: "Login validation", method: "POST", path: "/api/auth/login", expected: [422, 429] },
  { name: "Auth me requires token", method: "GET", path: "/api/auth/me", expected: [401, 429] },
  { name: "Profile requires token", method: "GET", path: "/api/user/profile", expected: [401, 429] },
  { name: "Verify email validation", method: "POST", path: "/api/auth/verify-email", expected: [401, 422, 429] },
  { name: "Forgot password validation", method: "POST", path: "/api/auth/forgot-password", expected: [422, 429] },
  { name: "Reset password validation", method: "POST", path: "/api/auth/reset-password", expected: [422, 429] },
];

export function AuthEndpointTestPanel() {
  const [results, setResults] = useState<ProbeResult[]>(() => safeProbes.map((probe) => ({ ...probe, status: "idle" })));
  const [running, setRunning] = useState(false);
  const backendUrl = useMemo(() => getBackendBaseUrl(), []);

  async function runProbe(probe: ProbeResult): Promise<ProbeResult> {
    try {
      const response = await fetch(`${backendUrl}${probe.path}`, {
        method: probe.method,
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: probe.method === "GET" ? undefined : JSON.stringify({}),
      });
      const payload = await response.json().catch(() => null) as { error?: { message?: string } } | null;
      return {
        ...probe,
        status: probe.expected.includes(response.status) ? "pass" : "fail",
        httpStatus: response.status,
        message: payload?.error?.message ?? response.statusText,
      };
    } catch (error) {
      return {
        ...probe,
        status: "blocked",
        message: error instanceof Error ? error.message : "Could not reach backend.",
      };
    }
  }

  async function runAll() {
    setRunning(true);
    const next: ProbeResult[] = [];
    for (const probe of results) {
      const result = await runProbe(probe);
      next.push(result);
      setResults([...next, ...results.slice(next.length).map((item) => ({ ...item, status: "idle" as const }))]);
    }
    setRunning(false);
  }

  return (
    <>
      <PageHeader
        eyebrow="Development only"
        title="chemlearning auth endpoint test."
        description="Safe probes for backend availability, validation, and protected-route behavior. These checks do not create accounts."
      />
      <Container className="space-y-5 pb-16">
        <Card className="bg-gradient-to-br from-white via-blue-50 to-violet-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">Backend</p>
              <p className="mt-2 break-all text-lg font-black text-slate-950">{backendUrl}</p>
            </div>
            <Button type="button" onClick={runAll} disabled={running} icon={<Play className="h-4 w-4" aria-hidden="true" />}>
              {running ? "Testing..." : "Run safe auth probes"}
            </Button>
          </div>
        </Card>

        <div className="grid gap-3">
          {results.map((result) => (
            <Card key={result.name} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-black text-slate-950">{result.name}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {result.method} {result.path} · expected {result.expected.join(" / ")}
                  </p>
                  {result.message ? <p className="mt-2 text-sm font-semibold text-slate-600">{result.message}</p> : null}
                </div>
                <StatusPill result={result} />
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}

function StatusPill({ result }: { result: ProbeResult }) {
  const statusMap = {
    idle: { label: "Not run", className: "bg-slate-100 text-slate-700", icon: ShieldAlert },
    pass: { label: `PASS ${result.httpStatus ?? ""}`, className: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
    fail: { label: `FAIL ${result.httpStatus ?? ""}`, className: "bg-rose-100 text-rose-800", icon: XCircle },
    blocked: { label: "BLOCKED", className: "bg-amber-100 text-amber-900", icon: ShieldAlert },
  } satisfies Record<ProbeStatus, { label: string; className: string; icon: typeof ShieldAlert }>;
  const config = statusMap[result.status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${config.className}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {config.label}
    </span>
  );
}
