<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    exit("Run this script from the command line.\n");
}

$projectRoot = dirname(__DIR__);
$targets = [
    'source' => $projectRoot . '/hostinger-backend',
    'package' => $projectRoot . '/dist/chemlab-hostinger-publichtml',
];
$failed = false;

foreach ($targets as $label => $root) {
    check(is_dir($root), "{$label}: root exists at {$root}");

    foreach (['install.php', 'database/schema.sql', 'database/seed.sql'] as $relativePath) {
        check(is_file($root . '/' . $relativePath), "{$label}: {$relativePath} exists");
    }

    foreach (['install.php', 'src/database/seed.php', 'src/database/migrate.php'] as $relativePath) {
        $path = $root . '/' . $relativePath;
        if (!is_file($path)) {
            continue;
        }
        $content = (string) file_get_contents($path);
        check(!str_contains($content, "explode(';") && !str_contains($content, 'explode(";'), "{$label}: {$relativePath} does not use naive semicolon splitting");
        check(str_contains($content, 'splitSqlStatements'), "{$label}: {$relativePath} uses quote-aware SQL splitting");
    }

    foreach (['database/schema.sql', 'database/seed.sql'] as $relativePath) {
        $path = $root . '/' . $relativePath;
        if (!is_file($path)) {
            continue;
        }
        $sql = (string) file_get_contents($path);
        check(!hasQuotedSemicolon($sql), "{$label}: {$relativePath} has no semicolons inside quoted SQL strings");
        check(!preg_match('/SELECT\s+b\.id,\s*c\.id,\s*s\.id,\s*chapter_number\b/i', $sql), "{$label}: {$relativePath} qualifies seeded chapter_number columns");
        check(!preg_match('/SELECT\s+b\.id,\s*c\.id,\s*s\.id,\s*title\b/i', $sql), "{$label}: {$relativePath} qualifies seeded title columns");
        check(!preg_match('/SELECT\s+ch\.id,\s*ch\.class_id,\s*ch\.subject_id,\s*topic_title\b/i', $sql), "{$label}: {$relativePath} qualifies seeded topic columns");
        check(!preg_match('/status\s*=\s*IF\s*\(\s*status\b/i', $sql), "{$label}: {$relativePath} qualifies status updates");
    }
}

if ($failed) {
    fwrite(STDERR, "Hostinger package sanity check failed.\n");
    exit(1);
}

echo "Hostinger package sanity check passed.\n";

function check(bool $condition, string $message): void
{
    global $failed;

    if ($condition) {
        echo "[ok] {$message}\n";
        return;
    }

    $failed = true;
    echo "[fail] {$message}\n";
}

function hasQuotedSemicolon(string $sql): bool
{
    $quote = null;
    $length = strlen($sql);

    for ($i = 0; $i < $length; $i++) {
        $char = $sql[$i];

        if ($quote !== null) {
            if (($quote === "'" || $quote === '"') && $char === '\\' && $i + 1 < $length) {
                $i++;
                continue;
            }

            if ($char === ';') {
                return true;
            }

            if ($char === $quote) {
                if ($i + 1 < $length && $sql[$i + 1] === $quote) {
                    $i++;
                    continue;
                }
                $quote = null;
            }

            continue;
        }

        if ($char === "'" || $char === '"') {
            $quote = $char;
        }
    }

    return false;
}
