<?php
// Contact form handler — creativitytouches.com
// Keys + recipient live outside public_html: /home/creativitytouche/ctc-config.php
$cfg = require dirname(__DIR__) . '/ctc-config.php';
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

// GET → public site key for the widget
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['siteKey' => $cfg['recaptcha_site_key']]);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

function out($ok, $code) { http_response_code($ok ? 200 : 400); echo json_encode(['ok' => $ok, 'code' => $code]); exit; }
function clean($k, $max) { return trim(mb_substr(str_replace(["\r", "\n"], ' ', (string)($_POST[$k] ?? '')), 0, $max)); }

if (!empty($_POST['website'])) out(true, 'sent'); // honeypot: pretend success

$name    = clean('name', 120);
$company = clean('company', 120);
$email   = clean('email', 160);
$phone   = clean('phone', 40);
$service = clean('service', 120);
$message = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 5000));

if ($name === '' || $company === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) out(false, 'invalid');

// reCAPTCHA
$token = (string)($_POST['g-recaptcha-response'] ?? '');
if ($token === '') out(false, 'captcha');
$post = http_build_query(['secret' => $cfg['recaptcha_secret_key'], 'response' => $token, 'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '']);
$ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $post, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10]);
$res = json_decode((string)curl_exec($ch), true);
curl_close($ch);
if (empty($res['success'])) out(false, 'captcha');

$subject = '=?UTF-8?B?' . base64_encode('طلب جديد من الموقع — ' . $name) . '?=';
$body = "الاسم: $name\nالشركة: $company\nالبريد: $email\nالجوال: $phone\nالخدمة: $service\n\nتفاصيل المشروع:\n$message\n\n— " . date('Y-m-d H:i') . ' | IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '');
// Host blocks outgoing SMTP, so send through a Google Apps Script web app (HTTPS) when configured.
if (!empty($cfg['gas_url'])) {
    $ch = curl_init($cfg['gas_url']);
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_TIMEOUT => 20,
        CURLOPT_POSTFIELDS => http_build_query(['subject' => 'طلب جديد من الموقع — ' . $name, 'body' => $body, 'replyTo' => $email])]);
    $res = trim((string)curl_exec($ch));
    curl_close($ch);
    if ($res !== 'ok') error_log('GAS relay: ' . substr($res, 0, 200));
    out($res === 'ok', $res === 'ok' ? 'sent' : 'mail');
}

$headers = implode("\r\n", [
    'From: ' . $cfg['from'],
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
]);
$from = preg_replace('/.*<|>.*/', '', $cfg['from']);
$sent = mail($cfg['to'], $subject, chunk_split(base64_encode($body)), $headers, '-f' . $from);
out($sent, $sent ? 'sent' : 'mail');
