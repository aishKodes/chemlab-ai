<?php

declare(strict_types=1);

namespace Chemlab\Helpers;

final class Validator
{
    public static function required(array $input, array $fields): array
    {
        $errors = [];
        foreach ($fields as $field) {
            if (!array_key_exists($field, $input) || trim((string) $input[$field]) === '') {
                $errors[$field] = 'This field is required.';
            }
        }

        return $errors;
    }

    public static function email(?string $email): bool
    {
        return $email !== null && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function password(?string $password): bool
    {
        return $password !== null && strlen($password) >= 8;
    }
}
