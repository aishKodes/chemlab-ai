-- Chemlab Stage 3 sample learning-tool content

INSERT INTO site_settings (setting_key, setting_value, type, is_public, created_at, updated_at)
VALUES
  ('maintenance_mode', 'false', 'boolean', 0, NOW(), NOW()),
  ('resources_enabled', 'true', 'boolean', 1, NOW(), NOW()),
  ('admin_content_stage', 'stage_3', 'string', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  type = VALUES(type),
  is_public = VALUES(is_public),
  updated_at = NOW();

INSERT INTO content_blocks (block_key, page_slug, section, type, status, created_at, updated_at)
VALUES
  ('homepage.hero.title', 'home', 'hero', 'text', 'published', NOW(), NOW()),
  ('homepage.hero.subtitle', 'home', 'hero', 'text', 'published', NOW(), NOW()),
  ('labs.page.title', 'labs', 'header', 'text', 'published', NOW(), NOW()),
  ('labs.redox.description', 'labs', 'featured', 'text', 'published', NOW(), NOW()),
  ('labs.hydrocarbon.description', 'labs', 'featured', 'text', 'published', NOW(), NOW()),
  ('chem_shastri.welcome_message', 'chem-shastri', 'welcome', 'text', 'published', NOW(), NOW()),
  ('footer.description', 'global', 'footer', 'text', 'published', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  page_slug = VALUES(page_slug),
  section = VALUES(section),
  type = VALUES(type),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO content_translations (block_id, language, title, body, created_at, updated_at)
SELECT id, 'en', 'Chemistry, brought to life.', 'Enter a world where reactions move, molecules take shape, and Chem-Shastri guides you step by step.', NOW(), NOW()
FROM content_blocks WHERE block_key = 'homepage.hero.title'
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), updated_at = NOW();

INSERT INTO content_translations (block_id, language, title, body, created_at, updated_at)
SELECT id, 'en', 'Enter virtual labs', 'Build reactions, trace molecules, answer challenges, and unlock mastery through guided Chemlab simulations.', NOW(), NOW()
FROM content_blocks WHERE block_key = 'homepage.hero.subtitle'
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), updated_at = NOW();

INSERT INTO content_translations (block_id, language, title, body, created_at, updated_at)
SELECT id, 'en', 'Chemlab labs', 'Choose an experiment and learn by doing. Each lab turns a chemistry idea into a clear action.', NOW(), NOW()
FROM content_blocks WHERE block_key = 'labs.page.title'
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), updated_at = NOW();

INSERT INTO content_translations (block_id, language, title, body, created_at, updated_at)
SELECT id, 'en', 'Redox Transfer Kitchen', 'Learn oxidation and reduction through Paati’s murukku story and an electron-transfer game.', NOW(), NOW()
FROM content_blocks WHERE block_key = 'labs.redox.description'
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), updated_at = NOW();

INSERT INTO content_translations (block_id, language, title, body, created_at, updated_at)
SELECT id, 'en', 'Hydrocarbon Naming Quest', 'Learn IUPAC naming by tracing carbon families, ranking branches, and building names step by step.', NOW(), NOW()
FROM content_blocks WHERE block_key = 'labs.hydrocarbon.description'
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), updated_at = NOW();

INSERT INTO content_translations (block_id, language, title, body, created_at, updated_at)
SELECT id, 'en', 'Ask Chem-Shastri', 'Tell me what feels confusing. I can explain, hint, quiz you, or guide your next lab step.', NOW(), NOW()
FROM content_blocks WHERE block_key = 'chem_shastri.welcome_message'
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), updated_at = NOW();

INSERT INTO content_translations (block_id, language, title, body, created_at, updated_at)
SELECT id, 'en', 'Chemlab', 'A free chemistry learning universe with simulations, quests, resources, and a patient guide.', NOW(), NOW()
FROM content_blocks WHERE block_key = 'footer.description'
ON DUPLICATE KEY UPDATE title = VALUES(title), body = VALUES(body), updated_at = NOW();

