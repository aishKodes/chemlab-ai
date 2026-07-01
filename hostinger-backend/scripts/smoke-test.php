<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('CLI only.');
}

$basePath = dirname(__DIR__);
require $basePath . '/src/bootstrap.php';

use Chemlab\Config\Config;
use Chemlab\Database\Database;

function line(string $status, string $message): void
{
    echo '[' . strtoupper($status) . '] ' . $message . PHP_EOL;
}

function tableCount(PDO $pdo, string $table): ?int
{
    try {
        return (int) $pdo->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
    } catch (Throwable $throwable) {
        line('warn', "Table {$table} check failed: " . $throwable->getMessage());
        return null;
    }
}

if (!is_file($basePath . '/.env')) {
    line('warn', '.env is not present. Smoke test will only verify files, not live DB credentials.');
}

if (Config::get('DB_NAME', '') === '' || Config::get('DB_USER', '') === '') {
    line('warn', 'DB_NAME or DB_USER is empty. Fill Hostinger .env before running live smoke tests.');
    exit(0);
}

try {
    $pdo = Database::connection();
    line('pass', 'Database connection opened.');
} catch (Throwable $throwable) {
    line('warn', 'Database connection failed: ' . $throwable->getMessage());
    line('warn', 'This is expected before Hostinger credentials are configured.');
    exit(0);
}

$checks = [
    'schema_migrations' => 'migrations table',
    'users' => 'users table',
    'classes' => 'Class 9-12 seed table',
    'subjects' => 'subjects table',
    'learning_resources' => 'simulation resources',
    'email_templates' => 'email templates',
    'learning_events' => 'analytics events',
    'chem_shastri_question_logs' => 'Chem-Shastri question logs',
];

foreach ($checks as $table => $label) {
    $count = tableCount($pdo, $table);
    if ($count === null) {
        continue;
    }
    line('pass', "{$label}: {$count} row(s).");
}

$adminCount = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
$classCount = (int) $pdo->query("SELECT COUNT(*) FROM classes WHERE class_level IN ('9','10','11','12')")->fetchColumn();
$resourceCount = (int) $pdo->query("SELECT COUNT(*) FROM learning_resources WHERE slug IN ('redox-transfer-kitchen','hydrocarbon-naming-quest')")->fetchColumn();
$templateCount = (int) $pdo->query("SELECT COUNT(*) FROM email_templates WHERE template_key IN ('verify_email','welcome_student','welcome_teacher','password_reset','admin_new_signup')")->fetchColumn();

$adminCount > 0 ? line('pass', 'At least one admin user exists.') : line('warn', 'No admin user found. Run seeders with ADMIN_* env values.');
$classCount === 4 ? line('pass', 'Class 9-12 records exist.') : line('warn', 'Class 9-12 records are incomplete.');
$resourceCount >= 2 ? line('pass', 'Core simulation resources are seeded.') : line('warn', 'Core simulation resources are missing or incomplete.');
$templateCount >= 5 ? line('pass', 'Core email templates are seeded.') : line('warn', 'Core email templates are incomplete.');

line('pass', 'Smoke test completed.');
