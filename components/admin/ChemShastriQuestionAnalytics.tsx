"use client";

import { BrainCircuit, MessageSquareText, Search, UserCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatCard } from "@/components/ui/StatCard";
import { analyticsAdminApi } from "@/lib/api/analyticsAdminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { dedupeQuestionRows, displayDate, studentNameForRow, type AnalyticsRow } from "@/lib/analytics/studentAdminAnalytics";

export function ChemShastriQuestionAnalytics() {
  const [students, setStudents] = useState<AnalyticsRow[]>([]);
  const [questions, setQuestions] = useState<AnalyticsRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([analyticsAdminApi.students(), analyticsAdminApi.chemShastri()])
      .then(([studentPayload, questionPayload]) => {
        setStudents(studentPayload.students as AnalyticsRow[]);
        setQuestions(dedupeQuestionRows(questionPayload.questions as AnalyticsRow[]));
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return questions.filter((question) => {
      if (!needle) return true;
      return [question.question_text, question.intent, question.mode, question.simulation_slug, studentNameForRow(students, question)]
        .some((value) => String(value ?? "").toLowerCase().includes(needle));
    });
  }, [questions, search, students]);

  const identified = questions.filter((question) => question.user_id).length;
  const lowRated = questions.filter((question) => ["not_helpful", "too_hard", "too_long", "wrong"].includes(String(question.helpful_rating))).length;

  return (
    <>
      <PageHeader
        eyebrow="Admin / Chem-Shastri"
        title="Read the questions students actually ask."
        description="Inspect exact question text, learner, learning mode, context, source, and helpfulness without exposing account secrets."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Question logs could not load" description={error} /> : null}
        {loading ? <LoadingState label="Loading Chem-Shastri questions" /> : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Questions logged" value={questions.length} detail="Recent exact prompts" icon={<MessageSquareText className="h-5 w-5" aria-hidden="true" />} />
              <StatCard label="Linked to students" value={identified} detail="Authenticated learner questions" icon={<UserCheck className="h-5 w-5" aria-hidden="true" />} />
              <StatCard label="Anonymous" value={questions.length - identified} detail="Questions without a signed-in user" icon={<Users className="h-5 w-5" aria-hidden="true" />} />
              <StatCard label="Needs review" value={lowRated} detail="Low-rated mentor answers" icon={<BrainCircuit className="h-5 w-5" aria-hidden="true" />} />
            </div>

            <Card className="bg-gradient-to-br from-white via-violet-50 to-cyan-50">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Question log</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-600">Search by student, exact words, mode, intent, or simulation.</p>
                </div>
                <label className="relative block w-full sm:w-96">
                  <span className="sr-only">Search Chem-Shastri questions</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search questions or students"
                    className="h-11 w-full rounded-2xl border border-violet-100 bg-white pl-10 pr-4 text-sm font-semibold text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                </label>
              </div>
            </Card>

            <div className="space-y-3">
              {filtered.length ? filtered.map((question, index) => {
                const studentName = studentNameForRow(students, question);
                return (
                  <Card key={String(question.id ?? index)} className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={question.user_id ? "blue" : "slate"}>{studentName}</Badge>
                          {question.mode ? <Badge tone="cyan">{String(question.mode)}</Badge> : null}
                          {question.intent ? <Badge tone="slate">{String(question.intent)}</Badge> : null}
                          {question.helpful_rating ? <Badge tone={question.helpful_rating === "helpful" ? "green" : "amber"}>{String(question.helpful_rating)}</Badge> : null}
                        </div>
                        <blockquote className="mt-4 border-l-4 border-violet-300 pl-4 text-lg font-black leading-7 text-slate-950">
                          {String(question.question_text ?? "Question text unavailable")}
                        </blockquote>
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-slate-500">
                          <span>{displayDate(question.created_at)}</span>
                          {question.simulation_slug ? <span>Lab: {String(question.simulation_slug)}</span> : null}
                          {question.answer_source ? <span>Answer: {String(question.answer_source)}</span> : null}
                          {question.provider ? <span>Provider: {String(question.provider)}</span> : null}
                        </div>
                      </div>
                      {question.user_id ? (
                        <Button href={`/admin/analytics/students/${String(question.user_id)}`} variant="secondary" size="sm">
                          View learner
                        </Button>
                      ) : null}
                    </div>
                  </Card>
                );
              }) : <EmptyState title="No matching questions" description="Try a different student name, concept, mode, or phrase." />}
            </div>

            <p className="text-xs font-semibold leading-5 text-slate-500">
              Question review is restricted to administrators. Use it to improve explanations and identify learning gaps, not to shame individual students.
            </p>
          </>
        )}
      </Container>
    </>
  );
}
