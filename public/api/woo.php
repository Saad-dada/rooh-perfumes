<?php
// Simple WooCommerce REST proxy for static frontends.
// Keep this file server-side (PHP); do not expose keys in frontend env vars.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function str_contains_compat(string $haystack, string $needle): bool {
  return $needle === '' || strpos($haystack, $needle) !== false;
}

function str_starts_with_compat(string $haystack, string $needle): bool {
  if ($needle === '') return true;
  return strncmp($haystack, $needle, strlen($needle)) === 0;
}

// --- Configure these on server ---
// Prefer server env vars when available.
// Hostinger options:
// 1) Define env vars: WC_BASE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET
// 2) Or set fallback constants below (not recommended for committed source)
const WC_BASE_URL_FALLBACK = 'https://checkout.roohperfumes.net';
const WC_CONSUMER_KEY_FALLBACK = 'REPLACE_WITH_READONLY_CK_KEY';
const WC_CONSUMER_SECRET_FALLBACK = 'REPLACE_WITH_READONLY_CS_KEY';

$wcBaseUrl = trim((string)(getenv('WC_BASE_URL') ?: WC_BASE_URL_FALLBACK));
$wcConsumerKey = trim((string)(getenv('WC_CONSUMER_KEY') ?: WC_CONSUMER_KEY_FALLBACK));
$wcConsumerSecret = trim((string)(getenv('WC_CONSUMER_SECRET') ?: WC_CONSUMER_SECRET_FALLBACK));

if (
  $wcBaseUrl === '' ||
  str_starts_with_compat($wcConsumerKey, 'REPLACE_WITH_') ||
  str_starts_with_compat($wcConsumerSecret, 'REPLACE_WITH_')
) {
  http_response_code(500);
  echo json_encode(['error' => 'Proxy not configured. Set Woo API credentials in api/woo.php']);
  exit;
}

if (!function_exists('curl_init')) {
  http_response_code(500);
  echo json_encode(['error' => 'cURL extension is not enabled on this server']);
  exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method, ['GET', 'HEAD', 'POST'], true)) {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$pathInfo = $_SERVER['PATH_INFO'] ?? '';
$endpoint = trim($pathInfo, '/');

if ($endpoint === '') {
  $endpoint = trim((string)($_GET['endpoint'] ?? ''), '/');
}

if ($endpoint === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Missing endpoint. Example: /api/woo.php/products']);
  exit;
}

if (str_contains_compat($endpoint, '..')) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid endpoint']);
  exit;
}

$query = $_GET;
unset($query['endpoint']);

$target = rtrim($wcBaseUrl, '/') . '/wp-json/wc/v3/' . $endpoint;
if (!empty($query)) {
  $target .= (str_contains_compat($target, '?') ? '&' : '?') . http_build_query($query);
}

$ch = curl_init($target);
if ($ch === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to initialize proxy request']);
  exit;
}

$body = file_get_contents('php://input');
$headers = [
  'Accept: application/json',
  'Content-Type: application/json',
];

curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HEADER => true,
  CURLOPT_TIMEOUT => 20,
  CURLOPT_CUSTOMREQUEST => $method,
  CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
  CURLOPT_USERPWD => $wcConsumerKey . ':' . $wcConsumerSecret,
  CURLOPT_HTTPHEADER => $headers,
]);

if ($method !== 'GET' && $method !== 'HEAD' && $body !== false && $body !== '') {
  curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$response = curl_exec($ch);
if ($response === false) {
  http_response_code(502);
  echo json_encode(['error' => 'Upstream request failed', 'detail' => curl_error($ch)]);
  curl_close($ch);
  exit;
}

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE) ?: 500;
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE) ?: 0;
$rawHeaders = substr($response, 0, $headerSize);
$responseBody = substr($response, $headerSize);
curl_close($ch);

$contentType = 'application/json; charset=utf-8';
foreach (explode("\r\n", (string)$rawHeaders) as $line) {
  if (stripos($line, 'Content-Type:') === 0) {
    $contentType = trim(substr($line, strlen('Content-Type:')));
    break;
  }
}

http_response_code($status);
header('Content-Type: ' . $contentType);
echo $responseBody;