INSERT INTO memory_decks
  (uuid, class_id, subject_id, resource_id, title, slug, description, language, difficulty, status, source_type, source_reference, created_at, updated_at)
SELECT
  REPLACE(UUID(), '-', ''),
  classes.id,
  subjects.id,
  learning_resources.id,
  'Redox LEO and GER Memory Deck',
  'redox-leo-ger-memory',
  'Remember oxidation, reduction, and redox agents with compact review cards.',
  'en',
  'beginner',
  'published',
  'CUSTOM',
  'Original Chemlab review content aligned to the Redox Transfer Kitchen simulation.',
  NOW(),
  NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
LEFT JOIN learning_resources ON learning_resources.slug = 'redox-transfer-kitchen'
WHERE classes.class_level = '10'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  class_id = VALUES(class_id),
  subject_id = VALUES(subject_id),
  resource_id = VALUES(resource_id),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO memory_cards
  (deck_id, front, back, hint, explanation, difficulty, card_type, order_index, status, created_at, updated_at)
SELECT id, 'What does LEO mean?', 'Loss of Electrons is Oxidation.', 'Look at the species that gives away electrons.', 'If zinc loses two electrons and becomes Zn2+, zinc is oxidized.', 'beginner', 'definition', 1, 'published', NOW(), NOW()
FROM memory_decks WHERE slug = 'redox-leo-ger-memory'
ON DUPLICATE KEY UPDATE back = VALUES(back), hint = VALUES(hint), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO memory_cards
  (deck_id, front, back, hint, explanation, difficulty, card_type, order_index, status, created_at, updated_at)
SELECT id, 'What does GER mean?', 'Gain of Electrons is Reduction.', 'Look at the species that receives electrons.', 'If copper ion gains two electrons and becomes copper metal, copper ion is reduced.', 'beginner', 'definition', 2, 'published', NOW(), NOW()
FROM memory_decks WHERE slug = 'redox-leo-ger-memory'
ON DUPLICATE KEY UPDATE back = VALUES(back), hint = VALUES(hint), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO memory_cards
  (deck_id, front, back, hint, explanation, difficulty, card_type, order_index, status, created_at, updated_at)
SELECT id, 'Which species is the reducing agent in Zn + Cu2+?', 'Zinc.', 'The reducing agent gets oxidized.', 'Zinc gives electrons to copper ion, so zinc causes reduction and acts as the reducing agent.', 'intermediate', 'application', 3, 'published', NOW(), NOW()
FROM memory_decks WHERE slug = 'redox-leo-ger-memory'
ON DUPLICATE KEY UPDATE back = VALUES(back), hint = VALUES(hint), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO memory_decks
  (uuid, class_id, subject_id, resource_id, title, slug, description, language, difficulty, status, source_type, source_reference, created_at, updated_at)
SELECT
  REPLACE(UUID(), '-', ''),
  classes.id,
  subjects.id,
  learning_resources.id,
  'IUPAC Starter Memory Deck',
  'iupac-starter-memory',
  'Practice roots, suffixes, and branch naming for early hydrocarbon nomenclature.',
  'en',
  'beginner',
  'published',
  'CUSTOM',
  'Original Chemlab review content aligned to Hydrocarbon Naming Quest.',
  NOW(),
  NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
LEFT JOIN learning_resources ON learning_resources.slug = 'hydrocarbon-naming-quest'
WHERE classes.class_level = '11'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  class_id = VALUES(class_id),
  subject_id = VALUES(subject_id),
  resource_id = VALUES(resource_id),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO memory_cards
  (deck_id, front, back, hint, explanation, difficulty, card_type, order_index, status, created_at, updated_at)
SELECT id, 'What root means four carbons?', 'But.', 'Meth, eth, prop, but.', 'Butane has a four-carbon main chain and only single bonds.', 'beginner', 'definition', 1, 'published', NOW(), NOW()
FROM memory_decks WHERE slug = 'iupac-starter-memory'
ON DUPLICATE KEY UPDATE back = VALUES(back), hint = VALUES(hint), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO memory_cards
  (deck_id, front, back, hint, explanation, difficulty, card_type, order_index, status, created_at, updated_at)
