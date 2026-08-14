import type { Metadata } from "next";
import { BasicConceptsChemistryUniverse } from "@/components/labs/basic-concepts-universe/BasicConceptsChemistryUniverse";

export const metadata: Metadata = {
  title: "Chemistry Scale Universe",
  description:
    "Class 11 Some Basic Concepts of Chemistry as a playable chemlearning universe for matter, measurement, mole concept, and stoichiometry.",
};

export default function BasicConceptsChemistryUniversePage() {
  return <BasicConceptsChemistryUniverse />;
}
