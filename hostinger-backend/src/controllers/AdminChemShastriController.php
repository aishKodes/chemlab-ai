<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\AuthMiddleware;
use PDO;

final class AdminChemShastriController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function summary(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        return Response::ok([
            'summary' => [
                'questions_today' => $this->countWhere('chem_shastri_question_logs', 'DATE(created_at) = CURDATE()'),
                'questions_total' => $this->count('chem_shastri_question_logs'),
                'usage_total' => $this->count('ai_usage_logs'),
                'low_rated' => $this->countWhere('chem_shastri_question_logs', "helpful_rating IN ('not_helpful','too_hard','too_long','wrong')"),
                'top_intents' => $this->groupCount('chem_shastri_question_logs', 'intent'),
                'top_modes' => $this->groupCount('chem_shastri_question_logs', 'mode'),
            ],
        ]);
    }

    public function questions(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        return Response::ok(['questions' => $this->recentRows('chem_shastri_question_logs')]);
    }

    public function usage(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        return Response::ok(['usage' => $this->recentRows('ai_usage_logs')]);
    }

    public function test(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $input = $request->json();
        $message = trim((string) ($input['message'] ?? 'What is oxidation?'));
        $answer = stripos($message, 'reduction') !== false
            ? 'Reduction means gain of electrons. GER: Gain of Electrons is Reduction.'
            : 'Oxidation means loss of electrons. LEO: Loss of Electrons is Oxidation.';

        return Response::ok([
            'answer' => $answer,
            'provider' => 'backend-direct',
            'model' => 'rule-based',
            'estimated_cost_inr' => 0,
        ]);
    }

    public function retrievalTest(Request $request): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $input = $request->json();
        $query = trim((string) ($input['query'] ?? 'redox'));
        $like = '%' . $query . '%';
        $stmt = $this->pdo->prepare(
            'SELECT id, title, slug, type, description, route_url
             FROM learning_resources
             WHERE title LIKE :like OR slug LIKE :like OR description LIKE :like
             ORDER BY published_at DESC, created_at DESC
             LIMIT 20'
        );
        $stmt->execute(['like' => $like]);

        return Response::ok(['resources' => $stmt->fetchAll()]);
    }

    private function count(string $table): int
    {
        return (int) $this->pdo->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
    }

    private function countWhere(string $table, string $where): int
    {
        return (int) $this->pdo->query("SELECT COUNT(*) FROM {$table} WHERE {$where}")->fetchColumn();
    }

    private function recentRows(string $table): array
    {
        $stmt = $this->pdo->query("SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 100");
        return $stmt->fetchAll();
    }

    private function groupCount(string $table, string $field): array
    {
        $stmt = $this->pdo->query("SELECT {$field} AS label, COUNT(*) AS total FROM {$table} WHERE {$field} IS NOT NULL GROUP BY {$field} ORDER BY total DESC LIMIT 20");
        return $stmt->fetchAll();
    }
}