SELECT id, 'What suffix means only single bonds?', 'ane.', 'Alkanes use ane.', 'A hydrocarbon with only single carbon-carbon bonds uses the suffix ane.', 'beginner', 'definition', 2, 'published', NOW(), NOW()
FROM memory_decks WHERE slug = 'iupac-starter-memory'
ON DUPLICATE KEY UPDATE back = VALUES(back), hint = VALUES(hint), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO memory_cards
  (deck_id, front, back, hint, explanation, difficulty, card_type, order_index, status, created_at, updated_at)
SELECT id, 'Why is 2-methylpentane numbered from the nearer end?', 'The branch should get the lowest possible number.', 'Compare 2 and 4.', 'Numbering from the correct side gives methyl position 2 instead of 4.', 'intermediate', 'mistake', 3, 'published', NOW(), NOW()
FROM memory_decks WHERE slug = 'iupac-starter-memory'
ON DUPLICATE KEY UPDATE back = VALUES(back), hint = VALUES(hint), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO quick_drills
  (uuid, class_id, subject_id, resource_id, title, slug, description, language, difficulty, estimated_minutes, status, source_type, source_reference, created_at, updated_at)
SELECT
  REPLACE(UUID(), '-', ''),
  classes.id,
  subjects.id,
  learning_resources.id,
  'Redox Basics 5-Minute Drill',
  'redox-basics-5-minute-drill',
  'A quick check for LEO, GER, and redox agents.',
  'en',
  'beginner',
  5,
  'published',
  'CUSTOM',
  'Original Chemlab quick drill.',
  NOW(),
  NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
LEFT JOIN learning_resources ON learning_resources.slug = 'redox-transfer-kitchen'
WHERE classes.class_level = '10'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  class_id = VALUES(class_id),
  subject_id = VALUES(subject_id),
  resource_id = VALUES(resource_id),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO quiz_questions
  (drill_id, class_id, subject_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, difficulty, order_index, status, created_at, updated_at)
SELECT quick_drills.id, quick_drills.class_id, quick_drills.subject_id, 'Zinc changes from Zn to Zn2+ by losing electrons. What is this called?', 'mcq', JSON_ARRAY('Oxidation', 'Reduction', 'Neutralization'), JSON_ARRAY('Oxidation'), 'Loss of electrons is oxidation.', 'Use LEO.', 'beginner', 1, 'published', NOW(), NOW()
FROM quick_drills WHERE slug = 'redox-basics-5-minute-drill'
ON DUPLICATE KEY UPDATE options_json = VALUES(options_json), correct_answer_json = VALUES(correct_answer_json), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO quiz_questions
  (drill_id, class_id, subject_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, difficulty, order_index, status, created_at, updated_at)
SELECT quick_drills.id, quick_drills.class_id, quick_drills.subject_id, 'Copper ion gains electrons and becomes copper metal. What is this called?', 'mcq', JSON_ARRAY('Reduction', 'Oxidation', 'Evaporation'), JSON_ARRAY('Reduction'), 'Gain of electrons is reduction.', 'Use GER.', 'beginner', 2, 'published', NOW(), NOW()
FROM quick_drills WHERE slug = 'redox-basics-5-minute-drill'
ON DUPLICATE KEY UPDATE options_json = VALUES(options_json), correct_answer_json = VALUES(correct_answer_json), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO quick_drills
  (uuid, class_id, subject_id, resource_id, title, slug, description, language, difficulty, estimated_minutes, status, source_type, source_reference, created_at, updated_at)
SELECT
  REPLACE(UUID(), '-', ''),
  classes.id,
  subjects.id,
  learning_resources.id,
  'IUPAC Starter Drill',
  'iupac-starter-drill',
  'Practice roots, suffixes, branches, and lowest numbering.',
  'en',
  'beginner',
  5,
  'published',
  'CUSTOM',
  'Original Chemlab quick drill.',
  NOW(),
  NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
