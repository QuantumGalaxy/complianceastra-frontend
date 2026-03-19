"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Lock } from "lucide-react";

type PaywallSectionProps = {
  onUnlockClick: () => void;
  email: string;
  onEmailChange: (value: string) => void;
  isLoading?: boolean;
  returnTo?: string;
};

const BENEFITS = [
  "Full SAQ checklist",
  "Progress tracking",
  "Export PDF",
  "Future updates",
];

export function PaywallSection({
  onUnlockClick,
  email,
  onEmailChange,
  isLoading = false,
  returnTo,
}: PaywallSectionProps) {
  const loginHref = returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login";

  return (
    <section
      className="w-full"
      aria-labelledby="paywall-heading"
    >
      <div
        id="paywall-card"
        className="w-full rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 overflow-hidden"
      >
        <div className="mx-auto max-w-[520px] px-6 py-5 md:px-6 md:py-6">
          {/* Title + Price */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="paywall-heading"
              className="text-xl font-bold text-slate-900"
            >
              Unlock your compliance plan
            </h2>
            <div>
              <span className="text-2xl font-bold text-slate-900">$99</span>
              <span className="ml-1.5 text-sm text-slate-500">one-time</span>
            </div>
          </div>

          <hr className="my-4 border-slate-200" aria-hidden />

          {/* Benefits - compact grid */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-slate-700">
            {BENEFITS.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <hr className="my-4 border-slate-200" aria-hidden />

          {/* Input + CTA */}
          <div className="space-y-3">
            <Input
              id="paywall-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="h-10 w-full rounded-lg border-slate-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
            <p className="text-xs text-slate-500">
              We&apos;ll create your account automatically.{" "}
              <Link
                href={loginHref}
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                Already have an account? Log in
              </Link>
            </p>
            <Button
              size="lg"
              className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-500/20"
              onClick={onUnlockClick}
              disabled={isLoading}
            >
              {isLoading ? (
                "Opening…"
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" aria-hidden />
                  Continue to payment – $99
                </>
              )}
            </Button>
            <p className="text-xs text-slate-500">
              One-time payment. No subscription.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
