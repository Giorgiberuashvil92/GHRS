"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { resetPassword } from "../../config/api";
import { useI18n } from "../../context/I18nContext";

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  const validToken = /^[a-f0-9]{64}$/.test(token);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError(t("auth.reset_mismatch"));
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      window.history.replaceState(null, "", window.location.pathname);
    } catch (cause) {
      setError(t(cause instanceof Error && cause.message.startsWith("HTTP 400:")
        ? "auth.reset_invalid_link" : "auth.reset_save_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7FE] flex items-center justify-center p-5 text-[#3D334A]">
      <div className="w-full max-w-md rounded-3xl bg-white p-8">
        <h1 className="text-2xl font-bold mb-6">{t("auth.reset_title")}</h1>
        {success ? <p role="status">{t("auth.reset_success")}</p> : !validToken ? (
          <p role="alert">{t("auth.reset_invalid_link")}</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <label htmlFor="new-password">{t("auth.reset_new_password")}</label>
            <input id="new-password" type="password" autoComplete="new-password" required minLength={8} maxLength={72}
              value={password} onChange={e => setPassword(e.target.value)} disabled={loading}
              className="border rounded-lg p-3" />
            <p className="text-sm">{t("auth.reset_password_length")}</p>
            <label htmlFor="confirm-password">{t("auth.reset_confirm_password")}</label>
            <input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} maxLength={72}
              value={confirmation} onChange={e => setConfirmation(e.target.value)} disabled={loading}
              className="border rounded-lg p-3" />
            {error && <p role="alert" className="text-red-600">{error}</p>}
            <button disabled={loading} className="rounded-lg bg-[#D4BAFC] p-3 disabled:opacity-50">
              {loading ? t("auth.please_wait") : t("auth.reset_save")}
            </button>
          </form>
        )}
        <Link href="/auth/login" className="inline-block mt-6 underline">{t("auth.login")}</Link>
      </div>
    </div>
  );
}
