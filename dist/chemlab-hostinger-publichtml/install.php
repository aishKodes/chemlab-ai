<?php

declare(strict_types=1);

$basePath = __DIR__;
$lockPath = $basePath . '/storage/install.lock';
$force = ($_GET['force'] ?? '') === '1';
$action = (string) ($_POST['action'] ?? ($_GET['action'] ?? 'check'));
$messages = [];
$ok = true;

if (PHP_SAPI === 'cli') {
    exit("Open install.php in a browser.\n");
}

if (is_file($lockPath) && !$force) {
    renderPage('locked', [
        ['type' => 'warn', 'text' => 'Chemlab is already installed. The installer is locked by storage/install.lock.'],
        ['type' => 'info', 'text' => 'Delete install.php after launch, or open install.php?force=1 only when you intentionally need to re-run installer actions.'],
    ]);
    exit;
}

if ($force && $action !== 'check' && ($_POST['confirm_force'] ?? '') !== 'yes') {
    $ok = false;
    $messages[] = ['type' => 'error', 'text' => 'Force mode requires confirmation before installer actions run again.'];
}

try {
    if ($ok) {
        if ($action === 'check') {
            $messages = array_merge($messages, checkRequirements($basePath));
        } elseif ($action === 'database') {
            $pdo = connectFromConfig($basePath);
            $messages = array_merge($messages, runDatabaseInstall($pdo, $basePath));
        } elseif ($action === 'create-admin') {
            $pdo = connectFromConfig($basePath);
            $messages[] = createAdmin($pdo, loadConfig($basePath));
        } elseif ($action === 'full') {
            $pdo = connectFromConfig($basePath);
            $messages = array_merge($messages, runDatabaseInstall($pdo, $basePath));
            $messages[] = createAdmin($pdo, loadConfig($basePath));
            ensureDirectory($basePath . '/storage');
            file_put_contents($lockPath, 'Installed at ' . gmdate('c') . PHP_EOL);
            $messages[] = ['type' => 'success', 'text' => 'Full install complete. storage/install.lock was created.'];
        } else {
            $messages[] = ['type' => 'error', 'text' => 'Unknown installer action.'];
        }
    }
} catch (Throwable $throwable) {
    $messages[] = ['type' => 'error', 'text' => $throwable->getMessage()];
}

renderPage($action, $messages);

function checkRequirements(string $basePath): array
{
    $messages = [];
    $messages[] = version_compare(PHP_VERSION, '8.1.0', '>=')
        ? ['type' => 'success', 'text' => 'PHP version is ' . PHP_VERSION . '.']
        : ['type' => 'error', 'text' => 'PHP 8.1 or newer is required. Current version: ' . PHP_VERSION . '.'];

    foreach (['pdo', 'pdo_mysql', 'json', 'mbstring', 'fileinfo', 'openssl'] as $extension) {
        $messages[] = extension_loaded($extension)
            ? ['type' => 'success', 'text' => "PHP extension {$extension} is loaded."]
            : ['type' => 'error', 'text' => "PHP extension {$extension} is missing."];
    }

    $messages[] = is_file($basePath . '/config.php')
        ? ['type' => 'success', 'text' => 'config.php exists.']
        : ['type' => 'error', 'text' => 'config.php is missing. Rename config.example.php to config.php and fill your Hostinger values.'];

    foreach (['storage/logs', 'uploads'] as $relativePath) {
        $path = $basePath . '/' . $relativePath;
        ensureDirectory($path);
        $messages[] = is_writable($path)
            ? ['type' => 'success', 'text' => "{$relativePath} is writable."]
            : ['type' => 'error', 'text' => "{$relativePath} is not writable by PHP."];
    }

    foreach (['database/schema.sql', 'database/seed.sql'] as $relativePath) {
        $messages[] = is_file($basePath . '/' . $relativePath)
            ? ['type' => 'success', 'text' => "{$relativePath} exists."]
            : ['type' => 'error', 'text' => "{$relativePath} is missing."];
    }

    if (is_file($basePath . '/vendor/autoload.php')) {
        $messages[] = ['type' => 'success', 'text' => 'Composer vendor folder found. PHPMailer should be available.'];
    } else {
        $messages[] = ['type' => 'info', 'text' => 'vendor/autoload.php not found. This is okay: Chemlab will use its built-in SMTP sender for Hostinger SMTP. Upload vendor/ only if you want PHPMailer.'];
    }

    try {
        connectFromConfig($basePath)->query('SELECT 1');
        $messages[] = ['type' => 'success', 'text' => 'Database connection works.'];
    } catch (Throwable $throwable) {
        $messages[] = ['type' => 'error', 'text' => 'Database connection failed: ' . $throwable->getMessage()];
    }

    return $messages;
}

