import { validateInquiry, normalizePhone } from '../src/lib/validation.js';
import { getSiteConfig, type Environment } from './config.js';
const json = (status: number, body: unknown) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function handleInquiry(
  request: Request,
  env: Environment = process.env,
  deliver: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== 'POST')
    return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  const origin = request.headers.get('origin');
  const allowed = new Set(
    [new URL(request.url).origin, env.PUBLIC_ORIGIN].filter(Boolean),
  );
  if (!origin || !allowed.has(origin))
    return json(403, { message: 'Обновите страницу и попробуйте ещё раз.' });
  if (
    request.headers.get('content-type')?.split(';')[0].trim() !==
    'application/json'
  )
    return json(415, { message: 'Ожидался JSON.' });
  if (Number(request.headers.get('content-length')) > 8192)
    return json(413, { message: 'Слишком большой запрос.' });
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json(400, { message: 'Не удалось прочитать запрос.' });
  }
  if (Buffer.byteLength(raw) > 8192)
    return json(413, { message: 'Слишком большой запрос.' });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body))
      throw new Error();
  } catch {
    return json(400, { message: 'Некорректный запрос.' });
  }
  if (
    [
      'fullName',
      'email',
      'phone',
      'requestId',
      'policyVersion',
      'website',
    ].some((key) => typeof body[key] !== 'string') ||
    typeof body.consent !== 'boolean'
  )
    return json(400, { message: 'Проверьте заполнение формы.' });
  const fields = {
    fullName: String(body.fullName),
    email: String(body.email),
    phone: String(body.phone),
    consent: body.consent as boolean,
  };
  const errors = validateInquiry(fields);
  const config = getSiteConfig(env);
  if (body.policyVersion !== config.policyVersion)
    errors.policyVersion =
      'Условия обновились. Обновите страницу перед отправкой.';
  if (Object.keys(errors).length) return json(400, { errors });
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(body.requestId),
    ) ||
    body.website
  )
    return json(400, { message: 'Не удалось отправить заявку.' });
  if (!config.inquiriesEnabled)
    return json(503, {
      message: 'Отправка заявок пока недоступна. Ваши данные остались в форме.',
    });
  try {
    const response = await deliver('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `inquiry/${body.requestId}`,
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from: env.INQUIRY_FROM,
        to: [env.INQUIRY_TO],
        reply_to: fields.email.trim(),
        subject: 'FormworkDesigner — заявка на сотрудничество',
        text: `Имя: ${fields.fullName.trim()}\nEmail: ${fields.email.trim()}\nТелефон: ${normalizePhone(fields.phone)}\n\nСогласие: ${config.policyVersion}\nИдентификатор: ${body.requestId}`,
      }),
    });
    const result = (await response.json().catch(() => null)) as {
      id?: unknown;
    } | null;
    if (!response.ok || typeof result?.id !== 'string' || !result.id)
      throw new Error('delivery');
    return json(202, {
      accepted: true,
      message: 'Заявка передана. Спасибо за интерес!',
    });
  } catch {
    return json(502, {
      message:
        'Не удалось передать заявку. Попробуйте позже. Ваши данные остались в форме.',
    });
  }
}
