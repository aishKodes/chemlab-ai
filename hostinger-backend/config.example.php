<?php

return [
  'app' => [
    'env' => 'production',
    'name' => 'Chemlab',
    'frontend_url' => 'https://www.chemlearning.in',
    'api_url' => 'https://api.chemlearning.in',
  ],
  'database' => [
    'host' => '',
    'name' => '',
    'user' => '',
    'pass' => '',
    'charset' => 'utf8mb4',
  ],
  'security' => [
    'jwt_secret' => 'CHANGE_THIS_TO_LONG_RANDOM_SECRET',
    'jwt_expires_days' => 30,
  ],
  'mail' => [
    'host' => '',
    'port' => 465,
    'secure' => 'ssl',
    'username' => '',
    'password' => '',
    'from_email' => '',
    'from_name' => 'Chemlab',
  ],
  'admin' => [
    'name' => '',
    'email' => '',
    'password' => '',
  ],
  'cors' => [
    'allowed_origins' => [
      'https://www.chemlearning.in',
      'https://chemlearning.in',
      'http://localhost:3000',
    ],
  ],
  'upload' => [
    'max_mb' => 5,
    'allowed_types' => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  ],
  'ai' => [
    'daily_budget_inr' => 50,
  ],
];
