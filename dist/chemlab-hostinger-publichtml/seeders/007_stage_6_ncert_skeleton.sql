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
    lr.source_reference = 'Original chemlearning simulation mapped to NCERT structure placeholder. Verify before publishing.',
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
    lr.source_reference = 'Original chemlearning simulation mapped to NCERT structure placeholder. Verify before publishing.',
    lr.updated_at = NOW()
WHERE lr.slug = 'hydrocarbon-naming-quest';

INSERT INTO site_settings (setting_key, setting_value, type, is_public, created_at, updated_at)
VALUES
  ('ncert_skeleton_note', 'NCERT structure placeholders are editable drafts. Verify current syllabus mapping before publishing.', 'string', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW();
