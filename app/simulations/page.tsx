import type { Metadata } from "next";
import { Atom, FlaskConical, Hexagon, Waves } from "lucide-react";
import { simulations } from "@/data/chemistry-modules";
import { SimulationCard } from "@/components/chemistry/SimulationCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Virtual Labs",
  description:
    "Chemlab virtual labs where students mix reactions, explore molecules, build atoms, and learn by doing.",
};

const featuredLabs = [
  {
    title: "Neutralization Studio",
    description:
      "Mix acid and base, watch pH change, find the neutral point, evaporate water, and reveal salt.",
    href: "/labs/neutralization-studio",
    icon: <Waves className="h-7 w-7" aria-hidden="true" />,
    badge: "Flagship",
    gradient: "from-cyan-100 via-white to-lime-100",
  },
  {
    title: "Molecule Explorer",
    description:
      "Rotate real 3D molecules and see how geometry explains bonding, polarity, and structure.",
    href: "/simulations/molecule-explorer",
    icon: <Hexagon className="h-7 w-7" aria-hidden="true" />,
    badge: "3D viewer",
    gradient: "from-violet-100 via-white to-cyan-100",
  },
  {
    title: "Atomic Builder",
    description:
      "Change protons, neutrons, and electrons to discover identity, isotope, and charge.",
    href: "/simulations/atomic-builder",
    icon: <Atom className="h-7 w-7" aria-hidden="true" />,
    badge: "Interactive",
    gradient: "from-amber-100 via-white to-sky-100",
  },
];

export default function SimulationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Virtual Labs"
        title="Enter a lab. Touch the chemistry."
        description="Choose a featured experience first. Master Alchem will guide you from prediction to observation to explanation."
      />
      <Container className="space-y-10 pb-16">
        <MasterAlchemBubble
          mood="labGuide"
          message="Start with the cinematic shell demo to understand the future lab flow, then practice smaller concepts in the prototype zone."
          actionLabel="Open the lab shell demo"
          actionHref="/labs/demo-cinematic-shell"
        />

        <section aria-labelledby="featured-experiences">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="green">Featured Experiences</Badge>
              <h2 id="featured-experiences" className="mt-3 text-3xl font-black text-slate-950">
                Best places to start
              </h2>
            </div>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {featuredLabs.map((lab) => (
              <Card key={lab.title} interactive className={`h-full bg-gradient-to-br ${lab.gradient}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-3xl border-2 border-white bg-blue-600 text-white shadow-lg">
                    {lab.icon}
                  </span>
                  <Badge tone="blue">{lab.badge}</Badge>
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-950">{lab.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{lab.description}</p>
                <Button href={lab.href} className="mt-5" icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}>
                  Open lab
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="practice-simulations">
          <div>
            <Badge tone="blue">Practice Simulations</Badge>
            <h2 id="practice-simulations" className="mt-3 text-3xl font-black text-slate-950">
              Quick concept practice
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-700">
              Use these to warm up before deeper story labs.
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {simulations
              .filter((simulation) => ["periodic-table", "equation-balancer", "mole-visualizer"].includes(simulation.slug))
              .map((simulation) => (
                <SimulationCard key={simulation.slug} simulation={simulation} />
              ))}
          </div>
        </section>

        <section aria-labelledby="prototype-zone">
          <div>
            <Badge tone="amber">Prototype Zone</Badge>
            <h2 id="prototype-zone" className="mt-3 text-3xl font-black text-slate-950">
              Early labs we are improving
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-700">
              These are early labs we are improving. Try them and watch them evolve.
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {simulations
              .filter((simulation) => ["bonding-lab"].includes(simulation.slug))
              .map((simulation) => (
                <SimulationCard key={simulation.slug} simulation={simulation} />
              ))}
          </div>
        </section>
      </Container>
    </>
  );
}
