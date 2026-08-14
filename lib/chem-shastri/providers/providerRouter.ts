import type { AiProviderName } from "@/lib/ai/providers/types";
import { DEFAULT_GEMINI_MODEL } from "./geminiProvider";
import { DEFAULT_GROQ_MODEL } from "./groqProvider";

export type ChemShastriCloudProvider = "gemini" | "groq";

export function configuredChemShastriProviders(): ChemShastriCloudProvider[] {
  const providers: ChemShastriCloudProvider[] = [];
  if (process.env.GEMINI_API_KEY) providers.push("gemini");
  if (process.env.GROQ_API_KEY) providers.push("groq");
  return providers;
}

export function chemShastriProviderOrder(): AiProviderName[] {
  if (process.env.CHEM_SHASTRI_MOCK_MODE === "true" || process.env.MASTER_ALCHEM_MOCK_MODE === "true") {
    return ["mock"];
  }
  return [...configuredChemShastriProviders(), "mock"];
}

export function chemShastriModelFor(provider: AiProviderName) {
  if (provider === "gemini") return process.env.GEMINI_MODEL || process.env.GEMINI_FAST_MODEL || DEFAULT_GEMINI_MODEL;
  if (provider === "groq") return process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;
  return "curated-ncert-fallback";
}
