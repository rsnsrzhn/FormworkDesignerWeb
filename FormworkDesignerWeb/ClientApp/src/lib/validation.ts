export type InquiryFields = {
  fullName: string;
  email: string;
  phone: string;
  consent: boolean;
};
export type FieldErrors = Partial<
  Record<keyof InquiryFields | "policyVersion", string>
>;
export function normalizePhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8"))
    digits = "7" + digits.slice(1);
  return "+" + digits;
}
export function validateInquiry(fields: InquiryFields): FieldErrors {
  const errors: FieldErrors = {};
  const name = fields.fullName.trim();
  if (name.length < 2 || name.length > 200 || /[\x00-\x1f\x7f]/.test(name))
    errors.fullName = "Укажите имя и фамилию, от 2 до 200 символов.";
  if (
    fields.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())
  )
    errors.email = "Укажите корректный email.";
  if (
    fields.phone.length > 40 ||
    !/^[+\d\s()\-]+$/.test(fields.phone) ||
    !/^(\+7[3489]\d{9}|\+375(?:1[5-7]|2[1-5]|29|33|44)\d{7})$/.test(
      normalizePhone(fields.phone)
    )
  )
    errors.phone = "Укажите номер России (+7) или Беларуси (+375).";
  if (!fields.consent)
    errors.consent = "Необходимо согласие на обработку персональных данных.";
  return errors;
}
