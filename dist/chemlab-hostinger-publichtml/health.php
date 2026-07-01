<?php

declare(strict_types=1);

require __DIR__ . '/src/bootstrap.php';

use Chemlab\Database\Database;
use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\CorsMiddleware;

$request = Request::capture();
CorsMiddleware::handle($request);

$database = 'unknown';
try {
    Database::connection()->query('SELECT 1');
    $database = 'ok';
} catch (Throwable) {
    $database = 'unavailable';
}

Response::json([
    'ok' => true,
    'data' => [
        'service' => 'chemlab-hostinger-api',
        'status' => 'ok',
        'database' => $database,
        'time' => gmdate('c'),
    ],
]);
