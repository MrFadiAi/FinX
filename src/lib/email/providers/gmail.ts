import { google } from "googleapis";
import type { EmailProvider, SendParams, SendResult } from "./types.js";
import { getAuthenticatedClient } from "../gmail-oauth.js";

const FROM = process.env.EMAIL_FROM || process.env.GMAIL_FROM || "";

function buildRawMime(from: string, to: string, subject: string, html: string): string {
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="utf-8"',
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(html).toString("base64"),
  ];
  return Buffer.from(lines.join("\r\n")).toString("base64url");
}

export function createGmailProvider(): EmailProvider {
  return {
    name: "gmail",

    isConfigured(): boolean {
      return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    },

    async send({ to, subject, html }: SendParams): Promise<SendResult> {
      const client = await getAuthenticatedClient();
      if (!client) {
        console.warn(
          "[Email] Gmail not connected — no OAuth tokens found. " +
            `Simulated send to=${to} subject="${subject}"`,
        );
        return {
          id: `simulated_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          from: FROM || "gmail-not-connected",
          to,
          simulated: true,
        };
      }

      const gmail = google.gmail({ version: "v1", auth: client });
      const from = FROM || (await gmail.users.getProfile({ userId: "me" })).data.emailAddress || "";

      const raw = buildRawMime(from, to, subject, html);
      const res = await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw },
      });

      return {
        id: res.data.id ?? "unknown",
        from,
        to,
      };
    },
  };
}
