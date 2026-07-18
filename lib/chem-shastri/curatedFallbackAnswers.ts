import type { ChemShastriContext } from "./chemShastriTypes";

export type CuratedFallbackAnswer = {
  id: string;
  patterns: RegExp[];
  answer: string;
  spokenText: string;
  followUp: string;
  resource?: {
    title: string;
    slug: string;
    type: string;
    routeUrl: string;
    reason: string;
  };
};

const redoxResource = {
  title: "Redox Transfer Kitchen",
  slug: "redox-transfer-kitchen",
  type: "simulation",
  routeUrl: "/labs/redox-transfer-kitchen",
  reason: "It shows redox as one giver-receiver electron transaction.",
};

const hydrocarbonResource = {
  title: "Hydrocarbon Naming Quest",
  slug: "hydrocarbon-naming-quest",
  type: "simulation",
  routeUrl: "/labs/hydrocarbon-naming-quest",
  reason: "It turns IUPAC naming into a carbon-chain puzzle.",
};

const unit1Resource = {
  title: "Chemistry Scale Universe",
  slug: "basic-concepts-chemistry-universe",
  type: "simulation",
  routeUrl: "/labs/basic-concepts-chemistry-universe",
  reason: "It connects matter, measurement, moles, and stoichiometry visually.",
};

const shapesResource = {
  title: "Molecule Shapes 3D",
  slug: "molecule-shapes-3d",
  type: "visualization",
  routeUrl: "/labs/molecule-shapes-3d",
  reason: "It lets you rotate school-level molecule shapes and compare bond angles.",
};

const electrochemistryResource = {
  title: "Electrochemistry Power Grid Studio",
  slug: "electrochemistry-power-grid",
  type: "simulation",
  routeUrl: "/labs/electrochemistry-power-grid",
  reason: "It lets you build a Daniell cell, trace electron flow, and test the Nernst equation.",
};

