<?php

declare(strict_types=1);

require dirname(__DIR__) . '/src/bootstrap.php';

use Chemlab\Database\Database;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\CorsMiddleware;
use Chemlab\Helpers\Request;

$request = Request::capture();
CorsMiddleware::handle($request);

$database = 'unknown';
try {
    Database::connection()->query('SELECT 1');
    $database = 'ok';
} catch (Throwable $throwable) {
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
