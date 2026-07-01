<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Config\Config;
use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\AuthMiddleware;
use Chemlab\Services\AuthService;
use PDO;

final class LiveQuizController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function teacherQuizzes(Request $request): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $where = $teacher['role'] === 'admin' ? '1 = 1' : 'teacher_quizzes.teacher_user_id = :teacher_id';
        $bindings = $teacher['role'] === 'admin' ? [] : ['teacher_id' => $teacher['id']];

        $stmt = $this->pdo->prepare(
            "SELECT teacher_quizzes.*, quick_drills.title AS source_drill_title,
                    COUNT(teacher_quiz_questions.id) AS question_count
             FROM teacher_quizzes
             LEFT JOIN quick_drills ON quick_drills.id = teacher_quizzes.source_drill_id
             LEFT JOIN teacher_quiz_questions ON teacher_quiz_questions.quiz_id = teacher_quizzes.id
             WHERE {$where}
             GROUP BY teacher_quizzes.id
             ORDER BY teacher_quizzes.updated_at DESC"
        );
        $stmt->execute($bindings);

        return Response::ok(['quizzes' => $stmt->fetchAll()]);
    }

    public function createTeacherQuiz(Request $request): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $input = $request->json();
        $title = trim((string) ($input['title'] ?? ''));
        $sourceDrillId = (int) ($input['source_drill_id'] ?? 0);
        $sourceDrill = $sourceDrillId > 0 ? $this->findById('quick_drills', $sourceDrillId) : null;

        if ($title === '' && $sourceDrill) {
            $title = (string) $sourceDrill['title'];
        }
        if ($title === '') {
            return Response::error('VALIDATION_ERROR', 'Quiz title is required.', 422);
        }

        $uuid = AuthService::uuid();
        $slug = $this->uniqueSlug($title, 'teacher_quizzes');
        $stmt = $this->pdo->prepare(
            'INSERT INTO teacher_quizzes
             (uuid, teacher_user_id, title, slug, description, class_id, subject_id, chapter_id, topic_id, source_drill_id,
              status, visibility, time_limit_minutes, shuffle_questions, show_correct_after_each, show_leaderboard,
              quality_status, source_reference, created_at, updated_at)
             VALUES (:uuid, :teacher_user_id, :title, :slug, :description, :class_id, :subject_id, :chapter_id, :topic_id, :source_drill_id,
              :status, :visibility, :time_limit_minutes, :shuffle_questions, :show_correct_after_each, :show_leaderboard,
              :quality_status, :source_reference, NOW(), NOW())'
        );
        $stmt->execute([
            'uuid' => $uuid,
            'teacher_user_id' => $teacher['id'],
            'title' => $title,
            'slug' => $slug,
            'description' => $input['description'] ?? ($sourceDrill['description'] ?? null),
            'class_id' => $input['class_id'] ?? ($sourceDrill['class_id'] ?? null),
            'subject_id' => $input['subject_id'] ?? ($sourceDrill['subject_id'] ?? null),
            'chapter_id' => $input['chapter_id'] ?? ($sourceDrill['chapter_id'] ?? null),
            'topic_id' => $input['topic_id'] ?? ($sourceDrill['topic_id'] ?? null),
            'source_drill_id' => $sourceDrillId > 0 ? $sourceDrillId : null,
            'status' => $input['status'] ?? 'draft',
            'visibility' => $input['visibility'] ?? 'private',
            'time_limit_minutes' => $input['time_limit_minutes'] ?? ($sourceDrill['estimated_minutes'] ?? null),
            'shuffle_questions' => !empty($input['shuffle_questions']) ? 1 : 0,
            'show_correct_after_each' => array_key_exists('show_correct_after_each', $input) ? (!empty($input['show_correct_after_each']) ? 1 : 0) : 1,
            'show_leaderboard' => array_key_exists('show_leaderboard', $input) ? (!empty($input['show_leaderboard']) ? 1 : 0) : 1,
            'quality_status' => $input['quality_status'] ?? 'needs_review',
            'source_reference' => $input['source_reference'] ?? ($sourceDrill ? 'Copied from quick drill: ' . $sourceDrill['slug'] : 'Teacher-created Chemlab quiz.'),
        ]);
        $quizId = (int) $this->pdo->lastInsertId();

        if ($sourceDrillId > 0) {
            $this->copyQuestionsFromDrill($sourceDrillId, $quizId);
        }

        return Response::ok(['quiz_id' => $quizId, 'uuid' => $uuid, 'slug' => $slug, 'quiz' => $this->quizWithQuestions($quizId)], 201);
    }

    public function teacherQuiz(Request $request, array $params): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $quiz = $this->ownedQuiz((string) ($params['id'] ?? ''), $teacher);
        if (!$quiz) {
            return Response::error('NOT_FOUND', 'Quiz not found.', 404);
        }

        return Response::ok(['quiz' => $this->quizWithQuestions((int) $quiz['id'])]);
    }

    public function updateTeacherQuiz(Request $request, array $params): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $quiz = $this->ownedQuiz((string) ($params['id'] ?? ''), $teacher);
        if (!$quiz) {
            return Response::error('NOT_FOUND', 'Quiz not found.', 404);
        }

        $input = $request->json();
        $allowed = ['title', 'description', 'class_id', 'subject_id', 'chapter_id', 'topic_id', 'status', 'visibility', 'time_limit_minutes', 'shuffle_questions', 'show_correct_after_each', 'show_leaderboard', 'quality_status', 'source_reference'];
        $fields = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $input)) {
                $fields[$field] = is_bool($input[$field]) ? ($input[$field] ? 1 : 0) : ($input[$field] === '' ? null : $input[$field]);
            }
        }
        if ($fields === []) {
            return Response::error('VALIDATION_ERROR', 'No editable fields supplied.', 422);
        }

        $sets = array_map(fn (string $field): string => "{$field} = :{$field}", array_keys($fields));
        $fields['id'] = $quiz['id'];
        $this->pdo->prepare('UPDATE teacher_quizzes SET ' . implode(', ', $sets) . ', updated_at = NOW() WHERE id = :id')->execute($fields);

        return Response::ok(['updated' => true, 'quiz' => $this->quizWithQuestions((int) $quiz['id'])]);
    }

    public function startLive(Request $request, array $params): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $quiz = $this->ownedQuiz((string) ($params['id'] ?? ''), $teacher);
        if (!$quiz) {
            return Response::error('NOT_FOUND', 'Quiz not found.', 404);
        }
        if ($this->questionCount((int) $quiz['id']) <= 0 && !empty($quiz['source_drill_id'])) {
            $this->copyQuestionsFromDrill((int) $quiz['source_drill_id'], (int) $quiz['id']);
        }
        if ($this->questionCount((int) $quiz['id']) <= 0) {
            return Response::error('QUIZ_HAS_NO_QUESTIONS', 'Add questions before starting a live quiz.', 422);
        }

        $uuid = AuthService::uuid();
        $pin = $this->pinCode();
        $joinUrl = rtrim((string) Config::get('FRONTEND_URL', 'https://www.chemlearning.in'), '/') . '/join/' . $pin;
        $stmt = $this->pdo->prepare(
            'INSERT INTO live_quiz_sessions
             (uuid, quiz_id, teacher_user_id, pin_code, join_url, status, started_at, allow_guest_names, show_live_leaderboard, metadata, created_at, updated_at)
             VALUES (:uuid, :quiz_id, :teacher_user_id, :pin_code, :join_url, "live", NOW(), 1, :show_live_leaderboard, :metadata, NOW(), NOW())'
        );
        $stmt->execute([
            'uuid' => $uuid,
            'quiz_id' => $quiz['id'],
            'teacher_user_id' => $teacher['id'],
            'pin_code' => $pin,
            'join_url' => $joinUrl,
            'show_live_leaderboard' => !empty($quiz['show_leaderboard']) ? 1 : 0,
            'metadata' => $this->json(['started_from' => 'teacher']),
        ]);

        $session = $this->sessionById((string) $this->pdo->lastInsertId());
        return Response::ok(['session' => $session, 'pin_code' => $pin, 'join_url' => $joinUrl], 201);
    }

    public function liveSession(Request $request, array $params): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $session = $this->ownedSession((string) ($params['sessionId'] ?? ''), $teacher);
        if (!$session) {
            return Response::error('NOT_FOUND', 'Live quiz session not found.', 404);
        }

        return Response::ok($this->sessionReport((int) $session['id']));
    }

    public function endLive(Request $request, array $params): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $session = $this->ownedSession((string) ($params['sessionId'] ?? ''), $teacher);
        if (!$session) {
            return Response::error('NOT_FOUND', 'Live quiz session not found.', 404);
        }

        $this->pdo->prepare('UPDATE live_quiz_sessions SET status = "ended", ended_at = NOW(), updated_at = NOW() WHERE id = :id')->execute(['id' => $session['id']]);
        $this->rankParticipants((int) $session['id']);

        return Response::ok($this->sessionReport((int) $session['id']));
    }

    public function liveResults(Request $request, array $params): Response
    {
        return $this->liveSession($request, $params);
    }

    public function joinInfo(Request $request, array $params): Response
    {
        $pin = preg_replace('/\D/', '', (string) ($params['pin'] ?? ''));
        $session = $this->sessionByPin($pin);
        if (!$session || !in_array($session['status'], ['waiting', 'live'], true)) {
            return Response::error('NOT_FOUND', 'Quiz PIN is not active.', 404);
        }

        return Response::ok(['session' => $this->publicSessionShape($session), 'quiz' => $this->publicQuizShape($session)]);
    }

    public function joinByPin(Request $request, array $params): Response
    {
        $pin = preg_replace('/\D/', '', (string) ($params['pin'] ?? ''));
        $session = $this->sessionByPin($pin);
        if (!$session || !in_array($session['status'], ['waiting', 'live'], true)) {
            return Response::error('NOT_FOUND', 'Quiz PIN is not active.', 404);
        }

        $input = $request->json();
        $user = AuthMiddleware::user($request, $this->pdo);
        $displayName = $user ? (string) $user['name'] : $this->sanitizeName((string) ($input['guest_name'] ?? ''));
        if ($displayName === '') {
            return Response::error('VALIDATION_ERROR', 'Enter your name to join this quiz.', 422);
        }
        $token = bin2hex(random_bytes(24));
        $stmt = $this->pdo->prepare(
            'INSERT INTO live_quiz_participants
             (session_id, user_id, guest_name, guest_token_hash, display_name, joined_at, total_points, metadata)
             VALUES (:session_id, :user_id, :guest_name, :guest_token_hash, :display_name, NOW(), :total_points, :metadata)'
        );
        $stmt->execute([
            'session_id' => $session['id'],
            'user_id' => $user['id'] ?? null,
            'guest_name' => $user ? null : $displayName,
            'guest_token_hash' => password_hash($token, PASSWORD_DEFAULT),
            'display_name' => $displayName,
            'total_points' => $this->totalPoints((int) $session['quiz_id']),
            'metadata' => $this->json(['ip_hash' => hash('sha256', $request->ip())]),
        ]);

        $participant = $this->participant((int) $this->pdo->lastInsertId());
        return Response::ok([
            'session' => $this->publicSessionShape($session),
            'participant' => $participant,
            'participant_token' => $token,
            'quiz' => $this->publicQuizShape($session),
            'questions' => $this->publicQuestions((int) $session['quiz_id']),
        ], 201);
    }

    public function roomAnswer(Request $request, array $params): Response
    {
        $session = $this->sessionById((string) ($params['sessionId'] ?? ''));
        if (!$session || !in_array($session['status'], ['waiting', 'live'], true)) {
            return Response::error('NOT_FOUND', 'Quiz room is not active.', 404);
        }

        $input = $request->json();
        $participant = $this->participantForToken((int) $session['id'], (int) ($input['participant_id'] ?? 0), (string) ($input['participant_token'] ?? ''));
        if (!$participant) {
            return Response::error('FORBIDDEN', 'Participant token is invalid.', 403);
        }
        $question = $this->findById('teacher_quiz_questions', (int) ($input['question_id'] ?? 0));
        if (!$question || (int) $question['quiz_id'] !== (int) $session['quiz_id']) {
            return Response::error('NOT_FOUND', 'Question not found for this quiz.', 404);
        }

        $selected = $input['selected_answer'] ?? $input['selected_answer_json'] ?? null;
        $correct = $this->decodeJson($question['correct_answer_json'] ?? null);
        $isCorrect = $this->answerMatches($selected, $correct);
        $points = $isCorrect ? (int) ($question['points'] ?? 1) : 0;
        $stmt = $this->pdo->prepare(
            'INSERT INTO live_quiz_answers
             (session_id, participant_id, question_id, selected_answer_json, correct_answer_json, is_correct, points_awarded, response_time_ms, mistake_key, answered_at)
             VALUES (:session_id, :participant_id, :question_id, :selected_answer_json, :correct_answer_json, :is_correct, :points_awarded, :response_time_ms, :mistake_key, NOW())
             ON DUPLICATE KEY UPDATE selected_answer_json = VALUES(selected_answer_json), is_correct = VALUES(is_correct),
               points_awarded = VALUES(points_awarded), response_time_ms = VALUES(response_time_ms), mistake_key = VALUES(mistake_key), answered_at = NOW()'
        );
        $stmt->execute([
            'session_id' => $session['id'],
            'participant_id' => $participant['id'],
            'question_id' => $question['id'],
            'selected_answer_json' => $this->json($selected),
            'correct_answer_json' => $this->json($correct),
            'is_correct' => $isCorrect ? 1 : 0,
            'points_awarded' => $points,
            'response_time_ms' => $input['response_time_ms'] ?? null,
            'mistake_key' => $isCorrect ? null : ($question['mistake_key'] ?? 'live_quiz_mistake'),
        ]);
        $this->refreshParticipantScore((int) $participant['id']);

        $quiz = $this->findById('teacher_quizzes', (int) $session['quiz_id']);
        return Response::ok([
            'correct' => $isCorrect,
            'points_awarded' => $points,
            'explanation' => !empty($quiz['show_correct_after_each']) ? ($question['explanation'] ?? null) : null,
            'correct_answer' => !empty($quiz['show_correct_after_each']) ? $correct : null,
            'participant' => $this->participant((int) $participant['id']),
        ]);
    }

    public function roomComplete(Request $request, array $params): Response
    {
        $session = $this->sessionById((string) ($params['sessionId'] ?? ''));
        if (!$session) {
            return Response::error('NOT_FOUND', 'Quiz room not found.', 404);
        }
        $input = $request->json();
        $participant = $this->participantForToken((int) $session['id'], (int) ($input['participant_id'] ?? 0), (string) ($input['participant_token'] ?? ''));
        if (!$participant) {
            return Response::error('FORBIDDEN', 'Participant token is invalid.', 403);
        }
        $this->refreshParticipantScore((int) $participant['id'], true, (int) ($input['duration_seconds'] ?? 0));
        $this->rankParticipants((int) $session['id']);

        return Response::ok([
            'completed' => true,
            'participant' => $this->participant((int) $participant['id']),
            'answers' => $this->participantAnswers((int) $participant['id']),
        ]);
    }

    public function publicQuizzes(Request $request): Response
    {
        $stmt = $this->pdo->query(
            'SELECT teacher_quizzes.*, COUNT(teacher_quiz_questions.id) AS question_count
             FROM teacher_quizzes
             LEFT JOIN teacher_quiz_questions ON teacher_quiz_questions.quiz_id = teacher_quizzes.id
             WHERE teacher_quizzes.visibility = "public" AND teacher_quizzes.status = "published"
             GROUP BY teacher_quizzes.id
             ORDER BY teacher_quizzes.updated_at DESC'
        );
        return Response::ok(['quizzes' => $stmt->fetchAll()]);
    }

    public function publicQuiz(Request $request, array $params): Response
    {
        $quiz = $this->quizBySlug((string) ($params['slug'] ?? ''), true);
        if (!$quiz) {
            return Response::error('NOT_FOUND', 'Public quiz not found.', 404);
        }
        return Response::ok(['quiz' => $quiz, 'questions' => $this->publicQuestions((int) $quiz['id'])]);
    }

    public function publicAttempt(Request $request, array $params): Response
    {
        $quiz = $this->quizBySlug((string) ($params['slug'] ?? ''), true);
        if (!$quiz) {
            return Response::error('NOT_FOUND', 'Public quiz not found.', 404);
        }
        $input = $request->json();
        $name = $this->sanitizeName((string) ($input['participant_name'] ?? $input['display_name'] ?? ''));
        if ($name === '') {
            return Response::error('VALIDATION_ERROR', 'Display name is required.', 422);
        }
        $answers = is_array($input['answers'] ?? null) ? $input['answers'] : [];
        $result = $this->scoreAnswers((int) $quiz['id'], $answers);
        $user = AuthMiddleware::user($request, $this->pdo);

        if (!empty($quiz['show_leaderboard'])) {
            $stmt = $this->pdo->prepare(
                'INSERT INTO public_quiz_leaderboards
                 (quiz_id, participant_name, user_id, score, total_points, duration_seconds, correct_count, created_at)
                 VALUES (:quiz_id, :participant_name, :user_id, :score, :total_points, :duration_seconds, :correct_count, NOW())'
            );
            $stmt->execute([
                'quiz_id' => $quiz['id'],
                'participant_name' => $name,
                'user_id' => $user['id'] ?? null,
                'score' => $result['score'],
                'total_points' => $result['total_points'],
                'duration_seconds' => (int) ($input['duration_seconds'] ?? 0),
                'correct_count' => $result['correct_count'],
            ]);
        }

        return Response::ok(['result' => $result, 'leaderboard' => $this->leaderboardRows((int) $quiz['id'])], 201);
    }

    public function publicLeaderboard(Request $request, array $params): Response
    {
        $quiz = $this->quizBySlug((string) ($params['slug'] ?? $params['quizSlug'] ?? ''), true);
        if (!$quiz) {
            return Response::error('NOT_FOUND', 'Public quiz not found.', 404);
        }
        return Response::ok(['quiz' => $quiz, 'leaderboard' => $this->leaderboardRows((int) $quiz['id'])]);
    }

    public function hideLeaderboardEntry(Request $request, array $params): Response
    {
        AuthMiddleware::requireRole($request, $this->pdo, ['admin']);
        $id = (int) ($request->json()['entry_id'] ?? $request->query['entry_id'] ?? 0);
        if ($id <= 0) {
            return Response::error('VALIDATION_ERROR', 'entry_id is required.', 422);
        }
        $this->pdo->prepare('UPDATE public_quiz_leaderboards SET hidden_at = NOW() WHERE id = :id')->execute(['id' => $id]);
        return Response::ok(['hidden' => true]);
    }

    private function copyQuestionsFromDrill(int $drillId, int $quizId): void
    {
        $existing = $this->questionCount($quizId);
        if ($existing > 0) {
            return;
        }
        $stmt = $this->pdo->prepare(
            'INSERT INTO teacher_quiz_questions
             (quiz_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, points, mistake_key, order_index, created_at, updated_at)
             SELECT :quiz_id, question_text, IF(question_type = "multi_select", "multi_select", question_type), options_json, correct_answer_json,
                    explanation, hint, 1, mistake_type, order_index, NOW(), NOW()
             FROM quiz_questions
             WHERE drill_id = :drill_id AND status = "published"
             ORDER BY order_index ASC, id ASC'
        );
        $stmt->execute(['quiz_id' => $quizId, 'drill_id' => $drillId]);
    }

    private function ownedQuiz(string $idOrSlug, array $teacher): ?array
    {
        $field = ctype_digit($idOrSlug) ? 'id' : 'slug';
        $where = $teacher['role'] === 'admin' ? '' : ' AND teacher_user_id = :teacher_id';
        $stmt = $this->pdo->prepare("SELECT * FROM teacher_quizzes WHERE {$field} = :value{$where} LIMIT 1");
        $bindings = ['value' => $idOrSlug];
        if ($teacher['role'] !== 'admin') {
            $bindings['teacher_id'] = $teacher['id'];
        }
        $stmt->execute($bindings);
        return $stmt->fetch() ?: null;
    }

    private function ownedSession(string $idOrUuid, array $teacher): ?array
    {
        $field = ctype_digit($idOrUuid) ? 'live_quiz_sessions.id' : 'live_quiz_sessions.uuid';
        $where = $teacher['role'] === 'admin' ? '' : ' AND live_quiz_sessions.teacher_user_id = :teacher_id';
        $stmt = $this->pdo->prepare("SELECT live_quiz_sessions.*, teacher_quizzes.title AS quiz_title, teacher_quizzes.slug AS quiz_slug
             FROM live_quiz_sessions
             INNER JOIN teacher_quizzes ON teacher_quizzes.id = live_quiz_sessions.quiz_id
             WHERE {$field} = :value{$where} LIMIT 1");
        $bindings = ['value' => $idOrUuid];
        if ($teacher['role'] !== 'admin') {
            $bindings['teacher_id'] = $teacher['id'];
        }
        $stmt->execute($bindings);
        return $stmt->fetch() ?: null;
    }

    private function sessionByPin(string $pin): ?array
    {
        if (!preg_match('/^\d{6}$/', $pin)) {
            return null;
        }
        $stmt = $this->pdo->prepare(
            'SELECT live_quiz_sessions.*, teacher_quizzes.title AS quiz_title, teacher_quizzes.description AS quiz_description,
                    teacher_quizzes.time_limit_minutes, teacher_quizzes.show_correct_after_each, teacher_quizzes.show_leaderboard
             FROM live_quiz_sessions
             INNER JOIN teacher_quizzes ON teacher_quizzes.id = live_quiz_sessions.quiz_id
             WHERE live_quiz_sessions.pin_code = :pin LIMIT 1'
        );
        $stmt->execute(['pin' => $pin]);
        return $stmt->fetch() ?: null;
    }

    private function sessionById(string $idOrUuid): ?array
    {
        $field = ctype_digit($idOrUuid) ? 'live_quiz_sessions.id' : 'live_quiz_sessions.uuid';
        $stmt = $this->pdo->prepare(
            "SELECT live_quiz_sessions.*, teacher_quizzes.title AS quiz_title, teacher_quizzes.description AS quiz_description,
                    teacher_quizzes.time_limit_minutes, teacher_quizzes.show_correct_after_each, teacher_quizzes.show_leaderboard
             FROM live_quiz_sessions
             INNER JOIN teacher_quizzes ON teacher_quizzes.id = live_quiz_sessions.quiz_id
             WHERE {$field} = :value LIMIT 1"
        );
        $stmt->execute(['value' => $idOrUuid]);
        return $stmt->fetch() ?: null;
    }

    private function quizWithQuestions(int $quizId): array
    {
        $quiz = $this->findById('teacher_quizzes', $quizId) ?? [];
        $questions = $this->pdo->prepare('SELECT * FROM teacher_quiz_questions WHERE quiz_id = :quiz_id ORDER BY order_index ASC, id ASC');
        $questions->execute(['quiz_id' => $quizId]);
        $quiz['questions'] = array_map([$this, 'shapeQuestion'], $questions->fetchAll());
        return $quiz;
    }

    private function publicQuizShape(array $session): array
    {
        return [
            'id' => (int) $session['quiz_id'],
            'title' => $session['quiz_title'],
            'description' => $session['quiz_description'] ?? null,
            'time_limit_minutes' => $session['time_limit_minutes'] ?? null,
            'show_correct_after_each' => (bool) ($session['show_correct_after_each'] ?? true),
            'show_leaderboard' => (bool) ($session['show_leaderboard'] ?? true),
        ];
    }

    private function publicSessionShape(array $session): array
    {
        return [
            'id' => (int) $session['id'],
            'uuid' => $session['uuid'],
            'pin_code' => $session['pin_code'],
            'status' => $session['status'],
            'join_url' => $session['join_url'] ?? null,
        ];
    }

    private function publicQuestions(int $quizId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT id, quiz_id, question_text, question_type, options_json, explanation, hint, points, order_index
             FROM teacher_quiz_questions
             WHERE quiz_id = :quiz_id
             ORDER BY order_index ASC, id ASC'
        );
        $stmt->execute(['quiz_id' => $quizId]);
        return array_map([$this, 'shapeQuestion'], $stmt->fetchAll());
    }

    private function sessionReport(int $sessionId): array
    {
        $session = $this->sessionById((string) $sessionId);
        $participants = $this->pdo->prepare('SELECT * FROM live_quiz_participants WHERE session_id = :session_id ORDER BY score DESC, duration_seconds ASC, joined_at ASC');
        $participants->execute(['session_id' => $sessionId]);
        $answers = $this->pdo->prepare(
            'SELECT live_quiz_answers.*, teacher_quiz_questions.question_text, teacher_quiz_questions.explanation
             FROM live_quiz_answers
             INNER JOIN teacher_quiz_questions ON teacher_quiz_questions.id = live_quiz_answers.question_id
             WHERE live_quiz_answers.session_id = :session_id
             ORDER BY live_quiz_answers.answered_at DESC'
        );
        $answers->execute(['session_id' => $sessionId]);
        return ['session' => $session, 'participants' => $participants->fetchAll(), 'answers' => array_map([$this, 'shapeAnswer'], $answers->fetchAll())];
    }

    private function participantForToken(int $sessionId, int $participantId, string $token): ?array
    {
        if ($participantId <= 0 || $token === '') {
            return null;
        }
        $stmt = $this->pdo->prepare('SELECT * FROM live_quiz_participants WHERE id = :id AND session_id = :session_id LIMIT 1');
        $stmt->execute(['id' => $participantId, 'session_id' => $sessionId]);
        $participant = $stmt->fetch();
        if (!$participant || !password_verify($token, (string) $participant['guest_token_hash'])) {
            return null;
        }
        return $participant;
    }

    private function participant(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM live_quiz_participants WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    private function participantAnswers(int $participantId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT live_quiz_answers.*, teacher_quiz_questions.question_text, teacher_quiz_questions.explanation
             FROM live_quiz_answers
             INNER JOIN teacher_quiz_questions ON teacher_quiz_questions.id = live_quiz_answers.question_id
             WHERE live_quiz_answers.participant_id = :participant_id
             ORDER BY teacher_quiz_questions.order_index ASC'
        );
        $stmt->execute(['participant_id' => $participantId]);
        return array_map([$this, 'shapeAnswer'], $stmt->fetchAll());
    }

    private function refreshParticipantScore(int $participantId, bool $complete = false, int $durationSeconds = 0): void
    {
        $stats = $this->pdo->prepare(
            'SELECT COALESCE(SUM(points_awarded), 0) AS score, COALESCE(SUM(is_correct), 0) AS correct_count, COUNT(*) AS answered
             FROM live_quiz_answers WHERE participant_id = :participant_id'
        );
        $stats->execute(['participant_id' => $participantId]);
        $row = $stats->fetch() ?: ['score' => 0, 'correct_count' => 0, 'answered' => 0];
        $correct = (int) $row['correct_count'];
        $answered = (int) $row['answered'];
        $stmt = $this->pdo->prepare(
            'UPDATE live_quiz_participants
             SET score = :score, correct_count = :correct_count, wrong_count = :wrong_count,
                 completed_at = IF(:complete = 1, NOW(), completed_at),
                 duration_seconds = IF(:duration_seconds > 0, :duration_seconds, duration_seconds)
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $participantId,
            'score' => (int) $row['score'],
            'correct_count' => $correct,
            'wrong_count' => max(0, $answered - $correct),
            'complete' => $complete ? 1 : 0,
            'duration_seconds' => $durationSeconds,
        ]);
    }

    private function rankParticipants(int $sessionId): void
    {
        $stmt = $this->pdo->prepare('SELECT id FROM live_quiz_participants WHERE session_id = :session_id ORDER BY score DESC, duration_seconds ASC, joined_at ASC');
        $stmt->execute(['session_id' => $sessionId]);
        $rank = 1;
        foreach ($stmt->fetchAll() as $row) {
            $this->pdo->prepare('UPDATE live_quiz_participants SET rank_position = :rank WHERE id = :id')->execute(['rank' => $rank++, 'id' => $row['id']]);
        }
    }

    private function totalPoints(int $quizId): int
    {
        $stmt = $this->pdo->prepare('SELECT COALESCE(SUM(points), 0) FROM teacher_quiz_questions WHERE quiz_id = :quiz_id');
        $stmt->execute(['quiz_id' => $quizId]);
        return (int) $stmt->fetchColumn();
    }

    private function scoreAnswers(int $quizId, array $answers): array
    {
        $questions = $this->questionsWithAnswers($quizId);
        $score = 0;
        $correctCount = 0;
        $breakdown = [];
        foreach ($questions as $question) {
            $selected = $answers[(string) $question['id']] ?? $answers[$question['id']] ?? null;
            $correct = $this->decodeJson($question['correct_answer_json'] ?? null);
            $isCorrect = $this->answerMatches($selected, $correct);
            if ($isCorrect) {
                $score += (int) ($question['points'] ?? 1);
                $correctCount++;
            }
            $breakdown[] = ['question_id' => (int) $question['id'], 'correct' => $isCorrect, 'explanation' => $question['explanation'] ?? null];
        }
        return ['score' => $score, 'total_points' => $this->totalPoints($quizId), 'correct_count' => $correctCount, 'wrong_count' => max(0, count($questions) - $correctCount), 'breakdown' => $breakdown];
    }

    private function questionsWithAnswers(int $quizId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM teacher_quiz_questions WHERE quiz_id = :quiz_id ORDER BY order_index ASC, id ASC');
        $stmt->execute(['quiz_id' => $quizId]);
        return $stmt->fetchAll();
    }

    private function leaderboardRows(int $quizId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT id, participant_name, score, total_points, duration_seconds, correct_count, created_at
             FROM public_quiz_leaderboards
             WHERE quiz_id = :quiz_id AND hidden_at IS NULL
             ORDER BY score DESC, duration_seconds ASC, created_at ASC
             LIMIT 100'
        );
        $stmt->execute(['quiz_id' => $quizId]);
        return $stmt->fetchAll();
    }

    private function quizBySlug(string $slug, bool $publicOnly = false): ?array
    {
        $where = $publicOnly ? ' AND visibility = "public" AND status = "published"' : '';
        $stmt = $this->pdo->prepare("SELECT * FROM teacher_quizzes WHERE slug = :slug{$where} LIMIT 1");
        $stmt->execute(['slug' => $slug]);
        return $stmt->fetch() ?: null;
    }

    private function findById(string $table, int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        $stmt = $this->pdo->prepare("SELECT * FROM {$table} WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    private function questionCount(int $quizId): int
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM teacher_quiz_questions WHERE quiz_id = :quiz_id');
        $stmt->execute(['quiz_id' => $quizId]);
        return (int) $stmt->fetchColumn();
    }

    private function pinCode(): string
    {
        do {
            $pin = (string) random_int(100000, 999999);
            $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM live_quiz_sessions WHERE pin_code = :pin');
            $stmt->execute(['pin' => $pin]);
        } while ((int) $stmt->fetchColumn() > 0);
        return $pin;
    }

    private function uniqueSlug(string $title, string $table): string
    {
        $base = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($title)) ?? '', '-');
        $base = $base !== '' ? $base : 'quiz';
        $slug = $base;
        $i = 2;
        while (true) {
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM {$table} WHERE slug = :slug");
            $stmt->execute(['slug' => $slug]);
            if ((int) $stmt->fetchColumn() === 0) {
                return $slug;
            }
            $slug = $base . '-' . $i++;
        }
    }

    private function sanitizeName(string $name): string
    {
        $name = trim(preg_replace('/\s+/', ' ', strip_tags($name)) ?? '');
        $name = preg_replace('/[^a-zA-Z0-9 ._-]/', '', $name) ?? '';
        $badWords = ['admin', 'teacher', 'moderator'];
        return in_array(strtolower($name), $badWords, true) ? '' : substr($name, 0, 80);
    }

    private function shapeQuestion(array $row): array
    {
        $row['options_json'] = $this->decodeJson($row['options_json'] ?? null);
        $row['correct_answer_json'] = $this->decodeJson($row['correct_answer_json'] ?? null);
        return $row;
    }

    private function shapeAnswer(array $row): array
    {
        $row['selected_answer_json'] = $this->decodeJson($row['selected_answer_json'] ?? null);
        $row['correct_answer_json'] = $this->decodeJson($row['correct_answer_json'] ?? null);
        return $row;
    }

    private function answerMatches(mixed $selected, mixed $correct): bool
    {
        $selectedList = is_array($selected) ? array_values($selected) : [$selected];
        $correctList = is_array($correct) ? array_values($correct) : [$correct];
        $selectedList = array_map(static fn (mixed $item): string => strtolower(trim((string) $item)), $selectedList);
        $correctList = array_map(static fn (mixed $item): string => strtolower(trim((string) $item)), $correctList);
        sort($selectedList);
        sort($correctList);
        return $selectedList === $correctList;
    }

    private function json(mixed $value): ?string
    {
        return $value === null ? null : json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
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