function runDatabaseInstall(PDO $pdo, string $basePath): array
{
    $messages = [];
    $schema = $basePath . '/database/schema.sql';
    $seed = $basePath . '/database/seed.sql';

    runSqlFile($pdo, $schema);
    $messages[] = ['type' => 'success', 'text' => 'database/schema.sql imported.'];

    runSqlFile($pdo, $seed);
    $messages[] = ['type' => 'success', 'text' => 'database/seed.sql imported.'];

    foreach (runPhpSeeders($pdo, $basePath) as $message) {
        $messages[] = $message;
    }

    return $messages;
}

function runPhpSeeders(PDO $pdo, string $basePath): array
{
    $seederDir = $basePath . '/seeders';
    if (!is_dir($seederDir)) {
        return [['type' => 'info', 'text' => 'No PHP seeder directory found. SQL seed import completed.']];
    }

    if (is_file($basePath . '/src/bootstrap.php')) {
        require_once $basePath . '/src/bootstrap.php';
    }

    $messages = [];
    $files = glob($seederDir . '/*.php') ?: [];
    sort($files);
    foreach ($files as $file) {
        $seeder = require $file;
        if (!is_callable($seeder)) {
            continue;
        }
        ob_start();
        $seeder($pdo);
        $output = trim((string) ob_get_clean());
        $messages[] = [
            'type' => 'success',
            'text' => basename($file) . ' ran.' . ($output !== '' ? ' ' . $output : ''),
        ];
    }

    return $messages;
}

function createAdmin(PDO $pdo, array $config): array
{
    $name = trim((string) configValue($config, 'admin.name', ''));
    $email = strtolower(trim((string) configValue($config, 'admin.email', '')));
    $password = (string) configValue($config, 'admin.password', '');

    if ($name === '' || $email === '' || $password === '') {
        throw new RuntimeException('Admin name, email, and password must be filled in config.php before creating admin.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Admin email in config.php is not valid.');
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => $email]);
    $existingId = $stmt->fetchColumn();
    $hash = password_hash($password, PASSWORD_DEFAULT);

    if ($existingId) {
        $pdo->prepare(
            'UPDATE users SET role = "admin", name = :name, password_hash = :password_hash, status = "active", email_verified_at = COALESCE(email_verified_at, NOW()), updated_at = NOW() WHERE id = :id'
        )->execute([
            'name' => $name,
            'password_hash' => $hash,
            'id' => (int) $existingId,
        ]);

        return ['type' => 'success', 'text' => 'Admin user updated: ' . $email];
    }

    $pdo->prepare(
        'INSERT INTO users (uuid, role, name, email, password_hash, preferred_language, status, email_verified_at, created_at, updated_at)
         VALUES (:uuid, "admin", :name, :email, :password_hash, "en", "active", NOW(), NOW(), NOW())'
    )->execute([
        'uuid' => bin2hex(random_bytes(16)),
        'name' => $name,
        'email' => $email,
        'password_hash' => $hash,
    ]);

    return ['type' => 'success', 'text' => 'Admin user created: ' . $email];
}

function runSqlFile(PDO $pdo, string $file): void
{
    if (!is_file($file)) {
        throw new RuntimeException(basename($file) . ' is missing.');
    }

    $sql = preg_replace('/^\s*--.*$/m', '', (string) file_get_contents($file));
    foreach (splitSqlStatements((string) $sql) as $statement) {
        $pdo->exec($statement);
    }
}

