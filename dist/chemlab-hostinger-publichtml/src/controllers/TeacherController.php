<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\AuthMiddleware;
use Chemlab\Services\AuthService;
use PDO;

final class TeacherController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function overview(Request $request): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $teacherId = (int) $teacher['id'];

        return Response::ok([
            'summary' => [
                'classrooms' => $this->count('teacher_classrooms', 'teacher_user_id', $teacherId),
                'assignments' => $this->count('teacher_assignments', 'teacher_user_id', $teacherId),
                'active_students' => $this->activeStudents($teacherId),
            ],
            'recent_activity' => $this->recentClassroomEvents($teacherId),
        ]);
    }

    public function analyticsClassrooms(Request $request): Response
    {
        return $this->classrooms($request);
    }

    public function classrooms(Request $request): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $stmt = $this->pdo->prepare(
            'SELECT teacher_classrooms.*,
                    COUNT(classroom_students.id) AS student_count
             FROM teacher_classrooms
             LEFT JOIN classroom_students ON classroom_students.classroom_id = teacher_classrooms.id AND classroom_students.status = "active"
             WHERE teacher_classrooms.teacher_user_id = :teacher_id
             GROUP BY teacher_classrooms.id
             ORDER BY teacher_classrooms.updated_at DESC'
        );
        $stmt->execute(['teacher_id' => $teacher['id']]);

        return Response::ok(['classrooms' => $stmt->fetchAll()]);
    }

    public function createClassroom(Request $request): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $input = $request->json();
        $name = trim((string) ($input['name'] ?? ''));
        if ($name === '') {
            return Response::error('VALIDATION_ERROR', 'Classroom name is required.', 422);
        }
        $joinCode = $this->joinCode();
        $stmt = $this->pdo->prepare(
            'INSERT INTO teacher_classrooms
             (uuid, teacher_user_id, name, class_level, subject, join_code, status, created_at, updated_at)
             VALUES (:uuid, :teacher_user_id, :name, :class_level, :subject, :join_code, "active", NOW(), NOW())'
        );
        $stmt->execute([
            'uuid' => AuthService::uuid(),
            'teacher_user_id' => $teacher['id'],
            'name' => $name,
            'class_level' => $input['class_level'] ?? null,
            'subject' => $input['subject'] ?? 'Chemistry',
            'join_code' => $joinCode,
        ]);

        return Response::ok(['classroom_id' => (int) $this->pdo->lastInsertId(), 'join_code' => $joinCode], 201);
    }

    public function classroom(Request $request, array $params): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $classroom = $this->ownedClassroom((int) ($params['id'] ?? 0), (int) $teacher['id']);
        if (!$classroom) {
            return Response::error('NOT_FOUND', 'Classroom not found.', 404);
        }

        $students = $this->pdo->prepare(
            'SELECT classroom_students.*, users.name, users.email, student_profiles.class_level
             FROM classroom_students
             INNER JOIN users ON users.id = classroom_students.student_user_id
             LEFT JOIN student_profiles ON student_profiles.user_id = users.id
             WHERE classroom_students.classroom_id = :classroom_id
             ORDER BY classroom_students.joined_at DESC'
        );
        $students->execute(['classroom_id' => $classroom['id']]);

        $assignments = $this->pdo->prepare('SELECT * FROM teacher_assignments WHERE classroom_id = :classroom_id ORDER BY created_at DESC');
        $assignments->execute(['classroom_id' => $classroom['id']]);

        return Response::ok([
            'classroom' => $classroom,
            'students' => $students->fetchAll(),
            'assignments' => $assignments->fetchAll(),
        ]);
    }

    public function regenerateJoinCode(Request $request, array $params): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $classroom = $this->ownedClassroom((int) ($params['id'] ?? 0), (int) $teacher['id']);
        if (!$classroom) {
            return Response::error('NOT_FOUND', 'Classroom not found.', 404);
        }
        $joinCode = $this->joinCode();
        $stmt = $this->pdo->prepare('UPDATE teacher_classrooms SET join_code = :join_code, updated_at = NOW() WHERE id = :id');
        $stmt->execute(['join_code' => $joinCode, 'id' => $classroom['id']]);

        return Response::ok(['join_code' => $joinCode]);
    }

    public function createAssignment(Request $request, array $params): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $classroom = $this->ownedClassroom((int) ($params['id'] ?? 0), (int) $teacher['id']);
        if (!$classroom) {
            return Response::error('NOT_FOUND', 'Classroom not found.', 404);
        }
        $input = $request->json();
        $title = trim((string) ($input['title'] ?? ''));
        if ($title === '') {
            return Response::error('VALIDATION_ERROR', 'Assignment title is required.', 422);
        }

        $stmt = $this->pdo->prepare(
            'INSERT INTO teacher_assignments
             (uuid, teacher_user_id, classroom_id, resource_id, deck_id, drill_id, title, instructions, due_at, status, created_at, updated_at)
             VALUES (:uuid, :teacher_user_id, :classroom_id, :resource_id, :deck_id, :drill_id, :title, :instructions, :due_at, "assigned", NOW(), NOW())'
        );
        $stmt->execute([
            'uuid' => AuthService::uuid(),
            'teacher_user_id' => $teacher['id'],
            'classroom_id' => $classroom['id'],
            'resource_id' => $input['resource_id'] ?? null,
            'deck_id' => $input['deck_id'] ?? null,
            'drill_id' => $input['drill_id'] ?? null,
            'title' => $title,
            'instructions' => $input['instructions'] ?? null,
            'due_at' => $input['due_at'] ?? null,
        ]);

        return Response::ok(['assignment_id' => (int) $this->pdo->lastInsertId()], 201);
    }

    public function assignments(Request $request): Response
    {
        $teacher = AuthMiddleware::requireRole($request, $this->pdo, ['teacher', 'admin']);
        $stmt = $this->pdo->prepare(
            'SELECT teacher_assignments.*, teacher_classrooms.name AS classroom_name
             FROM teacher_assignments
             LEFT JOIN teacher_classrooms ON teacher_classrooms.id = teacher_assignments.classroom_id
             WHERE teacher_assignments.teacher_user_id = :teacher_id
             ORDER BY teacher_assignments.created_at DESC'
        );
        $stmt->execute(['teacher_id' => $teacher['id']]);

        return Response::ok(['assignments' => $stmt->fetchAll()]);
    }

    public function joinClassroom(Request $request): Response
    {
        $student = AuthMiddleware::requireRole($request, $this->pdo, ['student', 'admin']);
        $code = strtoupper(trim((string) ($request->json()['join_code'] ?? '')));
        if ($code === '') {
            return Response::error('VALIDATION_ERROR', 'Join code is required.', 422);
        }

        $stmt = $this->pdo->prepare('SELECT * FROM teacher_classrooms WHERE join_code = :join_code AND status = "active" LIMIT 1');
        $stmt->execute(['join_code' => $code]);
        $classroom = $stmt->fetch();
        if (!$classroom) {
            return Response::error('NOT_FOUND', 'Classroom code not found.', 404);
        }

        $insert = $this->pdo->prepare(
            'INSERT INTO classroom_students (classroom_id, student_user_id, status, joined_at, created_at)
             VALUES (:classroom_id, :student_user_id, "active", NOW(), NOW())
             ON DUPLICATE KEY UPDATE status = "active", joined_at = NOW()'
        );
        $insert->execute(['classroom_id' => $classroom['id'], 'student_user_id' => $student['id']]);

        return Response::ok(['joined' => true, 'classroom' => $classroom]);
    }

    public function studentAssignments(Request $request): Response
    {
        $student = AuthMiddleware::requireRole($request, $this->pdo, ['student', 'admin']);
        $stmt = $this->pdo->prepare(
            'SELECT teacher_assignments.*, teacher_classrooms.name AS classroom_name, assignment_progress.status AS progress_status,
                    assignment_progress.score, assignment_progress.completed_at
             FROM teacher_assignments
             INNER JOIN classroom_students ON classroom_students.classroom_id = teacher_assignments.classroom_id
             INNER JOIN teacher_classrooms ON teacher_classrooms.id = teacher_assignments.classroom_id
             LEFT JOIN assignment_progress ON assignment_progress.assignment_id = teacher_assignments.id
                 AND assignment_progress.student_user_id = classroom_students.student_user_id
             WHERE classroom_students.student_user_id = :student_id
               AND classroom_students.status = "active"
               AND teacher_assignments.status = "assigned"
             ORDER BY teacher_assignments.created_at DESC'
        );
        $stmt->execute(['student_id' => $student['id']]);

        return Response::ok(['assignments' => $stmt->fetchAll()]);
    }

    private function ownedClassroom(int $id, int $teacherId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM teacher_classrooms WHERE id = :id AND teacher_user_id = :teacher_id LIMIT 1');
        $stmt->execute(['id' => $id, 'teacher_id' => $teacherId]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    private function joinCode(): string
    {
        do {
            $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
            $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM teacher_classrooms WHERE join_code = :join_code');
            $stmt->execute(['join_code' => $code]);
        } while ((int) $stmt->fetchColumn() > 0);

        return $code;
    }

    private function count(string $table, string $field, int $value): int
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM {$table} WHERE {$field} = :value");
        $stmt->execute(['value' => $value]);
        return (int) $stmt->fetchColumn();
    }

    private function activeStudents(int $teacherId): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(DISTINCT classroom_students.student_user_id)
             FROM classroom_students
             INNER JOIN teacher_classrooms ON teacher_classrooms.id = classroom_students.classroom_id
             WHERE teacher_classrooms.teacher_user_id = :teacher_id AND classroom_students.status = "active"'
        );
        $stmt->execute(['teacher_id' => $teacherId]);
        return (int) $stmt->fetchColumn();
    }

    private function recentClassroomEvents(int $teacherId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT learning_events.*
             FROM learning_events
             INNER JOIN classroom_students ON classroom_students.student_user_id = learning_events.user_id
             INNER JOIN teacher_classrooms ON teacher_classrooms.id = classroom_students.classroom_id
             WHERE teacher_classrooms.teacher_user_id = :teacher_id
             ORDER BY learning_events.created_at DESC
             LIMIT 20'
        );
        $stmt->execute(['teacher_id' => $teacherId]);
        return $stmt->fetchAll();
    }
}
