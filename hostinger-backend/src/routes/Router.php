<?php

declare(strict_types=1);

namespace Chemlab\Routes;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;

final class Router
{
    private array $routes = [];

    public function get(string $path, callable $handler): void
    {
        $this->add('GET', $path, $handler);
    }

    public function post(string $path, callable $handler): void
    {
        $this->add('POST', $path, $handler);
    }

    public function patch(string $path, callable $handler): void
    {
        $this->add('PATCH', $path, $handler);
    }

    public function put(string $path, callable $handler): void
    {
        $this->add('PUT', $path, $handler);
    }

    public function delete(string $path, callable $handler): void
    {
        $this->add('DELETE', $path, $handler);
    }

    public function dispatch(Request $request): ?Response
    {
        foreach ($this->routes[$request->method] ?? [] as $route) {
            $params = $this->match($route['pattern'], $request->path);
            if ($params !== null) {
                return $route['handler']($request, $params);
            }
        }

        return null;
    }

    private function normalize(string $path): string
    {
        return '/' . trim($path, '/');
    }

    private function add(string $method, string $path, callable $handler): void
    {
        $this->routes[$method][] = [
            'pattern' => $this->normalize($path),
            'handler' => $handler,
        ];
    }

    private function match(string $pattern, string $path): ?array
    {
        $patternParts = explode('/', trim($pattern, '/'));
        $pathParts = explode('/', trim($this->normalize($path), '/'));

        if (count($patternParts) !== count($pathParts)) {
            return null;
        }

        $params = [];
        foreach ($patternParts as $index => $part) {
            $value = $pathParts[$index] ?? '';
            if (preg_match('/^\{([a-zA-Z_][a-zA-Z0-9_]*)}$/', $part, $matches)) {
                $params[$matches[1]] = urldecode($value);
                continue;
            }

            if ($part !== $value) {
                return null;
            }
        }

        return $params;
    }
}
