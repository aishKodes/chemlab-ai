<?php

declare(strict_types=1);

namespace Chemlab\Middleware;

use Chemlab\Config\Config;
use Chemlab\Helpers\Request;

final class CorsMiddleware
{
    public static function handle(Request $request): void
    {
        $origin = $request->header('Origin');
        $allowedOrigins = Config::value('cors', 'allowed_origins', ['https://www.chemlearning.in']);

        if ($origin !== null && in_array($origin, $allowedOrigins, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
        }

        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
        header('Access-Control-Max-Age: 86400');

        if ($request->method === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
