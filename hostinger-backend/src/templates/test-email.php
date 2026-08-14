<?php

/** @var array $data */
$message = htmlspecialchars((string) ($data['message'] ?? 'chemlearning email test.'), ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>chemlearning Email Test</title>
  </head>
  <body style="margin:0;background:#f6fbff;font-family:Arial,sans-serif;color:#102033;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6fbff;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:18px;padding:28px;border:1px solid #d8eef8;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#087ea4;font-weight:700;">chemlearning</p>
                <h1 style="margin:0 0 14px;font-size:26px;line-height:1.2;color:#102033;">Hostinger email test</h1>
                <p style="margin:0;font-size:16px;line-height:1.6;color:#2d4057;"><?= $message ?></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
