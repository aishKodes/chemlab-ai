import { periodicTable } from "@/data/periodic-table";

type ElementCounts = Record<string, number>;

export type FormulaBreakdown = {
  symbol: string;
  name: string;
  count: number;
  atomicMass: number;
  subtotal: number;
};

export type MolecularMassResult = {
  valid: boolean;
  formula: string;
  totalMass: number;
  breakdown: FormulaBreakdown[];
  error?: string;
};

const elementBySymbol = new Map(periodicTable.map((element) => [element.symbol, element]));

function mergeCounts(target: ElementCounts, source: ElementCounts, multiplier = 1) {
  for (const [symbol, count] of Object.entries(source)) {
    target[symbol] = (target[symbol] ?? 0) + count * multiplier;
  }
}

function parseNumber(formula: string, index: number) {
  let cursor = index;
  let value = "";
  while (cursor < formula.length && /\d/.test(formula[cursor] ?? "")) {
    value += formula[cursor];
    cursor += 1;
  }

  return {
    value: value ? Number(value) : 1,
    index: cursor,
  };
}

function parseGroup(formula: string, startIndex: number): { counts: ElementCounts; index: number } {
  const counts: ElementCounts = {};
  let index = startIndex;

  while (index < formula.length) {
    const char = formula[index];

    if (char === ")") {
      return { counts, index: index + 1 };
    }

    if (char === "(") {
      const group = parseGroup(formula, index + 1);
      const multiplier = parseNumber(formula, group.index);
      mergeCounts(counts, group.counts, multiplier.value);
      index = multiplier.index;
      continue;
    }

    if (!char || !/[A-Z]/.test(char)) {
      throw new Error(`Unexpected token "${char ?? ""}" at position ${index + 1}.`);
    }

    let symbol = char;
    if (index + 1 < formula.length && /[a-z]/.test(formula[index + 1] ?? "")) {
      symbol += formula[index + 1];
      index += 1;
    }

    if (!elementBySymbol.has(symbol)) {
      throw new Error(`Unknown element symbol "${symbol}".`);
    }

    const parsedCount = parseNumber(formula, index + 1);
    counts[symbol] = (counts[symbol] ?? 0) + parsedCount.value;
    index = parsedCount.index;
  }

  return { counts, index };
}

export function parseFormulaElements(formula: string): ElementCounts {
  const normalized = formula.replace(/\s+/g, "");
  if (!normalized) throw new Error("Enter a chemical formula.");
  if (!/^[A-Za-z0-9()]+$/.test(normalized)) {
    throw new Error("Use element symbols, numbers, and parentheses only.");
  }

  const parsed = parseGroup(normalized, 0);
  if (parsed.index !== normalized.length) {
    throw new Error("Formula contains unmatched parentheses.");
  }

  return parsed.counts;
}

export function calculateMolecularMass(formula: string): MolecularMassResult {
  try {
    const counts = parseFormulaElements(formula);
    const breakdown = Object.entries(counts)
      .map(([symbol, count]) => {
        const element = elementBySymbol.get(symbol);
        if (!element) throw new Error(`Unknown element symbol "${symbol}".`);

        return {
          symbol,
          name: element.name,
          count,
          atomicMass: element.atomicMass,
          subtotal: element.atomicMass * count,
        };
      })
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    const totalMass = breakdown.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      valid: true,
      formula: formula.replace(/\s+/g, ""),
      totalMass,
      breakdown,
    };
  } catch (error) {
    return {
      valid: false,
      formula,
      totalMass: 0,
      breakdown: [],
      error: error instanceof Error ? error.message : "Formula could not be parsed.",
    };
  }
}
