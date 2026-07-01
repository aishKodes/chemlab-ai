<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\AuthMiddleware;
use Chemlab\Services\AnalyticsRollupService;
use PDO;

final class AdminAnalyticsController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function summary(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        return Response::ok([
            'summary' => [
                'events' => $this->count('learning_events'),
                'resource_sessions' => $this->count('resource_sessions'),
                'simulation_sessions' => $this->count('simulation_sessions'),
                'mistakes' => $this->count('mistake_events'),
                'memory_reviews' => $this->count('memory_reviews'),
                'quick_drill_attempts' => $this->count('quiz_attempts'),
                'chem_shastri_questions' => $this->count('chem_shastri_question_logs'),
                'classrooms' => $this->count('teacher_classrooms'),
            ],
            'recent_rollups' => $this->recent('daily_learning_rollups'),
        ]);
    }

    public function events(Request $request): Response
    {
        return $this->table($request, 'learning_events', 'events');
    }

    public function resources(Request $request): Response
    {
        return $this->table($request, 'resource_sessions', 'sessions');
    }

    public function simulations(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $sessions = $this->recentRows('simulation_sessions');
        $top = $this->groupCount('simulation_sessions', 'simulation_slug');
        return Response::ok(['sessions' => $sessions, 'top_simulations' => $top]);
    }

    public function mistakes(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        return Response::ok([
            'mistakes' => $this->recentRows('mistake_events'),
            'top_mistakes' => $this->groupCount('mistake_events', 'mistake_key'),
        ]);
    }

    public function chemShastri(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        return Response::ok([
            'questions' => $this->recentRows('chem_shastri_question_logs'),
            'top_intents' => $this->groupCount('chem_shastri_question_logs', 'intent'),
        ]);
    }

    public function students(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        return Response::ok([
            'students' => $this->roleUsers('student'),
            'active_students' => $this->activeUsers('student'),
        ]);
    }

    public function teachers(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        return Response::ok([
            'teachers' => $this->roleUsers('teacher'),
            'classrooms' => $this->recentRows('teacher_classrooms'),
        ]);
    }

    public function rollups(Request $request): Response
    {
        return $this->table($request, 'daily_learning_rollups', 'rollups');
    }

    public function runRollups(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $date = $request->json()['date'] ?? $request->query['date'] ?? null;
        return Response::ok(['rollup' => (new AnalyticsRollupService($this->pdo))->run(is_string($date) ? $date : null)]);
    }

    public function rollupStatus(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $last = $this->pdo->query('SELECT rollup_date, updated_at FROM daily_learning_rollups ORDER BY updated_at DESC LIMIT 1')->fetch();
        return Response::ok(['last_rollup' => $last ?: null]);
    }

    private function table(Request $request, string $table, string $key): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        return Response::ok([$key => $this->recentRows($table)]);
    }

    private function recentRows(string $table): array
    {
        $stmt = $this->pdo->query("SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 100");
        return $stmt->fetchAll();
    }

    private function recent(string $table): array
    {
        return $this->recentRows($table);
    }

    private function count(string $table): int
    {
        return (int) $this->pdo->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
    }

    private function groupCount(string $table, string $field): array
    {
        $stmt = $this->pdo->query("SELECT {$field} AS label, COUNT(*) AS total FROM {$table} WHERE {$field} IS NOT NULL GROUP BY {$field} ORDER BY total DESC LIMIT 20");
        return $stmt->fetchAll();
    }

    private function roleUsers(string $role): array
    {
        $stmt = $this->pdo->prepare('SELECT id, uuid, role, name, email, status, created_at FROM users WHERE role = :role ORDER BY created_at DESC LIMIT 100');
        $stmt->execute(['role' => $role]);
        return $stmt->fetchAll();
    }

    private function activeUsers(string $role): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(DISTINCT users.id)
             FROM users
             INNER JOIN learning_events ON learning_events.user_id = users.id
             WHERE users.role = :role AND learning_events.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
        );
        $stmt->execute(['role' => $role]);
        return (int) $stmt->fetchColumn();
    }
}
