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
