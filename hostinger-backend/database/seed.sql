-- Chemlab public_html seed.sql
-- Import this after schema.sql. Admin is created by install.php.


-- Source: 001_classes_subjects.sql
INSERT INTO classes (class_level, display_name, status, created_at, updated_at)
VALUES
  ('9', 'Class 9', 'active', NOW(), NOW()),
  ('10', 'Class 10', 'active', NOW(), NOW()),
  ('11', 'Class 11', 'active', NOW(), NOW()),
  ('12', 'Class 12', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), status = VALUES(status), updated_at = NOW();

INSERT INTO subjects (class_id, name, subject_type, status, created_at, updated_at)
SELECT id, 'Science', 'science', 'active', NOW(), NOW() FROM classes WHERE class_level IN ('9','10')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status), updated_at = NOW();

INSERT INTO subjects (class_id, name, subject_type, status, created_at, updated_at)
SELECT id, 'Chemistry', 'chemistry', 'active', NOW(), NOW() FROM classes WHERE class_level IN ('11','12')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status), updated_at = NOW();

-- Source: 002_site_settings.sql
INSERT INTO site_settings (setting_key, setting_value, type, is_public, created_at, updated_at)
VALUES
  ('site_name', 'Chemlab', 'string', 1, NOW(), NOW()),
  ('ai_name', 'Chem-Shastri', 'string', 1, NOW(), NOW()),
  ('default_language', 'en', 'string', 1, NOW(), NOW()),
  ('signup_enabled', 'true', 'boolean', 1, NOW(), NOW()),
  ('teacher_signup_enabled', 'true', 'boolean', 1, NOW(), NOW()),
  ('ai_daily_budget_inr', '50', 'number', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  type = VALUES(type),
  is_public = VALUES(is_public),
  updated_at = NOW();

-- Source: 003_email_templates.sql
INSERT INTO email_templates (template_key, subject, body_html, body_text, language, status, created_at, updated_at)
VALUES
  ('verify_email', 'Verify your Chemlab email', '<h1>Your Chemlab code</h1><p>Hello {{name}}, use this verification code: <strong>{{code}}</strong>. It expires in 15 minutes.</p>', 'Your Chemlab verification code is {{code}}.', 'en', 'active', NOW(), NOW()),
  ('welcome_student', 'Welcome to Chemlab', '<h1>Welcome, {{name}}</h1><p>Your chemistry quests and simulations are ready.</p>', 'Welcome to Chemlab, {{name}}.', 'en', 'active', NOW(), NOW()),
  ('welcome_teacher', 'Welcome to Chemlab for Teachers', '<h1>Welcome, {{name}}</h1><p>Your teacher account foundation is ready.</p>', 'Welcome to Chemlab for Teachers, {{name}}.', 'en', 'active', NOW(), NOW()),
  ('password_reset', 'Reset your Chemlab password', '<h1>Password reset</h1><p>Use this reset token: <strong>{{reset_code}}</strong>. It expires in 30 minutes.</p>', 'Use this reset token: {{reset_code}}.', 'en', 'active', NOW(), NOW()),
  ('admin_new_signup', 'New Chemlab signup', '<p>{{name}} ({{email}}) signed up as {{role}}.</p>', '{{name}} ({{email}}) signed up as {{role}}.', 'en', 'active', NOW(), NOW()),
  ('test_email', 'Chemlab SMTP test', '<p>{{message}}</p>', '{{message}}', 'en', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  subject = VALUES(subject),
  body_html = VALUES(body_html),
  body_text = VALUES(body_text),
  status = VALUES(status),
  updated_at = NOW();

-- Source: 004_simulation_resources.sql
INSERT INTO learning_resources
  (uuid, class_id, subject_id, type, title, slug, description, route_url, source_type, source_reference, status, published_at, created_at, updated_at)
SELECT
  REPLACE(UUID(), '-', ''),
  classes.id,
  subjects.id,
  'simulation',
  'Redox Transfer Kitchen',
  'redox-transfer-kitchen',
  'Learn oxidation and reduction through Paati’s murukku story and an electron-transfer game.',
  '/labs/redox-transfer-kitchen',
  'SIMULATION',
  'Original Chemlab simulation. Supports Class 10 redox learning.',
  'published',
  NOW(),
  NOW(),
  NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
WHERE classes.class_level = '10'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  route_url = VALUES(route_url),
  class_id = VALUES(class_id),
  subject_id = VALUES(subject_id),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO learning_resources
  (uuid, class_id, subject_id, type, title, slug, description, route_url, source_type, source_reference, status, published_at, created_at, updated_at)
SELECT
  REPLACE(UUID(), '-', ''),
  classes.id,
  subjects.id,
  'simulation',
  'Electrochemistry Power Grid Studio',
  'electrochemistry-power-grid',
  'Build a Daniell cell, watch electrons flow, and control voltage with the Nernst equation.',
  '/labs/electrochemistry-power-grid',
  'SIMULATION',
  'Original Chemlab simulation. Supports Class 12 Electrochemistry: galvanic cells, Daniell cell, and Nernst equation.',
  'published',
  NOW(),
  NOW(),
  NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
WHERE classes.class_level = '12'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  route_url = VALUES(route_url),
  class_id = VALUES(class_id),
  subject_id = VALUES(subject_id),
  source_reference = VALUES(source_reference),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO learning_resources
  (uuid, class_id, subject_id, type, title, slug, description, route_url, source_type, source_reference, status, published_at, created_at, updated_at)
SELECT
  REPLACE(UUID(), '-', ''),
  classes.id,
  subjects.id,
  'simulation',
  'Hydrocarbon Naming Quest',
  'hydrocarbon-naming-quest',
  'Learn IUPAC naming through an interactive carbon-chain naming game.',
  '/labs/hydrocarbon-naming-quest',
  'SIMULATION',
  'Original Chemlab simulation. Supports Class 11 hydrocarbon nomenclature learning.',
  'published',
  NOW(),
  NOW(),
  NOW()
FROM classes
JOIN subjects ON subjects.class_id = classes.id
WHERE classes.class_level = '11'
LIMIT 1
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  route_url = VALUES(route_url),
  class_id = VALUES(class_id),
  subject_id = VALUES(subject_id),
  status = VALUES(status),
  updated_at = NOW();

-- Source: 006_stage_3_learning_tools.sql
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

-- Source: 007_stage_6_ncert_skeleton.sql
-- Stage 6 editable NCERT structure placeholders.
-- These are draft scaffolds only. Verify current syllabus mapping before publishing.

INSERT INTO books (class_id, subject_id, title, source, language, status, created_at, updated_at)
SELECT c.id, s.id, 'NCERT Science', 'NCERT', 'en', 'draft', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
WHERE c.class_level IN ('9', '10')
  AND NOT EXISTS (
    SELECT 1 FROM books b
    WHERE b.class_id = c.id AND b.subject_id = s.id AND b.title = 'NCERT Science' AND b.language = 'en'
  );

INSERT INTO books (class_id, subject_id, title, source, language, status, created_at, updated_at)
SELECT c.id, s.id, 'NCERT Chemistry Part 1', 'NCERT', 'en', 'draft', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
WHERE c.class_level IN ('11', '12')
  AND NOT EXISTS (
    SELECT 1 FROM books b
    WHERE b.class_id = c.id AND b.subject_id = s.id AND b.title = 'NCERT Chemistry Part 1' AND b.language = 'en'
  );

INSERT INTO books (class_id, subject_id, title, source, language, status, created_at, updated_at)
SELECT c.id, s.id, 'NCERT Chemistry Part 2', 'NCERT', 'en', 'draft', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
WHERE c.class_level IN ('11', '12')
  AND NOT EXISTS (
    SELECT 1 FROM books b
    WHERE b.class_id = c.id AND b.subject_id = s.id AND b.title = 'NCERT Chemistry Part 2' AND b.language = 'en'
  );

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, 1, 'Matter in Our Surroundings', 'matter-in-our-surroundings', 'draft', NOW(), NOW()
FROM classes c JOIN subjects s ON s.class_id = c.id JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Science'
WHERE c.class_level = '9' LIMIT 1
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, 2, 'Is Matter Around Us Pure', 'is-matter-around-us-pure', 'draft', NOW(), NOW()
FROM classes c JOIN subjects s ON s.class_id = c.id JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Science'
WHERE c.class_level = '9' LIMIT 1
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, 3, 'Atoms and Molecules', 'atoms-and-molecules', 'draft', NOW(), NOW()
FROM classes c JOIN subjects s ON s.class_id = c.id JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Science'
WHERE c.class_level = '9' LIMIT 1
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, 4, 'Structure of the Atom', 'structure-of-the-atom', 'draft', NOW(), NOW()
FROM classes c JOIN subjects s ON s.class_id = c.id JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Science'
WHERE c.class_level = '9' LIMIT 1
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, 1, 'Chemical Reactions and Equations', 'chemical-reactions-and-equations', 'draft', NOW(), NOW()
FROM classes c JOIN subjects s ON s.class_id = c.id JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Science'
WHERE c.class_level = '10' LIMIT 1
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, 2, 'Acids, Bases and Salts', 'acids-bases-and-salts', 'draft', NOW(), NOW()
FROM classes c JOIN subjects s ON s.class_id = c.id JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Science'
WHERE c.class_level = '10' LIMIT 1
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, 3, 'Metals and Non-metals', 'metals-and-non-metals', 'draft', NOW(), NOW()
FROM classes c JOIN subjects s ON s.class_id = c.id JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Science'
WHERE c.class_level = '10' LIMIT 1
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, 4, 'Carbon and Its Compounds', 'carbon-and-its-compounds', 'draft', NOW(), NOW()
FROM classes c JOIN subjects s ON s.class_id = c.id JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Science'
WHERE c.class_level = '10' LIMIT 1
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, 5, 'Periodic Classification and Periodic Trends', 'periodic-classification-and-periodic-trends', 'draft', NOW(), NOW()
FROM classes c JOIN subjects s ON s.class_id = c.id JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Science'
WHERE c.class_level = '10' LIMIT 1
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, chapters_to_seed.chapter_number, chapters_to_seed.title, chapters_to_seed.slug, 'draft', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Chemistry Part 1'
JOIN (
  SELECT '11' AS class_level, 1 AS chapter_number, 'Some Basic Concepts of Chemistry' AS title, 'some-basic-concepts-of-chemistry' AS slug
  UNION ALL SELECT '11', 2, 'Structure of Atom', 'structure-of-atom'
  UNION ALL SELECT '11', 3, 'Classification of Elements and Periodicity', 'classification-of-elements-and-periodicity'
  UNION ALL SELECT '11', 4, 'Chemical Bonding and Molecular Structure', 'chemical-bonding-and-molecular-structure'
  UNION ALL SELECT '11', 5, 'Thermodynamics', 'thermodynamics'
  UNION ALL SELECT '11', 6, 'Equilibrium', 'equilibrium'
  UNION ALL SELECT '11', 7, 'Redox Reactions', 'redox-reactions'
) chapters_to_seed ON chapters_to_seed.class_level = c.class_level
WHERE c.class_level = '11'
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, chapters_to_seed.chapter_number, chapters_to_seed.title, chapters_to_seed.slug, 'draft', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
JOIN books b ON b.class_id = c.id AND b.title = 'NCERT Chemistry Part 2'
JOIN (
  SELECT '11' AS class_level, 8 AS chapter_number, 'Organic Chemistry: Some Basic Principles and Techniques' AS title, 'organic-chemistry-some-basic-principles-and-techniques' AS slug
  UNION ALL SELECT '11', 9, 'Hydrocarbons', 'hydrocarbons'
) chapters_to_seed ON chapters_to_seed.class_level = c.class_level
WHERE c.class_level = '11'
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO chapters (book_id, class_id, subject_id, chapter_number, title, slug, status, created_at, updated_at)
SELECT b.id, c.id, s.id, chapters_to_seed.chapter_number, chapters_to_seed.title, chapters_to_seed.slug, 'draft', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
JOIN (
  SELECT '12' AS class_level, 1 AS chapter_number, 'Solutions' AS title, 'solutions' AS slug
  UNION ALL SELECT '12', 2, 'Electrochemistry', 'electrochemistry'
  UNION ALL SELECT '12', 3, 'Chemical Kinetics', 'chemical-kinetics'
  UNION ALL SELECT '12', 4, 'Coordination Compounds', 'coordination-compounds'
  UNION ALL SELECT '12', 5, 'Haloalkanes and Haloarenes', 'haloalkanes-and-haloarenes'
  UNION ALL SELECT '12', 6, 'Alcohols, Phenols and Ethers', 'alcohols-phenols-and-ethers'
  UNION ALL SELECT '12', 7, 'Aldehydes, Ketones and Carboxylic Acids', 'aldehydes-ketones-and-carboxylic-acids'
  UNION ALL SELECT '12', 8, 'Amines', 'amines'
  UNION ALL SELECT '12', 9, 'Biomolecules', 'biomolecules'
) chapters_to_seed ON chapters_to_seed.class_level = c.class_level
JOIN books b ON b.class_id = c.id AND b.title = IF(chapters_to_seed.chapter_number <= 4, 'NCERT Chemistry Part 1', 'NCERT Chemistry Part 2')
WHERE c.class_level = '12'
ON DUPLICATE KEY UPDATE title = VALUES(title), book_id = VALUES(book_id), subject_id = VALUES(subject_id), status = IF(chapters.status = 'published', chapters.status, VALUES(status)), updated_at = NOW();

INSERT INTO topics (chapter_id, class_id, subject_id, title, slug, order_index, difficulty, status, created_at, updated_at)
SELECT ch.id, ch.class_id, ch.subject_id, topics_to_seed.topic_title, topics_to_seed.topic_slug, topics_to_seed.topic_order, 'beginner', 'draft', NOW(), NOW()
FROM chapters ch
JOIN classes c ON c.id = ch.class_id
JOIN (
  SELECT 'chemical-reactions-and-equations' AS chapter_slug, 1 AS topic_order, 'Chemical equations' AS topic_title, 'chemical-equations' AS topic_slug
  UNION ALL SELECT 'chemical-reactions-and-equations', 2, 'Types of reactions', 'types-of-reactions'
  UNION ALL SELECT 'chemical-reactions-and-equations', 3, 'Oxidation and reduction', 'oxidation-and-reduction'
  UNION ALL SELECT 'chemical-reactions-and-equations', 4, 'Redox reactions', 'redox-reactions'
  UNION ALL SELECT 'hydrocarbons', 1, 'IUPAC nomenclature', 'iupac-nomenclature'
  UNION ALL SELECT 'hydrocarbons', 2, 'Alkanes', 'alkanes'
  UNION ALL SELECT 'hydrocarbons', 3, 'Alkenes', 'alkenes'
  UNION ALL SELECT 'hydrocarbons', 4, 'Alkynes', 'alkynes'
) topics_to_seed ON topics_to_seed.chapter_slug = ch.slug
ON DUPLICATE KEY UPDATE title = VALUES(title), order_index = VALUES(order_index), difficulty = VALUES(difficulty), status = IF(topics.status = 'published', topics.status, VALUES(status)), updated_at = NOW();

INSERT INTO topics (chapter_id, class_id, subject_id, title, slug, order_index, difficulty, status, created_at, updated_at)
SELECT ch.id, ch.class_id, ch.subject_id, 'Overview', 'overview', 1, 'beginner', 'draft', NOW(), NOW()
FROM chapters ch
LEFT JOIN topics existing ON existing.chapter_id = ch.id AND existing.slug = 'overview'
WHERE existing.id IS NULL
  AND ch.status IN ('draft', 'published')
  AND ch.slug NOT IN ('chemical-reactions-and-equations', 'hydrocarbons');

UPDATE learning_resources lr
JOIN classes c ON c.class_level = '10'
JOIN subjects s ON s.class_id = c.id
JOIN chapters ch ON ch.class_id = c.id AND ch.slug = 'chemical-reactions-and-equations'
JOIN topics t ON t.chapter_id = ch.id AND t.slug = 'oxidation-and-reduction'
SET lr.class_id = c.id,
    lr.subject_id = s.id,
    lr.chapter_id = ch.id,
    lr.topic_id = t.id,
    lr.source_reference = 'Original Chemlab simulation mapped to NCERT structure placeholder. Verify before publishing.',
    lr.updated_at = NOW()
WHERE lr.slug = 'redox-transfer-kitchen';

UPDATE learning_resources lr
JOIN classes c ON c.class_level = '11'
JOIN subjects s ON s.class_id = c.id
JOIN chapters ch ON ch.class_id = c.id AND ch.slug = 'hydrocarbons'
JOIN topics t ON t.chapter_id = ch.id AND t.slug = 'iupac-nomenclature'
SET lr.class_id = c.id,
    lr.subject_id = s.id,
    lr.chapter_id = ch.id,
    lr.topic_id = t.id,
    lr.source_reference = 'Original Chemlab simulation mapped to NCERT structure placeholder. Verify before publishing.',
    lr.updated_at = NOW()
WHERE lr.slug = 'hydrocarbon-naming-quest';

INSERT INTO site_settings (setting_key, setting_value, type, is_public, created_at, updated_at)
VALUES
  ('ncert_skeleton_note', 'NCERT structure placeholders are editable drafts. Verify current syllabus mapping before publishing.', 'string', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW();

-- Source: 008_stage_7_quiz_memory_resource_content.sql
-- Chemlab Stage 7 starter quiz, memory, and resource curation content.

INSERT INTO memory_decks
  (uuid, class_id, subject_id, chapter_id, topic_id, title, slug, description, language, difficulty, status, source_type, source_reference, created_at, updated_at)
SELECT 'stage7-deck-class9-atoms', c.id, s.id, ch.id, t.id,
  'Class 9 Atoms and Molecules Starter Deck',
  'class-9-atoms-molecules-starter',
  'Core cards for atoms, molecules, ions, formulae, and conservation of mass.',
  'en', 'beginner', 'published', 'CUSTOM', 'Chemlab original, NCERT-aligned. Verify before final publishing.', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
LEFT JOIN chapters ch ON ch.class_id = c.id AND ch.slug = 'atoms-and-molecules'
LEFT JOIN topics t ON t.chapter_id = ch.id AND t.slug = 'overview'
WHERE c.class_level = '9'
LIMIT 1
ON DUPLICATE KEY UPDATE description = VALUES(description), status = VALUES(status), updated_at = NOW();

INSERT INTO memory_decks
  (uuid, class_id, subject_id, chapter_id, topic_id, title, slug, description, language, difficulty, status, source_type, source_reference, created_at, updated_at)
SELECT 'stage7-deck-class12-electrochemistry', c.id, s.id, ch.id, t.id,
  'Class 12 Electrochemistry Starter Deck',
  'class-12-electrochemistry-starter',
  'Core cards for Daniell cell, electrodes, electron flow, and cell notation.',
  'en', 'intermediate', 'published', 'CUSTOM', 'Chemlab original, NCERT-aligned. Verify before final publishing.', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
LEFT JOIN chapters ch ON ch.class_id = c.id AND ch.slug = 'electrochemistry'
LEFT JOIN topics t ON t.chapter_id = ch.id AND t.slug = 'overview'
WHERE c.class_level = '12'
LIMIT 1
ON DUPLICATE KEY UPDATE description = VALUES(description), status = VALUES(status), updated_at = NOW();

INSERT INTO quick_drills
  (uuid, class_id, subject_id, chapter_id, topic_id, title, slug, description, language, difficulty, estimated_minutes, status, source_type, source_reference, created_at, updated_at)
SELECT 'stage7-drill-class9-atoms', c.id, s.id, ch.id, t.id,
  'Class 9 Atoms and Molecules Starter Drill',
  'class-9-atoms-molecules-starter-drill',
  'Ten quick checks on atoms, molecules, ions, and formula basics.',
  'en', 'beginner', 6, 'published', 'CUSTOM', 'Chemlab original, NCERT-aligned. Verify before final publishing.', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
LEFT JOIN chapters ch ON ch.class_id = c.id AND ch.slug = 'atoms-and-molecules'
LEFT JOIN topics t ON t.chapter_id = ch.id AND t.slug = 'overview'
WHERE c.class_level = '9'
LIMIT 1
ON DUPLICATE KEY UPDATE description = VALUES(description), status = VALUES(status), updated_at = NOW();

INSERT INTO quick_drills
  (uuid, class_id, subject_id, chapter_id, topic_id, title, slug, description, language, difficulty, estimated_minutes, status, source_type, source_reference, created_at, updated_at)
SELECT 'stage7-drill-class12-electrochemistry', c.id, s.id, ch.id, t.id,
  'Class 12 Electrochemistry Starter Drill',
  'class-12-electrochemistry-starter-drill',
  'Ten quick checks on galvanic cells, electrodes, voltage, and cell notation.',
  'en', 'intermediate', 7, 'published', 'CUSTOM', 'Chemlab original, NCERT-aligned. Verify before final publishing.', NOW(), NOW()
FROM classes c
JOIN subjects s ON s.class_id = c.id
LEFT JOIN chapters ch ON ch.class_id = c.id AND ch.slug = 'electrochemistry'
LEFT JOIN topics t ON t.chapter_id = ch.id AND t.slug = 'overview'
WHERE c.class_level = '12'
LIMIT 1
ON DUPLICATE KEY UPDATE description = VALUES(description), status = VALUES(status), updated_at = NOW();

INSERT INTO memory_cards (deck_id, front, back, hint, explanation, difficulty, card_type, mistake_type, source_reference, order_index, status, created_at, updated_at)
SELECT d.id, seed.front, seed.back, seed.hint, seed.explanation, seed.difficulty, seed.card_type, seed.mistake_type,
  'Chemlab original, NCERT-aligned. Verify before final publishing.', seed.order_index, 'published', NOW(), NOW()
FROM memory_decks d
JOIN (
  SELECT 'redox-leo-ger-memory' AS deck_slug, 1 AS order_index, 'What does LEO mean?' AS front, 'Loss of Electrons is Oxidation.' AS back, 'Look for the species giving electrons.' AS hint, 'Oxidation is identified by electron loss, not by oxygen only.' AS explanation, 'beginner' AS difficulty, 'definition' AS card_type, 'oxidation_vs_reduction' AS mistake_type
  UNION ALL SELECT 'redox-leo-ger-memory', 2, 'What does GER mean?', 'Gain of Electrons is Reduction.', 'Look for the species receiving electrons.', 'Reduction is identified by electron gain.', 'beginner', 'definition', 'oxidation_vs_reduction'
  UNION ALL SELECT 'redox-leo-ger-memory', 3, 'In Zn + Cu2+ to Zn2+ + Cu, who loses electrons?', 'Zinc loses electrons.', 'Zinc changes from neutral Zn to Zn2+.', 'Losing electrons makes zinc oxidized.', 'beginner', 'concept', 'oxidation_vs_reduction'
  UNION ALL SELECT 'redox-leo-ger-memory', 4, 'In Zn + Cu2+ to Zn2+ + Cu, who gains electrons?', 'Copper ion gains electrons.', 'Cu2+ becomes Cu.', 'Gain of electrons makes copper ion reduced.', 'beginner', 'concept', 'oxidation_vs_reduction'
  UNION ALL SELECT 'redox-leo-ger-memory', 5, 'Who is the reducing agent here?', 'Zinc is the reducing agent.', 'The reducing agent gets oxidized.', 'Zinc gives electrons and causes Cu2+ to reduce.', 'intermediate', 'application', 'reducing_agent'
  UNION ALL SELECT 'redox-leo-ger-memory', 6, 'Who is the oxidizing agent here?', 'Copper ion is the oxidizing agent.', 'The oxidizing agent gets reduced.', 'Cu2+ accepts electrons and causes zinc oxidation.', 'intermediate', 'application', 'oxidizing_agent'
  UNION ALL SELECT 'redox-leo-ger-memory', 7, 'What is a spectator ion?', 'An ion that appears unchanged on both sides.', 'It watches the main reaction.', 'Sulphate can be spectator in the zinc copper sulphate reaction.', 'beginner', 'definition', 'spectator_ion'
  UNION ALL SELECT 'redox-leo-ger-memory', 8, 'Why do oxidation and reduction happen together?', 'Electrons cannot be lost unless another species receives them.', 'Think of one transaction.', 'Redox is one electron transfer with a giver and receiver.', 'beginner', 'concept', 'redox_transaction'
  UNION ALL SELECT 'redox-leo-ger-memory', 9, 'What is the net ionic redox reaction?', 'Zn + Cu2+ gives Zn2+ + Cu.', 'Remove spectator ions.', 'The net ionic equation shows only reacting species.', 'intermediate', 'formula', 'spectator_ion'
  UNION ALL SELECT 'redox-leo-ger-memory', 10, 'Does oxidation always mean adding oxygen?', 'No. At school level, use electron loss for redox.', 'Use LEO first.', 'Oxygen examples exist, but electron transfer is the clearer rule here.', 'beginner', 'mistake', 'oxidation_vs_reduction'
  UNION ALL SELECT 'redox-leo-ger-memory', 11, 'If a species becomes more positive, what likely happened?', 'It lost electrons.', 'Negative electrons left.', 'Losing negative charge increases positive charge.', 'intermediate', 'concept', 'charge_change'
  UNION ALL SELECT 'redox-leo-ger-memory', 12, 'If a species becomes neutral from 2+, what happened?', 'It gained electrons.', 'Positive charge decreased.', 'Cu2+ plus two electrons becomes Cu.', 'intermediate', 'concept', 'charge_change'
  UNION ALL SELECT 'redox-leo-ger-memory', 13, 'What does Zn to Zn2+ + 2e- show?', 'Oxidation half reaction.', 'Electrons appear on product side.', 'Electrons produced means the species lost them.', 'intermediate', 'formula', 'half_reaction'
  UNION ALL SELECT 'redox-leo-ger-memory', 14, 'What does Cu2+ + 2e- to Cu show?', 'Reduction half reaction.', 'Electrons are reactants.', 'Electrons consumed means the ion gained them.', 'intermediate', 'formula', 'half_reaction'
  UNION ALL SELECT 'redox-leo-ger-memory', 15, 'What phrase summarizes redox?', 'One gives, one receives.', 'Think transaction.', 'The same electron transfer creates oxidation and reduction.', 'beginner', 'concept', 'redox_transaction'
  UNION ALL SELECT 'iupac-starter-memory', 1, 'What root means one carbon?', 'Meth.', 'Methane has one carbon.', 'Root words count the main chain carbons.', 'beginner', 'definition', 'root_word'
  UNION ALL SELECT 'iupac-starter-memory', 2, 'What root means two carbons?', 'Eth.', 'Ethane has two carbons.', 'The root word changes with chain length.', 'beginner', 'definition', 'root_word'
  UNION ALL SELECT 'iupac-starter-memory', 3, 'What root means three carbons?', 'Prop.', 'Propane has three carbons.', 'Meth, eth, prop, but, pent.', 'beginner', 'definition', 'root_word'
  UNION ALL SELECT 'iupac-starter-memory', 4, 'What root means four carbons?', 'But.', 'Butane has four carbons.', 'Four carbon main chain uses but.', 'beginner', 'definition', 'root_word'
  UNION ALL SELECT 'iupac-starter-memory', 5, 'What root means five carbons?', 'Pent.', 'Pentane has five carbons.', 'Pent means five in the main chain.', 'beginner', 'definition', 'root_word'
  UNION ALL SELECT 'iupac-starter-memory', 6, 'What suffix means only single bonds?', 'ane.', 'Alkanes use ane.', 'Single bond family has surname ane.', 'beginner', 'definition', 'suffix'
  UNION ALL SELECT 'iupac-starter-memory', 7, 'What suffix means a double bond?', 'ene.', 'Alkenes use ene.', 'Double bond family has surname ene.', 'beginner', 'definition', 'suffix'
  UNION ALL SELECT 'iupac-starter-memory', 8, 'What suffix means a triple bond?', 'yne.', 'Alkynes use yne.', 'Triple bond family has surname yne.', 'beginner', 'definition', 'suffix'
  UNION ALL SELECT 'iupac-starter-memory', 9, 'What is a methyl branch?', 'A one carbon side branch.', 'CH3 hanging from main chain.', 'Methyl is not counted as root if it is not in the longest chain.', 'beginner', 'concept', 'substituent'
  UNION ALL SELECT 'iupac-starter-memory', 10, 'What is the main chain rule?', 'Choose the longest continuous carbon chain.', 'Avoid short cuts through branches.', 'The root word comes from the longest main chain.', 'beginner', 'concept', 'longest_chain'
  UNION ALL SELECT 'iupac-starter-memory', 11, 'Why number from one end instead of the other?', 'Give branches or multiple bonds the lowest possible number.', 'Lowest locant wins.', 'Numbering is chosen to reduce the first important position number.', 'intermediate', 'concept', 'numbering_direction'
  UNION ALL SELECT 'iupac-starter-memory', 12, 'In 2-methylpentane, what is pent?', 'The five carbon main chain.', 'Middle name.', 'The branch is methyl, but the root is pent.', 'beginner', 'application', 'root_word'
  UNION ALL SELECT 'iupac-starter-memory', 13, 'In 2-methylpentane, what does 2 mean?', 'The methyl branch is on carbon 2.', 'Rank of the cousin.', 'Locants tell exact position.', 'beginner', 'application', 'locants'
  UNION ALL SELECT 'iupac-starter-memory', 14, 'In but-1-ene, what does 1 mean?', 'The double bond starts at carbon 1.', 'VIP seat number.', 'Multiple bond locant is written before ene.', 'intermediate', 'application', 'double_bond_priority'
  UNION ALL SELECT 'iupac-starter-memory', 15, 'Which gets priority in numbering: branch or double bond?', 'The double bond gets priority for lowest number.', 'VIP guest.', 'For simple alkenes, number to give double bond the lowest locant.', 'intermediate', 'mistake', 'double_bond_priority'
  UNION ALL SELECT 'iupac-starter-memory', 16, 'What is wrong with 4-methylpentane if 2-methylpentane is possible?', 'The branch did not get the lowest number.', 'Count from the closer end.', 'Numbering must minimize locants.', 'intermediate', 'mistake', 'numbering_direction'
  UNION ALL SELECT 'iupac-starter-memory', 17, 'What comes first in the name: branch or root?', 'Branch prefix comes before root.', 'First name before middle name.', 'Example: methyl plus pentane gives methylpentane with locant.', 'beginner', 'concept', 'name_order'
  UNION ALL SELECT 'iupac-starter-memory', 18, 'Why not name a branch as the main chain?', 'The main chain should be the longest continuous chain.', 'Branches distract.', 'Wrong chain selection changes the root word.', 'intermediate', 'mistake', 'longest_chain'
  UNION ALL SELECT 'iupac-starter-memory', 19, 'What does dimethyl mean?', 'Two methyl branches.', 'Di means two.', 'Use di when the same substituent appears twice.', 'intermediate', 'definition', 'substituent'
  UNION ALL SELECT 'iupac-starter-memory', 20, 'IUPAC name analogy in Chemlab?', 'First name is branch, middle name is root, surname is bond type.', 'Indian full name analogy.', 'This makes name assembly predictable.', 'beginner', 'concept', 'name_order'
  UNION ALL SELECT 'class-9-atoms-molecules-starter', 1, 'What is an atom?', 'The smallest unit of an element that keeps its chemical identity.', 'Elements are made of atoms.', 'Atoms combine to form molecules and compounds.', 'beginner', 'definition', NULL
  UNION ALL SELECT 'class-9-atoms-molecules-starter', 2, 'What is a molecule?', 'A group of atoms chemically bonded together.', 'Think H2 or H2O.', 'Molecules may contain same or different elements.', 'beginner', 'definition', NULL
  UNION ALL SELECT 'class-9-atoms-molecules-starter', 3, 'What does a chemical formula show?', 'The elements and atom counts in a substance.', 'Read the symbols and subscripts.', 'H2O has two hydrogen atoms and one oxygen atom.', 'beginner', 'formula', NULL
  UNION ALL SELECT 'class-12-electrochemistry-starter', 1, 'What is a galvanic cell?', 'A cell that produces electricity from a spontaneous redox reaction.', 'Reaction makes voltage.', 'Daniell cell is a classic example.', 'intermediate', 'definition', NULL
  UNION ALL SELECT 'class-12-electrochemistry-starter', 2, 'In Daniell cell, which electrode is anode?', 'Zinc electrode.', 'Oxidation happens there.', 'Zinc loses electrons at the anode.', 'intermediate', 'application', 'anode_cathode'
  UNION ALL SELECT 'class-12-electrochemistry-starter', 3, 'In Daniell cell, which electrode is cathode?', 'Copper electrode.', 'Reduction happens there.', 'Copper ions gain electrons at the cathode.', 'intermediate', 'application', 'anode_cathode'
) seed ON seed.deck_slug = d.slug
ON DUPLICATE KEY UPDATE
  back = VALUES(back),
  hint = VALUES(hint),
  explanation = VALUES(explanation),
  difficulty = VALUES(difficulty),
  card_type = VALUES(card_type),
  mistake_type = VALUES(mistake_type),
  source_reference = VALUES(source_reference),
  order_index = VALUES(order_index),
  status = VALUES(status),
  updated_at = NOW();

INSERT INTO quiz_questions
  (drill_id, class_id, subject_id, chapter_id, topic_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, difficulty, mistake_type, source_reference, order_index, status, created_at, updated_at)
SELECT qd.id, qd.class_id, qd.subject_id, qd.chapter_id, qd.topic_id, seed.question_text, 'mcq',
  seed.options_json, seed.correct_answer_json, seed.explanation, seed.hint, seed.difficulty, seed.mistake_type,
  'Chemlab original, NCERT-aligned. Verify before final publishing.', seed.order_index, 'published', NOW(), NOW()
FROM quick_drills qd
JOIN (
  SELECT 'redox-basics-5-minute-drill' AS drill_slug, 1 AS order_index, 'Which phrase defines oxidation?' AS question_text, JSON_ARRAY('Loss of electrons','Gain of electrons','No electron change') AS options_json, JSON_ARRAY('Loss of electrons') AS correct_answer_json, 'Oxidation means loss of electrons.' AS explanation, 'Use LEO.' AS hint, 'beginner' AS difficulty, 'oxidation_vs_reduction' AS mistake_type
  UNION ALL SELECT 'redox-basics-5-minute-drill', 2, 'Which phrase defines reduction?', JSON_ARRAY('Gain of electrons','Loss of electrons','Only adding oxygen'), JSON_ARRAY('Gain of electrons'), 'Reduction means gain of electrons.', 'Use GER.', 'beginner', 'oxidation_vs_reduction'
  UNION ALL SELECT 'redox-basics-5-minute-drill', 3, 'In Zn + Cu2+ to Zn2+ + Cu, zinc is:', JSON_ARRAY('oxidized','reduced','spectator'), JSON_ARRAY('oxidized'), 'Zinc loses electrons and becomes Zn2+.', 'Track charge.', 'beginner', 'oxidation_vs_reduction'
  UNION ALL SELECT 'redox-basics-5-minute-drill', 4, 'In Zn + Cu2+ to Zn2+ + Cu, copper ion is:', JSON_ARRAY('reduced','oxidized','spectator'), JSON_ARRAY('reduced'), 'Cu2+ gains electrons and becomes Cu.', 'Track electrons.', 'beginner', 'oxidation_vs_reduction'
  UNION ALL SELECT 'redox-basics-5-minute-drill', 5, 'The reducing agent in this reaction is:', JSON_ARRAY('Zinc','Copper ion','Sulphate'), JSON_ARRAY('Zinc'), 'Zinc causes copper ion to be reduced.', 'The reducing agent gets oxidized.', 'intermediate', 'reducing_agent'
  UNION ALL SELECT 'redox-basics-5-minute-drill', 6, 'The oxidizing agent in this reaction is:', JSON_ARRAY('Copper ion','Zinc','Water'), JSON_ARRAY('Copper ion'), 'Copper ion causes zinc to be oxidized.', 'The oxidizing agent gets reduced.', 'intermediate', 'oxidizing_agent'
  UNION ALL SELECT 'redox-basics-5-minute-drill', 7, 'SO4 2- is called spectator when it:', JSON_ARRAY('appears unchanged on both sides','loses electrons','becomes copper'), JSON_ARRAY('appears unchanged on both sides'), 'Spectator ions do not take part in the net ionic reaction.', 'Look for unchanged ions.', 'beginner', 'spectator_ion'
  UNION ALL SELECT 'redox-basics-5-minute-drill', 8, 'Why must redox happen together?', JSON_ARRAY('Electrons lost by one species are gained by another','Atoms disappear','Water is always formed'), JSON_ARRAY('Electrons lost by one species are gained by another'), 'Redox is one transfer transaction.', 'One gives, one receives.', 'beginner', 'redox_transaction'
  UNION ALL SELECT 'redox-basics-5-minute-drill', 9, 'Which is the oxidation half reaction?', JSON_ARRAY('Zn to Zn2+ + 2e-','Cu2+ + 2e- to Cu','SO4 2- to SO4 2-'), JSON_ARRAY('Zn to Zn2+ + 2e-'), 'Electrons are produced when zinc is oxidized.', 'Electrons on product side.', 'intermediate', 'half_reaction'
  UNION ALL SELECT 'redox-basics-5-minute-drill', 10, 'Which is the reduction half reaction?', JSON_ARRAY('Cu2+ + 2e- to Cu','Zn to Zn2+ + 2e-','NaCl to Na+ + Cl-'), JSON_ARRAY('Cu2+ + 2e- to Cu'), 'Electrons are consumed when copper ion is reduced.', 'Electrons on reactant side.', 'intermediate', 'half_reaction'
  UNION ALL SELECT 'iupac-starter-drill', 1, 'A one carbon main chain uses which root?', JSON_ARRAY('Meth','Eth','Prop'), JSON_ARRAY('Meth'), 'Meth is the root for one carbon.', 'Methane.', 'beginner', 'root_word'
  UNION ALL SELECT 'iupac-starter-drill', 2, 'A four carbon chain with single bonds is:', JSON_ARRAY('Butane','Butene','Pentane'), JSON_ARRAY('Butane'), 'But means four and ane means single bonds.', 'Root plus suffix.', 'beginner', 'suffix'
  UNION ALL SELECT 'iupac-starter-drill', 3, 'A five carbon main chain uses:', JSON_ARRAY('Pent','But','Hex'), JSON_ARRAY('Pent'), 'Pent is the root for five carbons.', 'Think pentagon.', 'beginner', 'root_word'
  UNION ALL SELECT 'iupac-starter-drill', 4, 'Methyl means:', JSON_ARRAY('one carbon branch','two carbon branch','double bond'), JSON_ARRAY('one carbon branch'), 'Methyl is a CH3 side branch.', 'Branch first name.', 'beginner', 'substituent'
  UNION ALL SELECT 'iupac-starter-drill', 5, 'The suffix ene means:', JSON_ARRAY('double bond','single bond','triple bond'), JSON_ARRAY('double bond'), 'Alkenes use ene.', 'VIP double bond.', 'beginner', 'suffix'
  UNION ALL SELECT 'iupac-starter-drill', 6, 'In but-1-ene, the 1 tells us:', JSON_ARRAY('double bond starts at carbon 1','branch is at carbon 1','there is one hydrogen'), JSON_ARRAY('double bond starts at carbon 1'), 'The locant tells the position of the double bond.', 'VIP seat number.', 'intermediate', 'double_bond_priority'
  UNION ALL SELECT 'iupac-starter-drill', 7, 'In 2-methylpentane, the longest chain has:', JSON_ARRAY('five carbons','two carbons','six branches'), JSON_ARRAY('five carbons'), 'Pent means five in the main chain.', 'Do not let branch distract you.', 'intermediate', 'longest_chain'
  UNION ALL SELECT 'iupac-starter-drill', 8, 'Which name uses lowest branch numbering?', JSON_ARRAY('2-methylpentane','4-methylpentane','5-methylpentane'), JSON_ARRAY('2-methylpentane'), 'Choose the direction giving the branch the lowest locant.', 'Lowest locant wins.', 'intermediate', 'numbering_direction'
  UNION ALL SELECT 'iupac-starter-drill', 9, 'What does di mean in dimethyl?', JSON_ARRAY('two','three','double bond'), JSON_ARRAY('two'), 'Di means two same substituents.', 'Two methyl branches.', 'intermediate', 'substituent'
  UNION ALL SELECT 'iupac-starter-drill', 10, 'In Chemlab full-name analogy, surname means:', JSON_ARRAY('bond type suffix','side branch','main chain'), JSON_ARRAY('bond type suffix'), 'The suffix tells ane, ene, or yne.', 'Surname is family type.', 'beginner', 'name_order'
  UNION ALL SELECT 'class-9-atoms-molecules-starter-drill', 1, 'H2O contains how many hydrogen atoms?', JSON_ARRAY('2','1','3'), JSON_ARRAY('2'), 'The subscript 2 applies to hydrogen.', 'Read the subscript.', 'beginner', NULL
  UNION ALL SELECT 'class-9-atoms-molecules-starter-drill', 2, 'An atom is best described as:', JSON_ARRAY('smallest unit of an element','mixture of compounds','only a charged particle'), JSON_ARRAY('smallest unit of an element'), 'Atoms are the building blocks of elements.', 'Element identity.', 'beginner', NULL
  UNION ALL SELECT 'class-9-atoms-molecules-starter-drill', 3, 'A molecule is:', JSON_ARRAY('atoms chemically bonded','only one atom','a random mixture'), JSON_ARRAY('atoms chemically bonded'), 'Molecules have bonded atoms.', 'Bonded group.', 'beginner', NULL
  UNION ALL SELECT 'class-12-electrochemistry-starter-drill', 1, 'In a Daniell cell, electrons flow externally from:', JSON_ARRAY('zinc to copper','copper to zinc','salt bridge to wire'), JSON_ARRAY('zinc to copper'), 'Zinc is anode and copper is cathode.', 'Anode to cathode through wire.', 'intermediate', 'electron_flow'
  UNION ALL SELECT 'class-12-electrochemistry-starter-drill', 2, 'Approximate Daniell cell voltage is:', JSON_ARRAY('1.10 V','0.10 V','11.0 V'), JSON_ARRAY('1.10 V'), 'Standard Daniell cell voltage is about 1.10 V.', 'A little above one volt.', 'intermediate', 'cell_voltage'
  UNION ALL SELECT 'class-12-electrochemistry-starter-drill', 3, 'Cell notation for Daniell cell is:', JSON_ARRAY('Zn | Zn2+ || Cu2+ | Cu','Cu | Cu2+ || Zn2+ | Zn','Zn2+ | Zn || Cu | Cu2+'), JSON_ARRAY('Zn | Zn2+ || Cu2+ | Cu'), 'Anode is written on left and cathode on right.', 'Left is zinc oxidation.', 'intermediate', 'cell_notation'
) seed ON seed.drill_slug = qd.slug
ON DUPLICATE KEY UPDATE options_json = VALUES(options_json), correct_answer_json = VALUES(correct_answer_json), explanation = VALUES(explanation), updated_at = NOW();

INSERT INTO mistake_patterns (class_id, subject_id, chapter_id, topic_id, mistake_key, title, description, correction, example, severity, status, created_at, updated_at)
SELECT qd.class_id, qd.subject_id, qd.chapter_id, qd.topic_id, seed.mistake_key, seed.title, seed.description, seed.correction, seed.example, 'medium', 'published', NOW(), NOW()
FROM quick_drills qd
JOIN (
  SELECT 'redox-basics-5-minute-drill' AS drill_slug, 'reducing_agent' AS mistake_key, 'Reducing agent confusion' AS title, 'Student names the reduced species as reducing agent.' AS description, 'The reducing agent causes reduction and itself gets oxidized.' AS correction, 'Zinc is reducing agent in Zn + Cu2+.' AS example
  UNION ALL SELECT 'redox-basics-5-minute-drill', 'oxidizing_agent', 'Oxidizing agent confusion', 'Student names the oxidized species as oxidizing agent.', 'The oxidizing agent causes oxidation and itself gets reduced.', 'Copper ion is oxidizing agent.'
  UNION ALL SELECT 'redox-basics-5-minute-drill', 'spectator_ion', 'Spectator ion confusion', 'Student includes unchanged ions in net ionic equation.', 'Remove ions that appear unchanged on both sides.', 'SO4 2- is spectator.'
  UNION ALL SELECT 'iupac-starter-drill', 'longest_chain', 'Longest chain trap', 'Student chooses a branch as main chain.', 'Find the longest continuous carbon chain first.', '2-methylpentane has pent root.'
  UNION ALL SELECT 'iupac-starter-drill', 'numbering_direction', 'Numbering direction trap', 'Student gives substituent a larger locant.', 'Number from the side giving lowest locants.', 'Use 2-methylpentane, not 4-methylpentane.'
  UNION ALL SELECT 'iupac-starter-drill', 'double_bond_priority', 'Double bond priority trap', 'Student gives branch priority over double bond.', 'Give the multiple bond the lowest possible number in simple alkene naming.', 'But-1-ene beats but-3-ene.'
) seed ON seed.drill_slug = qd.slug
ON DUPLICATE KEY UPDATE description = VALUES(description), correction = VALUES(correction), example = VALUES(example), updated_at = NOW();

INSERT INTO teacher_quizzes
  (uuid, teacher_user_id, title, slug, description, class_id, subject_id, chapter_id, topic_id, source_drill_id, status, visibility,
   time_limit_minutes, shuffle_questions, show_correct_after_each, show_leaderboard, quality_status, source_reference, created_at, updated_at)
SELECT CONCAT('stage7-public-quiz-', qd.slug), u.id, seed.title, seed.slug, seed.description, qd.class_id, qd.subject_id, qd.chapter_id, qd.topic_id,
  qd.id, 'published', 'public', qd.estimated_minutes, 0, 1, 1, 'needs_review',
  'Chemlab public practice quiz copied from starter quick drill.', NOW(), NOW()
FROM quick_drills qd
JOIN (SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1) u
JOIN (
  SELECT 'redox-basics-5-minute-drill' AS drill_slug, 'Redox Transfer Starter Battle' AS title, 'redox-transfer-starter-battle' AS slug, 'Practice LEO, GER, spectator ions, and redox agents from the Redox Transfer Kitchen story.' AS description
  UNION ALL SELECT 'iupac-starter-drill', 'Hydrocarbon Naming Starter Battle', 'hydrocarbon-naming-starter-battle', 'Check roots, suffixes, branches, and lowest numbering from Hydrocarbon Naming Quest.'
) seed ON seed.drill_slug = qd.slug
LEFT JOIN teacher_quizzes existing_quiz ON existing_quiz.slug = seed.slug
WHERE existing_quiz.id IS NULL
LIMIT 2;

INSERT INTO teacher_quiz_questions
  (quiz_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, points, mistake_key, order_index, created_at, updated_at)
SELECT tq.id, qq.question_text, IF(qq.question_type = 'multi_select', 'multi_select', qq.question_type), qq.options_json, qq.correct_answer_json,
  qq.explanation, qq.hint, 1, qq.mistake_type, qq.order_index, NOW(), NOW()
FROM teacher_quizzes tq
JOIN quick_drills qd ON qd.id = tq.source_drill_id
JOIN quiz_questions qq ON qq.drill_id = qd.id AND qq.status = 'published'
LEFT JOIN teacher_quiz_questions existing_question
  ON existing_question.quiz_id = tq.id
  AND existing_question.question_text = qq.question_text
WHERE tq.slug IN ('redox-transfer-starter-battle', 'hydrocarbon-naming-starter-battle')
  AND existing_question.id IS NULL;

UPDATE learning_resources
SET quality_status = COALESCE(quality_status, 'needs_review'),
    source_reference = COALESCE(source_reference, 'Chemlab original, NCERT-aligned. Verify before final publishing.'),
    updated_at = NOW()
WHERE slug IN ('redox-transfer-kitchen', 'hydrocarbon-naming-quest');
