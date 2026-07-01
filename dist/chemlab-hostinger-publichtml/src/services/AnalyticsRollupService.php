<?php

declare(strict_types=1);

namespace Chemlab\Services;

use PDO;

final class AnalyticsRollupService
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function run(?string $date = null): array
    {
        $date ??= date('Y-m-d');
        $this->rollupAll($date);
        $userRows = $this->rollupUsers($date);

        return ['date' => $date, 'user_rollups' => $userRows, 'status' => 'complete'];
    }

    private function rollupAll(string $date): void
    {
        $stmt = $this->pdo->prepare(
            'SELECT
                COUNT(*) AS events_count,
                SUM(event_type = "resource") AS resources_viewed,
                SUM(event_name = "simulation_opened") AS simulations_started,
                0 AS simulations_completed,
                0 AS mistakes_count,
                0 AS memory_reviews_count,
                0 AS quick_drill_attempts_count,
                0 AS chem_shastri_questions_count,
                0 AS total_time_seconds
             FROM learning_events
             WHERE DATE(created_at) = :date'
        );
        $stmt->execute(['date' => $date]);
        $row = $stmt->fetch() ?: [];
        $this->upsert($date, null, null, null, null, null, $row);
    }

    private function rollupUsers(string $date): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT user_id,
                COUNT(*) AS events_count,
                SUM(event_type = "resource") AS resources_viewed,
                SUM(event_name = "simulation_opened") AS simulations_started,
                0 AS simulations_completed,
                0 AS mistakes_count,
                0 AS memory_reviews_count,
                0 AS quick_drill_attempts_count,
                0 AS chem_shastri_questions_count,
                0 AS total_time_seconds
             FROM learning_events
             WHERE DATE(created_at) = :date AND user_id IS NOT NULL
             GROUP BY user_id'
        );
        $stmt->execute(['date' => $date]);
        $count = 0;
        foreach ($stmt->fetchAll() as $row) {
            $this->upsert($date, (int) $row['user_id'], null, null, null, null, $row);
            $count++;
        }

        $this->mergeStage4Counts($date);
        return $count;
    }

    private function mergeStage4Counts(string $date): void
    {
        $this->mergeMetric($date, 'mistake_events', 'mistakes_count');
        $this->mergeMetric($date, 'memory_reviews', 'memory_reviews_count');
        $this->mergeMetric($date, 'quiz_attempts', 'quick_drill_attempts_count');
        $this->mergeMetric($date, 'chem_shastri_question_logs', 'chem_shastri_questions_count');
    }

    private function mergeMetric(string $date, string $table, string $column): void
    {
        $stmt = $this->pdo->prepare("SELECT user_id, COUNT(*) AS total FROM {$table} WHERE DATE(created_at) = :date AND user_id IS NOT NULL GROUP BY user_id");
        $stmt->execute(['date' => $date]);
        foreach ($stmt->fetchAll() as $row) {
            $update = $this->pdo->prepare("UPDATE daily_learning_rollups SET {$column} = :total, updated_at = NOW() WHERE rollup_date = :date AND user_id = :user_id");
            $update->execute(['date' => $date, 'user_id' => $row['user_id'], 'total' => (int) $row['total']]);
        }
    }

    private function upsert(string $date, ?int $userId, ?int $classId, ?int $chapterId, ?int $topicId, ?int $resourceId, array $row): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO daily_learning_rollups
             (rollup_date, user_id, class_id, chapter_id, topic_id, resource_id, events_count, resources_viewed,
              simulations_started, simulations_completed, mistakes_count, memory_reviews_count, quick_drill_attempts_count,
              chem_shastri_questions_count, total_time_seconds, created_at, updated_at)
             VALUES (:rollup_date, :user_id, :class_id, :chapter_id, :topic_id, :resource_id, :events_count, :resources_viewed,
              :simulations_started, :simulations_completed, :mistakes_count, :memory_reviews_count, :quick_drill_attempts_count,
              :chem_shastri_questions_count, :total_time_seconds, NOW(), NOW())
             ON DUPLICATE KEY UPDATE events_count = VALUES(events_count), resources_viewed = VALUES(resources_viewed),
              simulations_started = VALUES(simulations_started), simulations_completed = VALUES(simulations_completed),
              total_time_seconds = VALUES(total_time_seconds), updated_at = NOW()'
        );
        $stmt->execute([
            'rollup_date' => $date,
            'user_id' => $userId,
            'class_id' => $classId,
            'chapter_id' => $chapterId,
            'topic_id' => $topicId,
            'resource_id' => $resourceId,
            'events_count' => (int) ($row['events_count'] ?? 0),
            'resources_viewed' => (int) ($row['resources_viewed'] ?? 0),
            'simulations_started' => (int) ($row['simulations_started'] ?? 0),
            'simulations_completed' => (int) ($row['simulations_completed'] ?? 0),
            'mistakes_count' => (int) ($row['mistakes_count'] ?? 0),
            'memory_reviews_count' => (int) ($row['memory_reviews_count'] ?? 0),
            'quick_drill_attempts_count' => (int) ($row['quick_drill_attempts_count'] ?? 0),
            'chem_shastri_questions_count' => (int) ($row['chem_shastri_questions_count'] ?? 0),
            'total_time_seconds' => (int) ($row['total_time_seconds'] ?? 0),
        ]);
    }
}
