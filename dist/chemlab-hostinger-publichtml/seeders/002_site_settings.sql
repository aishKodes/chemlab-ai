INSERT INTO site_settings (setting_key, setting_value, type, is_public, created_at, updated_at)
VALUES
  ('site_name', 'chemlearning', 'string', 1, NOW(), NOW()),
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
