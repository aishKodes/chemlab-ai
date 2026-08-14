<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Response;
use PDO;
use Throwable;

final class HealthController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function show(): Response
    {
        $database = 'ok';
        try {
            $this->pdo->query('SELECT 1');
        } catch (Throwable) {
            $database = 'unavailable';
        }

        return Response::ok([
            'service' => 'chemlearning-hostinger-api',
            'status' => 'ok',
            'database' => $database,
            'time' => gmdate('c'),
        ]);
    }
}
