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
