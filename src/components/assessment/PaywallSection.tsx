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
        className="w-full rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/60 shadow-xl shadow-slate-200/40 overflow-hidden"
      >
        <div className="mx-auto max-w-[520px] px-6 py-6 md:px-8 md:py-8">
          {/* Title */}
          <h2
            id="paywall-heading"
            className="text-xl font-bold text-slate-900 text-center"
          >
            Unlock your compliance plan
          </h2>

          {/* Price - main visual anchor */}
          <div className="mt-5 text-center">
            <p className="text-3xl font-bold tracking-tight text-slate-900">$99</p>
            <p className="mt-1 text-sm text-slate-500">One-time payment</p>
          </div>

          {/* Benefits */}
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-700">
            {BENEFITS.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Input */}
          <div className="mt-6">
            <Input
              id="paywall-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="h-11 w-full rounded-lg border-slate-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
          </div>

          {/* Helper text */}
          <p className="mt-3 text-sm text-slate-500">
            We&apos;ll create your account and save your progress automatically.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="font-medium text-emerald-600 hover:text-emerald-700"
            >
              Log in
            </Link>
          </p>

          {/* CTA - final action block */}
          <div className="mt-8 space-y-2">
            <Button
              size="lg"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-lg shadow-emerald-500/25"
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
            <p className="text-xs text-slate-500 text-center">
              One-time payment. No subscription.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
