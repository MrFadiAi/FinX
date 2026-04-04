"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, AlertTriangle, Loader2, CheckCircle2, Mail, Unplug } from "lucide-react";
import { clearAllData, getEmailProviderStatus, getGmailConnectUrl, disconnectGmail } from "../../lib/api";
import type { EmailProviderStatus } from "../../lib/types";

export default function SettingsPage() {
  const [confirming, setConfirming] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [result, setResult] = useState<{
    deleted: {
      leads: number;
      analyses: number;
      outreaches: number;
      agentLogs: number;
      pipelineRuns: number;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Email provider state
  const [providerStatus, setProviderStatus] = useState<EmailProviderStatus | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);

  const loadProviderStatus = useCallback(async () => {
    try {
      const status = await getEmailProviderStatus();
      setProviderStatus(status);
      setProviderError(null);
    } catch {
      // Provider status endpoint might not be available yet
    }
  }, []);

  useEffect(() => {
    loadProviderStatus();
  }, [loadProviderStatus]);

  async function handleConnectGmail() {
    setConnecting(true);
    setProviderError(null);
    try {
      const { url } = await getGmailConnectUrl();
      const popup = window.open(url, "gmail-auth", "width=500,height=600");
      if (!popup) {
        setProviderError("Popup blocked. Please allow popups for this site.");
        return;
      }
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          loadProviderStatus();
        }
      }, 500);
    } catch (err) {
      setProviderError(err instanceof Error ? err.message : "Failed to connect Gmail");
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnectGmail() {
    setDisconnecting(true);
    setProviderError(null);
    try {
      await disconnectGmail();
      await loadProviderStatus();
    } catch (err) {
      setProviderError(err instanceof Error ? err.message : "Failed to disconnect Gmail");
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleClearAll() {
    setClearing(true);
    setError(null);
    try {
      const res = await clearAllData();
      setResult(res);
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear data");
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Settings</h2>
        <p className="text-sm text-slate-400">
          Configure API endpoints and manage data.
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-400">
            API Base URL
          </label>
          <input
            type="text"
            defaultValue="http://127.0.0.1:3001"
            className="px-3 py-2 border border-slate-700 rounded-lg text-sm w-full bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-400">
            Redis URL
          </label>
          <input
            type="text"
            defaultValue="redis://127.0.0.1:6379"
            className="px-3 py-2 border border-slate-700 rounded-lg text-sm w-full bg-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Email Provider */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-200">Email Provider</h3>
        </div>

        {providerStatus ? (
          <div className="space-y-3">
            {/* Active provider info */}
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div>
                <p className="text-sm text-slate-300">
                  Active provider:{" "}
                  <span className="font-medium text-slate-100 capitalize">
                    {providerStatus.provider === "none" ? "Not configured" : providerStatus.provider}
                  </span>
                </p>
                {providerStatus.email && (
                  <p className="text-xs text-slate-400 mt-0.5">{providerStatus.email}</p>
                )}
              </div>
              {providerStatus.connected && (
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-900/40 text-emerald-400 rounded-full">
                  Connected
                </span>
              )}
            </div>

            {/* Gmail section */}
            <div className="p-3 bg-slate-800/50 rounded-lg space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gmail</p>

              {providerStatus.provider === "gmail" && providerStatus.connected ? (
                // Connected state
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-slate-300">
                      Connected as <span className="text-slate-100">{providerStatus.email}</span>
                    </span>
                  </div>
                  <button
                    onClick={handleDisconnectGmail}
                    disabled={disconnecting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-800/50 rounded-lg hover:bg-red-900/30 disabled:opacity-50 transition-colors"
                  >
                    {disconnecting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Unplug className="w-3 h-3" />
                    )}
                    Disconnect
                  </button>
                </div>
              ) : providerStatus.provider === "gmail" && !providerStatus.connected ? (
                // Credentials set but not connected
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    Gmail credentials detected. Connect your account to send emails.
                  </p>
                  <button
                    onClick={handleConnectGmail}
                    disabled={connecting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {connecting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    {connecting ? "Connecting..." : "Connect Gmail"}
                  </button>
                </div>
              ) : (
                // Not configured
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    To use Gmail, set these environment variables:
                  </p>
                  <div className="text-xs font-mono text-slate-500 bg-slate-900 p-2 rounded space-y-1">
                    <p>GOOGLE_CLIENT_ID=your-client-id</p>
                    <p>GOOGLE_CLIENT_SECRET=your-client-secret</p>
                    <p className="text-slate-600 pt-1">
                      # Optional: override the from address
                    </p>
                    <p>GMAIL_FROM=you@gmail.com</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    Create credentials at{" "}
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Google Cloud Console
                    </a>
                    . Enable the Gmail API and add this redirect URI:{" "}
                    <code className="text-slate-400">http://127.0.0.1:3001/api/email/gmail/callback</code>
                  </p>
                </div>
              )}
            </div>

            {/* Resend info */}
            {providerStatus.provider === "resend" && (
              <div className="p-3 bg-slate-800/50 rounded-lg space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Resend</p>
                <p className="text-xs text-slate-400">
                  Using Resend with <span className="text-slate-300">{providerStatus.email || "default address"}</span>.
                  Set <code className="text-slate-500">GOOGLE_CLIENT_ID</code> to switch to Gmail.
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Loading email provider status...</p>
        )}

        {providerError && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {providerError}
          </p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900 rounded-xl border border-red-900/40 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
        </div>
        <p className="text-xs text-slate-400">
          Permanently delete all leads, analyses, outreach emails, agent logs,
          and pipeline runs. This cannot be undone. Agent configurations are
          preserved.
        </p>

        {confirming ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">
                Are you sure? All data will be permanently deleted.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {clearing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {clearing ? "Clearing..." : "Yes, delete everything"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={clearing}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setConfirming(true);
              setResult(null);
              setError(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/30 text-red-400 border border-red-800/50 rounded-lg text-sm font-medium hover:bg-red-900/50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </button>
        )}

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        {result && (
          <div className="p-3 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                Data cleared successfully
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span>
                {result.deleted.leads} leads
              </span>
              <span>
                {result.deleted.analyses} analyses
              </span>
              <span>
                {result.deleted.outreaches} outreaches
              </span>
              <span>
                {result.deleted.agentLogs} logs
              </span>
              <span>
                {result.deleted.pipelineRuns} runs
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
