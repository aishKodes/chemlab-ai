<?php

declare(strict_types=1);

use Chemlab\Config\Config;
use Chemlab\Helpers\Response;

$basePath = dirname(__DIR__);

$vendorAutoload = $basePath . '/vendor/autoload.php';
if (is_file($vendorAutoload)) {
    require_once $vendorAutoload;
} else {
    spl_autoload_register(static function (string $class) use ($basePath): void {
        $prefix = 'Chemlab\\';
        if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
            return;
        }

        $relativeClass = str_replace('\\', '/', substr($class, strlen($prefix)));
        $segments = explode('/', $relativeClass);
        $lowerFirstSegment = $segments;
        if (isset($lowerFirstSegment[0])) {
            $lowerFirstSegment[0] = lcfirst($lowerFirstSegment[0]);
        }

        $candidates = [
            $basePath . '/src/' . $relativeClass . '.php',
            $basePath . '/src/' . implode('/', $lowerFirstSegment) . '.php',
        ];

        foreach ($candidates as $file) {
            if (is_file($file)) {
                require_once $file;
                return;
            }
        }
    });
}

Config::load($basePath);

date_default_timezone_set(Config::get('APP_TIMEZONE', 'Asia/Kolkata'));

set_exception_handler(static function (Throwable $throwable): void {
    $debug = Config::bool('APP_DEBUG', false);
    error_log('[Chemlab API] ' . $throwable->getMessage() . "\n" . $throwable->getTraceAsString());

    Response::json([
        'ok' => false,
        'error' => [
            'code' => 'server_error',
            'message' => $debug ? $throwable->getMessage() : 'Something went wrong.',
        ],
    ], 500);
});

return $basePath;
