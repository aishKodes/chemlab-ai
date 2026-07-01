-- Chemlab Hostinger Backend - Stage 1 Database

CREATE TABLE IF NOT EXISTS schema_migrations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  migration VARCHAR(190) NOT NULL,
  batch INT NOT NULL DEFAULT 1,
  ran_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY schema_migrations_migration_unique (migration)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  role ENUM('student','teacher','admin') NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT NULL,
  preferred_language VARCHAR(20) DEFAULT 'en',
  status ENUM('pending','active','blocked','deleted') DEFAULT 'active',
  email_verified_at DATETIME NULL,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_uuid_unique (uuid),
  UNIQUE KEY users_email_unique (email),
  KEY users_email_index (email),
  KEY users_role_index (role),
  KEY users_status_index (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  class_level ENUM('9','10','11','12') NULL,
  board VARCHAR(80) NULL,
  school_name VARCHAR(190) NULL,
  learning_goal VARCHAR(190) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY student_profiles_user_unique (user_id),
  CONSTRAINT student_profiles_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS teacher_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  school_or_institute VARCHAR(190) NULL,
  subject VARCHAR(100) DEFAULT 'Chemistry',
  classes_taught JSON NULL,
  verification_status ENUM('unverified','pending','verified') DEFAULT 'unverified',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY teacher_profiles_user_unique (user_id),
  CONSTRAINT teacher_profiles_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auth_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  device_label VARCHAR(190) NULL,
  ip_hash VARCHAR(255) NULL,
  user_agent_hash VARCHAR(255) NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY auth_tokens_hash_unique (token_hash),
  KEY auth_tokens_user_index (user_id),
  KEY auth_tokens_expires_index (expires_at),
  CONSTRAINT auth_tokens_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_verification_codes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  email VARCHAR(190) NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  purpose ENUM('signup','password_reset','email_change') NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  attempts INT DEFAULT 0,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY email_codes_user_purpose_index (user_id, purpose),
  KEY email_codes_email_index (email),
  CONSTRAINT email_codes_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY password_reset_tokens_hash_unique (token_hash),
  KEY password_reset_tokens_user_index (user_id),
  CONSTRAINT password_reset_tokens_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS classes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  class_level ENUM('9','10','11','12') NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  status ENUM('active','hidden') DEFAULT 'active',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY classes_level_unique (class_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subjects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  class_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  subject_type ENUM('science','chemistry') NOT NULL,
  status ENUM('active','hidden') DEFAULT 'active',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY subjects_class_name_unique (class_id, name),
  KEY subjects_class_index (class_id),
  CONSTRAINT subjects_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  class_id BIGINT UNSIGNED NOT NULL,
  subject_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(190) NOT NULL,
  source ENUM('NCERT','CUSTOM') DEFAULT 'NCERT',
  language VARCHAR(20) DEFAULT 'en',
  status ENUM('draft','published','archived') DEFAULT 'draft',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY books_class_subject_index (class_id, subject_id),
  CONSTRAINT books_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT books_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chapters (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  book_id BIGINT UNSIGNED NOT NULL,
  class_id BIGINT UNSIGNED NOT NULL,
  subject_id BIGINT UNSIGNED NOT NULL,
  chapter_number INT NULL,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL,
  status ENUM('draft','published','archived') DEFAULT 'draft',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY chapters_class_slug_unique (class_id, slug),
  KEY chapters_book_index (book_id),
  KEY chapters_subject_index (subject_id),
  CONSTRAINT chapters_book_fk FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  CONSTRAINT chapters_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT chapters_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS topics (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  chapter_id BIGINT UNSIGNED NOT NULL,
  class_id BIGINT UNSIGNED NOT NULL,
  subject_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL,
  order_index INT DEFAULT 0,
  difficulty ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
  status ENUM('draft','published','archived') DEFAULT 'draft',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY topics_chapter_slug_unique (chapter_id, slug),
  KEY topics_class_index (class_id),
  KEY topics_subject_index (subject_id),
  CONSTRAINT topics_chapter_fk FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  CONSTRAINT topics_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT topics_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS learning_resources (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  type ENUM('simulation','story_lab','memory_deck','quick_drill','concept_map','formula_sheet','revision_note','teacher_note','mistake_card_set','exam_practice') NOT NULL,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL,
  description TEXT NULL,
  route_url TEXT NULL,
  content_json JSON NULL,
  source_type ENUM('NCERT','CUSTOM','SIMULATION','AI_ASSISTED') DEFAULT 'CUSTOM',
  source_reference TEXT NULL,
  status ENUM('draft','published','archived') DEFAULT 'draft',
  created_by BIGINT UNSIGNED NULL,
  approved_by BIGINT UNSIGNED NULL,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY learning_resources_uuid_unique (uuid),
  UNIQUE KEY learning_resources_slug_unique (slug),
  KEY learning_resources_class_id_index (class_id),
  KEY learning_resources_chapter_id_index (chapter_id),
  KEY learning_resources_topic_id_index (topic_id),
  KEY learning_resources_status_index (status),
  CONSTRAINT learning_resources_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT learning_resources_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT learning_resources_chapter_fk FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT learning_resources_topic_fk FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  CONSTRAINT learning_resources_created_by_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT learning_resources_approved_by_fk FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resource_translations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  resource_id BIGINT UNSIGNED NOT NULL,
  language VARCHAR(20) NOT NULL,
  title VARCHAR(190) NULL,
  description TEXT NULL,
  content_json JSON NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY resource_translations_resource_language_unique (resource_id, language),
  CONSTRAINT resource_translations_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS content_blocks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  block_key VARCHAR(190) NOT NULL,
  page_slug VARCHAR(190) NOT NULL,
  section VARCHAR(190) NULL,
  type ENUM('text','rich_text','image','json','link','cta','seo') NOT NULL,
  status ENUM('draft','published','archived') DEFAULT 'published',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY content_blocks_key_unique (block_key),
  KEY content_blocks_page_index (page_slug, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS content_translations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  block_id BIGINT UNSIGNED NOT NULL,
  language VARCHAR(20) NOT NULL,
  title TEXT NULL,
  body LONGTEXT NULL,
  value_json JSON NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY content_translations_block_language_unique (block_id, language),
  CONSTRAINT content_translations_block_fk FOREIGN KEY (block_id) REFERENCES content_blocks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_assets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  title VARCHAR(190) NULL,
  alt_text TEXT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes BIGINT NOT NULL,
  width INT NULL,
  height INT NULL,
  uploaded_by BIGINT UNSIGNED NULL,
  usage_context VARCHAR(190) NULL,
  status ENUM('active','archived','deleted') DEFAULT 'active',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY media_assets_uuid_unique (uuid),
  KEY media_assets_uploaded_by_index (uploaded_by),
  CONSTRAINT media_assets_uploaded_by_fk FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  role_target ENUM('student','teacher','admin','all') NULL,
  title VARCHAR(190) NOT NULL,
  body TEXT NOT NULL,
  type ENUM('system','learning','ai','admin','email','achievement','announcement') DEFAULT 'system',
  read_at DATETIME NULL,
  action_url TEXT NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY notifications_user_id_index (user_id),
  KEY notifications_role_target_index (role_target),
  CONSTRAINT notifications_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_templates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  template_key VARCHAR(190) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body_html LONGTEXT NOT NULL,
  body_text LONGTEXT NULL,
  language VARCHAR(20) DEFAULT 'en',
  status ENUM('active','draft','archived') DEFAULT 'active',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email_templates_key_unique (template_key),
  KEY email_templates_status_index (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  to_email VARCHAR(190) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  template_key VARCHAR(190) NULL,
  status ENUM('queued','sent','failed') DEFAULT 'queued',
  provider VARCHAR(100) DEFAULT 'smtp',
  error_message TEXT NULL,
  sent_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY email_logs_status_index (status),
  KEY email_logs_user_index (user_id),
  CONSTRAINT email_logs_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chem_shastri_conversations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  title VARCHAR(190) NULL,
  class_level VARCHAR(20) NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  language VARCHAR(20) DEFAULT 'en',
  mode VARCHAR(50) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY chem_shastri_conversations_user_id_index (user_id),
  KEY chem_shastri_conversations_chapter_index (chapter_id),
  CONSTRAINT chem_shastri_conversations_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chem_shastri_conversations_chapter_fk FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT chem_shastri_conversations_topic_fk FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chem_shastri_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  role ENUM('user','assistant','system') NOT NULL,
  content LONGTEXT NOT NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY chem_shastri_messages_conversation_index (conversation_id),
  CONSTRAINT chem_shastri_messages_conversation_fk FOREIGN KEY (conversation_id) REFERENCES chem_shastri_conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  provider VARCHAR(80) NULL,
  model VARCHAR(100) NULL,
  mode VARCHAR(80) NULL,
  prompt_hash VARCHAR(255) NULL,
  input_tokens_est INT DEFAULT 0,
  output_tokens_est INT DEFAULT 0,
  cost_inr_est DECIMAL(10,4) DEFAULT 0,
  cache_hit TINYINT(1) DEFAULT 0,
  status ENUM('success','failed','blocked','cached') DEFAULT 'success',
  error_message TEXT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY ai_usage_logs_user_index (user_id),
  KEY ai_usage_logs_created_index (created_at),
  CONSTRAINT ai_usage_logs_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS learning_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  session_id VARCHAR(100) NULL,
  event_type VARCHAR(100) NOT NULL,
  event_name VARCHAR(150) NOT NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  resource_id BIGINT UNSIGNED NULL,
  page_path TEXT NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY learning_events_user_id_index (user_id),
  KEY learning_events_event_name_index (event_name),
  KEY learning_events_created_at_index (created_at),
  KEY learning_events_class_subject_index (class_id, subject_id),
  CONSTRAINT learning_events_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT learning_events_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT learning_events_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT learning_events_chapter_fk FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT learning_events_topic_fk FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  CONSTRAINT learning_events_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  setting_key VARCHAR(190) NOT NULL,
  setting_value LONGTEXT NULL,
  setting_json JSON NULL,
  type ENUM('string','number','boolean','json','image','secret_ref') DEFAULT 'string',
  is_public TINYINT(1) DEFAULT 0,
  updated_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY site_settings_key_unique (setting_key),
  KEY site_settings_public_index (is_public),
  CONSTRAINT site_settings_updated_by_fk FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_user_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(190) NOT NULL,
  entity_type VARCHAR(100) NULL,
  entity_id BIGINT UNSIGNED NULL,
  metadata JSON NULL,
  ip_hash VARCHAR(255) NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY admin_activity_admin_index (admin_user_id),
  KEY admin_activity_action_index (action),
  CONSTRAINT admin_activity_admin_fk FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rate_limit_hits (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  identifier VARCHAR(160) NOT NULL,
  route_key VARCHAR(190) NOT NULL,
  bucket_start DATETIME NOT NULL,
  hits INT UNSIGNED NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY rate_limit_bucket_unique (identifier, route_key, bucket_start),
  KEY rate_limit_cleanup_index (bucket_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
