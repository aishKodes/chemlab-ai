<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('CLI only.');
}

$basePath = dirname(__DIR__);
require $basePath . '/src/bootstrap.php';

use Chemlab\Config\Config;

$failures = 0;

function checkLine(string $status, string $message): void
{
    echo '[' . strtoupper($status) . '] ' . $message . PHP_EOL;
}

function pass(string $message): void
{
    checkLine('pass', $message);
}

function warn(string $message): void
{
    checkLine('warn', $message);
}

function failCheck(string $message): void
{
    global $failures;
    $failures++;
    checkLine('fail', $message);
}

pass('PHP version: ' . PHP_VERSION);
if (version_compare(PHP_VERSION, '8.1.0', '<')) {
    failCheck('PHP 8.1+ is required.');
}

foreach (['pdo', 'pdo_mysql', 'json', 'mbstring', 'fileinfo', 'openssl'] as $extension) {
    extension_loaded($extension) ? pass("Extension {$extension} loaded.") : failCheck("Extension {$extension} is missing.");
}

$envPath = $basePath . '/.env';
is_file($envPath) ? pass('.env file exists.') : warn('.env file is missing. Copy .env.example and fill Hostinger values.');

foreach (['APP_ENV', 'DB_HOST', 'DB_NAME', 'DB_USER', 'JWT_SECRET', 'CORS_ALLOWED_ORIGINS'] as $key) {
    Config::get($key, '') !== '' ? pass("{$key} is set.") : warn("{$key} is not set.");
}

foreach (['SMTP_HOST', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM_EMAIL'] as $key) {
    Config::get($key, '') !== '' ? pass("{$key} is set.") : warn("{$key} is not set. Email will fail until SMTP is configured.");
}

foreach ([
    'storage/logs' => $basePath . '/storage/logs',
    'storage/mail' => $basePath . '/storage/mail',
    'public/uploads' => $basePath . '/public/uploads',
] as $label => $path) {
    if (!is_dir($path)) {
        warn("{$label} directory is missing. Create it on Hostinger.");
        continue;
    }
    is_writable($path) ? pass("{$label} is writable.") : warn("{$label} is not writable by PHP.");
}

$origins = Config::list('CORS_ALLOWED_ORIGINS');
if ($origins === []) {
    warn('No CORS origins configured.');
} else {
    pass('CORS origins: ' . implode(', ', $origins));
}

echo PHP_EOL;
if ($failures > 0) {
    checkLine('fail', "Backend readiness check completed with {$failures} hard failure(s).");
    exit(1);
}

pass('Backend readiness check completed without hard failures.');
