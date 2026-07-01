<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    exit("Run this script from the command line.\n");
}

$projectRoot = dirname(__DIR__);
$backendRoot = $projectRoot . '/hostinger-backend';
$distRoot = $projectRoot . '/dist';
$packageRoot = $distRoot . '/chemlab-hostinger-publichtml';

ensureDirectory($backendRoot . '/database');
writeCombinedSql(
    glob($backendRoot . '/migrations/*.sql') ?: [],
    $backendRoot . '/database/schema.sql',
    "-- Chemlab public_html schema.sql\n-- Import this first in phpMyAdmin.\n\n"
);
writeCombinedSql(
    array_values(array_filter(glob($backendRoot . '/seeders/*.sql') ?: [], static fn (string $file): bool => !str_contains($file, '005_first_admin.php'))),
    $backendRoot . '/database/seed.sql',
    "-- Chemlab public_html seed.sql\n-- Import this after schema.sql. Admin is created by install.php.\n\n"
);

removeDirectory($packageRoot);
ensureDirectory($packageRoot);

foreach (['index.php', 'health.php', 'install.php', 'config.example.php', '.htaccess', 'README_PUBLIC_HTML_INSTALL.md'] as $file) {
    copyFile($backendRoot . '/' . $file, $packageRoot . '/' . $file);
}

copyDirectory($backendRoot . '/src', $packageRoot . '/src');
copyDirectory($backendRoot . '/database', $packageRoot . '/database');
copyDirectory($backendRoot . '/seeders', $packageRoot . '/seeders');
copyDirectory($backendRoot . '/uploads', $packageRoot . '/uploads');
ensureDirectory($packageRoot . '/storage/logs');
file_put_contents($packageRoot . '/storage/logs/.gitkeep', '');

if (is_dir($backendRoot . '/vendor')) {
    copyDirectory($backendRoot . '/vendor', $packageRoot . '/vendor');
    echo "Included vendor/.\n";
} else {
    echo "vendor/ not found. Package created without Composer dependencies. Built-in SMTP fallback will be used.\n";
}

$zipPath = $distRoot . '/chemlab-hostinger-publichtml.zip';
if (class_exists(ZipArchive::class)) {
    if (is_file($zipPath)) {
        unlink($zipPath);
    }
    $zip = new ZipArchive();
    if ($zip->open($zipPath, ZipArchive::CREATE) === true) {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($packageRoot, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        foreach ($iterator as $item) {
            $path = (string) $item;
            $relative = ltrim(substr($path, strlen($packageRoot)), DIRECTORY_SEPARATOR);
            if (is_dir($path)) {
                $zip->addEmptyDir($relative);
            } else {
                $zip->addFile($path, $relative);
            }
        }
        $zip->close();
        echo "Created {$zipPath}\n";
    }
} else {
    echo "ZipArchive is not available. Folder package was created without a zip.\n";
}

echo "Public HTML package ready: {$packageRoot}\n";

function writeCombinedSql(array $files, string $target, string $header): void
{
    sort($files);
    $content = $header;
    foreach ($files as $file) {
        $content .= "\n-- Source: " . basename($file) . "\n";
        $content .= rtrim((string) file_get_contents($file)) . "\n";
    }
    file_put_contents($target, $content);
    echo "Wrote {$target}\n";
}

function copyFile(string $source, string $target): void
{
    if (!is_file($source)) {
        throw new RuntimeException("Missing file: {$source}");
    }
    ensureDirectory(dirname($target));
    copy($source, $target);
}

function copyDirectory(string $source, string $target): void
{
    if (!is_dir($source)) {
        throw new RuntimeException("Missing directory: {$source}");
    }
    ensureDirectory($target);
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($source, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    foreach ($iterator as $item) {
        $path = (string) $item;
        $relative = ltrim(substr($path, strlen($source)), DIRECTORY_SEPARATOR);
        $destination = $target . DIRECTORY_SEPARATOR . $relative;
        if (is_dir($path)) {
            ensureDirectory($destination);
        } else {
            copyFile($path, $destination);
        }
    }
}

function ensureDirectory(string $path): void
{
    if (!is_dir($path)) {
        mkdir($path, 0775, true);
    }
}

function removeDirectory(string $path): void
{
    if (!is_dir($path)) {
        return;
    }
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($iterator as $item) {
        is_dir((string) $item) ? rmdir((string) $item) : unlink((string) $item);
    }
    rmdir($path);
}
