import { useEffect, useRef, useState } from 'react';
import { Link } from '../components/Link';
import { Icon } from '../components/Icon';
import { sendInquiry, type SiteConfig } from '../lib/api';
import {
  validateInquiry,
  type InquiryFields,
  type FieldErrors,
} from '../lib/validation';
export function Contact({
  config,
  retryConfig,
}: {
  config: SiteConfig | null;
  retryConfig: () => void;
}) {
  const [fields, setFields] = useState<InquiryFields>({
    fullName: '',
    email: '',
    phone: '',
    consent: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const requestId = useRef('');
  const delivery = useRef<AbortController | null>(null);
  useEffect(() => () => delivery.current?.abort(), []);
  const honeypot = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (success) successRef.current?.focus();
  }, [success]);
  const ready = config?.inquiriesEnabled === true;
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    const validation = validateInquiry(fields);
    if (!requestId.current) requestId.current = crypto.randomUUID();
    setErrors(validation);
    setMessage('');
    if (Object.keys(validation).length) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    if (!ready || !config) {
      setMessage('Отправка заявок пока недоступна. Пожалуйста, зайдите позже.');
      return;
    }
    setBusy(true);
    const controller = new AbortController();
    delivery.current = controller;
    const result = await sendInquiry(
      fields,
      requestId.current,
      config.policyVersion,
      honeypot.current?.value || '',
      controller.signal,
    );
    if (controller.signal.aborted) return;
    delivery.current = null;
    setBusy(false);
    if (result.errors) {
      setErrors(result.errors);
      setMessage(result.errors.policyVersion || 'Проверьте отмеченные поля.');
    } else if (result.message) setMessage(result.message);
    else {
      setSuccess(true);
      setFields({ fullName: '', email: '', phone: '', consent: false });
    }
  }
  function update(key: keyof InquiryFields, value: string | boolean) {
    requestId.current = crypto.randomUUID();
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }
  return (
    <section className="container contact-page">
      <div className="contact-intro">
        <span className="eyebrow">Давайте познакомимся</span>
        <h1>
          Обсудим
          <br />
          <span>ваш проект.</span>
        </h1>
        <p>
          Оставьте контакты, чтобы запросить демоверсию. Обсудим приобретение
          FormworkDesigner и доработки под ваши задачи.
        </p>
        <div className="contact-context">
          <h2>Начнём с вашей задачи</h2>
          <p>
            Знакомство с программой, приобретение или доработка рабочего
            процесса — обсудим то, что нужно вашей команде.
          </p>
          <Link className="text-link" href="/#in-action">
            Посмотреть программу в работе <Icon name="arrow" size={18} />
          </Link>
        </div>
      </div>
      <div className="form-card" id="inquiry-form">
        {success ? (
          <div className="success-panel" tabIndex={-1} ref={successRef}>
            <span className="eyebrow">Спасибо за интерес</span>
            <h2>Заявка принята.</h2>
            <p>
              Заявка передана для ответа по указанным контактам. Обсудим
              сотрудничество.
            </p>
            <Link className="button" href="/">
              На главную <Icon name="arrow" />
            </Link>
          </div>
        ) : (
          <>
            <div className="form-heading">
              <h2>Оставьте контакты</h2>
              <p>Свяжемся с вами, чтобы обсудить программу и ваши вопросы.</p>
            </div>
            {!config && (
              <div className="form-notice" role="status">
                Не удалось проверить доступность формы.{' '}
                <button className="inline-button" onClick={retryConfig}>
                  Проверить снова
                </button>
              </div>
            )}
            <form ref={formRef} onSubmit={submit} noValidate aria-busy={busy}>
              {(
                [
                  {
                    key: 'fullName',
                    label: 'ФИО',
                    type: 'text',
                    autocomplete: 'name',
                    placeholder: 'Иван Иванов',
                    max: 200,
                  },
                  {
                    key: 'email',
                    label: 'Электронная почта',
                    type: 'email',
                    autocomplete: 'email',
                    placeholder: 'name@company.ru',
                    max: 254,
                  },
                  {
                    key: 'phone',
                    label: 'Телефон',
                    type: 'tel',
                    autocomplete: 'tel',
                    placeholder: '+375 29 123-45-67',
                    max: 40,
                  },
                ] as const
              ).map(({ key, label, type, autocomplete, placeholder, max }) => (
                <div className="form-field" key={key}>
                  <label htmlFor={key}>
                    {label}
                    <span aria-hidden="true"> *</span>
                  </label>
                  <input
                    id={key}
                    name={key}
                    type={type}
                    autoComplete={autocomplete}
                    maxLength={max}
                    value={fields[key]}
                    required
                    placeholder={placeholder}
                    aria-invalid={!!errors[key]}
                    aria-describedby={
                      errors[key]
                        ? `${key}-error`
                        : key === 'phone'
                          ? 'phone-hint'
                          : undefined
                    }
                    disabled={busy}
                    onChange={(event) => update(key, event.target.value)}
                  />
                  {errors[key] ? (
                    <span className="field-error" id={`${key}-error`}>
                      {errors[key]}
                    </span>
                  ) : key === 'phone' ? (
                    <span id="phone-hint" className="field-hint">
                      Россия (+7) или Беларусь (+375)
                    </span>
                  ) : null}
                </div>
              ))}
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="website">Сайт</label>
                <input
                  ref={honeypot}
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="consent-field">
                <label>
                  <input
                    name="consent"
                    type="checkbox"
                    checked={fields.consent}
                    required
                    disabled={busy}
                    aria-invalid={!!errors.consent}
                    aria-describedby={
                      errors.consent ? 'consent-error' : undefined
                    }
                    onChange={(event) =>
                      update('consent', event.target.checked)
                    }
                  />
                  <span>
                    Я даю{' '}
                    <Link href="/consent" target="_blank" rel="noopener">
                      согласие на обработку персональных данных
                    </Link>{' '}
                    для рассмотрения заявки и ознакомлен(а) с{' '}
                    <Link href="/privacy" target="_blank" rel="noopener">
                      политикой конфиденциальности
                    </Link>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <span className="field-error" id="consent-error">
                    {errors.consent}
                  </span>
                )}
              </div>
              {message && (
                <p className="form-error" role="alert">
                  {message}
                </p>
              )}
              <button
                className="button submit-button"
                type="submit"
                disabled={busy}
              >
                {busy ? 'Отправляем заявку…' : 'Отправить заявку'}
                <Icon name="arrow" size={19} />
              </button>
              <p className="form-footnote">
                Только для обсуждения вашей заявки. Без рекламной подписки.
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
