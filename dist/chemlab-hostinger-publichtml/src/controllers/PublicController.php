<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use PDO;

final class PublicController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function settings(): Response
    {
        $stmt = $this->pdo->query('SELECT setting_key, setting_value, setting_json, type FROM site_settings WHERE is_public = 1 ORDER BY setting_key ASC');
        $settings = [];
        foreach ($stmt->fetchAll() as $row) {
            $settings[$row['setting_key']] = $row['setting_json'] ? json_decode((string) $row['setting_json'], true) : $this->cast((string) $row['setting_value'], (string) $row['type']);
        }

        return Response::ok(['settings' => $settings]);
    }

    public function content(): Response
    {
        $stmt = $this->pdo->query(
            'SELECT content_blocks.block_key, content_blocks.page_slug, content_blocks.section, content_blocks.type,
                    content_translations.language, content_translations.title, content_translations.body, content_translations.value_json
             FROM content_blocks
             LEFT JOIN content_translations ON content_translations.block_id = content_blocks.id
             WHERE content_blocks.status = "published"
             ORDER BY content_blocks.page_slug ASC, content_blocks.block_key ASC'
        );

        return Response::ok(['content' => $stmt->fetchAll()]);
    }

    public function classes(): Response
    {
        $stmt = $this->pdo->query(
            'SELECT classes.id, classes.class_level, classes.display_name, subjects.id AS subject_id,
                    subjects.name AS subject_name, subjects.subject_type
             FROM classes
             INNER JOIN subjects ON subjects.class_id = classes.id
             WHERE classes.status = "active" AND subjects.status = "active"
             ORDER BY classes.class_level ASC'
        );

        return Response::ok(['classes' => $stmt->fetchAll()]);
    }

    public function classDetail(Request $request, array $params): Response
    {
        $stmt = $this->pdo->prepare(
            'SELECT classes.id, classes.class_level, classes.display_name, subjects.id AS subject_id,
                    subjects.name AS subject_name, subjects.subject_type
             FROM classes
             INNER JOIN subjects ON subjects.class_id = classes.id
             WHERE classes.class_level = :class_level AND classes.status = "active"
             LIMIT 1'
        );
        $stmt->execute(['class_level' => $params['classLevel'] ?? '']);
        $class = $stmt->fetch();
        if (!$class) {
            return Response::error('NOT_FOUND', 'Class not found.', 404);
        }

        $resources = $this->pdo->prepare(
            'SELECT learning_resources.*, classes.class_level, classes.display_name, subjects.name AS subject_name
             FROM learning_resources
             LEFT JOIN classes ON classes.id = learning_resources.class_id
             LEFT JOIN subjects ON subjects.id = learning_resources.subject_id
             WHERE learning_resources.class_id = :class_id AND learning_resources.status = "published"
             ORDER BY learning_resources.published_at DESC, learning_resources.updated_at DESC'
        );
        $resources->execute(['class_id' => $class['id']]);

        return Response::ok(['class' => $class, 'resources' => array_map([$this, 'resourceShape'], $resources->fetchAll())]);
    }

    public function resources(Request $request): Response
    {
        $stmt = $this->pdo->prepare(
            'SELECT learning_resources.*, classes.class_level, classes.display_name, subjects.name AS subject_name
             FROM learning_resources
             LEFT JOIN classes ON classes.id = learning_resources.class_id
             LEFT JOIN subjects ON subjects.id = learning_resources.subject_id
             WHERE learning_resources.status = "published"
             ORDER BY learning_resources.published_at DESC, learning_resources.updated_at DESC'
        );
        $stmt->execute();

        return Response::ok(['resources' => array_map([$this, 'resourceShape'], $stmt->fetchAll())]);
    }

    public function resource(Request $request, array $params): Response
    {
        $stmt = $this->pdo->prepare(
            'SELECT learning_resources.*, classes.class_level, classes.display_name, subjects.name AS subject_name
             FROM learning_resources
             LEFT JOIN classes ON classes.id = learning_resources.class_id
             LEFT JOIN subjects ON subjects.id = learning_resources.subject_id
             WHERE learning_resources.slug = :slug AND learning_resources.status = "published"
             LIMIT 1'
        );
        $stmt->execute(['slug' => $params['slug'] ?? '']);
        $resource = $stmt->fetch();
        if (!$resource) {
            return Response::error('NOT_FOUND', 'Resource not found.', 404);
        }

        return Response::ok(['resource' => $this->resourceShape($resource)]);
    }

    private function resourceShape(array $row): array
    {
        $row['content_json'] = $row['content_json'] ? json_decode((string) $row['content_json'], true) : null;
        return $row;
    }

    private function cast(string $value, string $type): mixed
    {
        return match ($type) {
            'boolean' => in_array(strtolower($value), ['1', 'true', 'yes'], true),
            'number' => is_numeric($value) ? $value + 0 : 0,
            'json' => json_decode($value, true),
            default => $value,
        };
    }
}
