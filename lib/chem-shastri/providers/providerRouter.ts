import type { AiProviderName } from "@/lib/ai/providers/types";
import { DEFAULT_GEMINI_MODEL } from "./geminiProvider";
import { DEFAULT_GROQ_MODEL } from "./groqProvider";

export type ChemShastriCloudProvider = "gemini" | "groq" | "openai";

export function openaiFallbackEnabled() {
  const flag =
    process.env.CHEM_SHASTRI_OPENAI_FALLBACK_ENABLED ??
    process.env.OPENAI_FALLBACK_ENABLED;
  return (
    (flag === "true" || flag === "1") && Boolean(process.env.OPENAI_API_KEY)
  );
}

export function configuredChemShastriProviders(): ChemShastriCloudProvider[] {
  const providers: ChemShastriCloudProvider[] = [];
  if (process.env.GEMINI_API_KEY) providers.push("gemini");
  if (process.env.GROQ_API_KEY) providers.push("groq");
  if (openaiFallbackEnabled()) providers.push("openai");
  return providers;
}

export function chemShastriProviderOrder(): AiProviderName[] {
  if (
    process.env.CHEM_SHASTRI_MOCK_MODE === "true" ||
    process.env.MASTER_ALCHEM_MOCK_MODE === "true"
  ) {
    return ["mock"];
  }
  return [...configuredChemShastriProviders(), "mock"];
}

export function chemShastriModelFor(provider: AiProviderName) {
  if (provider === "gemini")
    return (
      process.env.GEMINI_MODEL ||
      process.env.GEMINI_FAST_MODEL ||
      DEFAULT_GEMINI_MODEL
    );
  if (provider === "groq") return process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;
  if (provider === "openai")
    return (
      process.env.CHEM_SHASTRI_OPENAI_FAST_MODEL ||
      process.env.OPENAI_FAST_MODEL ||
      "gpt-4o-mini"
    );
  return "curated-ncert-fallback";
}
