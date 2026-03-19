"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function LoginContent() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const rawReturn = searchParams.get("returnTo") || "/dashboard";
  const returnTo =
    rawReturn.startsWith("/") && !rawReturn.startsWith("//") ? rawReturn : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      await new Promise((r) => setTimeout(r, 100));
      window.location.href = returnTo;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      {/* Soft gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-sky-50/95 via-emerald-50/60 to-white"
      />
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
      />

      <div className="relative w-full max-w-[420px]">
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-xl shadow-slate-200/50 p-8">
          {/* Branding */}
          <Link
            href="/"
            className="flex items-center gap-2 mb-6"
            aria-label="ComplianceAstra home"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              ComplianceAstra
            </span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-1 text-slate-600">
            Log in to continue your assessment and reports.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div
                className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email"
                className="h-11 rounded-lg border-slate-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <Link
                  href="/contact"
                  className="text-xs text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-11 rounded-lg border-slate-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-500/25 focus-visible:ring-emerald-500/20"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-slate-600">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
