<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\AuthMiddleware;
use Chemlab\Services\AuthService;
use Chemlab\Services\MailService;
use PDO;

final class AdminController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function users(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $stmt = $this->pdo->query('SELECT id, uuid, role, name, email, status, email_verified_at, last_login_at, created_at FROM users ORDER BY created_at DESC LIMIT 100');
        return Response::ok(['users' => $stmt->fetchAll()]);
    }

    public function user(Request $request, array $params): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $stmt = $this->pdo->prepare('SELECT id, uuid, role, name, email, phone, preferred_language, status, email_verified_at, last_login_at, created_at, updated_at FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => (int) ($params['id'] ?? 0)]);
        $user = $stmt->fetch();
        return $user ? Response::ok(['user' => $user]) : Response::error('NOT_FOUND', 'User not found.', 404);
    }

    public function updateUserStatus(Request $request, array $params): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $status = (string) $request->input('status', '');
        if (!in_array($status, ['pending', 'active', 'blocked', 'deleted'], true)) {
            return Response::error('VALIDATION_ERROR', 'Invalid user status.', 422);
        }

        $this->pdo->prepare('UPDATE users SET status = :status, updated_at = NOW() WHERE id = :id')->execute([
            'status' => $status,
            'id' => (int) ($params['id'] ?? 0),
        ]);
        $this->logAdmin((int) $admin['id'], 'user.status.update', 'user', (int) ($params['id'] ?? 0), ['status' => $status], $request);

        return Response::ok(['updated' => true]);
    }

    public function updateUserRole(Request $request, array $params): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $role = (string) $request->input('role', '');
        $userId = (int) ($params['id'] ?? 0);
        if (!in_array($role, ['student', 'teacher', 'admin'], true)) {
            return Response::error('VALIDATION_ERROR', 'Invalid user role.', 422);
        }

        $this->pdo->beginTransaction();
        try {
            $this->pdo->prepare('UPDATE users SET role = :role, updated_at = NOW() WHERE id = :id')->execute([
                'role' => $role,
                'id' => $userId,
            ]);

            if ($role === 'student') {
                $this->pdo->prepare(
                    'INSERT INTO student_profiles (user_id, created_at, updated_at)
                     VALUES (:user_id, NOW(), NOW())
                     ON DUPLICATE KEY UPDATE updated_at = NOW()'
                )->execute(['user_id' => $userId]);
            }

            if ($role === 'teacher') {
                $this->pdo->prepare(
                    'INSERT INTO teacher_profiles (user_id, created_at, updated_at)
                     VALUES (:user_id, NOW(), NOW())
                     ON DUPLICATE KEY UPDATE updated_at = NOW()'
                )->execute(['user_id' => $userId]);
            }

            $this->logAdmin((int) $admin['id'], 'user.role.update', 'user', $userId, ['role' => $role], $request);
            $this->pdo->commit();
        } catch (\Throwable $throwable) {
            $this->pdo->rollBack();
            throw $throwable;
        }

        return Response::ok(['updated' => true, 'role' => $role]);
    }

    public function verifyTeacher(Request $request, array $params): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $status = (string) $request->input('verification_status', 'verified');
        if (!in_array($status, ['unverified', 'pending', 'verified'], true)) {
            return Response::error('VALIDATION_ERROR', 'Invalid teacher verification status.', 422);
        }

        $teacherUserId = (int) ($params['id'] ?? 0);
        $this->pdo->prepare(
            'UPDATE teacher_profiles SET verification_status = :status, updated_at = NOW() WHERE user_id = :user_id'
        )->execute([
            'status' => $status,
            'user_id' => $teacherUserId,
        ]);
        $this->logAdmin((int) $admin['id'], 'teacher.verify', 'teacher_profile', $teacherUserId, ['verification_status' => $status], $request);

        return Response::ok(['updated' => true, 'verification_status' => $status]);
    }

    public function studentProfile(Request $request, array $params): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $stmt = $this->pdo->prepare('SELECT * FROM student_profiles WHERE user_id = :user_id LIMIT 1');
        $stmt->execute(['user_id' => (int) ($params['id'] ?? 0)]);
        $profile = $stmt->fetch();

        return $profile ? Response::ok(['profile' => $profile]) : Response::error('NOT_FOUND', 'Student profile not found.', 404);
    }

    public function teacherProfile(Request $request, array $params): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $stmt = $this->pdo->prepare('SELECT * FROM teacher_profiles WHERE user_id = :user_id LIMIT 1');
        $stmt->execute(['user_id' => (int) ($params['id'] ?? 0)]);
        $profile = $stmt->fetch();
        if ($profile && isset($profile['classes_taught']) && is_string($profile['classes_taught'])) {
            $decoded = json_decode($profile['classes_taught'], true);
            $profile['classes_taught'] = json_last_error() === JSON_ERROR_NONE ? $decoded : $profile['classes_taught'];
        }

        return $profile ? Response::ok(['profile' => $profile]) : Response::error('NOT_FOUND', 'Teacher profile not found.', 404);
    }

    public function resources(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $stmt = $this->pdo->query('SELECT * FROM learning_resources ORDER BY updated_at DESC LIMIT 100');
        return Response::ok(['resources' => $stmt->fetchAll()]);
    }

    public function createResource(Request $request): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $input = $request->json();
        foreach (['type', 'title', 'slug'] as $field) {
            if (trim((string) ($input[$field] ?? '')) === '') {
                return Response::error('VALIDATION_ERROR', $field . ' is required.', 422);
            }
        }

        $this->pdo->prepare(
            'INSERT INTO learning_resources
             (uuid, class_id, subject_id, chapter_id, topic_id, type, title, slug, description, route_url, content_json, source_type, source_reference, status, created_by, published_at, created_at, updated_at)
             VALUES (:uuid, :class_id, :subject_id, :chapter_id, :topic_id, :type, :title, :slug, :description, :route_url, :content_json, :source_type, :source_reference, :status, :created_by, IF(:status_publish = "published", NOW(), NULL), NOW(), NOW())'
        )->execute([
            'uuid' => AuthService::uuid(),
            'class_id' => $input['class_id'] ?? null,
            'subject_id' => $input['subject_id'] ?? null,
            'chapter_id' => $input['chapter_id'] ?? null,
            'topic_id' => $input['topic_id'] ?? null,
            'type' => $input['type'],
            'title' => $input['title'],
            'slug' => $input['slug'],
            'description' => $input['description'] ?? null,
            'route_url' => $input['route_url'] ?? null,
            'content_json' => isset($input['content_json']) ? json_encode($input['content_json'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : null,
            'source_type' => $input['source_type'] ?? 'CUSTOM',
            'source_reference' => $input['source_reference'] ?? null,
            'status' => $input['status'] ?? 'draft',
            'status_publish' => $input['status'] ?? 'draft',
            'created_by' => $admin['id'],
        ]);

        return Response::ok(['resource_id' => (int) $this->pdo->lastInsertId()], 201);
    }

    public function updateResource(Request $request, array $params): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $input = $request->json();
        $this->pdo->prepare(
            'UPDATE learning_resources
             SET title = COALESCE(:title, title), description = COALESCE(:description, description),
                 route_url = COALESCE(:route_url, route_url), status = COALESCE(:status, status),
                 approved_by = :approved_by, published_at = IF(:status_publish = "published" AND published_at IS NULL, NOW(), published_at),
                 updated_at = NOW()
             WHERE id = :id'
        )->execute([
            'title' => $input['title'] ?? null,
            'description' => $input['description'] ?? null,
            'route_url' => $input['route_url'] ?? null,
            'status' => $input['status'] ?? null,
            'approved_by' => $admin['id'],
            'status_publish' => $input['status'] ?? null,
            'id' => (int) ($params['id'] ?? 0),
        ]);

        return Response::ok(['updated' => true]);
    }

    public function settings(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $stmt = $this->pdo->query('SELECT * FROM site_settings ORDER BY setting_key ASC');
        return Response::ok(['settings' => $stmt->fetchAll()]);
    }

    public function updateSetting(Request $request, array $params): Response
    {
        $admin = AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $value = $request->input('setting_value');
        $json = $request->input('setting_json');
        $this->pdo->prepare(
            'UPDATE site_settings SET setting_value = :setting_value, setting_json = :setting_json, updated_by = :updated_by, updated_at = NOW()
             WHERE setting_key = :setting_key'
        )->execute([
            'setting_value' => is_scalar($value) ? (string) $value : null,
            'setting_json' => is_array($json) ? json_encode($json, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : null,
            'updated_by' => $admin['id'],
            'setting_key' => $params['key'] ?? '',
        ]);

        return Response::ok(['updated' => true]);
    }

    public function testEmail(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $to = (string) $request->input('to_email', '');
        if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
            return Response::error('VALIDATION_ERROR', 'A valid to_email is required.', 422);
        }

        return Response::ok(['mail' => (new MailService($this->pdo))->sendTestEmail($to)]);
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
