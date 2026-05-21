import type { Metadata } from "next";
import { Atom, BatteryCharging, FlaskConical, Hexagon, Waves } from "lucide-react";
import type { LabCatalogEntry } from "@/data/labs/labCatalog";
import { getLabsByStatus } from "@/data/labs/labCatalog";
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

const featuredLabs = getLabsByStatus("featured");

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
          message="Start with Daniell Cell Studio. Build the cell step by step, then follow the electrons through the wire."
          actionLabel="Open Daniell Cell Studio"
          actionHref="/labs/daniell-cell-studio"
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
              <Card key={lab.title} interactive className={`h-full bg-gradient-to-br ${getLabGradient(lab)}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-3xl border-2 border-white bg-blue-600 text-white shadow-lg">
                    {getLabIcon(lab)}
                  </span>
                  <Badge tone="blue">{lab.topic}</Badge>
                </div>
                <h3 className="mt-5 text-2xl font-black text-slate-950">{lab.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{lab.description}</p>
                <Button href={lab.route} className="mt-5" icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}>
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

function getLabIcon(lab: LabCatalogEntry) {
  if (lab.thumbnailType === "electrochem") return <BatteryCharging className="h-7 w-7" aria-hidden="true" />;
  if (lab.thumbnailType === "molecule") return <Hexagon className="h-7 w-7" aria-hidden="true" />;
  if (lab.thumbnailType === "acid-base") return <Waves className="h-7 w-7" aria-hidden="true" />;
  return <Atom className="h-7 w-7" aria-hidden="true" />;
}

function getLabGradient(lab: LabCatalogEntry) {
  if (lab.thumbnailType === "electrochem") return "from-cyan-100 via-white to-amber-100";
  if (lab.thumbnailType === "molecule") return "from-violet-100 via-white to-cyan-100";
  return "from-amber-100 via-white to-sky-100";
}
