import type { Metadata } from "next";
import { RedoxAssetDebug } from "@/components/labs/redox-transfer-kitchen/RedoxAssetDebug";

export const metadata: Metadata = {
  title: "Redox Assets Debug | Chemlab",
  robots: { index: false, follow: false },
};

export default function RedoxAssetsPage() {
  return <RedoxAssetDebug />;
}
