<?php
// WooCommerce Store API proxy for static frontends on shared hosting.
// Proxies /api/store.php/* -> {WC_BASE_URL}/wp-json/wc/store/v1/*

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function str_contains_compat(string $haystack, string $needle): bool {
  return $needle === '' || strpos($haystack, $needle) !== false;
}

const WC_BASE_URL_FALLBACK = 'https://checkout.roohperfumes.net';

$wcBaseUrl = trim((string)(getenv('WC_BASE_URL') ?: WC_BASE_URL_FALLBACK));
if ($wcBaseUrl === '') {
  http_response_code(500);
  echo json_encode(['error' => 'Proxy not configured. Set WC_BASE_URL in api/store.php']);
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
  echo json_encode(['error' => 'Missing endpoint. Example: /api/store.php/cart']);
  exit;
}

if (str_contains_compat($endpoint, '..')) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid endpoint']);
  exit;
}

$query = $_GET;
unset($query['endpoint']);

$target = rtrim($wcBaseUrl, '/') . '/wp-json/wc/store/v1/' . $endpoint;
if (!empty($query)) {
  $target .= (str_contains_compat($target, '?') ? '&' : '?') . http_build_query($query);
}

$ch = curl_init($target);
if ($ch === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to initialize proxy request']);
  exit;
}

$incomingHeaders = function_exists('getallheaders') ? getallheaders() : [];
$normalizedHeaders = [];
foreach ($incomingHeaders as $key => $value) {
  $normalizedHeaders[strtolower((string)$key)] = $value;
}

$forwardHeaders = [
  'Accept: application/json',
  'Content-Type: application/json',
];

if (isset($normalizedHeaders['cart-token']) && is_string($normalizedHeaders['cart-token'])) {
  $forwardHeaders[] = 'Cart-Token: ' . $normalizedHeaders['cart-token'];
}
if (isset($normalizedHeaders['nonce']) && is_string($normalizedHeaders['nonce'])) {
  $forwardHeaders[] = 'Nonce: ' . $normalizedHeaders['nonce'];
}

$body = file_get_contents('php://input');

curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HEADER => true,
  CURLOPT_TIMEOUT => 25,
  CURLOPT_CUSTOMREQUEST => $method,
  CURLOPT_HTTPHEADER => $forwardHeaders,
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
$returnCartToken = null;
$returnNonce = null;

foreach (explode("\r\n", (string)$rawHeaders) as $line) {
  if (stripos($line, 'Content-Type:') === 0) {
    $contentType = trim(substr($line, strlen('Content-Type:')));
  }
  if (stripos($line, 'Cart-Token:') === 0) {
    $returnCartToken = trim(substr($line, strlen('Cart-Token:')));
  }
  if (stripos($line, 'Nonce:') === 0) {
    $returnNonce = trim(substr($line, strlen('Nonce:')));
  }
}

http_response_code($status);
header('Content-Type: ' . $contentType);
if (!empty($returnCartToken)) {
  header('Cart-Token: ' . $returnCartToken);
}
if (!empty($returnNonce)) {
  header('Nonce: ' . $returnNonce);
}

echo $responseBody;
