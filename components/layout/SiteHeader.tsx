import { Atom, FlaskConical, LayoutDashboard, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const navigation = [
  { href: "/learn", label: "Learn" },
  { href: "/simulations", label: "Simulations" },
  { href: "/tools", label: "Tools" },
  { href: "/quiz", label: "Quiz" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050713]/82 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-200/30 bg-cyan-300/10 text-cyan-100">
            <Atom className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-semibold text-white">ChemLab AI</span>
            <span className="hidden text-xs text-slate-400 sm:block">Interactive chemistry lab</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href="/ai-tutor"
            variant="secondary"
            size="sm"
            icon={<MessageSquareText className="h-4 w-4" aria-hidden="true" />}
            className="hidden sm:inline-flex"
          >
            AI Tutor
          </Button>
          <Button
            href="/simulations"
            size="sm"
            icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}
            className="hidden md:inline-flex"
          >
            Launch Lab
          </Button>
          <Link
            href="/dashboard"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-white/8 text-slate-200 transition hover:bg-white/12 lg:hidden"
            aria-label="Open dashboard"
          >
            <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </header>
  );
}
