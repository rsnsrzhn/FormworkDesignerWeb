import type { InquiryFields, FieldErrors } from './validation';
export type SiteConfig = {
  inquiriesEnabled: boolean;
  development: boolean;
  operatorName: string;
  operatorAddress: string;
  privacyEmail: string;
  retentionPeriod?: string;
  processors?: string;
  transferDetails?: string;
  policyVersion: string;
  copyrightYear?: number;
};
export async function getSiteConfig(signal: AbortSignal): Promise<SiteConfig> {
  const response = await fetch('/api/site-config', { signal });
  if (!response.ok) throw new Error('Не удалось проверить доступность формы.');
  return response.json();
}
export async function sendInquiry(
  fields: InquiryFields,
  requestId: string,
  policyVersion: string,
  website: string,
  signal?: AbortSignal,
): Promise<{ errors?: FieldErrors; message?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...fields, requestId, policyVersion, website }),
      signal: signal
        ? AbortSignal.any([signal, controller.signal])
        : controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 202 && data.accepted === true) return {};
    if (response.status === 400 && data.errors)
      return {
        errors: Object.fromEntries(
          Object.entries(data.errors).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : String(value),
          ]),
        ),
      };
    return {
      message: data.message || 'Не удалось отправить заявку. Попробуйте позже.',
    };
  } catch {
    return {
      message:
        'Не удалось связаться с сервером. Проверьте соединение и попробуйте снова. Ваши данные остались в форме.',
    };
  } finally {
    clearTimeout(timeout);
  }
}
