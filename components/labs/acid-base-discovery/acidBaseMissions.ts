export const acidBaseMissions = [
  {
    title: "Strong or weak?",
    instruction:
      "Open Introduction. Compare Strong Acid and Weak Acid using the magnifying glass.",
    question:
      "At the same concentration, which acid forms the greater proportion of ions?",
    options: [
      "Strong acid",
      "Weak acid",
      "Both always form the same proportion",
    ],
    answer: 0,
    explanation:
      "A strong acid ionises almost completely in water. A weak acid ionises only partly. Strength describes ionisation, not how much acid was added.",
    hint: "Count intact acid particles as well as ions. Which solution leaves fewer acid particles intact?",
  },
  {
    title: "Concentrated is different",
    instruction:
      "Open My Solution. Select an acid and keep its strength fixed. Lower the concentration and compare the pH.",
    question: "Diluting a strong acid with water usually moves its pH…",
    options: [
      "Further below 7",
      "Closer to 7 from below",
      "Above 7, making it a base",
    ],
    answer: 1,
    explanation:
      "Dilution lowers the hydronium-ion concentration. The pH rises towards neutral. Adding water does not turn an acid into a base.",
    hint: "pH increases when hydronium-ion concentration decreases. Neutral water is about pH 7 at 25 °C.",
  },
  {
    title: "Follow the charge",
    instruction:
      "Return to Introduction. Choose the conductivity tester. Compare water with a strong acid or strong base.",
    question: "What carries electric charge through an aqueous solution?",
    options: [
      "Only intact molecules",
      "Mobile ions",
      "Electrons jumping directly through the water",
    ],
    answer: 1,
    explanation:
      "Mobile ions carry charge through the solution. At comparable concentrations, a strong acid or base usually produces more ions and conducts better than a weak one.",
    hint: "Look for charged particles. Electrons move through the external metal wires; ions move in the solution.",
  },
] as const;
