"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, Database, Gauge, Search, ShieldCheck } from "lucide-react";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { adminApi, unwrapAdminList } from "@/lib/api/adminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendLearningEvent, BackendSiteSetting } from "@/lib/api/backendTypes";
import type { ChemShastriAdminSummary, ChemShastriResourceSuggestion } from "@/lib/chem-shastri/chemShastriTypes";

type TestResponse = {
  answer?: string;
  provider?: string;
  model?: string;
  source?: string;
  estimatedCostInr?: number;
  suggestedResources?: ChemShastriResourceSuggestion[];
};

export default function AdminChemShastriPage() {
  const [summary, setSummary] = useState<ChemShastriAdminSummary | null>(null);
  const [settings, setSettings] = useState<BackendSiteSetting[]>([]);
  const [events, setEvents] = useState<BackendLearningEvent[]>([]);
  const [testQuestion, setTestQuestion] = useState("What is oxidation?");
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
  const [retrievalQuery, setRetrievalQuery] = useState("redox electron transfer");
  const [retrievalResults, setRetrievalResults] = useState<ChemShastriResourceSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/chem-shastri/summary").then((response) => response.json()),
      adminApi.getSettings().then((payload) => unwrapAdminList<BackendSiteSetting, "settings">(payload, "settings")),
      adminApi
        .getLearningEvents({ event_type: "ai", limit: 25 })
        .then((payload) => unwrapAdminList<BackendLearningEvent, "events">(payload, "events")),
    ])
      .then(([summaryPayload, nextSettings, nextEvents]) => {
        setSummary(summaryPayload.data ?? summaryPayload);
        setSettings(nextSettings.filter((setting) => setting.setting_key.includes("ai") || setting.setting_key.includes("chem")));
        setEvents(nextEvents);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  async function runTestQuestion() {
    const response = await fetch("/api/admin/chem-shastri/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: testQuestion }),
    });
    const payload = await response.json();
    setTestResponse(payload.data ?? payload);
  }

  async function runRetrievalTest() {
    const response = await fetch("/api/admin/chem-shastri/retrieval-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: retrievalQuery }),
    });
    const payload = await response.json();
    setRetrievalResults(payload.data?.resources ?? []);
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin / Chem-Shastri"
        title="Chem-Shastri control room."
        description="Provider health, cost guard status, retrieval checks, safety posture, and recent mentor signals."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        {loading ? (
          <LoadingState label="Loading Chem-Shastri controls" />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <BrainCircuit className="h-6 w-6 text-blue-700" />
                <h2 className="mt-3 text-xl font-black text-slate-950">Provider</h2>
                <p className="mt-2 text-sm font-bold text-slate-600">
                  Default: {summary?.provider.defaultProvider ?? "gemini"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone={summary?.provider.geminiConfigured ? "green" : "amber"}>Gemini {summary?.provider.geminiConfigured ? "set" : "missing"}</Badge>
                  <Badge tone={summary?.provider.groqConfigured ? "green" : "amber"}>Groq {summary?.provider.groqConfigured ? "set" : "missing"}</Badge>
                </div>
              </Card>
              <Card>
                <Gauge className="h-6 w-6 text-emerald-700" />
                <h2 className="mt-3 text-xl font-black text-slate-950">Budget</h2>
                <p className="mt-2 text-sm font-bold text-slate-600">
                  ₹{summary?.budget.usedInr.toFixed(2) ?? "0.00"} used of ₹{summary?.budget.dailyBudgetInr ?? 50}
                </p>
                <p className="mt-1 text-xs font-black text-emerald-700">
                  ₹{summary?.budget.remainingInr.toFixed(2) ?? "50.00"} remaining
                </p>
              </Card>
              <Card>
                <Database className="h-6 w-6 text-violet-700" />
                <h2 className="mt-3 text-xl font-black text-slate-950">Retrieval</h2>
                <p className="mt-2 text-sm font-bold text-slate-600">
                  Keyword {summary?.retrieval.keywordSearch ? "on" : "off"} · vector {summary?.retrieval.vectorSearch ? "on" : "off"}
                </p>
                <p className="mt-1 text-xs font-black text-violet-700">Top K {summary?.retrieval.topK ?? 6}</p>
              </Card>
              <Card>
                <ShieldCheck className="h-6 w-6 text-rose-700" />
                <h2 className="mt-3 text-xl font-black text-slate-950">Safety</h2>
                <p className="mt-2 text-sm font-bold text-slate-600">
                  {summary?.safety.mode ?? "strict"} mode · unsafe instructions {summary?.safety.unsafeInstructionsAllowed ? "allowed" : "blocked"}
                </p>
              </Card>
            </div>

            <section className="grid gap-5 lg:grid-cols-2">
              <Card>
                <div className="flex items-center gap-2">
                  <Badge tone="blue">Test</Badge>
                  <h2 className="text-xl font-black text-slate-950">Ask a safe test question</h2>
                </div>
                <textarea
                  value={testQuestion}
                  onChange={(event) => setTestQuestion(event.target.value)}
                  className="focus-ring mt-4 min-h-24 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-800"
                />
                <Button className="mt-3" onClick={() => void runTestQuestion()}>
                  Run test
                </Button>
                {testResponse ? (
                  <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                    <p className="font-black text-blue-800">
                      {testResponse.provider ?? "local"} · {testResponse.source ?? "direct"} · ₹
                      {(testResponse.estimatedCostInr ?? 0).toFixed(3)}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">{testResponse.answer}</p>
                  </div>
                ) : null}
              </Card>
              <Card>
                <div className="flex items-center gap-2">
                  <Badge tone="green">Retrieval</Badge>
                  <h2 className="text-xl font-black text-slate-950">Check suggested resources</h2>
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    value={retrievalQuery}
                    onChange={(event) => setRetrievalQuery(event.target.value)}
                    className="focus-ring min-w-0 flex-1 rounded-2xl border border-green-100 bg-white px-4 py-3 text-sm font-bold text-slate-800"
                  />
                  <Button onClick={() => void runRetrievalTest()} icon={<Search className="h-4 w-4" />}>
                    Test
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  {retrievalResults.length ? (
                    retrievalResults.map((resource) => (
                      <div key={`${resource.type}-${resource.slug}`} className="rounded-2xl border border-green-100 bg-green-50/80 p-3">
                        <p className="font-black text-slate-950">{resource.title}</p>
                        <p className="mt-1 text-xs font-bold text-slate-600">{resource.reason}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-semibold text-slate-500">Run a retrieval test to see resource matches.</p>
                  )}
                </div>
              </Card>
            </section>

            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Badge tone="blue">Settings</Badge>
                <h2 className="text-xl font-black text-slate-950">Related settings</h2>
              </div>
              <AdminTable
                items={settings as (BackendSiteSetting & Record<string, unknown>)[]}
                columns={[
                  { key: "setting_key", label: "Key" },
                  { key: "setting_value", label: "Value" },
                  { key: "type", label: "Type" },
                  { key: "is_public", label: "Public" },
                ]}
              />
            </Card>
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Badge tone="green">AI events</Badge>
                <h2 className="text-xl font-black text-slate-950">Recent mentor events</h2>
              </div>
              <AdminTable
                items={events as (BackendLearningEvent & Record<string, unknown>)[]}
                columns={[
                  { key: "event_name", label: "Event" },
                  { key: "page_path", label: "Page" },
                  { key: "anonymous_id", label: "Anonymous ID" },
                  { key: "created_at", label: "Created" },
                ]}
                emptyTitle="No Chem-Shastri events yet"
              />
            </Card>
          </>
        )}
      </Container>
    </>
  );
}
