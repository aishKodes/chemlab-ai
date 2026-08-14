<?php

declare(strict_types=1);

namespace Chemlab\Controllers;

use Chemlab\Helpers\Request;
use Chemlab\Helpers\Response;
use Chemlab\Helpers\Validator;
use Chemlab\Middleware\AuthMiddleware;
use Chemlab\Services\AuthService;
use Chemlab\Services\MailService;
use Chemlab\Services\TokenService;
use PDO;
use PDOException;
use RuntimeException;

final class AuthController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function signup(Request $request): Response
    {
        $input = $request->json();
        $input['email'] = AuthService::normalizeEmail((string) ($input['email'] ?? ''));
        $input['name'] = trim((string) ($input['name'] ?? ''));
        $errors = Validator::required($input, ['role', 'name', 'email', 'password']);
        $role = (string) ($input['role'] ?? '');

        if (!in_array($role, ['student', 'teacher'], true)) {
            $errors['role'] = 'Choose student or teacher.';
        }
        if (!Validator::email((string) ($input['email'] ?? ''))) {
            $errors['email'] = 'Enter a valid email address.';
        }
        if (!Validator::password((string) ($input['password'] ?? ''))) {
            $errors['password'] = 'Password must be at least 8 characters.';
        }
        if ($role === 'student' && isset($input['class_level']) && !in_array((string) $input['class_level'], ['9', '10', '11', '12'], true)) {
            $errors['class_level'] = 'Class level must be 9, 10, 11, or 12.';
        }

        if ($errors !== []) {
            return Response::error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, $errors);
        }

        try {
            $result = (new AuthService($this->pdo))->signup($input, $request->ip(), (string) ($request->server['HTTP_USER_AGENT'] ?? ''));
        } catch (PDOException $exception) {
            if ($exception->getCode() === '23000') {
                return Response::error('EMAIL_TAKEN', 'This email is already registered.', 409);
            }
            throw $exception;
        } catch (RuntimeException $exception) {
            return Response::error('SIGNUP_NOT_ALLOWED', $exception->getMessage(), 422);
        }

        return Response::ok($result, 201);
    }

    public function login(Request $request): Response
    {
        $input = $request->json();
        $input['email'] = AuthService::normalizeEmail((string) ($input['email'] ?? ''));
        $errors = Validator::required($input, ['email', 'password']);
        if ($errors !== []) {
            return Response::error('VALIDATION_ERROR', 'Email and password are required.', 422, $errors);
        }

        $result = (new AuthService($this->pdo))->login(
            (string) $input['email'],
            (string) $input['password'],
            $request->ip(),
            (string) ($request->server['HTTP_USER_AGENT'] ?? '')
        );

        if ($result === null) {
            return Response::error('INVALID_CREDENTIALS', 'Email or password is incorrect.', 401);
        }

        return Response::ok($result);
    }

    public function logout(Request $request): Response
    {
        $token = $request->bearerToken();
        if ($token !== null) {
            (new TokenService($this->pdo))->revoke($token);
        }

        return Response::ok(['message' => 'Logged out.']);
    }

    public function me(Request $request): Response
    {
        $user = AuthMiddleware::requireUser($request, $this->pdo);
        return Response::ok(['user' => $user]);
    }

    public function verifyEmail(Request $request): Response
    {
        $service = new AuthService($this->pdo);
        $user = AuthMiddleware::user($request, $this->pdo);
        if ($user === null) {
            $email = AuthService::normalizeEmail((string) $request->input('email', ''));
            if (!Validator::email($email)) {
                return Response::error('VALIDATION_ERROR', 'Email and verification code are required.', 422);
            }
            $user = $service->publicUserByEmail($email);
        }
        $code = trim((string) $request->input('code', ''));
        if ($code === '') {
            return Response::error('VALIDATION_ERROR', 'Verification code is required.', 422);
        }
        if ($user === null) {
            return Response::error('INVALID_CODE', 'Verification code is invalid or expired.', 422);
        }

        $ok = $service->verifyEmail((int) $user['id'], $code);
        if (!$ok) {
            return Response::error('INVALID_CODE', 'Verification code is invalid or expired.', 422);
        }

        return Response::ok(['message' => 'Email verified.']);
    }

    public function resendVerification(Request $request): Response
    {
        $service = new AuthService($this->pdo);
        $user = AuthMiddleware::user($request, $this->pdo);
        if ($user === null) {
            $email = AuthService::normalizeEmail((string) $request->input('email', ''));
            if (!Validator::email($email)) {
                return Response::ok(['message' => 'If this email has a chemlearning account, a verification code will be sent.']);
            }
            $user = $service->publicUserByEmail($email);
        }
        if ($user === null || !empty($user['email_verified_at'])) {
            return Response::ok(['message' => 'If this email has a chemlearning account, a verification code will be sent.']);
        }
        $code = $service->createVerificationCode((int) $user['id'], (string) $user['email'], 'signup', 15);
        (new MailService($this->pdo))->sendVerificationEmail($user, $code);

        return Response::ok(['message' => 'Verification email queued.']);
    }

    public function forgotPassword(Request $request): Response
    {
        $email = AuthService::normalizeEmail((string) $request->input('email', ''));
        if (!Validator::email($email)) {
            return Response::error('VALIDATION_ERROR', 'A valid email is required.', 422);
        }

        $result = (new AuthService($this->pdo))->createPasswordReset($email);
        if ($result !== null) {
            (new MailService($this->pdo))->sendPasswordResetEmail($result['user'], $result['token']);
        }

        return Response::ok(['message' => 'If the email exists, reset instructions will be sent.']);
    }

    public function resetPassword(Request $request): Response
    {
        $input = $request->json();
        $errors = Validator::required($input, ['token', 'password']);
        if (!Validator::password((string) ($input['password'] ?? ''))) {
            $errors['password'] = 'Password must be at least 8 characters.';
        }
        if ($errors !== []) {
            return Response::error('VALIDATION_ERROR', 'Please fix the highlighted fields.', 422, $errors);
        }

        $ok = (new AuthService($this->pdo))->resetPassword((string) $input['token'], (string) $input['password']);
        if (!$ok) {
            return Response::error('INVALID_RESET_TOKEN', 'Reset token is invalid or expired.', 422);
        }

        return Response::ok(['message' => 'Password reset complete.']);
    }
}
