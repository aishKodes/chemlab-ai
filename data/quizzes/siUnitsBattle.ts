export const SI_NCERT_SOURCE = "NCERT Class 11 Chemistry, Unit 1: Some Basic Concepts of Chemistry, SI base units table, measurement examples, and Unit 1 exercises";

export type SourceBackedQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  mistakeKey: string;
  sourceReference: string;
  exactOrAdapted: "exact" | "adapted";
};

export const siBaseCores = [
  { quantity: "Length", unit: "metre", symbol: "m" },
  { quantity: "Mass", unit: "kilogram", symbol: "kg" },
  { quantity: "Time", unit: "second", symbol: "s" },
  { quantity: "Electric current", unit: "ampere", symbol: "A" },
  { quantity: "Thermodynamic temperature", unit: "kelvin", symbol: "K" },
  { quantity: "Amount of substance", unit: "mole", symbol: "mol" },
  { quantity: "Luminous intensity", unit: "candela", symbol: "cd" },
] as const;

const source = SI_NCERT_SOURCE;

export const unitAttackQuestions: SourceBackedQuestion[] = [
  {
    id: "si-mass",
    prompt: "Which is the SI base unit of mass?",
    options: ["gram (g)", "kilogram (kg)", "milligram (mg)"],
    answer: "kilogram (kg)",
    explanation: "The SI base unit of mass is kilogram, symbol kg.",
    mistakeKey: "si_mass_base_unit",
    sourceReference: source,
    exactOrAdapted: "adapted",
  },
  {
    id: "si-amount",
    prompt: "Which unit measures amount of substance?",
    options: ["mole (mol)", "kilogram (kg)", "candela (cd)"],
    answer: "mole (mol)",
    explanation: "Amount of substance is an SI base quantity. Its unit is mole, symbol mol.",
    mistakeKey: "si_amount_unit",
    sourceReference: source,
    exactOrAdapted: "adapted",
  },
  {
    id: "si-kelvin-symbol",
    prompt: "Choose the correct symbol for kelvin.",
    options: ["K", "°K", "k"],
    answer: "K",
    explanation: "Kelvin uses the symbol K. The SI symbol has no degree sign.",
    mistakeKey: "si_kelvin_symbol",
    sourceReference: source,
    exactOrAdapted: "adapted",
  },
  {
    id: "si-ampere-symbol",
    prompt: "Choose the correct symbol for ampere.",
    options: ["A", "a", "amp"],
    answer: "A",
    explanation: "The SI symbol for ampere is capital A.",
    mistakeKey: "si_ampere_symbol",
    sourceReference: source,
    exactOrAdapted: "adapted",
  },
];

export const conversionQuestions: SourceBackedQuestion[] = [
  {
    id: "convert-km-mm",
    prompt: "Complete the bridge: 1 km equals how many millimetres?",
    options: ["10³ mm", "10⁶ mm", "10⁹ mm"],
    answer: "10⁶ mm",
    explanation: "1 km = 10³ m and 1 m = 10³ mm, so 1 km = 10⁶ mm.",
    mistakeKey: "conversion_prefix_chain",
    sourceReference: `${source}, exercise conversion of kilometre to smaller metric units`,
    exactOrAdapted: "adapted",
  },
  {
    id: "convert-mg-kg",
    prompt: "Convert 1 mg into kilograms.",
    options: ["10⁻³ kg", "10⁻⁶ kg", "10⁻⁹ kg"],
    answer: "10⁻⁶ kg",
    explanation: "1 mg = 10⁻³ g and 1 g = 10⁻³ kg, therefore 1 mg = 10⁻⁶ kg.",
    mistakeKey: "conversion_mg_kg",
    sourceReference: `${source}, exercise conversion of milligram into kilogram`,
    exactOrAdapted: "adapted",
  },
  {
    id: "convert-ml",
    prompt: "Which statement about 1 mL is correct?",
    options: ["1 mL = 10⁻³ L", "1 mL = 10³ L", "1 mL = 1 L"],
    answer: "1 mL = 10⁻³ L",
    explanation: "The prefix milli means 10⁻³, so 1 mL = 10⁻³ L = 10⁻³ dm³.",
    mistakeKey: "conversion_ml_l",
    sourceReference: `${source}, exercise conversion of millilitre into litre and cubic decimetre`,
    exactOrAdapted: "adapted",
  },
];

