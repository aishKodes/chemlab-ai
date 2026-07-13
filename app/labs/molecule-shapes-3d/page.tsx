import type { Metadata } from "next";
import { MoleculeShapes3D } from "@/components/labs/molecule-shapes-3d/MoleculeShapes3D";

export const metadata: Metadata = {
  title: "Molecule Shapes 3D",
  description: "School-level molecular geometry visualization for VSEPR shapes and bond angles.",
};

export default function MoleculeShapes3DPage() {
  return <MoleculeShapes3D />;
}
