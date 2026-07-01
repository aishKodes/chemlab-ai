<?php

declare(strict_types=1);

$basePath = require dirname(__DIR__) . '/src/bootstrap.php';

use Chemlab\Database\Database;
use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Middleware\CorsMiddleware;
use Chemlab\Middleware\RateLimitMiddleware;
use Chemlab\Routes\Router;

$request = Request::capture();

CorsMiddleware::handle($request);

try {
    $pdo = Database::connection();
} catch (Throwable $throwable) {
    if ($request->path === '/api/health' || $request->path === '/health') {
        Response::json([
            'ok' => true,
            'data' => [
                'service' => 'chemlab-hostinger-api',
                'status' => 'ok',
                'database' => 'unavailable',
                'time' => gmdate('c'),
            ],
        ]);
    }

    throw $throwable;
}
RateLimitMiddleware::handle($request, $pdo);

$router = new Router();
(require $basePath . '/src/routes/api.php')($router, $pdo);

$response = $router->dispatch($request);

if ($response === null) {
    Response::json([
        'ok' => false,
        'error' => [
            'code' => 'not_found',
            'message' => 'Endpoint not found.',
        ],
    ], 404);
}

$response->send();
