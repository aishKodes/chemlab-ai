import {
  Atom,
  BatteryCharging,
  Beaker,
  Castle,
  Gem,
  Map,
  Mountain,
  Orbit,
  Swords,
  Trees,
  Waves,
} from "lucide-react";
import { WorldCard } from "@/components/gamification/WorldCard";

const worlds = [
  {
    title: "Atom Island",
    description: "Touch the atom. Change the charge. See chemistry react.",
    progress: 72,
    missions: 7,
    status: "In progress",
    xp: 420,
    href: "/learn/chemistry/atomic-structure",
    icon: <Atom className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-sky-200 via-cyan-100 to-lime-100",
  },
  {
    title: "Periodic Kingdom",
    description: "Explore element families like colourful chemistry clans.",
    progress: 58,
    missions: 6,
    status: "In progress",
    xp: 360,
    href: "/learn/chemistry/periodic-table",
    icon: <Castle className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-violet-200 via-fuchsia-100 to-sky-100",
  },
  {
    title: "Bonding Forest",
    description: "Grow molecules by sharing or transferring valence electrons.",
    progress: 41,
    missions: 8,
    status: "Unlocked",
    xp: 510,
    href: "/learn/chemistry/chemical-bonding",
    icon: <Trees className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-emerald-200 via-lime-100 to-yellow-100",
  },
  {
    title: "Mole Mountain",
    description: "Climb from grams to moles to particle galaxies.",
    progress: 34,
    missions: 7,
    status: "Unlocked",
    xp: 620,
    href: "/learn/chemistry/mole-concept",
    icon: <Mountain className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-orange-200 via-amber-100 to-pink-100",
  },
  {
    title: "Reaction Arena",
    description: "Balance equations like reaction puzzles and boss battles.",
    progress: 26,
    missions: 6,
    status: "Unlocked",
    xp: 700,
    href: "/learn/chemistry/chemical-reactions",
    icon: <Swords className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-rose-200 via-orange-100 to-violet-100",
  },
  {
    title: "Acid-Base Lagoon",
    description: "Measure pH, neutralize reactions, and read color-change clues.",
    progress: 18,
    missions: 5,
    status: "Prototype",
    xp: 780,
    href: "/labs/cinematic-salt-lab",
    icon: <Waves className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-teal-200 via-cyan-100 to-emerald-100",
  },
  {
    title: "Electrochem City",
    description: "Follow electrons through cells, electrodes, bridges, and voltage clues.",
    progress: 12,
    missions: 6,
    status: "Featured lab",
    xp: 820,
    href: "/labs/daniell-cell-studio",
    icon: <BatteryCharging className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-blue-200 via-cyan-100 to-amber-100",
  },
  {
    title: "Equilibrium Galaxy",
    description: "Predict reversible reactions in a glowing space lab.",
    progress: 0,
    missions: 5,
    status: "Coming soon",
    xp: 840,
    href: "/learn/chemistry",
    icon: <Orbit className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-indigo-200 via-sky-100 to-cyan-100",
    locked: true,
  },
  {
    title: "Organic Dungeon",
    description: "Decode carbon chains, functional groups, and reaction traps.",
    progress: 0,
    missions: 9,
    status: "Coming soon",
    xp: 900,
    href: "/learn/chemistry",
    icon: <Gem className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-purple-200 via-pink-100 to-amber-100",
    locked: true,
  },
  {
    title: "Virtual Lab Academy",
    description: "Cinematic practicals with scene dialogue, lab actions, and evidence checks.",
    progress: 0,
    missions: 4,
    status: "Prototype",
    xp: 960,
    href: "/labs",
    icon: <Beaker className="h-8 w-8" aria-hidden="true" />,
    gradient: "bg-gradient-to-br from-blue-200 via-white to-amber-100",
  },
];

export function QuestMap({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-blue-700 shadow">
        <Map className="h-4 w-4" aria-hidden="true" />
        Choose a Chemistry World
      </div>
      <div className={compact ? "grid gap-4 md:grid-cols-2 xl:grid-cols-4" : "grid gap-5 md:grid-cols-2 xl:grid-cols-3"}>
        {worlds.map((world) => (
          <WorldCard key={world.title} {...world} />
        ))}
      </div>
    </div>
  );
}
