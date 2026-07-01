<?php

declare(strict_types=1);

use Chemlab\Config\Config;

return [
    'env' => Config::get('APP_ENV', 'production'),
    'name' => Config::get('APP_NAME', 'Chemlab'),
    'url' => Config::get('APP_URL', 'https://www.chemlearning.in'),
    'frontend_url' => Config::get('FRONTEND_URL', 'https://www.chemlearning.in'),
    'api_url' => Config::get('API_URL', 'https://api.chemlearning.in'),
    'default_language' => Config::get('DEFAULT_LANGUAGE', 'en'),
];
