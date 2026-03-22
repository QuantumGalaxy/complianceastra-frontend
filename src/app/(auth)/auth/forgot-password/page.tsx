"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { ShieldCheck } from "lucide-react";

function ForgotPasswordInner() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-sky-50/95 via-emerald-50/60 to-white"
      />
      <div className="relative w-full max-w-[420px]">
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-xl p-8">
          <Link href="/" className="flex items-center gap-2 mb-6" aria-label="ComplianceAstra home">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">ComplianceAstra</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Forgot password</h1>
          <p className="mt-1 text-slate-600">
            Enter your email and we&apos;ll send you a link to set a new password or finish account setup.
          </p>

          {sent ? (
            <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-sm">
              If an account exists for that address, we sent an email with next steps. Check your inbox and spam
              folder.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm" role="alert">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold"
                disabled={loading}
              >
                {loading ? "Sending…" : "Send link"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            <Link href="/login" className="text-emerald-600 font-medium hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Loading…</div>}>
      <ForgotPasswordInner />
    </Suspense>
  );
}
