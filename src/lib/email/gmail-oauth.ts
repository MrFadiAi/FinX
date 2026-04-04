import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import { prisma } from "../../lib/db/client.js";

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const REDIRECT_PATH = "/api/email/gmail/callback";

function getRedirectUri(): string {
  const port = process.env.PORT || "3001";
  const host = process.env.API_BASE_URL || `http://127.0.0.1:${port}`;
  return `${host}${REDIRECT_PATH}`;
}

export function getOAuthClient(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
  }
  return new google.auth.OAuth2(clientId, clientSecret, getRedirectUri());
}

export function getAuthorizationUrl(state: string): string {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function getStoredTokens() {
  return prisma.emailProviderToken.findUnique({ where: { provider: "gmail" } });
}

export async function saveTokens(tokens: {
  access_token?: string | null;
  refresh_token?: string | null;
  scope?: string | null;
  token_type?: string | null;
  expiry_date?: number | null;
  email?: string;
}) {
  return prisma.emailProviderToken.upsert({
    where: { provider: "gmail" },
    update: {
      accessToken: tokens.access_token ?? "",
      refreshToken: tokens.refresh_token ?? "",
      scope: tokens.scope ?? "",
      tokenType: tokens.token_type ?? "Bearer",
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      ...(tokens.email ? { email: tokens.email } : {}),
    },
    create: {
      provider: "gmail",
      accessToken: tokens.access_token ?? "",
      refreshToken: tokens.refresh_token ?? "",
      scope: tokens.scope ?? "",
      tokenType: tokens.token_type ?? "Bearer",
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      email: tokens.email,
    },
  });
}

export async function deleteTokens() {
  return prisma.emailProviderToken.deleteMany({ where: { provider: "gmail" } });
}

export async function getAuthenticatedClient(): Promise<OAuth2Client | null> {
  const stored = await getStoredTokens();
  if (!stored) return null;

  const client = getOAuthClient();
  client.setCredentials({
    access_token: stored.accessToken,
    refresh_token: stored.refreshToken,
    scope: stored.scope,
    token_type: stored.tokenType,
    expiry_date: stored.expiryDate?.getTime(),
  });

  // Persist refreshed tokens automatically
  client.on("tokens", async (newTokens) => {
    await saveTokens({
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token,
      scope: newTokens.scope,
      token_type: newTokens.token_type,
      expiry_date: newTokens.expiry_date,
    });
  });

  return client;
}

export async function getGmailProfile(client: OAuth2Client): Promise<string> {
  const gmail = google.gmail({ version: "v1", auth: client });
  const res = await gmail.users.getProfile({ userId: "me" });
  return res.data.emailAddress ?? "unknown";
}
