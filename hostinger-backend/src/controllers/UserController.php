<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\AuthMiddleware;
use PDO;

final class UserController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function profile(Request $request): Response
    {
        $user = AuthMiddleware::requireUser($request, $this->pdo);
        return Response::ok(['user' => $user]);
    }

    public function updateProfile(Request $request): Response
    {
        $user = AuthMiddleware::requireUser($request, $this->pdo);
        $input = $request->json();

        $this->pdo->beginTransaction();
        try {
            $this->pdo->prepare(
                'UPDATE users SET name = COALESCE(:name, name), phone = COALESCE(:phone, phone),
                        preferred_language = COALESCE(:preferred_language, preferred_language), updated_at = NOW()
                 WHERE id = :id'
            )->execute([
                'name' => isset($input['name']) ? trim((string) $input['name']) : null,
                'phone' => $input['phone'] ?? null,
                'preferred_language' => $input['preferred_language'] ?? null,
                'id' => $user['id'],
            ]);

            if (($user['role'] ?? '') === 'student' || array_key_exists('class_level', $input) || array_key_exists('board', $input) || array_key_exists('learning_goal', $input)) {
                $this->pdo->prepare(
                    'INSERT INTO student_profiles (user_id, class_level, board, school_name, learning_goal, created_at, updated_at)
                     VALUES (:user_id, :class_level, :board, :school_name, :learning_goal, NOW(), NOW())
                     ON DUPLICATE KEY UPDATE
                       class_level = COALESCE(VALUES(class_level), class_level),
                       board = COALESCE(VALUES(board), board),
                       school_name = COALESCE(VALUES(school_name), school_name),
                       learning_goal = COALESCE(VALUES(learning_goal), learning_goal),
                       updated_at = NOW()'
                )->execute([
                    'user_id' => $user['id'],
                    'class_level' => $input['class_level'] ?? null,
                    'board' => $input['board'] ?? null,
                    'school_name' => $input['school_name'] ?? null,
                    'learning_goal' => $input['learning_goal'] ?? null,
                ]);
            }

            if (($user['role'] ?? '') === 'teacher' || array_key_exists('school_or_institute', $input) || array_key_exists('classes_taught', $input)) {
                $classesTaught = $input['classes_taught'] ?? null;
                if (is_string($classesTaught)) {
                    $classesTaught = array_values(array_filter(array_map('trim', explode(',', $classesTaught))));
                }
                $this->pdo->prepare(
                    'INSERT INTO teacher_profiles (user_id, school_or_institute, subject, classes_taught, created_at, updated_at)
                     VALUES (:user_id, :school_or_institute, :subject, :classes_taught, NOW(), NOW())
                     ON DUPLICATE KEY UPDATE
                       school_or_institute = COALESCE(VALUES(school_or_institute), school_or_institute),
                       subject = COALESCE(VALUES(subject), subject),
                       classes_taught = COALESCE(VALUES(classes_taught), classes_taught),
                       updated_at = NOW()'
                )->execute([
                    'user_id' => $user['id'],
                    'school_or_institute' => $input['school_or_institute'] ?? null,
                    'subject' => $input['subject'] ?? null,
                    'classes_taught' => $classesTaught === null ? null : json_encode($classesTaught, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                ]);
            }

            $this->pdo->commit();
        } catch (\Throwable $throwable) {
            $this->pdo->rollBack();
            throw $throwable;
        }

        return $this->profile($request);
    }

    public function notifications(Request $request): Response
    {
        $user = AuthMiddleware::requireUser($request, $this->pdo);
        $stmt = $this->pdo->prepare(
            'SELECT id, title, body, type, read_at, action_url, metadata, created_at
             FROM notifications
             WHERE user_id = :user_id OR user_id IS NULL OR role_target IN (:role_target, "all")
             ORDER BY created_at DESC
             LIMIT 50'
        );
        $stmt->execute([
            'user_id' => $user['id'],
            'role_target' => $user['role'],
        ]);

        return Response::ok(['notifications' => $stmt->fetchAll()]);
    }

    public function markNotificationRead(Request $request, array $params): Response
    {
        $user = AuthMiddleware::requireUser($request, $this->pdo);
        $stmt = $this->pdo->prepare('UPDATE notifications SET read_at = NOW() WHERE id = :id AND (user_id = :user_id OR user_id IS NULL OR role_target IN (:role_target, "all"))');
        $stmt->execute([
            'id' => (int) ($params['id'] ?? 0),
            'user_id' => $user['id'],
            'role_target' => $user['role'],
        ]);

        return Response::ok(['read' => true]);
    }
}
