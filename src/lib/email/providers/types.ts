export interface SendParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendResult {
  id: string;
  from: string;
  to: string;
  simulated?: boolean;
}

export interface EmailProvider {
  name: "resend" | "gmail";
  isConfigured(): boolean;
  send(params: SendParams): Promise<SendResult>;
}
