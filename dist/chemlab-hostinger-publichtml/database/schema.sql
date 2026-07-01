-- Chemlab public_html schema.sql
-- Import this first in phpMyAdmin.


-- Source: 001_create_stage_1_tables.sql
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

-- Source: 002_stage_3_learning_tools.sql
-- Chemlab Hostinger Backend - Stage 3 Admin Resource Tools

CREATE TABLE IF NOT EXISTS memory_decks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  resource_id BIGINT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL,
  description TEXT NULL,
  language VARCHAR(20) DEFAULT 'en',
  difficulty ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
  status ENUM('draft','published','archived') DEFAULT 'draft',
  source_type ENUM('NCERT','CUSTOM','SIMULATION','AI_ASSISTED') DEFAULT 'CUSTOM',
  source_reference TEXT NULL,
  created_by BIGINT UNSIGNED NULL,
  approved_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY memory_decks_uuid_unique (uuid),
  UNIQUE KEY memory_decks_slug_unique (slug),
  KEY memory_decks_class_index (class_id),
  KEY memory_decks_chapter_index (chapter_id),
  KEY memory_decks_topic_index (topic_id),
  KEY memory_decks_resource_index (resource_id),
  KEY memory_decks_status_index (status),
  CONSTRAINT memory_decks_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT memory_decks_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT memory_decks_chapter_fk FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT memory_decks_topic_fk FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  CONSTRAINT memory_decks_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL,
  CONSTRAINT memory_decks_created_by_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT memory_decks_approved_by_fk FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS memory_cards (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  deck_id BIGINT UNSIGNED NOT NULL,
  front VARCHAR(255) NOT NULL,
  back TEXT NOT NULL,
  hint TEXT NULL,
  explanation TEXT NULL,
  difficulty ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
  card_type ENUM('concept','formula','definition','mistake','application') DEFAULT 'concept',
  mistake_type VARCHAR(120) NULL,
  source_reference TEXT NULL,
  order_index INT DEFAULT 0,
  status ENUM('draft','published','archived') DEFAULT 'published',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY memory_cards_deck_front_unique (deck_id, front),
  KEY memory_cards_deck_index (deck_id),
  KEY memory_cards_status_index (status),
  CONSTRAINT memory_cards_deck_fk FOREIGN KEY (deck_id) REFERENCES memory_decks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quick_drills (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  resource_id BIGINT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL,
  description TEXT NULL,
  language VARCHAR(20) DEFAULT 'en',
  difficulty ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
  estimated_minutes INT DEFAULT 5,
  status ENUM('draft','published','archived') DEFAULT 'draft',
  source_type ENUM('NCERT','CUSTOM','SIMULATION','AI_ASSISTED') DEFAULT 'CUSTOM',
  source_reference TEXT NULL,
  created_by BIGINT UNSIGNED NULL,
  approved_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY quick_drills_uuid_unique (uuid),
  UNIQUE KEY quick_drills_slug_unique (slug),
  KEY quick_drills_class_index (class_id),
  KEY quick_drills_chapter_index (chapter_id),
  KEY quick_drills_topic_index (topic_id),
  KEY quick_drills_resource_index (resource_id),
  KEY quick_drills_status_index (status),
  CONSTRAINT quick_drills_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT quick_drills_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT quick_drills_chapter_fk FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT quick_drills_topic_fk FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  CONSTRAINT quick_drills_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL,
  CONSTRAINT quick_drills_created_by_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT quick_drills_approved_by_fk FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_questions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  drill_id BIGINT UNSIGNED NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('mcq','multi_select','true_false','short_answer') DEFAULT 'mcq',
  options_json JSON NULL,
  correct_answer_json JSON NULL,
  explanation TEXT NULL,
  hint TEXT NULL,
  difficulty ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
  mistake_type VARCHAR(120) NULL,
  source_reference TEXT NULL,
  order_index INT DEFAULT 0,
  status ENUM('draft','published','archived') DEFAULT 'published',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY quiz_questions_drill_text_unique (drill_id, question_text(190)),
  KEY quiz_questions_drill_index (drill_id),
  KEY quiz_questions_class_index (class_id),
  KEY quiz_questions_chapter_index (chapter_id),
  KEY quiz_questions_topic_index (topic_id),
  KEY quiz_questions_status_index (status),
  CONSTRAINT quiz_questions_drill_fk FOREIGN KEY (drill_id) REFERENCES quick_drills(id) ON DELETE CASCADE,
  CONSTRAINT quiz_questions_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT quiz_questions_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT quiz_questions_chapter_fk FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT quiz_questions_topic_fk FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS concept_maps (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL,
  description TEXT NULL,
  map_json JSON NULL,
  status ENUM('draft','published','archived') DEFAULT 'draft',
  source_reference TEXT NULL,
  created_by BIGINT UNSIGNED NULL,
  approved_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY concept_maps_uuid_unique (uuid),
  UNIQUE KEY concept_maps_slug_unique (slug),
  KEY concept_maps_class_index (class_id),
  KEY concept_maps_chapter_index (chapter_id),
  KEY concept_maps_topic_index (topic_id),
  KEY concept_maps_status_index (status),
  CONSTRAINT concept_maps_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT concept_maps_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT concept_maps_chapter_fk FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT concept_maps_topic_fk FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  CONSTRAINT concept_maps_created_by_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT concept_maps_approved_by_fk FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mistake_patterns (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  resource_id BIGINT UNSIGNED NULL,
  mistake_key VARCHAR(190) NOT NULL,
  title VARCHAR(190) NOT NULL,
  description TEXT NULL,
  correction TEXT NULL,
  example TEXT NULL,
  severity ENUM('low','medium','high') DEFAULT 'medium',
  status ENUM('draft','published','archived') DEFAULT 'published',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY mistake_patterns_key_unique (mistake_key),
  KEY mistake_patterns_class_index (class_id),
  KEY mistake_patterns_chapter_index (chapter_id),
  KEY mistake_patterns_topic_index (topic_id),
  KEY mistake_patterns_resource_index (resource_id),
  KEY mistake_patterns_status_index (status),
  CONSTRAINT mistake_patterns_class_fk FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT mistake_patterns_subject_fk FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT mistake_patterns_chapter_fk FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT mistake_patterns_topic_fk FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  CONSTRAINT mistake_patterns_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Source: 003_stage_4_learning_intelligence.sql
-- Chemlab Hostinger Backend - Stage 4 Learning Intelligence

CREATE TABLE IF NOT EXISTS resource_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  session_id VARCHAR(100) NULL,
  resource_id BIGINT UNSIGNED NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  resource_type VARCHAR(80) NULL,
  started_at DATETIME NOT NULL,
  ended_at DATETIME NULL,
  duration_seconds INT DEFAULT 0,
  completed TINYINT(1) DEFAULT 0,
  completion_percent INT DEFAULT 0,
  exit_reason VARCHAR(100) NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY resource_sessions_uuid_unique (uuid),
  KEY resource_sessions_user_id_index (user_id),
  KEY resource_sessions_resource_id_index (resource_id),
  KEY resource_sessions_class_index (class_id),
  KEY resource_sessions_created_index (created_at),
  CONSTRAINT resource_sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT resource_sessions_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS simulation_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  session_id VARCHAR(100) NULL,
  simulation_slug VARCHAR(190) NOT NULL,
  resource_id BIGINT UNSIGNED NULL,
  class_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  started_at DATETIME NOT NULL,
  ended_at DATETIME NULL,
  duration_seconds INT DEFAULT 0,
  completed TINYINT(1) DEFAULT 0,
  highest_level VARCHAR(100) NULL,
  mistakes_count INT DEFAULT 0,
  hints_used INT DEFAULT 0,
  enjoyment_rating TINYINT NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY simulation_sessions_uuid_unique (uuid),
  KEY simulation_sessions_user_id_index (user_id),
  KEY simulation_sessions_slug_index (simulation_slug),
  KEY simulation_sessions_resource_index (resource_id),
  KEY simulation_sessions_created_index (created_at),
  CONSTRAINT simulation_sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT simulation_sessions_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS simulation_step_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  simulation_session_id BIGINT UNSIGNED NULL,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  simulation_slug VARCHAR(190) NOT NULL,
  step_key VARCHAR(190) NOT NULL,
  event_name VARCHAR(150) NOT NULL,
  success TINYINT(1) NULL,
  mistake_key VARCHAR(190) NULL,
  duration_seconds INT DEFAULT 0,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY simulation_step_session_index (simulation_session_id),
  KEY simulation_step_slug_index (simulation_slug),
  KEY simulation_step_event_index (event_name),
  KEY simulation_step_mistake_index (mistake_key),
  CONSTRAINT simulation_step_session_fk FOREIGN KEY (simulation_session_id) REFERENCES simulation_sessions(id) ON DELETE SET NULL,
  CONSTRAINT simulation_step_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mistake_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  session_id VARCHAR(100) NULL,
  mistake_key VARCHAR(190) NOT NULL,
  mistake_pattern_id BIGINT UNSIGNED NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  resource_id BIGINT UNSIGNED NULL,
  simulation_slug VARCHAR(190) NULL,
  question_id BIGINT UNSIGNED NULL,
  severity ENUM('low','medium','high') DEFAULT 'medium',
  student_answer TEXT NULL,
  correct_answer TEXT NULL,
  feedback_shown TEXT NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY mistake_events_user_index (user_id),
  KEY mistake_events_key_index (mistake_key),
  KEY mistake_events_topic_index (topic_id),
  KEY mistake_events_resource_index (resource_id),
  CONSTRAINT mistake_events_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT mistake_events_pattern_fk FOREIGN KEY (mistake_pattern_id) REFERENCES mistake_patterns(id) ON DELETE SET NULL,
  CONSTRAINT mistake_events_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL,
  CONSTRAINT mistake_events_question_fk FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS memory_reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  deck_id BIGINT UNSIGNED NOT NULL,
  card_id BIGINT UNSIGNED NOT NULL,
  class_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  rating ENUM('easy','good','hard','forgot') NOT NULL,
  response_time_ms INT NULL,
  review_mode ENUM('learn','review','mistake_fix') DEFAULT 'learn',
  next_review_at DATETIME NULL,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY memory_reviews_user_index (user_id),
  KEY memory_reviews_deck_index (deck_id),
  KEY memory_reviews_card_index (card_id),
  CONSTRAINT memory_reviews_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT memory_reviews_deck_fk FOREIGN KEY (deck_id) REFERENCES memory_decks(id) ON DELETE CASCADE,
  CONSTRAINT memory_reviews_card_fk FOREIGN KEY (card_id) REFERENCES memory_cards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS memory_card_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  deck_id BIGINT UNSIGNED NOT NULL,
  card_id BIGINT UNSIGNED NOT NULL,
  ease_score DECIMAL(5,2) DEFAULT 2.50,
  review_count INT DEFAULT 0,
  forgot_count INT DEFAULT 0,
  hard_count INT DEFAULT 0,
  last_rating VARCHAR(20) NULL,
  last_reviewed_at DATETIME NULL,
  next_review_at DATETIME NULL,
  mastered TINYINT(1) DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY memory_card_progress_user_card_unique (user_id, card_id),
  KEY memory_card_progress_anonymous_card_index (anonymous_id, card_id),
  KEY memory_card_progress_deck_index (deck_id),
  CONSTRAINT memory_card_progress_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT memory_card_progress_deck_fk FOREIGN KEY (deck_id) REFERENCES memory_decks(id) ON DELETE CASCADE,
  CONSTRAINT memory_card_progress_card_fk FOREIGN KEY (card_id) REFERENCES memory_cards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  drill_id BIGINT UNSIGNED NOT NULL,
  class_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  started_at DATETIME NOT NULL,
  completed_at DATETIME NULL,
  duration_seconds INT DEFAULT 0,
  score INT DEFAULT 0,
  total_questions INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  wrong_count INT DEFAULT 0,
  hints_used INT DEFAULT 0,
  completed TINYINT(1) DEFAULT 0,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY quiz_attempts_uuid_unique (uuid),
  KEY quiz_attempts_user_index (user_id),
  KEY quiz_attempts_drill_index (drill_id),
  KEY quiz_attempts_created_index (created_at),
  CONSTRAINT quiz_attempts_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT quiz_attempts_drill_fk FOREIGN KEY (drill_id) REFERENCES quick_drills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quiz_answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  attempt_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  selected_answer_json JSON NULL,
  correct_answer_json JSON NULL,
  is_correct TINYINT(1) DEFAULT 0,
  response_time_ms INT NULL,
  hint_used TINYINT(1) DEFAULT 0,
  mistake_key VARCHAR(190) NULL,
  explanation_shown TEXT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY quiz_answers_attempt_question_unique (attempt_id, question_id),
  KEY quiz_answers_user_index (user_id),
  KEY quiz_answers_question_index (question_id),
  KEY quiz_answers_mistake_index (mistake_key),
  CONSTRAINT quiz_answers_attempt_fk FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  CONSTRAINT quiz_answers_question_fk FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
  CONSTRAINT quiz_answers_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resource_feedback (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  resource_id BIGINT UNSIGNED NULL,
  resource_type VARCHAR(80) NULL,
  rating TINYINT NULL,
  reaction ENUM('loved','useful','confusing','too_hard','boring') NULL,
  comment TEXT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY resource_feedback_resource_index (resource_id),
  KEY resource_feedback_user_index (user_id),
  CONSTRAINT resource_feedback_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT resource_feedback_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chem_shastri_question_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  anonymous_id VARCHAR(100) NULL,
  conversation_id BIGINT UNSIGNED NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  resource_id BIGINT UNSIGNED NULL,
  simulation_slug VARCHAR(190) NULL,
  question_text LONGTEXT NULL,
  normalized_question_hash VARCHAR(255) NULL,
  intent VARCHAR(100) NULL,
  mode VARCHAR(80) NULL,
  answer_source VARCHAR(80) NULL,
  provider VARCHAR(80) NULL,
  model VARCHAR(100) NULL,
  helpful_rating ENUM('helpful','not_helpful','too_hard','too_long','wrong') NULL,
  cost_inr_est DECIMAL(10,4) DEFAULT 0,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY chem_shastri_question_logs_created_at_index (created_at),
  KEY chem_shastri_question_logs_topic_id_index (topic_id),
  KEY chem_shastri_question_logs_hash_index (normalized_question_hash),
  CONSTRAINT chem_shastri_question_logs_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chem_shastri_question_logs_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_topic_mastery (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NOT NULL,
  mastery_score DECIMAL(5,2) DEFAULT 0,
  confidence ENUM('low','medium','high') DEFAULT 'low',
  resources_completed INT DEFAULT 0,
  drills_completed INT DEFAULT 0,
  memory_cards_mastered INT DEFAULT 0,
  mistakes_count INT DEFAULT 0,
  last_activity_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY student_topic_mastery_user_topic_unique (user_id, topic_id),
  KEY student_topic_mastery_class_index (class_id),
  CONSTRAINT student_topic_mastery_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT student_topic_mastery_topic_fk FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS daily_learning_rollups (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  rollup_date DATE NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  role ENUM('student','teacher','admin') NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  resource_id BIGINT UNSIGNED NULL,
  page_views INT DEFAULT 0,
  resource_views INT DEFAULT 0,
  simulation_starts INT DEFAULT 0,
  simulation_completions INT DEFAULT 0,
  memory_reviews INT DEFAULT 0,
  drill_attempts INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  wrong_answers INT DEFAULT 0,
  mistake_count INT DEFAULT 0,
  chem_shastri_questions INT DEFAULT 0,
  total_time_seconds INT DEFAULT 0,
  enjoyment_score_avg DECIMAL(5,2) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY daily_learning_rollups_unique (rollup_date, user_id, class_id, chapter_id, topic_id, resource_id),
  KEY daily_learning_rollups_date_index (rollup_date),
  KEY daily_learning_rollups_user_index (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS teacher_classrooms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  teacher_user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(190) NOT NULL,
  class_level ENUM('9','10','11','12') NULL,
  subject VARCHAR(100) DEFAULT 'Chemistry',
  join_code VARCHAR(30) UNIQUE NULL,
  status ENUM('active','archived') DEFAULT 'active',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY teacher_classrooms_uuid_unique (uuid),
  KEY teacher_classrooms_teacher_user_id_index (teacher_user_id),
  CONSTRAINT teacher_classrooms_teacher_fk FOREIGN KEY (teacher_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS classroom_students (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  classroom_id BIGINT UNSIGNED NOT NULL,
  student_user_id BIGINT UNSIGNED NOT NULL,
  status ENUM('active','removed','pending') DEFAULT 'active',
  joined_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY classroom_students_unique (classroom_id, student_user_id),
  KEY classroom_students_student_index (student_user_id),
  CONSTRAINT classroom_students_classroom_fk FOREIGN KEY (classroom_id) REFERENCES teacher_classrooms(id) ON DELETE CASCADE,
  CONSTRAINT classroom_students_student_fk FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS teacher_assignments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  teacher_user_id BIGINT UNSIGNED NOT NULL,
  classroom_id BIGINT UNSIGNED NULL,
  resource_id BIGINT UNSIGNED NULL,
  deck_id BIGINT UNSIGNED NULL,
  drill_id BIGINT UNSIGNED NULL,
  title VARCHAR(190) NOT NULL,
  instructions TEXT NULL,
  due_at DATETIME NULL,
  status ENUM('draft','assigned','archived') DEFAULT 'draft',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY teacher_assignments_uuid_unique (uuid),
  KEY teacher_assignments_teacher_index (teacher_user_id),
  KEY teacher_assignments_classroom_index (classroom_id),
  CONSTRAINT teacher_assignments_teacher_fk FOREIGN KEY (teacher_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT teacher_assignments_classroom_fk FOREIGN KEY (classroom_id) REFERENCES teacher_classrooms(id) ON DELETE SET NULL,
  CONSTRAINT teacher_assignments_resource_fk FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE SET NULL,
  CONSTRAINT teacher_assignments_deck_fk FOREIGN KEY (deck_id) REFERENCES memory_decks(id) ON DELETE SET NULL,
  CONSTRAINT teacher_assignments_drill_fk FOREIGN KEY (drill_id) REFERENCES quick_drills(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS assignment_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  assignment_id BIGINT UNSIGNED NOT NULL,
  student_user_id BIGINT UNSIGNED NOT NULL,
  status ENUM('not_started','in_progress','completed') DEFAULT 'not_started',
  score DECIMAL(5,2) NULL,
  completed_at DATETIME NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY assignment_progress_unique (assignment_id, student_user_id),
  KEY assignment_progress_student_index (student_user_id),
  CONSTRAINT assignment_progress_assignment_fk FOREIGN KEY (assignment_id) REFERENCES teacher_assignments(id) ON DELETE CASCADE,
  CONSTRAINT assignment_progress_student_fk FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Source: 004_stage_7_live_quizzes_memory_resources.sql
-- Chemlab Hostinger Backend - Stage 7 Live Quiz Rooms, Smart Memory, Resource Curation

ALTER TABLE learning_resources
  MODIFY type ENUM('simulation','story_lab','memory_deck','quick_drill','concept_map','formula_sheet','revision_note','teacher_note','mistake_card_set','exam_practice','explanation','visualization','external_resource','worksheet','reaction_map','video_link') NOT NULL;

ALTER TABLE learning_resources
  ADD COLUMN IF NOT EXISTS source_url TEXT NULL AFTER source_reference,
  ADD COLUMN IF NOT EXISTS license_type VARCHAR(120) NULL AFTER source_url,
  ADD COLUMN IF NOT EXISTS attribution_text TEXT NULL AFTER license_type,
  ADD COLUMN IF NOT EXISTS author VARCHAR(190) NULL AFTER attribution_text,
  ADD COLUMN IF NOT EXISTS embed_url TEXT NULL AFTER author,
  ADD COLUMN IF NOT EXISTS external_open_mode ENUM('same_tab','new_tab','embed') DEFAULT 'new_tab' AFTER embed_url,
  ADD COLUMN IF NOT EXISTS quality_status ENUM('draft','needs_review','verified','published','archived') DEFAULT 'needs_review' AFTER external_open_mode,
  ADD COLUMN IF NOT EXISTS accuracy_reviewed_by BIGINT UNSIGNED NULL AFTER quality_status,
  ADD COLUMN IF NOT EXISTS accuracy_reviewed_at DATETIME NULL AFTER accuracy_reviewed_by,
  ADD COLUMN IF NOT EXISTS accuracy_notes TEXT NULL AFTER accuracy_reviewed_at,
  ADD COLUMN IF NOT EXISTS why_useful TEXT NULL AFTER accuracy_notes,
  ADD COLUMN IF NOT EXISTS student_instructions TEXT NULL AFTER why_useful,
  ADD COLUMN IF NOT EXISTS student_level ENUM('beginner','intermediate','advanced') DEFAULT 'beginner' AFTER student_instructions,
  ADD COLUMN IF NOT EXISTS estimated_minutes INT NULL AFTER student_level;

ALTER TABLE memory_card_progress
  ADD COLUMN IF NOT EXISTS interval_days INT DEFAULT 0 AFTER ease_score,
  ADD COLUMN IF NOT EXISTS lapse_count INT DEFAULT 0 AFTER hard_count,
  ADD COLUMN IF NOT EXISTS due_status ENUM('new','due','learning','review','mastered') DEFAULT 'new' AFTER mastered;

CREATE TABLE IF NOT EXISTS teacher_quizzes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  teacher_user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(190) NOT NULL,
  slug VARCHAR(190) NOT NULL,
  description TEXT NULL,
  class_id BIGINT UNSIGNED NULL,
  subject_id BIGINT UNSIGNED NULL,
  chapter_id BIGINT UNSIGNED NULL,
  topic_id BIGINT UNSIGNED NULL,
  source_drill_id BIGINT UNSIGNED NULL,
  status ENUM('draft','published','archived') DEFAULT 'draft',
  visibility ENUM('private','public') DEFAULT 'private',
  time_limit_minutes INT NULL,
  shuffle_questions TINYINT(1) DEFAULT 0,
  show_correct_after_each TINYINT(1) DEFAULT 1,
  show_leaderboard TINYINT(1) DEFAULT 1,
  quality_status ENUM('draft','needs_review','verified','published','archived') DEFAULT 'needs_review',
  source_reference TEXT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY teacher_quizzes_uuid_unique (uuid),
  UNIQUE KEY teacher_quizzes_slug_unique (slug),
  KEY teacher_quizzes_teacher_index (teacher_user_id),
  KEY teacher_quizzes_source_drill_index (source_drill_id),
  KEY teacher_quizzes_visibility_index (visibility, status),
  CONSTRAINT teacher_quizzes_teacher_fk FOREIGN KEY (teacher_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT teacher_quizzes_source_drill_fk FOREIGN KEY (source_drill_id) REFERENCES quick_drills(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS teacher_quiz_questions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  quiz_id BIGINT UNSIGNED NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('mcq','true_false','short_answer','multi_select') DEFAULT 'mcq',
  options_json JSON NULL,
  correct_answer_json JSON NULL,
  explanation TEXT NULL,
  hint TEXT NULL,
  points INT DEFAULT 1,
  mistake_key VARCHAR(190) NULL,
  order_index INT DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY teacher_quiz_questions_quiz_index (quiz_id),
  CONSTRAINT teacher_quiz_questions_quiz_fk FOREIGN KEY (quiz_id) REFERENCES teacher_quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS live_quiz_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid VARCHAR(64) NOT NULL,
  quiz_id BIGINT UNSIGNED NOT NULL,
  teacher_user_id BIGINT UNSIGNED NOT NULL,
  pin_code CHAR(6) NOT NULL,
  join_url TEXT NULL,
  status ENUM('waiting','live','ended','archived') DEFAULT 'waiting',
  started_at DATETIME NULL,
  ended_at DATETIME NULL,
  allow_guest_names TINYINT(1) DEFAULT 1,
  show_live_leaderboard TINYINT(1) DEFAULT 1,
  metadata JSON NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY live_quiz_sessions_uuid_unique (uuid),
  UNIQUE KEY live_quiz_sessions_pin_unique (pin_code),
  KEY live_quiz_sessions_quiz_index (quiz_id),
  KEY live_quiz_sessions_teacher_index (teacher_user_id),
  KEY live_quiz_sessions_status_index (status),
  CONSTRAINT live_quiz_sessions_quiz_fk FOREIGN KEY (quiz_id) REFERENCES teacher_quizzes(id) ON DELETE CASCADE,
  CONSTRAINT live_quiz_sessions_teacher_fk FOREIGN KEY (teacher_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS live_quiz_participants (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  guest_name VARCHAR(120) NULL,
  guest_token_hash VARCHAR(255) NULL,
  display_name VARCHAR(120) NOT NULL,
  joined_at DATETIME NOT NULL,
  completed_at DATETIME NULL,
  score INT DEFAULT 0,
  total_points INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  wrong_count INT DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  rank_position INT NULL,
  metadata JSON NULL,
  PRIMARY KEY (id),
  KEY live_quiz_participants_session_index (session_id),
  KEY live_quiz_participants_user_index (user_id),
  CONSTRAINT live_quiz_participants_session_fk FOREIGN KEY (session_id) REFERENCES live_quiz_sessions(id) ON DELETE CASCADE,
  CONSTRAINT live_quiz_participants_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS live_quiz_answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  participant_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED NOT NULL,
  selected_answer_json JSON NULL,
  correct_answer_json JSON NULL,
  is_correct TINYINT(1) DEFAULT 0,
  points_awarded INT DEFAULT 0,
  response_time_ms INT NULL,
  mistake_key VARCHAR(190) NULL,
  answered_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY live_quiz_answers_participant_question_unique (participant_id, question_id),
  KEY live_quiz_answers_session_index (session_id),
  KEY live_quiz_answers_question_index (question_id),
  CONSTRAINT live_quiz_answers_session_fk FOREIGN KEY (session_id) REFERENCES live_quiz_sessions(id) ON DELETE CASCADE,
  CONSTRAINT live_quiz_answers_participant_fk FOREIGN KEY (participant_id) REFERENCES live_quiz_participants(id) ON DELETE CASCADE,
  CONSTRAINT live_quiz_answers_question_fk FOREIGN KEY (question_id) REFERENCES teacher_quiz_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS public_quiz_leaderboards (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  quiz_id BIGINT UNSIGNED NOT NULL,
  participant_name VARCHAR(120) NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  score INT DEFAULT 0,
  total_points INT DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  hidden_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY public_quiz_leaderboards_quiz_index (quiz_id),
  KEY public_quiz_leaderboards_rank_index (score, duration_seconds),
  CONSTRAINT public_quiz_leaderboards_quiz_fk FOREIGN KEY (quiz_id) REFERENCES teacher_quizzes(id) ON DELETE CASCADE,
  CONSTRAINT public_quiz_leaderboards_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
