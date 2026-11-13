"use client";

import {
  BookOpen,
  ChevronDown,
  Loader2,
  Send,
  Settings2,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chemistryModules } from "@/data/chemistry-modules";
import { AI_MENTOR_MODES } from "@/data/constants";
import { useAuth } from "@/components/auth/AuthProvider";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import { ChemShastriSpeakButton } from "@/components/voice/ChemShastriSpeakButton";
import { useVoiceSettings } from "@/components/voice/VoiceSettingsMiniPanel";
import type { AiMentorMode } from "@/lib/ai/types";
import { learningApi } from "@/lib/api/learningApi";
import { createBrowserId } from "@/lib/client/browserId";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  source?: string;
  spokenText?: string;
  citations?: Array<{ label: string; pageStart?: number | null }>;
  suggestedResources?: Array<{
    title: string;
    slug: string;
    type: string;
    routeUrl?: string | null;
  }>;
  followUpQuestions?: string[];
};

const welcome: ChatMessage = {
  role: "assistant",
  content:
    "What are you working on? Bring me a question, a calculation, or an answer that didn’t quite work. We’ll reason it through together.",
};
const examples = [
  "Why is water bent?",
  "How many moles are in 18 g of water?",
  "Why is zinc the anode?",
];
const modeLabels: Record<AiMentorMode, string> = {
  explain: "Explain",
  hint: "Give a hint",
  step_by_step: "Step by step",
  quiz_me: "Quiz me",
  check_my_answer: "Check my answer",
  exam_mode: "Exam practice",
  lab_guide_mode: "Lab guide",
  teacher_mode: "Teacher mode",
};

function anonymousId() {
  try {
    const existing = localStorage.getItem("chemlab_anonymous_id");
    if (existing) return existing;
    const id = createBrowserId("guest");
    localStorage.setItem("chemlab_anonymous_id", id);
    return id;
  } catch {
    return undefined;
  }
}

