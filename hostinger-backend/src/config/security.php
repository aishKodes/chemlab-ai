<?php

declare(strict_types=1);

use Chemlab\Config\Config;

return [
    'jwt_secret' => Config::get('JWT_SECRET', ''),
    'token_expires_days' => Config::int('JWT_EXPIRES_DAYS', 30),
    'beta_unlimited_auth' => Config::bool('BETA_UNLIMITED_AUTH', true),
    'auth_rate_limit_per_minute' => Config::int('AUTH_RATE_LIMIT_PER_MINUTE', 10),
    'rate_limit_per_minute' => Config::int('RATE_LIMIT_PER_MINUTE', 60),
    'upload_max_mb' => Config::int('UPLOAD_MAX_MB', 5),
    'upload_allowed_types' => Config::list('UPLOAD_ALLOWED_TYPES', [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
    ]),
];
