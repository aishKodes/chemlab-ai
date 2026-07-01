<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('CLI only.');
}

require dirname(__DIR__) . '/bootstrap.php';

use Chemlab\Database\Database;

$pdo = Database::connection();
$pdo->exec(
    'CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        migration VARCHAR(190) NOT NULL,
        batch INT NOT NULL DEFAULT 1,
        ran_at DATETIME NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY schema_migrations_migration_unique (migration)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
);

$ran = $pdo->query('SELECT migration FROM schema_migrations')->fetchAll(PDO::FETCH_COLUMN) ?: [];
$batch = ((int) $pdo->query('SELECT COALESCE(MAX(batch), 0) FROM schema_migrations')->fetchColumn()) + 1;
$files = glob(dirname(__DIR__, 2) . '/migrations/*.sql') ?: [];
sort($files);

foreach ($files as $file) {
    $name = basename($file);
    if (in_array($name, $ran, true)) {
        echo "Already migrated: {$name}\n";
        continue;
    }

    echo "Running migration: {$name}\n";
    $pdo->beginTransaction();
    try {
        runSqlFile($pdo, $file);
        $stmt = $pdo->prepare('INSERT INTO schema_migrations (migration, batch, ran_at) VALUES (:migration, :batch, NOW())');
        $stmt->execute(['migration' => $name, 'batch' => $batch]);
        $pdo->commit();
    } catch (Throwable $throwable) {
        $pdo->rollBack();
        throw $throwable;
    }
}

echo "Migrations complete.\n";

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
