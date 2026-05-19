insert into chapters (slug, title, subject, class_level, difficulty, summary, estimated_minutes, order_index, is_published)
values
  ('atomic-structure', 'Atomic Structure', 'chemistry', 'school-college bridge', 'Foundation', 'Build atoms from subatomic particles and connect protons, neutrons, electrons, isotopes, ions, and shell models.', 65, 1, true),
  ('periodic-table', 'Periodic Table', 'chemistry', 'school-college bridge', 'Foundation', 'Use the periodic table as a map of electron structure, families, and chemical trends.', 70, 2, true),
  ('chemical-bonding', 'Chemical Bonding', 'chemistry', 'school-college bridge', 'Intermediate', 'Model electron transfer and sharing in ionic and covalent substances.', 85, 3, true),
  ('mole-concept', 'Mole Concept', 'chemistry', 'school-college bridge', 'Intermediate', 'Translate between grams, moles, and particles using molar mass and Avogadro''s number.', 90, 4, true),
  ('chemical-reactions', 'Chemical Reactions', 'chemistry', 'school-college bridge', 'Intermediate', 'Read, check, and balance chemical equations using conservation of atoms.', 80, 5, true)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  difficulty = excluded.difficulty,
  estimated_minutes = excluded.estimated_minutes,
  order_index = excluded.order_index,
  is_published = excluded.is_published;

insert into simulations (slug, title, description, chapter_slug, difficulty, component_key, is_published)
values
  ('atomic-builder', 'Atomic Builder', 'Adjust protons, neutrons, and electrons to see identity, isotope, charge, and shells.', 'atomic-structure', 'Foundation', 'AtomicBuilder', true),
  ('periodic-table', 'Periodic Table Explorer', 'Search and filter the first 30 elements with trend explanations.', 'periodic-table', 'Foundation', 'PeriodicTableExplorer', true),
  ('equation-balancer', 'Equation Balance Checker', 'Count atoms on both sides of chemical equations.', 'chemical-reactions', 'Intermediate', 'EquationBalancer', true),
  ('mole-visualizer', 'Mole Concept Visualizer', 'Convert mass to moles and particle counts with visual scale cues.', 'mole-concept', 'Intermediate', 'MoleVisualizer', true),
  ('bonding-lab', 'Chemical Bonding Lab', 'Compare ionic and covalent bonding examples using valence reasoning.', 'chemical-bonding', 'Intermediate', 'BondingLab', true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  chapter_slug = excluded.chapter_slug,
  difficulty = excluded.difficulty,
  component_key = excluded.component_key,
  is_published = excluded.is_published;

insert into questions (chapter_slug, type, difficulty, question_text, options, correct_answer, explanation, tags, is_published)
values
  (
    'atomic-structure',
    'multiple_choice',
    'Foundation',
    'An atom has 11 protons, 12 neutrons, and 10 electrons. Which statement is correct?',
    '["It is a neutral neon atom","It is a sodium ion with a +1 charge","It is a magnesium ion with a -1 charge","It is a sodium isotope with a -1 charge"]'::jsonb,
    '"It is a sodium ion with a +1 charge"'::jsonb,
    '11 protons identify sodium. Charge equals protons minus electrons, so 11 - 10 = +1.',
    array['ions','atomic-number','isotopes'],
    true
  ),
  (
    'atomic-structure',
    'numeric',
    'Foundation',
    'What is the mass number of an atom with 8 protons and 10 neutrons?',
    null,
    '18'::jsonb,
    'Mass number is protons plus neutrons: 8 + 10 = 18.',
    array['mass-number'],
    true
  ),
  (
    'periodic-table',
    'multiple_choice',
    'Foundation',
    'Why do sodium and potassium show similar chemical behavior?',
    '["They have the same atomic mass","They are both noble gases","They have one valence electron","They have the same number of protons"]'::jsonb,
    '"They have one valence electron"'::jsonb,
    'Group 1 elements have one outer-shell electron, so they tend to form +1 ions and react in related ways.',
    array['groups','valence-electrons'],
    true
  ),
  (
    'periodic-table',
    'true_false',
    'Foundation',
    'Elements in the same period have the same number of occupied electron shells in a simple shell model.',
    null,
    'true'::jsonb,
    'A period corresponds to a shell level in the simplified model used for early periodic trends.',
    array['periods'],
    true
  ),
  (
    'chemical-bonding',
    'multiple_choice',
    'Intermediate',
    'Which pair is most likely to form an ionic compound?',
    '["C and O","Na and Cl","H and H","N and O"]'::jsonb,
    '"Na and Cl"'::jsonb,
    'Sodium is a metal that tends to lose one electron, while chlorine is a nonmetal that tends to gain one electron.',
    array['ionic-bonding'],
    true
  ),
  (
    'chemical-bonding',
    'multiple_choice',
    'Intermediate',
    'In a covalent bond, atoms mainly achieve stability by:',
    '["Sharing electron pairs","Sharing protons","Changing atomic number","Destroying neutrons"]'::jsonb,
    '"Sharing electron pairs"'::jsonb,
    'Covalent bonding involves shared electron pairs between nonmetal atoms.',
    array['covalent-bonding'],
    true
  ),
  (
    'mole-concept',
    'numeric',
    'Intermediate',
    'How many moles are in 18 g of water if the molar mass of water is 18 g/mol?',
    null,
    '1'::jsonb,
    'Moles = mass / molar mass = 18 / 18 = 1 mol.',
    array['mass-to-moles'],
    true
  ),
  (
    'mole-concept',
    'multiple_choice',
    'Intermediate',
    'Avogadro''s number tells us the number of particles in:',
    '["One gram","One molecule","One mole","One atom"]'::jsonb,
    '"One mole"'::jsonb,
    'One mole contains 6.022 x 10^23 representative particles.',
    array['avogadro'],
    true
  ),
  (
    'chemical-reactions',
    'true_false',
    'Intermediate',
    'The equation 2H2 + O2 -> 2H2O is balanced.',
    null,
    'true'::jsonb,
    'Both sides contain 4 hydrogen atoms and 2 oxygen atoms.',
    array['balancing'],
    true
  ),
  (
    'chemical-reactions',
    'multiple_choice',
    'Intermediate',
    'When balancing equations, which should be changed?',
    '["Subscripts","Element symbols","Coefficients","Atomic numbers"]'::jsonb,
    '"Coefficients"'::jsonb,
    'Coefficients change the number of formula units. Subscripts belong to compound identity and should not be edited.',
    array['coefficients'],
    true
  );
