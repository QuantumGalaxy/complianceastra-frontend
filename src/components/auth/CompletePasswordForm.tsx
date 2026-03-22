"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

type Props = {
  token: string;
  title: string;
  description: string;
};

export function CompletePasswordForm({ token, title, description }: Props) {
  const router = useRouter();
  const { loginWithToken } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.completePassword(token, password);
      await loginWithToken(res.access_token);
      router.replace("/dashboard?report=success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-slate-600">{description}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm" role="alert">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={show ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold"
              disabled={loading}
            >
              {loading ? "Saving…" : "Continue"}
            </Button>
          </form>

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
