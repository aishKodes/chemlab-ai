<?php

declare(strict_types=1);

use Chemlab\Controllers\AdminController;
use Chemlab\Controllers\AdminAnalyticsController;
use Chemlab\Controllers\AdminChemShastriController;
use Chemlab\Controllers\AdminCrudController;
use Chemlab\Controllers\AnalyticsController;
use Chemlab\Controllers\AuthController;
use Chemlab\Controllers\HealthController;
use Chemlab\Controllers\LearningController;
use Chemlab\Controllers\LiveQuizController;
use Chemlab\Controllers\PublicController;
use Chemlab\Controllers\PublicLearningController;
use Chemlab\Controllers\TeacherController;
use Chemlab\Controllers\UserController;
use Chemlab\Helpers\Response;
use Chemlab\Routes\Router;

return static function (Router $router, PDO $pdo): void {
    $router->get('/', static fn () => Response::ok([
        'service' => 'chemlearning Hostinger API',
        'version' => 'stage-1',
    ]));

    $health = new HealthController($pdo);
    $public = new PublicController($pdo);
    $publicLearning = new PublicLearningController($pdo);
    $auth = new AuthController($pdo);
    $user = new UserController($pdo);
    $analytics = new AnalyticsController($pdo);
    $learning = new LearningController($pdo);
    $liveQuiz = new LiveQuizController($pdo);
    $teacher = new TeacherController($pdo);
    $admin = new AdminController($pdo);
    $adminAnalytics = new AdminAnalyticsController($pdo);
    $adminChemShastri = new AdminChemShastriController($pdo);
    $adminCrud = new AdminCrudController($pdo);

    // Public
    $router->get('/api/health', [$health, 'show']);
    $router->get('/api/public/settings', [$public, 'settings']);
    $router->get('/api/public/content', [$public, 'content']);
    $router->get('/api/public/classes', [$public, 'classes']);
    $router->get('/api/public/classes/{classLevel}', [$public, 'classDetail']);
    $router->get('/api/public/resources', [$public, 'resources']);
    $router->get('/api/public/resources/{slug}', [$public, 'resource']);
    $router->get('/api/public/memory-decks', [$publicLearning, 'memoryDecks']);
    $router->get('/api/public/memory-decks/{idOrSlug}', [$publicLearning, 'memoryDeck']);
    $router->get('/api/public/memory-decks/{idOrSlug}/cards', [$publicLearning, 'memoryCards']);
    $router->get('/api/public/quick-drills', [$publicLearning, 'quickDrills']);
    $router->get('/api/public/quick-drills/{idOrSlug}', [$publicLearning, 'quickDrill']);
    $router->get('/api/public/quick-drills/{idOrSlug}/questions', [$publicLearning, 'quickDrillQuestions']);
    $router->get('/api/public/concept-maps', [$publicLearning, 'conceptMaps']);
    $router->get('/api/public/concept-maps/{idOrSlug}', [$publicLearning, 'conceptMap']);
    $router->get('/api/public/quizzes', [$liveQuiz, 'publicQuizzes']);
    $router->get('/api/public/quizzes/{slug}', [$liveQuiz, 'publicQuiz']);
    $router->post('/api/public/quizzes/{slug}/attempt', [$liveQuiz, 'publicAttempt']);
    $router->get('/api/public/quizzes/{slug}/leaderboard', [$liveQuiz, 'publicLeaderboard']);
    $router->get('/api/public/leaderboards/{quizSlug}', [$liveQuiz, 'publicLeaderboard']);

    // Auth
    $router->post('/api/auth/signup', [$auth, 'signup']);
    $router->post('/api/auth/login', [$auth, 'login']);
    $router->post('/api/auth/logout', [$auth, 'logout']);
    $router->get('/api/auth/me', [$auth, 'me']);
    $router->post('/api/auth/verify-email', [$auth, 'verifyEmail']);
    $router->post('/api/auth/resend-verification', [$auth, 'resendVerification']);
    $router->post('/api/auth/forgot-password', [$auth, 'forgotPassword']);
    $router->post('/api/auth/reset-password', [$auth, 'resetPassword']);

    // User
    $router->get('/api/user/profile', [$user, 'profile']);
    $router->put('/api/user/profile', [$user, 'updateProfile']);
    $router->get('/api/user/notifications', [$user, 'notifications']);
    $router->post('/api/user/notifications/{id}/read', [$user, 'markNotificationRead']);

    // Analytics
    $router->post('/api/analytics/event', [$analytics, 'store']);

    // Learning intelligence
    $router->post('/api/learning/resource-session/start', [$learning, 'startResourceSession']);
    $router->post('/api/learning/resource-session/end', [$learning, 'endResourceSession']);
    $router->post('/api/learning/simulation-session/start', [$learning, 'startSimulationSession']);
    $router->post('/api/learning/simulation-session/event', [$learning, 'simulationEvent']);
    $router->post('/api/learning/simulation-session/end', [$learning, 'endSimulationSession']);
    $router->post('/api/learning/mistake', [$learning, 'mistake']);
    $router->post('/api/learning/resource-feedback', [$learning, 'resourceFeedback']);
    $router->post('/api/learning/memory/review', [$learning, 'memoryReview']);
    $router->get('/api/learning/memory/due', [$learning, 'memoryDue']);
    $router->get('/api/learning/memory/decks/{deckId}/study-plan', [$learning, 'memoryStudyPlan']);
    $router->get('/api/learning/memory/progress', [$learning, 'memoryProgress']);
    $router->post('/api/learning/quick-drills/{drillId}/attempts/start', [$learning, 'startQuickDrillAttempt']);
    $router->post('/api/learning/quick-drills/attempts/{attemptId}/answer', [$learning, 'answerQuickDrillAttempt']);
    $router->post('/api/learning/quick-drills/attempts/{attemptId}/complete', [$learning, 'completeQuickDrillAttempt']);
    $router->get('/api/learning/quick-drills/attempts/{attemptId}', [$learning, 'quickDrillAttempt']);
    $router->post('/api/learning/chem-shastri/question-log', [$learning, 'logChemShastriQuestion']);
    $router->post('/api/learning/chem-shastri/feedback', [$learning, 'chemShastriFeedback']);

    // Teacher and student classroom APIs
    $router->get('/api/teacher/analytics/overview', [$teacher, 'overview']);
    $router->get('/api/teacher/analytics/classrooms', [$teacher, 'analyticsClassrooms']);
    $router->get('/api/teacher/classrooms', [$teacher, 'classrooms']);
    $router->post('/api/teacher/classrooms', [$teacher, 'createClassroom']);
    $router->get('/api/teacher/classrooms/{id}', [$teacher, 'classroom']);
    $router->post('/api/teacher/classrooms/{id}/join-code/regenerate', [$teacher, 'regenerateJoinCode']);
    $router->post('/api/teacher/classrooms/{id}/assignments', [$teacher, 'createAssignment']);
    $router->get('/api/teacher/assignments', [$teacher, 'assignments']);
    $router->post('/api/student/classrooms/join', [$teacher, 'joinClassroom']);
    $router->get('/api/student/assignments', [$teacher, 'studentAssignments']);

    // Teacher live quizzes and guest quiz rooms
    $router->get('/api/teacher/quizzes', [$liveQuiz, 'teacherQuizzes']);
    $router->post('/api/teacher/quizzes', [$liveQuiz, 'createTeacherQuiz']);
    $router->get('/api/teacher/quizzes/{id}', [$liveQuiz, 'teacherQuiz']);
    $router->put('/api/teacher/quizzes/{id}', [$liveQuiz, 'updateTeacherQuiz']);
    $router->post('/api/teacher/quizzes/{id}/start-live', [$liveQuiz, 'startLive']);
    $router->get('/api/teacher/live/{sessionId}', [$liveQuiz, 'liveSession']);
    $router->post('/api/teacher/live/{sessionId}/end', [$liveQuiz, 'endLive']);
    $router->get('/api/teacher/live/{sessionId}/results', [$liveQuiz, 'liveResults']);
    $router->get('/api/quiz-join/{pin}', [$liveQuiz, 'joinInfo']);
    $router->post('/api/quiz-join/{pin}/join', [$liveQuiz, 'joinByPin']);
    $router->post('/api/quiz-room/{sessionId}/answer', [$liveQuiz, 'roomAnswer']);
    $router->post('/api/quiz-room/{sessionId}/complete', [$liveQuiz, 'roomComplete']);

    // Admin basic
    $router->get('/api/admin/users', [$admin, 'users']);
    $router->get('/api/admin/users/{id}', [$admin, 'user']);
    $router->put('/api/admin/users/{id}/status', [$admin, 'updateUserStatus']);
    $router->put('/api/admin/users/{id}/role', [$admin, 'updateUserRole']);
    $router->post('/api/admin/teachers/{id}/verify', [$admin, 'verifyTeacher']);
    $router->get('/api/admin/users/{id}/student-profile', [$admin, 'studentProfile']);
    $router->get('/api/admin/users/{id}/teacher-profile', [$admin, 'teacherProfile']);

    // Admin resource structure
    foreach (['classes', 'subjects', 'books', 'chapters', 'topics'] as $entity) {
        $router->get('/api/admin/' . $entity, static fn ($request) => $adminCrud->list($request, $entity));
        $router->post('/api/admin/' . $entity, static fn ($request) => $adminCrud->create($request, $entity));
        $router->put('/api/admin/' . $entity . '/{id}', static fn ($request, $params) => $adminCrud->update($request, $entity, $params));
    }

    // Admin learning resources
    $router->get('/api/admin/resources', static fn ($request) => $adminCrud->list($request, 'resources'));
    $router->get('/api/admin/resources/{id}', static fn ($request, $params) => $adminCrud->show($request, 'resources', $params));
    $router->post('/api/admin/resources', static fn ($request) => $adminCrud->create($request, 'resources'));
    $router->put('/api/admin/resources/{id}', static fn ($request, $params) => $adminCrud->update($request, 'resources', $params));
    $router->post('/api/admin/resources/{id}/publish', [$adminCrud, 'publishResource']);
    $router->post('/api/admin/resources/{id}/archive', [$adminCrud, 'archiveResource']);

    // Admin learning tools
    foreach (['memory_decks', 'memory_cards', 'quick_drills', 'quiz_questions', 'concept_maps', 'mistake_patterns'] as $entity) {
        $route = str_replace('_', '-', $entity);
        $router->get('/api/admin/' . $route, static fn ($request) => $adminCrud->list($request, $entity));
        $router->get('/api/admin/' . $route . '/{id}', static fn ($request, $params) => $adminCrud->show($request, $entity, $params));
        $router->post('/api/admin/' . $route, static fn ($request) => $adminCrud->create($request, $entity));
        $router->put('/api/admin/' . $route . '/{id}', static fn ($request, $params) => $adminCrud->update($request, $entity, $params));
        $router->delete('/api/admin/' . $route . '/{id}', static fn ($request, $params) => $adminCrud->delete($request, $entity, $params));
    }

    // Admin content/media/email/notifications/settings/analytics
    $router->get('/api/admin/content', static fn ($request) => $adminCrud->list($request, 'content'));
    $router->post('/api/admin/content', static fn ($request) => $adminCrud->create($request, 'content'));
    $router->put('/api/admin/content/{id}', static fn ($request, $params) => $adminCrud->update($request, 'content', $params));
    $router->get('/api/admin/translations', static fn ($request) => $adminCrud->list($request, 'translations'));
    $router->put('/api/admin/translations/{id}', static fn ($request, $params) => $adminCrud->update($request, 'translations', $params));
    $router->get('/api/admin/media', static fn ($request) => $adminCrud->list($request, 'media'));
    $router->post('/api/admin/media/upload', [$adminCrud, 'uploadMedia']);
    $router->put('/api/admin/media/{id}', static fn ($request, $params) => $adminCrud->update($request, 'media', $params));
    $router->post('/api/admin/media/{id}/archive', [$adminCrud, 'archiveMedia']);
    $router->get('/api/admin/email-templates', static fn ($request) => $adminCrud->list($request, 'email_templates'));
    $router->put('/api/admin/email-templates/{id}', static fn ($request, $params) => $adminCrud->update($request, 'email_templates', $params));
    $router->get('/api/admin/email-logs', static fn ($request) => $adminCrud->list($request, 'email_logs'));
    $router->get('/api/admin/notifications', static fn ($request) => $adminCrud->list($request, 'notifications'));
    $router->post('/api/admin/notifications/send', [$adminCrud, 'sendNotification']);
    $router->get('/api/admin/settings', static fn ($request) => $adminCrud->list($request, 'settings'));
    $router->put('/api/admin/settings/{key}', [$admin, 'updateSetting']);
    $router->get('/api/admin/analytics/summary', [$adminAnalytics, 'summary']);
    $router->get('/api/admin/analytics/events', static fn ($request) => $adminCrud->list($request, 'learning_events'));
    $router->get('/api/admin/analytics/resources', [$adminAnalytics, 'resources']);
    $router->get('/api/admin/analytics/simulations', [$adminAnalytics, 'simulations']);
    $router->get('/api/admin/analytics/mistakes', [$adminAnalytics, 'mistakes']);
    $router->get('/api/admin/analytics/chem-shastri', [$adminAnalytics, 'chemShastri']);
    $router->get('/api/admin/analytics/students', [$adminAnalytics, 'students']);
    $router->get('/api/admin/analytics/teachers', [$adminAnalytics, 'teachers']);
    $router->get('/api/admin/analytics/rollups', [$adminAnalytics, 'rollups']);
    $router->post('/api/admin/analytics/rollups/run', [$adminAnalytics, 'runRollups']);
    $router->get('/api/admin/analytics/rollups/status', [$adminAnalytics, 'rollupStatus']);
    $router->get('/api/admin/chem-shastri/summary', [$adminChemShastri, 'summary']);
    $router->get('/api/admin/chem-shastri/questions', [$adminChemShastri, 'questions']);
    $router->get('/api/admin/chem-shastri/usage', [$adminChemShastri, 'usage']);
    $router->post('/api/admin/chem-shastri/test', [$adminChemShastri, 'test']);
    $router->post('/api/admin/chem-shastri/retrieval-test', [$adminChemShastri, 'retrievalTest']);
    $router->post('/api/admin/email/test', [$admin, 'testEmail']);
    $router->post('/api/public/leaderboards/{quizSlug}/hide-entry', [$liveQuiz, 'hideLeaderboardEntry']);
};
