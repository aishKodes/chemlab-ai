"use client";

import { BrainCircuit, Loader2, Send, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { chemistryModules } from "@/data/chemistry-modules";
import { AI_TUTOR_MODES } from "@/data/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { AiTutorMode } from "@/lib/ai/types";
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
];

const modeLabels: Record<AiTutorMode, string> = {
  explain: "Explain",
  hint: "Hint",
  step_by_step: "Step by step",
  quiz_me: "Quiz me",
  check_my_answer: "Check answer",
  exam_mode: "Exam mode",
};

export function AiTutorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome to ChemLab AI. Ask a chemistry question, choose a mode, and I will guide the reasoning instead of just dumping an answer.",
    },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<AiTutorMode>("explain");
  const [chapterSlug, setChapterSlug] = useState("atomic-structure");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

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
        remaining?: number;
      };

      if (!response.ok) {
        throw new Error(data.error ?? data.detail ?? "AI tutor request failed.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.message ?? "I could not respond.", mock: data.mock },
      ]);
      setRemaining(typeof data.remaining === "number" ? data.remaining : null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "AI tutor request failed.");
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
      <Card className="h-fit">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-cyan-200/20 bg-cyan-300/10 p-3 text-cyan-100">
            <BrainCircuit className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Tutor controls</h2>
            <p className="text-sm text-slate-400">Adapt the response style.</p>
          </div>
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-200">Mode</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as AiTutorMode)}
            className="focus-ring mt-2 h-11 w-full rounded-lg border border-white/12 bg-slate-950/70 px-3 text-sm text-white"
          >
            {AI_TUTOR_MODES.map((item) => (
              <option key={item} value={item}>
                {modeLabels[item]}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-200">Chapter context</span>
          <select
            value={chapterSlug}
            onChange={(event) => setChapterSlug(event.target.value)}
            className="focus-ring mt-2 h-11 w-full rounded-lg border border-white/12 bg-slate-950/70 px-3 text-sm text-white"
          >
            {chemistryModules.map((module) => (
              <option key={module.slug} value={module.slug}>
                {module.title}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-200">Example prompts</p>
          <div className="mt-3 space-y-2">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                className="focus-ring w-full rounded-lg border border-white/10 bg-white/[0.05] p-3 text-left text-sm leading-5 text-slate-300 transition hover:bg-white/10"
                onClick={() => void submitPrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {remaining !== null ? (
          <p className="mt-5 rounded-lg border border-cyan-200/20 bg-cyan-300/10 p-3 text-sm text-cyan-50">
            {remaining} AI tutor messages remaining today.
          </p>
        ) : null}
      </Card>

      <Card className="glass-panel-strong flex min-h-[620px] flex-col p-0">
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-white">ChemLab AI Tutor</h1>
              <p className="text-sm text-slate-400">Private API keys stay on the server route.</p>
            </div>
            <Badge tone="green">server-side adapter</Badge>
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
                  "max-w-[86%] rounded-lg border px-4 py-3 text-sm leading-6",
                  message.role === "user"
                    ? "border-cyan-200/30 bg-cyan-300/15 text-cyan-50"
                    : "border-white/12 bg-white/[0.06] text-slate-200",
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
              <div className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-200" aria-hidden="true" />
                Reasoning through the chemistry...
              </div>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="border-t border-rose-200/20 bg-rose-400/10 px-5 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="border-t border-white/10 p-5">
          <label className="sr-only" htmlFor="ai-message">
            Message ChemLab AI
          </label>
          <div className="flex gap-3">
            <textarea
              id="ai-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about bonding, balancing, moles, periodic trends..."
              rows={2}
              className="focus-ring min-h-12 flex-1 resize-none rounded-lg border border-white/12 bg-slate-950/70 px-3 py-3 text-sm text-white placeholder:text-slate-500"
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
        </form>
      </Card>
    </div>
  );
}
