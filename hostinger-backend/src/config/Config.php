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
        self::loadPhpConfig($basePath . '/config.php');

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

                if ($key !== '' && !array_key_exists($key, self::$values)) {
                    self::$values[$key] = $value;
                    $_ENV[$key] = $value;
                }
            }
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        if (array_key_exists($key, self::$values)) {
            return (string) self::$values[$key];
        }

        if (array_key_exists($key, $_ENV)) {
            return (string) $_ENV[$key];
        }

        $value = getenv($key);
        if ($value !== false) {
            return (string) $value;
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

    private static function loadPhpConfig(string $path): void
    {
        if (!is_file($path) || !is_readable($path)) {
            return;
        }

        $config = require $path;
        if (!is_array($config)) {
            return;
        }

        $map = [
            'app.env' => 'APP_ENV',
            'app.name' => 'APP_NAME',
            'app.url' => 'APP_URL',
            'app.frontend_url' => 'FRONTEND_URL',
            'app.api_url' => 'API_URL',
            'app.default_language' => 'DEFAULT_LANGUAGE',
            'database.host' => 'DB_HOST',
            'database.name' => 'DB_NAME',
            'database.user' => 'DB_USER',
            'database.pass' => 'DB_PASS',
            'database.charset' => 'DB_CHARSET',
            'security.jwt_secret' => 'JWT_SECRET',
            'security.jwt_expires_days' => 'JWT_EXPIRES_DAYS',
            'security.beta_unlimited_auth' => 'BETA_UNLIMITED_AUTH',
            'security.auth_rate_limit_per_minute' => 'AUTH_RATE_LIMIT_PER_MINUTE',
            'security.rate_limit_per_minute' => 'RATE_LIMIT_PER_MINUTE',
            'mail.host' => 'SMTP_HOST',
            'mail.port' => 'SMTP_PORT',
            'mail.secure' => 'SMTP_SECURE',
            'mail.username' => 'SMTP_USERNAME',
            'mail.password' => 'SMTP_PASSWORD',
            'mail.from_email' => 'SMTP_FROM_EMAIL',
            'mail.from_name' => 'SMTP_FROM_NAME',
            'admin.name' => 'ADMIN_NAME',
            'admin.email' => 'ADMIN_EMAIL',
            'admin.password' => 'ADMIN_PASSWORD',
            'cors.allowed_origins' => 'CORS_ALLOWED_ORIGINS',
            'upload.max_mb' => 'UPLOAD_MAX_MB',
            'upload.allowed_types' => 'UPLOAD_ALLOWED_TYPES',
            'ai.daily_budget_inr' => 'AI_DAILY_BUDGET_INR',
        ];

        foreach ($map as $configPath => $envKey) {
            $value = self::arrayPath($config, $configPath);
            if ($value === null) {
                continue;
            }

            if (is_array($value)) {
                $value = implode(',', array_map(static fn (mixed $item): string => (string) $item, $value));
            }

            self::$values[$envKey] = (string) $value;
            $_ENV[$envKey] = (string) $value;
        }
    }

    private static function arrayPath(array $data, string $path): mixed
    {
        $cursor = $data;
        foreach (explode('.', $path) as $part) {
            if (!is_array($cursor) || !array_key_exists($part, $cursor)) {
                return null;
            }
            $cursor = $cursor[$part];
        }

        return $cursor;
    }
}
