<?php

declare(strict_types=1);

namespace Chemlab\Config;

final class Config
{
    private static array $values = [];
    private static array $config = [];

    public static function load(string $basePath): void
    {
        self::$values['BASE_PATH'] = $basePath;

        $envFile = $basePath . '/.env';
        if (is_file($envFile) && is_readable($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines ?: [] as $line) {
                $line = trim($line);
                if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                    continue;
                }

                [$key, $value] = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                $value = trim($value, "\"'");

                if ($key !== '' && getenv($key) === false) {
                    self::$values[$key] = $value;
                    $_ENV[$key] = $value;
                }
            }
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        $value = getenv($key);
        if ($value !== false) {
            return (string) $value;
        }

        if (array_key_exists($key, $_ENV)) {
            return (string) $_ENV[$key];
        }

        if (array_key_exists($key, self::$values)) {
            return (string) self::$values[$key];
        }

        return $default;
    }

    public static function int(string $key, int $default): int
    {
        $value = self::get($key);
        return $value === null || $value === '' ? $default : (int) $value;
    }

    public static function bool(string $key, bool $default = false): bool
    {
        $value = self::get($key);
        if ($value === null || $value === '') {
            return $default;
        }

        return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
    }

    public static function list(string $key, array $default = []): array
    {
        $value = self::get($key);
        if ($value === null || trim($value) === '') {
            return $default;
        }

        return array_values(array_filter(array_map('trim', explode(',', $value)), static fn (string $item): bool => $item !== ''));
    }

    public static function basePath(string $path = ''): string
    {
        $base = rtrim((string) self::get('BASE_PATH', dirname(__DIR__, 2)), '/');
        return $path === '' ? $base : $base . '/' . ltrim($path, '/');
    }

    public static function group(string $name): array
    {
        if (array_key_exists($name, self::$config)) {
            return self::$config[$name];
        }

        $file = self::basePath('src/config/' . basename($name) . '.php');
        self::$config[$name] = is_file($file) ? (require $file) : [];
        return self::$config[$name];
    }

    public static function value(string $group, string $key, mixed $default = null): mixed
    {
        $config = self::group($group);
        return $config[$key] ?? $default;
    }
}
