import type { Metadata } from "next";
import { RedoxTransferKitchen } from "@/components/labs/redox-transfer-kitchen/RedoxTransferKitchen";

export const metadata: Metadata = {
  title: "Redox Transfer Kitchen | Chemlab",
  description: "Learn oxidation and reduction through Paati’s murukku story and a 3D electron-transfer game.",
};

export default function RedoxTransferKitchenPage() {
  return <RedoxTransferKitchen />;
}
