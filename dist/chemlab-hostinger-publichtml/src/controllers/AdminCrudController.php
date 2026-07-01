<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Config\Config;
use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\AuthMiddleware;
use Chemlab\Services\AuthService;
use PDO;
use RuntimeException;

final class AdminCrudController
{
    private const ENTITY_CONFIG = [
        'classes' => [
            'table' => 'classes',
            'listKey' => 'classes',
            'fields' => ['class_level', 'display_name', 'status'],
            'filters' => ['class_level', 'status'],
            'search' => ['display_name', 'class_level'],
            'order' => 'class_level ASC',
        ],
        'subjects' => [
            'table' => 'subjects',
            'listKey' => 'subjects',
            'fields' => ['class_id', 'name', 'subject_type', 'status'],
            'filters' => ['class_id', 'subject_type', 'status'],
            'search' => ['name'],
            'order' => 'id DESC',
        ],
        'books' => [
            'table' => 'books',
            'listKey' => 'books',
            'fields' => ['class_id', 'subject_id', 'title', 'source', 'language', 'status'],
            'filters' => ['class_id', 'subject_id', 'status', 'source'],
            'search' => ['title'],
            'order' => 'updated_at DESC',
        ],
        'chapters' => [
            'table' => 'chapters',
            'listKey' => 'chapters',
            'fields' => ['book_id', 'class_id', 'subject_id', 'chapter_number', 'title', 'slug', 'status'],
            'filters' => ['book_id', 'class_id', 'subject_id', 'status'],
            'search' => ['title', 'slug'],
            'order' => 'chapter_number ASC, id DESC',
        ],
        'topics' => [
            'table' => 'topics',
            'listKey' => 'topics',
            'fields' => ['chapter_id', 'class_id', 'subject_id', 'title', 'slug', 'order_index', 'difficulty', 'status'],
            'filters' => ['chapter_id', 'class_id', 'subject_id', 'difficulty', 'status'],
            'search' => ['title', 'slug'],
            'order' => 'order_index ASC, id DESC',
        ],
        'resources' => [
            'table' => 'learning_resources',
            'listKey' => 'resources',
            'fields' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'type', 'title', 'slug', 'description', 'route_url', 'content_json', 'source_type', 'source_reference', 'source_url', 'license_type', 'attribution_text', 'author', 'embed_url', 'external_open_mode', 'quality_status', 'accuracy_notes', 'why_useful', 'student_instructions', 'student_level', 'estimated_minutes', 'status'],
            'filters' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'type', 'status', 'source_type', 'quality_status', 'license_type'],
            'search' => ['title', 'slug', 'description', 'source_reference', 'source_url', 'attribution_text'],
            'json' => ['content_json'],
            'uuid' => true,
            'order' => 'updated_at DESC',
        ],
        'content' => [
            'table' => 'content_blocks',
            'listKey' => 'content',
            'fields' => ['block_key', 'page_slug', 'section', 'type', 'status'],
            'filters' => ['page_slug', 'type', 'status'],
            'search' => ['block_key', 'page_slug', 'section'],
            'order' => 'page_slug ASC, block_key ASC',
        ],
        'translations' => [
            'table' => 'content_translations',
            'listKey' => 'translations',
            'fields' => ['block_id', 'language', 'title', 'body', 'value_json'],
            'filters' => ['block_id', 'language'],
            'search' => ['title', 'body'],
            'json' => ['value_json'],
            'order' => 'id DESC',
        ],
        'media' => [
            'table' => 'media_assets',
            'listKey' => 'media',
            'fields' => ['title', 'alt_text', 'file_url', 'file_path', 'mime_type', 'size_bytes', 'width', 'height', 'usage_context', 'status'],
            'filters' => ['status', 'mime_type', 'usage_context'],
            'search' => ['title', 'alt_text', 'file_url', 'usage_context'],
            'uuid' => true,
            'order' => 'created_at DESC',
        ],
        'email_templates' => [
            'table' => 'email_templates',
            'listKey' => 'templates',
            'fields' => ['template_key', 'subject', 'body_html', 'body_text', 'language', 'status'],
            'filters' => ['language', 'status'],
            'search' => ['template_key', 'subject'],
            'order' => 'template_key ASC',
        ],
        'email_logs' => [
            'table' => 'email_logs',
            'listKey' => 'logs',
            'fields' => [],
            'filters' => ['status', 'template_key', 'user_id'],
            'search' => ['to_email', 'subject', 'error_message'],
            'order' => 'created_at DESC',
            'readonly' => true,
        ],
        'notifications' => [
            'table' => 'notifications',
            'listKey' => 'notifications',
            'fields' => ['user_id', 'role_target', 'title', 'body', 'type', 'action_url', 'metadata'],
            'filters' => ['user_id', 'role_target', 'type'],
            'search' => ['title', 'body'],
            'json' => ['metadata'],
            'order' => 'created_at DESC',
        ],
        'settings' => [
            'table' => 'site_settings',
            'listKey' => 'settings',
            'fields' => ['setting_key', 'setting_value', 'setting_json', 'type', 'is_public'],
            'filters' => ['type', 'is_public'],
            'search' => ['setting_key', 'setting_value'],
            'json' => ['setting_json'],
            'order' => 'setting_key ASC',
        ],
        'learning_events' => [
            'table' => 'learning_events',
            'listKey' => 'events',
            'fields' => [],
            'filters' => ['user_id', 'event_type', 'event_name', 'class_id', 'subject_id', 'chapter_id', 'topic_id', 'resource_id'],
            'search' => ['event_name', 'page_path'],
            'order' => 'created_at DESC',
            'readonly' => true,
        ],
        'memory_decks' => [
            'table' => 'memory_decks',
            'listKey' => 'decks',
            'fields' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'resource_id', 'title', 'slug', 'description', 'language', 'difficulty', 'status', 'source_type', 'source_reference'],
            'filters' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'resource_id', 'difficulty', 'status'],
            'search' => ['title', 'slug', 'description'],
            'uuid' => true,
            'order' => 'updated_at DESC',
        ],
        'memory_cards' => [
            'table' => 'memory_cards',
            'listKey' => 'cards',
            'fields' => ['deck_id', 'front', 'back', 'hint', 'explanation', 'difficulty', 'card_type', 'mistake_type', 'source_reference', 'order_index', 'status'],
            'filters' => ['deck_id', 'difficulty', 'card_type', 'status'],
            'search' => ['front', 'back', 'hint', 'explanation'],
            'order' => 'order_index ASC, id ASC',
        ],
        'quick_drills' => [
            'table' => 'quick_drills',
            'listKey' => 'drills',
            'fields' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'resource_id', 'title', 'slug', 'description', 'language', 'difficulty', 'estimated_minutes', 'status', 'source_type', 'source_reference'],
            'filters' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'resource_id', 'difficulty', 'status'],
            'search' => ['title', 'slug', 'description'],
            'uuid' => true,
            'order' => 'updated_at DESC',
        ],
        'quiz_questions' => [
            'table' => 'quiz_questions',
            'listKey' => 'questions',
            'fields' => ['drill_id', 'class_id', 'subject_id', 'chapter_id', 'topic_id', 'question_text', 'question_type', 'options_json', 'correct_answer_json', 'explanation', 'hint', 'difficulty', 'mistake_type', 'source_reference', 'order_index', 'status'],
            'filters' => ['drill_id', 'class_id', 'subject_id', 'chapter_id', 'topic_id', 'question_type', 'difficulty', 'status'],
            'search' => ['question_text', 'explanation', 'hint'],
            'json' => ['options_json', 'correct_answer_json'],
            'order' => 'order_index ASC, id ASC',
        ],
        'concept_maps' => [
            'table' => 'concept_maps',
            'listKey' => 'concept_maps',
            'fields' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'title', 'slug', 'description', 'map_json', 'status', 'source_reference'],
            'filters' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'status'],
            'search' => ['title', 'slug', 'description'],
            'json' => ['map_json'],
            'uuid' => true,
            'order' => 'updated_at DESC',
        ],
        'mistake_patterns' => [
            'table' => 'mistake_patterns',
            'listKey' => 'mistake_patterns',
            'fields' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'resource_id', 'mistake_key', 'title', 'description', 'correction', 'example', 'severity', 'status'],
            'filters' => ['class_id', 'subject_id', 'chapter_id', 'topic_id', 'resource_id', 'severity', 'status'],
            'search' => ['mistake_key', 'title', 'description', 'correction'],
            'order' => 'updated_at DESC',
        ],
    ];

    public function __construct(private readonly PDO $pdo)
    {
    }

    public function list(Request $request, string $entity): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $config = $this->config($entity);
        $where = [];
        $bindings = [];

        foreach (($config['filters'] ?? []) as $field) {
            if (($request->query[$field] ?? '') !== '') {
                $where[] = "{$field} = :filter_{$field}";
                $bindings["filter_{$field}"] = $request->query[$field];
            }
        }

        $search = trim((string) ($request->query['search'] ?? ''));
        if ($search !== '' && ($config['search'] ?? []) !== []) {
            $parts = [];
            foreach ($config['search'] as $index => $field) {
                $key = "search_{$index}";
                $parts[] = "{$field} LIKE :{$key}";
                $bindings[$key] = '%' . $search . '%';
            }
            $where[] = '(' . implode(' OR ', $parts) . ')';
        }

        $limit = max(1, min(200, (int) ($request->query['limit'] ?? 100)));
        $sql = 'SELECT * FROM ' . $config['table'];
        if ($where !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY ' . $config['order'] . ' LIMIT ' . $limit;

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($bindings);

        return Response::ok([$config['listKey'] => array_map(fn (array $row): array => $this->shapeRow($row), $stmt->fetchAll())]);
    }

    public function show(Request $request, string $entity, array $params): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $config = $this->config($entity);
        $stmt = $this->pdo->prepare('SELECT * FROM ' . $config['table'] . ' WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => (int) ($params['id'] ?? 0)]);
        $row = $stmt->fetch();
        return $row ? Response::ok([$this->singularKey($config['listKey']) => $this->shapeRow($row)]) : Response::error('NOT_FOUND', 'Record not found.', 404);
    }

    public function create(Request $request, string $entity): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $config = $this->config($entity);
        if (($config['readonly'] ?? false) === true) {
            return Response::error('READONLY_ENTITY', 'This record type is read-only.', 405);
        }

        $input = $request->json();
        $fields = $this->fieldsForInsert($config, $input, (int) $admin['id']);
        if ($fields === []) {
            return Response::error('VALIDATION_ERROR', 'No editable fields supplied.', 422);
        }

        $columns = array_keys($fields);
        $placeholders = array_map(fn (string $field): string => ':' . $field, $columns);
        $sql = 'INSERT INTO ' . $config['table'] . ' (' . implode(', ', $columns) . ') VALUES (' . implode(', ', $placeholders) . ')';
        $this->pdo->prepare($sql)->execute($fields);
        $id = (int) $this->pdo->lastInsertId();
        $this->logAdmin((int) $admin['id'], $entity . '.create', $config['table'], $id, ['fields' => array_keys($input)], $request);

        return Response::ok(['id' => $id], 201);
    }

    public function update(Request $request, string $entity, array $params): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $config = $this->config($entity);
        if (($config['readonly'] ?? false) === true) {
            return Response::error('READONLY_ENTITY', 'This record type is read-only.', 405);
        }

        $input = $request->json();
        $fields = $this->fieldsForUpdate($config, $input, (int) $admin['id']);
        if ($fields === []) {
            return Response::error('VALIDATION_ERROR', 'No editable fields supplied.', 422);
        }

        $sets = array_map(fn (string $field): string => "{$field} = :{$field}", array_keys($fields));
        $fields['id'] = (int) ($params['id'] ?? 0);
        $this->pdo->prepare('UPDATE ' . $config['table'] . ' SET ' . implode(', ', $sets) . ' WHERE id = :id')->execute($fields);
        $this->logAdmin((int) $admin['id'], $entity . '.update', $config['table'], (int) ($params['id'] ?? 0), ['fields' => array_keys($input)], $request);

        return Response::ok(['updated' => true]);
    }

    public function delete(Request $request, string $entity, array $params): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $config = $this->config($entity);
        if (!in_array($entity, ['memory_cards', 'quiz_questions'], true)) {
            return Response::error('DELETE_NOT_ALLOWED', 'Archive this record instead of deleting it.', 405);
        }

        $this->pdo->prepare('DELETE FROM ' . $config['table'] . ' WHERE id = :id')->execute(['id' => (int) ($params['id'] ?? 0)]);
        $this->logAdmin((int) $admin['id'], $entity . '.delete', $config['table'], (int) ($params['id'] ?? 0), [], $request);
        return Response::ok(['deleted' => true]);
    }

    public function publishResource(Request $request, array $params): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $id = (int) ($params['id'] ?? 0);
        $stmt = $this->pdo->prepare('SELECT * FROM learning_resources WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $resource = $stmt->fetch();
        if (!$resource) {
            return Response::error('NOT_FOUND', 'Resource not found.', 404);
        }

        $isExternal = in_array((string) ($resource['type'] ?? ''), ['external_resource', 'video_link', 'visualization'], true)
            || !empty($resource['source_url'])
            || !empty($resource['embed_url']);
        if ($isExternal) {
            foreach (['source_url', 'license_type', 'attribution_text'] as $required) {
                if (trim((string) ($resource[$required] ?? '')) === '') {
                    return Response::error('RESOURCE_REVIEW_REQUIRED', 'External resources need source URL, license, and attribution before publishing.', 422);
                }
            }
        }

        $this->pdo->prepare(
            'UPDATE learning_resources
             SET status = "published", quality_status = IF(quality_status = "verified", "verified", "published"),
                 approved_by = :approved_by, published_at = COALESCE(published_at, NOW()), updated_at = NOW()
             WHERE id = :id'
        )->execute(['approved_by' => $admin['id'], 'id' => $id]);
        $this->logAdmin((int) $admin['id'], 'resources.published', 'learning_resources', $id, ['quality_status' => $resource['quality_status'] ?? null], $request);

        return Response::ok(['updated' => true, 'status' => 'published']);
    }

    public function archiveResource(Request $request, array $params): Response
    {
        return $this->statusAction($request, 'resources', (int) ($params['id'] ?? 0), 'archived');
    }

    public function archiveMedia(Request $request, array $params): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $this->pdo->prepare('UPDATE media_assets SET status = "archived", updated_at = NOW() WHERE id = :id')->execute(['id' => (int) ($params['id'] ?? 0)]);
        $this->logAdmin((int) $admin['id'], 'media.archive', 'media_assets', (int) ($params['id'] ?? 0), [], $request);
        return Response::ok(['archived' => true]);
    }

    public function uploadMedia(Request $request): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $file = $_FILES['file'] ?? null;
        if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            return Response::error('UPLOAD_REQUIRED', 'Choose an image file to upload.', 422);
        }

        $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/svg+xml' => 'svg'];
        $mime = (string) mime_content_type((string) $file['tmp_name']);
        if (!isset($allowed[$mime])) {
            return Response::error('INVALID_FILE_TYPE', 'Only JPG, PNG, WebP, or safe SVG files are allowed.', 422);
        }

        $maxBytes = 5 * 1024 * 1024;
        if ((int) $file['size'] > $maxBytes) {
            return Response::error('FILE_TOO_LARGE', 'Image must be 5 MB or smaller.', 422);
        }

        $uuid = AuthService::uuid();
        $extension = $allowed[$mime];
        $uploadsDir = Config::basePath('uploads');
        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0755, true);
        }
        $filename = $uuid . '.' . $extension;
        $target = $uploadsDir . '/' . $filename;
        if (!move_uploaded_file((string) $file['tmp_name'], $target)) {
            return Response::error('UPLOAD_FAILED', 'Could not store the uploaded file.', 500);
        }

        [$width, $height] = $mime === 'image/svg+xml' ? [null, null] : (getimagesize($target) ?: [null, null]);
        $this->pdo->prepare(
            'INSERT INTO media_assets (uuid, title, alt_text, file_url, file_path, mime_type, size_bytes, width, height, uploaded_by, usage_context, status, created_at, updated_at)
             VALUES (:uuid, :title, :alt_text, :file_url, :file_path, :mime_type, :size_bytes, :width, :height, :uploaded_by, :usage_context, "active", NOW(), NOW())'
        )->execute([
            'uuid' => $uuid,
            'title' => $_POST['title'] ?? $file['name'],
            'alt_text' => $_POST['alt_text'] ?? null,
            'file_url' => '/uploads/' . $filename,
            'file_path' => 'uploads/' . $filename,
            'mime_type' => $mime,
            'size_bytes' => (int) $file['size'],
            'width' => $width,
            'height' => $height,
            'uploaded_by' => $admin['id'],
            'usage_context' => $_POST['usage_context'] ?? null,
        ]);

        $id = (int) $this->pdo->lastInsertId();
        $this->logAdmin((int) $admin['id'], 'media.upload', 'media_assets', $id, ['mime' => $mime], $request);
        return Response::ok(['id' => $id, 'file_url' => '/uploads/' . $filename], 201);
    }

    public function sendNotification(Request $request): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $input = $request->json();
        foreach (['title', 'body'] as $field) {
            if (trim((string) ($input[$field] ?? '')) === '') {
                return Response::error('VALIDATION_ERROR', $field . ' is required.', 422);
            }
        }

        $this->pdo->prepare(
            'INSERT INTO notifications (user_id, role_target, title, body, type, action_url, metadata, created_at)
             VALUES (:user_id, :role_target, :title, :body, :type, :action_url, :metadata, NOW())'
        )->execute([
            'user_id' => $input['user_id'] ?? null,
            'role_target' => $input['role_target'] ?? 'all',
            'title' => $input['title'],
            'body' => $input['body'],
            'type' => $input['type'] ?? 'announcement',
            'action_url' => $input['action_url'] ?? null,
            'metadata' => isset($input['metadata']) ? json_encode($input['metadata'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : null,
        ]);
        $id = (int) $this->pdo->lastInsertId();
        $this->logAdmin((int) $admin['id'], 'notification.send', 'notifications', $id, ['target' => $input['role_target'] ?? 'all'], $request);
        return Response::ok(['id' => $id], 201);
    }

    public function analyticsSummary(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $counts = [
            'users' => $this->count('users'),
            'students' => $this->count('users', 'role = "student"'),
            'teachers' => $this->count('users', 'role = "teacher"'),
            'resources' => $this->count('learning_resources'),
            'published_resources' => $this->count('learning_resources', 'status = "published"'),
            'memory_decks' => $this->count('memory_decks'),
            'quick_drills' => $this->count('quick_drills'),
            'email_failures' => $this->count('email_logs', 'status = "failed"'),
        ];

        $events = $this->pdo->query('SELECT event_name, COUNT(*) AS total FROM learning_events GROUP BY event_name ORDER BY total DESC LIMIT 10')->fetchAll();
        $recent = $this->pdo->query('SELECT * FROM learning_events ORDER BY created_at DESC LIMIT 25')->fetchAll();
        return Response::ok(['summary' => $counts, 'top_events' => $events, 'recent_events' => $recent]);
    }

    private function statusAction(Request $request, string $entity, int $id, string $status): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $config = $this->config($entity);
        $this->pdo->prepare('UPDATE ' . $config['table'] . ' SET status = :status, approved_by = :approved_by, published_at = IF(:status_publish = "published", COALESCE(published_at, NOW()), published_at), updated_at = NOW() WHERE id = :id')
            ->execute(['status' => $status, 'status_publish' => $status, 'approved_by' => $admin['id'], 'id' => $id]);
        $this->logAdmin((int) $admin['id'], $entity . '.' . $status, $config['table'], $id, [], $request);
        return Response::ok(['updated' => true, 'status' => $status]);
    }

    private function config(string $entity): array
    {
        $config = self::ENTITY_CONFIG[$entity] ?? null;
        if (!$config) {
            throw new RuntimeException('Unknown admin entity: ' . $entity);
        }
        return $config;
    }

    private function fieldsForInsert(array $config, array $input, int $adminId): array
    {
        $fields = [];
        if (($config['uuid'] ?? false) === true) {
            $fields['uuid'] = AuthService::uuid();
        }
        foreach ($config['fields'] as $field) {
            if (array_key_exists($field, $input)) {
                $fields[$field] = $this->normalizeValue($field, $input[$field], $config);
            }
        }
        if ($this->hasField($config, 'created_by')) {
            $fields['created_by'] = $adminId;
        }
        if ($this->hasField($config, 'uploaded_by')) {
            $fields['uploaded_by'] = $adminId;
        }
        $fields['created_at'] = date('Y-m-d H:i:s');
        $fields['updated_at'] = date('Y-m-d H:i:s');
        if (($fields['status'] ?? null) === 'published' && $this->hasField($config, 'published_at')) {
            $fields['published_at'] = date('Y-m-d H:i:s');
            $fields['approved_by'] = $adminId;
        }
        return $fields;
    }

    private function fieldsForUpdate(array $config, array $input, int $adminId): array
    {
        $fields = [];
        foreach ($config['fields'] as $field) {
            if (array_key_exists($field, $input)) {
                $fields[$field] = $this->normalizeValue($field, $input[$field], $config);
            }
        }
        if (($fields['status'] ?? null) === 'published' && $this->hasField($config, 'approved_by')) {
            $fields['approved_by'] = $adminId;
            $fields['published_at'] = date('Y-m-d H:i:s');
        }
        if ($this->hasField($config, 'updated_by')) {
            $fields['updated_by'] = $adminId;
        }
        $fields['updated_at'] = date('Y-m-d H:i:s');
        return $fields;
    }

    private function normalizeValue(string $field, mixed $value, array $config): mixed
    {
        if ($value === '') {
            return null;
        }
        if (in_array($field, $config['json'] ?? [], true)) {
            if (is_string($value)) {
                $decoded = json_decode($value, true);
                return json_encode($decoded ?? $value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            }
            return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }
        return $value;
    }

    private function hasField(array $config, string $field): bool
    {
        static $cache = [];
        $table = $config['table'];
        if (!isset($cache[$table])) {
            $stmt = $this->pdo->query('SHOW COLUMNS FROM ' . $table);
            $cache[$table] = array_column($stmt->fetchAll(), 'Field');
        }
        return in_array($field, $cache[$table], true);
    }

    private function shapeRow(array $row): array
    {
        foreach ($row as $key => $value) {
            if (is_string($value) && (str_ends_with($key, '_json') || $key === 'metadata' || $key === 'classes_taught')) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $row[$key] = $decoded;
                }
            }
        }
        return $row;
    }

    private function singularKey(string $listKey): string
    {
        return match ($listKey) {
            'classes' => 'class',
            'media' => 'media',
            default => rtrim($listKey, 's'),
        };
    }

    private function count(string $table, ?string $where = null): int
    {
        return (int) $this->pdo->query('SELECT COUNT(*) FROM ' . $table . ($where ? ' WHERE ' . $where : ''))->fetchColumn();
    }

    private function logAdmin(int $adminId, string $action, ?string $entityType, ?int $entityId, array $metadata, Request $request): void
    {
        $this->pdo->prepare(
            'INSERT INTO admin_activity_logs (admin_user_id, action, entity_type, entity_id, metadata, ip_hash, created_at)
             VALUES (:admin_user_id, :action, :entity_type, :entity_id, :metadata, :ip_hash, NOW())'
        )->execute([
            'admin_user_id' => $adminId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata' => json_encode($metadata, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'ip_hash' => hash('sha256', $request->ip()),
        ]);
    }
}
