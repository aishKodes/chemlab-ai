import type { Metadata } from "next";
import { DaniellCellStudio } from "@/components/labs/daniell-cell/DaniellCellStudio";

export const metadata: Metadata = {
  title: "Daniell Cell Studio",
  description:
    "Build a Daniell cell, watch electrons move from zinc to copper, and learn how a galvanic cell produces voltage.",
};

export default function DaniellCellStudioPage() {
  return <DaniellCellStudio />;
}
