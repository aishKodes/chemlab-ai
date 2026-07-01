<?php

declare(strict_types=1);

namespace Chemlab\Database;

use Chemlab\Config\Config;
use PDO;

final class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $config = Config::group('database');
        $host = $config['host'] ?? 'localhost';
        $database = $config['name'] ?? '';
        $charset = $config['charset'] ?? 'utf8mb4';
        $username = $config['user'] ?? '';
        $password = $config['pass'] ?? '';

        $dsn = "mysql:host={$host};dbname={$database};charset={$charset}";
        self::$connection = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return self::$connection;
    }
}
