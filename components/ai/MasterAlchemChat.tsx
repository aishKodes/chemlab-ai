"use client";

import { BrainCircuit, FlaskConical, Loader2, Send, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { chemistryModules } from "@/data/chemistry-modules";
import { AI_MENTOR_MODES } from "@/data/constants";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { AiMentorMode } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  mock?: boolean;
};

const examplePrompts = [
  "Why does sodium form Na+ but chlorine forms Cl-?",
  "Give me a hint for balancing Fe + O2 -> Fe2O3.",
  "Explain moles using a visual analogy and one calculation.",
  "Guide me through this like a virtual lab practical.",
];

const modeLabels: Record<AiMentorMode, string> = {
  explain: "Explain",
  hint: "Hint",
  step_by_step: "Step by step",
  quiz_me: "Quiz me",
  check_my_answer: "Check answer",
  exam_mode: "Exam mode",
  lab_guide_mode: "Lab guide",
};

export function MasterAlchemChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I am Master Alchem. Bring me a chemistry question, a wrong answer, or a lab puzzle, and I will guide the reasoning one step at a time.",
    },
  ]);
  const [input, setInput] = useState(() =>
    typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("prompt") ?? "",
  );
  const [mode, setMode] = useState<AiMentorMode>("explain");
  const [chapterSlug, setChapterSlug] = useState("atomic-structure");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [unlimited, setUnlimited] = useState(process.env.NEXT_PUBLIC_DEV_MODE === "true");

  function getAnonymousId() {
    const existing = window.localStorage.getItem("chemlab_anonymous_id");
    if (existing) return existing;
    const next = crypto.randomUUID();
    window.localStorage.setItem("chemlab_anonymous_id", next);
    return next;
  }

  const canSubmit = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function submitPrompt(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setError("");
    setLoading(true);
    setInput("");
    setMessages((current) => [...current, { role: "user", content: trimmed }]);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          mode,
          chapterSlug,
          anonymousId: getAnonymousId(),
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        detail?: string;
        mock?: boolean;
        remaining?: number | null;
        unlimited?: boolean;
      };

      if (!response.ok) {
        throw new Error(data.error ?? data.detail ?? "Master Alchem request failed.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.message ?? "I could not respond.", mock: data.mock },
      ]);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
      setUnlimited(Boolean(data.unlimited));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Master Alchem request failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitPrompt(input);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="h-fit bg-gradient-to-br from-violet-100 via-white to-sky-100">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border-2 border-white bg-gradient-to-br from-violet-500 to-blue-500 p-3 text-white shadow-lg">
            <BrainCircuit className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-black text-slate-950">Mentor modes</h2>
            <p className="text-sm font-semibold text-slate-600">Choose how Master Alchem helps.</p>
          </div>
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-black text-slate-700">Mode</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as AiMentorMode)}
            className="focus-ring mt-2 h-11 w-full rounded-2xl border border-blue-100 bg-white/85 px-3 text-sm font-bold text-slate-800"
          >
            {AI_MENTOR_MODES.map((item) => (
              <option key={item} value={item}>
                {modeLabels[item]}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-700">Chapter context</span>
          <select
            value={chapterSlug}
            onChange={(event) => setChapterSlug(event.target.value)}
            className="focus-ring mt-2 h-11 w-full rounded-2xl border border-blue-100 bg-white/85 px-3 text-sm font-bold text-slate-800"
          >
            {chemistryModules.map((module) => (
              <option key={module.slug} value={module.slug}>
                {module.title}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-6">
          <p className="text-sm font-black text-slate-700">Example prompts</p>
          <div className="mt-3 space-y-2">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                className="focus-ring w-full rounded-2xl border border-blue-100 bg-white/75 p-3 text-left text-sm font-semibold leading-5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                onClick={() => void submitPrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {unlimited ? (
          <p className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-100 p-3 text-sm font-black text-cyan-800">
            Practice mode is open, so you can keep asking while you explore.
          </p>
        ) : remaining !== null ? (
          <p className="mt-5 rounded-2xl border border-lime-200 bg-lime-100 p-3 text-sm font-black text-lime-800">
            {remaining} Master Alchem messages remaining today.
          </p>
        ) : null}
      </Card>

      <Card className="glass-panel-strong flex min-h-[620px] flex-col overflow-hidden p-0">
        <div className="border-b border-blue-100 bg-gradient-to-r from-blue-100 via-white to-fuchsia-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MasterAlchem mood={loading ? "thinking" : "guide"} size="sm" />
              <div>
                <h1 className="text-xl font-black text-slate-950">Master Alchem</h1>
                <p className="text-sm font-semibold text-slate-600">
                  Ask, test an idea, or request a hint.
                </p>
              </div>
            </div>
            <Badge tone={unlimited ? "cyan" : "green"}>
              {unlimited ? "practice mode" : "ready"}
            </Badge>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[86%] rounded-[1.4rem] border px-4 py-3 text-sm font-medium leading-6 shadow-sm",
                  message.role === "user"
                    ? "border-blue-200 bg-blue-600 text-white"
                    : "border-violet-100 bg-white/85 text-slate-700",
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.mock ? (
                  <div className="mt-3 inline-flex items-center gap-1 rounded-md border border-amber-200/25 bg-amber-300/10 px-2 py-1 text-xs text-amber-100">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Mock response
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 text-sm font-bold text-slate-700">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" aria-hidden="true" />
                Master Alchem is thinking through the chemistry...
              </div>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="border-t border-rose-200 bg-rose-100 px-5 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="border-t border-blue-100 bg-white/60 p-5">
          <label className="sr-only" htmlFor="ai-message">
            Message Master Alchem
          </label>
          <div className="flex gap-3">
            <textarea
              id="ai-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Master Alchem about bonding, balancing, moles, periodic trends..."
              rows={2}
              className="focus-ring min-h-12 flex-1 resize-none rounded-2xl border border-blue-100 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400"
            />
            <Button
              type="submit"
              disabled={!canSubmit}
              icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              className="self-end"
            >
              Send
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-black text-slate-500">
            <FlaskConical className="h-4 w-4 text-cyan-600" aria-hidden="true" />
            Safe theory, step-by-step reasoning, lab guide mode, and no-shame mistake repair.
          </div>
        </form>
      </Card>
    </div>
  );
}
