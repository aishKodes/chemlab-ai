<?php

declare(strict_types=1);

namespace Chemlab\Services;

use Chemlab\Config\Config;
use PDO;
use PHPMailer\PHPMailer\PHPMailer;
use Throwable;

final class MailService
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function sendTemplate(string $to, string $templateKey, array $data, ?int $userId = null): array
    {
        $template = $this->template($templateKey);
        $subject = $this->replaceTokens($template['subject'], $data);
        $html = $this->replaceTokens($template['body_html'], $data);
        $text = $template['body_text'] ? $this->replaceTokens((string) $template['body_text'], $data) : strip_tags($html);
        $logId = $this->createLog($userId, $to, $subject, $templateKey);

        if (!$this->isConfigured()) {
            $this->writeMailSnapshot($to, $subject, $html);
            $this->updateLog($logId, 'failed', 'SMTP is not configured.');
            return ['sent' => false, 'status' => 'failed', 'error' => 'SMTP is not configured.'];
        }

        try {
            $mailConfig = Config::group('mail');
            if (class_exists(PHPMailer::class)) {
                $this->sendWithPhpMailer($mailConfig, $to, $subject, $html, $text);
            } else {
                (new SimpleSmtpMailer())->send($mailConfig, $to, $subject, $html, $text);
            }

            $this->updateLog($logId, 'sent');
            return ['sent' => true, 'status' => 'sent'];
        } catch (Throwable $throwable) {
            $this->writeMailSnapshot($to, $subject, $html);
            $this->updateLog($logId, 'failed', $throwable->getMessage());
            return ['sent' => false, 'status' => 'failed', 'error' => $throwable->getMessage()];
        }
    }

    public function sendVerificationEmail(array $user, string $code): array
    {
        return $this->sendTemplate((string) $user['email'], 'verify_email', [
            'name' => $user['name'] ?? 'student',
            'code' => $code,
        ], (int) $user['id']);
    }

    public function sendWelcomeStudentEmail(array $user): array
    {
        return $this->sendTemplate((string) $user['email'], 'welcome_student', [
            'name' => $user['name'] ?? 'student',
        ], (int) $user['id']);
    }

    public function sendWelcomeTeacherEmail(array $user): array
    {
        return $this->sendTemplate((string) $user['email'], 'welcome_teacher', [
            'name' => $user['name'] ?? 'teacher',
        ], (int) $user['id']);
    }

    public function sendPasswordResetEmail(array $user, string $resetTokenOrCode): array
    {
        return $this->sendTemplate((string) $user['email'], 'password_reset', [
            'name' => $user['name'] ?? 'there',
            'reset_code' => $resetTokenOrCode,
        ], (int) $user['id']);
    }

    public function sendAdminNewSignupEmail(array $user): array
    {
        $adminEmail = Config::get('ADMIN_EMAIL');
        if (!$adminEmail) {
            return ['sent' => false, 'status' => 'failed', 'error' => 'ADMIN_EMAIL is not configured.'];
        }

        return $this->sendTemplate($adminEmail, 'admin_new_signup', [
            'name' => $user['name'] ?? '',
            'email' => $user['email'] ?? '',
            'role' => $user['role'] ?? '',
        ], null);
    }

    public function sendTestEmail(string $to): array
    {
        return $this->sendTemplate($to, 'test_email', [
            'name' => 'chemlearning admin',
            'message' => 'SMTP test from the chemlearning account service.',
        ]);
    }

    private function template(string $templateKey): array
    {
        $stmt = $this->pdo->prepare('SELECT subject, body_html, body_text FROM email_templates WHERE template_key = :template_key AND status = "active" LIMIT 1');
        $stmt->execute(['template_key' => $templateKey]);
        $template = $stmt->fetch();

        return $template ?: $this->fallbackTemplate($templateKey);
    }

    private function fallbackTemplate(string $templateKey): array
    {
        $templates = [
            'verify_email' => ['subject' => 'Verify your chemlearning email', 'body_html' => '<h1>Your chemlearning code</h1><p>Hello {{name}}, your verification code is <strong>{{code}}</strong>.</p>', 'body_text' => 'Your chemlearning verification code is {{code}}.'],
            'welcome_student' => ['subject' => 'Welcome to chemlearning', 'body_html' => '<h1>Welcome, {{name}}</h1><p>Your chemistry learning universe is ready.</p>', 'body_text' => 'Welcome to chemlearning, {{name}}.'],
            'welcome_teacher' => ['subject' => 'Welcome to chemlearning for Teachers', 'body_html' => '<h1>Welcome, {{name}}</h1><p>Your teacher account foundation is ready.</p>', 'body_text' => 'Welcome to chemlearning, {{name}}.'],
            'password_reset' => ['subject' => 'Reset your chemlearning password', 'body_html' => '<h1>Password reset</h1><p>Use this reset token: <strong>{{reset_code}}</strong></p>', 'body_text' => 'Use this reset token: {{reset_code}}'],
            'admin_new_signup' => ['subject' => 'New chemlearning signup', 'body_html' => '<p>{{name}} ({{email}}) signed up as {{role}}.</p>', 'body_text' => '{{name}} signed up as {{role}}.'],
            'test_email' => ['subject' => 'chemlearning SMTP test', 'body_html' => '<p>{{message}}</p>', 'body_text' => '{{message}}'],
        ];

        return $templates[$templateKey] ?? $templates['test_email'];
    }

    private function replaceTokens(string $body, array $data): string
    {
        foreach ($data as $key => $value) {
            $body = str_replace('{{' . $key . '}}', htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'), $body);
        }

        return $body;
    }

    private function isConfigured(): bool
    {
        $mail = Config::group('mail');
        return ($mail['host'] ?? '') !== ''
            && ($mail['username'] ?? '') !== ''
            && ($mail['password'] ?? '') !== ''
            && ($mail['from_email'] ?? '') !== '';
    }

    private function sendWithPhpMailer(array $mailConfig, string $to, string $subject, string $html, string $text): void
    {
        $mailer = new PHPMailer(true);
        $mailer->isSMTP();
        $mailer->Host = (string) $mailConfig['host'];
        $mailer->Port = (int) $mailConfig['port'];
        $mailer->SMTPAuth = true;
        $mailer->Username = (string) $mailConfig['username'];
        $mailer->Password = (string) $mailConfig['password'];
        $mailer->SMTPSecure = (string) $mailConfig['secure'];
        $mailer->setFrom((string) $mailConfig['from_email'], (string) $mailConfig['from_name']);
        $mailer->addAddress($to);
        $mailer->Subject = $subject;
        $mailer->isHTML(true);
        $mailer->Body = $html;
        $mailer->AltBody = $text;
        $mailer->send();
    }

    private function createLog(?int $userId, string $to, string $subject, string $templateKey): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO email_logs (user_id, to_email, subject, template_key, status, provider, created_at)
             VALUES (:user_id, :to_email, :subject, :template_key, "queued", "smtp", NOW())'
        );
        $stmt->execute([
            'user_id' => $userId,
            'to_email' => $to,
            'subject' => $subject,
            'template_key' => $templateKey,
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    private function updateLog(int $logId, string $status, ?string $error = null): void
    {
        $this->pdo->prepare(
            'UPDATE email_logs SET status = :status, error_message = :error_message, sent_at = IF(:status_for_sent = "sent", NOW(), sent_at) WHERE id = :id'
        )->execute([
            'status' => $status,
            'status_for_sent' => $status,
            'error_message' => $error,
            'id' => $logId,
        ]);
    }

    private function writeMailSnapshot(string $to, string $subject, string $html): void
    {
        $dir = Config::basePath('storage/mail');
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        file_put_contents($dir . '/' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.html', "<!-- To: {$to}\nSubject: {$subject} -->\n" . $html);
    }
}
