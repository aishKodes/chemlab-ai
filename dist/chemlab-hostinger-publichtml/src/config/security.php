<?php

declare(strict_types=1);

use Chemlab\Config\Config;

return [
    'jwt_secret' => Config::get('JWT_SECRET', ''),
    'token_expires_days' => Config::int('JWT_EXPIRES_DAYS', 30),
    'upload_max_mb' => Config::int('UPLOAD_MAX_MB', 5),
    'upload_allowed_types' => Config::list('UPLOAD_ALLOWED_TYPES', [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
    ]),
];
