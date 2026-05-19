import type { QuizQuestion } from "@/types";

export const sampleQuestions: QuizQuestion[] = [
  {
    id: "atomic-structure-1",
    chapterSlug: "atomic-structure",
    type: "multiple_choice",
    difficulty: "Foundation",
    questionText: "An atom has 11 protons, 12 neutrons, and 10 electrons. Which statement is correct?",
    options: [
      "It is a neutral neon atom",
      "It is a sodium ion with a +1 charge",
      "It is a magnesium ion with a -1 charge",
      "It is a sodium isotope with a -1 charge",
    ],
    correctAnswer: "It is a sodium ion with a +1 charge",
    explanation:
      "11 protons identify sodium. Charge equals protons minus electrons, so 11 - 10 = +1. The mass number is 23, making it sodium-23.",
    tags: ["ions", "atomic-number", "isotopes"],
  },
  {
    id: "atomic-structure-2",
    chapterSlug: "atomic-structure",
    type: "numeric",
    difficulty: "Foundation",
    questionText: "What is the mass number of an atom with 8 protons and 10 neutrons?",
    correctAnswer: 18,
    explanation: "Mass number is protons plus neutrons: 8 + 10 = 18.",
    tags: ["mass-number"],
  },
  {
    id: "atomic-structure-3",
    chapterSlug: "atomic-structure",
    type: "multiple_choice",
    difficulty: "Foundation",
    questionText: "Which change creates an isotope of carbon rather than a different element?",
    options: ["Add one proton", "Remove one proton", "Add two neutrons", "Remove all electrons"],
    correctAnswer: "Add two neutrons",
    explanation:
      "An isotope has the same number of protons but a different number of neutrons. Changing protons changes the element.",
    tags: ["isotopes"],
  },
  {
    id: "periodic-table-1",
    chapterSlug: "periodic-table",
    type: "multiple_choice",
    difficulty: "Foundation",
    questionText: "Why do sodium and potassium show similar chemical behavior?",
    options: [
      "They have the same atomic mass",
      "They are both noble gases",
      "They have one valence electron",
      "They have the same number of protons",
    ],
    correctAnswer: "They have one valence electron",
    explanation:
      "Elements in Group 1 have one outer-shell electron, so they tend to form +1 ions and react in related ways.",
    tags: ["groups", "valence-electrons"],
  },
  {
    id: "periodic-table-2",
    chapterSlug: "periodic-table",
    type: "multiple_choice",
    difficulty: "Foundation",
    questionText: "Which family is generally least reactive because its outer shell is filled?",
    options: ["Halogens", "Alkali metals", "Noble gases", "Transition metals"],
    correctAnswer: "Noble gases",
    explanation:
      "Noble gases have filled outer shells in the school-level model, making them very stable and mostly unreactive.",
    tags: ["families"],
  },
  {
    id: "periodic-table-3",
    chapterSlug: "periodic-table",
    type: "true_false",
    difficulty: "Foundation",
    questionText: "Elements in the same period have the same number of occupied electron shells in a simple shell model.",
    correctAnswer: true,
    explanation:
      "A period corresponds to an electron shell level in the simplified model used for early periodic trends.",
    tags: ["periods"],
  },
  {
    id: "chemical-bonding-1",
    chapterSlug: "chemical-bonding",
    type: "multiple_choice",
    difficulty: "Intermediate",
    questionText: "Which pair is most likely to form an ionic compound?",
    options: ["C and O", "Na and Cl", "H and H", "N and O"],
    correctAnswer: "Na and Cl",
    explanation:
      "Sodium is a metal that tends to lose one electron, while chlorine is a nonmetal that tends to gain one electron.",
    tags: ["ionic-bonding"],
  },
  {
    id: "chemical-bonding-2",
    chapterSlug: "chemical-bonding",
    type: "multiple_choice",
    difficulty: "Intermediate",
    questionText: "In a covalent bond, atoms mainly achieve stability by:",
    options: ["Sharing electron pairs", "Sharing protons", "Changing atomic number", "Destroying neutrons"],
    correctAnswer: "Sharing electron pairs",
    explanation:
      "Covalent bonding involves shared electron pairs between nonmetal atoms.",
    tags: ["covalent-bonding"],
  },
  {
    id: "chemical-bonding-3",
    chapterSlug: "chemical-bonding",
    type: "multiple_choice",
    difficulty: "Intermediate",
    questionText: "Why is the formula of magnesium chloride MgCl2?",
    options: [
      "Magnesium has two atoms in every molecule",
      "Magnesium forms Mg2+ and each chloride is Cl-",
      "Chlorine always forms two bonds",
      "The formula is chosen alphabetically",
    ],
    correctAnswer: "Magnesium forms Mg2+ and each chloride is Cl-",
    explanation:
      "One Mg2+ ion needs two Cl- ions to make the total charge zero.",
    tags: ["ionic-formulas"],
  },
  {
    id: "mole-concept-1",
    chapterSlug: "mole-concept",
    type: "numeric",
    difficulty: "Intermediate",
    questionText: "How many moles are in 18 g of water if the molar mass of water is 18 g/mol?",
    correctAnswer: 1,
    explanation: "Moles = mass / molar mass = 18 / 18 = 1 mol.",
    tags: ["mass-to-moles"],
  },
  {
    id: "mole-concept-2",
    chapterSlug: "mole-concept",
    type: "multiple_choice",
    difficulty: "Intermediate",
    questionText: "Avogadro's number tells us the number of particles in:",
    options: ["One gram", "One molecule", "One mole", "One atom"],
    correctAnswer: "One mole",
    explanation:
      "One mole contains 6.022 x 10^23 representative particles.",
    tags: ["avogadro"],
  },
  {
    id: "mole-concept-3",
    chapterSlug: "mole-concept",
    type: "numeric",
    difficulty: "Intermediate",
    questionText: "How many moles are represented by 3.011 x 10^23 particles?",
    correctAnswer: 0.5,
    explanation:
      "Moles = particles / Avogadro's number. 3.011 x 10^23 is half of 6.022 x 10^23, so the answer is 0.5 mol.",
    tags: ["particles-to-moles"],
  },
  {
    id: "chemical-reactions-1",
    chapterSlug: "chemical-reactions",
    type: "true_false",
    difficulty: "Intermediate",
    questionText: "The equation 2H2 + O2 -> 2H2O is balanced.",
    correctAnswer: true,
    explanation:
      "Both sides contain 4 hydrogen atoms and 2 oxygen atoms.",
    tags: ["balancing"],
  },
  {
    id: "chemical-reactions-2",
    chapterSlug: "chemical-reactions",
    type: "multiple_choice",
    difficulty: "Intermediate",
    questionText: "When balancing equations, which should be changed?",
    options: ["Subscripts", "Element symbols", "Coefficients", "Atomic numbers"],
    correctAnswer: "Coefficients",
    explanation:
      "Coefficients change the number of formula units. Subscripts belong to the compound identity and should not be edited.",
    tags: ["coefficients"],
  },
  {
    id: "chemical-reactions-3",
    chapterSlug: "chemical-reactions",
    type: "multiple_choice",
    difficulty: "Intermediate",
    questionText: "What conservation law explains why atoms must balance on both sides of an equation?",
    options: [
      "Conservation of charge only",
      "Conservation of mass",
      "Conservation of temperature",
      "Conservation of color",
    ],
    correctAnswer: "Conservation of mass",
    explanation:
      "Chemical reactions rearrange atoms; they do not create or destroy atoms in ordinary chemical processes.",
    tags: ["conservation"],
  },
];

export function getQuestionsByChapter(chapterSlug: string) {
  return sampleQuestions.filter((question) => question.chapterSlug === chapterSlug);
}
