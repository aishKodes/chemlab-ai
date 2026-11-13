import Link from "next/link";
import {
  ArrowRight,
  Atom,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Layers,
  MessageCircle,
  Repeat2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";

const experiences = [
  {
    title: "Acid-Base Discovery",
    description:
      "Look inside a solution. Compare strong and weak acids, test pH, and follow the ions.",
    href: "/labs/acid-base-discovery",
    label: "New guided lab",
    icon: FlaskConical,
    colour: "bg-teal-50 text-teal-700",
    topic: "Acids & bases",
    visual: "H₃O⁺  ⇌  OH⁻",
  },
  {
    title: "Redox Transfer Kitchen",
    description:
      "Paati gives, Karthik receives. Discover how the same idea explains electron transfer.",
    href: "/labs/redox-transfer-kitchen",
    label: "Story adventure",
    icon: Repeat2,
    colour: "bg-amber-50 text-amber-700",
    topic: "Redox reactions",
    visual: "Zn  →  2e⁻  →  Cu²⁺",
  },
  {
    title: "Molecule Shapes 3D",
    description:
      "Turn a molecule in your hands. See why water bends and methane forms a tetrahedron.",
    href: "/labs/molecule-shapes-3d",
    label: "Explore in 3D",
    icon: Atom,
    colour: "bg-blue-50 text-blue-700",
    topic: "Chemical bonding",
    visual: "H₂O   CH₄   NH₃",
  },
];

export function LandingSections() {
  return (
    <>
      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
                Learn by doing
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Make your next discovery.
              </h2>
            </div>
            <Link
              href="/labs"
              className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-blue-700"
            >
              Explore all labs{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {experiences.map(
              ({
                title,
                description,
                href,
                label,
                icon: Icon,
                colour,
                topic,
                visual,
              }) => (
                <Link
                  key={href}
                  href={href}
                  className="focus-ring group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  <div
                    className={`relative flex h-40 flex-col justify-between p-5 ${colour}`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon
                        className="h-7 w-7"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-bold">{label}</span>
                    </div>
                    <p
                      className="text-center text-2xl font-bold"
                      aria-hidden="true"
                    >
                      {visual}
                    </p>
                    <p className="text-xs font-semibold">{topic}</p>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-extrabold text-slate-950">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                      Enter lab{" "}
                      <ArrowRight
                        className="h-4 w-4 transition group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              ),
            )}
          </div>
        </Container>
      </section>
      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.25fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Your starting point
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Choose your class.
              </h2>
              <p className="mt-3 max-w-md leading-7 text-slate-600">
                Follow your chapter, try an experiment, then check what you
                understand.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[9, 10, 11, 12].map((level) => (
                <Link
                  key={level}
                  href={`/classes/${level}`}
                  className="focus-ring flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5 transition hover:border-blue-400"
                >
                  <div>
                    <p className="text-xl font-extrabold text-slate-950">
                      Class {level}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {level < 11 ? "Science" : "Chemistry"}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-5 w-5 text-blue-600"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-4">
                <MasterAlchem size="md" mood="guide" showGlow={false} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
                    A little help goes a long way
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    Meet Chem-Shastri.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-lg leading-7 text-slate-600">
                Ask in your own words. Get a hint before the answer, work
                through a calculation, or find out why your first attempt went
                wrong.
              </p>
              <Link
                href="/ai-tutor"
                className="focus-ring mt-5 inline-flex items-center gap-2 font-bold text-blue-700"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" /> Ask a
                chemistry question{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="lg:border-l lg:border-slate-200 lg:pl-12">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Keep the idea with you
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                Mistakes become clues.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Recall it with a memory card. Test it with a quick drill. Return
                to the part that needs another look.
              </p>
              <div className="mt-6 flex flex-wrap gap-5">
                {[
                  {
                    title: "Memory cards",
                    href: "/memory-cards",
                    icon: Layers,
                  },
                  {
                    title: "Quick drills",
                    href: "/quick-drills",
                    icon: BookOpen,
                  },
                ].map(({ title, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-blue-700"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {title}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="border-t border-blue-100 bg-blue-50 py-8">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GraduationCap
              className="h-7 w-7 text-blue-700"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <div>
              <h2 className="font-extrabold text-slate-950">
                Bring an experiment to your classroom.
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Shared discoveries. A question worth discussing.
              </p>
            </div>
          </div>
          <Link
            href="/teacher/dashboard"
            className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-blue-700"
          >
            For teachers <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Container>
      </section>
    </>
  );
}
