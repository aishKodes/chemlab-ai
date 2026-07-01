<?php

declare(strict_types=1);

namespace Chemlab\Middleware;

use Chemlab\Config\Config;
use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Services\RateLimiter;
use PDO;
use Throwable;

final class RateLimitMiddleware
{
    public static function handle(Request $request, PDO $pdo): void
    {
        $routeKey = $request->method . ' ' . $request->path;
        $authRoute = str_starts_with($request->path, '/api/auth/');
        $limit = $authRoute
            ? Config::int('AUTH_RATE_LIMIT_PER_MINUTE', 10)
            : Config::int('RATE_LIMIT_PER_MINUTE', 60);

        try {
            $result = (new RateLimiter($pdo))->hit($request->ip(), $routeKey, $limit);
        } catch (Throwable $throwable) {
            error_log('[Chemlab API] Rate limit skipped: ' . $throwable->getMessage());
            return;
        }

        header('X-RateLimit-Limit: ' . $result['limit']);
        header('X-RateLimit-Remaining: ' . $result['remaining']);
        header('X-RateLimit-Reset: ' . $result['reset']);

        if (!$result['allowed']) {
            Response::json([
                'ok' => false,
                'error' => [
                    'code' => 'rate_limited',
                    'message' => 'Too many requests. Please try again soon.',
                ],
            ], 429, ['Retry-After' => '60']);
        }
    }
}
