<?php

declare(strict_types=1);

namespace Chemlab\Services;

use RuntimeException;

final class SimpleSmtpMailer
{
    /** @var resource|null */
    private $socket = null;

    public function send(array $config, string $to, string $subject, string $html, string $text): void
    {
        $host = (string) ($config['host'] ?? '');
        $port = (int) ($config['port'] ?? 465);
        $secure = strtolower((string) ($config['secure'] ?? 'ssl'));
        $username = (string) ($config['username'] ?? '');
        $password = (string) ($config['password'] ?? '');
        $fromEmail = (string) ($config['from_email'] ?? '');
        $fromName = (string) ($config['from_name'] ?? 'Chemlab');

        if ($host === '' || $username === '' || $password === '' || $fromEmail === '') {
            throw new RuntimeException('SMTP is not configured.');
        }

        $transportHost = $secure === 'ssl' ? 'ssl://' . $host : $host;
        $this->socket = @stream_socket_client($transportHost . ':' . $port, $errno, $errstr, 20, STREAM_CLIENT_CONNECT);
        if (!is_resource($this->socket)) {
            throw new RuntimeException("Could not connect to SMTP server: {$errstr} ({$errno})");
        }

        stream_set_timeout($this->socket, 20);
        $this->expect([220]);
        $hostname = $_SERVER['SERVER_NAME'] ?? 'chemlab.local';
        $this->command("EHLO {$hostname}", [250]);

        if (in_array($secure, ['tls', 'starttls'], true)) {
            $this->command('STARTTLS', [220]);
            if (!stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('Could not enable SMTP TLS encryption.');
            }
            $this->command("EHLO {$hostname}", [250]);
        }

        $this->command('AUTH LOGIN', [334]);
        $this->command(base64_encode($username), [334]);
        $this->command(base64_encode($password), [235]);
        $this->command('MAIL FROM:<' . $this->cleanAddress($fromEmail) . '>', [250]);
        $this->command('RCPT TO:<' . $this->cleanAddress($to) . '>', [250, 251]);
        $this->command('DATA', [354]);

        $boundary = 'chemlab-' . bin2hex(random_bytes(12));
        $headers = [
            'Date: ' . date(DATE_RFC2822),
            'From: ' . $this->formatMailbox($fromName, $fromEmail),
            'To: <' . $this->cleanAddress($to) . '>',
            'Subject: ' . $this->encodeHeader($subject),
            'MIME-Version: 1.0',
            'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        ];

        $body = implode("\r\n", $headers) . "\r\n\r\n";
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $text . "\r\n\r\n";
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $body .= $html . "\r\n\r\n";
        $body .= "--{$boundary}--\r\n";

        fwrite($this->socket, $this->dotStuff($body) . "\r\n.\r\n");
        $this->expect([250]);
        $this->command('QUIT', [221]);
        fclose($this->socket);
        $this->socket = null;
    }

    private function command(string $command, array $expectedCodes): string
    {
        fwrite($this->socket, $command . "\r\n");
        return $this->expect($expectedCodes);
    }

    private function expect(array $expectedCodes): string
    {
        $response = '';
        while (($line = fgets($this->socket, 515)) !== false) {
            $response .= $line;
            if (preg_match('/^(\d{3})(\s|-)/', $line, $matches) && $matches[2] === ' ') {
                $code = (int) $matches[1];
                if (!in_array($code, $expectedCodes, true)) {
                    throw new RuntimeException('SMTP error: ' . trim($response));
                }
                return $response;
            }
        }

        throw new RuntimeException('SMTP server closed the connection unexpectedly.');
    }

    private function cleanAddress(string $email): string
    {
        $email = trim($email);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('Invalid email address: ' . $email);
        }

        return $email;
    }

    private function formatMailbox(string $name, string $email): string
    {
        $safeName = trim(str_replace(['"', "\r", "\n"], '', $name));
        return '"' . addcslashes($safeName === '' ? 'Chemlab' : $safeName, '"\\') . '" <' . $this->cleanAddress($email) . '>';
    }

    private function encodeHeader(string $value): string
    {
        if (preg_match('/^[\x20-\x7E]+$/', $value)) {
            return str_replace(["\r", "\n"], '', $value);
        }

        return '=?UTF-8?B?' . base64_encode(str_replace(["\r", "\n"], '', $value)) . '?=';
    }

    private function dotStuff(string $body): string
    {
        $body = str_replace(["\r\n", "\r"], "\n", $body);
        $lines = explode("\n", $body);
        foreach ($lines as &$line) {
            if (str_starts_with($line, '.')) {
                $line = '.' . $line;
            }
        }

        return implode("\r\n", $lines);
    }
}
