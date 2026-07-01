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
    foreach (splitSqlStatements((string) $sql) as $statement) {
        $pdo->exec($statement);
    }
}

function splitSqlStatements(string $sql): array
{
    $statements = [];
    $current = '';
    $quote = null;
    $length = strlen($sql);

    for ($i = 0; $i < $length; $i++) {
        $char = $sql[$i];

        if ($quote !== null) {
            $current .= $char;

            if (($quote === "'" || $quote === '"') && $char === '\\' && $i + 1 < $length) {
                $current .= $sql[++$i];
                continue;
            }

            if ($char === $quote) {
                if ($i + 1 < $length && $sql[$i + 1] === $quote) {
                    $current .= $sql[++$i];
                    continue;
                }
                $quote = null;
            }

            continue;
        }

        if ($char === "'" || $char === '"' || $char === '`') {
            $quote = $char;
            $current .= $char;
            continue;
        }

        if ($char === ';') {
            $statement = trim($current);
            if ($statement !== '') {
                $statements[] = $statement;
            }
            $current = '';
            continue;
        }

        $current .= $char;
    }

    $statement = trim($current);
    if ($statement !== '') {
        $statements[] = $statement;
    }

    return $statements;
}
