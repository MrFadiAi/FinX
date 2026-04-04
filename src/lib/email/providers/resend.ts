import { Resend } from "resend";
import type { EmailProvider, SendParams, SendResult } from "./types.js";

const FROM = process.env.EMAIL_FROM || "findx@example.com";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export function createResendProvider(): EmailProvider {
  return {
    name: "resend",

    isConfigured(): boolean {
      return !!process.env.RESEND_API_KEY;
    },

    async send({ to, subject, html }: SendParams): Promise<SendResult> {
      const client = getResend();

      if (!client) {
        console.warn(
          "[Email] RESEND_API_KEY not configured — email sending is disabled. " +
            `Simulated send to=${to} subject="${subject}"`,
        );
        return {
          id: `simulated_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          from: FROM,
          to,
          simulated: true,
        };
      }

      const result = await client.emails.send({
        from: FROM,
        to,
        subject,
        html,
      });

      return {
        id: result.data?.id ?? "unknown",
        from: FROM,
        to,
      };
    },
  };
}
