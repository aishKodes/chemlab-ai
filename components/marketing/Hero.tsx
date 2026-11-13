import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  MessageCircle,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-sky-100 bg-sky-50">
      <Image
        src="/processed/assets__chemlab-virtual-lab-bench.webp"
        alt="A colourful chemistry laboratory ready for an experiment"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,252,255,0.98),rgba(248,252,255,0.95)_35%,rgba(248,252,255,0.35)_78%)] max-md:bg-white/90" />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <p className="flex items-center gap-2 text-sm font-bold text-blue-700">
          <FlaskConical className="h-4 w-4" aria-hidden="true" /> Your chemistry
          adventure starts here
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.08] text-slate-950 sm:text-6xl lg:text-7xl">
          Chemistry,
          <br />
          <span className="text-blue-700">brought to life.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
          Enter a world where reactions move, molecules take shape, and
          Chem-Shastri guides you step by step.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/classes"
            className="focus-ring inline-flex min-h-12 items-center gap-3 rounded-lg bg-blue-700 px-5 py-3 font-bold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-800"
          >
            <BookOpen className="h-5 w-5" aria-hidden="true" /> Start learning{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/labs"
            className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-300 bg-white/90 px-5 py-3 font-bold text-slate-800 transition hover:border-blue-500"
          >
            <FlaskConical
              className="h-5 w-5 text-teal-600"
              aria-hidden="true"
            />{" "}
            Enter a virtual lab
          </Link>
        </div>
        <Link
          href="/ai-tutor"
          className="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-700"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Stuck on a
          question? Ask Chem-Shastri{" "}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <p className="mt-10 text-xs font-semibold text-slate-500">
          Free to explore. Class 9–12. Learn at your own pace.
        </p>
      </Container>
    </section>
  );
}
