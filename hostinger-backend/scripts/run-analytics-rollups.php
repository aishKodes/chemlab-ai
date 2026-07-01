<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('CLI only.');
}

require dirname(__DIR__) . '/src/bootstrap.php';

use Chemlab\Database\Database;
use Chemlab\Services\AnalyticsRollupService;

$date = $argv[1] ?? null;
$result = (new AnalyticsRollupService(Database::connection()))->run($date ?: null);

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
