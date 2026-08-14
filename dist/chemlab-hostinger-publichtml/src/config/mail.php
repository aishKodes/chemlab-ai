<?php

declare(strict_types=1);

use Chemlab\Config\Config;

return [
    'host' => Config::get('SMTP_HOST', ''),
    'port' => Config::int('SMTP_PORT', 465),
    'secure' => Config::get('SMTP_SECURE', 'ssl'),
    'username' => Config::get('SMTP_USERNAME', ''),
    'password' => Config::get('SMTP_PASSWORD', ''),
    'from_email' => Config::get('SMTP_FROM_EMAIL', ''),
    'from_name' => Config::get('SMTP_FROM_NAME', 'chemlearning'),
];
