/** Reports variable names and readiness only. Never print configuration values. */
const env = process.env;
const required = [
  'RESEND_API_KEY',
  'INQUIRY_FROM',
  'INQUIRY_TO',
  'OPERATOR_NAME',
  'OPERATOR_ADDRESS',
  'PRIVACY_EMAIL',
  'DATA_RETENTION_PERIOD',
  'DATA_PROCESSORS',
  'DATA_TRANSFER_DETAILS',
];
let failed = false;
if (env.ACCEPT_INQUIRIES === 'true') {
  const missing = required.filter((name) => !env[name]?.trim());
  if (missing.length) {
    console.error('Не заполнены: ' + missing.join(', '));
    failed = true;
  } else
    console.log(
      'Почтовые переменные и данные оператора заполнены. Доставка письма не проверялась.',
    );
} else
  console.log(
    'Приём заявок выключен. Сайт можно просматривать, форма не отправляет письма.',
  );
if (env.SITE_URL) {
  try {
    const url = new URL(env.SITE_URL);
    if (
      url.protocol !== 'https:' ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      url.username ||
      url.password ||
      /localhost|example\.|ваш|your-domain/.test(url.hostname)
    )
      throw Error();
    console.log(
      'SITE_URL: формат production-адреса корректен. DNS и HTTPS не проверялись.',
    );
  } catch {
    console.error(
      'SITE_URL должен содержать настоящий HTTPS origin без пути и параметров.',
    );
    failed = true;
  }
} else
  console.log(
    'SITE_URL не задан: на Vercel используйте production URL system variable либо задайте адрес после первого деплоя.',
  );
console.log(
  'Перед коммерческим запуском проверьте тариф Vercel и правило Firewall для POST /api/inquiries.',
);
process.exitCode = failed ? 1 : 0;
