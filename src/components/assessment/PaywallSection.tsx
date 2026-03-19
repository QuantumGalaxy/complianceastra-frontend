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
      className="flex justify-center px-4"
      aria-labelledby="paywall-heading"
    >
      <div
        id="paywall-card"
        className="w-full max-w-[680px] rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 overflow-hidden"
      >
        <div className="mx-auto max-w-[520px] px-8 py-8 md:px-10 md:py-10">
          {/* Title section */}
          <div>
            <h2
              id="paywall-heading"
              className="text-2xl font-bold text-slate-900"
            >
              Unlock your compliance plan
            </h2>
          </div>

          <hr className="my-6 border-slate-200" aria-hidden />

          {/* Price section */}
          <div>
            <p className="text-4xl font-bold tracking-tight text-slate-900">$99</p>
            <p className="mt-1 text-sm text-slate-500">One-time payment</p>
          </div>

          <hr className="my-6 border-slate-200" aria-hidden />

          {/* Benefits section */}
          <div>
            <ul className="space-y-4">
              {BENEFITS.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="my-6 border-slate-200" aria-hidden />

          {/* Input section */}
          <div className="space-y-3">
            <Input
              id="paywall-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="h-11 w-full rounded-lg border-slate-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
            <p className="text-sm text-slate-500">
              We&apos;ll create your account and save your progress automatically.
            </p>
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href={loginHref}
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                Log in
              </Link>
            </p>
          </div>

          <hr className="my-6 border-slate-200" aria-hidden />

          {/* CTA section */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md shadow-emerald-500/20"
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
            <p className="text-sm text-slate-500 text-center">
              One-time payment. No subscription.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