export const precisionQuestions: SourceBackedQuestion[] = [
  {
    id: "precision-student-a",
    prompt: "Student A's readings are tightly grouped but away from the true value. What are they?",
    options: ["Precise but not accurate", "Accurate but not precise", "Both accurate and precise"],
    answer: "Precise but not accurate",
    explanation: "Close repeated readings show precision; distance from the true value shows lack of accuracy.",
    mistakeKey: "precision_accuracy_confusion",
    sourceReference: `${source}, precision and accuracy example for Students A, B, and C`,
    exactOrAdapted: "adapted",
  },
  {
    id: "precision-student-c",
    prompt: "Student C's readings cluster around the true value. What are they?",
    options: ["Both accurate and precise", "Precise but not accurate", "Neither precise nor accurate"],
    answer: "Both accurate and precise",
    explanation: "The readings are close to one another and close to the true value.",
    mistakeKey: "precision_accuracy_both",
    sourceReference: `${source}, precision and accuracy example for Students A, B, and C`,
    exactOrAdapted: "adapted",
  },
];

export const significantFigureQuestions: SourceBackedQuestion[] = [
  {
    id: "sig-34-216",
    prompt: "Round 34.216 to three significant figures.",
    options: ["34.2", "34.3", "34.21"],
    answer: "34.2",
    explanation: "Keep 3, 4, 2. The next digit is 1, so 34.2 stays unchanged.",
    mistakeKey: "sigfig_rounding",
    sourceReference: `${source}, exercise rounding 34.216 to three significant figures`,
    exactOrAdapted: "exact",
  },
  {
    id: "sig-10-4107",
    prompt: "Round 10.4107 to three significant figures.",
    options: ["10.4", "10.5", "10.41"],
    answer: "10.4",
    explanation: "The first three significant digits are 1, 0, and 4. The next digit is 1, so the result is 10.4.",
    mistakeKey: "sigfig_zero_between",
    sourceReference: `${source}, exercise rounding 10.4107 to three significant figures`,
    exactOrAdapted: "exact",
  },
  {
    id: "sig-addition",
    prompt: "Report 12.11 + 18.0 + 1.012 using the addition rule.",
    options: ["31.122", "31.12", "31.1"],
    answer: "31.1",
    explanation: "For addition, keep the least number of decimal places. 18.0 has one decimal place, so 31.122 becomes 31.1.",
    mistakeKey: "sigfig_addition_rule",
    sourceReference: `${source}, significant-figure addition example 12.11 + 18.0 + 1.012`,
    exactOrAdapted: "exact",
  },
  {
    id: "sig-multiplication",
    prompt: "Report 2.5 × 1.25 using the multiplication rule.",
    options: ["3.125", "3.13", "3.1"],
    answer: "3.1",
    explanation: "For multiplication, keep the fewest significant figures. 2.5 has two, so 3.125 becomes 3.1.",
    mistakeKey: "sigfig_multiplication_rule",
    sourceReference: `${source}, significant-figure multiplication example 2.5 × 1.25`,
    exactOrAdapted: "exact",
  },
];

export const finalBossQuestions: SourceBackedQuestion[] = [
  {
    id: "boss-2808",
    prompt: "Which is 2808 rounded to three significant figures?",
    options: ["2810", "2800", "2.80 × 10³"],
    answer: "2810",
    explanation: "The first three significant digits are 2, 8, and 0. The next digit is 8, so the tens digit rounds up: 2810.",
    mistakeKey: "sigfig_zeros",
    sourceReference: `${source}, exercise rounding 2808 to three significant figures`,
    exactOrAdapted: "exact",
  },
  {
    id: "boss-04597",
    prompt: "Which is 0.04597 rounded to three significant figures?",
    options: ["0.0460", "0.0459", "0.046"],
    answer: "0.0460",
    explanation: "Leading zeros are not significant. 4, 5, 9 round to 4, 6, 0; the final zero shows three significant figures.",
    mistakeKey: "sigfig_leading_zeros",
    sourceReference: `${source}, exercise rounding 0.04597 to three significant figures`,
    exactOrAdapted: "exact",
  },
  {
    id: "boss-picometre",
    prompt: "How many picometres are in 1 km?",
    options: ["10⁹ pm", "10¹² pm", "10¹⁵ pm"],
    answer: "10¹⁵ pm",
    explanation: "1 km = 10³ m and 1 m = 10¹² pm, so 1 km = 10¹⁵ pm.",
    mistakeKey: "conversion_km_pm",
    sourceReference: `${source}, exercise conversion of kilometre into picometres`,
    exactOrAdapted: "adapted",
  },
];

export const siUnitsQuickDrillQuestions: SourceBackedQuestion[] = [
  ...unitAttackQuestions,
  ...conversionQuestions,
  ...precisionQuestions,
  ...significantFigureQuestions,
  ...finalBossQuestions,
];
