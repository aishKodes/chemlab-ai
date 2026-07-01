<?php

declare(strict_types=1);

namespace Chemlab\Helpers;

final class Response
{
    public function __construct(
        private readonly array $payload,
        private readonly int $status = 200,
        private readonly array $headers = []
    ) {
    }

    public static function ok(array $data = [], int $status = 200): self
    {
        return new self(['ok' => true, 'data' => $data], $status);
    }

    public static function error(string $code, string $message, int $status = 400, array $details = []): self
    {
        $error = ['code' => $code, 'message' => $message];
        if ($details !== []) {
            $error['details'] = $details;
        }

        return new self(['ok' => false, 'error' => $error], $status);
    }

    public static function json(array $payload, int $status = 200, array $headers = []): never
    {
        (new self($payload, $status, $headers))->send();
        exit;
    }

    public function send(): void
    {
        http_response_code($this->status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        foreach ($this->headers as $name => $value) {
            header($name . ': ' . $value);
        }

        echo json_encode($this->payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
