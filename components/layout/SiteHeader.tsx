import { Atom, FlaskConical, LayoutDashboard, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const navigation = [
  { href: "/learn", label: "Learn" },
  { href: "/simulations", label: "Simulations" },
  { href: "/labs", label: "Labs" },
  { href: "/tools", label: "Tools" },
  { href: "/quiz", label: "Quiz" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/70 bg-white/78 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-white bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md">
            <Atom className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-base font-black text-slate-950">Chemlab</span>
            <span className="hidden text-xs font-bold text-blue-600 sm:block">Colourful chemistry universe</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-2xl px-3 py-2 text-sm font-extrabold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
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
            Master Alchem
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
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-white/80 text-blue-700 shadow-sm transition hover:bg-blue-50 lg:hidden"
            aria-label="Open dashboard"
          >
            <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </header>
  );
}
