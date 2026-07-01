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