function splitSqlStatements(string $sql): array
{
    $statements = [];
    $current = '';
    $quote = null;
    $length = strlen($sql);

    for ($i = 0; $i < $length; $i++) {
        $char = $sql[$i];

        if ($quote !== null) {
            $current .= $char;

            if (($quote === "'" || $quote === '"') && $char === '\\' && $i + 1 < $length) {
                $current .= $sql[++$i];
                continue;
            }

            if ($char === $quote) {
                if ($i + 1 < $length && $sql[$i + 1] === $quote) {
                    $current .= $sql[++$i];
                    continue;
                }
                $quote = null;
            }

            continue;
        }

        if ($char === "'" || $char === '"' || $char === '`') {
            $quote = $char;
            $current .= $char;
            continue;
        }

        if ($char === ';') {
            $statement = trim($current);
            if ($statement !== '') {
                $statements[] = $statement;
            }
            $current = '';
            continue;
        }

        $current .= $char;
    }

    $statement = trim($current);
    if ($statement !== '') {
        $statements[] = $statement;
    }

    return $statements;
}

function connectFromConfig(string $basePath): PDO
{
    $config = loadConfig($basePath);
    $db = configValue($config, 'database', []);
    if (!is_array($db)) {
        throw new RuntimeException('Database config is invalid.');
    }

    foreach (['host', 'name', 'user'] as $key) {
        if (trim((string) ($db[$key] ?? '')) === '') {
            throw new RuntimeException("Database {$key} is missing in config.php.");
        }
    }

    $charset = (string) ($db['charset'] ?? 'utf8mb4');
    $dsn = 'mysql:host=' . $db['host'] . ';dbname=' . $db['name'] . ';charset=' . $charset;

    return new PDO($dsn, (string) $db['user'], (string) ($db['pass'] ?? ''), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

function loadConfig(string $basePath): array
{
    $path = $basePath . '/config.php';
    if (!is_file($path)) {
        throw new RuntimeException('config.php is missing. Rename config.example.php to config.php and fill it first.');
    }

    $config = require $path;
    if (!is_array($config)) {
        throw new RuntimeException('config.php must return an array.');
    }

    return $config;
}

function configValue(array $config, string $path, mixed $default = null): mixed
{
    $cursor = $config;
    foreach (explode('.', $path) as $part) {
        if (!is_array($cursor) || !array_key_exists($part, $cursor)) {
            return $default;
        }
        $cursor = $cursor[$part];
    }

    return $cursor;
}

function ensureDirectory(string $path): void
{
    if (!is_dir($path)) {
        mkdir($path, 0775, true);
    }
}

function renderPage(string $action, array $messages): void
{
    $locked = is_file(__DIR__ . '/storage/install.lock');
    $force = ($_GET['force'] ?? '') === '1';
    $statusCounts = ['success' => 0, 'warn' => 0, 'error' => 0, 'info' => 0];
    foreach ($messages as $message) {
        $type = $message['type'] ?? 'info';
        $statusCounts[$type] = ($statusCounts[$type] ?? 0) + 1;
    }

    ?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chemlab Backend Installer</title>
  <style>
    :root { color-scheme: light; --blue: #2563eb; --ink: #0f172a; --muted: #475569; --line: #dbeafe; --soft: #eff6ff; --ok: #047857; --warn: #b45309; --err: #be123c; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at top left, #dbeafe, transparent 34rem), linear-gradient(135deg, #fff7ed 0%, #f8fafc 42%, #ecfeff 100%); color: var(--ink); }
    main { width: min(1040px, calc(100% - 32px)); margin: 0 auto; padding: 40px 0; }
    .hero { border: 1px solid rgba(37,99,235,.18); background: rgba(255,255,255,.84); border-radius: 28px; padding: 28px; box-shadow: 0 24px 70px rgba(37,99,235,.14); backdrop-filter: blur(14px); }
    .eyebrow { display: inline-flex; border-radius: 999px; background: #dbeafe; color: #1d4ed8; padding: 8px 12px; font-weight: 900; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; }
    h1 { margin: 16px 0 8px; font-size: clamp(32px, 7vw, 62px); line-height: .95; letter-spacing: -.04em; }
    p { color: var(--muted); font-weight: 650; line-height: 1.65; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 18px; margin-top: 22px; }
    @media (min-width: 820px) { .grid { grid-template-columns: 1fr 1fr; } }
    .panel { border: 1px solid var(--line); background: rgba(255,255,255,.9); border-radius: 22px; padding: 18px; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
    button, a.button { border: 0; border-radius: 16px; padding: 12px 15px; background: var(--blue); color: white; font-weight: 900; cursor: pointer; text-decoration: none; box-shadow: 0 7px 0 rgba(29,78,216,.22); }
    button.secondary, a.secondary { background: white; color: #1d4ed8; border: 1px solid #bfdbfe; box-shadow: none; }
    button.warn { background: #f59e0b; box-shadow: 0 7px 0 rgba(180,83,9,.18); }
    .messages { display: grid; gap: 10px; margin-top: 22px; }
    .message { border-radius: 16px; padding: 12px 14px; font-weight: 800; border: 1px solid transparent; }
    .success { background: #ecfdf5; border-color: #a7f3d0; color: var(--ok); }
    .warn { background: #fffbeb; border-color: #fde68a; color: var(--warn); }
    .error { background: #fff1f2; border-color: #fecdd3; color: var(--err); }
    .info { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
    code { border-radius: 8px; background: #e2e8f0; padding: 2px 6px; color: #0f172a; }
    label { display: flex; gap: 8px; align-items: flex-start; font-weight: 800; color: #334155; margin-top: 10px; }
  </style>
</head>
<body>
<main>
  <section class="hero">
    <span class="eyebrow">Chemlab public_html installer</span>
    <h1>Set up the Chemlab API.</h1>
    <p>Use this installer after uploading the backend files into <code>api.chemlearning.in/public_html/</code> and filling <code>config.php</code>. It can run the SQL files and create the first admin safely with a hashed password.</p>
    <?php if ($locked): ?>
      <div class="message warn">Installer lock detected. Normal installer actions are disabled unless you intentionally open <code>install.php?force=1</code>.</div>
    <?php endif; ?>
    <div class="grid">
      <div class="panel">
        <h2>Installer actions</h2>
        <div class="actions">
          <form method="post"><input type="hidden" name="action" value="check"><?php forceConfirm($force); ?><button class="secondary" type="submit">Check requirements</button></form>
          <form method="post"><input type="hidden" name="action" value="database"><?php forceConfirm($force); ?><button type="submit">Run database install</button></form>
          <form method="post"><input type="hidden" name="action" value="create-admin"><?php forceConfirm($force); ?><button class="secondary" type="submit">Create/update admin</button></form>
          <form method="post"><input type="hidden" name="action" value="full"><?php forceConfirm($force); ?><button class="warn" type="submit">Run full install</button></form>
        </div>
      </div>
      <div class="panel">
        <h2>Manual phpMyAdmin option</h2>
        <p>Import <code>database/schema.sql</code> first, then <code>database/seed.sql</code>. After that open <code>install.php?action=create-admin</code> to create the admin with <code>password_hash()</code>.</p>
        <a class="button secondary" href="health.php">Open health.php</a>
      </div>
    </div>
    <div class="messages">
      <?php foreach ($messages as $message): ?>
        <div class="message <?php echo h((string) ($message['type'] ?? 'info')); ?>"><?php echo h((string) ($message['text'] ?? '')); ?></div>
      <?php endforeach; ?>
    </div>
  </section>
</main>
</body>
</html><?php
}

function forceConfirm(bool $force): void
{
    if (!$force) {
        return;
    }

    echo '<label><input type="checkbox" name="confirm_force" value="yes" required> I understand this re-runs installer actions.</label>';
}

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
