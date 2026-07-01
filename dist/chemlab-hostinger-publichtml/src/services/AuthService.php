<?php

declare(strict_types=1);

namespace Chemlab\Services;

use PDO;
use RuntimeException;

final class AuthService
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function signup(array $input, string $ip, string $userAgent): array
    {
        $role = (string) ($input['role'] ?? 'student');
        if (!in_array($role, ['student', 'teacher'], true)) {
            throw new RuntimeException('Only student and teacher signup is allowed.');
        }

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare(
                'INSERT INTO users (uuid, role, name, email, password_hash, preferred_language, status, created_at, updated_at)
                 VALUES (:uuid, :role, :name, :email, :password_hash, :preferred_language, "active", NOW(), NOW())'
            );
            $stmt->execute([
                'uuid' => self::uuid(),
                'role' => $role,
                'name' => trim((string) $input['name']),
                'email' => strtolower((string) $input['email']),
                'password_hash' => password_hash((string) $input['password'], PASSWORD_DEFAULT),
                'preferred_language' => (string) ($input['preferred_language'] ?? 'en'),
            ]);

            $userId = (int) $this->pdo->lastInsertId();
            if ($role === 'student') {
                $this->pdo->prepare(
                    'INSERT INTO student_profiles (user_id, class_level, created_at, updated_at)
                     VALUES (:user_id, :class_level, NOW(), NOW())'
                )->execute([
                    'user_id' => $userId,
                    'class_level' => $input['class_level'] ?? null,
                ]);
            } else {
                $this->pdo->prepare(
                    'INSERT INTO teacher_profiles (user_id, school_or_institute, created_at, updated_at)
                     VALUES (:user_id, :school_or_institute, NOW(), NOW())'
                )->execute([
                    'user_id' => $userId,
                    'school_or_institute' => $input['school_or_institute'] ?? null,
                ]);
            }

            $code = $this->createVerificationCode($userId, strtolower((string) $input['email']), 'signup', 15);
            $token = (new TokenService($this->pdo))->create($userId, 'signup', $ip, $userAgent);
            $user = $this->publicUser($userId);
            $this->pdo->commit();

            $mail = new MailService($this->pdo);
            $role === 'student'
                ? $mail->sendWelcomeStudentEmail($user)
                : $mail->sendWelcomeTeacherEmail($user);
            $mail->sendVerificationEmail($user, $code);
            $mail->sendAdminNewSignupEmail($user);

            return [
                'user' => $user,
                'token' => $token['token'],
                'expires_at' => $token['expires_at'],
            ];
        } catch (\Throwable $throwable) {
            $this->pdo->rollBack();
            throw $throwable;
        }
    }

    public function login(string $email, string $password, string $ip, string $userAgent): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE email = :email AND status IN ("active", "pending") LIMIT 1');
        $stmt->execute(['email' => strtolower($email)]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, (string) $user['password_hash'])) {
            return null;
        }

        $this->pdo->prepare('UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = :id')->execute(['id' => $user['id']]);
        $token = (new TokenService($this->pdo))->create((int) $user['id'], 'login', $ip, $userAgent);

        return [
            'user' => $this->publicUser((int) $user['id']),
            'token' => $token['token'],
            'expires_at' => $token['expires_at'],
        ];
    }

    public function publicUser(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT users.id, users.uuid, users.role, users.name, users.email, users.phone, users.avatar_url, users.preferred_language, users.status,
                    users.email_verified_at, users.last_login_at, users.created_at, users.updated_at,
                    student_profiles.class_level, student_profiles.board, student_profiles.school_name, student_profiles.learning_goal,
                    teacher_profiles.school_or_institute, teacher_profiles.subject, teacher_profiles.classes_taught, teacher_profiles.verification_status
             FROM users
             LEFT JOIN student_profiles ON student_profiles.user_id = users.id
             LEFT JOIN teacher_profiles ON teacher_profiles.user_id = users.id
             WHERE users.id = :id LIMIT 1'
        );
        $stmt->execute(['id' => $userId]);
        $user = $stmt->fetch();

        if (!$user) {
            throw new RuntimeException('User not found.');
        }
        if (isset($user['classes_taught']) && is_string($user['classes_taught'])) {
            $decoded = json_decode($user['classes_taught'], true);
            $user['classes_taught'] = json_last_error() === JSON_ERROR_NONE ? $decoded : $user['classes_taught'];
        }

        return $user;
    }

    public function createVerificationCode(int $userId, string $email, string $purpose, int $minutes): string
    {
        $code = (string) random_int(100000, 999999);
        $this->pdo->prepare(
            'INSERT INTO email_verification_codes (user_id, email, code_hash, purpose, expires_at, created_at)
             VALUES (:user_id, :email, :code_hash, :purpose, :expires_at, NOW())'
        )->execute([
            'user_id' => $userId,
            'email' => $email,
            'code_hash' => password_hash($code, PASSWORD_DEFAULT),
            'purpose' => $purpose,
            'expires_at' => date('Y-m-d H:i:s', time() + ($minutes * 60)),
        ]);

        return $code;
    }

    public function verifyEmail(int $userId, string $code): bool
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM email_verification_codes
             WHERE user_id = :user_id AND purpose = "signup" AND used_at IS NULL AND expires_at > NOW()
             ORDER BY id DESC LIMIT 1'
        );
        $stmt->execute(['user_id' => $userId]);
        $row = $stmt->fetch();

        if (!$row) {
            return false;
        }

        $this->pdo->prepare('UPDATE email_verification_codes SET attempts = attempts + 1 WHERE id = :id')->execute(['id' => $row['id']]);
        if (!password_verify($code, (string) $row['code_hash'])) {
            return false;
        }

        $this->pdo->prepare('UPDATE email_verification_codes SET used_at = NOW() WHERE id = :id')->execute(['id' => $row['id']]);
        $this->pdo->prepare('UPDATE users SET email_verified_at = NOW(), updated_at = NOW() WHERE id = :id')->execute(['id' => $userId]);
        return true;
    }

    public function createPasswordReset(string $email): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, uuid, role, name, email FROM users WHERE email = :email AND status IN ("active", "pending") LIMIT 1');
        $stmt->execute(['email' => strtolower($email)]);
        $user = $stmt->fetch();
        if (!$user) {
            return null;
        }

        $token = bin2hex(random_bytes(24));
        $hash = (new TokenService($this->pdo))->hash($token);
        $this->pdo->prepare(
            'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, created_at)
             VALUES (:user_id, :token_hash, :expires_at, NOW())'
        )->execute([
            'user_id' => $user['id'],
            'token_hash' => $hash,
            'expires_at' => date('Y-m-d H:i:s', time() + 1800),
        ]);

        return ['user' => $user, 'token' => $token];
    }

    public function resetPassword(string $token, string $password): bool
    {
        $hash = (new TokenService($this->pdo))->hash($token);
        $stmt = $this->pdo->prepare(
            'SELECT * FROM password_reset_tokens
             WHERE token_hash = :token_hash AND used_at IS NULL AND expires_at > NOW()
             LIMIT 1'
        );
        $stmt->execute(['token_hash' => $hash]);
        $row = $stmt->fetch();
        if (!$row) {
            return false;
        }

        $this->pdo->prepare('UPDATE users SET password_hash = :password_hash, updated_at = NOW() WHERE id = :id')->execute([
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'id' => $row['user_id'],
        ]);
        $this->pdo->prepare('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = :id')->execute(['id' => $row['id']]);
        return true;
    }

    public static function uuid(): string
    {
        return bin2hex(random_bytes(16));
    }
}
