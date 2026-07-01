<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\AuthMiddleware;
use Chemlab\Services\AuthService;
use PDO;

final class LearningController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function startResourceSession(Request $request): Response
    {
        $input = $request->json();
        $user = AuthMiddleware::user($request, $this->pdo);
        $resource = $this->resourceFromInput($input);
        $uuid = AuthService::uuid();

        $stmt = $this->pdo->prepare(
            'INSERT INTO resource_sessions
             (uuid, user_id, anonymous_id, session_id, resource_id, class_id, subject_id, chapter_id, topic_id, resource_type, started_at, metadata, created_at, updated_at)
             VALUES (:uuid, :user_id, :anonymous_id, :session_id, :resource_id, :class_id, :subject_id, :chapter_id, :topic_id, :resource_type, NOW(), :metadata, NOW(), NOW())'
        );
        $stmt->execute([
            'uuid' => $uuid,
            'user_id' => $user['id'] ?? null,
            'anonymous_id' => $input['anonymous_id'] ?? null,
            'session_id' => $input['session_id'] ?? null,
            'resource_id' => $resource['id'] ?? ($input['resource_id'] ?? null),
            'class_id' => $resource['class_id'] ?? ($input['class_id'] ?? null),
            'subject_id' => $resource['subject_id'] ?? ($input['subject_id'] ?? null),
            'chapter_id' => $resource['chapter_id'] ?? ($input['chapter_id'] ?? null),
            'topic_id' => $resource['topic_id'] ?? ($input['topic_id'] ?? null),
            'resource_type' => $resource['type'] ?? ($input['resource_type'] ?? null),
            'metadata' => $this->json($input['metadata'] ?? null),
        ]);

        return Response::ok(['resource_session_id' => (int) $this->pdo->lastInsertId(), 'uuid' => $uuid], 201);
    }

    public function endResourceSession(Request $request): Response
    {
        $input = $request->json();
        $session = $this->sessionId($input, 'resource_session');
        if ($session <= 0) {
            return Response::error('VALIDATION_ERROR', 'resource_session_id is required.', 422);
        }

        $stmt = $this->pdo->prepare(
            'UPDATE resource_sessions
             SET ended_at = NOW(), duration_seconds = :duration_seconds, completed = :completed,
                 completion_percent = :completion_percent, exit_reason = :exit_reason, metadata = COALESCE(:metadata, metadata), updated_at = NOW()
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $session,
            'duration_seconds' => (int) ($input['duration_seconds'] ?? 0),
            'completed' => !empty($input['completed']) ? 1 : 0,
            'completion_percent' => (int) ($input['completion_percent'] ?? 0),
            'exit_reason' => $input['exit_reason'] ?? null,
            'metadata' => $this->json($input['metadata'] ?? null),
        ]);

        return Response::ok(['ended' => true]);
    }

    public function startSimulationSession(Request $request): Response
    {
        $input = $request->json();
        $user = AuthMiddleware::user($request, $this->pdo);
        $slug = trim((string) ($input['simulation_slug'] ?? $input['simulationSlug'] ?? ''));
        if ($slug === '') {
            return Response::error('VALIDATION_ERROR', 'simulation_slug is required.', 422);
        }
        $resource = $this->resourceBySlug($slug);
        $uuid = AuthService::uuid();

        $stmt = $this->pdo->prepare(
            'INSERT INTO simulation_sessions
             (uuid, user_id, anonymous_id, session_id, simulation_slug, resource_id, class_id, chapter_id, topic_id, started_at, metadata, created_at, updated_at)
             VALUES (:uuid, :user_id, :anonymous_id, :session_id, :simulation_slug, :resource_id, :class_id, :chapter_id, :topic_id, NOW(), :metadata, NOW(), NOW())'
        );
        $stmt->execute([
            'uuid' => $uuid,
            'user_id' => $user['id'] ?? null,
            'anonymous_id' => $input['anonymous_id'] ?? null,
            'session_id' => $input['session_id'] ?? null,
            'simulation_slug' => $slug,
            'resource_id' => $resource['id'] ?? null,
            'class_id' => $resource['class_id'] ?? ($input['class_id'] ?? null),
            'chapter_id' => $resource['chapter_id'] ?? ($input['chapter_id'] ?? null),
            'topic_id' => $resource['topic_id'] ?? ($input['topic_id'] ?? null),
            'metadata' => $this->json($input['metadata'] ?? null),
        ]);

        return Response::ok(['simulation_session_id' => (int) $this->pdo->lastInsertId(), 'uuid' => $uuid], 201);
    }

    public function simulationEvent(Request $request): Response
    {
        $input = $request->json();
        $user = AuthMiddleware::user($request, $this->pdo);
        $slug = trim((string) ($input['simulation_slug'] ?? $input['simulationSlug'] ?? ''));
        $eventName = trim((string) ($input['event_name'] ?? $input['eventName'] ?? ''));
        $stepKey = trim((string) ($input['step_key'] ?? $input['stepKey'] ?? 'general'));
        if ($slug === '' || $eventName === '') {
            return Response::error('VALIDATION_ERROR', 'simulation_slug and event_name are required.', 422);
        }

        $sessionId = $this->sessionId($input, 'simulation_session');
        $stmt = $this->pdo->prepare(
            'INSERT INTO simulation_step_events
             (simulation_session_id, user_id, anonymous_id, simulation_slug, step_key, event_name, success, mistake_key, duration_seconds, metadata, created_at)
             VALUES (:simulation_session_id, :user_id, :anonymous_id, :simulation_slug, :step_key, :event_name, :success, :mistake_key, :duration_seconds, :metadata, NOW())'
        );
        $stmt->execute([
            'simulation_session_id' => $sessionId > 0 ? $sessionId : null,
            'user_id' => $user['id'] ?? null,
            'anonymous_id' => $input['anonymous_id'] ?? null,
            'simulation_slug' => $slug,
            'step_key' => $stepKey,
            'event_name' => $eventName,
            'success' => array_key_exists('success', $input) ? (!empty($input['success']) ? 1 : 0) : null,
            'mistake_key' => $input['mistake_key'] ?? null,
            'duration_seconds' => (int) ($input['duration_seconds'] ?? 0),
            'metadata' => $this->json($input['metadata'] ?? null),
        ]);

        if (!empty($input['mistake_key'])) {
            $this->storeMistake($request, [
                'mistake_key' => $input['mistake_key'],
                'simulation_slug' => $slug,
                'anonymous_id' => $input['anonymous_id'] ?? null,
                'metadata' => $input['metadata'] ?? null,
            ], false);
        }

        return Response::ok(['event_id' => (int) $this->pdo->lastInsertId()], 201);
    }

    public function endSimulationSession(Request $request): Response
    {
        $input = $request->json();
        $session = $this->sessionId($input, 'simulation_session');
        if ($session <= 0) {
            return Response::error('VALIDATION_ERROR', 'simulation_session_id is required.', 422);
        }

        $stmt = $this->pdo->prepare(
            'UPDATE simulation_sessions
             SET ended_at = NOW(), duration_seconds = :duration_seconds, completed = :completed,
                 highest_level = :highest_level, mistakes_count = :mistakes_count, hints_used = :hints_used,
                 enjoyment_rating = :enjoyment_rating, metadata = COALESCE(:metadata, metadata), updated_at = NOW()
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $session,
            'duration_seconds' => (int) ($input['duration_seconds'] ?? 0),
            'completed' => !empty($input['completed']) ? 1 : 0,
            'highest_level' => $input['highest_level'] ?? null,
            'mistakes_count' => (int) ($input['mistakes_count'] ?? 0),
            'hints_used' => (int) ($input['hints_used'] ?? 0),
            'enjoyment_rating' => $input['enjoyment_rating'] ?? null,
            'metadata' => $this->json($input['metadata'] ?? null),
        ]);

        return Response::ok(['ended' => true]);
    }

    public function mistake(Request $request): Response
    {
        return $this->storeMistake($request, $request->json());
    }

    public function resourceFeedback(Request $request): Response
    {
        $input = $request->json();
        $user = AuthMiddleware::user($request, $this->pdo);
        $resource = $this->resourceFromInput($input);
        $stmt = $this->pdo->prepare(
            'INSERT INTO resource_feedback
             (user_id, anonymous_id, resource_id, resource_type, rating, reaction, comment, created_at)
             VALUES (:user_id, :anonymous_id, :resource_id, :resource_type, :rating, :reaction, :comment, NOW())'
        );
        $stmt->execute([
            'user_id' => $user['id'] ?? null,
            'anonymous_id' => $input['anonymous_id'] ?? null,
            'resource_id' => $resource['id'] ?? ($input['resource_id'] ?? null),
            'resource_type' => $resource['type'] ?? ($input['resource_type'] ?? null),
            'rating' => $input['rating'] ?? null,
            'reaction' => $input['reaction'] ?? null,
            'comment' => $input['comment'] ?? null,
        ]);

        return Response::ok(['feedback_id' => (int) $this->pdo->lastInsertId()], 201);
    }

    public function memoryReview(Request $request): Response
    {
        $input = $request->json();
        $user = AuthMiddleware::user($request, $this->pdo);
        $deckId = (int) ($input['deck_id'] ?? 0);
        $cardId = (int) ($input['card_id'] ?? 0);
        $rating = (string) ($input['rating'] ?? '');
        if ($deckId <= 0 || $cardId <= 0 || !in_array($rating, ['easy', 'good', 'hard', 'forgot'], true)) {
            return Response::error('VALIDATION_ERROR', 'deck_id, card_id, and a valid rating are required.', 422);
        }

        $nextReview = $this->nextReviewAt($rating);
        $stmt = $this->pdo->prepare(
            'INSERT INTO memory_reviews
             (user_id, anonymous_id, deck_id, card_id, class_id, chapter_id, topic_id, rating, response_time_ms, review_mode, next_review_at, metadata, created_at)
             VALUES (:user_id, :anonymous_id, :deck_id, :card_id, :class_id, :chapter_id, :topic_id, :rating, :response_time_ms, :review_mode, :next_review_at, :metadata, NOW())'
        );
        $stmt->execute([
            'user_id' => $user['id'] ?? null,
            'anonymous_id' => $input['anonymous_id'] ?? null,
            'deck_id' => $deckId,
            'card_id' => $cardId,
            'class_id' => $input['class_id'] ?? null,
            'chapter_id' => $input['chapter_id'] ?? null,
            'topic_id' => $input['topic_id'] ?? null,
            'rating' => $rating,
            'response_time_ms' => $input['response_time_ms'] ?? null,
            'review_mode' => $input['review_mode'] ?? 'learn',
            'next_review_at' => $nextReview,
            'metadata' => $this->json($input['metadata'] ?? null),
        ]);

        $this->upsertMemoryProgress($user['id'] ?? null, $input['anonymous_id'] ?? null, $deckId, $cardId, $rating, $nextReview);

        return Response::ok(['review_id' => (int) $this->pdo->lastInsertId(), 'next_review_at' => $nextReview], 201);
    }

    public function memoryProgress(Request $request): Response
    {
        $user = AuthMiddleware::user($request, $this->pdo);
        $anonymousId = $request->query['anonymous_id'] ?? null;
        if (!$user && !$anonymousId) {
            return Response::ok(['progress' => []]);
        }

        $where = $user ? 'user_id = :owner' : 'anonymous_id = :owner';
        $stmt = $this->pdo->prepare("SELECT * FROM memory_card_progress WHERE {$where} ORDER BY updated_at DESC LIMIT 300");
        $stmt->execute(['owner' => $user['id'] ?? $anonymousId]);

        return Response::ok(['progress' => $stmt->fetchAll()]);
    }

    public function startQuickDrillAttempt(Request $request, array $params): Response
    {
        $input = $request->json();
        $user = AuthMiddleware::user($request, $this->pdo);
        $drillId = $this->idFromParam((string) ($params['drillId'] ?? ''), 'quick_drills');
        if ($drillId <= 0) {
            return Response::error('NOT_FOUND', 'Quick drill not found.', 404);
        }
        $drill = $this->findById('quick_drills', $drillId);
        $total = (int) $this->countQuestions($drillId);
        $uuid = AuthService::uuid();

        $stmt = $this->pdo->prepare(
            'INSERT INTO quiz_attempts
             (uuid, user_id, anonymous_id, drill_id, class_id, chapter_id, topic_id, started_at, total_questions, metadata, created_at, updated_at)
             VALUES (:uuid, :user_id, :anonymous_id, :drill_id, :class_id, :chapter_id, :topic_id, NOW(), :total_questions, :metadata, NOW(), NOW())'
        );
        $stmt->execute([
            'uuid' => $uuid,
            'user_id' => $user['id'] ?? null,
            'anonymous_id' => $input['anonymous_id'] ?? null,
            'drill_id' => $drillId,
            'class_id' => $drill['class_id'] ?? null,
            'chapter_id' => $drill['chapter_id'] ?? null,
            'topic_id' => $drill['topic_id'] ?? null,
            'total_questions' => $total,
            'metadata' => $this->json($input['metadata'] ?? null),
        ]);

        return Response::ok(['attempt_id' => (int) $this->pdo->lastInsertId(), 'uuid' => $uuid, 'total_questions' => $total], 201);
    }

    public function answerQuickDrillAttempt(Request $request, array $params): Response
    {
        $input = $request->json();
        $attemptId = (int) ($params['attemptId'] ?? 0);
        $questionId = (int) ($input['question_id'] ?? 0);
        if ($attemptId <= 0 || $questionId <= 0) {
            return Response::error('VALIDATION_ERROR', 'attemptId and question_id are required.', 422);
        }

        $question = $this->findById('quiz_questions', $questionId);
        if (!$question) {
            return Response::error('NOT_FOUND', 'Question not found.', 404);
        }

        $selected = $input['selected_answer'] ?? $input['selected_answer_json'] ?? null;
        $correctAnswer = $this->decodeJson($question['correct_answer_json'] ?? null);
        $isCorrect = $this->answerMatches($selected, $correctAnswer);
        $user = AuthMiddleware::user($request, $this->pdo);

        $stmt = $this->pdo->prepare(
            'INSERT INTO quiz_answers
             (attempt_id, question_id, user_id, selected_answer_json, correct_answer_json, is_correct, response_time_ms, hint_used, mistake_key, explanation_shown, created_at)
             VALUES (:attempt_id, :question_id, :user_id, :selected_answer_json, :correct_answer_json, :is_correct, :response_time_ms, :hint_used, :mistake_key, :explanation_shown, NOW())
             ON DUPLICATE KEY UPDATE selected_answer_json = VALUES(selected_answer_json), is_correct = VALUES(is_correct),
                 response_time_ms = VALUES(response_time_ms), hint_used = VALUES(hint_used), mistake_key = VALUES(mistake_key),
                 explanation_shown = VALUES(explanation_shown), created_at = NOW()'
        );
        $stmt->execute([
            'attempt_id' => $attemptId,
            'question_id' => $questionId,
            'user_id' => $user['id'] ?? null,
            'selected_answer_json' => $this->json($selected),
            'correct_answer_json' => $this->json($correctAnswer),
            'is_correct' => $isCorrect ? 1 : 0,
            'response_time_ms' => $input['response_time_ms'] ?? null,
            'hint_used' => !empty($input['hint_used']) ? 1 : 0,
            'mistake_key' => $isCorrect ? null : ($question['mistake_type'] ?? 'quick_drill_mistake'),
            'explanation_shown' => $question['explanation'] ?? null,
        ]);
        $this->refreshAttemptScore($attemptId);

        if (!$isCorrect) {
            $this->storeMistake($request, [
                'mistake_key' => $question['mistake_type'] ?? 'quick_drill_mistake',
                'question_id' => $questionId,
                'student_answer' => is_scalar($selected) ? (string) $selected : json_encode($selected),
                'correct_answer' => is_scalar($correctAnswer) ? (string) $correctAnswer : json_encode($correctAnswer),
                'feedback_shown' => $question['explanation'] ?? null,
            ], false);
        }

        return Response::ok([
            'correct' => $isCorrect,
            'explanation' => $question['explanation'] ?? null,
            'hint' => $question['hint'] ?? null,
            'correct_answer' => $correctAnswer,
        ]);
    }

    public function completeQuickDrillAttempt(Request $request, array $params): Response
    {
        $attemptId = (int) ($params['attemptId'] ?? 0);
        if ($attemptId <= 0) {
            return Response::error('VALIDATION_ERROR', 'attemptId is required.', 422);
        }
        $this->refreshAttemptScore($attemptId, true);

        return Response::ok(['completed' => true, 'attempt' => $this->attempt($attemptId)]);
    }

    public function quickDrillAttempt(Request $request, array $params): Response
    {
        $attemptId = (int) ($params['attemptId'] ?? 0);
        $attempt = $this->attempt($attemptId);
        if (!$attempt) {
            return Response::error('NOT_FOUND', 'Attempt not found.', 404);
        }

        return Response::ok(['attempt' => $attempt]);
    }

    public function logChemShastriQuestion(Request $request): Response
    {
        $input = $request->json();
        $user = AuthMiddleware::user($request, $this->pdo);
        $question = trim((string) ($input['question_text'] ?? $input['message'] ?? ''));
        if ($question === '') {
            return Response::error('VALIDATION_ERROR', 'question_text is required.', 422);
        }

        $stmt = $this->pdo->prepare(
            'INSERT INTO chem_shastri_question_logs
             (user_id, anonymous_id, conversation_id, class_id, subject_id, chapter_id, topic_id, resource_id, simulation_slug,
              question_text, normalized_question_hash, intent, mode, answer_source, provider, model, cost_inr_est, created_at)
             VALUES (:user_id, :anonymous_id, :conversation_id, :class_id, :subject_id, :chapter_id, :topic_id, :resource_id, :simulation_slug,
              :question_text, :normalized_question_hash, :intent, :mode, :answer_source, :provider, :model, :cost_inr_est, NOW())'
        );
        $stmt->execute([
            'user_id' => $user['id'] ?? null,
            'anonymous_id' => $input['anonymous_id'] ?? null,
            'conversation_id' => $input['conversation_id'] ?? null,
            'class_id' => $input['class_id'] ?? null,
            'subject_id' => $input['subject_id'] ?? null,
            'chapter_id' => $input['chapter_id'] ?? null,
            'topic_id' => $input['topic_id'] ?? null,
            'resource_id' => $input['resource_id'] ?? null,
            'simulation_slug' => $input['simulation_slug'] ?? null,
            'question_text' => $question,
            'normalized_question_hash' => hash('sha256', strtolower(preg_replace('/\s+/', ' ', $question) ?? $question)),
            'intent' => $input['intent'] ?? null,
            'mode' => $input['mode'] ?? null,
            'answer_source' => $input['answer_source'] ?? null,
            'provider' => $input['provider'] ?? null,
            'model' => $input['model'] ?? null,
            'cost_inr_est' => $input['cost_inr_est'] ?? 0,
        ]);

        return Response::ok(['question_log_id' => (int) $this->pdo->lastInsertId()], 201);
    }

    public function chemShastriFeedback(Request $request): Response
    {
        $input = $request->json();
        $id = (int) ($input['question_log_id'] ?? 0);
        $rating = (string) ($input['helpful_rating'] ?? '');
        if ($id <= 0 || !in_array($rating, ['helpful', 'not_helpful', 'too_hard', 'too_long', 'wrong'], true)) {
            return Response::error('VALIDATION_ERROR', 'question_log_id and helpful_rating are required.', 422);
        }

        $stmt = $this->pdo->prepare('UPDATE chem_shastri_question_logs SET helpful_rating = :rating WHERE id = :id');
        $stmt->execute(['id' => $id, 'rating' => $rating]);

        return Response::ok(['updated' => true]);
    }

    private function storeMistake(Request $request, array $input, bool $respond = true): Response
    {
        $user = AuthMiddleware::user($request, $this->pdo);
        $mistakeKey = trim((string) ($input['mistake_key'] ?? ''));
        if ($mistakeKey === '') {
            return Response::error('VALIDATION_ERROR', 'mistake_key is required.', 422);
        }

        $stmt = $this->pdo->prepare(
            'INSERT INTO mistake_events
             (user_id, anonymous_id, session_id, mistake_key, class_id, subject_id, chapter_id, topic_id, resource_id,
              simulation_slug, question_id, severity, student_answer, correct_answer, feedback_shown, metadata, created_at)
             VALUES (:user_id, :anonymous_id, :session_id, :mistake_key, :class_id, :subject_id, :chapter_id, :topic_id, :resource_id,
              :simulation_slug, :question_id, :severity, :student_answer, :correct_answer, :feedback_shown, :metadata, NOW())'
        );
        $stmt->execute([
            'user_id' => $user['id'] ?? null,
            'anonymous_id' => $input['anonymous_id'] ?? null,
            'session_id' => $input['session_id'] ?? null,
            'mistake_key' => $mistakeKey,
            'class_id' => $input['class_id'] ?? null,
            'subject_id' => $input['subject_id'] ?? null,
            'chapter_id' => $input['chapter_id'] ?? null,
            'topic_id' => $input['topic_id'] ?? null,
            'resource_id' => $input['resource_id'] ?? null,
            'simulation_slug' => $input['simulation_slug'] ?? null,
            'question_id' => $input['question_id'] ?? null,
            'severity' => $input['severity'] ?? 'medium',
            'student_answer' => $input['student_answer'] ?? null,
            'correct_answer' => $input['correct_answer'] ?? null,
            'feedback_shown' => $input['feedback_shown'] ?? null,
            'metadata' => $this->json($input['metadata'] ?? null),
        ]);

        return $respond ? Response::ok(['mistake_id' => (int) $this->pdo->lastInsertId()], 201) : Response::ok([]);
    }

    private function resourceFromInput(array $input): ?array
    {
        if (!empty($input['resource_slug'])) {
            return $this->resourceBySlug((string) $input['resource_slug']);
        }
        if (!empty($input['slug'])) {
            return $this->resourceBySlug((string) $input['slug']);
        }
        if (!empty($input['resource_id'])) {
            return $this->findById('learning_resources', (int) $input['resource_id']);
        }

        return null;
    }

    private function resourceBySlug(string $slug): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM learning_resources WHERE slug = :slug LIMIT 1');
        $stmt->execute(['slug' => $slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    private function findById(string $table, int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        $stmt = $this->pdo->prepare("SELECT * FROM {$table} WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    private function idFromParam(string $value, string $table): int
    {
        if (ctype_digit($value)) {
            return (int) $value;
        }
        $stmt = $this->pdo->prepare("SELECT id FROM {$table} WHERE slug = :slug LIMIT 1");
        $stmt->execute(['slug' => $value]);
        return (int) ($stmt->fetchColumn() ?: 0);
    }

    private function sessionId(array $input, string $prefix): int
    {
        return (int) ($input[$prefix . '_id'] ?? $input[$prefix . 'Id'] ?? $input['id'] ?? 0);
    }

    private function nextReviewAt(string $rating): string
    {
        $hours = match ($rating) {
            'easy' => 96,
            'good' => 48,
            'hard' => 12,
            default => 2,
        };

        return date('Y-m-d H:i:s', time() + ($hours * 3600));
    }

    private function upsertMemoryProgress(?int $userId, ?string $anonymousId, int $deckId, int $cardId, string $rating, string $nextReview): void
    {
        $mastered = in_array($rating, ['easy', 'good'], true) ? 1 : 0;
        if ($userId !== null) {
            $stmt = $this->pdo->prepare(
                'INSERT INTO memory_card_progress
                 (user_id, anonymous_id, deck_id, card_id, review_count, forgot_count, hard_count, last_rating, last_reviewed_at, next_review_at, mastered, created_at, updated_at)
                 VALUES (:user_id, :anonymous_id, :deck_id, :card_id, 1, :forgot_count, :hard_count, :last_rating, NOW(), :next_review_at, :mastered, NOW(), NOW())
                 ON DUPLICATE KEY UPDATE review_count = review_count + 1,
                   forgot_count = forgot_count + VALUES(forgot_count), hard_count = hard_count + VALUES(hard_count),
                   last_rating = VALUES(last_rating), last_reviewed_at = NOW(), next_review_at = VALUES(next_review_at),
                   mastered = VALUES(mastered), updated_at = NOW()'
            );
        } else {
            $stmt = $this->pdo->prepare(
                'INSERT INTO memory_card_progress
                 (user_id, anonymous_id, deck_id, card_id, review_count, forgot_count, hard_count, last_rating, last_reviewed_at, next_review_at, mastered, created_at, updated_at)
                 VALUES (:user_id, :anonymous_id, :deck_id, :card_id, 1, :forgot_count, :hard_count, :last_rating, NOW(), :next_review_at, :mastered, NOW(), NOW())'
            );
        }
        $stmt->execute([
            'user_id' => $userId,
            'anonymous_id' => $anonymousId,
            'deck_id' => $deckId,
            'card_id' => $cardId,
            'forgot_count' => $rating === 'forgot' ? 1 : 0,
            'hard_count' => $rating === 'hard' ? 1 : 0,
            'last_rating' => $rating,
            'next_review_at' => $nextReview,
            'mastered' => $mastered,
        ]);
    }

    private function countQuestions(int $drillId): int
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM quiz_questions WHERE drill_id = :drill_id AND status = "published"');
        $stmt->execute(['drill_id' => $drillId]);
        return (int) $stmt->fetchColumn();
    }

    private function answerMatches(mixed $selected, mixed $correct): bool
    {
        $selectedList = is_array($selected) ? array_values($selected) : [$selected];
        $correctList = is_array($correct) ? array_values($correct) : [$correct];
        sort($selectedList);
        sort($correctList);

        return json_encode($selectedList) === json_encode($correctList);
    }

    private function refreshAttemptScore(int $attemptId, bool $complete = false): void
    {
        $stats = $this->pdo->prepare(
            'SELECT COUNT(*) AS answered, COALESCE(SUM(is_correct), 0) AS correct_count FROM quiz_answers WHERE attempt_id = :attempt_id'
        );
        $stats->execute(['attempt_id' => $attemptId]);
        $row = $stats->fetch() ?: ['answered' => 0, 'correct_count' => 0];
        $correct = (int) $row['correct_count'];
        $answered = (int) $row['answered'];
        $wrong = max(0, $answered - $correct);
        $stmt = $this->pdo->prepare(
            'UPDATE quiz_attempts
             SET score = :score, correct_count = :correct_count, wrong_count = :wrong_count,
                 completed = :completed, completed_at = IF(:completed = 1, NOW(), completed_at), updated_at = NOW()
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $attemptId,
            'score' => $correct,
            'correct_count' => $correct,
            'wrong_count' => $wrong,
            'completed' => $complete ? 1 : 0,
        ]);
    }

    private function attempt(int $attemptId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM quiz_attempts WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $attemptId]);
        $attempt = $stmt->fetch();
        if (!$attempt) {
            return null;
        }
        $answers = $this->pdo->prepare('SELECT * FROM quiz_answers WHERE attempt_id = :id ORDER BY id ASC');
        $answers->execute(['id' => $attemptId]);
        $attempt['answers'] = $answers->fetchAll();

        return $attempt;
    }

    private function json(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    private function decodeJson(mixed $value): mixed
    {
        if (!is_string($value) || $value === '') {
            return null;
        }
        $decoded = json_decode($value, true);
        return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
    }
}
