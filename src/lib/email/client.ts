import { createResendProvider } from "./providers/resend.js";
import { createGmailProvider } from "./providers/gmail.js";
import { getStoredTokens } from "./gmail-oauth.js";
import type { EmailProvider, SendResult } from "./providers/types.js";

const FROM = process.env.EMAIL_FROM || "findx@example.com";

let _cachedProvider: EmailProvider | null = null;

async function getActiveProvider(): Promise<EmailProvider> {
  if (_cachedProvider) return _cachedProvider;

  // If Gmail OAuth credentials are configured AND tokens exist, use Gmail
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const tokens = await getStoredTokens();
    if (tokens) {
      _cachedProvider = createGmailProvider();
      return _cachedProvider;
    }
  }

  // Explicit provider choice via env var
  if (process.env.EMAIL_PROVIDER === "gmail") {
    _cachedProvider = createGmailProvider();
    return _cachedProvider;
  }

  // Default: Resend
  _cachedProvider = createResendProvider();
  return _cachedProvider;
}

/** Clear the cached provider (call after connect/disconnect Gmail) */
export function resetProviderCache(): void {
  _cachedProvider = null;
}

/**
 * Check whether email sending is configured.
 */
export async function isEmailConfigured(): Promise<boolean> {
  const provider = await getActiveProvider();
  return provider.isConfigured();
}

export interface SendEmailResult {
  id: string;
  from: string;
  to: string;
  /** True when the provider was not configured and the email was simulated */
  simulated?: boolean;
}

/**
 * Send an email via the active provider (Gmail or Resend).
 *
 * If the provider is not configured the call is **not** an error — instead
 * the function logs a warning and returns a mock success response so callers
 * can continue their workflow (e.g. saving the outreach as "saved" rather than
 * failing outright).
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<SendEmailResult> {
  const provider = await getActiveProvider();
  const result: SendResult = await provider.send({ to, subject, html });
  return result;
}
