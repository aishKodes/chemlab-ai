"use client";

import { BookOpen, BrainCircuit, FlaskConical, Languages, Loader2, PlusCircle, Send, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { chemistryModules } from "@/data/chemistry-modules";
import { AI_MENTOR_MODES } from "@/data/constants";
import { useAuth } from "@/components/auth/AuthProvider";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChemShastriSpeakButton } from "@/components/voice/ChemShastriSpeakButton";
import { useVoiceSettings } from "@/components/voice/VoiceSettingsMiniPanel";
import type { AiMentorMode } from "@/lib/ai/types";
import { learningApi } from "@/lib/api/learningApi";
import { createBrowserId } from "@/lib/client/browserId";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  mock?: boolean;
  source?: string;
  spokenText?: string;
  citations?: Array<{ label: string; pageStart?: number | null }>;
  contextChips?: string[];
  suggestedResources?: Array<{ title: string; slug: string; type: string; routeUrl?: string | null; reason?: string }>;
  followUpQuestions?: string[];
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
  teacher_mode: "Teacher mode",
};

export function MasterAlchemChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I am Chem-Shastri. Bring me a chemistry question, a wrong answer, or a lab puzzle, and I will guide the reasoning one step at a time.",
    },
  ]);
  const [input, setInput] = useState(() =>
    typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("prompt") ?? "",
  );
  const [mode, setMode] = useState<AiMentorMode>("explain");
  const [classLevel, setClassLevel] = useState<"8" | "9" | "10" | "11" | "12">("10");
  const [chapterSlug, setChapterSlug] = useState("atomic-structure");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "hi" | "bn">("en");
  const [usePageContext, setUsePageContext] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSettings] = useVoiceSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.class_level && ["9", "10", "11", "12"].includes(user.class_level)) {
      queueMicrotask(() => setClassLevel(user.class_level as "9" | "10" | "11" | "12"));
    }
  }, [user?.class_level]);

  useEffect(() => {
    if (user?.preferred_language && ["en", "hi", "bn"].includes(user.preferred_language)) {
      queueMicrotask(() => setPreferredLanguage(user.preferred_language as "en" | "hi" | "bn"));
    }
  }, [user?.preferred_language]);

  function getAnonymousId() {
    const existing = window.localStorage.getItem("chemlab_anonymous_id");
    if (existing) return existing;
    const next = createBrowserId("guest");
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
    void learningApi.logChemShastriQuestion({
      question_text: trimmed,
      class_id: undefined,
      classLevel,
      mode,
      resourceSlug: chapterSlug,
      simulation_slug:
        typeof window !== "undefined" && window.location.pathname.startsWith("/labs/")
          ? window.location.pathname.split("/").filter(Boolean).at(-1)
          : undefined,
      role: user?.role ?? "anonymous",
      anonymous_id: getAnonymousId(),
      metadata: { currentPage: typeof window === "undefined" ? undefined : window.location.pathname },
    });

    try {
      const response = await fetch("/api/chem-shastri/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          mode,
          classLevel,
          chapterSlug,
          preferredLanguage,
          role: user?.role ?? "anonymous",
          currentPage: typeof window === "undefined" ? undefined : window.location.pathname,
          usePageContext,
          resourceSlug: chapterSlug,
          simulationSlug:
            typeof window !== "undefined" && window.location.pathname.startsWith("/labs/")
              ? window.location.pathname.split("/").filter(Boolean).at(-1)
              : undefined,
          anonymousId: getAnonymousId(),
        }),
      });

      const data = (await response.json()) as {
        answer?: string;
        message?: string;
        error?: string;
        detail?: string;
        mock?: boolean;
        source?: string;
        spokenText?: string;
        citations?: Array<{ label: string; pageStart?: number | null }>;
        contextChips?: string[];
        suggestedResources?: Array<{ title: string; slug: string; type: string; routeUrl?: string | null; reason?: string }>;
        followUpQuestions?: string[];
      };

      if (!response.ok) {
        throw new Error(data.error ?? data.detail ?? "Chem-Shastri request failed.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer ?? data.message ?? "I could not respond.",
          mock: data.mock,
          source: data.source,
          spokenText: data.spokenText,
          citations: data.citations,
          contextChips: data.contextChips,
          suggestedResources: data.suggestedResources,
          followUpQuestions: data.followUpQuestions,
        },
      ]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Chem-Shastri request failed.");
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
            <h2 className="font-black text-slate-950">Chem-Shastri</h2>
            <p className="text-sm font-semibold text-slate-600">Your NCERT Chemistry Guide</p>
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
          <span className="text-sm font-black text-slate-700">Class</span>
          <select
            value={classLevel}
            onChange={(event) => setClassLevel(event.target.value as typeof classLevel)}
            className="focus-ring mt-2 h-11 w-full rounded-2xl border border-blue-100 bg-white/85 px-3 text-sm font-bold text-slate-800"
          >
            {["8", "9", "10", "11", "12"].map((level) => (
              <option key={level} value={level}>
                Class {level}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-3">
          <p className="text-sm font-black text-cyan-800">Testing Mode</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-cyan-700">
            Answers use approved NCERT-aligned learning material and simple student language.
          </p>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-700">Answer language</span>
          <select
            value={preferredLanguage}
            onChange={(event) => setPreferredLanguage(event.target.value as typeof preferredLanguage)}
            className="focus-ring mt-2 h-11 w-full rounded-2xl border border-blue-100 bg-white/85 px-3 text-sm font-bold text-slate-800"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
          </select>
        </label>

        <label className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/75 p-3">
          <span>
            <span className="block text-sm font-black text-slate-700">Use page context</span>
            <span className="block text-xs font-semibold text-slate-500">Class, lab, and resource hints</span>
          </span>
          <input
            type="checkbox"
            checked={usePageContext}
            onChange={(event) => setUsePageContext(event.target.checked)}
            className="h-5 w-5 accent-blue-600"
          />
        </label>

        <label className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/75 p-3">
          <span>
            <span className="block text-sm font-black text-slate-700">Voice</span>
            <span className="block text-xs font-semibold text-slate-500">Speak answers aloud</span>
          </span>
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(event) => {
              setVoiceEnabled(event.target.checked);
              void fetch("/api/analytics/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  eventType: "ai_message",
                  eventName: "voice_enabled",
                  anonymousId: getAnonymousId(),
                  metadata: { enabled: event.target.checked },
                }),
              });
            }}
            className="h-5 w-5 accent-blue-600"
          />
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

      </Card>

      <Card className="glass-panel-strong flex min-h-[620px] flex-col overflow-hidden p-0">
        <div className="border-b border-blue-100 bg-gradient-to-r from-blue-100 via-white to-fuchsia-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MasterAlchem mood={loading ? "thinking" : "guide"} size="sm" />
              <div>
                <h1 className="text-xl font-black text-slate-950">Chem-Shastri</h1>
                <p className="text-sm font-semibold text-slate-600">Your NCERT Chemistry Guide</p>
              </div>
            </div>
            <Badge tone="cyan">Testing Mode</Badge>
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
                {message.role === "assistant" && message.citations?.length ? (
                  <div className="mt-3 space-y-1 rounded-xl border border-slate-200 bg-white/60 p-2 text-xs font-semibold text-slate-500">
                    {message.citations.slice(0, 3).map((citation) => (
                      <div key={`${citation.label}-${citation.pageStart ?? ""}`}>
                        {citation.label}
                        {citation.pageStart ? `, p. ${citation.pageStart}` : ""}
                      </div>
                    ))}
                  </div>
                ) : null}
                {message.role === "assistant" && message.contextChips?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {message.contextChips.slice(0, 5).map((chip) => (
                      <span key={chip} className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-black text-blue-700">
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
                {message.role === "assistant" && message.suggestedResources?.length ? (
                  <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50/80 p-3">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-800">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      Try next
                    </div>
                    <div className="mt-2 grid gap-2">
                      {message.suggestedResources.slice(0, 3).map((resource) => (
                        <a
                          key={`${resource.type}-${resource.slug}`}
                          href={resource.routeUrl ?? `/resources?query=${encodeURIComponent(resource.slug)}`}
                          className="rounded-xl bg-white/75 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-white"
                        >
                          {resource.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
                {message.role === "assistant" && message.followUpQuestions?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.followUpQuestions.slice(0, 3).map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className="rounded-full border border-violet-100 bg-violet-50 px-2 py-1 text-[11px] font-black text-violet-700 hover:bg-white"
                        onClick={() => void submitPrompt(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                ) : null}
                {message.role === "assistant" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.source === "rag" ? (
                      <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2 py-1 text-[11px] font-black uppercase tracking-wide text-cyan-700">
                        NCERT source
                      </span>
                    ) : null}
                    {voiceEnabled ? (
                      <ChemShastriSpeakButton
                        text={message.spokenText || message.content}
                        settings={voiceSettings}
                        onSpoken={(metadata) => {
                          void fetch("/api/analytics/event", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              eventType: "ai_message",
                              eventName: "voice_play_clicked",
                              anonymousId: getAnonymousId(),
                              pagePath: window.location.pathname,
                              metadata: { mode: "browser", voiceName: metadata.voiceName },
                            }),
                          });
                        }}
                      />
                    ) : null}
                    {["helpful", "not_helpful", "wrong_answer", "too_hard", "too_long"].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className="rounded-full border border-slate-200 bg-white/70 px-2 py-1 text-[11px] font-black text-slate-500 hover:bg-white"
                        onClick={() => {
                          void fetch("/api/chem-shastri/feedback", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ rating, anonymousId: getAnonymousId() }),
                          });
                        }}
                      >
                        {rating.replaceAll("_", " ")}
                      </button>
                    ))}
                  </div>
                ) : null}
                {message.mock ? (
                  <div className="mt-3 inline-flex items-center gap-1 rounded-md border border-amber-200/25 bg-amber-300/10 px-2 py-1 text-xs text-amber-100">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Testing Mode
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 text-sm font-bold text-slate-700">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" aria-hidden="true" />
                Chem-Shastri is thinking through the chemistry...
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
            Message Chem-Shastri
          </label>
          <div className="flex gap-3">
            <textarea
              id="ai-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Chem-Shastri about bonding, balancing, moles, periodic trends..."
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
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-blue-700">
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              multilingual-ready
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-violet-700"
              onClick={() =>
                setMessages([
                  {
                    role: "assistant",
                    content:
                      "New chat started. Ask Chem-Shastri a chemistry doubt, a lab question, or a teaching prompt.",
                  },
                ])
              }
            >
              <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
              new chat
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