export const curatedFallbackAnswers: CuratedFallbackAnswer[] = [
  {
    id: "oxidation",
    patterns: [/\bwhat is oxidation\b/i, /\bdefine oxidation\b/i, /\boxidation meaning\b/i, /\bzinc.*oxid/i],
    answer:
      "Oxidation means loss of electrons. Use the school shortcut LEO: Loss of Electrons is Oxidation. In the zinc-copper reaction, Zn becomes Zn²⁺ + 2e⁻, so zinc is oxidized.",
    spokenText:
      "Oxidation means loss of electrons. Remember L E O: loss of electrons is oxidation. Zinc becomes zinc two plus by giving away two electrons.",
    followUp: "Want to see how oxidation and reduction happen in one transfer?",
    resource: redoxResource,
  },
  {
    id: "reduction",
    patterns: [/\bwhat is reduction\b/i, /\bdefine reduction\b/i, /\breduction meaning\b/i, /\bcopper.*reduc/i],
    answer:
      "Reduction means gain of electrons. Use GER: Gain of Electrons is Reduction. Cu²⁺ + 2e⁻ becomes Cu, so copper ion is reduced.",
    spokenText:
      "Reduction means gain of electrons. Remember G E R: gain of electrons is reduction. Copper two plus receives two electrons and becomes copper metal.",
    followUp: "Want a quick LEO-GER check question?",
    resource: redoxResource,
  },
  {
    id: "redox-together",
    patterns: [/\boxidation.*reduction.*together/i, /\bredox.*together/i, /\binseparable/i, /\bwhy.*redox/i],
    answer:
      "Oxidation and reduction happen together because electrons are transferred. One species gives electrons and is oxidized. Another receives those same electrons and is reduced. Redox is one transaction, not two separate events.",
    spokenText:
      "Redox is one electron transaction. One side gives electrons. The other side receives those same electrons. That is why oxidation and reduction happen together.",
    followUp: "Try explaining it using the giver-receiver idea.",
    resource: redoxResource,
  },
  {
    id: "reducing-agent",
    patterns: [/\breducing agent\b/i, /\bwhy.*zinc.*reducing/i],
    answer:
      "A reducing agent causes another species to be reduced, and it does that by giving electrons. Zinc gives electrons to Cu²⁺, so zinc itself is oxidized and acts as the reducing agent.",
    spokenText:
      "Zinc is the reducing agent because it gives electrons to copper two plus. Zinc gets oxidized, and copper ion gets reduced.",
    followUp: "Want the oxidizing-agent side too?",
    resource: redoxResource,
  },
  {
    id: "oxidizing-agent",
    patterns: [/\boxidizing agent\b/i, /\boxidising agent\b/i, /\bwhy.*copper.*oxid/i],
    answer:
      "An oxidizing agent causes another species to be oxidized, and it does that by accepting electrons. Cu²⁺ accepts electrons from zinc, so Cu²⁺ is reduced and acts as the oxidizing agent.",
    spokenText:
      "Copper two plus is the oxidizing agent because it accepts electrons from zinc. It gets reduced while zinc gets oxidized.",
    followUp: "Want a one-line trick for agents?",
    resource: redoxResource,
  },
  {
    id: "iupac",
    patterns: [/\biupac\b/i, /\bnomenclature\b/i],
    answer:
      "IUPAC nomenclature is the system for giving each compound a precise name. For hydrocarbons, find the longest carbon chain, number it correctly, name branches first, choose the root word, then add the suffix for bond type.",
    spokenText:
      "IUPAC naming gives every compound an exact full name. Find the main carbon chain, number it, add branches, then add the bond-type suffix.",
    followUp: "Want to name one molecule together?",
    resource: hydrocarbonResource,
  },
  {
    id: "butane",
    patterns: [/\bbutane\b/i, /\bhow.*name.*but/i],
    answer:
      "Butane has four carbons in the main chain and only single bonds. Four carbons gives the root ‘but’, and single bonds give the suffix ‘ane’. But + ane = butane.",
    spokenText: "Butane has four carbon atoms and only single bonds. Four means but, and single bonds mean ane. But plus ane gives butane.",
    followUp: "Want to try 2-methylpentane next?",
    resource: hydrocarbonResource,
  },
  {
    id: "2-methylpentane",
    patterns: [/\b2[- ]?methylpentane\b/i, /\bwhy.*methylpentane\b/i, /\bwhy.*count.*left\b/i, /\blowest locant\b/i],
    answer:
      "In 2-methylpentane, the longest chain has five carbons, so the root is pentane. The methyl branch is closest to one end, so numbering from that side puts it on carbon 2. We choose 2, not 4, because IUPAC uses the lowest possible locant.",
    spokenText:
      "The longest chain has five carbons, so the root is pentane. The methyl branch gets number two because we number from the nearer end.",
    followUp: "Want to see the branch trap visually?",
    resource: hydrocarbonResource,
  },
  {
    id: "mole-concept",
    patterns: [/\bmole concept\b/i, /\bwhat is mole\b/i, /\bwhy.*avogadro/i],
    answer:
      "The mole is a counting unit for particles, like a dozen but much larger. One mole contains 6.022 × 10²³ particles. It connects the mass you can weigh in grams to the invisible number of atoms, ions, or molecules.",
    spokenText:
      "A mole is a counting unit for particles. One mole has six point zero two two into ten to the power twenty three particles. It connects grams to atoms and molecules.",
    followUp: "Want a mass-to-moles example?",
    resource: unit1Resource,
  },
  {
    id: "avogadro",
    patterns: [/\bavogadro/i, /\b6\.?022/i],
    answer:
      "Avogadro’s constant, 6.022 × 10²³, tells us how many particles are in one mole. It is useful because chemists can weigh a sample, convert mass to moles, and then know the particle count.",
    spokenText:
      "Avogadro's constant tells us how many particles are in one mole. It lets us connect a measured mass to invisible particles.",
    followUp: "Want to convert grams to particles?",
    resource: unit1Resource,
  },
  {
    id: "significant-figures",
    patterns: [/\bsignificant figures?\b/i, /\bsig figs?\b/i],
    answer:
      "Significant figures are the meaningful digits in a measured value. They show how precise the measurement is. Do not copy every calculator digit; round the final answer to match the least precise measurement.",
    spokenText:
      "Significant figures are the meaningful digits in a measurement. They show precision. Round final answers to match the least precise data.",
    followUp: "Want me to judge one value?",
    resource: unit1Resource,
  },
  {
    id: "precision-accuracy",
    patterns: [/\bprecision.*accuracy\b/i, /\baccuracy.*precision\b/i],
    answer:
      "Accuracy means closeness to the true value. Precision means repeated readings are close to each other. A result can be precise but not accurate if the measurements cluster away from the true value.",
    spokenText:
      "Accuracy means close to the true value. Precision means repeated readings are close to each other. They are related, but not the same.",
    followUp: "Want a target-board example?",
    resource: unit1Resource,
  },
  {
    id: "stoichiometry",
    patterns: [/\bstoichiometry\b/i, /\bmole ratio\b/i],
    answer:
      "Stoichiometry uses a balanced chemical equation as a mole-ratio map. First balance the equation, convert known quantities to moles, use the coefficient ratio, then convert to the required unit.",
    spokenText:
      "Stoichiometry uses the balanced equation as a mole-ratio map. Balance first, convert to moles, use the ratio, then convert to the answer unit.",
    followUp: "Want a four-step numerical template?",
    resource: unit1Resource,
  },
  {
    id: "limiting-reagent",
    patterns: [/\blimiting reagent\b/i, /\blimiting reactant\b/i],
    answer:
      "The limiting reagent is the reactant that runs out first. It decides the maximum amount of product. Do not choose only by smaller mass; convert to moles and compare using the balanced equation ratio.",
    spokenText:
      "The limiting reagent is the reactant that finishes first. It controls the product amount. Compare using moles and the balanced equation ratio.",
    followUp: "Want to test one limiting reagent problem?",
    resource: unit1Resource,
  },
  {
    id: "molarity",
    patterns: [/\bmolarity\b/i, /\bconcentration\b/i],
    answer:
      "Molarity is moles of solute per litre of solution. Formula: M = n / V, where n is moles and V is volume in litres.",
    spokenText: "Molarity is moles of solute per litre of solution. Use M equals n divided by V, with volume in litres.",
    followUp: "Want a quick molarity calculation?",
    resource: unit1Resource,
  },
  {
    id: "states-matter",
    patterns: [/\bstates of matter\b/i, /\bsolid.*liquid.*gas\b/i],
    answer:
      "Solids have closely packed particles that mainly vibrate. Liquids have close particles that can slide past each other. Gases have far-apart particles moving quickly in all directions.",
    spokenText:
      "In solids particles are packed and vibrate. In liquids they stay close but slide. In gases they are far apart and move fast.",
    followUp: "Want to compare them with temperature?",
    resource: unit1Resource,
  },
  {
    id: "classification-matter",
    patterns: [/\bclassification of matter\b/i, /\bpure substance\b/i, /\bmixture\b/i],
    answer:
      "Matter can be classified as pure substances and mixtures. Pure substances have fixed composition: elements or compounds. Mixtures contain more than one substance physically combined and can be homogeneous or heterogeneous.",
    spokenText:
      "Matter can be pure substances or mixtures. Pure substances have fixed composition. Mixtures are physically combined and can be uniform or non-uniform.",
    followUp: "Want a sorting game example?",
    resource: unit1Resource,
  },
  {
    id: "study-chemistry",
    patterns: [/\bstudy chemistry\b/i, /\bhow should i study\b/i],
    answer:
      "Study chemistry in three passes: first see the idea visually, then write the rule or formula, then solve two tiny problems and one mixed problem. Keep a mistake list; every mistake is a clue about what to review next.",
    spokenText:
      "Use three passes. See the idea visually, write the rule, then solve small problems. Keep a mistake list because mistakes are clues.",
    followUp: "Want a 20-minute study plan?",
  },
  {
    id: "teacher-redox",
    patterns: [/\bteacher\b.*\bredox\b/i, /\bexplain redox.*class\b/i],
    answer:
      "For a class, teach redox as a transaction. Start with a giver-receiver analogy, then map it to Zn giving 2e⁻ and Cu²⁺ receiving 2e⁻. Only after that introduce LEO, GER, spectator ion, reducing agent, and oxidizing agent.",
    spokenText:
      "Teach redox as a transaction. One gives, one receives. Then map the analogy to zinc giving electrons and copper ion receiving them.",
    followUp: "Want five redox questions for class?",
    resource: redoxResource,
  },
  {
    id: "teacher-redox-questions",
    patterns: [/\bmake 5 questions\b.*\bredox\b/i, /\b5 questions\b.*\bredox\b/i],
    answer:
      "Here are 5 redox questions:\n1. What does LEO mean?\n2. In Zn + Cu²⁺ → Zn²⁺ + Cu, who is oxidized?\n3. Who is reduced?\n4. Why is zinc called the reducing agent?\n5. What does SO₄²⁻ do in Zn + CuSO₄ → ZnSO₄ + Cu?",
    spokenText:
      "Here are five redox checks: define L E O, identify who is oxidized, identify who is reduced, name the reducing agent, and identify the spectator ion.",
    followUp: "Want answers and explanations too?",
    resource: redoxResource,
  },
  {
    id: "water-bent",
    patterns: [/\bwhy.*water.*bent\b/i, /\bh2o.*bent\b/i],
    answer:
      "Water is bent because oxygen has two bonding pairs and two lone pairs. The electron pairs repel each other, and the lone pairs push the O-H bonds downward, giving a bent shape of about 104.5° at school level.",
    spokenText:
      "Water is bent because oxygen has two bond pairs and two lone pairs. Lone pairs repel more strongly, so the H O H angle is about one hundred four point five degrees.",
    followUp: "Want to compare water with carbon dioxide?",
    resource: shapesResource,
  },
  {
    id: "zinc-anode-electrochemistry",
    patterns: [/\bwhy.*zinc.*anode\b/i, /\bzinc.*anode\b/i, /\banode.*zinc\b/i],
    answer:
      "Zinc is the anode in the Daniell cell because zinc atoms lose electrons: Zn(s) -> Zn²⁺(aq) + 2e⁻. Oxidation happens at the anode, so the zinc half-cell is the anode.",
    spokenText:
      "Zinc is the anode because zinc loses electrons. Oxidation happens at the anode, so zinc is the anode in a Daniell cell.",
    followUp: "Want to trace the electron path next?",
    resource: electrochemistryResource,
  },
  {
    id: "electron-flow-zinc-copper",
    patterns: [/\belectrons?.*flow.*zinc.*copper\b/i, /\bwhy.*electrons?.*zinc.*copper\b/i, /\belectron flow\b/i],
    answer:
      "Electrons flow from zinc to copper because zinc has the stronger tendency to lose electrons, while Cu²⁺ has a tendency to gain them. The external wire gives those electrons a path from the zinc anode to the copper cathode.",
    spokenText:
      "Electrons flow from zinc to copper. Zinc gives electrons at the anode, and copper two plus receives them at the cathode.",
    followUp: "Want the anode-cathode shortcut?",
    resource: electrochemistryResource,
  },
  {
    id: "salt-bridge",
    patterns: [/\bsalt bridge\b/i, /\bwhat.*bridge.*doing\b/i, /\bwhy.*salt.*bridge\b/i],
    answer:
      "The salt bridge completes the internal circuit by allowing ions to move. It prevents charge buildup: anions move toward the anode side where Zn²⁺ builds up, and cations move toward the cathode side. Electrons do not travel through the salt bridge.",
    spokenText:
      "The salt bridge carries ions, not electrons. It balances charge so the cell can keep working.",
    followUp: "Want to compare ion flow with electron flow?",
    resource: electrochemistryResource,
  },
  {
    id: "nernst-equation",
    patterns: [/\bnernst\b/i, /\bwhy.*voltage.*concentration\b/i, /\bconcentration.*voltage\b/i],
    answer:
      "The Nernst equation shows how concentration changes cell voltage. For the Daniell cell at 298 K: Ecell = 1.10 - (0.0591/2) log([Zn²⁺]/[Cu²⁺]). Increasing Cu²⁺ increases voltage; increasing Zn²⁺ decreases voltage.",
    spokenText:
      "The Nernst equation connects concentration to voltage. For Daniell cell, more copper two plus raises voltage, while more zinc two plus lowers voltage.",
    followUp: "Want a one-slider example?",
    resource: electrochemistryResource,
  },
  {
    id: "cell-notation",
    patterns: [/\bcell notation\b/i, /\bzn.*zn.*cu.*cu\b/i],
    answer:
      "Cell notation writes the galvanic cell in a compact order: Zn | Zn²⁺ || Cu²⁺ | Cu. The left side is the anode, the right side is the cathode, a single line separates phases, and the double line represents the salt bridge.",
    spokenText:
      "Cell notation is zinc, zinc two plus, salt bridge, copper two plus, copper. Left is anode, right is cathode.",
    followUp: "Want to decode another cell notation?",
    resource: electrochemistryResource,
  },
  {
    id: "standard-cell-potential",
    patterns: [/\be.*1\.10\b/i, /\bwhy.*1\.10\b/i, /\bstandard cell potential\b/i, /\be.?cell\b/i],
    answer:
      "E°cell for the Daniell cell is about 1.10 V because E°cell = E°cathode - E°anode. For Cu²⁺/Cu, E° is about +0.34 V; for Zn²⁺/Zn, E° is about -0.76 V. So 0.34 - (-0.76) = 1.10 V.",
    spokenText:
      "Standard cell potential is cathode potential minus anode potential. For Daniell cell, zero point three four minus negative zero point seven six gives one point one zero volts.",
    followUp: "Want to see what changes away from standard state?",
    resource: electrochemistryResource,
  },
];

