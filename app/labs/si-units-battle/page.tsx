import type { Metadata } from "next";
import { SIUnitsBattle } from "@/components/labs/si-units-battle/SIUnitsBattle";

export const metadata: Metadata = {
  title: "SI Units Battle",
  description: "Power the seven SI base units, cross conversion bridges, and defeat the significant-figures boss.",
};

export default function SIUnitsBattlePage() {
  return <SIUnitsBattle />;
}
