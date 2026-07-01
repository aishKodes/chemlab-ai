<?php

declare(strict_types=1);

use Chemlab\Config\Config;

return [
    'allowed_origins' => Config::list('CORS_ALLOWED_ORIGINS', [
        'https://www.chemlearning.in',
        'https://chemlearning.in',
        'http://localhost:3000',
    ]),
];
