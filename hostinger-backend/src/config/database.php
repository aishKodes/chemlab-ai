<?php

declare(strict_types=1);

use Chemlab\Config\Config;

return [
    'host' => Config::get('DB_HOST', 'localhost'),
    'name' => Config::get('DB_NAME', ''),
    'user' => Config::get('DB_USER', ''),
    'pass' => Config::get('DB_PASS', ''),
    'charset' => Config::get('DB_CHARSET', 'utf8mb4'),
];