export function findCuratedFallbackAnswer(message: string, context?: ChemShastriContext): CuratedFallbackAnswer | null {
  const text = message.trim();
  const contextual = context?.simulationSlug || context?.resourceSlug || context?.currentPage || "";

  if (/\b(5|five)\s+questions\b.*\bredox\b/i.test(text) || /\bredox\b.*\b(5|five)\s+questions\b/i.test(text)) {
    return curatedFallbackAnswers.find((answer) => answer.id === "teacher-redox-questions") ?? null;
  }

  if (/why|explain|what|how/i.test(text) && /molecule-shapes-3d|molecule-explorer|chemical-bonding/i.test(contextual)) {
    if (/water|h2o|bent|shape/i.test(text)) {
      return curatedFallbackAnswers.find((answer) => answer.id === "water-bent") ?? null;
    }
  }

  if (/electrochemistry-power-grid|daniell-cell-studio|electrochemistry/i.test(contextual)) {
    const electrochem = curatedFallbackAnswers.find((answer) => answer.patterns.some((pattern) => pattern.test(text)) && answer.resource?.slug === "electrochemistry-power-grid");
    if (electrochem) return electrochem;
  }

  return curatedFallbackAnswers.find((answer) => answer.patterns.some((pattern) => pattern.test(text))) ?? null;
}

export function genericCuratedFallback(message: string, context?: ChemShastriContext): CuratedFallbackAnswer {
  const pageHint = context?.simulationSlug
    ? ` I can also connect it to the ${context.simulationSlug.replaceAll("-", " ")} lab.`
    : "";
  return {
    id: "generic",
    patterns: [],
    answer:
      `I can still help from Chemlab’s local chemistry notes. Start with the main idea, then connect it to one example and one mistake to avoid.${pageHint}\n\nAsk me a specific chemistry question like “what is oxidation?”, “why is water bent?”, or “how do I calculate moles?”`,
    spokenText:
      "I can still help from Chemlab local notes. Ask one specific chemistry question, and I will explain the idea, one example, and one mistake to avoid.",
    followUp: "Send the exact concept or question.",
  };
}
