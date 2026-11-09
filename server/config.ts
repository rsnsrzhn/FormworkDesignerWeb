export type Environment = Record<string, string | undefined>;
export function getSiteConfig(env: Environment = process.env) {
  return {
    inquiriesEnabled:
      env.ACCEPT_INQUIRIES === 'true' &&
      Boolean(env.RESEND_API_KEY && env.INQUIRY_FROM && env.INQUIRY_TO),
    copyrightYear: new Date().getUTCFullYear(),
    development: env.NODE_ENV !== 'production',
    operatorName: env.OPERATOR_NAME || '',
    operatorAddress: env.OPERATOR_ADDRESS || '',
    privacyEmail: env.PRIVACY_EMAIL || '',
    policyVersion: env.POLICY_VERSION || '2026-11-09',
  };
}
