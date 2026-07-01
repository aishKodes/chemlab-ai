<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\AuthMiddleware;
use PDO;

final class AnalyticsController
{
    private const ALLOWED_TYPES = ['learning', 'simulation', 'resource', 'ai', 'auth', 'page'];

    public function __construct(private readonly PDO $pdo)
    {
    }

    public function store(Request $request): Response
    {
        $input = $request->json();
        $eventType = (string) ($input['event_type'] ?? '');
        $eventName = trim((string) ($input['event_name'] ?? ''));

        if (!in_array($eventType, self::ALLOWED_TYPES, true) || $eventName === '') {
            return Response::error('VALIDATION_ERROR', 'event_type and event_name are required.', 422);
        }

        $user = AuthMiddleware::user($request, $this->pdo);
        $stmt = $this->pdo->prepare(
            'INSERT INTO learning_events
             (user_id, anonymous_id, session_id, event_type, event_name, class_id, subject_id, chapter_id, topic_id, resource_id, page_path, metadata, created_at)
             VALUES (:user_id, :anonymous_id, :session_id, :event_type, :event_name, :class_id, :subject_id, :chapter_id, :topic_id, :resource_id, :page_path, :metadata, NOW())'
        );
        $stmt->execute([
            'user_id' => $user['id'] ?? null,
            'anonymous_id' => $input['anonymous_id'] ?? null,
            'session_id' => $input['session_id'] ?? null,
            'event_type' => $eventType,
            'event_name' => $eventName,
            'class_id' => $input['class_id'] ?? null,
            'subject_id' => $input['subject_id'] ?? null,
            'chapter_id' => $input['chapter_id'] ?? null,
            'topic_id' => $input['topic_id'] ?? null,
            'resource_id' => $input['resource_id'] ?? null,
            'page_path' => $input['page_path'] ?? null,
            'metadata' => isset($input['metadata']) ? json_encode($input['metadata'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : null,
        ]);

        return Response::ok(['event_id' => (int) $this->pdo->lastInsertId()], 201);
    }
}
