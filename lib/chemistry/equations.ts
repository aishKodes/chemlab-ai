import { parseFormulaElements } from "@/lib/chemistry/molar-mass";

export type EquationSideCounts = Record<string, number>;

export type ParsedEquation = {
  valid: boolean;
  equation: string;
  left: EquationSideCounts;
  right: EquationSideCounts;
  balanced: boolean;
  error?: string;
};

export const equationExamples = [
  "2H2 + O2 -> 2H2O",
  "CH4 + 2O2 -> CO2 + 2H2O",
  "CaCO3 -> CaO + CO2",
  "N2 + 3H2 -> 2NH3",
  "4Fe + 3O2 -> 2Fe2O3",
];

function parseTerm(rawTerm: string) {
  const term = rawTerm.trim();
  const match = term.match(/^(\d+)?\s*([A-Za-z0-9()]+)$/);
  if (!match) throw new Error(`Could not parse term "${term}".`);

  return {
    coefficient: match[1] ? Number(match[1]) : 1,
    formula: match[2] ?? "",
  };
}

function countSide(side: string) {
  const counts: EquationSideCounts = {};
  const terms = side
    .split("+")
    .map((term) => term.trim())
    .filter(Boolean);

  if (terms.length === 0) throw new Error("Each side needs at least one formula.");

  for (const rawTerm of terms) {
    const term = parseTerm(rawTerm);
    const atomCounts = parseFormulaElements(term.formula);
    for (const [symbol, count] of Object.entries(atomCounts)) {
      counts[symbol] = (counts[symbol] ?? 0) + count * term.coefficient;
    }
  }

  return counts;
}

function sameCounts(left: EquationSideCounts, right: EquationSideCounts) {
  const symbols = new Set([...Object.keys(left), ...Object.keys(right)]);
  return Array.from(symbols).every((symbol) => (left[symbol] ?? 0) === (right[symbol] ?? 0));
}

export function parseChemicalEquation(equation: string): ParsedEquation {
  try {
    const normalized = equation.replace(/\s+/g, " ").trim();
    if (!normalized) throw new Error("Enter an equation such as 2H2 + O2 -> 2H2O.");

    const parts = normalized.split(/\s*(?:->|=>|=)\s*/);
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error("Use an arrow like -> between reactants and products.");
    }

    const left = countSide(parts[0]);
    const right = countSide(parts[1]);
    const balanced = sameCounts(left, right);

    return {
      valid: true,
      equation: normalized,
      left,
      right,
      balanced,
    };
  } catch (error) {
    return {
      valid: false,
      equation,
      left: {},
      right: {},
      balanced: false,
      error: error instanceof Error ? error.message : "Equation could not be parsed.",
    };
  }
}

export function getEquationRows(parsed: ParsedEquation) {
  const symbols = Array.from(new Set([...Object.keys(parsed.left), ...Object.keys(parsed.right)])).sort();
  return symbols.map((symbol) => ({
    symbol,
    left: parsed.left[symbol] ?? 0,
    right: parsed.right[symbol] ?? 0,
    balanced: (parsed.left[symbol] ?? 0) === (parsed.right[symbol] ?? 0),
  }));
}
