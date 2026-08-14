type Probe = {
  name: string;
  method: "GET" | "POST" | "PUT";
  path: string;
  expected: number[];
  body?: Record<string, unknown>;
};

export {};

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_INTERNAL_API_URL || "https://api.chemlearning.in").replace(/\/+$/, "");

const probes: Probe[] = [
  { name: "Backend health", method: "GET", path: "/api/health", expected: [200] },
  { name: "Signup validation", method: "POST", path: "/api/auth/signup", expected: [422, 429], body: {} },
  { name: "Login validation", method: "POST", path: "/api/auth/login", expected: [422, 429], body: {} },
  { name: "Auth me requires token", method: "GET", path: "/api/auth/me", expected: [401, 429] },
  { name: "Profile requires token", method: "GET", path: "/api/user/profile", expected: [401, 429] },
  { name: "Admin users requires token", method: "GET", path: "/api/admin/users", expected: [401, 429] },
  { name: "Verify email validation", method: "POST", path: "/api/auth/verify-email", expected: [401, 422, 429], body: {} },
  { name: "Forgot password validation", method: "POST", path: "/api/auth/forgot-password", expected: [422, 429], body: {} },
  { name: "Reset password validation", method: "POST", path: "/api/auth/reset-password", expected: [422, 429], body: {} },
];

async function runProbe(probe: Probe) {
  const response = await fetch(`${backendUrl}${probe.path}`, {
    method: probe.method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: probe.method === "GET" ? undefined : JSON.stringify(probe.body ?? {}),
  });
  const payload = await response.json().catch(() => null) as { ok?: boolean; error?: { code?: string; message?: string } } | null;
  const ok = probe.expected.includes(response.status);
  console.log(JSON.stringify({
    ok,
    name: probe.name,
    method: probe.method,
    path: probe.path,
    status: response.status,
    expected: probe.expected,
    code: payload?.error?.code,
    message: payload?.error?.message,
  }));
  if (!ok) {
    throw new Error(`${probe.name} returned ${response.status}, expected ${probe.expected.join("/")}`);
  }
}

async function main() {
  for (const probe of probes) {
    await runProbe(probe);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
