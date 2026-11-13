import { Atom } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

const columns = [
  {
    title: "Study",
    links: [
      { href: "/showcase", label: "Showcase" },
      { href: "/learn/chemistry", label: "Chemistry curriculum" },
      { href: "/simulations", label: "Simulations" },
      { href: "/quiz", label: "Mastery quizzes" },
      { href: "/labs", label: "Story labs" },
    ],
  },
  {
    title: "Lab",
    links: [
      { href: "/tools/molecular-mass-calculator", label: "Molecular mass" },
      { href: "/tools/equation-balancer", label: "Equation checker" },
      { href: "/ai-tutor", label: "Chem-Shastri" },
    ],
  },
  {
    title: "Your learning",
    links: [
      { href: "/dashboard", label: "My progress" },
      { href: "/teacher/dashboard", label: "For teachers" },
      { href: "/about", label: "About chemlearning" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-blue-100 bg-white/75 backdrop-blur">
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-700 text-white">
                <Atom className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div>
                <p className="font-black text-slate-950">chemlearning</p>
                <p className="text-sm font-bold text-blue-600">Chemistry, but alive.</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm font-medium leading-6 text-slate-600">
              Built for students who learn best by touching, testing, predicting,
              playing, and asking Chem-Shastri for the next step.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-black text-slate-950">{column.title}</h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="focus-ring rounded text-sm font-semibold text-slate-600 transition hover:text-blue-700"
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
        <div className="mt-10 border-t border-blue-100 pt-6 text-xs font-semibold text-slate-500">
          © {new Date().getFullYear()} chemlearning. Built for curious students learning chemistry by doing.
        </div>
      </Container>
    </footer>
  );
}
