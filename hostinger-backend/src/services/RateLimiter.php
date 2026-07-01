<?php

declare(strict_types=1);

namespace Chemlab\Services;

use PDO;

final class RateLimiter
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function hit(string $identifier, string $routeKey, int $limit): array
    {
        $bucketStart = date('Y-m-d H:i:00');
        $reset = strtotime($bucketStart . ' +1 minute') ?: (time() + 60);

        $this->pdo->beginTransaction();

        $select = $this->pdo->prepare('SELECT id, hits FROM rate_limit_hits WHERE identifier = :identifier AND route_key = :route_key AND bucket_start = :bucket_start FOR UPDATE');
        $select->execute([
            'identifier' => $identifier,
            'route_key' => $routeKey,
            'bucket_start' => $bucketStart,
        ]);
        $row = $select->fetch();

        if ($row) {
            $hits = ((int) $row['hits']) + 1;
            $update = $this->pdo->prepare('UPDATE rate_limit_hits SET hits = :hits, updated_at = NOW() WHERE id = :id');
            $update->execute(['hits' => $hits, 'id' => $row['id']]);
        } else {
            $hits = 1;
            $insert = $this->pdo->prepare('INSERT INTO rate_limit_hits (identifier, route_key, bucket_start, hits, updated_at) VALUES (:identifier, :route_key, :bucket_start, 1, NOW())');
            $insert->execute([
                'identifier' => $identifier,
                'route_key' => $routeKey,
                'bucket_start' => $bucketStart,
            ]);
        }

        $this->pdo->commit();

        return [
            'allowed' => $hits <= $limit,
            'limit' => $limit,
            'remaining' => max(0, $limit - $hits),
            'reset' => $reset,
        ];
    }
}