LEFT JOIN learning_resources ON learning_resources.slug = 'hydrocarbon-naming-quest'
WHERE classes.class_level = '11'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  class_id = VALUES(class_id),
  subject_id = VALUES(subject_id),
  resource_id = VALUES(resource_id),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO quiz_questions
  (drill_id, class_id, subject_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, difficulty, order_index, status, created_at, updated_at)
SELECT quick_drills.id, quick_drills.class_id, quick_drills.subject_id, 'A straight chain has four carbon atoms and only single bonds. Which name fits?', 'mcq', JSON_ARRAY('Butane', 'Propane', 'Butene'), JSON_ARRAY('Butane'), 'Four carbons gives But and single bonds give ane.', 'Count the carbon family line first.', 'beginner', 1, 'published', NOW(), NOW()
FROM quick_drills WHERE slug = 'iupac-starter-drill'
ON DUPLICATE KEY UPDATE options_json = VALUES(options_json), correct_answer_json = VALUES(correct_answer_json), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO quiz_questions
  (drill_id, class_id, subject_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, difficulty, order_index, status, created_at, updated_at)
SELECT quick_drills.id, quick_drills.class_id, quick_drills.subject_id, 'In 2-methylpentane, what does methyl describe?', 'mcq', JSON_ARRAY('A one-carbon branch', 'The five-carbon main chain', 'A double bond'), JSON_ARRAY('A one-carbon branch'), 'Methyl is the one-carbon side branch.', 'First name means side branch.', 'beginner', 2, 'published', NOW(), NOW()
FROM quick_drills WHERE slug = 'iupac-starter-drill'
ON DUPLICATE KEY UPDATE options_json = VALUES(options_json), correct_answer_json = VALUES(correct_answer_json), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO concept_maps
  (uuid, class_id, subject_id, title, slug, description, map_json, status, source_reference, created_at, updated_at)
SELECT
  REPLACE(UUID(), '-', ''),
  classes.id,
  subjects.id,
  'Redox Transaction Map',
  'redox-transaction-map',
  'A concept map connecting electron transfer, oxidation, reduction, and agents.',
  JSON_OBJECT('nodes', JSON_ARRAY('Electron transfer', 'Oxidation', 'Reduction', 'Reducing agent', 'Oxidizing agent'), 'edges', JSON_ARRAY(JSON_OBJECT('from', 'Electron transfer', 'to', 'Oxidation'), JSON_OBJECT('from', 'Electron transfer', 'to', 'Reduction'))),
  'published',
  'Original Chemlab concept map.',
  NOW(),
  NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
WHERE classes.class_level = '10'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  map_json = VALUES(map_json),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO mistake_patterns
  (class_id, subject_id, resource_id, mistake_key, title, description, correction, example, severity, status, created_at, updated_at)
SELECT classes.id, subjects.id, learning_resources.id, 'redox_agent_swap', 'Swapping redox agents', 'Students often think the oxidized species is the oxidizing agent.', 'The species that gets oxidized is the reducing agent because it helps another species gain electrons.', 'Zinc is oxidized and acts as the reducing agent in Zn + Cu2+.', 'high', 'published', NOW(), NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
LEFT JOIN learning_resources ON learning_resources.slug = 'redox-transfer-kitchen'
WHERE classes.class_level = '10'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  correction = VALUES(correction),
  example = VALUES(example),
  severity = VALUES(severity),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO mistake_patterns
  (class_id, subject_id, resource_id, mistake_key, title, description, correction, example, severity, status, created_at, updated_at)
SELECT classes.id, subjects.id, learning_resources.id, 'iupac_short_chain_trap', 'Choosing a branch as the main chain', 'Students may follow a tempting side branch and miss the longest chain.', 'Trace the longest continuous carbon chain first, then name the branches.', 'In 2-methylpentane, the five-carbon chain is the parent chain and the extra carbon is methyl.', 'medium', 'published', NOW(), NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
LEFT JOIN learning_resources ON learning_resources.slug = 'hydrocarbon-naming-quest'
WHERE classes.class_level = '11'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  correction = VALUES(correction),
  example = VALUES(example),
  severity = VALUES(severity),
  status = VALUES(status),
  updated_at = NOW();