export function MasterAlchemChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<AiMentorMode>("explain");
  const [classLevel, setClassLevel] = useState<"8" | "9" | "10" | "11" | "12">(
    "11",
  );
  const [chapterSlug, setChapterSlug] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<
    "en" | "hi" | "bn"
  >("en");
  const [usePageContext, setUsePageContext] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSettings] = useVoiceSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState<Record<number, string>>({});
  const conversationId = useRef<string | undefined>(undefined);
  const pending = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    queueMicrotask(() => {
      setInput(params.get("prompt") ?? "");
      setChapterSlug(params.get("chapter") ?? "");
    });
    return () => controller.current?.abort();
  }, []);
  useEffect(() => {
    queueMicrotask(() => {
      if (
        user?.class_level &&
        ["9", "10", "11", "12"].includes(user.class_level)
      )
        setClassLevel(user.class_level as typeof classLevel);
      if (
        user?.preferred_language &&
        ["en", "hi", "bn"].includes(user.preferred_language)
      )
        setPreferredLanguage(
          user.preferred_language as typeof preferredLanguage,
        );
    });
  }, [user?.class_level, user?.preferred_language]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [messages, loading]);

  async function submitPrompt(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed || pending.current) return;
    pending.current = true;
    setError("");
    setLoading(true);
    setInput("");
    const history = messages
      .filter((_, index) => index > 0)
      .slice(-6)
      .map(({ role, content }) => ({ role, content: content.slice(0, 6000) }));
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    const id = anonymousId();
    void learningApi
      .logChemShastriQuestion({
        question_text: trimmed,
        classLevel,
        mode,
        resourceSlug: chapterSlug || undefined,
        role: user?.role ?? "anonymous",
        anonymous_id: id,
        metadata: { currentPage: "/ai-tutor" },
      })
      .catch(() => undefined);
    controller.current = new AbortController();
    const timeout = setTimeout(() => controller.current?.abort(), 45000);
    try {
      const response = await fetch("/api/chem-shastri/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.current.signal,
        body: JSON.stringify({
          message: trimmed,
          history,
          conversationId: conversationId.current,
          mode,
          classLevel,
          chapterSlug: chapterSlug || undefined,
          preferredLanguage,
          role: user?.role ?? "anonymous",
          currentPage: "/ai-tutor",
          usePageContext,
          resourceSlug: chapterSlug || undefined,
          anonymousId: id,
        }),
      });
      const data = (await response.json()) as Partial<ChatMessage> & {
        answer?: string;
        message?: string;
        error?: string;
        conversationId?: string;
      };
      if (!response.ok)
        throw new Error(
          data.error || "I couldn’t finish that answer. Please try again.",
        );
      const answer = data.answer || data.message;
      if (!answer?.trim())
        throw new Error("The answer was empty. Please try again.");
      conversationId.current = data.conversationId;
      setMessages((current) => [
        ...current,
        { ...data, role: "assistant", content: answer },
      ]);
    } catch (caught) {
      setInput(trimmed);
      setError(
        caught instanceof Error && caught.name === "AbortError"
          ? "That took longer than expected. Your question is ready to try again."
          : caught instanceof Error
            ? caught.message
            : "Please try your question again.",
      );
    } finally {
      clearTimeout(timeout);
      pending.current = false;
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitPrompt(input);
  }
  function rate(index: number, rating: string) {
    setRatings((current) => ({ ...current, [index]: rating }));
    void fetch("/api/chem-shastri/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        conversationId: conversationId.current,
        anonymousId: anonymousId(),
      }),
    }).catch(() => undefined);
  }

  return (
    <section
      aria-label="Chat with Chem-Shastri"
      className="flex h-[calc(100dvh-10rem)] min-h-[34rem] max-h-[50rem] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-blue-100/40"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <MasterAlchem
            mood={loading ? "thinking" : "guide"}
            size="xs"
            showGlow={false}
          />
          <div>
            <h1 className="text-lg font-extrabold text-slate-950">
              Chem-Shastri
            </h1>
            <p className="text-xs text-slate-500">
              Your chemistry study companion
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative">
            <span className="sr-only">Study mode</span>
            <select
              disabled={loading}
              value={mode}
              onChange={(e) => setMode(e.target.value as AiMentorMode)}
              className="focus-ring h-10 max-w-40 appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-sm font-semibold text-slate-700"
            >
              {AI_MENTOR_MODES.map((item) => (
                <option key={item} value={item}>
                  {modeLabels[item]}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2 top-3 h-4 w-4 text-slate-500"
              aria-hidden="true"
            />
          </label>
          <button
            type="button"
            title="Study settings"
            aria-label="Study settings"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50"
          >
            <Settings2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Start a new conversation"
            aria-label="Start a new conversation"
            disabled={loading}
            onClick={() => {
              setMessages([welcome]);
              setError("");
              setRatings({});
              conversationId.current = undefined;
            }}
            className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>
      {settingsOpen && (
        <div className="grid max-h-52 shrink-0 gap-3 overflow-y-auto border-b border-blue-100 bg-blue-50/60 p-4 text-sm sm:grid-cols-3">
          <label className="font-semibold text-slate-700">
            Class
            <select
              value={classLevel}
              onChange={(e) =>
                setClassLevel(e.target.value as typeof classLevel)
              }
              className="focus-ring mt-1 block h-10 w-full rounded-lg border border-slate-200 bg-white px-2"
            >
              {["8", "9", "10", "11", "12"].map((level) => (
                <option key={level} value={level}>
                  Class {level}
                </option>
              ))}
            </select>
          </label>
          <label className="font-semibold text-slate-700">
            Answer language
            <select
              value={preferredLanguage}
              onChange={(e) =>
                setPreferredLanguage(e.target.value as typeof preferredLanguage)
              }
              className="focus-ring mt-1 block h-10 w-full rounded-lg border border-slate-200 bg-white px-2"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
            </select>
          </label>
          <label className="font-semibold text-slate-700">
            Chapter
            <select
              value={chapterSlug}
              onChange={(e) => setChapterSlug(e.target.value)}
              className="focus-ring mt-1 block h-10 w-full rounded-lg border border-slate-200 bg-white px-2"
            >
              <option value="">Let the question guide us</option>
              {chemistryModules.map((module) => (
                <option key={module.slug} value={module.slug}>
                  {module.title}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={usePageContext}
              onChange={(e) => setUsePageContext(e.target.checked)}
            />{" "}
            Use my chapter context
          </label>
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
            />{" "}
            Read-aloud buttons
          </label>
        </div>
      )}
      <div
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        aria-relevant="additions"
        className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8"
      >
        {messages.map((message, index) => (
          <article
            key={index}
            className={cn(
              "mx-auto max-w-3xl",
              message.role === "user" && "flex justify-end",
            )}
          >
            <div
              className={cn(
                message.role === "user"
                  ? "max-w-[90%] rounded-lg bg-blue-50 px-4 py-3 text-slate-800"
                  : "text-slate-700",
              )}
            >
              <p className="mb-2 text-xs font-bold text-slate-500">
                {message.role === "user" ? "You" : "Chem-Shastri"}
                {message.role === "assistant" && message.source === "fallback"
                  ? " · Study notes"
                  : ""}
              </p>
              <div className="space-y-3 break-words text-sm leading-7 sm:text-base">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="whitespace-pre-wrap">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc space-y-1 pl-5">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal space-y-1 pl-5">
                        {children}
                      </ol>
                    ),
                    h2: ({ children }) => (
                      <h2 className="pt-2 font-bold text-slate-950">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="pt-2 font-bold text-slate-950">
                        {children}
                      </h3>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_th]:border [&_th]:border-slate-200 [&_th]:p-2">
                          {children}
                        </table>
                      </div>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              {!!message.citations?.length && (
                <div className="mt-3 border-l-2 border-teal-300 pl-3 text-xs text-slate-500">
                  {message.citations.slice(0, 3).map((citation) => (
                    <p key={citation.label}>
                      {citation.label}
                      {citation.pageStart ? `, p. ${citation.pageStart}` : ""}
                    </p>
                  ))}
                </div>
              )}
              {!!message.suggestedResources?.length && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.suggestedResources.slice(0, 2).map((resource) => (
                    <Link
                      key={resource.slug}
                      href={
                        resource.routeUrl?.startsWith("/") &&
                        !resource.routeUrl.startsWith("//")
                          ? resource.routeUrl
                          : `/resources?query=${encodeURIComponent(resource.slug)}`
                      }
                      className="focus-ring inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800"
                    >
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      {resource.title}
                    </Link>
                  ))}
                </div>
              )}
              {message.role === "assistant" && index > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  {(
                    [
                      { rating: "helpful", label: "Helpful", icon: ThumbsUp },
                      {
                        rating: "not_helpful",
                        label: "Not helpful",
                        icon: ThumbsDown,
                      },
                    ] as const
                  ).map(({ rating, label, icon: Icon }) => (
                    <button
                      key={rating}
                      disabled={!!ratings[index]}
                      aria-label={label}
                      aria-pressed={ratings[index] === rating}
                      title={label}
                      onClick={() => rate(index, rating)}
                      className={cn(
                        "focus-ring rounded p-1.5 text-slate-400 hover:bg-slate-100",
                        ratings[index] === rating && "bg-teal-50 text-teal-700",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                  {ratings[index] && (
                    <span className="text-xs text-slate-500">Thank you.</span>
                  )}
                  {voiceEnabled && (
                    <ChemShastriSpeakButton
                      text={message.spokenText || message.content}
                      settings={voiceSettings}
                    />
                  )}
                </div>
              )}
              {index === 0 && messages.length === 1 && (
                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  {examples.map((prompt) => (
                    <button
                      key={prompt}
                      disabled={loading}
                      onClick={() => void submitPrompt(prompt)}
                      className="focus-ring rounded-lg border border-slate-200 p-3 text-left text-sm text-slate-600 transition hover:border-blue-400 hover:bg-blue-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
        {loading && (
          <div
            className="mx-auto flex max-w-3xl items-center gap-2 text-sm text-blue-700"
            role="status"
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{" "}
            Working through your question…
          </div>
        )}
        <div ref={bottom} />
      </div>
      {error && (
        <p
          role="alert"
          className="border-t border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-800"
        >
          {error}
        </p>
      )}
      <form
        onSubmit={submit}
        className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 sm:px-6"
      >
        <div className="flex items-end gap-2 rounded-lg border border-slate-300 bg-white p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <label htmlFor="ai-message" className="sr-only">
            Your chemistry question
          </label>
          <textarea
            id="ai-message"
            maxLength={9000}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                void submitPrompt(input);
              }
            }}
            placeholder="Ask a chemistry question…"
            rows={2}
            className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm leading-6 text-slate-800 outline-none"
          />
          <button
            type="submit"
            title="Send question"
            aria-label="Send question"
            disabled={!input.trim() || loading}
            className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-700 text-white transition hover:bg-blue-800 disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Check important answers with your textbook or teacher. Chemistry
          practicals need adult supervision.
        </p>
      </form>
    </section>
  );
}
