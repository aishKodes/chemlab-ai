import { Atom, Code2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

const columns = [
  {
    title: "Study",
    links: [
      { href: "/learn/chemistry", label: "Chemistry curriculum" },
      { href: "/simulations", label: "Simulations" },
      { href: "/quiz", label: "Mastery quizzes" },
    ],
  },
  {
    title: "Lab",
    links: [
      { href: "/tools/molecular-mass-calculator", label: "Molecular mass" },
      { href: "/tools/equation-balancer", label: "Equation checker" },
      { href: "/ai-tutor", label: "AI tutor" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/dashboard", label: "Student dashboard" },
      { href: "/admin", label: "Admin foundation" },
      { href: "/about", label: "Academic mission" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#030610]/80">
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-200/25 bg-cyan-300/10 text-cyan-100">
                <Atom className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-white">ChemLab AI</p>
                <p className="text-sm text-slate-400">A serious learning lab for chemistry.</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
              Built for students who need chemistry to become visible, testable, and
              explainable without hiding rigorous reasoning behind flashy shortcuts.
            </p>
            <div className="mt-5 flex items-center gap-3 text-slate-400">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
              <Code2 className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold text-white">{column.title}</h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="focus-ring rounded text-sm text-slate-400 transition hover:text-cyan-100"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} ChemLab AI. Free-infrastructure MVP with
          privacy-conscious server-side AI adapters.
        </div>
      </Container>
    </footer>
  );
}
