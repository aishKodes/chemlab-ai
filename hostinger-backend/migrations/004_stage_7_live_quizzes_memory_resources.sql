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
