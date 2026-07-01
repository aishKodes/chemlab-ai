<?php

declare(strict_types=1);

use Chemlab\Config\Config;
use Chemlab\Services\AuthService;

return static function (PDO $pdo): void {
    $name = Config::get('ADMIN_NAME');
    $email = Config::get('ADMIN_EMAIL');
    $password = Config::get('ADMIN_PASSWORD');

    if (!$name || !$email || !$password) {
        echo "Skipping first admin seeder: ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD is missing.\n";
        return;
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => strtolower($email)]);
    $existing = $stmt->fetch();

    if ($existing) {
        $pdo->prepare('UPDATE users SET role = "admin", status = "active", updated_at = NOW() WHERE id = :id')->execute(['id' => $existing['id']]);
        echo "Existing user promoted to admin: {$email}\n";
        return;
    }

    $pdo->prepare(
        'INSERT INTO users (uuid, role, name, email, password_hash, preferred_language, status, email_verified_at, created_at, updated_at)
         VALUES (:uuid, "admin", :name, :email, :password_hash, "en", "active", NOW(), NOW(), NOW())'
    )->execute([
        'uuid' => AuthService::uuid(),
        'name' => $name,
        'email' => strtolower($email),
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);

    echo "Admin user created: {$email}\n";
};
