<?php

declare(strict_types=1);

namespace Chemlab\Services;

use Chemlab\Config\Config;
use PDO;

final class TokenService
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function create(int $userId, ?string $deviceLabel = null, ?string $ip = null, ?string $userAgent = null): array
    {
        $plain = bin2hex(random_bytes(32));
        $hash = $this->hash($plain);
        $days = Config::int('JWT_EXPIRES_DAYS', 30);
        $expiresAt = date('Y-m-d H:i:s', time() + ($days * 86400));

        $stmt = $this->pdo->prepare(
            'INSERT INTO auth_tokens (user_id, token_hash, device_label, ip_hash, user_agent_hash, expires_at, created_at)
             VALUES (:user_id, :token_hash, :device_label, :ip_hash, :user_agent_hash, :expires_at, NOW())'
        );
        $stmt->execute([
            'user_id' => $userId,
            'token_hash' => $hash,
            'device_label' => $deviceLabel ?: 'web',
            'ip_hash' => $ip ? $this->hash($ip) : null,
            'user_agent_hash' => $userAgent ? $this->hash($userAgent) : null,
            'expires_at' => $expiresAt,
        ]);

        return [
            'token' => $plain,
            'expires_at' => $expiresAt,
        ];
    }

    public function userForToken(string $plainToken): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT users.id, users.uuid, users.role, users.name, users.email, users.phone, users.avatar_url,
                    users.preferred_language, users.status, users.email_verified_at, users.last_login_at,
                    users.created_at, users.updated_at,
                    student_profiles.class_level, student_profiles.board, student_profiles.school_name, student_profiles.learning_goal,
                    teacher_profiles.school_or_institute, teacher_profiles.subject, teacher_profiles.classes_taught, teacher_profiles.verification_status
             FROM auth_tokens
             INNER JOIN users ON users.id = auth_tokens.user_id
             LEFT JOIN student_profiles ON student_profiles.user_id = users.id
             LEFT JOIN teacher_profiles ON teacher_profiles.user_id = users.id
             WHERE auth_tokens.token_hash = :token_hash
               AND auth_tokens.revoked_at IS NULL
               AND auth_tokens.expires_at > NOW()
               AND users.status IN ("active", "pending")
             LIMIT 1'
        );
        $stmt->execute(['token_hash' => $this->hash($plainToken)]);
        $user = $stmt->fetch();
        if (!$user) {
            return null;
        }
        if (isset($user['classes_taught']) && is_string($user['classes_taught'])) {
            $decoded = json_decode($user['classes_taught'], true);
            $user['classes_taught'] = json_last_error() === JSON_ERROR_NONE ? $decoded : $user['classes_taught'];
        }

        return $user;
    }

    public function revoke(string $plainToken): void
    {
        $this->pdo->prepare('UPDATE auth_tokens SET revoked_at = NOW() WHERE token_hash = :token_hash')->execute([
            'token_hash' => $this->hash($plainToken),
        ]);
    }

    public function hash(string $value): string
    {
        $secret = Config::get('JWT_SECRET') ?: Config::get('APP_KEY') ?: 'chemlab-dev-secret-change-me';
        return hash_hmac('sha256', $value, $secret);
    }
}
