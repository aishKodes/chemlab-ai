<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('CLI only.');
}

require dirname(__DIR__) . '/bootstrap.php';

use Chemlab\Database\Database;

$pdo = Database::connection();
$files = glob(dirname(__DIR__, 2) . '/seeders/*') ?: [];
sort($files);

foreach ($files as $file) {
    $name = basename($file);
    echo "Running seeder: {$name}\n";
    if (str_ends_with($file, '.sql')) {
        runSqlFile($pdo, $file);
        continue;
    }

    if (str_ends_with($file, '.php')) {
        $seeder = require $file;
        if (is_callable($seeder)) {
            $seeder($pdo);
        }
    }
}

echo "Seeders complete.\n";

function runSqlFile(PDO $pdo, string $file): void
{
    $sql = preg_replace('/^\s*--.*$/m', '', (string) file_get_contents($file));
    foreach (array_filter(array_map('trim', explode(';', (string) $sql))) as $statement) {
        if ($statement !== '') {
            $pdo->exec($statement);
        }
    }
}
