<?php

declare(strict_types=1);

namespace Chemlab\Middleware;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Services\TokenService;
use PDO;

final class AuthMiddleware
{
    public static function user(Request $request, PDO $pdo): ?array
    {
        $token = $request->bearerToken();
        if ($token === null) {
            return null;
        }

        return (new TokenService($pdo))->userForToken($token);
    }

    public static function requireUser(Request $request, PDO $pdo): array
    {
        $user = self::user($request, $pdo);
        if ($user === null) {
            Response::json([
                'ok' => false,
                'error' => [
                    'code' => 'unauthenticated',
                    'message' => 'A valid bearer token is required.',
                ],
            ], 401);
        }

        return $user;
    }

    public static function requireRole(Request $request, PDO $pdo, array $roles): array
    {
        $user = self::requireUser($request, $pdo);
        if (!in_array((string) ($user['role'] ?? ''), $roles, true)) {
            Response::json([
                'ok' => false,
                'error' => [
                    'code' => 'forbidden',
                    'message' => 'You do not have permission to perform this action.',
                ],
            ], 403);
        }

        return $user;
    }
}
